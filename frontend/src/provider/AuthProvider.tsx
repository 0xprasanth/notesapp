"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

// AuthSync: reads auth from localStorage on mount and keeps zustand in sync.
export function AuthSync() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("auth") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.user) {
          setAuth(
            parsed.token,
            parsed.user.id,
            parsed.user.name,
            parsed.user.email,
          );
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    function onStorage(e: StorageEvent) {
      if (e.key === "auth") {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setAuth(
              parsed.token,
              parsed.user.id,
              parsed.user.name,
              parsed.user.email,
            );
          } catch {
            // ignore
          }
        } else {
          clearAuth();
        }
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setAuth, clearAuth]);

  return null;
}
