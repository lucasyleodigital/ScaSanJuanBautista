// Mezcla de colores para las aceitunas que "maduran": comparte el cálculo
// entre las aceitunas flotantes y la aceituna guía del scroll.

export type RGB = [number, number, number];

/** Mezcla un degradado de varias etapas. k = 0 → primera etapa, k = 1 → última. */
export function mixStops(stops: RGB[], k: number): string {
  const kk = Math.min(Math.max(k, 0), 1);
  const scaled = kk * (stops.length - 1);
  const i = Math.min(Math.floor(scaled), stops.length - 2);
  const f = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  const c = a.map((v, n) => Math.round(v + (b[n] - v) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** Curva suave de 0 a 1 entre `desde` y `hasta` (por debajo de `desde` se queda en 0). */
export function suavizar(valor: number, desde: number, hasta: number): number {
  const x = Math.min(Math.max((valor - desde) / (hasta - desde), 0), 1);
  return x * x * (3 - 2 * x);
}
