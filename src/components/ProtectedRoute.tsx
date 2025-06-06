
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loggedInUser } = useAuth();
  const location = useLocation();

  // Check if user is logged in
  const user = loggedInUser();
  const isAuthenticated = !!user && !!document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='));

  if (!isAuthenticated) {
    // Redirect to login with the current location so we can redirect back after login
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
