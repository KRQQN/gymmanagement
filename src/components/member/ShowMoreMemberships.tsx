"use client";
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

interface GymWithPlans {
  id: string;
  name: string;
  plans: Plan[];
}

const fetchGyms = async (gymId?: string) => {
  const gymsResponse = await fetch(`/api/gyms`, { cache: "force-cache" });
  const gyms = await gymsResponse.json();
  if (gymId) return gyms.filter((gym: any) => gym.id !== gymId);
  return gyms;
};

const RenderMemberships = ({ excludeGymId }: { excludeGymId: string }) => {
  const [gyms, setGyms] = useState<GymWithPlans[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showMore && gyms.length === 0) {
      setLoading(true);
      fetchGyms(excludeGymId)
        .then(async (gymsData) => {
          const gymsWithPlans = await Promise.all(
            gymsData.map(async (gym: any) => {
              try {
                const response = await fetch(`/api/gyms/${gym.id}/plans`);
                if (!response.ok) {
                  throw new Error("Failed to fetch plans");
                }
                const data = await response.json();
                return {
                  ...gym,
                  plans: data.plans,
                };
              } catch (error) {
                console.error(`Failed to fetch plans for gym ${gym.id}:`, error);
                return {
                  ...gym,
                  plans: [],
                };
              }
            })
          );
          setGyms(gymsWithPlans);
        })
        .catch((err) => {
          console.error("Failed to fetch gyms:", err);
          toast({
            title: "Error",
            description: "Failed to load gyms. Please try again later.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showMore, excludeGymId, toast]);

  return (
    <div className="mt-8">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-primary hover:text-primary/80 transition-colors text-lg font-bold"
        >
          {showMore ? "Hide Other Gyms" : "Show Other Gyms"}
        </button>
      </div>

      {showMore && (
        <div className="space-y-8">
          {loading ? (
            <div className="col-span-full text-center text-muted-foreground">
              Loading gyms and memberships...
            </div>
          ) : (
            gyms.map((gym) => (
              <div key={gym.id} className="space-y-4">
                <h2 className="text-2xl font-bold text-white">{gym.name}</h2>
                {gym.plans.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gym.plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-lg border bg-card p-6 flex flex-col justify-between h-full"
                      >
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
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
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Cross-gym membership feature will be available soon!",
                            });
                          }}
                        >
                          Select Plan
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No membership plans available at this gym.</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RenderMemberships; 