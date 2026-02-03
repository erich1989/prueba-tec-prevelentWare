import { useEffect, useState } from 'react';

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
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>('');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogNuevoOpen, setDialogNuevoOpen] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState<Movimiento | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);

  useEffect(() => {
    const loadMovimientos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/movimientos');
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
  }, []);

  const total = calcularTotal(movimientos);

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

  return {
    movimientos,
    loading,
    error,
    total,
    concepto,
    setConcepto,
    tipoFiltro,
    setTipoFiltro,
    usuarioFiltro,
    setUsuarioFiltro,
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
  };
}
