import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripe";
import { MembershipStatus } from "@prisma/client";
w


export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.membership.findUnique({
        where: { userId: session.user.id },
    });

    return NextResponse.json(membership);
  } 


  export async function PATCH(req: Request) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session?.user?.email) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }
  
      // Get user by email
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
  
      // Get user's active membership
      const membership = await prisma.membership.findFirst({
        where: {
          userId: user.id,
          status: MembershipStatus.ACTIVE,
          endDate: {
            gte: new Date(),
          },
        },
      });
  
      if (!membership) {
        return NextResponse.json(
          { message: "No active membership found" },
          { status: 404 }
        );
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
  
      return NextResponse.json({
        message: "Membership cancelled successfully",
        membership: {
          id: updatedMembership.id,
          status: updatedMembership.status,
          endDate: updatedMembership.endDate,
        },
      });
    } catch (error) {
      console.error("Error cancelling membership:", error);
      return NextResponse.json(
        { message: "Error cancelling membership" },
        { status: 500 }
      );
    }
  } 

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedMembership = await prisma.membership.delete({
        where: { userId: session.user.id },
    });

    return NextResponse.json(deletedMembership);
}



export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { message: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Get the selected plan
    const plan = await prisma.membershipPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Plan not found" },
        { status: 404 }
      );
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
            unit_amount: Math.round(plan.price * 100), // Convert to cents and ensure it's an integer
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/memberships/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/memberships`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { message: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
