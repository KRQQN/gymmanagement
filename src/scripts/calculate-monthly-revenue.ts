import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function calculateMonthlyRevenue(targetDate: Date = new Date()) {
  try {
    // Get current month's start and end dates
    const currentMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const currentMonthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);

    // Get all memberships that overlap with the current month
    const memberships = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        AND: [
          { startDate: { lte: currentMonthEnd } }, // Started before or during this month
          { endDate: { gte: currentMonthStart } }, // Ends after or during this month
        ],
      },
      include: {
        plan: true,
        user: true,
      },
    });

    let totalMonthlyRevenue = 0;
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
        startDate: membershipStart.toLocaleDateString(),
        endDate: membershipEnd.toLocaleDateString(),
      });

      totalMonthlyRevenue += monthlyRevenue;
    }

    // Print results
    console.log('\nMonthly Revenue Calculation (Accrual Basis)');
    console.log('==========================================');
    console.log(`Month: ${currentMonthStart.toLocaleDateString()} - ${currentMonthEnd.toLocaleDateString()}`);
    console.log(`Total Monthly Revenue: $${totalMonthlyRevenue.toFixed(2)}`);
    console.log('\nMembership Details:');
    membershipDetails.forEach(detail => {
      console.log('\n-------------------');
      console.log(`Member: ${detail.memberName}`);
      console.log(`Plan: ${detail.planName}`);
      console.log(`Period: ${detail.startDate} - ${detail.endDate}`);
      console.log(`Total Price: $${detail.totalPrice.toFixed(2)}`);
      console.log(`Total Days: ${detail.totalDays}`);
      console.log(`Days in Current Month: ${detail.daysInCurrentMonth}`);
      console.log(`Daily Rate: $${detail.dailyRate.toFixed(2)}`);
      console.log(`Monthly Revenue: $${detail.monthlyRevenue.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Calculate for current month
calculateMonthlyRevenue(); 