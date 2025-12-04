'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { setAuthToken } from '@/lib/authToken';
import toast from 'react-hot-toast';

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
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
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
    const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true, headers: headers });
      toast.success("Logged out Successfully")
    } catch (err) {
      if (err.response) {
        toast.error("Failed to logout. Try again", err.response.data.message)
      }
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



