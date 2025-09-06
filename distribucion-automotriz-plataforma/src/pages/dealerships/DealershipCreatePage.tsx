// src/pages/dealerships/DealershipCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDealership } from '../../services/dealershipService';
import { Dealership } from '../../models/dealership';

const DealershipCreatePage: React.FC = () => {
  const [dealership, setDealership] = useState<Omit<Dealership, 'id'>>({
    name: '',
    address: { street: '', city: '', state: '', zip: '' },
    contactInfo: { phone: '', email: '' },
    creditLine: 0,
    region: ''
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDealership(prev => ({ 
        ...prev, 
        [parent]: { ...prev[parent as keyof typeof prev], [child]: value } 
      }));
    } else {
      setDealership(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDealership(dealership);
      navigate('/dealerships');
    } catch (err) {
      setError('Failed to create dealership');
    }
  };

  return (
    <div>
      <h2>Add New Dealership</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <input name="name" value={dealership.name} onChange={handleChange} placeholder="Name" required />
        <input name="region" value={dealership.region} onChange={handleChange} placeholder="Region" />
        <input name="creditLine" type="number" value={dealership.creditLine} onChange={handleChange} placeholder="Credit Line" />
        
        {/* Address */}
        <input name="address.street" value={dealership.address.street} onChange={handleChange} placeholder="Street" />
        <input name="address.city" value={dealership.address.city} onChange={handleChange} placeholder="City" />
        <input name="address.state" value={dealership.address.state} onChange={handleChange} placeholder="State" />
        <input name="address.zip" value={dealership.address.zip} onChange={handleChange} placeholder="ZIP Code" />

        {/* Contact Info */}
        <input name="contactInfo.phone" value={dealership.contactInfo.phone} onChange={handleChange} placeholder="Phone" />
        <input name="contactInfo.email" type="email" value={dealership.contactInfo.email} onChange={handleChange} placeholder="Email" />

        <button type="submit">Create</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  );
};

export default DealershipCreatePage;
