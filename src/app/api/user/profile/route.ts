import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    // Get current user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let updatedUser;

    // If trying to change password
    if (currentPassword && newPassword) {
      // Verify current password
      const isValid = await compare(currentPassword, user.password);

      if (!isValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 12);

      // Update user with new password
      updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } else {
      // Update user without changing password
      updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          email,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
} 