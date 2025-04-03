import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { planId: string } }
) {
  try {
    const plan = await prisma.membershipPlan.findUnique({
      where: {
        id: params.planId,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { message: "Error fetching plan" },
      { status: 500 }
    );
  }
} 