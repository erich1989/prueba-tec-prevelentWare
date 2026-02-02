import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

const appUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

/**
 * Better Auth: GitHub OAuth + Prisma (Supabase).
 * Nuevos usuarios se asignan rol ADMIN (requisito de la prueba técnica).
 * baseURL y trustedOrigins aseguran que la cookie de sesión se establezca tras el callback de OAuth.
 */
export const auth = betterAuth({
  baseURL: appUrl,
  trustedOrigins: [appUrl],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'ADMIN', // Prueba técnica: todos los nuevos usuarios = ADMIN
        input: false, // no lo envía el usuario en signup
      },
    },
  },
  account: {
    // Better Auth usa "accountId"; nuestro schema Prisma tiene "providerAccountId"
    fields: {
      accountId: 'providerAccountId',
    },
  },
});
