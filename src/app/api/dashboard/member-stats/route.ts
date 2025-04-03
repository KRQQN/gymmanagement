import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    // Get member count by membership plan
    const membersByPlan = await prisma.membership.groupBy({
      by: ["planId"],
      where: {
        user: {
          gymId,
          role: "MEMBER",
        },
      },
      _count: {
        userId: true,
      },
    });

    // Get member count by status
    const membersByStatus = await prisma.membership.groupBy({
      by: ["status"],
      where: {
        user: {
          gymId,
          role: "MEMBER",
        },
      },
      _count: {
        userId: true,
      },
    });

    // Get new members this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const newMembersThisMonth = await prisma.user.count({
      where: {
        gymId,
        role: "MEMBER",
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Get member check-in frequency
    const checkInFrequency = await prisma.checkIn.groupBy({
      by: ["userId"],
      where: {
        gymId,
        checkInTime: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      membersByPlan,
      membersByStatus,
      newMembersThisMonth,
      checkInFrequency,
    });
  } catch (error) {
    console.error("[MEMBER_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 