'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auspify_token');
    const savedUser = localStorage.getItem('auspify_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /me in background
        api.getMe().then(res => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('auspify_user', JSON.stringify(res.user));
          }
        }).catch(() => {
          // If token expired, clear
          logout();
        });
      } catch (err) {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auspify_token', data.token);
      localStorage.setItem('auspify_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auspify_token', data.token);
      localStorage.setItem('auspify_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auspify_token');
    localStorage.removeItem('auspify_user');
  };

  const loginAsAdmin = async () => {
    try {
      return await login('admin@techbazer.com', 'admin123');
    } catch {
      return await login('admin@auspify.com', 'admin123');
    }
  };

  const loginAsCustomer = async () => {
    try {
      return await login('customer@techbazer.com', 'customer123');
    } catch {
      return await login('customer@auspify.com', 'customer123');
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'Admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        loginAsAdmin,
        loginAsCustomer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
