import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Only admins can create gyms" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, address, phone, email } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      );
    }

    // Generate a random API key
    const apiKey = `gym_${Math.random().toString(36).substring(2, 15)}`;

    const gym = await prisma.gym.create({
      data: {
        name,
        address,
        phone,
        email,
        apiKey,
      },
    });

    return NextResponse.json(gym, { status: 201 });
  } catch (error) {
    console.error("Error creating gym:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const gyms = await prisma.gym.findMany({
      where: {
        isActive: true,
      },
    });

    return NextResponse.json(gyms);
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
