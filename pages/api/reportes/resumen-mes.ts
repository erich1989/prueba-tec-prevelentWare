import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findMany: (args: {
      where: { fecha: { gte: Date; lt: Date }; userId?: string };
      select: { monto: true; tipo: true };
    }) => Promise<{ monto: unknown; tipo: string }[]>;
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

function sumarPorTipo(
  movimientos: { monto: unknown; tipo: string }[]
): { ingresos: number; gastos: number } {
  let ingresos = 0;
  let gastos = 0;
  for (const mov of movimientos) {
    const valor = Number(mov.monto);
    if (mov.tipo === 'ingreso') ingresos += valor;
    else gastos += valor;
  }
  return { ingresos, gastos };
}

/**
 * GET /api/reportes/resumen-mes?mes=YYYY-MM
 * Devuelve totales del mes y del mes anterior para el resumen en la home.
 * Respuesta: { data: { ingresos, gastos, ingresosMesAnterior, gastosMesAnterior } }.
 * Solo ADMIN.
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
      return res.status(403).json({ error: 'Solo administradores pueden ver el resumen del mes' });
    }

    const mesRaw = req.query.mes;
    const mes = typeof mesRaw === 'string' ? mesRaw.trim() : Array.isArray(mesRaw) ? String(mesRaw[0] ?? '').trim() : '';
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: 'Query "mes" debe ser YYYY-MM' });
    }

    const [y, m] = mes.split('-').map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));

    const movimientos = await db.movimiento.findMany({
      where: { fecha: { gte: start, lt: end }, userId: currentUser.id },
      select: { monto: true, tipo: true },
    }) as { monto: unknown; tipo: string }[];

    const { ingresos, gastos } = sumarPorTipo(movimientos);

    // Mes anterior para comparación
    const startAnterior = new Date(Date.UTC(y, m - 2, 1, 0, 0, 0, 0));
    const endAnterior = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const movimientosAnterior = await db.movimiento.findMany({
      where: { fecha: { gte: startAnterior, lt: endAnterior }, userId: currentUser.id },
      select: { monto: true, tipo: true },
    }) as { monto: unknown; tipo: string }[];

    const { ingresos: ingresosMesAnterior, gastos: gastosMesAnterior } = sumarPorTipo(movimientosAnterior);

    return res.status(200).json({
      data: {
        mes,
        ingresos,
        gastos,
        ingresosMesAnterior,
        gastosMesAnterior,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en GET /api/reportes/resumen-mes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
