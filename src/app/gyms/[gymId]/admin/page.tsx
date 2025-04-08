import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueDisplay } from "@/components/admin/RevenueDisplay";
import { RevenueGraphs } from "@/components/admin/RevenueGraphs";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { headers } from 'next/headers';

async function getAdminStats(gymId: string) {
  const headersList = headers();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/gyms/${gymId}/admin/stats`, {
    headers: {
      cookie: (await headersList).get('cookie') || '',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
}

// Create a client component for the revenue section
function RevenueSection({ gymId }: { gymId: string }) {
  "use client";
  return (
    <>
      <div className="mb-8">
        <RevenueDisplay />
      </div>
      <div className="mb-8">
        <RevenueGraphs />
      </div>
    </>
  );
}

export default async function AdminDashboardPage({ params }: { params: { gymId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session?.user.role !== "ADMIN") {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const { gymId } = params;
  
  let data;
  try {
    data = await getAdminStats(gymId);
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>Failed to fetch dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { totalMembers, newMembers, activeMembers, todayCheckIns } = data;

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

      <RevenueSection gymId={gymId} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Members</h2>
          <p className="text-muted-foreground">Manage gym members</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/members`}>View Members</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Memberships</h2>
          <p className="text-muted-foreground">Manage membership plans</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/memberships`}>View Plans</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Check-ins</h2>
          <p className="text-muted-foreground">View member check-ins</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/check-ins`}>View Check-ins</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Payments</h2>
          <p className="text-muted-foreground">Track payment history</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/payments`}>View Payments</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Reports</h2>
          <p className="text-muted-foreground">Generate and view reports</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/reports`}>View Reports</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">Configure system settings</p>
          <Button className="mt-4" asChild>
            <Link href={`/gyms/${gymId}/admin/settings`}>Manage Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 