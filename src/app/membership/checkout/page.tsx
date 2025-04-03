"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const planId = searchParams.get("planId");
    if (!planId) {
      router.push("/membership");
      return;
    }

    async function fetchPlan() {
      try {
        const response = await fetch(`/api/membership/plans/${planId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch plan");
        }
        const data = await response.json();
        setPlan(data.plan);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load membership plan",
          variant: "destructive",
        });
        router.push("/membership");
      }
    }

    fetchPlan();
  }, [searchParams, router, toast]);

  const handleProceedToPayment = async () => {
    if (!plan) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Review your membership plan before proceeding to payment
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
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

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={handleProceedToPayment}
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 