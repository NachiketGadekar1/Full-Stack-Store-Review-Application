import React, { useState, useEffect } from 'react';
import api from '../services/api';

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    try {
      const response = await api.get('/users/stores', { params: { search } });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleRating = async (storeId, rating) => {
    try {
      await api.post('/users/ratings', { store_id: storeId, rating });
      fetchStores(); // Refresh the list to show the new rating
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      {error && <p className="error-message">{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Search by Store Name or Address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit/Modify Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.overallRating ? parseFloat(store.overallRating).toFixed(2) : 'N/A'}</td>
              <td>{store.userSubmittedRating || 'Not Rated'}</td>
              <td>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRating(store.id, rate)}
                    className={`rating-button ${store.userSubmittedRating == rate ? 'active' : ''}`}
                  >
                    {rate}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
