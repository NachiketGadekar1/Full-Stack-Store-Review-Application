import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard stats.');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Total Stores</h4>
            <p>{stats.totalStores}</p>
          </div>
          <div className="stat-card">
            <h4>Total Ratings</h4>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}

export default AdminDashboard;
