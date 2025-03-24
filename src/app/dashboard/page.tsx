"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}!</h1>
        <p className="text-muted-foreground">
          Manage your gym membership and view your activity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Membership Status</h2>
          <p className="text-muted-foreground">Active</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/membership">View Details</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Recent Check-ins</h2>
          <p className="text-muted-foreground">No recent check-ins</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/check-ins">View History</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Payment History</h2>
          <p className="text-muted-foreground">No recent payments</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/payments">View Payments</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/dashboard/profile">Edit Profile</Link>
          </Button>
        </div>

        {session?.user?.role === "ADMIN" && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">Admin Panel</h2>
            <p className="text-muted-foreground">Manage gym operations</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/admin">Go to Admin Panel</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 