import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/health — Comprueba que la API responde y que las variables de auth están cargadas (solo boolean, sin valores).
 * Útil para health checks y para depurar 500 en /api/auth/sign-in/social (p. ej. en Docker).
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const authEnv = {
    hasGitHubClientId: Boolean(process.env.GITHUB_CLIENT_ID),
    hasGitHubClientSecret: Boolean(process.env.GITHUB_CLIENT_SECRET),
    hasBetterAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    hasBetterAuthUrl: Boolean(process.env.BETTER_AUTH_URL),
  };
  const authReady =
    authEnv.hasGitHubClientId &&
    authEnv.hasGitHubClientSecret &&
    authEnv.hasBetterAuthSecret &&
    authEnv.hasBetterAuthUrl;
  res.status(200).json({
    ok: true,
    message: 'API ok',
    authEnv,
    authReady,
  });
}
