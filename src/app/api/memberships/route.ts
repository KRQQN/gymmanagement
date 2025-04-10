import { apiHandler } from "@/lib/api-handler";
import { MembershipService } from "@/lib/services/membership.service";
import { z } from "zod";

const createCheckoutSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});

export const GET = apiHandler(
  async (req, session) => {
    return MembershipService.getMembership(session.user.id);
  },
  {
    requireAuth: true,
  }
);

export const PATCH = apiHandler(
  async (req, session) => {
    return MembershipService.cancelMembership(session.user.id);
  },
  {
    requireAuth: true,
  }
);

export const DELETE = apiHandler(
  async (req, session) => {
    return MembershipService.deleteMembership(session.user.id);
  },
  {
    requireAuth: true,
  }
);

export const POST = apiHandler(
  async (req, session) => {
    const { planId } = await req.json();
    return MembershipService.createCheckoutSession(session.user.id, planId);
  },
  {
    requireAuth: true,
    validate: createCheckoutSchema,
  }
);
