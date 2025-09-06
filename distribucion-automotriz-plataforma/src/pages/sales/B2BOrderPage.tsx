// src/pages/sales/B2BOrderPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAvailableVehiclesByDealership } from '../../services/vehicleService';
import { createSalesOrder } from '../../services/salesOrderService';
import { Vehicle } from '../../models/vehicle';

const B2BOrderPage: React.FC = () => {
  const { dealershipId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVins, setSelectedVins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !dealershipId) return;

    const fetchVehicles = async () => {
      try {
        const data = await getAvailableVehiclesByDealership(dealershipId);
        setVehicles(data);
      } catch (err) {
        setError('Failed to fetch available vehicles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [dealershipId, authLoading]);

  const handleSelectVehicle = (vin: string) => {
    setSelectedVins(prev => 
      prev.includes(vin) ? prev.filter(v => v !== vin) : [...prev, vin]
    );
  };

  const handleSubmitOrder = async () => {
    if (selectedVins.length === 0) {
      alert('Please select at least one vehicle.');
      return;
    }
    if (!dealershipId) return;

    try {
      await createSalesOrder({ dealershipId, vehicleVINs: selectedVins });
      alert('Order created successfully!');
      navigate('/inventory'); // Or to an order confirmation page
    } catch (err) {
      setError('Failed to create order.');
    }
  };

  if (loading || authLoading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!dealershipId) return <div>You must be part of a dealership to create an order.</div>

  return (
    <div>
      <h2>Create B2B Sales Order</h2>
      <p>Select available vehicles to order:</p>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }}>
        {vehicles.map(vehicle => (
          <div key={vehicle.vin}>
            <input 
              type="checkbox" 
              id={vehicle.vin} 
              checked={selectedVins.includes(vehicle.vin)}
              onChange={() => handleSelectVehicle(vehicle.vin)}
            />
            <label htmlFor={vehicle.vin}>{vehicle.model} ({vehicle.vin})</label>
          </div>
        ))}
        <br />
        <button type="submit" disabled={selectedVins.length === 0}>Submit Order</button>
      </form>
    </div>
  );
};

export default B2BOrderPage;
