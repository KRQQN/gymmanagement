import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Add Downtown Fitness
  const downtownFitness = await prisma.gym.create({
    data: {
      name: 'Downtown Fitness',
      address: '123 Main Street, Downtown',
      phone: '555-0101',
      email: 'downtown@fitness.com',
      apiKey: crypto.randomBytes(32).toString('hex'),
      membershipPlans: {
        create: [
          {
            name: 'Basic Membership',
            price: 49.99,
            description: 'Access to basic equipment and facilities',
            features: ['Access to cardio equipment', 'Locker room access', 'Free weights area'],
          },
          {
            name: 'Premium Membership',
            price: 79.99,
            description: 'Full access to all facilities and classes',
            features: ['All Basic features', 'Unlimited group classes', 'Personal trainer discount', 'Sauna access'],
          },
          {
            name: 'Annual Membership',
            price: 899.99,
            description: 'Best value for long-term commitment',
            features: ['All Premium features', '2 free personal training sessions', '20% discount on merchandise'],
          },
        ],
      },
      classes: {
        create: [
          {
            name: 'Morning Yoga',
            description: 'Start your day with a peaceful yoga session',
            duration: 60,
            capacity: 20,
            bookedSpots: 0,
            category: 'Yoga',
            difficulty: 'Beginner',
            equipment: ['Yoga mat', 'Blocks', 'Strap'],
            requirements: ['No prior experience needed', 'Comfortable clothing'],
            instructor: 'Sarah Johnson',
            schedule: {
              day: 'Monday',
              time: '07:00',
            },
          },
          {
            name: 'HIIT Training',
            description: 'High-intensity interval training for maximum results',
            duration: 45,
            capacity: 15,
            bookedSpots: 0,
            category: 'Cardio',
            difficulty: 'Advanced',
            equipment: ['None'],
            requirements: ['Good fitness level', 'Water bottle'],
            instructor: 'Mike Wilson',
            schedule: {
              day: 'Wednesday',
              time: '18:00',
            },
          },
          {
            name: 'Spin Class',
            description: 'High-energy cycling workout',
            duration: 45,
            capacity: 25,
            bookedSpots: 0,
            category: 'Cardio',
            difficulty: 'Intermediate',
            equipment: ['Spin bike'],
            requirements: ['Water bottle', 'Towel'],
            instructor: 'John Smith',
            schedule: {
              day: 'Friday',
              time: '17:30',
            },
          },
        ],
      },
    },
  });

  // Add Westside Athletic Club
  const westsideAthletic = await prisma.gym.create({
    data: {
      name: 'Westside Athletic Club',
      address: '456 West Avenue, Westside',
      phone: '555-0202',
      email: 'westside@athletic.com',
      apiKey: crypto.randomBytes(32).toString('hex'),
      membershipPlans: {
        create: [
          {
            name: 'Student Membership',
            price: 39.99,
            description: 'Special rate for students',
            features: ['Access to all equipment', 'Locker room access', 'Student ID required'],
          },
          {
            name: 'Family Membership',
            price: 129.99,
            description: 'Perfect for families',
            features: ['Access for 2 adults and 2 children', 'Family changing rooms', 'Kids play area'],
          },
          {
            name: 'Elite Membership',
            price: 149.99,
            description: 'For serious athletes',
            features: ['24/7 access', 'Priority class booking', 'Complimentary towel service', 'Nutrition consultation'],
          },
        ],
      },
      classes: {
        create: [
          {
            name: 'CrossFit',
            description: 'Functional fitness training',
            duration: 60,
            capacity: 12,
            bookedSpots: 0,
            category: 'Strength',
            difficulty: 'Advanced',
            equipment: ['Barbells', 'Kettlebells', 'Rings'],
            requirements: ['Good fitness level', 'Water bottle'],
            instructor: 'Tom Brown',
            schedule: {
              day: 'Tuesday',
              time: '06:00',
            },
          },
          {
            name: 'Boxing Fundamentals',
            description: 'Learn the basics of boxing',
            duration: 60,
            capacity: 10,
            bookedSpots: 0,
            category: 'Martial Arts',
            difficulty: 'Beginner',
            equipment: ['Boxing gloves', 'Hand wraps'],
            requirements: ['No prior experience needed', 'Comfortable clothing'],
            instructor: 'Lisa Chen',
            schedule: {
              day: 'Thursday',
              time: '19:00',
            },
          },
          {
            name: 'Pilates',
            description: 'Core strengthening and flexibility',
            duration: 45,
            capacity: 15,
            bookedSpots: 0,
            category: 'Flexibility',
            difficulty: 'Intermediate',
            equipment: ['Pilates mat', 'Resistance bands'],
            requirements: ['No prior experience needed', 'Comfortable clothing'],
            instructor: 'Emma Davis',
            schedule: {
              day: 'Saturday',
              time: '09:00',
            },
          },
        ],
      },
    },
  });

  console.log('Added new gyms:');
  console.log('1. Downtown Fitness:', downtownFitness);
  console.log('2. Westside Athletic Club:', westsideAthletic);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 