import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserGymId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gymId: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.gymId;
} 