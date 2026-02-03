import type { SxProps, Theme } from '@mui/material';

export const rootSx: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'grey.50',
  py: 4,
  px: 2,
};

export const cardSx: SxProps<Theme> = {
  maxWidth: 420,
  width: '100%',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  border: '1px solid',
  borderColor: 'grey.200',
  overflow: 'hidden',
};

export const cardContentSx: SxProps<Theme> = {
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 3,
};

export const titleSx: SxProps<Theme> = {
  fontFamily: '"Outfit", sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  color: 'text.primary',
  letterSpacing: '-0.025em',
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  lineHeight: 1.5,
};

export const loginButtonSx: SxProps<Theme> = {
  width: '100%',
  py: 1.5,
  px: 3,
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  '&:hover': {
    bgcolor: 'primary.dark',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.2)',
  },
};
