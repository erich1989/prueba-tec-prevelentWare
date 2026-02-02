import type { SxProps, Theme } from '@mui/material';

export const drawerWidth = 240;
export const miniDrawerWidth = 64;

export const rootSx: SxProps<Theme> = {
  display: 'flex',
  bgcolor: 'background.default',
  minHeight: '100vh',
};

export function getAppBarSx(open: boolean): SxProps<Theme> {
  return {
    width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)`,
    ml: open ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
    bgcolor: 'primary.main',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    transition: (theme: Theme) =>
      theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
  };
}

export const appBarToolbarSx: SxProps<Theme> = {
  height: 64,
  px: { xs: 2, md: 3 },
};

export const appBarTitleSx: SxProps<Theme> = {
  flexGrow: 1,
  color: 'white',
  fontWeight: 600,
  fontSize: '1.125rem',
  letterSpacing: '-0.01em',
};

export const appBarIconButtonSx: SxProps<Theme> = {
  color: '#d1fae5',
  '&:hover': { bgcolor: 'rgba(6, 78, 59, 0.5)' },
  borderRadius: '50%',
};

export function getDrawerSx(open: boolean): SxProps<Theme> {
  return {
    width: open ? drawerWidth : miniDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& .MuiDrawer-paper': {
      width: open ? drawerWidth : miniDrawerWidth,
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'grey.200',
      transition: (theme: Theme) =>
        theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
  };
}

export function getDrawerToolbarSx(open: boolean): SxProps<Theme> {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'space-between' : 'center',
    px: open ? 2 : 1,
    minHeight: '64px !important',
  };
}

export const drawerToggleButtonSx: SxProps<Theme> = { color: 'text.secondary' };

export const drawerMenuLabelSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

export const listSx: SxProps<Theme> = { pt: 1, flex: 1 };

export const listItemSx: SxProps<Theme> = { display: 'block', mb: 0.5 };

export function getListItemButtonSx(open: boolean, isActive: boolean): SxProps<Theme> {
  return {
    minHeight: 48,
    justifyContent: open ? 'initial' : 'center',
    px: 1.5,
    py: 1.5,
    mx: 0.75,
    borderRadius: '8px',
    bgcolor: isActive ? '#ecfdf5' : 'transparent',
    color: isActive ? 'primary.main' : 'text.secondary',
    '&:hover': {
      bgcolor: isActive ? '#ecfdf5' : 'grey.50',
      color: isActive ? 'primary.main' : 'text.primary',
      '& .MuiListItemIcon-root': { color: 'primary.main' },
    },
  };
}

export function getListItemIconSx(open: boolean, isActive: boolean): SxProps<Theme> {
  return {
    minWidth: 0,
    mr: open ? 3 : 'auto',
    justifyContent: 'center',
    color: isActive ? 'primary.main' : 'text.secondary',
  };
}

export function getListItemTextSx(open: boolean, isActive: boolean): SxProps<Theme> {
  return {
    opacity: open ? 1 : 0,
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: isActive ? 600 : 400,
    },
  };
}

export const drawerFooterSx: SxProps<Theme> = {
  mt: 'auto',
  p: 2,
  borderTop: '1px solid',
  borderColor: 'grey.100',
};

export const userCardSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  p: 1,
  borderRadius: '12px',
  bgcolor: 'grey.50',
};

export const userAvatarSx: SxProps<Theme> = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.875rem',
};

export const userInfoWrapSx: SxProps<Theme> = {
  ml: 1.5,
  minWidth: 0,
  overflow: 'hidden',
};

export const userNameSx: SxProps<Theme> = {
  fontWeight: 600,
  color: 'text.primary',
  fontSize: '0.875rem',
};

export const userEmailSx: SxProps<Theme> = {
  color: 'text.secondary',
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export function getMainSx(open: boolean): SxProps<Theme> {
  return {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    minHeight: 0,
    bgcolor: 'background.default',
    width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)`,
    transition: (theme: Theme) =>
      theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
  };
}

export const mainSpacerSx: SxProps<Theme> = { flexShrink: 0 };

export const mainContentSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  py: 3,
  px: { xs: 3, sm: 4, md: 6 },
};
