
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCookie } from '@/utils/formatUtils';

interface VettingProtectedRouteProps {
  children: React.ReactNode;
}

const VettingProtectedRoute: React.FC<VettingProtectedRouteProps> = ({ children }) => {
  const { verifyAuthToken } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if is_vetted status was passed through navigation state
  const passedVettingStatus = location.state?.is_vetted;

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
        
        // Check vetting status - prioritize navigation state over localStorage
        let isVetted = false;
        
        if (passedVettingStatus !== undefined) {
          // Use the fresh status passed from login/verification
          isVetted = passedVettingStatus;
        } else {
          // Fall back to stored user data
          const userData = JSON.parse(authorizeUser);
          isVetted = userData.is_vetted;
        }
        
        if (isVetted) {
          // User is already vetted, redirect to dashboard
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
  }, [verifyAuthToken, passedVettingStatus]);

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

  // Check vetting status - prioritize navigation state over localStorage
  let isVetted = false;
  
  if (passedVettingStatus !== undefined) {
    // Use the fresh status passed from login/verification
    isVetted = passedVettingStatus;
  } else {
    // Fall back to stored user data
    const authorizeUser = localStorage.getItem('authorizeUser');
    if (authorizeUser) {
      const userData = JSON.parse(authorizeUser);
      isVetted = userData.is_vetted;
    }
  }

  if (isVetted) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and not vetted, show vetting page
  return <>{children}</>;
};

export default VettingProtectedRoute;
