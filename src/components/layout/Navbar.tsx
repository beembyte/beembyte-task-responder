
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Logo from '../Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBadge from '../NotificationBadge';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // This would come from auth context in a real app

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
              to="/task-history" 
              className={`${location.pathname === '/task-history' ? 'text-primary font-medium' : 'text-gray-600'} hidden sm:block hover:text-primary`}
            >
              Task History
            </Link>
            <div className="relative">
              <Link to="/notifications">
                <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
                <NotificationBadge count={2} />
              </Link>
            </div>
            <Link to="/profile">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-sm font-medium">PR</span>
              </div>
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
