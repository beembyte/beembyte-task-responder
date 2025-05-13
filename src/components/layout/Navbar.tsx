
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Wallet } from 'lucide-react';
import Logo from '../Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBadge from '../NotificationBadge';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  if (!isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className={`${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-gray-600'} hidden sm:block hover:text-primary`}
            >
              Dashboard
            </Link>
            <Link 
              to="/wallet" 
              className={`${location.pathname === '/wallet' ? 'text-primary font-medium' : 'text-gray-600'} hidden sm:block hover:text-primary`}
            >
              Wallet
            </Link>
            <Link 
              to="/task-history" 
              className={`${location.pathname === '/task-history' ? 'text-primary font-medium' : 'text-gray-600'} hidden sm:block hover:text-primary`}
            >
              History
            </Link>
            
            <div className="relative">
              <Link to="/notifications">
                <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
                <NotificationBadge count={2} />
              </Link>
            </div>
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://robohash.org/${user?.firstName || 'user'}?set=4`} alt={user?.firstName} />
                <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-primary"
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
