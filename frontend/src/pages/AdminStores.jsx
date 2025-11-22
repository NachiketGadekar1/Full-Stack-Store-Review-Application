import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });

  const fetchStores = async () => {
    try {
      const params = { ...filter, ...sort };
      const response = await api.get('/admin/stores', { params });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filter, sort]);

  const handleNewStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/stores', newStore);
      setSuccess('Store added successfully!');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStores(); // Refresh the list
    } catch (err) {
      console.error('Add store error:', err);
      // Safely access the error message
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add store.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSortChange = (sortByField) => {
    setSort((prevSort) => ({
      sortBy: sortByField,
      sortOrder: prevSort.sortBy === sortByField && prevSort.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div>
      <h2>Manage Stores</h2>

      <h3>Add New Store</h3>
      <form onSubmit={handleAddStore}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newStore.name} onChange={handleNewStoreChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={newStore.email} onChange={handleNewStoreChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={newStore.address} onChange={handleNewStoreChange} required />
        </div>
        <div>
          <label>Owner ID (Optional):</label>
          <input type="number" name="owner_id" value={newStore.owner_id} onChange={handleNewStoreChange} />
        </div>
        <button type="submit">Add Store</button>
      </form>

      <h3>Store List</h3>
      <div>
        <h4>Filters:</h4>
        <input type="text" name="name" placeholder="Filter by Name" value={filter.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Filter by Email" value={filter.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Filter by Address" value={filter.address} onChange={handleFilterChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('name')}>Name {sort.sortBy === 'name' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('email')}>Email {sort.sortBy === 'email' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('address')}>Address {sort.sortBy === 'address' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('averageRating')}>Avg Rating {sort.sortBy === 'averageRating' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.averageRating ? parseFloat(store.averageRating).toFixed(2) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminStores;