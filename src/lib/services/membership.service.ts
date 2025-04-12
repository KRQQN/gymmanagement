import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/api-response";
import { stripe } from "@/lib/stripe";
import { MembershipStatus } from "@prisma/client";

export class MembershipService {
  static async getMembership(userId: string) {
    try {
      const membership = await prisma.membership.findUnique({
        where: { userId },
        include: {
          plan: {
            include: {
              gym: true
            }
          }
        }
      });

      return ApiResponse.success(membership);
    } catch (error) {
      console.error("Error fetching membership:", error);
      return ApiResponse.error("Failed to fetch membership");
    }
  }

  static async cancelMembership(userId: string) {
    try {
      // Get user's active membership
      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          status: MembershipStatus.ACTIVE,
          endDate: {
            gte: new Date(),
          },
        },
      });

      if (!membership) {
        return ApiResponse.notFound("No active membership found");
      }

      // Update membership status to CANCELLED
      const updatedMembership = await prisma.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          status: MembershipStatus.CANCELLED,
        },
      });

      return ApiResponse.success({
        message: "Membership cancelled successfully",
        membership: {
          id: updatedMembership.id,
          status: updatedMembership.status,
          endDate: updatedMembership.endDate,
        },
      });
    } catch (error) {
      console.error("Error cancelling membership:", error);
      return ApiResponse.error("Failed to cancel membership");
    }
  }

  static async deleteMembership(userId: string) {
    try {
      const deletedMembership = await prisma.membership.delete({
        where: { userId },
      });

      return ApiResponse.success(deletedMembership);
    } catch (error) {
      console.error("Error deleting membership:", error);
      return ApiResponse.error("Failed to delete membership");
    }
  }

  static async createCheckoutSession(userId: string, planId: string) {
    try {
      // Get the selected plan
      const plan = await prisma.membershipPlan.findUnique({
        where: {
          id: planId,
        },
        include: {
          gym: true,
        },
      });

      if (!plan) {
        return ApiResponse.notFound("Plan not found");
      }

      // Create Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: plan.name,
                description: plan.description,
              },
              unit_amount: Math.round(plan.price * 100),
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/gyms/${plan.gym.id}/memberships/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/gyms/${plan.gym.id}/memberships`,
        metadata: {
          userId,
          planId: plan.id,
        },
      });

      return ApiResponse.success({
        url: checkoutSession.url,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return ApiResponse.error("Failed to create checkout session");
    }
  }
} 