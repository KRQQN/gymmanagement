import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subMonths, addMonths } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyRevenue {
  month: string;
  rawRevenue: number;
  accrualRevenue: number;
}

export function RevenueGraphs() {
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/cms/revenue-history');
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
    return <div>Loading revenue graphs...</div>;
  }

  const labels = revenueData.map(data => format(new Date(data.month), 'MMM yyyy'));
  const rawRevenueData = revenueData.map(data => data.rawRevenue);
  const accrualRevenueData = revenueData.map(data => data.accrualRevenue);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Raw Revenue (Payments Received)',
        data: rawRevenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Accrual Revenue (Revenue Recognized)',
        data: accrualRevenueData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
      <div className="h-[400px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
} 