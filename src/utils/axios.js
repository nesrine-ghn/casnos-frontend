import axios from "axios";

// Create custom axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://casnos-backend.onrender.com"
});

// Interceptor - runs before EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;