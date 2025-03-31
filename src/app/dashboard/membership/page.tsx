"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Membership {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
}

export default function Membership() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchMembership() {
      try {
        const response = await fetch("/api/user/membership");
        if (!response.ok) {
          throw new Error("Failed to fetch membership");
        }
        const data = await response.json();
        setMembership(data.membership);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load membership information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchMembership();
    }
  }, [status, toast]);

  async function handleCancelSubscription() {
    try {
      const response = await fetch("/api/membership/cancel", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to cancel subscription");
      }

      toast({
        title: "Success",
        description: "Your subscription has been cancelled",
      });

      // Refresh membership data
      const membershipResponse = await fetch("/api/user/membership");
      if (membershipResponse.ok) {
        const data = await membershipResponse.json();
        setMembership(data.membership);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="text-muted-foreground">
          View and manage your gym membership
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {membership ? (
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Membership Details</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{membership.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{membership.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(membership.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {new Date(membership.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">${membership.price}/month</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <a href="/dashboard/membership/payment">Make Payment</a>
                </Button>
                {membership.status === "ACTIVE" && (
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No Active Membership</h2>
              <p className="mt-2 text-muted-foreground">
                You don't have an active membership. Choose a plan to get started.
              </p>
              <Button className="mt-4" asChild>
                <a href="/membership">View Plans</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 