
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCookie } from '@/utils/formatUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { verifyAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = getCookie('authToken');
      const authorizeUser = localStorage.getItem('authorizeUser');
      
      if (!authToken || !authorizeUser) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await verifyAuthToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [verifyAuthToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if user needs to complete vetting - enforce for all routes except vetting itself
  const vettingCompleted = localStorage.getItem('vettingCompleted');
  const hasCompletedRegistration = localStorage.getItem('hasCompletedRegistration');
  
  // If user just registered (hasCompletedRegistration exists) and hasn't completed vetting
  if (hasCompletedRegistration && !vettingCompleted && location.pathname !== '/vetting') {
    return <Navigate to="/vetting" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
