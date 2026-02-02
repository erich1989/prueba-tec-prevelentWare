'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSession } from '@/lib/auth-client';

const RETRY_DELAY_MS = 600;

/**
 * Redirects to /login if there is no session (after loading).
 * After OAuth callback the session cookie may not be available on the first getSession(),
 * so we refetch once before redirecting.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const retryDoneRef = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (session?.session) return;

    if (!retryDoneRef.current) {
      retryDoneRef.current = true;
      const t = setTimeout(() => {
        refetch();
      }, RETRY_DELAY_MS);
      return () => clearTimeout(t);
    }

    router.replace('/login');
  }, [session?.session, isPending, refetch, router]);

  if (isPending) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Comprobando sesión...
        </Typography>
      </Box>
    );
  }

  if (!session?.session) {
    return null;
  }

  return <>{children}</>;
}
