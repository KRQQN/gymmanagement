"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage gym operations and member data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Members</h2>
          <p className="text-muted-foreground">Manage gym members</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/members">View Members</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Memberships</h2>
          <p className="text-muted-foreground">Manage membership plans</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/memberships">View Plans</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Check-ins</h2>
          <p className="text-muted-foreground">View member check-ins</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/check-ins">View Check-ins</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Payments</h2>
          <p className="text-muted-foreground">Track payment history</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/payments">View Payments</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Reports</h2>
          <p className="text-muted-foreground">Generate and view reports</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/reports">View Reports</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">Configure system settings</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/settings">Manage Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 