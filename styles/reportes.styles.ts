import type { SxProps, Theme } from '@mui/material';

export const labelCaptionSx: SxProps<Theme> = {
  fontSize: '10px',
  fontWeight: 700,
  color: 'grey.500',
  mb: 1,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export const labelCaptionWithMbSx: SxProps<Theme> = {
  ...labelCaptionSx,
  mb: 2,
};

export const chartHeaderRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 2,
  mb: 2,
};

export const chartVistaSelectSx: SxProps<Theme> = {
  minWidth: 140,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'grey.200' },
  },
};

export const chartMesDiaWrapperSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
};

export const chartMesDiaLabelSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'text.secondary',
};

export const chartMesInputSx: SxProps<Theme> = {
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'grey.200' },
  },
};

export const pageTitleSx: SxProps<Theme> = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 700,
  color: 'text.primary',
  textTransform: 'uppercase',
  letterSpacing: '-0.025em',
  fontSize: '1.5rem',
};

export const filterCardSx: SxProps<Theme> = {
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid',
  borderColor: 'grey.200',
};

export const filterCardContentSx: SxProps<Theme> = {
  p: 3,
};

/** Contenedor: filtros a la izquierda, "Hoy es" a la derecha. */
export const filterContentWrapperSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 2,
};

export const filterRowSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  alignItems: 'flex-end',
};

export const formControlDateSx: SxProps<Theme> = {
  minWidth: 160,
};

export const formControlSelectSx: SxProps<Theme> = {
  width: 192,
};

export const dateInputSx: SxProps<Theme> = {
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

export const gridContainerSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
  gap: 3,
  alignItems: 'stretch',
};

export const cardBaseSx: SxProps<Theme> = {
  borderRadius: '16px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  border: '1px solid',
  borderColor: 'grey.200',
  overflow: 'hidden',
};

export const cardChartSx: SxProps<Theme> = cardBaseSx;

export const cardSaldoSx: SxProps<Theme> = {
  ...cardBaseSx,
  minWidth: { md: 220 },
};

export const cardContentChartSx: SxProps<Theme> = {
  p: 3,
};

export const cardContentSaldoSx: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const saldoValueSx: SxProps<Theme> = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 700,
  color: 'primary.main',
  fontSize: '1.875rem',
};

export const csvButtonSx: SxProps<Theme> = {
  textTransform: 'uppercase',
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  borderRadius: '8px',
  px: 3,
  py: 1.5,
  mt: 1,
  '&:hover': { bgcolor: '#ecfdf5', borderColor: 'primary.main' },
};

export const pageContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

/** Elemento "Hoy es" (igual que en Inicio), alineado a la derecha en filtros. */
export const todayPaperSx: SxProps<Theme> = {
  px: 2,
  py: 1.5,
  borderRadius: '16px',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.100',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const todayIconWrapperSx: SxProps<Theme> = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  bgcolor: '#d1fae5',
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const todayLabelSx: SxProps<Theme> = {
  color: 'text.secondary',
  display: 'block',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const todayValueSx: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.primary',
};

export const todayCalendarIconSx: SxProps<Theme> = { fontSize: 24 };
