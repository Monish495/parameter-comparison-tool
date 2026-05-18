import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role check
  if (
  requiredRole &&
  user?.role?.roleName?.toUpperCase() !== requiredRole
) {
  return <Navigate to="/" replace />;
}

  // ✅ RETURN CHILDREN (because AppLayout is inside)
  return children;
};

export default ProtectedRoute;