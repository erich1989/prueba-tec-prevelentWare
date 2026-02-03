import { useState, useCallback, useMemo, useEffect } from 'react';

export type VistaGrafica = 'dia' | 'mes' | 'año';

const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getMesActualYYYYMM(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Formatea YYYY-MM como "Enero 2024". */
export function formatMesParaVistaDia(ym: string): string {
  if (!ym || ym.length < 7) return '';
  const [y, m] = ym.split('-');
  const monthIndex = parseInt(m, 10) - 1;
  const monthName = MESES_NOMBRES[monthIndex] ?? m;
  return `${monthName} ${y}`;
}

export function useReportes() {
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>('');
  const [vistaGrafica, setVistaGrafica] = useState<VistaGrafica>('dia');
  const [mesParaVistaDia, setMesParaVistaDia] = useState<string>(getMesActualYYYYMM());
  const [añoParaVistaMes, setAñoParaVistaMes] = useState<number>(() => new Date().getFullYear());
  const [dataIngresosPorDia, setDataIngresosPorDia] = useState<number[]>([]);
  const [dataEgresosPorDia, setDataEgresosPorDia] = useState<number[]>([]);
  const [dataIngresosPorMes, setDataIngresosPorMes] = useState<number[]>([]);
  const [dataEgresosPorMes, setDataEgresosPorMes] = useState<number[]>([]);
  const [dataIngresosPorAño, setDataIngresosPorAño] = useState<number[]>([]);
  const [dataEgresosPorAño, setDataEgresosPorAño] = useState<number[]>([]);
  const [añosVistaAño, setAñosVistaAño] = useState<number[]>([]);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [errorSaldo, setErrorSaldo] = useState<string | null>(null);

  // Saldo actual: cargar una vez al montar (solo ADMIN ve reportes)
  useEffect(() => {
    let cancelled = false;
    setLoadingSaldo(true);
    setErrorSaldo(null);
    fetch('/api/reportes/saldo')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar saldo');
        return res.json();
      })
      .then((body: { data?: { saldo?: number } }) => {
        if (!cancelled && typeof body.data?.saldo === 'number') {
          setSaldo(body.data.saldo);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErrorSaldo(e instanceof Error ? e.message : 'Error al cargar saldo');
          setSaldo(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSaldo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Vista por día: cargar datos del mes desde el backend (ingresos y egresos por separado)
  useEffect(() => {
    if (vistaGrafica !== 'dia' || !mesParaVistaDia || mesParaVistaDia.length < 7) {
      setDataIngresosPorDia([]);
      setDataEgresosPorDia([]);
      return;
    }
    let cancelled = false;
    setLoadingReporte(true);
    setErrorReporte(null);
    fetch(`/api/reportes?mes=${encodeURIComponent(mesParaVistaDia)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar reporte');
        return res.json();
      })
      .then((body: { data?: { ingresosPorDia?: number[]; egresosPorDia?: number[] } }) => {
        if (!cancelled && Array.isArray(body.data?.ingresosPorDia) && Array.isArray(body.data?.egresosPorDia)) {
          setDataIngresosPorDia(body.data.ingresosPorDia);
          setDataEgresosPorDia(body.data.egresosPorDia);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErrorReporte(e instanceof Error ? e.message : 'Error al cargar reporte');
          setDataIngresosPorDia([]);
          setDataEgresosPorDia([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReporte(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vistaGrafica, mesParaVistaDia]);

  // Vista por mes: cargar datos del año desde el backend (ingresos y egresos por mes, 12 valores)
  useEffect(() => {
    if (vistaGrafica !== 'mes' || !añoParaVistaMes) {
      setDataIngresosPorMes([]);
      setDataEgresosPorMes([]);
      return;
    }
    let cancelled = false;
    setLoadingReporte(true);
    setErrorReporte(null);
    fetch(`/api/reportes?año=${encodeURIComponent(String(añoParaVistaMes))}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar reporte');
        return res.json();
      })
      .then((body: { data?: { ingresosPorMes?: number[]; egresosPorMes?: number[] } }) => {
        if (!cancelled && Array.isArray(body.data?.ingresosPorMes) && Array.isArray(body.data?.egresosPorMes)) {
          setDataIngresosPorMes(body.data.ingresosPorMes);
          setDataEgresosPorMes(body.data.egresosPorMes);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErrorReporte(e instanceof Error ? e.message : 'Error al cargar reporte');
          setDataIngresosPorMes([]);
          setDataEgresosPorMes([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReporte(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vistaGrafica, añoParaVistaMes]);

  // Vista por año: cargar datos de los últimos años desde el backend (ingresos y egresos por año)
  useEffect(() => {
    if (vistaGrafica !== 'año') {
      setDataIngresosPorAño([]);
      setDataEgresosPorAño([]);
      setAñosVistaAño([]);
      return;
    }
    let cancelled = false;
    setLoadingReporte(true);
    setErrorReporte(null);
    fetch('/api/reportes?vista=año')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar reporte');
        return res.json();
      })
      .then((body: { data?: { años?: number[]; ingresosPorAño?: number[]; egresosPorAño?: number[] } }) => {
        if (
          !cancelled &&
          Array.isArray(body.data?.años) &&
          Array.isArray(body.data?.ingresosPorAño) &&
          Array.isArray(body.data?.egresosPorAño)
        ) {
          setAñosVistaAño(body.data.años);
          setDataIngresosPorAño(body.data.ingresosPorAño);
          setDataEgresosPorAño(body.data.egresosPorAño);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErrorReporte(e instanceof Error ? e.message : 'Error al cargar reporte');
          setDataIngresosPorAño([]);
          setDataEgresosPorAño([]);
          setAñosVistaAño([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReporte(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vistaGrafica]);

  const handleDescargarCSV = useCallback(() => {
    const params = new URLSearchParams();
    if (vistaGrafica === 'dia') {
      params.set('mes', mesParaVistaDia);
    } else if (vistaGrafica === 'mes') {
      params.set('año', String(añoParaVistaMes));
    } else if (vistaGrafica === 'año') {
      params.set('vista', 'año');
    }
    if (tipoFiltro === 'ingreso' || tipoFiltro === 'egreso') params.set('tipo', tipoFiltro);
    if (usuarioFiltro) params.set('userId', usuarioFiltro);
    const query = params.toString();
    const url = `/api/reportes/csv${query ? `?${query}` : ''}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error al descargar CSV');
        return res.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `reporte-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(() => {
        setErrorReporte('Error al descargar CSV');
      });
  }, [vistaGrafica, mesParaVistaDia, añoParaVistaMes, tipoFiltro, usuarioFiltro]);

  const mesParaVistaDiaLabel = useMemo(
    () => formatMesParaVistaDia(mesParaVistaDia),
    [mesParaVistaDia]
  );

  return {
    tipoFiltro,
    setTipoFiltro,
    usuarioFiltro,
    setUsuarioFiltro,
    vistaGrafica,
    setVistaGrafica,
    mesParaVistaDia,
    setMesParaVistaDia,
    mesParaVistaDiaLabel,
    añoParaVistaMes,
    setAñoParaVistaMes,
    dataIngresosPorDia,
    dataEgresosPorDia,
    dataIngresosPorMes,
    dataEgresosPorMes,
    dataIngresosPorAño,
    dataEgresosPorAño,
    añosVistaAño,
    loadingReporte,
    errorReporte,
    saldo,
    loadingSaldo,
    errorSaldo,
    handleDescargarCSV,
  };
}
