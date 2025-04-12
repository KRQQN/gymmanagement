'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MembershipSignUp } from '@/components/membership/MembershipSignUp';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  gymId: string;
  gym: {
    id: string;
    name: string;
    address: string;
  };
}

interface GymWithPlans {
  id: string;
  name: string;
  address: string;
  membershipPlans: Plan[];
}

export default function MembershipPlans() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [gyms, setGyms] = useState<GymWithPlans[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`/api/gyms?includeMembershipPlans=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        setGyms(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load membership plans',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, [toast]);

  useEffect(() => {
    const planId = searchParams.get('planId');
    if (planId && gyms.length > 0) {
      // Find the plan across all gyms
      for (const gym of gyms) {
        const plan = gym.membershipPlans.find((p) => p.id === planId);
        if (plan) {
          setSelectedPlan(plan);
          break;
        }
      }
    }
  }, [searchParams, gyms]);

  async function handleSelectPlan(plan: Plan) {
    if (!session) {
      setSelectedPlan(plan);
      console.log(plan)
    } else {
      try {
        const response = await fetch('/api/memberships/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            planId: plan.id
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to create checkout session');
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to create checkout session',
          variant: 'destructive'
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

  if (gyms.length < 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">No membership plans found</h1>
      </div>
    );
  }

  if (selectedPlan && !session) {
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
        <h1 className="text-3xl font-bold">Available Membership Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Choose from our diverse range of membership options
        </p>
      </div>

      {gyms.map((gym) => (
        <div className="container mx-auto px-4 " key={gym.id}>
          <h1 className="text-3xl font-bold ml-2">{gym.name}</h1>
          <p className="text-muted-foreground mb-5 ml-2">{gym.address}</p>

          {gym.membershipPlans?.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gym.membershipPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg border bg-card p-6 flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold">{plan.name}</h2>
                      <p className="mt-2 text-muted-foreground">{plan.description}</p>
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

                  <Button className="w-full mt-6" onClick={() => handleSelectPlan(plan)}>
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No membership plans available at this gym.</p>
            </div>
          )}
                  <hr className="my-10 glass-effect" />
        </div>
      ))}

    </div>
  );
}
