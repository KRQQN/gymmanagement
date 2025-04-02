import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MembershipType, MembershipStatus } from "@prisma/client";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId, sessionId } = await req.json();

    if (sessionId) {
      // Handle Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (checkoutSession.payment_status !== "paid") {
        return NextResponse.json(
          { message: "Payment not completed" },
          { status: 400 }
        );
      }

      const planId = checkoutSession.metadata?.planId;
      if (!planId) {
        return NextResponse.json(
          { message: "Plan ID not found in session" },
          { status: 400 }
        );
      }

      const plan = await prisma.membershipPlan.findUnique({
        where: {
          id: planId,
        },
      });

      if (!plan) {
        return NextResponse.json(
          { message: "Plan not found" },
          { status: 404 }
        );
      }

      // Create or update membership
      const membershipType = planId.toUpperCase() as MembershipType;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month membership

      const existingMembership = await prisma.membership.findFirst({
        where: {
          userId: session.user.id,
        },
      });

      let membership;
      if (existingMembership) {
        membership = await prisma.membership.update({
          where: {
            id: existingMembership.id,
          },
          data: {
            type: membershipType,
            status: MembershipStatus.ACTIVE,
            startDate,
            endDate,
            price: plan.price,
            planId: plan.id,
          },
        });
      } else {
        membership = await prisma.membership.create({
          data: {
            userId: session.user.id,
            type: membershipType,
            status: MembershipStatus.ACTIVE,
            startDate,
            endDate,
            price: plan.price,
            planId: plan.id,
          },
        });
      }

      // Create payment record
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          amount: plan.price,
          status: "COMPLETED",
          paymentMethod: "ONLINE",
          stripeSessionId: sessionId,
          gymId: session.user.gymId,
        },
      });

      return NextResponse.json({
        message: "Subscription successful",
        membership,
      });
    } else if (planId) {
      // Handle direct subscription (for testing/development)
      const plan = await prisma.membershipPlan.findUnique({
        where: {
          id: planId,
        },
      });

      if (!plan) {
        return NextResponse.json(
          { message: "Plan not found" },
          { status: 404 }
        );
      }

      const membershipType = planId.toUpperCase() as MembershipType;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const existingMembership = await prisma.membership.findFirst({
        where: {
          userId: session.user.id,
        },
      });

      let membership;
      if (existingMembership) {
        membership = await prisma.membership.update({
          where: {
            id: existingMembership.id,
          },
          data: {
            type: membershipType,
            status: MembershipStatus.ACTIVE,
            startDate,
            endDate,
            price: plan.price,
            planId: plan.id,
          },
        });
      } else {
        membership = await prisma.membership.create({
          data: {
            userId: session.user.id,
            type: membershipType,
            status: MembershipStatus.ACTIVE,
            startDate,
            endDate,
            price: plan.price,
            planId: plan.id,
          },
        });
      }

      return NextResponse.json({
        message: "Subscription successful",
        membership,
      });
    } else {
      return NextResponse.json(
        { message: "Plan ID or session ID is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { message: "Error subscribing to membership" },
      { status: 500 }
    );
  }
} 