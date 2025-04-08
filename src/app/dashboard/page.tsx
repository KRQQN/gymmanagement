// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MemberDashboard } from "@/components/member/MemberDashboard";
import { headers } from 'next/headers';

async function getDashboardData(gymId: string) {
  const headersList = await headers();
  const cookie = headersList.get('cookie');


  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/gyms/${gymId}/dashboard`, {
    headers: {
      cookie: cookie || '',
    },
    cache: 'no-store'
  });


  if (!response.ok) {
    const errorData = await response.json();
    console.error('Dashboard API error:', errorData);
    throw new Error(`Failed to fetch dashboard data`);
  }

  const data = await response.json();
  console.log('Dashboard data received:', data);
  return data;
}

export default async function DashboardPage() {
  console.log('Rendering dashboard page');
  const session = await getServerSession(authOptions);
  console.log('Session:', session ? 'Present' : 'Missing');
  
  if (!session?.user) {
    console.log('No session, redirecting to signin');
    redirect('/auth/signin');
  }

  if (!session.user.gymId) {
    console.log('No gymId in session');
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>No gym associated with your account. Please contact support.</p>
        </div>
      </div>
    );
  }

  try {

    const data = await getDashboardData(session.user.gymId);

    if (session.user.role === "ADMIN") {
      return <AdminDashboard data={data} />;
    } else {
      return <MemberDashboard data={data} />;
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>Failed to fetch dashboard data. Please try again later.</p>
          <div className="mt-4 p-4 bg-destructive/5 rounded">
            <p className="text-sm font-mono">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }
}