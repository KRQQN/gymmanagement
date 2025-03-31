import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This route is only available in development" },
        { status: 403 }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin account already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin account:", error);
    return NextResponse.json(
      { error: "Error creating admin account" },
      { status: 500 }
    );
  }
} 