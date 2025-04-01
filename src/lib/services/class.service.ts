import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";

export interface Class {
  id: string;
  name: string;
  description: string;
  schedule: {
    day: string;
    time: string;
  }[];
  duration: number;
  capacity: number;
  bookedSpots: number;
  category: string | null;
  difficulty: string | null;
  equipment: string[];
  requirements: string[];
  attendees: string[];
  instructor: string;
}

export class ClassService {
  static async getAllClasses(): Promise<Class[]> {
    const response = await fetch("/api/classes");
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!response.ok) {
      throw new Error("Failed to fetch classes");
    }
    const data = await response.json();
    return data.map((cls: any) => ({
      ...cls,
      schedule: cls.schedule as { day: string; time: string }[],
    }));
  }

  static async getClassById(id: string): Promise<Class | null> {
    const response = await fetch(`/api/classes/${id}`);
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch class");
    }
    const data = await response.json();
    return {
      ...data,
      schedule: data.schedule as { day: string; time: string }[],
    };
  }

  static async createClass(data: Omit<Class, "id"> & { instructorId: string }): Promise<Class> {
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!response.ok) {
      throw new Error("Failed to create class");
    }
    const result = await response.json();
    return {
      ...result,
      schedule: result.schedule as { day: string; time: string }[],
    };
  }

  static async updateClass(id: string, data: Partial<Omit<Class, "id" >>): Promise<Class> {
    const response = await fetch(`/api/classes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!response.ok) {
      throw new Error("Failed to update class");
    }
    const result = await response.json();
    return {
      ...result,
      schedule: result.schedule as { day: string; time: string }[],
    };
  }

  static async deleteClass(id: string): Promise<void> {
    const response = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (!response.ok) {
      throw new Error("Failed to delete class");
    }
  }
} 