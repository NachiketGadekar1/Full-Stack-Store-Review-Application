import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function StoreOwnerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch store owner dashboard data.');
      }
    };

    if (user && user.role === 'owner') {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {dashboardData ? (
        <div>
          <h3>Store: {dashboardData.storeName}</h3>
          <p>Average Rating: {dashboardData.averageRating.toFixed(2)}</p>

          <h4>Users Who Rated Your Store:</h4>
          {dashboardData.usersWhoRated.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.usersWhoRated.map((rater) => (
                  <tr key={rater.id}>
                    <td>{rater.name}</td>
                    <td>{rater.email}</td>
                    <td>{rater.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users have rated your store yet.</p>
          )}
        </div>
      ) : (
        <p>Loading store owner dashboard data...</p>
      )}
    </div>
  );
}

export default StoreOwnerDashboard;
