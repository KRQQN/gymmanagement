import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { MembershipType, MembershipStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session ID provided" },
        { status: 400 }
      );
    }

    // Get the Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!stripeSession.customer) {
      return NextResponse.json(
        { error: "No customer found in session" },
        { status: 400 }
      );
    }

    // Get the plan ID from the session metadata
    const planId = stripeSession.metadata?.planId;
    if (!planId) {
      return NextResponse.json(
        { error: "No plan ID found in session" },
        { status: 400 }
      );
    }

    // Get the plan
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Ensure the user exists in our database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email!,
          name: session.user.name || "",
          role: "MEMBER",
          gymId: "1", // Default gym ID, you might want to make this configurable
        },
      });
    }

    // Calculate membership dates and determine type based on plan name
    const startDate = new Date();
    let endDate = new Date();
    let membershipType: MembershipType;

    // Map plan names to membership types
    if (plan.name.toLowerCase().includes('day')) {
      endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
      membershipType = MembershipType.ONE_DAY;
    } else if (plan.name.toLowerCase().includes('week')) {
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
      membershipType = MembershipType.ONE_WEEK;
    } else if (plan.name.toLowerCase().includes('month')) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      membershipType = MembershipType.ONE_MONTH;
    } else if (plan.name.toLowerCase().includes('6-month') || plan.name.toLowerCase().includes('six month')) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);
      membershipType = MembershipType.SIX_MONTHS;
    } else if (plan.name.toLowerCase().includes('annual') || plan.name.toLowerCase().includes('year')) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      membershipType = MembershipType.ANNUAL;
    } else {
      // Default to one month if no match
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      membershipType = MembershipType.ONE_MONTH;
    }

    // Get the subscription and customer IDs
    const subscriptionId = typeof stripeSession.subscription === 'string' 
      ? stripeSession.subscription 
      : stripeSession.subscription?.id;
    
    const customerId = typeof stripeSession.customer === 'string'
      ? stripeSession.customer
      : stripeSession.customer?.id;

    if (!subscriptionId || !customerId) {
      return NextResponse.json(
        { error: "Invalid subscription or customer data" },
        { status: 400 }
      );
    }

    // Create or update the membership
    const membership = await prisma.membership.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        planId: plan.id,
        type: membershipType,
        status: MembershipStatus.ACTIVE,
        startDate,
        endDate,
        price: plan.price,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
      },
      update: {
        planId: plan.id,
        type: membershipType,
        status: MembershipStatus.ACTIVE,
        startDate,
        endDate,
        price: plan.price,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
      },
    });

    return NextResponse.json({ success: true, membership });
  } catch (error) {
    console.error("[PROCESS_SUBSCRIPTION] Error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 