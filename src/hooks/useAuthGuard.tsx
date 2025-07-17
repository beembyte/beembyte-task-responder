
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAuth = true) => {
  const { loggedInUser } = useAuth()
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

        // Only check user profile once to determine vetting status
        try {
          const userProfile = await loggedInUser();
          
          // If user is not vetted and not already on vetting page, redirect to vetting
          if (!userProfile.is_vetted && location.pathname !== '/vetting') {
            navigate('/vetting');
            return;
          }

          // If user is vetted but trying to access vetting page, redirect to dashboard
          if (userProfile.is_vetted && location.pathname === '/vetting') {
            navigate('/dashboard');
            return;
          }

        } catch (error) {
          console.error("Failed to get user profile:", error);
          toast.error("Session expired. Please login again.");
          // Clear auth data
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("authorizeUser");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate, location.pathname, requireAuth, loggedInUser]);

  return { isAuthenticated };
};
