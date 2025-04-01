import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the demo gym
  const gym = await prisma.gym.findFirst({
    where: { name: 'Demo Gym' },
  });

  if (!gym) {
    throw new Error('Demo gym not found. Please run create-gym.ts first.');
  }

  // Create default membership plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for beginners',
      price: 29.99,
      features: ['Access to gym', 'Basic equipment usage', 'Locker room access', 'Free parking'],
      gymId: gym.id,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For dedicated fitness enthusiasts',
      price: 49.99,
      features: ['All Basic features', 'Group classes', 'Personal trainer (2x/month)', 'Spa access'],
      gymId: gym.id,
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Ultimate fitness experience',
      price: 79.99,
      features: ['All Premium features', 'Unlimited personal training', 'Nutrition consultation', 'Priority booking'],
      gymId: gym.id,
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Perfect for families',
      price: 99.99,
      features: ['All Premium features', 'Family membership (up to 4 members)', 'Kids club access', 'Family locker room'],
      gymId: gym.id,
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  // Create instructors
  const instructors = [
    {
      id: 'instructor1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m', // password: 'password123'
      role: 'STAFF',
      gymId: gym.id,
    },
    {
      id: 'instructor2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m', // password: 'password123'
      role: 'STAFF',
      gymId: gym.id,
    },
    {
      id: 'instructor3',
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m', // password: 'password123'
      role: 'STAFF',
      gymId: gym.id,
    },
  ];

  for (const instructor of instructors) {
    await prisma.user.upsert({
      where: { id: instructor.id },
      update: {
        name: instructor.name,
        email: instructor.email,
        password: instructor.password,
        role: 'STAFF' as const,
        gymId: instructor.gymId
      },
      create: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        password: instructor.password,
        role: 'STAFF' as const,
        gymId: instructor.gymId
      },
    });
  }

  // Create gym classes
  const classes = [
    {
      id: 'class1',
      name: 'Morning Yoga',
      description: 'Start your day with a rejuvenating yoga session',
      schedule: [
        { day: 'Monday', time: '07:00' },
        { day: 'Wednesday', time: '07:00' },
        { day: 'Friday', time: '07:00' },
      ],
      duration: 60,
      capacity: 20,
      bookedSpots: 0,
      category: 'Yoga',
      difficulty: 'Beginner',
      equipment: ['Yoga mat', 'Blocks', 'Strap'],
      requirements: ['No prior experience needed', 'Comfortable clothing'],
      instructorId: 'instructor1',
      gymId: gym.id,
    },
    {
      id: 'class2',
      name: 'HIIT Training',
      description: 'High-intensity interval training for maximum calorie burn',
      schedule: [
        { day: 'Monday', time: '18:00' },
        { day: 'Wednesday', time: '18:00' },
        { day: 'Friday', time: '18:00' },
      ],
      duration: 45,
      capacity: 15,
      bookedSpots: 0,
      category: 'Cardio',
      difficulty: 'Advanced',
      equipment: ['None'],
      requirements: ['Good fitness level', 'Water bottle'],
      instructorId: 'instructor2',
      gymId: gym.id,
    },
    {
      id: 'class3',
      name: 'Strength Training',
      description: 'Build muscle and increase strength with proper form',
      schedule: [
        { day: 'Tuesday', time: '09:00' },
        { day: 'Thursday', time: '09:00' },
        { day: 'Saturday', time: '10:00' },
      ],
      duration: 60,
      capacity: 12,
      bookedSpots: 0,
      category: 'Strength',
      difficulty: 'Intermediate',
      equipment: ['Dumbbells', 'Barbells', 'Resistance bands'],
      requirements: ['Basic gym experience', 'Proper form knowledge'],
      instructorId: 'instructor3',
      gymId: gym.id,
    },
    {
      id: 'class4',
      name: 'Zumba Dance',
      description: 'Fun and energetic dance workout for all levels',
      schedule: [
        { day: 'Tuesday', time: '19:00' },
        { day: 'Thursday', time: '19:00' },
        { day: 'Saturday', time: '11:00' },
      ],
      duration: 45,
      capacity: 25,
      bookedSpots: 0,
      category: 'Dance',
      difficulty: 'Beginner',
      equipment: ['None'],
      requirements: ['Comfortable shoes', 'Water bottle'],
      instructorId: 'instructor1',
      gymId: gym.id,
    },
    {
      id: 'class5',
      name: 'Pilates',
      description: 'Core strengthening and flexibility training',
      schedule: [
        { day: 'Monday', time: '10:00' },
        { day: 'Wednesday', time: '10:00' },
        { day: 'Friday', time: '10:00' },
      ],
      duration: 45,
      capacity: 15,
      bookedSpots: 0,
      category: 'Flexibility',
      difficulty: 'Intermediate',
      equipment: ['Pilates mat', 'Resistance bands'],
      requirements: ['No prior experience needed', 'Comfortable clothing'],
      instructorId: 'instructor2',
      gymId: gym.id,
    },
  ];

  for (const cls of classes) {
    await prisma.gymClass.upsert({
      where: { id: cls.id },
      update: cls,
      create: cls,
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