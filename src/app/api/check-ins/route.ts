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

    const checkIns = await prisma.checkIn.findMany({
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
        checkInTime: "desc",
      },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error("[CHECK_INS_GET]", error);
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

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: session.user.id,
        gymId,
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error("[CHECK_INS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const gymId = await getUserGymId(session.user.id);

    const body = await req.json();
    const { checkInId } = body;

    if (!checkInId) {
      return new NextResponse("Missing check-in ID", { status: 400 });
    }

    const checkIn = await prisma.checkIn.update({
      where: {
        id: checkInId,
        userId: session.user.id,
        gymId,
      },
      data: {
        checkOutTime: new Date(),
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error("[CHECK_INS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 