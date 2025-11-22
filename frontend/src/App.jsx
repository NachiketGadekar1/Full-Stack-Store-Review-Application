import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <header>
        <h1>Roxiler Assessment</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/update-password">Update Password</Link></li>
                {user.role === 'admin' && (
                  <>
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                    <li><Link to="/admin/users">Manage Users</Link></li>
                    <li><Link to="/admin/stores">Manage Stores</Link></li>
                  </>
                )}
                <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
