import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MembershipType, MembershipStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { message: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Get the selected plan
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

    // Check if user already has an active membership
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        status: MembershipStatus.ACTIVE,
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "You already have an active membership" },
        { status: 400 }
      );
    }

    // Create new membership
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month membership

    const membership = await prisma.membership.create({
      data: {
        userId: session.user.id,
        type: MembershipType.BASIC,
        startDate,
        endDate,
        status: MembershipStatus.ACTIVE,
        price: plan.price,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: plan.price,
        status: PaymentStatus.COMPLETED,
        paymentMethod: PaymentMethod.ONLINE,
      },
    });

    return NextResponse.json({
      message: "Successfully subscribed to membership plan",
      membership: {
        id: membership.id,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
      },
    });
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    return NextResponse.json(
      { message: "Error subscribing to plan" },
      { status: 500 }
    );
  }
} 