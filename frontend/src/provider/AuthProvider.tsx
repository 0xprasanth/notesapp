'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.token && session?.user.id   ) {
      setAuth(session.user.token);
    }

    if (status === 'unauthenticated') {
      clearAuth();
    }
  }, [status, session, setAuth, clearAuth]);

  return null;
}
