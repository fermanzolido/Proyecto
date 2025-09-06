// src/pages/dealerships/DealershipsListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDealerships, deleteDealership } from '../../services/dealershipService';
import { Dealership } from '../../models/dealership';

const DealershipsListPage: React.FC = () => {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const data = await getDealerships();
        setDealerships(data);
      } catch (err) {
        setError('Failed to fetch dealerships');
      } finally {
        setLoading(false);
      }
    };

    fetchDealerships();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dealership?')) {
      try {
        await deleteDealership(id);
        setDealerships(dealerships.filter(d => d.id !== id));
      } catch (err) {
        setError('Failed to delete dealership');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Dealerships</h2>
      <Link to="/dealerships/new">Add New Dealership</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dealerships.map(dealership => (
            <tr key={dealership.id}>
              <td>{dealership.name}</td>
              <td>{dealership.region}</td>
              <td>{dealership.address.city}</td>
              <td>
                <Link to={`/dealerships/edit/${dealership.id}`}>Edit</Link>
                <button onClick={() => handleDelete(dealership.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealershipsListPage;
