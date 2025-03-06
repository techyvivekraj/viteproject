import { memo } from 'react';
import { Navigate } from 'react-router-dom';
// import { isTokenExpired } from '../utils/utils';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('uid');
  // return user && !isTokenExpired() ? children : <Navigate to="/login" />;
  // return user ? children : <Navigate to="/login" />;
  return children;
};

export default memo(ProtectedRoute);