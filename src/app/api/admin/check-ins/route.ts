import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // Get all check-ins with user information
    const checkIns = await prisma.checkIn.findMany({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        duration: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      checkIns: checkIns.map((checkIn) => ({
        id: checkIn.id,
        userId: checkIn.userId,
        userName: checkIn.user.name,
        date: checkIn.createdAt.toISOString().split("T")[0],
        time: checkIn.createdAt.toLocaleTimeString(),
        duration: checkIn.duration,
      })),
    });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { message: "Error fetching check-ins" },
      { status: 500 }
    );
  }
} 