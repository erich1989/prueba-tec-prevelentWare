import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findUnique: (args: { where: { id: string } }) => Promise<{ id: string; userId: string } | null>;
    update: (args: {
      where: { id: string };
      data: { concepto?: string; monto?: number; fecha?: Date; tipo?: string };
      include: { user: { select: { name: true; email: true } } };
    }) => Promise<unknown>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
};

const db = prisma as PrismaWithMovimiento;

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

/**
 * PATCH /api/movimientos/[id] - Actualizar movimiento. Solo ADMIN.
 * DELETE /api/movimientos/[id] - Eliminar movimiento. Solo ADMIN.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string | undefined;
  if (!id) {
    return res.status(400).json({ error: 'ID de movimiento requerido' });
  }

  try {
    const headers = buildHeadersFromReq(req);
    const sessionResult = await auth.api.getSession({ headers });

    if (!sessionResult?.user || !sessionResult?.session) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const currentUser = sessionResult.user as { role?: string };
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Solo administradores pueden editar o eliminar movimientos' });
    }

    const existing = await db.movimiento.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    if (req.method === 'DELETE') {
      await db.movimiento.delete({ where: { id } });
      return res.status(200).json({ data: { id } });
    }

    if (req.method !== 'PATCH') {
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { monto, concepto, fecha, tipo } = req.body as {
      monto?: string | number;
      concepto?: string;
      fecha?: string;
      tipo?: string;
    };

    const updates: { concepto?: string; monto?: number; fecha?: Date; tipo?: string } = {};

    if (typeof concepto === 'string') {
      updates.concepto = concepto.trim() || 'Sin concepto';
    }
    if (tipo === 'ingreso' || tipo === 'egreso') {
      updates.tipo = tipo;
    }
    if (fecha && !Number.isNaN(Date.parse(fecha))) {
      updates.fecha = new Date(fecha);
    }
    const montoNum = typeof monto === 'number' ? monto : parseFloat(String(monto ?? ''));
    if (!Number.isNaN(montoNum) && montoNum > 0) {
      updates.monto = montoNum;
    }

    const updated = await db.movimiento.update({
      where: { id },
      data: updates,
      include: {
        user: { select: { name: true, email: true } },
      },
    }) as { id: string; concepto: string; monto: unknown; fecha: Date; tipo: string; userId: string; user?: { name: string | null; email: string } | null };

    return res.status(200).json({
      data: {
        id: updated.id,
        concepto: updated.concepto,
        monto: Number(updated.monto),
        fecha: updated.fecha.toISOString(),
        tipo: updated.tipo,
        userId: updated.userId,
        usuario: updated.user?.name ?? updated.user?.email ?? '—',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en PATCH /api/movimientos/[id]:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
