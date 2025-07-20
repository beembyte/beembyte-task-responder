
import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface VettingProtectedRouteProps {
  children: React.ReactNode;
}

const VettingProtectedRoute: React.FC<VettingProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthGuard(true);

  // Show loading while authentication is being verified
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, the useAuthGuard hook will handle the redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default VettingProtectedRoute;
