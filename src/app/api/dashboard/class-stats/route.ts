import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    // Get attendance by category
    const attendanceByType = await prisma.gymClass.groupBy({
      by: ["category"],
      where: {
        gymId,
      },
      _count: {
        id: true,
      },
    });

    // Get attendance by instructor
    const attendanceByInstructor = await prisma.gymClass.groupBy({
      by: ["instructor"],
      where: {
        gymId,
        instructor: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get upcoming classes
    const upcomingClasses = await prisma.gymClass.findMany({
      where: {
        gymId,
        schedule: {
          gt: new Date(),
        } as any, // Type assertion needed because schedule is Json type
      },
      orderBy: {
        schedule: "asc",
      },
      take: 5,
    });

    // Get capacity utilization by category
    const capacityUtilization = await prisma.gymClass.groupBy({
      by: ["category"],
      where: {
        gymId,
      },
      _avg: {
        capacity: true,
      },
    });

    return NextResponse.json({
      attendanceByType,
      attendanceByInstructor,
      upcomingClasses,
      capacityUtilization,
    });
  } catch (error) {
    console.error("[CLASS_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 