import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MemberDashboardProps {
  data: {
    membershipStatus: string;
    recentCheckIns: number;
    nextPaymentDate: string;
    membershipPlan: string;
  };
}

export function MemberDashboard({ data }: MemberDashboardProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Member Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your gym membership and view your activity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Membership Status</h2>
          <p className="text-muted-foreground">{data.membershipStatus}</p>
          <p className="text-sm font-medium mt-2">Plan: {data.membershipPlan}</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/membership">View Details</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Recent Check-ins</h2>
          <p className="text-muted-foreground">{data.recentCheckIns} check-ins this month</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/check-ins">View History</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Next Payment</h2>
          <p className="text-muted-foreground">Due: {data.nextPaymentDate}</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/payments">View Payments</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/profile">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 