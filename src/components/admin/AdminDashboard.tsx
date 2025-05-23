import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueSectionClient } from "@/components/admin/RevenueSectionClient";

interface AdminDashboardProps {
  data: {
    totalMembers: number;
    newMembers: number;
    activeMembers: number;
    todayCheckIns: number;
    rawRevenue: number;
    accrualRevenue: number;
    memberships: Array<{
      planName: string;
      count: number;
      totalRevenue: number;
      monthlyRevenue: number;
    }>;
  };
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { totalMembers, newMembers, activeMembers, todayCheckIns, memberships } = data;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage gym operations and member data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Members</h3>
          <p className="text-3xl font-bold">{totalMembers}</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Members</h3>
          <p className="text-3xl font-bold">{activeMembers}</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Check-ins</h3>
          <p className="text-3xl font-bold">{todayCheckIns}</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">New Members</h3>
          <p className="text-3xl font-bold">{newMembers}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
      </div>

      <RevenueSectionClient />

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