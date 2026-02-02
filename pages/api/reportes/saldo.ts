import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findMany: (args: { select: { monto: true; tipo: true } }) => Promise<{ monto: unknown; tipo: string }[]>;
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
 * GET /api/reportes/saldo
 * Devuelve el saldo actual: suma de ingresos menos suma de egresos (todos los movimientos).
 * Requiere ADMIN.
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

    const currentUser = sessionResult.user as { role?: string };
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Solo administradores pueden ver el saldo' });
    }

    const movimientos = await db.movimiento.findMany({
      select: { monto: true, tipo: true },
    }) as { monto: unknown; tipo: string }[];

    let totalIngresos = 0;
    let totalEgresos = 0;
    for (const mov of movimientos) {
      const valor = Number(mov.monto);
      if (mov.tipo === 'ingreso') totalIngresos += valor;
      else totalEgresos += valor;
    }
    const saldo = totalIngresos - totalEgresos;

    return res.status(200).json({
      data: { saldo },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en GET /api/reportes/saldo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
