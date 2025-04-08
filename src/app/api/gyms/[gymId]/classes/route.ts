import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserGymId } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { gymId: string } }
) {
  const { gymId } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classes = await prisma.gymClass.findMany({
      where: {
        gymId: gymId,
      },
      include: {
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            gymId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("[CLASSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const body = await req.json()

    const {
      name,
      description,
      schedule,
      duration,
      capacity,
      category,
      difficulty,
      equipment,
      requirements,
      instructor,
      gymId,
    } = body;

    if (!name || !description || !schedule || !duration || !capacity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const gymClass = await prisma.gymClass.create({
      data: {
        name,
        description,
        schedule,
        duration,
        capacity,
        category,
        difficulty,
        equipment: equipment || [],
        requirements: requirements || [],
        instructor,
        gymId,
      },
    });

    return NextResponse.json(gymClass);
  } catch (error) {
    console.error("[CLASSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { classId, gymId, ...updateData } = body;

    if (!classId) {
      return new NextResponse("Missing class ID", { status: 400 });
    }

    const gymClass = await prisma.gymClass.update({
      where: {
        id: classId,
        gymId,
      },
      data: updateData,
    });

    return NextResponse.json(gymClass);
  } catch (error) {
    console.error("[CLASSES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { gymId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { gymId } = params;
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return new NextResponse("Missing class ID", { status: 400 });
    }

    await prisma.gymClass.delete({
      where: {
        id: classId,
        gymId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CLASSES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 