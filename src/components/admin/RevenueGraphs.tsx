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
  ChartOptions,
} from 'chart.js';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchRevenueData();
    }
  }, [status, session]);

  const fetchRevenueData = async () => {
    try {
      console.log('Fetching revenue data...');
      const response = await fetch('/api/cms/revenue-history');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch revenue data');
      }
      
      const data = await response.json();
      console.log('Revenue data:', data);
      setRevenueData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading revenue graphs...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-red-500">Error loading revenue data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!revenueData.length) {
    return (
      <div className="p-6 bg-card rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">No revenue data available</h3>
        <p>There is no revenue data to display for the selected time period.</p>
      </div>
    );
  }

  const labels = revenueData.map(data => format(new Date(data.month), 'MMM yyyy'));
  const rawRevenueData = revenueData.map(data => data.rawRevenue);
  const accrualRevenueData = revenueData.map(data => data.accrualRevenue);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
          callback: function(value) {
            return `$${Number(value).toFixed(2)}`;
          },
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
      <div style={{ width: '100%', height: '400px' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
} 