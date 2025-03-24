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

    // Get user's payment history
    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to last 10 payments
    });

    return NextResponse.json({
      payments: payments.map((payment) => ({
        id: payment.id,
        date: payment.createdAt.toISOString().split("T")[0],
        amount: payment.amount,
        status: payment.status,
        description: payment.description,
      })),
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { message: "Error fetching payments" },
      { status: 500 }
    );
  }
} 