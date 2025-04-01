"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueDisplay } from "@/components/admin/RevenueDisplay";
import { RevenueGraphs } from "@/components/admin/RevenueGraphs";

interface Stats {
  totalMembers: number;
  newMembers: number;
  activeMembers: number;
  todayCheckIns: number;
  rawRevenue: number;
  accrualRevenue: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/cms/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    if (session?.user?.role === "ADMIN") {
      fetchStats();
    }
  }, [session]);

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

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Members</h3>
            <p className="text-3xl font-bold">{stats.totalMembers}</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Members</h3>
            <p className="text-3xl font-bold">{stats.activeMembers}</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Today's Check-ins</h3>
            <p className="text-3xl font-bold">{stats.todayCheckIns}</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">New Members</h3>
            <p className="text-3xl font-bold">{stats.newMembers}</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <RevenueDisplay />
      </div>

      <div className="mb-8">
        <RevenueGraphs />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Members</h2>
          <p className="text-muted-foreground">Manage gym members</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/members">View Members</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Memberships</h2>
          <p className="text-muted-foreground">Manage membership plans</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/memberships">View Plans</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Check-ins</h2>
          <p className="text-muted-foreground">View member check-ins</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/check-ins">View Check-ins</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Payments</h2>
          <p className="text-muted-foreground">Track payment history</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/payments">View Payments</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Reports</h2>
          <p className="text-muted-foreground">Generate and view reports</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/reports">View Reports</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">Configure system settings</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/settings">Manage Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 