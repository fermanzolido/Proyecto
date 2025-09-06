// src/pages/dashboards/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ManufacturerDashboard from './ManufacturerDashboard';
import DealershipDashboard from './DealershipDashboard';

const DashboardPage: React.FC = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (role === 'manufacturer_admin') {
    return <ManufacturerDashboard />;
  } else if (role) { // Assumes any other role is dealership-related
    return <DealershipDashboard />;
  } else {
    return <div>You do not have permission to view dashboards.</div>;
  }
};

export default DashboardPage;
