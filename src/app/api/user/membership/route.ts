import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's active membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
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
        type: membership.plan.name,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
        price: membership.plan.price,
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