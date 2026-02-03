import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const headerRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 2,
};

export const pageTitleSx: SxProps<Theme> = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 700,
  color: 'text.primary',
  textTransform: 'uppercase',
  letterSpacing: '-0.025em',
  fontSize: '1.5rem',
};

export const nuevoButtonSx: SxProps<Theme> = {
  textTransform: 'uppercase',
  fontWeight: 700,
  fontSize: '0.875rem',
  letterSpacing: '0.05em',
  borderRadius: '8px',
  px: 4,
  py: 1.5,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  '&:hover': { bgcolor: 'primary.dark' },
};

export const filterCardSx: SxProps<Theme> = {
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid',
  borderColor: 'grey.200',
};

export const filterCardContentSx: SxProps<Theme> = { p: 3 };

export const filterRowSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  alignItems: 'flex-end',
};

export const labelCaptionSx: SxProps<Theme> = {
  fontSize: '10px',
  fontWeight: 700,
  color: 'grey.500',
  mb: 1,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const formControlSearchSx: SxProps<Theme> = { flex: 0.5, minWidth: 250 };

export const formControlSelectSx: SxProps<Theme> = { width: 192 };

export const searchInputSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'grey.200' },
  },
};

export const selectSx: SxProps<Theme> = {
  borderRadius: '8px',
  bgcolor: 'grey.50',
  fontSize: '0.875rem',
  '& fieldset': { borderColor: 'grey.200' },
};

export const filterButtonSx: SxProps<Theme> = {
  height: 38,
  textTransform: 'uppercase',
  fontWeight: 700,
  fontSize: '0.75rem',
  borderRadius: '8px',
  px: 3,
  '&:hover': { bgcolor: '#ecfdf5', borderColor: 'primary.main' },
};

export const tableCardSx: SxProps<Theme> = {
  borderRadius: '16px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid',
  borderColor: 'grey.200',
  overflow: 'hidden',
};

export const tableContainerSx: SxProps<Theme> = { border: 'none' };

export const tableSx: SxProps<Theme> = { minWidth: 600 };

export const tableHeadRowSx: SxProps<Theme> = { bgcolor: 'rgba(249, 250, 251, 0.5)' };

export const tableHeadCellSx: SxProps<Theme> = {
  fontWeight: 700,
  color: 'grey.500',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.75rem',
  borderBottom: '1px solid',
  borderColor: 'grey.200',
  px: 4,
  py: 2,
};

export const tableBodyRowSx: SxProps<Theme> = {
  '&:hover': { bgcolor: 'rgba(249, 250, 251, 0.5)' },
  '& td': { borderBottom: '1px solid', borderColor: 'grey.100' },
  '&:last-child td': { borderBottom: 0 },
};

/** Fila del footer (paginación): borde superior para separar del cuerpo. */
export const tableFooterRowSx: SxProps<Theme> = {
  borderTop: '1px solid',
  borderColor: 'grey.200',
};

export const tableCellSx: SxProps<Theme> = {
  px: 4,
  py: 2.5,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'text.primary',
};

export const tableCellSecondarySx: SxProps<Theme> = {
  px: 4,
  py: 2.5,
  fontSize: '0.875rem',
  color: 'grey.600',
};

/** Texto en negrilla para el mensaje de “sin resultados” (ej. texto de búsqueda). */
export const emptyCellTextBoldSx: SxProps<Theme> = {
  fontWeight: 'bold',
};

export const editButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: '8px',
  px: 2,
  py: 1,
  border: '1px solid',
  borderColor: 'primary.main',
  color: 'primary.main',
  '&:hover': {
    borderColor: 'primary.dark',
    bgcolor: 'rgba(5, 150, 105, 0.08)',
  },
};

export const deleteButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  borderRadius: '8px',
  px: 2,
  py: 1,
  border: '1px solid',
  borderColor: 'error.main',
  color: 'error.main',
  '&:hover': {
    borderColor: 'error.dark',
    bgcolor: 'rgba(211, 47, 47, 0.08)',
  },
};

export const searchIconSx: SxProps<Theme> = { color: 'grey.500', fontSize: 20 };

export function getRoleChipStyles(rol: string): SxProps<Theme> {
  if (rol === 'ADMIN') {
    return {
      bgcolor: 'rgba(76, 175, 80, 0.08)',
      color: '#2e7d32',
      borderColor: 'rgba(76, 175, 80, 0.4)',
      fontWeight: 500,
    };
  }
  if (rol === 'USER') {
    return {
      bgcolor: 'rgba(25, 118, 210, 0.08)',
      color: '#1565c0',
      borderColor: 'rgba(25, 118, 210, 0.4)',
      fontWeight: 500,
    };
  }
  return {
    bgcolor: 'rgba(0, 0, 0, 0.02)',
    color: '#616161',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    fontWeight: 500,
  };
}

export function getEstadoChipStyles(estado: string): SxProps<Theme> {
  if (estado === 'Activo') {
    return {
      bgcolor: 'rgba(76, 175, 80, 0.08)',
      color: '#2e7d32',
      borderColor: 'rgba(76, 175, 80, 0.4)',
      fontWeight: 500,
    };
  }
  if (estado === 'Inactivo') {
    return {
      bgcolor: 'rgba(158, 158, 158, 0.12)',
      color: '#616161',
      borderColor: 'rgba(158, 158, 158, 0.4)',
      fontWeight: 500,
    };
  }
  return {
    bgcolor: 'rgba(0, 0, 0, 0.02)',
    color: '#616161',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    fontWeight: 500,
  };
}
