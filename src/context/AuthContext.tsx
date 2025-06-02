
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing user in localStorage on mount and sync with cookies
  useEffect(() => {
    const storedUser = localStorage.getItem('authorizeUser');
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    
    if (storedUser && authCookie) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('authorizeUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app this would call an API
    const mockUser: User = {
      id: '123',
      firstName: 'Prince',
      lastName: 'Smith',
      email: email,
      availability: 'available',
    };
    
    setUser(mockUser);
    localStorage.setItem('authorizeUser', JSON.stringify(mockUser));
  };

  const register = async (userData: Partial<User>, password: string) => {
    // Mock registration - in a real app this would call an API
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber,
      availability: 'available',
    };
    
    setUser(newUser);
    localStorage.setItem('authorizeUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authorizeUser');
    // Clear auth cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('authorizeUser', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user && !!document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='));

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
