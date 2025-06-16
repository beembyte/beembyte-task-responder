
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

const AUTH_CHECK_KEY = 'lastAuthCheckTimestamp';

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

        // Throttle to only run if more than 1 hour elapsed since last check
        try {
          const now = Date.now();
          const lastCheck = parseInt(localStorage.getItem(AUTH_CHECK_KEY) || '0', 10);
          if (!lastCheck || (now - lastCheck) > 60 * 60 * 1000) {
            await verifyAuthToken();
            localStorage.setItem(AUTH_CHECK_KEY, now.toString());
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          toast.error("Session expired. Please login again.");
          // Clear auth data
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("authorizeUser");
          localStorage.removeItem(AUTH_CHECK_KEY);
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate, location.pathname, requireAuth, verifyAuthToken]);

  return { isAuthenticated };
};
