
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAuth = true) => {
  const { verifyAuthToken } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();

  // Check both cookie and localStorage for auth
  const hasAuthCookie = document.cookie.includes('authToken=');
  const storedUser = localStorage.getItem("authorizeUser");
  const isAuthenticated = hasAuthCookie && !!storedUser;

  useEffect(() => {
    const checkAuth = async () => {
      if (requireAuth) {
        if (!isAuthenticated) {
          console.log(`Protected route access attempted: ${location.pathname}`);
          toast.error("Please login to access this page");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
          return;
        }
        
        // Verify token validity
        try {
          await verifyAuthToken();
        } catch (error) {
          console.error("Token verification failed:", error);
          toast.error("Session expired. Please login again.");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate, location.pathname, requireAuth, verifyAuthToken])

  return { isAuthenticated };
};
