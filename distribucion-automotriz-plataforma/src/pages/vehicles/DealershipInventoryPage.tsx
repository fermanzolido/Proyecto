// src/pages/vehicles/DealershipInventoryPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../../hooks/useAuth';
import { getVehiclesByDealership } from '../../services/vehicleService';
import { Vehicle } from '../../models/vehicle';

// This component will display the inventory for a dealership user.
// TODO: This can be enhanced to be an "advanced data table" with sorting, filtering, and pagination
// using a library like react-table or ag-grid.

const DealershipInventoryPage: React.FC = () => {
  const { dealershipId, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth state to be determined

    if (!dealershipId) {
      setError('You are not associated with a dealership.');
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        const data = await getVehiclesByDealership(dealershipId);
        setVehicles(data);
      } catch (err) {
        setError('Failed to fetch vehicle inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [dealershipId, authLoading]);

  if (loading || authLoading) return <div>Loading inventory...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>My Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>VIN</th>
            <th>Model</th>
            <th>Trim</th>
            <th>Color</th>
            <th>Status</th>
            <th>List Price</th>
            <th>Actions</th> {/* Add Actions column */}
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.vin}>
              <td>{vehicle.vin}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.trim}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.status}</td>
              <td>${vehicle.listPrice.toLocaleString()}</td>
              <td>
                {/* Show link only if vehicle is not already sold */}
                {vehicle.status !== 'sold' && (
                  <Link to={`/sell-vehicle/${vehicle.vin}`}>Mark as Sold</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealershipInventoryPage;
