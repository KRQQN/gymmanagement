import { apiHandler } from "@/lib/api-handler";
import { GymService } from "@/lib/services/gym.service";
import { ApiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export const GET = apiHandler(
  async (req: NextRequest, session: any, context) => {
    const { gymId } = context?.params || {};
    if (!gymId) {
      return ApiResponse.badRequest("Gym ID is required");
    }
    const gym = await GymService.getGymById(gymId);
    return ApiResponse.success(gym);
  }
);

export const PATCH = apiHandler(
  async (req: NextRequest, session: any, context) => {
    const { gymId } = context?.params || {};
    if (!gymId) {
      return ApiResponse.badRequest("Gym ID is required");
    }
    const body = await req.json();
    const updatedGym = await GymService.updateGym(gymId, body);
    return ApiResponse.success(updatedGym);
  },
  {
    requireAuth: true,
    requireAdmin: true,
  }
);

export const DELETE = apiHandler(
  async (req: NextRequest, session: any, context) => {
    const { gymId } = context?.params || {};
    if (!gymId) {
      return ApiResponse.badRequest("Gym ID is required");
    }
    await GymService.deleteGym(gymId);
    return ApiResponse.success(null, 204);
  },
  {
    requireAuth: true,
    requireAdmin: true,
  }
); 