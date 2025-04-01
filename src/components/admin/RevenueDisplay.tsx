import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface RevenueData {
  rawRevenue: number;
  accrualRevenue: number;
  memberships: {
    planName: string;
    count: number;
    totalRevenue: number;
    monthlyRevenue: number;
  }[];
}

export function RevenueDisplay() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/cms/stats');
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      const data = await response.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading revenue data...</div>;
  }

  if (!revenueData) {
    return <div>No revenue data available</div>;
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Current Month Revenue</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-muted-foreground">Raw Revenue</h4>
          <p className="text-2xl font-bold">${revenueData.rawRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total payments received this month</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-muted-foreground">Accrual Revenue</h4>
          <p className="text-2xl font-bold">${revenueData.accrualRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Revenue recognized this month</p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Revenue by Membership Type</h3>
        <div className="space-y-2">
          {revenueData.memberships.map((membership) => {
            const timeLabel = membership.planName
              .replace('Annual Plan', '1 year')
              .replace('6-Month Plan', '6 month')
              .replace('Monthly Plan', '1 month')
              .replace('Day Pass', '1 day');
            
            return (
              <div key={membership.planName} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{membership.count} × </span>
                  <span className="text-muted-foreground">{timeLabel}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${membership.monthlyRevenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    This month / Full period: ${membership.totalRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 