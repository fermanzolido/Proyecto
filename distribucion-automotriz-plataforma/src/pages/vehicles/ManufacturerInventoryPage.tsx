// src/pages/vehicles/ManufacturerInventoryPage.tsx
import React, { useEffect, useState } from 'react';
import { getVehicles, assignVehicleToDealership } from '../../services/vehicleService';
import { getDealerships } from '../../services/dealershipService';
import { Vehicle } from '../../models/vehicle';
import { Dealership } from '../../models/dealership';

const ManufacturerInventoryPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to manage which dealership is selected for each vehicle
  const [assignments, setAssignments] = useState<{ [vin: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, dealershipsData] = await Promise.all([
          getVehicles(),
          getDealerships()
        ]);
        setVehicles(vehiclesData);
        setDealerships(dealershipsData);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignmentChange = (vin: string, dealershipId: string) => {
    setAssignments(prev => ({ ...prev, [vin]: dealershipId }));
  };

  const handleAssign = async (vin: string) => {
    const dealershipId = assignments[vin];
    if (!dealershipId) {
      alert('Please select a dealership first.');
      return;
    }
    try {
      await assignVehicleToDealership(vin, dealershipId);
      // Refresh the vehicle list to show the change
      setVehicles(vehicles.map(v => v.vin === vin ? { ...v, dealershipId } : v));
    } catch (err) {
      setError(`Failed to assign vehicle ${vin}.`);
    }
  };

  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Manufacturer Inventory - All Vehicles</h2>
      <table>
        <thead>
          <tr>
            <th>VIN</th>
            <th>Model</th>
            <th>Status</th>
            <th>Assigned Dealership</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.vin}>
              <td>{vehicle.vin}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.status}</td>
              <td>{vehicle.dealershipId ? dealerships.find(d => d.id === vehicle.dealershipId)?.name : 'Unassigned'}</td>
              <td>
                {!vehicle.dealershipId && (
                  <>
                    <select onChange={(e) => handleAssignmentChange(vehicle.vin, e.target.value)} value={assignments[vehicle.vin] || ''}>
                      <option value="" disabled>Select Dealership</option>
                      {dealerships.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <button onClick={() => handleAssign(vehicle.vin)}>Assign</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManufacturerInventoryPage;
