import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loggedInUser } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Only fetch if user is not already available
        if (!user) {
          const fetchedUser = await loggedInUser();
          if (isMounted) setLocalUser(fetchedUser);
        } else {
          setLocalUser(user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) setLocalUser(null);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [user, loggedInUser]);

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

  const isAuthenticated =
    !!localUser &&
    !!document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='));

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
