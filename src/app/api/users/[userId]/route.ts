import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { compare, hash } from 'bcryptjs';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id === userId && session.user.role === 'MEMBER') {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}


export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (currentPassword) {
    const passwordValid = await compare(currentPassword, user.password!);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }
  }
  
  const hashedPassword = await hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password: hashedPassword }
  });
  
  return NextResponse.json(updatedUser);
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } 

  await prisma.user.delete({
    where: { id: userId }
  });

  return NextResponse.json({ message: 'User deleted' }, { status: 200 });
}   

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  return NextResponse.json(user);
}

  