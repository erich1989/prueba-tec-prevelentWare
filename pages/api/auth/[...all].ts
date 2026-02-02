import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

// Better Auth parsea el body; no usar el bodyParser de Next.js
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);
