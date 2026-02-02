import type { NextApiRequest, NextApiResponse } from 'next';
import { openApiSpec } from '@/lib/openapi-spec';

/**
 * GET /api/openapi — Devuelve la especificación OpenAPI 3.0 en JSON.
 * Consumida por Swagger UI en /api/docs.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openApiSpec);
}
