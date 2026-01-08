"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth.store";

/**
 * Hook to protect routes - redirects to signin if not authenticated
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      router.push("/signin");
      return;
    }

    // Sync NextAuth session with Zustand store
    if (session?.user && session.user.token) {
      if (!isAuthenticated) {
        setAuth(session.user.token ?? "", session.user.id, session.user.name ?? "", session.user.email ?? "", );
      }
    }
  }, [session, status, router, setAuth, isAuthenticated]);

  return { session, isLoading: status === "loading" };
}


