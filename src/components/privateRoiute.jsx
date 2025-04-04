import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
  const user = localStorage.getItem('uid');
  
  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default memo(ProtectedRoute);