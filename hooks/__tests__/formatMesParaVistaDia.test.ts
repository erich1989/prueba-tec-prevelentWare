import { formatMesParaVistaDia } from '@/hooks/useReportes';

describe('formatMesParaVistaDia', () => {
  it('formatea YYYY-MM como "Mes Año"', () => {
    expect(formatMesParaVistaDia('2024-01')).toBe('Enero 2024');
    expect(formatMesParaVistaDia('2024-12')).toBe('Diciembre 2024');
    expect(formatMesParaVistaDia('2023-06')).toBe('Junio 2023');
  });

  it('devuelve cadena vacía para entrada vacía o inválida', () => {
    expect(formatMesParaVistaDia('')).toBe('');
    expect(formatMesParaVistaDia('24')).toBe('');
  });

  it('usa el nombre del mes correcto para todos los meses', () => {
    const esperados: Record<string, string> = {
      '2024-01': 'Enero 2024',
      '2024-02': 'Febrero 2024',
      '2024-03': 'Marzo 2024',
      '2024-04': 'Abril 2024',
      '2024-05': 'Mayo 2024',
      '2024-06': 'Junio 2024',
      '2024-07': 'Julio 2024',
      '2024-08': 'Agosto 2024',
      '2024-09': 'Septiembre 2024',
      '2024-10': 'Octubre 2024',
      '2024-11': 'Noviembre 2024',
      '2024-12': 'Diciembre 2024',
    };
    Object.entries(esperados).forEach(([ym, esperado]) => {
      expect(formatMesParaVistaDia(ym)).toBe(esperado);
    });
  });
});
