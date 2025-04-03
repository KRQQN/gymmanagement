import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { MembershipType } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await req.json();
    console.log("Processing session ID:", sessionId);

    // Retrieve the Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "subscription", "line_items"],
    });

    console.log("Stripe session:", JSON.stringify(stripeSession, null, 2));

    if (!stripeSession || stripeSession.status !== "complete") {
      return NextResponse.json(
        { message: "Invalid or incomplete session" },
        { status: 400 }
      );
    }

    // Get the subscription from the session
    const subscription = stripeSession.subscription;
    console.log("Subscription:", JSON.stringify(subscription, null, 2));

    if (!subscription || typeof subscription === 'string') {
      return NextResponse.json(
        { message: "No subscription found in session" },
        { status: 400 }
      );
    }

    // Get the customer from the subscription
    const customerId = subscription.customer;
    console.log("Customer ID:", customerId);

    if (!customerId) {
      return NextResponse.json(
        { message: "No customer found in subscription" },
        { status: 400 }
      );
    }

    const customer = typeof customerId === 'string'
      ? await stripe.customers.retrieve(customerId)
      : customerId;

    // Get the membership plan from the metadata
    const planId = stripeSession.metadata?.planId;
    console.log("Plan ID from metadata:", planId);

    if (!planId) {
      return NextResponse.json(
        { message: "No plan ID provided" },
        { status: 400 }
      );
    }

    // Get the membership plan
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Invalid plan" },
        { status: 400 }
      );
    }

    // Calculate start and end dates based on the plan name
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
      // Properly handle month boundaries
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      // If the day of the month has changed, it means we've gone to a month with fewer days
      // In this case, we want the last day of the previous month
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0); // Set to last day of previous month
      }
      membershipType = MembershipType.ONE_MONTH;
    } else if (plan.name.toLowerCase().includes('6-month') || plan.name.toLowerCase().includes('six month')) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0);
      }
      membershipType = MembershipType.SIX_MONTHS;
    } else if (plan.name.toLowerCase().includes('annual') || plan.name.toLowerCase().includes('year')) {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0);
      }
      membershipType = MembershipType.ANNUAL;
    } else {
      // Default to one month if no match
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      if (endDate.getDate() !== startDate.getDate()) {
        endDate.setDate(0);
      }
      membershipType = MembershipType.ONE_MONTH;
    }

    // Create or update the membership
    const membership = await prisma.membership.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        type: membershipType,
        status: "ACTIVE",
        startDate,
        endDate,
        planId,
        price: plan.price,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
      },
      create: {
        userId: session.user.id,
        type: membershipType,
        planId,
        status: "ACTIVE",
        startDate,
        endDate,
        price: plan.price,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
      },
    });

    // Create a payment record
    await prisma.payment.create({
      data: {
        user: {
          connect: {
            id: session.user.id
          }
        },
        gym: {
          connect: {
            id: plan.gymId
          }
        },
        amount: subscription.items.data[0].price.unit_amount! / 100,
        status: "COMPLETED",
        paymentMethod: "ONLINE",
        stripePaymentIntentId: stripeSession.payment_intent as string,
        stripeSubscriptionId: subscription.id,
      },
    });

    return NextResponse.json({ success: true, membership });
  } catch (error) {
    console.error("[PROCESS_SUBSCRIPTION]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 