import type { SxProps, Theme } from '@mui/material';

export const backdropSx: SxProps<Theme> = {
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  backdropFilter: 'blur(4px)',
};

export const paperSx: SxProps<Theme> = {
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  overflow: 'hidden',
  maxWidth: 512,
};

export const contentBoxSx: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
};

export const headerRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 4,
};

export const dialogTitleSx: SxProps<Theme> = {
  fontFamily: '"Inter", sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  color: 'text.primary',
  letterSpacing: '-0.025em',
  p: 0,
  m: 0,
};

export const closeButtonSx: SxProps<Theme> = {
  color: 'grey.400',
  '&:hover': { color: 'grey.600' },
};

export const formContentSx: SxProps<Theme> = {
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const labelSx: SxProps<Theme> = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'grey.700',
  mb: 1.5,
};

export const inputSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: 'grey.50',
    '& fieldset': {
      border: '1px solid',
      borderColor: 'grey.300',
    },
    '&:hover fieldset': { borderColor: 'grey.400' },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
      borderColor: 'primary.main',
    },
    '&.Mui-focused': { bgcolor: 'background.paper' },
  },
};

export const inputAdornmentSx: SxProps<Theme> = { pl: 0.5 };

export const inputPropsSx: SxProps<Theme> = { py: 1.25 };

export const iconSx: SxProps<Theme> = { color: 'grey.500', fontSize: 22 };

export const submitWrapSx: SxProps<Theme> = { pt: 2 };

export const submitButtonSx: SxProps<Theme> = {
  py: 2,
  px: 3,
  fontSize: '1.125rem',
  fontWeight: 700,
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.2)',
  '&:hover': {
    bgcolor: '#022c22',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.25)',
    transform: 'translateY(-2px)',
  },
  '&:active': { transform: 'translateY(0)' },
};

export const footerSx: SxProps<Theme> = {
  px: 3,
  py: 2,
  bgcolor: 'grey.50',
  borderTop: '1px solid',
  borderColor: 'grey.100',
  display: 'flex',
  justifyContent: 'flex-end',
};

export const cancelButtonSx: SxProps<Theme> = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'grey.500',
  textTransform: 'none',
  '&:hover': { bgcolor: 'transparent', color: 'grey.700' },
};
