// src/pages/dealerships/DealershipEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDealership, updateDealership } from '../../services/dealershipService';
import { Dealership } from '../../models/dealership';

const DealershipEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dealership, setDealership] = useState<Partial<Dealership>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDealership = async () => {
      try {
        const data = await getDealership(id);
        if (data) {
          setDealership(data);
        } else {
          setError('Dealership not found');
        }
      } catch (err) {
        setError('Failed to fetch dealership');
      } finally {
        setLoading(false);
      }
    };
    fetchDealership();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = e.target.type === 'number' ? parseFloat(value) : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDealership(prev => ({ 
        ...prev, 
        [parent]: { ...(prev as any)[parent], [child]: parsedValue } 
      }));
    } else {
      setDealership(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateDealership(id, dealership);
      navigate('/dealerships');
    } catch (err) {
      setError('Failed to update dealership');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Edit Dealership</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={dealership.name || ''} onChange={handleChange} placeholder="Name" required />
        <input name="region" value={dealership.region || ''} onChange={handleChange} placeholder="Region" />
        <input name="creditLine" type="number" value={dealership.creditLine || 0} onChange={handleChange} placeholder="Credit Line" />
        
        <input name="address.street" value={dealership.address?.street || ''} onChange={handleChange} placeholder="Street" />
        <input name="address.city" value={dealership.address?.city || ''} onChange={handleChange} placeholder="City" />
        <input name="address.state" value={dealership.address?.state || ''} onChange={handleChange} placeholder="State" />
        <input name="address.zip" value={dealership.address?.zip || ''} onChange={handleChange} placeholder="ZIP Code" />

        <input name="contactInfo.phone" value={dealership.contactInfo?.phone || ''} onChange={handleChange} placeholder="Phone" />
        <input name="contactInfo.email" type="email" value={dealership.contactInfo?.email || ''} onChange={handleChange} placeholder="Email" />

        <button type="submit">Update</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  );
};

export default DealershipEditPage;
