"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  async function handleSelectPlan(planId: string) {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const response = await fetch("/api/membership/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to subscribe to plan");
      }

      toast({
        title: "Success",
        description: "Successfully subscribed to membership plan",
      });

      router.push("/dashboard/membership");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe to plan",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
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
                onClick={() => handleSelectPlan(plan.id)}
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