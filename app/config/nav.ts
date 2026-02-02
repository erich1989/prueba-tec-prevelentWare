import type { ComponentType } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

/** Roles según PRUEBA_TECNICA: Usuario solo movimientos; Admin movimientos + usuarios + reportes. */
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface NavMenuItem {
  text: string;
  href: string;
  /** Roles que pueden ver este ítem. */
  roles: Role[];
  icon: ComponentType<{ sx?: object }>;
}

/**
 * Ítems del menú lateral. Se filtran por rol del usuario antes de iterar en el drawer.
 * PRUEBA_TECNICA: Usuario solo puede acceder a gestión de movimientos; Admin a movimientos + usuarios + reportes.
 * Inicio (/) solo para ADMIN; USER solo ve "Ingresos y gastos" y navega a /movimientos.
 */
export const NAV_MENU_ITEMS: NavMenuItem[] = [
  { text: 'Inicio', href: '/', roles: [ROLES.ADMIN], icon: HomeIcon },
  { text: 'Ingresos y gastos', href: '/movimientos', roles: [ROLES.ADMIN, ROLES.USER], icon: AccountBalanceIcon },
  { text: 'Gestión de usuarios', href: '/usuarios', roles: [ROLES.ADMIN], icon: PeopleIcon },
  { text: 'Reportes', href: '/reportes', roles: [ROLES.ADMIN], icon: AssessmentIcon },
];

/** Rutas que solo puede ver ADMIN. Si el rol no es ADMIN, se redirige a /. */
export const ADMIN_ONLY_PATHS: string[] = ['/usuarios', '/reportes'];

/** Ruta por defecto para USER (solo gestión de movimientos). Si USER visita /, se redirige aquí. */
export const USER_DEFAULT_PATH = '/movimientos';
