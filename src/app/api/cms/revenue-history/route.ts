import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { subMonths, addMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        const rawRevenue = await prisma.membership.aggregate({
          where: {
            startDate: {
              gte: monthStart,
              lte: monthEnd,
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
              { startDate: { lte: monthEnd } },
              { endDate: { gte: monthStart } },
            ],
          },
        });

        let accrualRevenue = 0;

        for (const membership of memberships) {
          const membershipStart = new Date(membership.startDate);
          const membershipEnd = new Date(membership.endDate);
          const totalDays = Math.ceil((membershipEnd.getTime() - membershipStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const dailyRate = membership.price / totalDays;

          // Calculate days in this month
          const periodStart = new Date(Math.max(membershipStart.getTime(), monthStart.getTime()));
          const periodEnd = new Date(Math.min(membershipEnd.getTime(), monthEnd.getTime()));
          const daysInMonth = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

          // Calculate revenue for this month
          accrualRevenue += dailyRate * daysInMonth;
        }

        return {
          month: monthStart.toISOString(),
          rawRevenue: rawRevenue._sum.price || 0,
          accrualRevenue,
        };
      })
    );

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue history:', error);
    return NextResponse.json(
      { error: "Error fetching revenue history" },
      { status: 500 }
    );
  }
} 