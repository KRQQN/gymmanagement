import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { gymId: string } }) {
  const { gymId } = params;
  console.log('Dashboard API called for gym:', gymId);
  
  try {
    const session = await getServerSession(authOptions);
    console.log('API Session:', session ? 'Present' : 'Missing');
    console.log('API Session user:', session?.user);

    if (!session?.user) {
      console.log('No session in API, returning 401');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the user has access to this gym
    if (session.user.gymId !== gymId) {
      console.log('User gymId mismatch:', { userGymId: session.user.gymId, requestedGymId: gymId });
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Calculate current month start and end dates
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    const currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0, 23, 59, 59);

    if (session.user.role === "ADMIN") {
      console.log('Fetching admin dashboard data');
      try {
        // Get total members
        const totalMembers = await prisma.user.count({
          where: {
            gymId,
            role: "MEMBER",
          },
        });
        console.log('Total members:', totalMembers);

        // Get new members this month
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
        console.log('New members:', newMembers);

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
        console.log('Active members:', activeMembers);

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
        console.log('Today check-ins:', todayCheckIns);

        // Calculate raw monthly revenue
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
        console.log('Raw monthly revenue:', rawMonthlyRevenue._sum.amount);

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
        console.log('Active memberships:', memberships.length);

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
        console.log('Membership details:', membershipDetails);

        const response = {
          totalMembers,
          newMembers,
          activeMembers,
          todayCheckIns,
          rawRevenue: rawMonthlyRevenue._sum.amount || 0,
          accrualRevenue,
          memberships: membershipDetails,
        };
        console.log('Admin dashboard response:', response);
        return NextResponse.json(response);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch admin dashboard data', details: error instanceof Error ? error.message : 'Unknown error' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      console.log('Fetching member dashboard data');
      try {
        // Member dashboard data
        const membership = await prisma.membership.findFirst({
          where: {
            user: {
              id: session.user.id,
              gymId,
            },
            status: 'ACTIVE',
          },
          include: {
            plan: true,
          },
        });
        console.log('Member membership:', membership);

        const recentCheckIns = await prisma.checkIn.count({
          where: {
            userId: session.user.id,
            checkInTime: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        });
        console.log('Recent check-ins:', recentCheckIns);

        const nextPayment = await prisma.payment.findFirst({
          where: {
            userId: session.user.id,
            status: 'PENDING',
          },
          orderBy: {
            createdAt: 'asc',
          },
        });
        console.log('Next payment:', nextPayment);

        const response = {
          membershipStatus: membership ? 'Active' : 'Inactive',
          membershipPlan: membership?.plan.name || 'No active plan',
          recentCheckIns,
          nextPaymentDate: nextPayment?.createdAt ? new Date(nextPayment.createdAt).toLocaleDateString() : 'No pending payments',
        };
        console.log('Member dashboard response:', response);
        return NextResponse.json(response);
      } catch (error) {
        console.error('Error fetching member dashboard data:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch member dashboard data', details: error instanceof Error ? error.message : 'Unknown error' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 