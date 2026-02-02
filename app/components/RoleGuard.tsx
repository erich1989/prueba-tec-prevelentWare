'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@/lib/auth-client';
import { ADMIN_ONLY_PATHS, ROLES, USER_DEFAULT_PATH, type Role } from '@/app/config/nav';

interface RoleGuardProps {
  pathname: string;
  children: React.ReactNode;
}

/**
 * RBAC según PRUEBA_TECNICA:
 * - USER solo puede acceder a gestión de movimientos: si visita / redirige a /movimientos; /usuarios y /reportes redirigen a /.
 * - ADMIN accede a /, /movimientos, /usuarios, /reportes.
 */
export function RoleGuard({ pathname, children }: RoleGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = (session?.user?.role as Role) ?? ROLES.USER;
  const isAdminOnlyPath = ADMIN_ONLY_PATHS.includes(pathname);
  const isHome = pathname === '/';
  const hasSessionUser = !!session?.user;

  useEffect(() => {
    if (isPending || !hasSessionUser) return;
    if (role === ROLES.USER && isHome) {
      router.replace(USER_DEFAULT_PATH);
      return;
    }
    if (isAdminOnlyPath && role !== ROLES.ADMIN) {
      router.replace('/');
    }
  }, [pathname, role, isAdminOnlyPath, isHome, isPending, hasSessionUser, router]);

  if (isPending || !hasSessionUser) {
    return <>{children}</>;
  }
  if (role === ROLES.USER && isHome) {
    return null;
  }
  if (isAdminOnlyPath && role !== ROLES.ADMIN) {
    return null;
  }

  return <>{children}</>;
}
