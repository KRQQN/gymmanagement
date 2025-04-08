import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { gymId: string } }) {
  const { gymId } = params;
  try {
    const session = await getServerSession(authOptions);

    console.log("#### API #### \nsession", session)


    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total members
    const totalMembers = await prisma.user.count({
      where: {
        gymId,
        role: "MEMBER",
      },
    });

    // Get new members this month
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    const currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0, 23, 59, 59);

    const newMembers = await prisma.user.count({
      where: {
        gymId,
        role: "MEMBER",
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Get active members
    const activeMembers = await prisma.membership.count({
      where: {
        user: {
          gymId,
          role: "MEMBER",
        },
        status: 'ACTIVE',
      },
    });

    // Get today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCheckIns = await prisma.checkIn.count({
      where: {
        gymId,
        checkInTime: {
          gte: today,
        },
      },
    });

    // Calculate raw monthly revenue (total payments received this month)
    const rawMonthlyRevenue = await prisma.payment.aggregate({
      where: {
        gymId,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate accrual-based revenue and group by membership type
    const memberships = await prisma.membership.findMany({
      where: {
        user: {
          gymId,
          role: "MEMBER",
        },
        status: 'ACTIVE',
        AND: [
          { startDate: { lte: currentMonthEnd } },
          { endDate: { gte: currentMonthStart } },
        ],
      },
      include: {
        plan: true,
      },
    });

    let accrualRevenue = 0;
    const membershipGroups = new Map<string, {
      count: number;
      totalRevenue: number;
      monthlyRevenue: number;
    }>();

    for (const membership of memberships) {
      const membershipStart = new Date(membership.startDate);
      const membershipEnd = new Date(membership.endDate);
      const totalDays = Math.ceil((membershipEnd.getTime() - membershipStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const dailyRate = membership.plan.price / totalDays;

      // Calculate days in current month
      const periodStart = new Date(Math.max(membershipStart.getTime(), currentMonthStart.getTime()));
      const periodEnd = new Date(Math.min(membershipEnd.getTime(), currentMonthEnd.getTime()));
      const daysInMonth = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate revenue for current month
      const monthlyRevenue = dailyRate * daysInMonth;
      accrualRevenue += monthlyRevenue;

      // Group by membership type
      const planName = membership.plan.name;
      const group = membershipGroups.get(planName) || {
        count: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
      };

      group.count++;
      group.totalRevenue += membership.plan.price;
      group.monthlyRevenue += monthlyRevenue;
      membershipGroups.set(planName, group);
    }

    // Convert membership groups to array
    const membershipDetails = Array.from(membershipGroups.entries()).map(([planName, data]) => ({
      planName,
      count: data.count,
      totalRevenue: data.totalRevenue,
      monthlyRevenue: data.monthlyRevenue,
    }));

    return NextResponse.json({
      totalMembers,
      newMembers,
      activeMembers,
      todayCheckIns,
      rawRevenue: rawMonthlyRevenue._sum.amount || 0,
      accrualRevenue,
      memberships: membershipDetails,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 