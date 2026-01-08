import api from "./api";
import type { ApiResponse, AuthResponse } from "@/types/user";

/**
 * Register a new user
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    { name, email, password }
  );
  console.log(
    response.data
  )
  return response.data.data;
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    { email, password }
  );
  return response.data.data;
}


