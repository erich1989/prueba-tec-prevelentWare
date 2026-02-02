import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/** Cliente con modelo Movimiento (el tipo generado puede no estar en caché del IDE). */
type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findMany: (args: { orderBy: { fecha: 'desc' }; include: { user: { select: { id: true; name: true; email: true } } } }) => Promise<unknown[]>;
    create: (args: { data: { concepto: string; monto: number; fecha: Date; tipo: string; userId: string }; include: { user: { select: { name: true; email: true } } } }) => Promise<unknown>;
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
 * GET /api/movimientos - Lista movimientos. USER y ADMIN pueden listar.
 * POST /api/movimientos - Crear movimiento. Solo ADMIN.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const headers = buildHeadersFromReq(req);
    const sessionResult = await auth.api.getSession({ headers });

    if (!sessionResult?.user || !sessionResult?.session) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const currentUser = sessionResult.user as { id: string; name?: string | null; email?: string; role?: string };

    if (req.method === 'GET') {
      const movimientos = await db.movimiento.findMany({
        orderBy: { fecha: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }) as { id: string; concepto: string; monto: unknown; fecha: Date; tipo: string; userId: string; user?: { name: string | null; email: string } | null }[];

      const data = movimientos.map((m) => ({
        id: m.id,
        concepto: m.concepto,
        monto: Number(m.monto),
        fecha: m.fecha.toISOString(),
        tipo: m.tipo,
        userId: m.userId,
        usuario: m.user?.name ?? m.user?.email ?? '—',
      }));

      return res.status(200).json({
        data,
      });
    }

    if (req.method === 'POST') {
      if (currentUser.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Solo administradores pueden crear movimientos' });
      }

      const { monto, concepto, fecha, tipo } = req.body as {
        monto?: string | number;
        concepto?: string;
        fecha?: string;
        tipo?: string;
      };

      const montoNum = typeof monto === 'number' ? monto : parseFloat(String(monto ?? ''));
      if (Number.isNaN(montoNum) || montoNum <= 0) {
        return res.status(400).json({ error: 'El monto debe ser un número mayor que 0' });
      }

      const conceptoTrim = typeof concepto === 'string' ? concepto.trim() : '';
      const tipoValido = tipo === 'ingreso' || tipo === 'egreso' ? tipo : 'ingreso';
      const fechaValida = fecha && !Number.isNaN(Date.parse(fecha)) ? new Date(fecha) : new Date();
      const userId = currentUser.id;

      const creado = await db.movimiento.create({
        data: {
          concepto: conceptoTrim || 'Sin concepto',
          monto: montoNum,
          fecha: fechaValida,
          tipo: tipoValido,
          userId,
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }) as { id: string; concepto: string; monto: unknown; fecha: Date; tipo: string; userId: string; user?: { name: string | null; email: string } | null };

      return res.status(201).json({
        data: {
          id: creado.id,
          concepto: creado.concepto,
          monto: Number(creado.monto),
          fecha: creado.fecha.toISOString(),
          tipo: creado.tipo,
          userId: creado.userId,
          usuario: creado.user?.name ?? creado.user?.email ?? '—',
        },
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en /api/movimientos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
