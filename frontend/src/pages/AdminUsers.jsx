import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });

  const fetchUsers = async () => {
    try {
      const params = { ...filter, ...sort };
      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, sort]);

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/users', newUser);
      setSuccess('User added successfully!');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.errors[0]?.msg || err.response?.data?.message || 'Failed to add user.');
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
      <h2>Manage Users</h2>

      <h3>Add New User</h3>
      <form onSubmit={handleAddUser}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={newUser.address} onChange={handleNewUserChange} required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={newUser.role} onChange={handleNewUserChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>

      <h3>User List</h3>
      <div>
        <h4>Filters:</h4>
        <input type="text" name="name" placeholder="Filter by Name" value={filter.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Filter by Email" value={filter.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Filter by Address" value={filter.address} onChange={handleFilterChange} />
        <select name="role" value={filter.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('id')}>ID {sort.sortBy === 'id' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('name')}>Name {sort.sortBy === 'name' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('email')}>Email {sort.sortBy === 'email' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('address')}>Address {sort.sortBy === 'address' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
            <th onClick={() => handleSortChange('role')}>Role {sort.sortBy === 'role' && (sort.sortOrder === 'ASC' ? '▲' : '▼')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;