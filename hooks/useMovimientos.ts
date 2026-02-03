import { useEffect, useState, useMemo, useRef, useCallback } from 'react';

const DEBOUNCE_MS = 500;

export type TipoMovimiento = 'ingreso' | 'egreso';

export interface Movimiento {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  /** Fecha en ISO (YYYY-MM-DD) para el formulario de edición. */
  fechaISO: string;
  usuario: string;
  tipo: TipoMovimiento;
}

interface ApiMovimiento {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  usuario: string;
  tipo: string;
}

function mapApiToMovimiento(m: ApiMovimiento): Movimiento {
  const fechaISO = m.fecha ? new Date(m.fecha).toISOString().slice(0, 10) : '';
  return {
    id: m.id,
    concepto: m.concepto,
    monto: Number(m.monto),
    fecha: m.fecha ? new Date(m.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—',
    fechaISO,
    usuario: m.usuario ?? '—',
    tipo: m.tipo as TipoMovimiento,
  };
}

function calcularTotal(movimientos: Movimiento[]): number {
  return movimientos.reduce((acc, m) => (m.tipo === 'ingreso' ? acc + m.monto : acc - m.monto), 0);
}

async function parseErrorResponse(res: Response, defaultMessage: string): Promise<string> {
  const text = await res.text();
  if (!text) return defaultMessage;
  try {
    const bodyErr = JSON.parse(text) as { error?: string };
    return typeof bodyErr?.error === 'string' ? bodyErr.error : text;
  } catch {
    return text;
  }
}

export function useMovimientos() {
  const [concepto, setConcepto] = useState('');
  const [conceptoDebounced, setConceptoDebounced] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogNuevoOpen, setDialogNuevoOpen] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<Movimiento | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce de 500 ms para el filtro de concepto antes de hacer la petición
  useEffect(() => {
    const trimmed = (concepto ?? '').trim();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setConceptoDebounced(trimmed);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [concepto]);

  /** Parámetro tipo para la API: ingreso | egreso o vacío. */
  const tipoParam = useMemo(() => {
    const t = (tipoFiltro ?? '').trim().toLowerCase();
    return t === 'ingreso' || t === 'egreso' ? t : '';
  }, [tipoFiltro]);

  /** Parámetros de fecha para la API: YYYY-MM-DD o vacío. */
  const fechaDesdeParam = useMemo(() => {
    const s = (fechaDesde ?? '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }, [fechaDesde]);
  const fechaHastaParam = useMemo(() => {
    const s = (fechaHasta ?? '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }, [fechaHasta]);

  // Petición al backend con ?concepto=, ?tipo=, ?fechaDesde=, ?fechaHasta= cuando cambian
  useEffect(() => {
    const loadMovimientos = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (conceptoDebounced) params.set('concepto', conceptoDebounced);
        if (tipoParam) params.set('tipo', tipoParam);
        if (fechaDesdeParam) params.set('fechaDesde', fechaDesdeParam);
        if (fechaHastaParam) params.set('fechaHasta', fechaHastaParam);
        const url = params.toString() ? `/api/movimientos?${params.toString()}` : '/api/movimientos';
        const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Error al obtener movimientos');
        }
        const body = await res.json();
        const data = body.data ?? [];
        const mapped: Movimiento[] = (data as ApiMovimiento[]).map(mapApiToMovimiento);
        setMovimientos(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar movimientos');
      } finally {
        setLoading(false);
      }
    };

    void loadMovimientos();
  }, [conceptoDebounced, tipoParam, fechaDesdeParam, fechaHastaParam]);

  const total = calcularTotal(movimientos); // Total calculado sobre todos los movimientos (no solo la página)

  const handleNuevoMovimientoSubmit = async (data: { tipo: TipoMovimiento; monto: string; concepto: string; fecha: string }) => {
    const montoNum = parseFloat(data.monto) || 0;
    if (montoNum <= 0) return;

    setErrorCrear(null);
    setSending(true);

    try {
      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: montoNum,
          concepto: data.concepto?.trim() || '',
          fecha: data.fecha || new Date().toISOString().slice(0, 10),
          tipo: data.tipo,
        }),
      });

      if (!res.ok) {
        setErrorCrear(await parseErrorResponse(res, 'Error al crear movimiento'));
        return;
      }

      const body = await res.json();
      const nuevo = body.data as ApiMovimiento;

      const mapped: Movimiento = mapApiToMovimiento(nuevo);
      setMovimientos((prev) => [mapped, ...prev]);
      setDialogNuevoOpen(false);
    } catch (e) {
      setErrorCrear(e instanceof Error ? e.message : 'Error inesperado al crear movimiento');
      // eslint-disable-next-line no-console
      console.error('Error al crear movimiento', e);
    } finally {
      setSending(false);
    }
  };

  const handleEditarMovimiento = async (id: string, data: { tipo: TipoMovimiento; monto: string; concepto: string; fecha: string }) => {
    const montoNum = parseFloat(data.monto) || 0;
    if (montoNum <= 0) return;

    setErrorCrear(null);
    setSending(true);

    try {
      const res = await fetch(`/api/movimientos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: montoNum,
          concepto: data.concepto?.trim() || '',
          fecha: data.fecha || new Date().toISOString().slice(0, 10),
          tipo: data.tipo,
        }),
      });

      if (!res.ok) {
        setErrorCrear(await parseErrorResponse(res, 'Error al actualizar movimiento'));
        return;
      }

      const body = await res.json();
      const actualizado = body.data as ApiMovimiento;
      const mapped: Movimiento = mapApiToMovimiento(actualizado);
      setMovimientos((prev) => prev.map((m) => (m.id === id ? mapped : m)));
      setDialogNuevoOpen(false);
      setMovimientoEditando(null);
    } catch (e) {
      setErrorCrear(e instanceof Error ? e.message : 'Error inesperado al actualizar movimiento');
      // eslint-disable-next-line no-console
      console.error('Error al editar movimiento', e);
    } finally {
      setSending(false);
    }
  };

  const openDialogNuevo = () => {
    setMovimientoEditando(null);
    setDialogNuevoOpen(true);
  };

  const openModalEditar = (movimiento: Movimiento) => {
    setMovimientoEditando(movimiento);
    setDialogNuevoOpen(true);
  };

  const handleEliminarMovimiento = async (id: string) => {
    setEliminandoId(id);
    try {
      const res = await fetch(`/api/movimientos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await parseErrorResponse(res, 'Error al eliminar movimiento');
        setError(msg);
        return;
      }
      setMovimientos((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado al eliminar');
      // eslint-disable-next-line no-console
      console.error('Error al eliminar movimiento', e);
    } finally {
      setEliminandoId(null);
    }
  };

  const closeDialog = () => {
    setDialogNuevoOpen(false);
    setMovimientoEditando(null);
    setErrorCrear(null);
  };

  const limpiarFiltros = useCallback(() => {
    setConcepto('');
    setTipoFiltro('');
    setFechaDesde('');
    setFechaHasta('');
  }, []);

  /** Mensaje para la fila vacía (sin movimientos): prefix + highlight en negrilla + suffix. */
  const emptyStateMessage = useMemo((): { prefix: string; highlight: string | null; suffix: string } | null => {
    if (movimientos.length > 0) return null;
    const textoConcepto = (concepto ?? '').trim();
    const tieneTipo = (tipoFiltro ?? '').trim().length > 0;
    const tieneFecha = (fechaDesde ?? '').trim().length > 0 || (fechaHasta ?? '').trim().length > 0;
    const extras: string[] = [];
    if (tieneTipo) extras.push('el tipo seleccionado');
    if (tieneFecha) extras.push('el rango de fechas');
    const sufijoExtras = extras.length > 0 ? ` y ${extras.join(' y ')}.` : '.';
    if (textoConcepto) {
      return {
        prefix: 'No se encontraron movimientos con el concepto «',
        highlight: textoConcepto,
        suffix: `»${sufijoExtras}`,
      };
    }
    if (tieneTipo || tieneFecha) {
      return {
        prefix: `No se encontraron movimientos con ${extras.join(' y ')}.`,
        highlight: null,
        suffix: '',
      };
    }
    return {
      prefix: 'No hay movimientos registrados.',
      highlight: null,
      suffix: '',
    };
  }, [movimientos.length, concepto, tipoFiltro, fechaDesde, fechaHasta]);

  /** Resetear página cuando los datos cambian y la página actual queda fuera de rango. */
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(movimientos.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [movimientos.length, rowsPerPage, page]);

  /** Filas visibles para la página actual. */
  const movimientosPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    return movimientos.slice(start, start + rowsPerPage);
  }, [movimientos, page, rowsPerPage]);

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    movimientos: movimientosPaginados,
    movimientosTotal: movimientos.length,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    loading,
    error,
    total,
    concepto,
    setConcepto,
    tipoFiltro,
    setTipoFiltro,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    dialogNuevoOpen,
    movimientoEditando,
    eliminandoId,
    sending,
    errorCrear,
    handleNuevoMovimientoSubmit,
    handleEditarMovimiento,
    handleEliminarMovimiento,
    openDialogNuevo,
    openModalEditar,
    closeDialog,
    limpiarFiltros,
    emptyStateMessage,
  };
}
