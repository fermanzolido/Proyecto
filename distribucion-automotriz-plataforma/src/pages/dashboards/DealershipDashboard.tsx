// src/pages/dashboards/DealershipDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getDealershipAnalytics } from '../../services/analyticsService';
import { DealershipAnalytics } from '../../models/analytics';

// TODO: Import and use actual chart components
// import { Line, Bar } from 'react-chartjs-2';

const DealershipDashboard: React.FC = () => {
  const { dealershipId, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<DealershipAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !dealershipId) return;

    const fetchData = async () => {
      try {
        const data = await getDealershipAnalytics(dealershipId);
        setAnalytics(data);
      } catch (err) {
        setError('Failed to fetch dealership analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dealershipId, authLoading]);

  if (loading || authLoading) return <div>Loading Dealership Dashboard...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!analytics) return <div>No analytics data available. The scheduled function may not have run yet.</div>;

  return (
    <div>
      <h2>Dealership Dashboard</h2>
      <div className="kpi-container">
        <div>
          <h4>Performance vs. Region</h4>
          <p>My Sales: {analytics.regionalAverageComparison.dealershipSales}</p>
          <p>Region Avg: {analytics.regionalAverageComparison.regionalAverage.toFixed(2)}</p>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h4>Monthly Sales Volume</h4>
          {/* Placeholder for Monthly Sales Chart */}
          <div style={{height: '300px', background: '#eee', textAlign: 'center', lineHeight: '300px'}}>Line Chart Placeholder</div>
        </div>
        <div className="chart">
          <h4>Turnover by Model</h4>
          {/* Placeholder for Turnover by Model Chart */}
          <div style={{height: '300px', background: '#eee', textAlign: 'center', lineHeight: '300px'}}>Bar Chart Placeholder</div>
        </div>
      </div>
    </div>
  );
};

export default DealershipDashboard;
