import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MembershipStatus } from "@prisma/client";

export async function GET() {
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

    return NextResponse.json({
      membership: {
        id: membership.id,
        type: membership.type,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
        price: membership.price,
      },
    });
  } catch (error) {
    console.error("Error fetching membership:", error);
    return NextResponse.json(
      { message: "Error fetching membership" },
      { status: 500 }
    );
  }
} 