import type { NextApiRequest, NextApiResponse } from 'next';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type MovimientoConUser = {
  concepto: string;
  monto: unknown;
  fecha: Date;
  tipo: string;
  user: { name: string | null; email: string } | null;
};
type PrismaWithMovimiento = PrismaClient & {
  movimiento: {
    findMany: (args: {
      where: { fecha: { gte: Date; lt: Date }; tipo?: string; userId?: string };
      orderBy: { fecha: 'asc' };
      include: { user: { select: { name: true; email: true } } };
    }) => Promise<MovimientoConUser[]>;
  };
};
const db = prisma as PrismaWithMovimiento;

const CANTIDAD_AÑOS_VISTA_AÑO = 6;

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

/** Escapa un campo para CSV: si contiene coma, comilla o salto de línea, envuelve en comillas y duplica comillas internas. */
function escapeCsvField(value: string): string {
  const s = String(value ?? '');
  if (/[,"\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * GET /api/reportes/csv
 * Mismo rango que el reporte: ?mes=YYYY-MM | ?año=YYYY | ?vista=año. Opcional: &tipo=ingreso|egreso, &userId=...
 * Devuelve CSV: Concepto,Monto,Fecha,Tipo,Usuario. Solo ADMIN.
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
      return res.status(403).json({ error: 'Solo administradores pueden descargar CSV' });
    }

    const vista = typeof req.query.vista === 'string' ? req.query.vista.trim() : '';
    const mes = typeof req.query.mes === 'string' ? req.query.mes.trim() : '';
    const añoStr = typeof req.query.año === 'string' ? req.query.año.trim() : '';
    const tipo = typeof req.query.tipo === 'string' ? req.query.tipo.trim() : '';
    const userId = typeof req.query.userId === 'string' ? req.query.userId.trim() : '';

    let start: Date;
    let end: Date;

    if (vista === 'año') {
      const currentYear = new Date().getUTCFullYear();
      const añoInicio = currentYear - CANTIDAD_AÑOS_VISTA_AÑO + 1;
      start = new Date(Date.UTC(añoInicio, 0, 1, 0, 0, 0, 0));
      end = new Date(Date.UTC(currentYear + 1, 0, 1, 0, 0, 0, 0));
    } else if (mes) {
      if (!/^\d{4}-\d{2}$/.test(mes)) {
        return res.status(400).json({ error: 'Query "mes" debe ser YYYY-MM' });
      }
      const [y, m] = mes.split('-').map(Number);
      start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
    } else if (añoStr) {
      if (!/^\d{4}$/.test(añoStr)) {
        return res.status(400).json({ error: 'Query "año" debe ser YYYY' });
      }
      const año = parseInt(añoStr, 10);
      start = new Date(Date.UTC(año, 0, 1, 0, 0, 0, 0));
      end = new Date(Date.UTC(año + 1, 0, 1, 0, 0, 0, 0));
    } else {
      return res.status(400).json({ error: 'Indica "mes" (YYYY-MM), "año" (YYYY) o "vista=año"' });
    }

    const where: { fecha: { gte: Date; lt: Date }; tipo?: string; userId?: string } = {
      fecha: { gte: start, lt: end },
    };
    if (tipo === 'ingreso' || tipo === 'egreso') where.tipo = tipo;
    if (userId) where.userId = userId;

    const movimientos = await db.movimiento.findMany({
      where,
      orderBy: { fecha: 'asc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    const headerRow = ['Concepto', 'Monto', 'Fecha', 'Tipo', 'Usuario'].map(escapeCsvField).join(',');
    const rows = movimientos.map((mov: MovimientoConUser) => {
      const usuario = mov.user?.name ?? mov.user?.email ?? '';
      const fechaStr = new Date(mov.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return [
        escapeCsvField(mov.concepto),
        escapeCsvField(String(mov.monto)),
        escapeCsvField(fechaStr),
        escapeCsvField(mov.tipo),
        escapeCsvField(usuario),
      ].join(',');
    });
    const csv = [headerRow, ...rows].join('\r\n');
    const bom = '\uFEFF';
    const filename = `reporte-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(bom + csv);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en GET /api/reportes/csv:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
