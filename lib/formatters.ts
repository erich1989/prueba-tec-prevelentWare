/**
 * Formatea un número como moneda en pesos colombianos (ej: "$ 1.234").
 */
export function formatPesos(val: number): string {
  return `$ ${Number(val).toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
