
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Wallet } from 'lucide-react';
import Logo from '../Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBadge from '../NotificationBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check authentication state from localStorage and cookies
  const storedUser = localStorage.getItem("authorizeUser");
  const authCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='));

  const isLoggedIn = !!(storedUser && authCookie);
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('authorizeUser');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'} hidden sm:block hover:text-primary`}
            >
              Dashboard
            </Link>
            <Link
              to="/wallet"
              className={`${location.pathname === '/wallet' ? 'text-primary font-medium' : 'text-muted-foreground'} hidden sm:block hover:text-primary`}
            >
              Wallet
            </Link>
            <Link
              to="/task-history"
              className={`${location.pathname === '/task-history' ? 'text-primary font-medium' : 'text-muted-foreground'} hidden sm:block hover:text-primary`}
            >
              History
            </Link>

            <div className="relative">
              <Link to="/notifications">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
                <NotificationBadge count={2} />
              </Link>
            </div>
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`} alt={user?.first_name} />
                <AvatarFallback>{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-muted-foreground hover:text-primary"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
