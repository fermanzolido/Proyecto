// src/pages/dashboards/ManufacturerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { getManufacturerAnalytics } from '../../services/analyticsService';
import { ManufacturerAnalytics } from '../../models/analytics';

// TODO: Import and use actual chart and map components
// import { Line } from 'react-chartjs-2';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const ManufacturerDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<ManufacturerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getManufacturerAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to fetch manufacturer analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading Manufacturer Dashboard...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!analytics) return <div>No analytics data available. The scheduled function may not have run yet.</div>;

  return (
    <div>
      <h2>Manufacturer Dashboard</h2>
      <div className="kpi-container">
        <div>
          <h4>Total Network Inventory</h4>
          <p>{analytics.totalNetworkInventory}</p>
        </div>
        <div>
          <h4>Inventory Turnover Rate</h4>
          <p>{(analytics.inventoryTurnoverRate * 100).toFixed(2)}%</p>
        </div>
        <div>
          <h4>Sales vs. Forecast</h4>
          <p>{analytics.salesVsForecast.actual} / {analytics.salesVsForecast.forecast}</p>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h4>Sales by Region</h4>
          {/* Placeholder for Sales by Region Map */}
          <div style={{height: '300px', background: '#eee', textAlign: 'center', lineHeight: '300px'}}>Map Placeholder</div>
        </div>
        {/* Add other charts here */}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
