import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        membership: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching members" },
      { status: 500 }
    );
  }
} 