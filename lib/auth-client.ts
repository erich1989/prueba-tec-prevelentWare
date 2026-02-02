/**
 * Cliente de Better Auth para el frontend.
 * Usamos better-auth/client (el subpath /react a veces no resuelve en Next/Webpack).
 * useSession lo implementamos con getSession para tener el mismo API que better-auth/react.
 */
import { createAuthClient } from 'better-auth/client';
import { useCallback, useEffect, useState } from 'react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:3000'),
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signOut, getSession } = authClient;

/** Hook tipo useSession (como better-auth/react) usando getSession. */
export function useSession() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getSession>>['data']>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Awaited<ReturnType<typeof getSession>>['error']>(null);

  const refetch = useCallback(async () => {
    setIsPending(true);
    setError(null);
    const res = await authClient.getSession();
    setData(res.data);
    setError(res.error);
    setIsPending(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, error, isPending, isRefetching: false, refetch };
}
