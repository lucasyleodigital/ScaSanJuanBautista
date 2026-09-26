import { createClient } from "@supabase/supabase-js";

// URL y clave "publishable" del proyecto Supabase — diseñadas para ir
// en el navegador (no son secretas, la seguridad real la ponen las
// políticas de Row Level Security de cada tabla, no ocultar esto).
// La clave sb_secret_... NUNCA debe usarse aquí.
const SUPABASE_URL = "https://vdjgqnzzxbmrjemmohgz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9WjNyIL3wsRCzfpzGLNXXQ_NOyCOWeu";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface PricingConfig {
  id: number;
  precio_caja_3x5l: number;
  precio_caja_6x2l: number;
  envio_peninsula: number;
  envio_baleares: number;
  envio_ue: number;
  envio_gratis_desde: number;
  descuento_50l_pct: number;
  descuento_100l_pct: number;
  updated_at: string;
}

export const DEFAULT_PRICING: PricingConfig = {
  id: 1,
  precio_caja_3x5l: 85.0,
  precio_caja_6x2l: 69.0,
  envio_peninsula: 8.5,
  envio_baleares: 18.0,
  envio_ue: 35.0,
  envio_gratis_desde: 150.0,
  descuento_50l_pct: 5,
  descuento_100l_pct: 10,
  updated_at: "",
};

export interface Promocion {
  id: string;
  activo: boolean;
  titulo: string;
  texto: string;
  codigo: string | null;
  descuento_pct: number | null;
  envio_gratis: boolean;
  fecha_fin: string | null;
  created_at: string;
  updated_at: string;
}

export interface Provincia {
  id: number;
  provincia: string;
  precio: number;
  updated_at: string;
}

export interface Pedido {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string | null;
  localidad: string | null;
  codigo_postal: string;
  perfil: string;
  cajas_3x5l: number;
  cajas_6x2l: number;
  total_litros: number;
  destino_envio: string;
  subtotal: number;
  descuento: number;
  portes: number;
  total_estimado: number;
  estado: "pendiente" | "confirmado" | "enviado" | "cancelado";
  codigo_promo: string | null;
}
