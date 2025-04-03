"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MembershipSignUp } from "@/components/membership/MembershipSignUp";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function MembershipPlans() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/membership/plans");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load membership plans",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, [toast]);

  async function handleSelectPlan(plan: Plan) {
    if (!session) {
      setSelectedPlan(plan);
    } else {
      try {
        const response = await fetch("/api/membership/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: plan.id,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create checkout session");
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create checkout session",
          variant: "destructive",
        });
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (selectedPlan) {
    return (
      <MembershipSignUp
        planId={selectedPlan.id}
        planName={selectedPlan.name}
        planPrice={selectedPlan.price}
      />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Membership Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Choose the perfect membership plan for your fitness journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border bg-card p-6"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-muted-foreground">
                  {plan.description}
                </p>
                <p className="mt-4 text-2xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSelectPlan(plan)}
              >
                Select Plan
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 