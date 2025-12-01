'use client';
import axios from 'axios';
import { getAuthToken } from './authToken';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// todo : fixe loggin session



http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


http.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;
        window.dispatchEvent(new CustomEvent('refreshToken', { detail: newToken }));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default http;
