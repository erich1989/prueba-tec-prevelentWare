import { useEffect, useState, useMemo, useRef, useCallback } from 'react';

const DEBOUNCE_MS = 500;

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: string;
  estado: string;
}

function mapApiUserToUsuario(u: { id?: string; name?: string; email?: string; phone?: string | null; role?: string; estado?: string }): Usuario {
  return {
    id: u.id ?? '',
    nombre: u.name ?? u.email ?? '',
    correo: u.email ?? '',
    telefono: u.phone ?? null,
    rol: u.role ?? 'USER',
    estado: u.estado ?? 'Activo',
  };
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

export function useUsuarios() {
  const [nombreCorreo, setNombreCorreo] = useState('');
  const [queryDebounced, setQueryDebounced] = useState('');
  const [rolFiltro, setRolFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce de 500 ms para el texto de búsqueda antes de hacer la petición
  useEffect(() => {
    const trimmed = (nombreCorreo ?? '').trim();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setQueryDebounced(trimmed);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [nombreCorreo]);

  /** Parámetro rol para la API: ADMIN | USER o vacío. */
  const rolParam = useMemo(() => {
    const r = (rolFiltro ?? '').trim();
    if (r === 'Admin' || r.toUpperCase() === 'ADMIN') return 'ADMIN';
    if (r === 'Usuario' || r.toUpperCase() === 'USER') return 'USER';
    return '';
  }, [rolFiltro]);

  /** Parámetro estado para la API: Activo | Inactivo o vacío. */
  const estadoParam = useMemo(() => {
    const e = (estadoFiltro ?? '').trim();
    if (e === 'Activo' || e === 'Inactivo') return e;
    return '';
  }, [estadoFiltro]);

  // Petición al backend con ?q=, ?rol= y ?estado= cuando cambian búsqueda (debounced), rol o estado
  useEffect(() => {
    const loadUsuarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (queryDebounced) params.set('q', queryDebounced);
        if (rolParam) params.set('rol', rolParam);
        if (estadoParam) params.set('estado', estadoParam);
        const url = params.toString() ? `/api/usuarios?${params.toString()}` : '/api/usuarios';
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const body = await res.json();
        const data = body.data ?? [];
        const mapped: Usuario[] = (data as any[]).map(mapApiUserToUsuario);
        setUsuarios(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    void loadUsuarios();
  }, [queryDebounced, rolParam, estadoParam]);

  const handleCrearUsuarioSubmit = async (data: { nombre: string; correo: string; telefono: string; rol: string; estado: string }) => {
    if (!data.correo?.trim()) return;

    setErrorCrear(null);
    setSending(true);

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre?.trim(),
          correo: data.correo?.trim(),
          telefono: data.telefono?.trim() || null,
          rol: data.rol,
          estado: data.estado === 'Inactivo' ? 'Inactivo' : 'Activo',
        }),
      });

      if (!res.ok) {
        setErrorCrear(await parseErrorResponse(res, 'Error al crear usuario'));
        return;
      }

      const body = await res.json();
      const nuevo = body.data as any;
      setUsuarios((prev) => [mapApiUserToUsuario(nuevo), ...prev]);
      setDialogOpen(false);
    } catch (e) {
      setErrorCrear(e instanceof Error ? e.message : 'Error inesperado al crear usuario');
      // eslint-disable-next-line no-console
      console.error('Error inesperado al crear usuario', e);
    } finally {
      setSending(false);
    }
  };

  const handleEditarUsuario = async (id: string, data: { nombre: string; correo: string; telefono: string; rol: string; estado: string }) => {
    if (!data.nombre?.trim()) return;

    setErrorCrear(null);
    setSending(true);

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre?.trim(),
          correo: data.correo?.trim() || undefined,
          telefono: data.telefono?.trim() || null,
          rol: data.rol,
          estado: data.estado === 'Inactivo' ? 'Inactivo' : 'Activo',
        }),
      });

      if (!res.ok) {
        setErrorCrear(await parseErrorResponse(res, 'Error al actualizar usuario'));
        return;
      }

      const body = await res.json();
      const updated = body.data as { id: string; name?: string; email?: string; phone?: string | null; role?: string; estado?: string };

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                nombre: updated.name ?? u.nombre,
                correo: updated.email ?? u.correo,
                telefono: updated.phone ?? u.telefono,
                rol: updated.role ?? u.rol,
                estado: updated.estado ?? u.estado,
              }
            : u
        )
      );
      setDialogOpen(false);
      setUsuarioEditando(null);
    } catch (e) {
      setErrorCrear(e instanceof Error ? e.message : 'Error inesperado al actualizar usuario');
      // eslint-disable-next-line no-console
      console.error('Error inesperado al editar usuario', e);
    } finally {
      setSending(false);
    }
  };

  const openModalCrear = () => {
    setUsuarioEditando(null);
    setDialogOpen(true);
  };

  const openModalEditar = (row: Usuario) => {
    setUsuarioEditando(row);
    setDialogOpen(true);
  };

  const handleEliminarUsuario = async (id: string) => {
    setEliminandoId(id);
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await parseErrorResponse(res, 'Error al eliminar usuario');
        setError(msg);
        return;
      }
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado al eliminar');
      // eslint-disable-next-line no-console
      console.error('Error al eliminar usuario', e);
    } finally {
      setEliminandoId(null);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setUsuarioEditando(null);
    setErrorCrear(null);
  };

  const limpiarFiltros = useCallback(() => {
    setNombreCorreo('');
    setRolFiltro('');
    setEstadoFiltro('');
  }, []);

  /** Lista ya filtrada por backend (q, rol, estado); sin filtro adicional en cliente. */
  const usuariosFiltrados = useMemo(() => usuarios, [usuarios]);

  /** Mensaje para la fila vacía (sin usuarios): prefix + highlight en negrilla + suffix. */
  const emptyStateMessage = useMemo((): { prefix: string; highlight: string | null; suffix: string } | null => {
    if (usuariosFiltrados.length > 0) return null;
    const textoBusqueda = (nombreCorreo ?? '').trim();
    const tieneRol = (rolFiltro ?? '').trim().length > 0;
    const tieneEstado = (estadoFiltro ?? '').trim().length > 0;
    const extras: string[] = [];
    if (tieneRol) extras.push('el rol seleccionado');
    if (tieneEstado) extras.push('el estado seleccionado');
    const sufijoExtras = extras.length > 0 ? ` y ${extras.join(' y ')}.` : '.';
    if (textoBusqueda) {
      return {
        prefix: 'No se encontraron usuarios con el texto ingresado «',
        highlight: textoBusqueda,
        suffix: `»${sufijoExtras}`,
      };
    }
    if (tieneRol || tieneEstado) {
      return {
        prefix: `No se encontraron usuarios con ${extras.join(' y ')}.`,
        highlight: null,
        suffix: '',
      };
    }
    return {
      prefix: 'No hay usuarios.',
      highlight: null,
      suffix: '',
    };
  }, [usuariosFiltrados.length, nombreCorreo, rolFiltro, estadoFiltro]);

  return {
    usuarios: usuariosFiltrados,
    loading,
    error,
    nombreCorreo,
    setNombreCorreo,
    emptyStateMessage,
    rolFiltro,
    setRolFiltro,
    estadoFiltro,
    setEstadoFiltro,
    dialogOpen,
    usuarioEditando,
    eliminandoId,
    sending,
    errorCrear,
    handleCrearUsuarioSubmit,
    handleEditarUsuario,
    handleEliminarUsuario,
    openModalCrear,
    openModalEditar,
    closeDialog,
    limpiarFiltros,
  };
}
