
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loggedInUser } = useAuth();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Use useCallback to avoid triggering useEffect too often
  const getUser = useCallback(() => loggedInUser(), [loggedInUser]);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const currentUser = await getUser();
        if (isMounted) setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [getUser]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xl text-gray-600">Authenticating...</span>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  const isAuthenticated = !!user && !!document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='));

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
