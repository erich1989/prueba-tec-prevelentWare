import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

function buildHeadersFromReq(req: NextApiRequest): Headers {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    }
  });
  return headers;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtener sesión desde Better Auth (cookie-based) usando los headers de la request.
    const headers = buildHeadersFromReq(req);
    const sessionResult = await auth.api.getSession({ headers });

    if (!sessionResult || !sessionResult.user || !sessionResult.session) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const currentUser = sessionResult.user as { role?: string };
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ data: users });
    }

    if (req.method === 'POST') {
      const { nombre, correo, telefono, rol } = req.body as {
        nombre?: string;
        correo?: string;
        telefono?: string | null;
        rol?: string;
      };

      if (!correo || typeof correo !== 'string') {
        return res.status(400).json({ error: 'El correo es obligatorio' });
      }

      const safeNombre = typeof nombre === 'string' ? nombre.trim() : '';
      const safeTelefono =
        typeof telefono === 'string' && telefono.trim().length > 0 ? telefono.trim() : null;

      let dbRole: string;
      if (rol === 'ADMIN' || rol === 'Admin') {
        dbRole = 'ADMIN';
      } else if (rol === 'USER' || rol === 'Usuario') {
        dbRole = 'USER';
      } else {
        dbRole = 'USER';
      }

      const emailTrim = correo.trim();
      const existing = await prisma.user.findUnique({ where: { email: emailTrim } });
      if (existing) {
        return res.status(409).json({ error: 'El correo ya está registrado' });
      }

      const nuevoUsuario = await prisma.user.create({
        data: {
          email: emailTrim,
          name: safeNombre || emailTrim,
          phone: safeTelefono,
          role: dbRole,
        },
      });

      return res.status(201).json({ data: nuevoUsuario });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2002') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    // eslint-disable-next-line no-console
    console.error('Error en /api/usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

