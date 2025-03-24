import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default membership plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for beginners',
      price: 29.99,
      features: ['Access to gym', 'Basic equipment usage', 'Locker room access', 'Free parking'],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For dedicated fitness enthusiasts',
      price: 49.99,
      features: ['All Basic features', 'Group classes', 'Personal trainer (2x/month)', 'Spa access'],
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Ultimate fitness experience',
      price: 79.99,
      features: ['All Premium features', 'Unlimited personal training', 'Nutrition consultation', 'Priority booking'],
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Perfect for families',
      price: 99.99,
      features: ['All Premium features', 'Family membership (up to 4 members)', 'Kids club access', 'Family locker room'],
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 