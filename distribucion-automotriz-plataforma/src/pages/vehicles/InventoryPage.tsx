// src/pages/vehicles/InventoryPage.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ManufacturerInventoryPage from './ManufacturerInventoryPage';
import DealershipInventoryPage from './DealershipInventoryPage';

const InventoryPage: React.FC = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role === 'manufacturer_admin') {
    return <ManufacturerInventoryPage />;
  } else if (role) { // Assumes any other role is dealership-related
    return <DealershipInventoryPage />;
  } else {
    return <div>You do not have permission to view this page.</div>;
  }
};

export default InventoryPage;
