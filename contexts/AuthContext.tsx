'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthResponse } from '@/types'; // Removed User import to avoid conflict
import { authAPI } from '@/lib/api';

// Form type for registration
export interface RegisterFormType {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
}

// Local user interface
export interface LocalUser {
  _id: string;
  userId: string;
  name: string;
  lastname: string;
  email: string;
  role: 'user' | 'admin';
}

// Map backend user response to LocalUser
const mapUserResponse = (user: { id: string; email: string; role: string }): LocalUser => ({
  _id: user.id,
  userId: user.id,
  name: '',
  lastname: '',
  email: user.email,
  role: user.role === 'admin' ? 'admin' : 'user',
});

// Auth context type
interface AuthContextType {
  user: LocalUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormType) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for token
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Optional: fetch user info from backend if needed
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const response: AuthResponse = await authAPI.login(email, password);
    Cookies.set('token', response.token, { expires: 7 });
    setUser(mapUserResponse(response.user));
  };

  // Register function
  const register = async (data: RegisterFormType) => {
    const response: AuthResponse = await authAPI.register(data);
    Cookies.set('token', response.token, { expires: 7 });
    setUser(mapUserResponse(response.user));
  };

  // Logout function
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAdmin: user?.role === 'admin', // Corrected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
