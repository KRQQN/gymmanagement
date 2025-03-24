"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CheckIn {
  id: string;
  date: string;
  time: string;
  duration: number;
}

export default function CheckIns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCheckIns() {
      try {
        const response = await fetch("/api/user/check-ins");
        if (!response.ok) {
          throw new Error("Failed to fetch check-ins");
        }
        const data = await response.json();
        setCheckIns(data.checkIns);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load check-in history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchCheckIns();
    }
  }, [status, toast]);

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
        <h1 className="text-3xl font-bold">Check-in History</h1>
        <p className="text-muted-foreground">
          View your gym visit history
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {checkIns.length > 0 ? (
          <div className="space-y-4">
            {checkIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="rounded-lg border bg-card p-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(checkIn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{checkIn.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{checkIn.duration} minutes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold">No Check-ins Yet</h2>
              <p className="mt-2 text-muted-foreground">
                You haven't checked in to the gym yet. Start your fitness journey today!
              </p>
              <Button className="mt-4" asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 