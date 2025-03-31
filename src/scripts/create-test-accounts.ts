import { PrismaClient, MembershipType, MembershipStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestAccounts() {
  try {
    // Test accounts with different subscription plans
    const testAccounts = [
      {
        email: 'basic@example.com',
        name: 'Basic Member',
        password: 'password123',
        membership: {
          type: MembershipType.BASIC,
          price: 29.99,
        },
      },
      {
        email: 'premium@example.com',
        name: 'Premium Member',
        password: 'password123',
        membership: {
          type: MembershipType.PREMIUM,
          price: 49.99,
        },
      },
      {
        email: 'vip@example.com',
        name: 'VIP Member',
        password: 'password123',
        membership: {
          type: MembershipType.VIP,
          price: 79.99,
        },
      },
      {
        email: 'family@example.com',
        name: 'Family Member',
        password: 'password123',
        membership: {
          type: MembershipType.FAMILY,
          price: 99.99,
        },
      },
    ];

    for (const account of testAccounts) {
      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: account.email,
          name: account.name,
          password: hashedPassword,
          role: 'MEMBER',
        },
      });

      // Create membership
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month membership

      await prisma.membership.create({
        data: {
          userId: user.id,
          type: account.membership.type,
          startDate,
          endDate,
          status: MembershipStatus.ACTIVE,
          price: account.membership.price,
        },
      });

      console.log(`Created account: ${account.email} with ${account.membership.type} membership`);
    }

    console.log('All test accounts created successfully');
  } catch (error) {
    console.error('Error creating test accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccounts(); 