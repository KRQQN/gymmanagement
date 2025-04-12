import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/api-response";

export class GymService {
  static async createGym(data: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  }) {
    try {
      const apiKey = `gym_${Math.random().toString(36).substring(2, 15)}`;

      const gym = await prisma.gym.create({
        data: {
          ...data,
          apiKey,
        },
      });

      return gym;
    } catch (error) {
      console.error("Error creating gym:", error);
      throw new Error("Failed to create gym");
    }
  }

  static async getGyms(options?: { include?: { classes?: boolean; users?: boolean; membershipPlans?: boolean } }) {
    try {
      const include = {
        _count: {
          select: {
            classes: true,
            users: true,
          },
        },
        ...(options?.include?.classes && { classes: true }),
        ...(options?.include?.users && { users: true }),
        ...(options?.include?.membershipPlans && { membershipPlans: true }),
      };

      const gyms = await prisma.gym.findMany({
        where: {
          isActive: true,
        },
        include,
      });

      if (!gyms) {
        throw new Error("No gyms found");
      }

      return gyms;
    } catch (error) {
      console.error("Error fetching gyms:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error("Failed to fetch gyms");
    }
  }

  static async getGymById(id: string) {
    try {
      const gym = await prisma.gym.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              classes: true,
              users: true,
            },
          },
        },
      });

      if (!gym) {
        throw new Error("Gym not found");
      }

      return gym;
    } catch (error) {
      console.error("Error fetching gym:", error);
      throw error;
    }
  }

  static async updateGym(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    try {
      const gym = await prisma.gym.update({
        where: { id },
        data,
        include: {
          _count: {
            select: {
              classes: true,
              users: true,
            },
          },
        },
      });

      return gym;
    } catch (error) {
      console.error("Error updating gym:", error);
      throw new Error("Failed to update gym");
    }
  }

  static async deleteGym(id: string) {
    try {
      await prisma.gym.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting gym:", error);
      throw new Error("Failed to delete gym");
    }
  }
} 