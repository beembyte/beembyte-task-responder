
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
    verifyAuthToken()

  }, [])

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      console.log(`Protected route access attempted: ${location.pathname}`);
      toast.error("Please login to access this page");
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
    }
  }, [isAuthenticated, navigate, location.pathname, requireAuth]);

  return { isAuthenticated };
};
