import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
});


http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
);

export default http;
