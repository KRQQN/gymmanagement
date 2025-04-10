"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MembershipSignUp } from "@/components/membership/MembershipSignUp";
import ShowMoreMemberships from "@/components/member/ShowMoreMemberships";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function MembershipPlans({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = use(params);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`/api/gyms/${gymId}/plans`);
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

  useEffect(() => {
    const planId = searchParams.get("planId");
    if (planId && plans.length > 0) {
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [searchParams, plans]);

  async function handleSelectPlan(plan: Plan) {
    if (!session) {
      setSelectedPlan(plan);
    } else {
      try {
        const response = await fetch("/api/memberships/checkout", {
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

  if (plans.length < 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">No membership plans found for {gymId}</h1>
      </div>
    );
  }

  if (selectedPlan && !session) {
    return (
      <MembershipSignUp
      gymId={gymId}
        planId={selectedPlan.id}
        planName={selectedPlan.name}
        planPrice={selectedPlan.price}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Membership Plans</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border bg-card p-6 flex flex-col justify-between h-full"
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
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => handleSelectPlan(plan)}
            >
              Select Plan
            </Button>
          </div>
        ))}
      </div>

      <ShowMoreMemberships gymId={gymId} />
    </div>
  );
} 