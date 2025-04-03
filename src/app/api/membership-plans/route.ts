import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    const plans = await prisma.membershipPlan.findMany({
      where: {
        gymId,
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("[MEMBERSHIP_PLANS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    const body = await req.json();
    const { name, description, price, features } = body;

    if (!name || !description || !price || !features) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        description,
        price,
        features,
        gymId,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("[MEMBERSHIP_PLANS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 