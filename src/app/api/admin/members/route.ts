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

    // Get all users with their active memberships
    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membership: {
          select: {
            id: true,
            status: true,
            type: true,
            startDate: true,
            endDate: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      members: members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        membership: member.membership
          ? {
              type: member.membership.type,
              status: member.membership.status,
              endDate: member.membership.endDate,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { message: "Error fetching members" },
      { status: 500 }
    );
  }
} 