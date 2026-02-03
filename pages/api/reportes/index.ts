import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findMany: (args: {
      where: { fecha: { gte: Date; lt: Date }; tipo?: string; userId?: string };
      select: { fecha: true; monto: true; tipo: true };
    }) => Promise<{ fecha: Date; monto: unknown; tipo: string }[]>;
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

const CANTIDAD_AÑOS_VISTA_AÑO = 6;

/**
 * GET /api/reportes
 * Vista por día: ?mes=YYYY-MM → ingresosPorDia, egresosPorDia (31 valores).
 * Vista por mes: ?año=YYYY → ingresosPorMes, egresosPorMes (12 valores, Ene-Dic).
 * Vista por año: ?vista=año → años, ingresosPorAño, egresosPorAño (últimos 6 años). Solo ADMIN.
 * Opcional: ?tipo=ingreso|egreso, ?userId=... para filtrar por tipo y/o usuario.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const headers = buildHeadersFromReq(req);
    const sessionResult = await auth.api.getSession({ headers });

    if (!sessionResult?.user || !sessionResult?.session) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const currentUser = sessionResult.user as { id: string; role?: string };
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Solo administradores pueden ver reportes' });
    }

    const vista = typeof req.query.vista === 'string' ? req.query.vista.trim() : '';
    const mes = typeof req.query.mes === 'string' ? req.query.mes.trim() : '';
    const añoStr = typeof req.query.año === 'string' ? req.query.año.trim() : '';
    const tipo = typeof req.query.tipo === 'string' ? req.query.tipo.trim() : '';
    const userIdQuery = typeof req.query.userId === 'string' ? req.query.userId.trim() : '';
    // Si no envían userId, filtrar por el usuario logueado (solo sus movimientos)
    const userId = userIdQuery || currentUser.id;

    const whereTipo = tipo === 'ingreso' || tipo === 'egreso' ? { tipo } : {};
    const whereUserId = { userId };

    if (vista === 'año') {
      const currentYear = new Date().getUTCFullYear();
      const añoInicio = currentYear - CANTIDAD_AÑOS_VISTA_AÑO + 1;
      const años = Array.from({ length: CANTIDAD_AÑOS_VISTA_AÑO }, (_, i) => añoInicio + i);
      const start = new Date(Date.UTC(añoInicio, 0, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(currentYear + 1, 0, 1, 0, 0, 0, 0));
      const movimientos = await db.movimiento.findMany({
        where: { fecha: { gte: start, lt: end }, ...whereTipo, ...whereUserId },
        select: { fecha: true, monto: true, tipo: true },
      }) as { fecha: Date; monto: unknown; tipo: string }[];
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[reportes] vista=año | userId:', userId, '| movimientos count:', movimientos.length);
      }
      const ingresosPorAño: number[] = Array.from({ length: CANTIDAD_AÑOS_VISTA_AÑO }, () => 0);
      const egresosPorAño: number[] = Array.from({ length: CANTIDAD_AÑOS_VISTA_AÑO }, () => 0);
      for (const mov of movimientos) {
        const year = mov.fecha.getUTCFullYear();
        const index = year - añoInicio;
        if (index >= 0 && index < CANTIDAD_AÑOS_VISTA_AÑO) {
          const valor = Number(mov.monto);
          if (mov.tipo === 'ingreso') ingresosPorAño[index] += valor;
          else egresosPorAño[index] += valor;
        }
      }
      return res.status(200).json({
        data: { años, ingresosPorAño, egresosPorAño },
      });
    }

    if (mes && añoStr) {
      return res.status(400).json({ error: 'Indica solo "mes" (vista por día) o "año" (vista por mes)' });
    }

    if (mes) {
      if (!/^\d{4}-\d{2}$/.test(mes)) {
        return res.status(400).json({ error: 'Query "mes" debe ser YYYY-MM' });
      }
      const [y, m] = mes.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      const movimientos = await db.movimiento.findMany({
        where: { fecha: { gte: start, lt: end }, ...whereTipo, ...whereUserId },
        select: { fecha: true, monto: true, tipo: true },
      }) as { fecha: Date; monto: unknown; tipo: string }[];
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[reportes] mes=', mes, '| userId:', userId, '| movimientos count:', movimientos.length);
      }
      const ingresosPorDia: number[] = Array.from({ length: 31 }, () => 0);
      const egresosPorDia: number[] = Array.from({ length: 31 }, () => 0);
      for (const mov of movimientos) {
        const day = mov.fecha.getUTCDate();
        if (day >= 1 && day <= 31) {
          const valor = Number(mov.monto);
          if (mov.tipo === 'ingreso') ingresosPorDia[day - 1] += valor;
          else egresosPorDia[day - 1] += valor;
        }
      }
      return res.status(200).json({
        data: { mes, ingresosPorDia, egresosPorDia },
      });
    }

    if (añoStr) {
      if (!/^\d{4}$/.test(añoStr)) {
        return res.status(400).json({ error: 'Query "año" debe ser YYYY' });
      }
      const año = parseInt(añoStr, 10);
      const start = new Date(Date.UTC(año, 0, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(año + 1, 0, 1, 0, 0, 0, 0));
      const movimientos = await db.movimiento.findMany({
        where: { fecha: { gte: start, lt: end }, ...whereTipo, ...whereUserId },
        select: { fecha: true, monto: true, tipo: true },
      }) as { fecha: Date; monto: unknown; tipo: string }[];
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[reportes] año=', año, '| userId:', userId, '| movimientos count:', movimientos.length);
      }
      const ingresosPorMes: number[] = Array.from({ length: 12 }, () => 0);
      const egresosPorMes: number[] = Array.from({ length: 12 }, () => 0);
      for (const mov of movimientos) {
        const month = mov.fecha.getUTCMonth();
        if (month >= 0 && month <= 11) {
          const valor = Number(mov.monto);
          if (mov.tipo === 'ingreso') ingresosPorMes[month] += valor;
          else egresosPorMes[month] += valor;
        }
      }
      return res.status(200).json({
        data: { año, ingresosPorMes, egresosPorMes },
      });
    }

    return res.status(400).json({ error: 'Indica "mes" (YYYY-MM), "año" (YYYY) o "vista=año"' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en GET /api/reportes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
