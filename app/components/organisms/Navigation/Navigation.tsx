'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { NAV_MENU_ITEMS, ROLES, type Role } from '@/app/config/nav';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useSession, signOut } from '@/lib/auth-client';
import {
  rootSx,
  getAppBarSx,
  appBarToolbarSx,
  appBarTitleSx,
  appBarIconButtonSx,
  getDrawerSx,
  getDrawerToolbarSx,
  drawerToggleButtonSx,
  drawerMenuLabelSx,
  listSx,
  listItemSx,
  getListItemButtonSx,
  getListItemIconSx,
  getListItemTextSx,
  drawerFooterSx,
  userCardSx,
  userAvatarSx,
  userInfoWrapSx,
  userNameSx,
  userEmailSx,
  getMainSx,
  mainSpacerSx,
  mainContentSx,
} from './Navigation.styles';

interface NavigationProps {
  children: React.ReactNode;
  /** pathname actual (App Router: usePathname(); Pages Router: useRouter().pathname) */
  pathname: string;
}

export const Navigation = ({ children, pathname }: NavigationProps) => {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const role: Role = (user?.role as Role) ?? ROLES.USER;
  const menuItems = NAV_MENU_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <Box sx={rootSx}>
      <AppBar position="fixed" sx={getAppBarSx(open)}>
        <Toolbar sx={appBarToolbarSx}>
          <Typography variant="h6" component="div" sx={appBarTitleSx}>
            Sistema de ingresos y gastos
          </Typography>
          <IconButton sx={appBarIconButtonSx} size="small" aria-label="modo oscuro">
            <DarkModeOutlinedIcon />
          </IconButton>
          <IconButton sx={appBarIconButtonSx} size="small" aria-label="notificaciones">
            <NotificationsOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} sx={getDrawerSx(open)}>
        <Toolbar sx={getDrawerToolbarSx(open)}>
          {open && (
            <Typography variant="overline" sx={drawerMenuLabelSx}>
              Menú
            </Typography>
          )}
          {open && (
            <IconButton onClick={toggleDrawer} sx={drawerToggleButtonSx}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          {!open && (
            <IconButton onClick={toggleDrawer} sx={drawerToggleButtonSx}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <List sx={listSx}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.text} disablePadding sx={listItemSx}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={getListItemButtonSx(open, isActive)}
                >
                  <ListItemIcon sx={getListItemIconSx(open, isActive)}>
                    <item.icon sx={{ fontSize: 24 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={getListItemTextSx(open, isActive)}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={drawerFooterSx}>
          <Box sx={userCardSx}>
            {user?.image ? (
              <Box
                component="img"
                src={user.image}
                alt={user.name ?? ''}
                sx={{ ...userAvatarSx, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={userAvatarSx}>
                {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
              </Box>
            )}
            {open && (
              <Box sx={userInfoWrapSx}>
                <Typography variant="subtitle2" sx={userNameSx}>
                  {user?.name ?? user?.email ?? 'Usuario'}
                </Typography>
                <Typography variant="caption" sx={userEmailSx}>
                  {user?.email ?? '—'}
                </Typography>
                <Button
                  size="small"
                  startIcon={<LogoutOutlinedIcon />}
                  onClick={handleSignOut}
                  sx={{ mt: 0.5 }}
                >
                  Cerrar sesión
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={getMainSx(open)}>
        <Toolbar sx={mainSpacerSx} />
        <Box sx={mainContentSx}>{children}</Box>
      </Box>
    </Box>
  );
};
