
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCookie } from '@/utils/formatUtils';

interface VettingProtectedRouteProps {
  children: React.ReactNode;
}

const VettingProtectedRoute: React.FC<VettingProtectedRouteProps> = ({ children }) => {
  const { verifyAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndVettingStatus = async () => {
      const authToken = getCookie('authToken');
      const authorizeUser = localStorage.getItem('authorizeUser');
      
      // If no token or user data, redirect to login
      if (!authToken || !authorizeUser) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify the auth token
        await verifyAuthToken();
        setIsAuthenticated(true);
        
        // Check if vetting is already completed
        const vettingCompleted = localStorage.getItem('vettingCompleted');
        if (vettingCompleted) {
          // Vetting already completed, redirect to dashboard
          setIsLoading(false);
          return;
        }
        
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndVettingStatus();
  }, [verifyAuthToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If vetting is completed, redirect to dashboard
  const vettingCompleted = localStorage.getItem('vettingCompleted');
  if (vettingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and vetting is not completed, show vetting page
  return <>{children}</>;
};

export default VettingProtectedRoute;
