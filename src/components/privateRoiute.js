import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from './Utils/utils';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('uid');
  return user && !isTokenExpired() ? children : <Navigate to="/login" />;
};

export default memo(ProtectedRoute);