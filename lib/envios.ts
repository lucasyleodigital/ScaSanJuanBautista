import { PREFIJO_A_PROVINCIA } from "@/lib/provincias";

// ───────────────────────── Tipos ─────────────────────────

/** Tarifa del transportista + parámetros editables. Tabla `tarifa_transporte`, solo visible para Eva. */
export interface TarifaTransporte extends ParametrosEnvio {
  transportista: string;
  vigente_desde: string | null;
  origen_cp: number;
  /** Prefijo postal de destino ("01"…"52") → zona de la tarifa; null = sin tarifa. */
  zonas: Record<string, number | null>;
  /** Escalones de peso tope, en kg (10, 20, 30…). */
  escalones: number[];
  /** Zona → precio de cada escalón (mismo orden que `escalones`). */
  precios: Record<string, number[]>;
  /** Peso máximo (kg) hasta el que la tabla es fiable para un destino. */
  limites_kg: Record<string, number>;
  publicado_at: string | null;
  updated_at: string;
}

/** Lo que Eva puede ajustar desde el panel. */
export interface ParametrosEnvio {
  /** Descuento acordado con el transportista sobre la tarifa. */
  descuento_pct: number;
  /** Recargo de carburante sobre los portes. */
  carburante_pct: number;
  iva_pct: number;
  /** Margen que se suma al coste con IVA (0 = se cobra el coste exacto). */
  margen_pct: number;
  /** El precio al cliente se redondea al alza a múltiplos de esta cantidad (€). */
  redondeo_eur: number;
}

/** Precio final al cliente para una provincia y un escalón de peso (tabla pública `envio_tarifas`). */
export interface FilaEnvioTarifa {
  provincia: string;
  escalon_kg: number;
  precio: number;
}

export const PARAMETROS_POR_DEFECTO: ParametrosEnvio = {
  descuento_pct: 18.6,
  carburante_pct: 4,
  iva_pct: 21,
  margen_pct: 0,
  redondeo_eur: 0.1,
};

// Pesos reales de cada caja cerrada y embalada (dados por la cooperativa).
export const PESO_CAJA_3X5L_DEFECTO = 13.74;
export const PESO_CAJA_6X2L_DEFECTO = 10.98;

/** Destinos que la tarifa no cubre: se presupuestan aparte con la cooperativa. */
export const ETIQUETA_A_CONSULTAR = "envío a consultar";

/** ¿El pedido se hizo hacia un destino cuyo envío hay que presupuestar aparte? */
export function esEnvioAConsultar(destinoEnvio: string): boolean {
  return destinoEnvio.toLowerCase().includes(ETIQUETA_A_CONSULTAR);
}

/** "Las Palmas · envío a consultar" → "Las Palmas". */
export function destinoSinEtiqueta(destinoEnvio: string): string {
  return destinoEnvio.replace(/\s*·.*$/, "").trim();
}

// ───────────────────────── Redondeos ─────────────────────────

// Los redondeos pasan por toFixed(6) antes de aplicar ceil: sin eso, ruido de
// coma flotante (por ejemplo 1020.0000000001) subiría un céntimo de más.
function techoCentimo(valor: number): number {
  return Math.ceil(Number((valor * 100).toFixed(6))) / 100;
}

export function redondearAlAlza(valor: number, paso: number): number {
  const p = paso > 0 ? paso : 0.01;
  return Number((Math.ceil(Number((valor / p).toFixed(6))) * p).toFixed(2));
}

// ───────────────────────── Peso y escalón ─────────────────────────

export function pesoPedidoKg(cajas3x5l: number, cajas6x2l: number, peso3x5l: number, peso6x2l: number): number {
  // Se redondea a gramos: 40,000000001 kg no puede saltar al escalón de 50.
  return Number((cajas3x5l * peso3x5l + cajas6x2l * peso6x2l).toFixed(3));
}

/** Primer escalón cuyo tope alcanza el peso (el escalón de 20 kg incluye hasta 20,000). null = se pasa del máximo. */
export function escalonPara(kg: number, escalones: number[]): number | null {
  return escalones.find((e) => kg <= e + 1e-9) ?? null;
}

// ───────────────────────── Coste y precio ─────────────────────────

export interface DesgloseEnvio {
  provincia: string;
  prefijo: string;
  zona: number;
  pesoKg: number;
  escalonKg: number;
  /** Precio de la tabla del transportista para esa zona y ese escalón. */
  tarifaBase: number;
  /** Tarifa base menos el descuento, redondeado al alza al céntimo. */
  portes: number;
  carburante: number;
  baseImponible: number;
  iva: number;
  /** Lo que factura el transportista, con IVA. */
  costeConIva: number;
  margen: number;
  /** Lo que se cobra al cliente (IVA incluido). */
  precioCliente: number;
}

/**
 * Coste real y precio al cliente de enviar `kg` kilos al prefijo postal indicado.
 * Devuelve null si ese destino no tiene tarifa o el peso se sale de ella
 * (hay que presupuestarlo aparte).
 */
export function calcularEnvio(
  prefijo: string,
  kg: number,
  tarifa: Pick<TarifaTransporte, "zonas" | "escalones" | "precios" | "limites_kg">,
  params: ParametrosEnvio
): DesgloseEnvio | null {
  const zona = tarifa.zonas[prefijo];
  if (zona == null || kg <= 0) return null;
  const limite = tarifa.limites_kg?.[prefijo];
  if (limite != null && kg > limite + 1e-9) return null;

  const escalon = escalonPara(kg, tarifa.escalones);
  if (escalon == null) return null;
  const tarifaBase = tarifa.precios[String(zona)]?.[tarifa.escalones.indexOf(escalon)];
  if (tarifaBase == null) return null;

  const portes = techoCentimo(tarifaBase * (1 - params.descuento_pct / 100));
  const carburante = portes * (params.carburante_pct / 100);
  const baseImponible = portes + carburante;
  const iva = baseImponible * (params.iva_pct / 100);
  const costeConIva = baseImponible + iva;
  const margen = costeConIva * (params.margen_pct / 100);
  const precioCliente = redondearAlAlza(costeConIva + margen, params.redondeo_eur);

  return {
    provincia: PREFIJO_A_PROVINCIA[prefijo] ?? prefijo,
    prefijo,
    zona,
    pesoKg: kg,
    escalonKg: escalon,
    tarifaBase,
    portes,
    carburante,
    baseImponible,
    iva,
    costeConIva,
    margen,
    precioCliente,
  };
}

/** Todas las filas que se publican para la web: provincia × escalón → precio al cliente. */
export function construirFilasPublicas(
  tarifa: Pick<TarifaTransporte, "zonas" | "escalones" | "precios" | "limites_kg">,
  params: ParametrosEnvio
): FilaEnvioTarifa[] {
  const filas: FilaEnvioTarifa[] = [];
  for (const [prefijo, provincia] of Object.entries(PREFIJO_A_PROVINCIA)) {
    for (const escalon of tarifa.escalones) {
      const d = calcularEnvio(prefijo, escalon, tarifa, params);
      if (d) filas.push({ provincia, escalon_kg: escalon, precio: d.precioCliente });
    }
  }
  return filas;
}

/** Provincias del país que no tienen tarifa (se presupuestan aparte). */
export function provinciasSinTarifa(tarifa: Pick<TarifaTransporte, "zonas">): string[] {
  return Object.entries(PREFIJO_A_PROVINCIA)
    .filter(([prefijo]) => tarifa.zonas[prefijo] == null)
    .map(([, provincia]) => provincia);
}

// ───────────────────────── Consulta desde la web pública ─────────────────────────

export type CotizacionEnvio =
  | { tipo: "precio"; precio: number; escalonKg: number }
  | { tipo: "consultar" };

export type IndiceTarifas = Map<string, FilaEnvioTarifa[]>;

export function indexarTarifas(filas: FilaEnvioTarifa[]): IndiceTarifas {
  const indice: IndiceTarifas = new Map();
  for (const f of filas) {
    const lista = indice.get(f.provincia);
    if (lista) lista.push(f);
    else indice.set(f.provincia, [f]);
  }
  for (const lista of indice.values()) lista.sort((a, b) => a.escalon_kg - b.escalon_kg);
  return indice;
}

/** Precio publicado para esa provincia y peso; "consultar" si no hay tarifa o el peso se sale de ella. */
export function cotizarEnvio(provincia: string, kg: number, indice: IndiceTarifas): CotizacionEnvio {
  const lista = indice.get(provincia);
  if (!lista || kg <= 0) return { tipo: "consultar" };
  const fila = lista.find((f) => kg <= f.escalon_kg + 1e-9);
  return fila ? { tipo: "precio", precio: Number(fila.precio), escalonKg: fila.escalon_kg } : { tipo: "consultar" };
}
