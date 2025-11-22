import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPrivateRoute = () => {
  const { user } = useAuth();

  // If authorized and is admin, return an outlet that will render child elements
  // If not, return element that will navigate to login page or unauthorized page
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />; // Or a dedicated /unauthorized page
};

export default AdminPrivateRoute;
