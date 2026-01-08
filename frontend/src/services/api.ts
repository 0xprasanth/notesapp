import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/env";

/**
 * Axios instance configured with base URL
 * Automatically attaches JWT token from Zustand store
 */
const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to attach JWT token
 * Token is retrieved from window global (set by Zustand store)
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from window global (set by Zustand store)
    const token = typeof window !== "undefined" 
      ? (window as any).__AUTH_TOKEN__ 
      : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to signin
      if (typeof window !== "undefined") {
        (window as any).__AUTH_TOKEN__ = null;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

