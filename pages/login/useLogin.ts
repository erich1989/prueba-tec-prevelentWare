import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authClient, useSession } from '@/lib/auth-client';
import { ROLES, USER_DEFAULT_PATH } from '@/app/config/nav';

/**
 * Hook para la página de login.
 * Better Auth + GitHub OAuth; si ya hay sesión, redirige según rol.
 */
export function useLogin() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [error, setError] = useState<string | null>(null);
  const role = (session?.user?.role as string) ?? ROLES.USER;

  useEffect(() => {
    if (isPending) return;
    if (session?.session) {
      router.replace(role === ROLES.ADMIN ? '/' : USER_DEFAULT_PATH);
    }
  }, [session?.session, isPending, role, router]);

  const handleSignInGitHub = async () => {
    setError(null);
    try {
      const result = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });
      const data = result?.data;
      if (data && 'url' in data && data.url) window.location.href = data.url;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message || 'Error al iniciar sesión. Revisa la consola del servidor (docker logs).');
      console.error('Sign-in error:', e);
    }
  };

  const showForm = !isPending && !session?.session;

  return {
    error,
    handleSignInGitHub,
    showForm,
  };
}
