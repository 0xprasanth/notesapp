import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user:{
    token?: string;
  id?: string;
  name?: string;
  email?: string;
  }
  setAuth: (token: string, id: string, name: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: {
    token: undefined,
    id: undefined,
    name: undefined,
    email: undefined,
  },
  setAuth: (token: string, id: string, name: string, email: string) =>
    set({ isAuthenticated: true, user: { token, id, name, email } }),

  clearAuth: () =>
    set({ isAuthenticated: false, user: { token: undefined, id: undefined, name: undefined, email: undefined } }),
}));
  