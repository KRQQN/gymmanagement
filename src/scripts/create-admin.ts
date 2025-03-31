import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'admin@example.com'; // Change this to your desired admin email
    const password = 'adminpassword123'; // Change this to your desired password
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        // Don't select password for security
      }
    });

    if (existingAdmin) {
      console.log('Existing admin account details:', existingAdmin);
      
      // Option to reset password if needed
      const resetPassword = process.argv.includes('--reset-password');
      if (resetPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword }
        });
        console.log('Admin password has been reset');
      }
      return;
    }

    // Create admin user if none exists
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    console.log('New admin account created:', admin);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 