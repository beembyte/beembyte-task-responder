
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/services/authApi';

export const useAuthGuard = (requireAuth = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  console.log("🛡️ AuthGuard check:", { 
    isAuthenticated,
    requireAuth,
    currentPath: location.pathname 
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("🛡️ Verifying auth token...");
        const tokenResponse = await authApi.verifyAuthToken();
        
        if (tokenResponse.success) {
          // Token is valid, now get user profile
          const userResponse = await authApi.logedInUser();
          
          if (userResponse.success) {
            console.log("🛡️ User authenticated:", { 
              userId: userResponse.data?.user_id, 
              isVetted: userResponse.data?.is_vetted 
            });
            
            setIsAuthenticated(true);
            const hasVettingOverride = sessionStorage.getItem('vetting-submitted') === 'true';
            const effectiveVetted = Boolean(userResponse.data?.is_vetted || hasVettingOverride);
            setUser({ ...userResponse.data, is_vetted: effectiveVetted });
            
            // Handle vetting redirects only if auth is required
            if (requireAuth) {
              // If user is effectively vetted and on vetting page, go to dashboard
              if (effectiveVetted && location.pathname === '/vetting') {
                console.log("🛡️ Redirecting to dashboard - vetted (effective)");
                // Only clear the flag when backend confirms vetted to persist across refresh
                if (userResponse.data?.is_vetted) {
                  sessionStorage.removeItem('vetting-submitted');
                }
                navigate('/dashboard');
                return;
              }
              
              // If user not effectively vetted and not on vetting, send to vetting
              if (!effectiveVetted && location.pathname !== '/vetting') {
                console.log("🛡️ Redirecting to vetting - user not vetted");
                navigate('/vetting');
                return;
              }
            }
          } else {
            throw new Error('Failed to get user profile');
          }
        } else {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error("🛡️ Auth verification failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        
        if (requireAuth) {
          console.log(`🛡️ Protected route access denied: ${location.pathname}`);
          toast.error("Please login to access this page");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        }
      }
    };

    verifyAuth();

    // Listen for auth changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-change') {
        console.log("🛡️ Auth change detected from another tab");
        verifyAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname, requireAuth, navigate]);

  return { isAuthenticated, user };
};
