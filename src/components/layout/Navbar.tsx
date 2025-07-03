
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Wallet, Menu, X, Home, History, User } from 'lucide-react';
import Logo from '../Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBadge from '../NotificationBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/task-history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />

          {isLoggedIn ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-primary'
                    } transition-colors flex items-center space-x-1`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <Link to="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`} alt={user?.first_name} />
                    <AvatarFallback>{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="relative z-50"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </>
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

      {/* Mobile Menu Overlay */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://robohash.org/${user?.first_name || 'user'}?set=set4`} alt={user?.first_name} />
                    <AvatarFallback>{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.first_name}</p>
                    <p className="text-xs text-gray-500">{user?.responder_id}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary border-r-2 border-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full text-sm"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
