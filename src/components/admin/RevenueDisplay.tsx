"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface RevenueData {
  monthlyRevenue: Array<{
    month: string;
    rawRevenue: number;
    accrualRevenue: number;
  }>;
  revenueByMethod: Array<{
    paymentMethod: string;
    _sum: {
      amount: number;
    };
  }>;
  pendingPayments: number;
  membershipDetails: Array<{
    planName: string;
    count: number;
    totalRevenue: number;
    monthlyRevenue: number;
  }>;
}

export function RevenueDisplay() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard/financial-stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      const data = await response.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (!revenueData) {
    return <div>No data available</div>;
  }

  // Get current month's revenue
  const currentMonth = revenueData.monthlyRevenue[5]; // Index 5 is the current month
  const rawRevenue = currentMonth?.rawRevenue || 0;
  const accrualRevenue = currentMonth?.accrualRevenue || 0;

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Current Month Revenue</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-muted-foreground">Raw Revenue</h4>
          <p className="text-2xl font-bold">${rawRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total payments received this month</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-muted-foreground">Accrual Revenue</h4>
          <p className="text-2xl font-bold">${accrualRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Expected revenue based on active memberships</p>
        </div>
      </div>
    </div>
  );
} 