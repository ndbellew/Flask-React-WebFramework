
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, isAuthenticated, isAdmin, ...rest }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;