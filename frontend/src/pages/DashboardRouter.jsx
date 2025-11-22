import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import StoreOwnerDashboard from './StoreOwnerDashboard'; 

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>; 
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <UserDashboard />;
    case 'owner':
      return <StoreOwnerDashboard />;
    default:
      return <p>Unknown role. Please contact support.</p>;
  }
};

export default DashboardRouter;
