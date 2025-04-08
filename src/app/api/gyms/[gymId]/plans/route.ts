import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { gymId: string } }
) {
  try {
    const { gymId } = params;

    const plans = await prisma.membershipPlan.findMany({
      where: {
        gymId: gymId,
      },
      orderBy: {
        price: "asc",
      },
    });


    return NextResponse.json({
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
      })),
    });
  } catch (error) {
    const err = error as Error & { code?: string; meta?: any };
    console.error("Detailed error in membership plans API:", {
      name: err.name,
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack,
      cause: err.cause,
    });

    // Check if it's a database connection error
    if (err.message?.includes("connect") || err.message?.includes("connection") || err.code === "P1001") {
      return NextResponse.json(
        { 
          message: "Database connection error", 
          error: err.message,
          code: err.code,
          details: "Please check if the database is running and accessible"
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        message: "Error fetching plans", 
        error: err.message,
        code: err.code,
        details: "An unexpected error occurred while fetching membership plans"
      },
      { status: 500 }
    );
  }
} 