// src/pages/sales/SellVehiclePage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addCustomer } from '../../services/customerService';
import { sellVehicle } from '../../services/vehicleService';
import { Customer } from '../../models/customer';
import { serverTimestamp } from 'firebase/firestore';

const SellVehiclePage: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const { dealershipId } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Omit<Customer, 'id' | 'dealershipId' | 'vehicleVIN' | 'saleDate'>>({
    name: '',
    address: { street: '', city: '', state: '', zip: '' },
    finalPrice: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = e.target.type === 'number' ? parseFloat(value) : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomer(prev => ({ 
        ...prev, 
        [parent]: { ...(prev as any)[parent], [child]: parsedValue } 
      }));
    } else {
      setCustomer(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || !dealershipId) {
      setError('Missing vehicle or dealership information.');
      return;
    }

    try {
      // 1. Create the customer document
      const customerData = {
        ...customer,
        dealershipId,
        vehicleVIN: vin,
        saleDate: serverTimestamp(),
      };
      const customerRef = await addCustomer(customerData);

      // 2. Update the vehicle status to 'sold'
      await sellVehicle(vin, customerRef.id);

      alert('Vehicle marked as sold!');
      navigate('/inventory');
    } catch (err) {
      setError('Failed to complete the sale.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Sell Vehicle: {vin}</h2>
      <p>Enter final customer information:</p>
      <form onSubmit={handleSubmit}>
        <input name="name" value={customer.name} onChange={handleChange} placeholder="Customer Name" required />
        <input name="finalPrice" type="number" value={customer.finalPrice} onChange={handleChange} placeholder="Final Price" required />
        
        <h4>Customer Address</h4>
        <input name="address.street" value={customer.address.street} onChange={handleChange} placeholder="Street" required />
        <input name="address.city" value={customer.address.city} onChange={handleChange} placeholder="City" required />
        <input name="address.state" value={customer.address.state} onChange={handleChange} placeholder="State" required />
        <input name="address.zip" value={customer.address.zip} onChange={handleChange} placeholder="ZIP Code" required />

        <button type="submit">Complete Sale</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  );
};

export default SellVehiclePage;
