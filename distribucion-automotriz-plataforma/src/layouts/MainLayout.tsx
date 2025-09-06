// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { signOut } from '../services/authService';
import { useAuth } from '../hooks/useAuth'; // Import useAuth

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth(); // Get the user's role

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isDealer = role && role !== 'manufacturer_admin';

  return (
    <div>
      <header>
        <h1>Automotive Platform</h1>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/dashboard">Dashboard</Link> | 
          <Link to="/inventory">Inventory</Link>
          {/* Show Dealerships link only to manufacturer admins */}
          {role === 'manufacturer_admin' && (
            <>
              {' | '}
              <Link to="/dealerships">Manage Dealerships</Link>
            </>
          )}
          {/* Show B2B Order link only to dealership users */}
          {isDealer && (
            <>
              {' | '}
              <Link to="/b2b-orders">Create B2B Order</Link>
            </>
          )}
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 Automotive Distribution Platform</p>
      </footer>
    </div>
  );
};

export default MainLayout;
