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

export const formControlConceptoSx: SxProps<Theme> = { flex: 0.5, minWidth: 250 };

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

export const tableCellSx: SxProps<Theme> = {
  px: 4,
  py: 2.5,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'text.primary',
};

/** Círculo con icono de tendencia a la izquierda del concepto. */
export const conceptoIconWrapperSx: SxProps<Theme> = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const conceptoIconIngresoSx: SxProps<Theme> = {
  ...conceptoIconWrapperSx,
  bgcolor: '#d1fae5',
  color: '#059669',
};

export const conceptoIconEgresoSx: SxProps<Theme> = {
  ...conceptoIconWrapperSx,
  bgcolor: '#fee2e2',
  color: '#dc2626',
};

export const conceptoCellContentSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const tableCellSecondarySx: SxProps<Theme> = {
  px: 4,
  py: 2.5,
  fontSize: '0.875rem',
  color: 'grey.500',
};

export const tableCellMontoSx: SxProps<Theme> = {
  px: 4,
  py: 2.5,
  fontSize: '0.875rem',
  fontWeight: 600,
};

/** Mismo estilo que el botón Editar de la tabla de usuarios. */
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

export const totalWrapperSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export const totalCardSx: SxProps<Theme> = {
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid',
  borderColor: 'grey.200',
  minWidth: 200,
  textAlign: 'right',
};

export const totalCardContentSx: SxProps<Theme> = { p: 3 };

export const totalLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'grey.500',
  display: 'block',
  mb: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const totalValueSx: SxProps<Theme> = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 700,
  color: 'primary.main',
  fontSize: '1.875rem',
};

export const searchIconSx: SxProps<Theme> = { color: 'grey.500', fontSize: 20 };
