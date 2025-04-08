"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  duration: number;
}

export default function AdminCheckIns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchCheckIns() {
      try {
        const response = await fetch("/api/admin/check-ins");
        if (!response.ok) {
          throw new Error("Failed to fetch check-ins");
        }
        const data = await response.json();
        setCheckIns(data.checkIns);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load check-ins",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchCheckIns();
    }
  }, [status, session, toast]);

  const filteredCheckIns = checkIns.filter((checkIn) =>
    checkIn.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">Member Check-ins</h1>
        <p className="text-muted-foreground">
          View all member check-in history
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by member name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left text-sm font-medium">Member</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckIns.map((checkIn) => (
                <tr key={checkIn.id} className="border-b">
                  <td className="px-4 py-2">{checkIn.userName}</td>
                  <td className="px-4 py-2">
                    {new Date(checkIn.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{checkIn.time}</td>
                  <td className="px-4 py-2">{checkIn.duration} minutes</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        // Handle check-in actions
                        toast({
                          title: "Coming Soon",
                          description: "Check-in management features will be available soon",
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 