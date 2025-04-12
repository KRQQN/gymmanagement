import { apiHandler } from "@/lib/api-handler";
import { GymService } from "@/lib/services/gym.service";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-response";

const createGymSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const POST = apiHandler(
  async (req) => {
    const body = await req.json();
    const gym = await GymService.createGym(body);
    return ApiResponse.success(gym, 201);
  },
  {
    requireAuth: true,
    requireAdmin: true,
    validate: createGymSchema,
  }
);

export const GET = apiHandler(
  async (req, _ , context) => {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const includeClasses = searchParams.get('includeClasses') === 'true';
    const includeMembershipPlans = searchParams.get('includeMembershipPlans') === 'true';
    const options = {
      include: {
        ...(includeClasses && { classes: true }),
        ...(includeMembershipPlans && { membershipPlans: true })
      }
    };

    const gyms = await GymService.getGyms(options);

    return ApiResponse.success(gyms, 200, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }
);
