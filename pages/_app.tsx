import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../app/globals.css';
import ThemeRegistry from '../app/theme/ThemeRegistry';
import { Navigation } from '../app/components/organisms/Navigation';
import { AuthGuard } from '../app/components/AuthGuard';
import { RoleGuard } from '../app/components/RoleGuard';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;
  const isLoginPage = pathname === '/login';

  return (
    <ThemeRegistry>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <AuthGuard>
          <RoleGuard pathname={pathname}>
            <Navigation pathname={pathname}>
              <Component {...pageProps} />
            </Navigation>
          </RoleGuard>
        </AuthGuard>
      )}
    </ThemeRegistry>
  );
}
