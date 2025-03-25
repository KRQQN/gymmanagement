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

    // Get monthly revenue
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    // Calculate expected monthly revenue from active memberships
    const activeMemberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        price: true,
      },
    });

    const monthlyRevenue = activeMemberships.reduce((sum, membership) => sum + membership.price, 0);

    return NextResponse.json({
      totalMembers,
      activeMembers,
      todayCheckIns,
      monthlyRevenue,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
} 