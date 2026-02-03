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
      const conceptoRaw = req.query.concepto;
      const tipoRaw = req.query.tipo;
      const fechaDesdeRaw = req.query.fechaDesde;
      const fechaHastaRaw = req.query.fechaHasta;
      const conceptoQ = typeof conceptoRaw === 'string' ? conceptoRaw.trim() : Array.isArray(conceptoRaw) ? String(conceptoRaw[0] ?? '').trim() : '';
      const tipoQ = typeof tipoRaw === 'string' ? tipoRaw.trim().toLowerCase() : Array.isArray(tipoRaw) ? String(tipoRaw[0] ?? '').trim().toLowerCase() : '';
      const tipoValido = tipoQ === 'ingreso' || tipoQ === 'egreso' ? tipoQ : null;
      const fechaDesdeStr = typeof fechaDesdeRaw === 'string' ? fechaDesdeRaw.trim() : Array.isArray(fechaDesdeRaw) ? String(fechaDesdeRaw[0] ?? '').trim() : '';
      const fechaHastaStr = typeof fechaHastaRaw === 'string' ? fechaHastaRaw.trim() : Array.isArray(fechaHastaRaw) ? String(fechaHastaRaw[0] ?? '').trim() : '';

      /** Inicio del día en UTC (00:00:00.000) para filtrar fecha >= desde. */
      const startOfDayUTC = (s: string): Date | null => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
        const [y, m, d] = s.split('-').map(Number);
        const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
        return Number.isNaN(date.getTime()) ? null : date;
      };
      /** Inicio del día siguiente en UTC para filtrar fecha < hasta (exclusivo). */
      const startOfNextDayUTC = (s: string): Date | null => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
        const [y, m, d] = s.split('-').map(Number);
        const date = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0, 0));
        return Number.isNaN(date.getTime()) ? null : date;
      };
      const fechaDesde = startOfDayUTC(fechaDesdeStr);
      const fechaHastaExclusive = fechaHastaStr ? startOfNextDayUTC(fechaHastaStr) : null;

      type WhereMovimiento = {
        concepto?: { contains: string; mode: 'insensitive' };
        tipo?: string;
        fecha?: { gte?: Date; lt?: Date };
      };
      const where: WhereMovimiento = {};
      if (conceptoQ.length > 0) {
        where.concepto = { contains: conceptoQ, mode: 'insensitive' };
      }
      if (tipoValido) {
        where.tipo = tipoValido;
      }
      if (fechaDesde || fechaHastaExclusive) {
        where.fecha = {};
        if (fechaDesde) where.fecha.gte = fechaDesde;
        if (fechaHastaExclusive) where.fecha.lt = fechaHastaExclusive;
      }
      const hasWhere = Object.keys(where).length > 0;

      const movimientos = await db.movimiento.findMany({
        ...(hasWhere ? { where } : {}),
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
