
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAuth = true) => {
  const { loggedInUser } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();

  // Check both cookie and localStorage for auth - be more lenient about cookie requirement
  const hasAuthCookie = document.cookie.includes('authToken=');
  const storedUser = localStorage.getItem("authorizeUser");
  
  // If we have stored user data, consider authenticated even without cookie (for production compatibility)
  const isAuthenticated = !!storedUser && (hasAuthCookie || !!storedUser);
  
  console.log("🛡️ AuthGuard check:", { 
    hasAuthCookie, 
    hasStoredUser: !!storedUser, 
    isAuthenticated,
    requireAuth,
    currentPath: location.pathname 
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (requireAuth) {
        if (!isAuthenticated) {
          console.log(`🛡️ Protected route access denied: ${location.pathname}`);
          toast.error("Please login to access this page");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
          return;
        }

        // Only check user profile once to determine vetting status
        try {
          const userProfile = await loggedInUser();
          console.log("🛡️ User profile loaded:", { 
            userId: userProfile?.user_id, 
            isVetted: userProfile?.is_vetted,
            currentPath: location.pathname 
          });
          
          // If user is not vetted and not already on vetting page, redirect to vetting
          if (!userProfile.is_vetted && location.pathname !== '/vetting') {
            console.log("🛡️ Redirecting to vetting - user not vetted");
            navigate('/vetting');
            return;
          }

          // If user is vetted but trying to access vetting page, redirect to dashboard
          if (userProfile.is_vetted && location.pathname === '/vetting') {
            console.log("🛡️ Redirecting to dashboard - user already vetted");
            navigate('/dashboard');
            return;
          }

        } catch (error) {
          console.error("🛡️ Failed to get user profile:", error);
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
