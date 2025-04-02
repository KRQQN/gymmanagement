"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MembershipSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleSuccess() {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        toast({
          title: "Error",
          description: "Invalid session",
          variant: "destructive",
        });
        router.push("/membership");
        return;
      }

      try {
        const response = await fetch("/api/membership/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process payment");
        }

        toast({
          title: "Success",
          description: "Your membership has been activated",
        });

        router.push("/dashboard/membership");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process payment",
          variant: "destructive",
        });
        router.push("/membership");
      } finally {
        setIsLoading(false);
      }
    }

    handleSuccess();
  }, [router, searchParams, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return null;
} 