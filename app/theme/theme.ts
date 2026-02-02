'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#064e3b', // Stitch: dark green
      light: '#047857',
      dark: '#022c22',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00C49A', // Verde Menta - Botones, gráficos, elementos interactivos
      light: '#4DD0E1',
      dark: '#009688',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ECC71', // Verde Lima Neón - Indicadores de éxito
      light: '#58D68D',
      dark: '#27AE60',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Rojo - Indicadores negativos/errores
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Stitch: background-light
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Gris oscuro - Texto principal
      secondary: '#6b7280', // Gris medio - Texto secundario
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280', // Gris medio
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937', // Gris oscuro
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 700 },
    h2: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 700 },
    h3: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 600 },
    h4: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 600 },
    h5: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', color: '#1f2937', fontWeight: 600 },
    body1: {
      color: '#1f2937',
    },
    body2: {
      color: '#6b7280',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '0.75rem',
          '&.MuiButton-containedSecondary': {
            '&:hover': {
              bgcolor: '#009688', // Verde Menta oscuro en hover
            },
          },
          '&.MuiButton-containedSuccess': {
            '&:hover': {
              bgcolor: '#27AE60', // Verde Lima Neón oscuro en hover
            },
          },
        },
        outlined: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '0.75rem',
        },
        text: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '0.75rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'grey.100',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
        },
      },
    },
  },
});
