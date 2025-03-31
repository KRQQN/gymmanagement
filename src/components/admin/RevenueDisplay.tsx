import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface RevenueDetail {
  memberId: string;
  memberName: string;
  planName: string;
  totalPrice: number;
  totalDays: number;
  daysInCurrentMonth: number;
  dailyRate: number;
  monthlyRevenue: number;
  startDate: string;
  endDate: string;
}

interface Stats {
  totalMembers: number;
  activeMembers: number;
  todayCheckIns: number;
  monthlyRevenue: number; // Raw monthly revenue
  accrualMonthlyRevenue: number; // Accrual-based monthly revenue
  revenueDetails: RevenueDetail[];
}

export function RevenueDisplay() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cms/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading revenue data...</div>;
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Monthly Revenue Details (Accrual Basis)</h3>
      <div className="text-3xl font-bold mb-4">
        ${stats?.accrualMonthlyRevenue.toFixed(2)}
      </div>
      <div className="text-sm text-muted-foreground mb-4">
        {format(new Date(), 'MMMM yyyy')}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Membership Details</h3>
        <div className="space-y-2">
          {stats?.revenueDetails.map((detail) => (
            <div key={detail.memberId} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{detail.memberName}</span>
                <span className="text-muted-foreground ml-2">({detail.planName})</span>
              </div>
              <div className="text-right">
                <div>${detail.monthlyRevenue.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {detail.daysInCurrentMonth} days at ${detail.dailyRate.toFixed(2)}/day
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 