"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface DashboardStats {
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
  isLoading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<Omit<DashboardStats, 'isLoading' | 'error'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/gyms/${"gym001"}/admin/stats`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    ...stats,
    isLoading,
    error,
  } as DashboardStats;
} 