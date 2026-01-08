import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    token?: string;
    id?: string;
    name?: string;
    email?: string;
  };
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
  setAuth: (token: string, id: string, name: string, email: string) => {
    // persist to window global and localStorage for api interceptor and cross-tab sync
    if (typeof window !== "undefined") {
      (window as any).__AUTH_TOKEN__ = token;
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({ token, user: { id, name, email } }),
        );
      } catch {
        // ignore storage errors
      }
    }

    set({ isAuthenticated: true, user: { token, id, name, email } });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      (window as any).__AUTH_TOKEN__ = null;
      try {
        localStorage.removeItem("auth");
      } catch {
        // ignore
      }
    }
    set({
      isAuthenticated: false,
      user: {
        token: undefined,
        id: undefined,
        name: undefined,
        email: undefined,
      },
    });
  },
}));
