"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function MembershipSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function processSubscription() {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          throw new Error("No session ID provided");
        }

        // Call the API to process the subscription
        const response = await fetch("/api/membership/process-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to process subscription");
        }

        // Redirect to dashboard after successful processing
        router.push("/dashboard");
      } catch (error) {
        console.error("Error processing subscription:", error);
        setError(error instanceof Error ? error.message : "Failed to process subscription");
      } finally {
        setIsProcessing(false);
      }
    }

    if (status === "authenticated" && session?.user) {
      processSubscription();
    }
  }, [searchParams, router, status, session]);

  if (status === "loading" || isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Processing your subscription...</p>
          <p className="text-sm text-muted-foreground">Please wait while we set up your membership.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-destructive/10 rounded-lg">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-center">{error}</p>
          <button
            onClick={() => router.push("/membership")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Membership
          </button>
        </div>
      </div>
    );
  }

  return null;
} 
