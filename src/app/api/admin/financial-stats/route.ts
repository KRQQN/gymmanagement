import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";
import { subMonths, addMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    // Get data for the last 6 months and next 6 months
    const months = [];
    const now = new Date();
    
    // Add last 6 months
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(now, i));
    }
    
    // Add next 6 months
    for (let i = 1; i <= 6; i++) {
      months.push(addMonths(now, i));
    }

    const revenueData = await Promise.all(
      months.map(async (month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        // Calculate raw revenue (payments received in this month)
        const rawRevenue = await prisma.payment.aggregate({
          where: {
            gymId,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            status: 'COMPLETED',
          },
          _sum: {
            amount: true,
          },
        });

        // Calculate accrual-based revenue
        const memberships = await prisma.membership.findMany({
          where: {
            user: {
              gymId,
            },
            status: 'ACTIVE',
            AND: [
              { startDate: { lte: monthEnd } },
              { endDate: { gte: monthStart } },
            ],
          },
          include: {
            plan: true,
          },
        });

        let accrualRevenue = 0;

        for (const membership of memberships) {
          const membershipStart = new Date(membership.startDate);
          const membershipEnd = new Date(membership.endDate);
          const totalDays = Math.ceil((membershipEnd.getTime() - membershipStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const dailyRate = membership.plan.price / totalDays;

          // Calculate days in this month
          const periodStart = new Date(Math.max(membershipStart.getTime(), monthStart.getTime()));
          const periodEnd = new Date(Math.min(membershipEnd.getTime(), monthEnd.getTime()));
          const daysInMonth = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

          // Calculate revenue for this month
          accrualRevenue += dailyRate * daysInMonth;
        }

        return {
          month: monthStart.toISOString(),
          rawRevenue: rawRevenue._sum.amount || 0,
          accrualRevenue,
        };
      })
    );

    // Get revenue by payment method
    const revenueByMethod = await prisma.payment.groupBy({
      by: ["paymentMethod"],
      where: {
        gymId,
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    // Get pending payments
    const pendingPayments = await prisma.payment.aggregate({
      where: {
        gymId,
        status: "PENDING",
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate accrual-based revenue and group by membership type
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const memberships = await prisma.membership.findMany({
      where: {
        user: {
          gymId,
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
      monthlyRevenue: revenueData,
      revenueByMethod,
      pendingPayments: pendingPayments._sum.amount || 0,
      membershipDetails,
    });
  } catch (error) {
    console.error("[FINANCIAL_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 