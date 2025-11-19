import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    address?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.getUser();
    const token = storage.getToken();
    
    if (storedUser && token) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    address?: string
  ): Promise<void> => {
    try {
      const response = await apiService.register(
        email,
        password,
        firstName,
        lastName,
        phone,
        address
      );
      if (response.success && response.data) {
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    storage.clear();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

