import {
  ROLES,
  ADMIN_ONLY_PATHS,
  USER_DEFAULT_PATH,
  NAV_MENU_ITEMS,
} from '@/app/config/nav';

describe('nav config', () => {
  describe('ROLES', () => {
    it('define ADMIN y USER', () => {
      expect(ROLES.ADMIN).toBe('ADMIN');
      expect(ROLES.USER).toBe('USER');
    });
  });

  describe('ADMIN_ONLY_PATHS', () => {
    it('incluye /usuarios y /reportes', () => {
      expect(ADMIN_ONLY_PATHS).toContain('/usuarios');
      expect(ADMIN_ONLY_PATHS).toContain('/reportes');
    });

    it('solo tiene rutas restringidas a ADMIN', () => {
      expect(ADMIN_ONLY_PATHS).toHaveLength(2);
    });
  });

  describe('USER_DEFAULT_PATH', () => {
    it('es /movimientos (gestión de movimientos para USER)', () => {
      expect(USER_DEFAULT_PATH).toBe('/movimientos');
    });
  });

  describe('NAV_MENU_ITEMS', () => {
    it('tiene Inicio solo para ADMIN', () => {
      const inicio = NAV_MENU_ITEMS.find((i) => i.href === '/');
      expect(inicio?.text).toBe('Inicio');
      expect(inicio?.roles).toEqual([ROLES.ADMIN]);
    });

    it('tiene Ingresos y gastos para ADMIN y USER', () => {
      const movimientos = NAV_MENU_ITEMS.find((i) => i.href === '/movimientos');
      expect(movimientos?.roles).toContain(ROLES.ADMIN);
      expect(movimientos?.roles).toContain(ROLES.USER);
    });

    it('tiene Reportes solo para ADMIN', () => {
      const reportes = NAV_MENU_ITEMS.find((i) => i.href === '/reportes');
      expect(reportes?.roles).toEqual([ROLES.ADMIN]);
    });

    it('cada ítem tiene text, href, roles e icon', () => {
      NAV_MENU_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('text');
        expect(item).toHaveProperty('href');
        expect(Array.isArray(item.roles)).toBe(true);
        expect(item.roles.every((r) => r === ROLES.ADMIN || r === ROLES.USER)).toBe(true);
        // Icon puede ser función (componente) u objeto (componente MUI)
        expect(item.icon).toBeDefined();
        expect(typeof item.icon === 'function' || typeof item.icon === 'object').toBe(true);
      });
    });
  });
});
