import { memo } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('uid');
  
  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default memo(ProtectedRoute);