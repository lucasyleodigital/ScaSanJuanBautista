import { supabase, type Pedido } from "@/lib/supabase";
import {
  PESO_CAJA_3X5L_DEFECTO,
  PESO_CAJA_6X2L_DEFECTO,
  destinoSinEtiqueta,
  esEnvioAConsultar,
  pesoPedidoKg,
} from "@/lib/envios";
import {
  COMUNIDADES_ORDENADAS,
  PROVINCIAS_ORDENADAS,
  PROVINCIA_A_COMUNIDAD,
  getProvinciaFromCP,
} from "@/lib/provincias";

export const ZONA_INTERNACIONAL = "Internacional (UE)";
export const ZONA_SIN_DETERMINAR = "Sin determinar";

// ───────────────────────── Carga de datos ─────────────────────────

// Supabase devuelve como máximo 1.000 filas por petición: sin paginar, en
// cuanto Eva tuviera más pedidos los informes saldrían incompletos sin avisar.
const TAMANO_PAGINA = 1000;

export async function fetchTodosLosPedidos(): Promise<Pedido[]> {
  const todos: Pedido[] = [];
  for (let desde = 0; ; desde += TAMANO_PAGINA) {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id")
      .range(desde, desde + TAMANO_PAGINA - 1);
    if (error) throw error;
    const pagina = (data ?? []) as Pedido[];
    todos.push(...pagina);
    if (pagina.length < TAMANO_PAGINA) break;
  }
  return todos;
}

// ───────────────────────── Zonas ─────────────────────────

export interface Zona {
  provincia: string;
  comunidad: string;
}

export function zonaDePedido(p: Pedido): Zona {
  // Los pedidos con envío por presupuestar traen "Provincia · envío a consultar".
  const destino = destinoSinEtiqueta(p.destino_envio);
  const d = destino.toLowerCase();
  if (d.includes("internacional") || d === "ue") {
    return { provincia: ZONA_INTERNACIONAL, comunidad: ZONA_INTERNACIONAL };
  }
  // destino_envio ya trae la provincia detectada por código postal al hacer el
  // pedido; si es de una versión antigua del formulario, se recalcula del CP.
  const provincia = PROVINCIAS_ORDENADAS.includes(destino)
    ? destino
    : getProvinciaFromCP(p.codigo_postal) ?? ZONA_SIN_DETERMINAR;
  return { provincia, comunidad: PROVINCIA_A_COMUNIDAD[provincia] ?? ZONA_SIN_DETERMINAR };
}

export { COMUNIDADES_ORDENADAS, PROVINCIAS_ORDENADAS };

// ───────────────────────── Fechas ─────────────────────────

const dos = (n: number) => String(n).padStart(2, "0");

export function claveDia(d: Date): string {
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export function claveMes(d: Date): string {
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}`;
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function etiquetaMes(clave: string): string {
  const [anio, mes] = clave.split("-").map(Number);
  return `${MESES[mes - 1]} ${anio}`;
}

const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function etiquetaDia(clave: string): string {
  const [anio, mes, dia] = clave.split("-").map(Number);
  const d = new Date(anio, mes - 1, dia);
  return `${DIAS_SEMANA[d.getDay()]} ${dos(dia)}/${dos(mes)}/${anio}`;
}

export function fmtFecha(d: Date): string {
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function fmtFechaHora(d: Date): string {
  return `${fmtFecha(d)} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

function desdeInput(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function hastaInput(s: string): Date | null {
  const d = desdeInput(s);
  if (!d) return null;
  d.setHours(23, 59, 59, 999);
  return d;
}

export interface MesDisponible {
  clave: string;
  etiqueta: string;
}

export function mesesDisponibles(pedidos: Pedido[]): MesDisponible[] {
  const claves = new Set(pedidos.map((p) => claveMes(new Date(p.created_at))));
  return [...claves]
    .sort()
    .reverse()
    .map((clave) => ({ clave, etiqueta: etiquetaMes(clave) }));
}

export interface RangoFechas {
  desde: Date | null;
  hasta: Date | null;
  etiqueta: string;
}

/**
 * Valores de `periodo`: "todo" | "este-mes" | "mes-pasado" | "este-anio" |
 * "mes:AAAA-MM" | "rango" (usa `desde` y `hasta` en formato AAAA-MM-DD).
 */
export function resolverPeriodo(
  periodo: string,
  desde: string,
  hasta: string,
  hoy: Date = new Date()
): RangoFechas {
  const finDeMes = (anio: number, mes: number) => new Date(anio, mes + 1, 0, 23, 59, 59, 999);

  if (periodo === "este-mes") {
    const a = hoy.getFullYear();
    const m = hoy.getMonth();
    return { desde: new Date(a, m, 1), hasta: finDeMes(a, m), etiqueta: `Este mes (${etiquetaMes(claveMes(hoy))})` };
  }
  if (periodo === "mes-pasado") {
    const ref = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    return {
      desde: ref,
      hasta: finDeMes(ref.getFullYear(), ref.getMonth()),
      etiqueta: `Mes pasado (${etiquetaMes(claveMes(ref))})`,
    };
  }
  if (periodo === "este-anio") {
    const a = hoy.getFullYear();
    return { desde: new Date(a, 0, 1), hasta: new Date(a, 11, 31, 23, 59, 59, 999), etiqueta: `Año ${a}` };
  }
  if (periodo.startsWith("mes:")) {
    const clave = periodo.slice(4);
    const [a, m] = clave.split("-").map(Number);
    return { desde: new Date(a, m - 1, 1), hasta: finDeMes(a, m - 1), etiqueta: etiquetaMes(clave) };
  }
  if (periodo === "rango") {
    const d = desdeInput(desde);
    const h = hastaInput(hasta);
    const etiqueta =
      d && h ? `Del ${fmtFecha(d)} al ${fmtFecha(h)}`
      : d ? `Desde el ${fmtFecha(d)}`
      : h ? `Hasta el ${fmtFecha(h)}`
      : "Todo el histórico";
    return { desde: d, hasta: h, etiqueta };
  }
  return { desde: null, hasta: null, etiqueta: "Todo el histórico" };
}

// ───────────────────────── Filtros ─────────────────────────

export type EstadoFiltro =
  | "activos"
  | "todos"
  | "por-enviar"
  | "pendiente"
  | "confirmado"
  | "enviado"
  | "cancelado";

export const ESTADO_ETIQUETAS: Record<EstadoFiltro, string> = {
  activos: "Todos excepto cancelados",
  todos: "Todos (incluye cancelados)",
  "por-enviar": "Por enviar (pendientes y confirmados)",
  pendiente: "Solo pendientes",
  confirmado: "Solo confirmados",
  enviado: "Solo enviados",
  cancelado: "Solo cancelados",
};

/** Valores de `zona`: "todas" | "internacional" | "ccaa:<comunidad>" | "prov:<provincia>". */
export function etiquetaZona(zona: string): string {
  if (zona === "todas") return "Todas las zonas";
  if (zona === "internacional") return ZONA_INTERNACIONAL;
  if (zona.startsWith("ccaa:")) return `Comunidad: ${zona.slice(5)}`;
  if (zona.startsWith("prov:")) return `Provincia: ${zona.slice(5)}`;
  return zona;
}

export interface Filtros {
  periodo: string;
  desde: string;
  hasta: string;
  zona: string;
  estado: EstadoFiltro;
  busqueda?: string;
}

function coincideEstado(p: Pedido, estado: EstadoFiltro): boolean {
  switch (estado) {
    case "todos": return true;
    case "activos": return p.estado !== "cancelado";
    case "por-enviar": return p.estado === "pendiente" || p.estado === "confirmado";
    default: return p.estado === estado;
  }
}

function coincideZona(p: Pedido, zona: string): boolean {
  if (zona === "todas") return true;
  const z = zonaDePedido(p);
  if (zona === "internacional") return z.provincia === ZONA_INTERNACIONAL;
  if (zona.startsWith("ccaa:")) return z.comunidad === zona.slice(5);
  if (zona.startsWith("prov:")) return z.provincia === zona.slice(5);
  return true;
}

export function filtrarPedidos(pedidos: Pedido[], f: Filtros, hoy: Date = new Date()): Pedido[] {
  const rango = resolverPeriodo(f.periodo, f.desde, f.hasta, hoy);
  const q = (f.busqueda ?? "").trim().toLowerCase();
  return pedidos.filter((p) => {
    const fecha = new Date(p.created_at);
    if (rango.desde && fecha < rango.desde) return false;
    if (rango.hasta && fecha > rango.hasta) return false;
    if (!coincideEstado(p, f.estado)) return false;
    if (!coincideZona(p, f.zona)) return false;
    if (q) {
      const texto = `${p.nombre} ${p.email} ${p.telefono} ${p.localidad ?? ""}`.toLowerCase();
      if (!texto.includes(q)) return false;
    }
    return true;
  });
}

// ───────────────────────── Totales ─────────────────────────

export interface Totales {
  clientes: number;
  pedidos: number;
  cajas3x5l: number;
  cajas6x2l: number;
  litros: number;
  portes: number;
  total: number;
}

const redondear = (n: number) => Math.round(n * 100) / 100;

export function calcularTotales(pedidos: Pedido[]): Totales {
  const emails = new Set<string>();
  const t: Totales = { clientes: 0, pedidos: pedidos.length, cajas3x5l: 0, cajas6x2l: 0, litros: 0, portes: 0, total: 0 };
  for (const p of pedidos) {
    emails.add(p.email.trim().toLowerCase());
    t.cajas3x5l += p.cajas_3x5l;
    t.cajas6x2l += p.cajas_6x2l;
    t.litros += p.total_litros;
    t.portes += p.portes;
    t.total += p.total_estimado;
  }
  t.clientes = emails.size;
  t.portes = redondear(t.portes);
  t.total = redondear(t.total);
  return t;
}

// ───────────────────────── Agrupación ─────────────────────────

export type Agrupacion = "ninguna" | "mes" | "dia" | "provincia" | "comunidad";

export const AGRUPACION_ETIQUETAS: Record<Agrupacion, string> = {
  ninguna: "Sin agrupar",
  mes: "Por mes",
  dia: "Por día",
  provincia: "Por provincia",
  comunidad: "Por comunidad autónoma",
};

export interface Grupo {
  clave: string;
  etiqueta: string;
  pedidos: Pedido[];
}

export function agruparPedidos(pedidos: Pedido[], agrupacion: Agrupacion): Grupo[] {
  if (agrupacion === "ninguna") {
    return [{ clave: "todos", etiqueta: "Todos", pedidos }];
  }
  const mapa = new Map<string, Grupo>();
  for (const p of pedidos) {
    const fecha = new Date(p.created_at);
    let clave: string;
    let etiqueta: string;
    if (agrupacion === "mes") {
      clave = claveMes(fecha);
      etiqueta = etiquetaMes(clave);
    } else if (agrupacion === "dia") {
      clave = claveDia(fecha);
      etiqueta = etiquetaDia(clave);
    } else {
      const z = zonaDePedido(p);
      clave = etiqueta = agrupacion === "provincia" ? z.provincia : z.comunidad;
    }
    const g = mapa.get(clave);
    if (g) g.pedidos.push(p);
    else mapa.set(clave, { clave, etiqueta, pedidos: [p] });
  }
  const grupos = [...mapa.values()];
  if (agrupacion === "mes" || agrupacion === "dia") {
    // Más recientes primero (las claves AAAA-MM / AAAA-MM-DD ordenan como texto).
    grupos.sort((a, b) => (a.clave < b.clave ? 1 : -1));
  } else {
    // Zonas: primero donde hay más pedidos; a igualdad, por orden alfabético.
    grupos.sort((a, b) => b.pedidos.length - a.pedidos.length || a.etiqueta.localeCompare(b.etiqueta, "es"));
  }
  return grupos;
}

// ───────────────────────── Clientes ─────────────────────────

export interface ClienteResumen {
  email: string;
  nombre: string;
  telefono: string;
  direccion: string | null;
  localidad: string | null;
  codigoPostal: string;
  provincia: string;
  comunidad: string;
  pedidos: number;
  cajas3x5l: number;
  cajas6x2l: number;
  litros: number;
  total: number;
  primerPedido: Date;
  ultimoPedido: Date;
}

/** Agrupa pedidos por cliente (email). Los datos de contacto salen del pedido más reciente. */
export function agruparClientes(pedidos: Pedido[]): ClienteResumen[] {
  const mapa = new Map<string, ClienteResumen & { _ultimoMs: number }>();
  for (const p of pedidos) {
    const key = p.email.trim().toLowerCase();
    const ms = new Date(p.created_at).getTime();
    const fecha = new Date(ms);
    const existente = mapa.get(key);
    if (!existente) {
      const z = zonaDePedido(p);
      mapa.set(key, {
        email: p.email.trim(),
        nombre: p.nombre,
        telefono: p.telefono,
        direccion: p.direccion,
        localidad: p.localidad,
        codigoPostal: p.codigo_postal,
        provincia: z.provincia,
        comunidad: z.comunidad,
        pedidos: 1,
        cajas3x5l: p.cajas_3x5l,
        cajas6x2l: p.cajas_6x2l,
        litros: p.total_litros,
        total: p.total_estimado,
        primerPedido: fecha,
        ultimoPedido: fecha,
        _ultimoMs: ms,
      });
      continue;
    }
    existente.pedidos += 1;
    existente.cajas3x5l += p.cajas_3x5l;
    existente.cajas6x2l += p.cajas_6x2l;
    existente.litros += p.total_litros;
    existente.total += p.total_estimado;
    if (fecha < existente.primerPedido) existente.primerPedido = fecha;
    if (ms > existente._ultimoMs) {
      const z = zonaDePedido(p);
      existente._ultimoMs = ms;
      existente.ultimoPedido = fecha;
      existente.nombre = p.nombre;
      existente.telefono = p.telefono;
      existente.direccion = p.direccion;
      existente.localidad = p.localidad;
      existente.codigoPostal = p.codigo_postal;
      existente.provincia = z.provincia;
      existente.comunidad = z.comunidad;
    }
  }
  return [...mapa.values()].map(({ _ultimoMs, ...c }) => ({ ...c, total: redondear(c.total) }));
}

export type OrdenClientes = "pedidos" | "gasto" | "reciente" | "nombre";

export const ORDEN_CLIENTES_ETIQUETAS: Record<OrdenClientes, string> = {
  pedidos: "Más pedidos",
  gasto: "Mayor gasto",
  reciente: "Compra más reciente",
  nombre: "Nombre (A-Z)",
};

export function ordenarClientes(clientes: ClienteResumen[], orden: OrdenClientes): ClienteResumen[] {
  const copia = [...clientes];
  switch (orden) {
    case "pedidos": return copia.sort((a, b) => b.pedidos - a.pedidos || b.total - a.total);
    case "gasto": return copia.sort((a, b) => b.total - a.total || b.pedidos - a.pedidos);
    case "reciente": return copia.sort((a, b) => b.ultimoPedido.getTime() - a.ultimoPedido.getTime());
    default: return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}

export function ordenarPedidosPorFecha(pedidos: Pedido[], masAntiguosPrimero: boolean): Pedido[] {
  const dir = masAntiguosPrimero ? 1 : -1;
  return [...pedidos].sort((a, b) => dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
}

// ───────────────────────── Exportación (Excel y CSV) ─────────────────────────

export type TipoColumna = "texto" | "entero" | "decimal" | "euro" | "fecha" | "fechahora";
export type Valor = string | number | Date | null;

export interface Columna<T> {
  titulo: string;
  ancho: number;
  tipo: TipoColumna;
  valor: (fila: T) => Valor;
}

const COLUMNAS_PEDIDO_BASE = {
  cliente: { titulo: "Cliente", ancho: 26, tipo: "texto" },
  email: { titulo: "Email", ancho: 30, tipo: "texto" },
  telefono: { titulo: "Teléfono", ancho: 15, tipo: "texto" },
  direccion: { titulo: "Dirección", ancho: 34, tipo: "texto" },
  localidad: { titulo: "Localidad", ancho: 20, tipo: "texto" },
  cp: { titulo: "CP", ancho: 8, tipo: "texto" },
  provincia: { titulo: "Provincia", ancho: 18, tipo: "texto" },
  comunidad: { titulo: "Comunidad", ancho: 20, tipo: "texto" },
} as const;

export const COLUMNAS_CLIENTES: Columna<ClienteResumen>[] = [
  { ...COLUMNAS_PEDIDO_BASE.cliente, valor: (c) => c.nombre },
  { ...COLUMNAS_PEDIDO_BASE.email, valor: (c) => c.email },
  { ...COLUMNAS_PEDIDO_BASE.telefono, valor: (c) => c.telefono },
  { ...COLUMNAS_PEDIDO_BASE.direccion, valor: (c) => c.direccion },
  { ...COLUMNAS_PEDIDO_BASE.localidad, valor: (c) => c.localidad },
  { ...COLUMNAS_PEDIDO_BASE.cp, valor: (c) => c.codigoPostal },
  { ...COLUMNAS_PEDIDO_BASE.provincia, valor: (c) => c.provincia },
  { ...COLUMNAS_PEDIDO_BASE.comunidad, valor: (c) => c.comunidad },
  { titulo: "Pedidos", ancho: 9, tipo: "entero", valor: (c) => c.pedidos },
  { titulo: "Cajas 3×5L", ancho: 11, tipo: "entero", valor: (c) => c.cajas3x5l },
  { titulo: "Cajas 6×2L", ancho: 11, tipo: "entero", valor: (c) => c.cajas6x2l },
  { titulo: "Litros", ancho: 9, tipo: "entero", valor: (c) => c.litros },
  { titulo: "Total (€)", ancho: 12, tipo: "euro", valor: (c) => c.total },
  { titulo: "Primer pedido", ancho: 14, tipo: "fecha", valor: (c) => c.primerPedido },
  { titulo: "Último pedido", ancho: 14, tipo: "fecha", valor: (c) => c.ultimoPedido },
];

/** Kilos que pesa cada tipo de caja (los edita Eva en Envíos). */
export interface PesosCaja {
  cajas3x5l: number;
  cajas6x2l: number;
}

export const PESOS_CAJA_POR_DEFECTO: PesosCaja = {
  cajas3x5l: PESO_CAJA_3X5L_DEFECTO,
  cajas6x2l: PESO_CAJA_6X2L_DEFECTO,
};

/** Peso aproximado de un pedido (cajas × peso de cada caja; sin contar el embalaje extra). */
export function pesoDePedido(p: Pedido, pesos: PesosCaja = PESOS_CAJA_POR_DEFECTO): number {
  return pesoPedidoKg(p.cajas_3x5l, p.cajas_6x2l, pesos.cajas3x5l, pesos.cajas6x2l);
}

export function columnasEnvios(pesos: PesosCaja = PESOS_CAJA_POR_DEFECTO): Columna<Pedido>[] {
  return [
    { titulo: "Fecha", ancho: 17, tipo: "fechahora", valor: (p) => new Date(p.created_at) },
    { ...COLUMNAS_PEDIDO_BASE.cliente, valor: (p) => p.nombre },
    { ...COLUMNAS_PEDIDO_BASE.email, valor: (p) => p.email },
    { ...COLUMNAS_PEDIDO_BASE.telefono, valor: (p) => p.telefono },
    { ...COLUMNAS_PEDIDO_BASE.direccion, valor: (p) => p.direccion },
    { ...COLUMNAS_PEDIDO_BASE.localidad, valor: (p) => p.localidad },
    { ...COLUMNAS_PEDIDO_BASE.cp, valor: (p) => p.codigo_postal },
    { ...COLUMNAS_PEDIDO_BASE.provincia, valor: (p) => zonaDePedido(p).provincia },
    { ...COLUMNAS_PEDIDO_BASE.comunidad, valor: (p) => zonaDePedido(p).comunidad },
    { titulo: "Cajas 3×5L", ancho: 11, tipo: "entero", valor: (p) => p.cajas_3x5l },
    { titulo: "Cajas 6×2L", ancho: 11, tipo: "entero", valor: (p) => p.cajas_6x2l },
    { titulo: "Litros", ancho: 9, tipo: "entero", valor: (p) => p.total_litros },
    { titulo: "Peso aprox. (kg)", ancho: 15, tipo: "decimal", valor: (p) => pesoDePedido(p, pesos) },
    { titulo: "Portes (€)", ancho: 11, tipo: "euro", valor: (p) => p.portes },
    { titulo: "Total (€)", ancho: 12, tipo: "euro", valor: (p) => p.total_estimado },
    { titulo: "Envío a consultar", ancho: 16, tipo: "texto", valor: (p) => (esEnvioAConsultar(p.destino_envio) ? "Sí" : "") },
    { titulo: "Estado", ancho: 12, tipo: "texto", valor: (p) => p.estado },
    { titulo: "Código promo", ancho: 14, tipo: "texto", valor: (p) => p.codigo_promo },
  ];
}

export const COLUMNAS_ENVIOS: Columna<Pedido>[] = columnasEnvios();

export interface TablaDetalle {
  titulos: string[];
  tipos: TipoColumna[];
  anchos: number[];
  filas: Valor[][];
}

/** Detalle plano para exportar. Si hay agrupación, añade una primera columna "Grupo". */
export function construirDetalle<T>(
  columnas: Columna<T>[],
  grupos: { etiqueta: string; filas: T[] }[],
  agrupado: boolean,
  tituloGrupo: string
): TablaDetalle {
  const titulos = columnas.map((c) => c.titulo);
  const tipos = columnas.map((c) => c.tipo);
  const anchos = columnas.map((c) => c.ancho);
  if (agrupado) {
    // "Grupo (provincia)" y no solo "Provincia": al agrupar por provincia
    // habría dos columnas con el mismo nombre en el detalle.
    titulos.unshift(`Grupo (${tituloGrupo.toLowerCase()})`);
    tipos.unshift("texto");
    anchos.unshift(26);
  }
  const filas: Valor[][] = [];
  for (const g of grupos) {
    for (const fila of g.filas) {
      const valores = columnas.map((c) => c.valor(fila));
      filas.push(agrupado ? [g.etiqueta, ...valores] : valores);
    }
  }
  return { titulos, tipos, anchos, filas };
}

export interface InformeExportable {
  /** Se usa en el nombre del archivo: "clientes" o "envios". */
  clave: string;
  titulo: string;
  filtros: [string, string][];
  totales: Totales;
  resumenGrupos: { etiqueta: string; totales: Totales }[] | null;
  tituloGrupo: string;
  detalle: TablaDetalle;
}

// CSV pensado para Excel en español: separador ";", decimales con coma,
// fechas dd/mm/aaaa y BOM UTF-8 para que las tildes y la ñ no se rompan.
const SEPARADOR_CSV = ";";

function textoSeguroCsv(s: string): string {
  // Evita la "inyección de fórmulas": Excel ejecuta como fórmula cualquier
  // celda de texto que empiece por = + - @. Los datos los escriben los
  // clientes, así que se neutralizan con una comilla simple delante. Los
  // teléfonos y números sueltos (solo dígitos, espacios, +, -, paréntesis,
  // puntos) se dejan tal cual: no pueden formar una fórmula peligrosa.
  if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?[\d\s().-]+$/.test(s)) return `'${s}`;
  return s;
}

function celdaCsv(valor: Valor, tipo: TipoColumna): string {
  let texto: string;
  if (valor === null || valor === undefined) texto = "";
  else if (valor instanceof Date) texto = tipo === "fechahora" ? fmtFechaHora(valor) : fmtFecha(valor);
  else if (typeof valor === "number") texto = tipo === "euro" || tipo === "decimal" ? valor.toFixed(2).replace(".", ",") : String(valor).replace(".", ",");
  else texto = textoSeguroCsv(valor);
  return /[";\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function generarCsv(detalle: TablaDetalle): string {
  const cabecera = detalle.titulos.map((t) => celdaCsv(t, "texto")).join(SEPARADOR_CSV);
  const cuerpo = detalle.filas.map((fila) =>
    fila.map((v, i) => celdaCsv(v, detalle.tipos[i])).join(SEPARADOR_CSV)
  );
  return "﻿" + [cabecera, ...cuerpo].join("\r\n") + "\r\n";
}

export function nombreArchivo(clave: string, extension: "xlsx" | "csv", hoy: Date = new Date()): string {
  return `informe-${clave}-${claveDia(hoy)}.${extension}`;
}

function descargar(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function descargarCsv(informe: InformeExportable) {
  const blob = new Blob([generarCsv(informe.detalle)], { type: "text/csv;charset=utf-8" });
  descargar(blob, nombreArchivo(informe.clave, "csv"));
}

// Excel guarda las fechas sin zona horaria. Se pasa la hora "de reloj" local
// (la que ve Eva) como si fuera UTC para que un pedido de las 00:30 no caiga
// en el día anterior al convertirse.
function aFechaExcel(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
}

const FORMATO_EURO = '#,##0.00 "€"';
const ESTILO_CABECERA = { fontWeight: "bold" as const, backgroundColor: "#F0E8CC", textColor: "#0C1606" };

function celdaExcel(valor: Valor, tipo: TipoColumna) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (valor instanceof Date) {
    return { value: aFechaExcel(valor), type: Date, format: tipo === "fechahora" ? "dd/mm/yyyy hh:mm" : "dd/mm/yyyy", align: "left" as const };
  }
  if (typeof valor === "number") {
    return { value: valor, type: Number, ...(tipo === "euro" ? { format: FORMATO_EURO } : tipo === "decimal" ? { format: "0.00" } : {}) };
  }
  return { value: valor, type: String };
}

export async function construirLibroExcel(informe: InformeExportable, generado: Date = new Date()) {
  const t = informe.totales;
  const negrita = (value: string) => ({ value, fontWeight: "bold" as const });
  const num = (value: number, euro = false) => ({ value, type: Number, ...(euro ? { format: FORMATO_EURO } : {}) });

  const resumen: unknown[][] = [
    [{ value: informe.titulo, fontWeight: "bold" as const }],
    ["Generado", { value: aFechaExcel(generado), type: Date, format: "dd/mm/yyyy hh:mm", align: "left" as const }],
    ...informe.filtros.map(([k, v]) => [k, v]),
    [],
    [negrita("Totales")],
    ["Clientes", num(t.clientes)],
    ["Pedidos", num(t.pedidos)],
    ["Cajas 3×5L", num(t.cajas3x5l)],
    ["Cajas 6×2L", num(t.cajas6x2l)],
    ["Litros", num(t.litros)],
    ["Portes (€)", num(t.portes, true)],
    ["Total (€)", num(t.total, true)],
  ];

  if (informe.resumenGrupos) {
    resumen.push([], [negrita(`Resumen por ${informe.tituloGrupo.toLowerCase()}`)]);
    resumen.push(
      ["Grupo", "Clientes", "Pedidos", "Cajas 3×5L", "Cajas 6×2L", "Litros", "Portes (€)", "Total (€)"].map((v) => ({
        value: v,
        ...ESTILO_CABECERA,
      }))
    );
    for (const g of informe.resumenGrupos) {
      resumen.push([
        g.etiqueta,
        num(g.totales.clientes),
        num(g.totales.pedidos),
        num(g.totales.cajas3x5l),
        num(g.totales.cajas6x2l),
        num(g.totales.litros),
        num(g.totales.portes, true),
        num(g.totales.total, true),
      ]);
    }
  }

  const d = informe.detalle;
  const filasDetalle: unknown[][] = [
    d.titulos.map((v) => ({ value: v, ...ESTILO_CABECERA })),
    ...d.filas.map((fila) => fila.map((v, i) => celdaExcel(v, d.tipos[i]))),
  ];

  return [
    {
      data: resumen,
      sheet: "Resumen",
      columns: [{ width: 28 }, { width: 24 }, { width: 11 }, { width: 12 }, { width: 12 }, { width: 10 }, { width: 12 }, { width: 14 }],
    },
    {
      data: filasDetalle,
      sheet: "Detalle",
      columns: d.anchos.map((width) => ({ width })),
      stickyRowsCount: 1,
    },
  ];
}

export async function descargarExcel(informe: InformeExportable) {
  // Se carga solo al pulsar el botón: la librería no pesa en el resto del panel.
  const { default: writeExcelFile } = await import("write-excel-file/universal");
  const hojas = await construirLibroExcel(informe);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await writeExcelFile(hojas as any).toBlob();
  descargar(blob, nombreArchivo(informe.clave, "xlsx"));
}
