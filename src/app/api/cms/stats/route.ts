import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total members
    const totalMembers = await prisma.user.count();

    // Get active members
    const activeMembers = await prisma.membership.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Get today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCheckIns = await prisma.checkIn.count({
      where: {
        checkInTime: {
          gte: today,
        },
      },
    });

    // Calculate raw monthly revenue (total payments received this month)
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    const currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0, 23, 59, 59);

    const rawMonthlyRevenue = await prisma.membership.aggregate({
      where: {
        startDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        price: true,
      },
    });

    // Calculate accrual-based revenue
    const memberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        AND: [
          { startDate: { lte: currentMonthEnd } },
          { endDate: { gte: currentMonthStart } },
        ],
      },
      include: {
        plan: true,
        user: true,
      },
    });

    let accrualMonthlyRevenue = 0;
    let membershipDetails = [];

    for (const membership of memberships) {
      // Calculate the number of days in the membership period
      const membershipStart = new Date(membership.startDate);
      const membershipEnd = new Date(membership.endDate);
      const totalDays = Math.ceil((membershipEnd.getTime() - membershipStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate daily rate
      const dailyRate = membership.price / totalDays;

      // Calculate days in current month
      const monthStart = new Date(Math.max(membershipStart.getTime(), currentMonthStart.getTime()));
      const monthEnd = new Date(Math.min(membershipEnd.getTime(), currentMonthEnd.getTime()));
      const daysInMonth = Math.ceil((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate revenue for current month
      const monthlyRevenue = dailyRate * daysInMonth;

      membershipDetails.push({
        memberId: membership.userId,
        memberName: membership.user.name || 'Unknown',
        planName: membership.plan.name,
        totalPrice: membership.price,
        totalDays,
        daysInCurrentMonth: daysInMonth,
        dailyRate,
        monthlyRevenue,
        startDate: membershipStart.toISOString(),
        endDate: membershipEnd.toISOString(),
      });

      accrualMonthlyRevenue += monthlyRevenue;
    }

    return NextResponse.json({
      totalMembers,
      activeMembers,
      todayCheckIns,
      monthlyRevenue: rawMonthlyRevenue._sum.price || 0, // Raw monthly revenue
      accrualMonthlyRevenue, // Accrual-based monthly revenue
      revenueDetails: membershipDetails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
} 