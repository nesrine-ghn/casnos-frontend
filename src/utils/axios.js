import axios from "axios";

// Create custom axios instance
const api = axios.create({
  baseURL: "http://localhost:3000"
});

// Interceptor - runs before EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;