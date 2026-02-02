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

function normalizeRole(rol: string | undefined): string {
  if (rol === 'ADMIN' || rol === 'Admin') return 'ADMIN';
  if (rol === 'USER' || rol === 'Usuario') return 'USER';
  return 'USER';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string | undefined;
  if (!id) {
    return res.status(400).json({ error: 'ID de usuario requerido' });
  }

  try {
    const headers = buildHeadersFromReq(req);
    const sessionResult = await auth.api.getSession({ headers });

    if (!sessionResult?.user || !sessionResult?.session) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const currentUser = sessionResult.user as { id: string; role?: string };
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (req.method === 'DELETE') {
      if (id === currentUser.id) {
        return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
      }
      // Session, Account y Movimiento se eliminan en cascada (onDelete: Cascade en el schema).
      await prisma.user.delete({ where: { id } });
      return res.status(200).json({ data: { id } });
    }

    if (req.method === 'PATCH') {
      const { nombre, correo, telefono, rol } = req.body as {
        nombre?: string;
        correo?: string;
        telefono?: string | null;
        rol?: string;
      };

      const updates: { name?: string; email?: string; phone?: string | null; role?: string } = {};

      if (typeof nombre === 'string') {
        updates.name = nombre.trim() || existing.email;
      }
      if (typeof telefono === 'string') {
        updates.phone = telefono.trim() || null;
      }
      if (rol !== undefined) {
        updates.role = normalizeRole(rol);
      }
      if (typeof correo === 'string' && correo.trim()) {
        const emailTrim = correo.trim();
        if (emailTrim !== existing.email) {
          const other = await prisma.user.findUnique({ where: { email: emailTrim } });
          if (other) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
          }
          updates.email = emailTrim;
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: updates,
      });

      return res.status(200).json({ data: updated });
    }

    res.setHeader('Allow', ['PATCH', 'DELETE']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2002') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    // eslint-disable-next-line no-console
    console.error('Error en PATCH /api/usuarios/[id]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
