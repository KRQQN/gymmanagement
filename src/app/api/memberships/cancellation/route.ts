import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MembershipStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Get user's active membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: MembershipStatus.ACTIVE,
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { message: "No active membership found" },
        { status: 404 }
      );
    }

    // Update membership status to CANCELLED
    const updatedMembership = await prisma.membership.update({
      where: {
        id: membership.id,
      },
      data: {
        status: MembershipStatus.CANCELLED,
      },
    });

    return NextResponse.json({
      message: "Membership cancelled successfully",
      membership: {
        id: updatedMembership.id,
        status: updatedMembership.status,
        endDate: updatedMembership.endDate,
      },
    });
  } catch (error) {
    console.error("Error cancelling membership:", error);
    return NextResponse.json(
      { message: "Error cancelling membership" },
      { status: 500 }
    );
  }
} 