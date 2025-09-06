// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import DealershipsListPage from './pages/dealerships/DealershipsListPage';
import DealershipCreatePage from './pages/dealerships/DealershipCreatePage';
import DealershipEditPage from './pages/dealerships/DealershipEditPage';
import InventoryPage from './pages/vehicles/InventoryPage';
import B2BOrderPage from './pages/sales/B2BOrderPage';
import SellVehiclePage from './pages/sales/SellVehiclePage';
import DashboardPage from './pages/dashboards/DashboardPage'; // Import the new page

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="dealerships" element={<DealershipsListPage />} />
        <Route path="dealerships/new" element={<DealershipCreatePage />} />
        <Route path="dealerships/edit/:id" element={<DealershipEditPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="b2b-orders" element={<B2BOrderPage />} />
        <Route path="sell-vehicle/:vin" element={<SellVehiclePage />} />
        <Route path="dashboard" element={<DashboardPage />} /> {/* Add the new route */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
