import { formatPesos } from '@/lib/formatters';

describe('formatPesos', () => {
  it('formatea números positivos con separador de miles', () => {
    expect(formatPesos(1000)).toBe('$ 1.000');
    expect(formatPesos(1234567)).toBe('$ 1.234.567');
  });

  it('formatea cero', () => {
    expect(formatPesos(0)).toBe('$ 0');
  });

  it('formatea números negativos (egresos)', () => {
    expect(formatPesos(-50000)).toBe('$ -50.000');
  });

  it('no añade decimales por defecto', () => {
    expect(formatPesos(99.99)).toMatch(/\$ .*/);
    expect(formatPesos(99.99)).not.toContain(',');
  });
});
