'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

import { setAuthToken } from '@/lib/authToken';

interface AuthContextProps {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;


  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const token = data.data.accessToken;
        setAccessToken(token);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(null)
      }
    };
    refreshAccessToken();
  }, []);


  const login = (token: string) => {
    setAccessToken(token);
  };


  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



