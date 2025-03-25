import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MembershipType, MembershipStatus } from "@prisma/client";

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

    // Map plan ID to membership type
    const membershipType = planId.toUpperCase() as MembershipType;

    // Check if user already has a membership
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month membership

    let membership;
    if (existingMembership) {
      // Update existing membership
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
        },
      });
    } else {
      // Create new membership
      membership = await prisma.membership.create({
        data: {
          userId: session.user.id,
          type: membershipType,
          status: MembershipStatus.ACTIVE,
          startDate,
          endDate,
          price: plan.price,
        },
      });
    }

    return NextResponse.json({
      message: "Subscription successful",
      membership,
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { message: "Error subscribing to membership" },
      { status: 500 }
    );
  }
} 