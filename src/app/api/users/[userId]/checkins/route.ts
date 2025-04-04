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

    // Get user's check-in history
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to last 10 check-ins
    });

    return NextResponse.json({
      checkIns: checkIns.map((checkIn) => ({
        id: checkIn.id,
        date: checkIn.createdAt.toISOString().split("T")[0],
        time: checkIn.createdAt.toLocaleTimeString(),
        duration: checkIn.checkOutTime 
          ? Math.round((checkIn.checkOutTime.getTime() - checkIn.checkInTime.getTime()) / 1000 / 60)
          : null,
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