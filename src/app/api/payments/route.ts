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

    const payments = await prisma.payment.findMany({
      where: {
        gymId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    const body = await req.json();
    const { amount, paymentMethod, stripeSessionId } = body;

    if (!amount || !paymentMethod) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        paymentMethod,
        stripeSessionId,
        status: "PENDING",
        userId: session.user.id,
        gymId,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    const body = await req.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: {
        id: paymentId,
        gymId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[PAYMENTS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 