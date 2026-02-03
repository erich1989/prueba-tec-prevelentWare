import { useState, useEffect, useMemo } from 'react';

function getMesActualYYYYMM(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function variacionPorcentual(actual: number, anterior: number): number | null {
  if (anterior === 0) return actual === 0 ? 0 : null;
  return Math.round(((actual - anterior) / anterior) * 100);
}

export interface ResumenMesData {
  ingresos: number;
  gastos: number;
  ingresosMesAnterior: number;
  gastosMesAnterior: number;
}

export function useResumenMes(mes: string) {
  const [data, setData] = useState<ResumenMesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/reportes/resumen-mes?mes=${encodeURIComponent(mes)}`, { credentials: 'same-origin', cache: 'no-store' })
      .then((res) => {
        if (res.status === 403) {
          throw new Error('Solo administradores pueden ver el resumen del mes');
        }
        if (!res.ok) {
          throw new Error('Error al cargar el resumen del mes');
        }
        return res.json();
      })
      .then((body: { data?: ResumenMesData }) => {
        if (!cancelled && body.data) {
          setData(body.data);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar el resumen');
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mes]);

  const variacionIngresos = useMemo(() => {
    if (!data) return null;
    return variacionPorcentual(data.ingresos, data.ingresosMesAnterior);
  }, [data]);

  const variacionGastos = useMemo(() => {
    if (!data) return null;
    return variacionPorcentual(data.gastos, data.gastosMesAnterior);
  }, [data]);

  return {
    data,
    loading,
    error,
    variacionIngresos,
    variacionGastos,
  };
}

export { getMesActualYYYYMM };
