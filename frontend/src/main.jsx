import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardRouter from './pages/DashboardRouter.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminStores from './pages/AdminStores.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <DashboardRouter />,
          },
        ],
      },
      {
        path: 'update-password',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <UpdatePassword />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminPrivateRoute />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'users',
            element: <AdminUsers />,
          },
          {
            path: 'stores',
            element: <AdminStores />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);