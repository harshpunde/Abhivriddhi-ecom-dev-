import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7c23]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const destination = adminOnly ? "/admin/login" : "/login";
    return <Navigate to={destination} state={{ from: location }} replace />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
