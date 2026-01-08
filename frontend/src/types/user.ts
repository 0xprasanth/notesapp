/**
 * User type matching backend User model
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Auth response from backend
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Backend API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


