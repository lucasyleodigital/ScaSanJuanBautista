// Crea un pedido tras comprobar el captcha de Cloudflare Turnstile en el servidor.
//
// Secretos necesarios (Supabase → Edge Functions → Secrets):
//   TURNSTILE_SECRET_KEY  clave SECRETA del widget de Turnstile
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase solos.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PERFILES = ["particular", "horeca", "distribuidor"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

const texto = (v: unknown, max: number, min = 0): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length >= min && t.length <= max ? t : null;
};

const entero = (v: unknown, max: number): number | null =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= max ? v : null;

const importe = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1_000_000 ? v : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let entrada: { token?: unknown; pedido?: Record<string, unknown> };
  try {
    entrada = await req.json();
  } catch {
    return json({ error: "Petición no válida" }, 400);
  }

  const token = typeof entrada.token === "string" ? entrada.token : "";
  if (!token || token.length > 4096) return json({ error: "Falta la comprobación anti-bots" }, 400);

  // 1. Comprobar el captcha con Cloudflare
  const secreto = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secreto) {
    console.error("Falta el secreto TURNSTILE_SECRET_KEY");
    return json({ error: "Servicio no configurado" }, 500);
  }
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const form = new URLSearchParams({ secret: secreto, response: token });
  if (ip) form.set("remoteip", ip);
  let verificacion: { success?: boolean; "error-codes"?: string[] };
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    verificacion = await r.json();
  } catch (e) {
    console.error("No se pudo contactar con Turnstile:", e);
    return json({ error: "No se pudo verificar" }, 502);
  }
  if (!verificacion.success) {
    console.warn("Captcha rechazado:", verificacion["error-codes"]);
    return json({ error: "Comprobación anti-bots no superada" }, 403);
  }

  // 2. Validar y construir el pedido (solo columnas permitidas)
  const p = entrada.pedido ?? {};
  const cajas3 = entero(p.cajas_3x5l, 1000);
  const cajas6 = entero(p.cajas_6x2l, 1000);
  const pedido = {
    nombre: texto(p.nombre, 120, 2),
    email: texto(p.email, 160, 5),
    telefono: texto(p.telefono, 30, 6),
    direccion: texto(p.direccion, 200, 5),
    localidad: texto(p.localidad, 100, 2),
    codigo_postal: typeof p.codigo_postal === "string" && /^\d{5}$/.test(p.codigo_postal) ? p.codigo_postal : null,
    perfil: typeof p.perfil === "string" && PERFILES.includes(p.perfil) ? p.perfil : null,
    cajas_3x5l: cajas3,
    cajas_6x2l: cajas6,
    total_litros: entero(p.total_litros, 100_000),
    destino_envio: texto(p.destino_envio, 160, 1),
    subtotal: importe(p.subtotal),
    descuento: importe(p.descuento),
    portes: importe(p.portes),
    total_estimado: importe(p.total_estimado),
    codigo_promo: p.codigo_promo == null ? null : texto(p.codigo_promo, 40),
  };

  const invalido = Object.entries(pedido).find(([k, v]) => v === null && k !== "codigo_promo");
  if (invalido || !pedido.email?.includes("@")) {
    return json({ error: `Datos del pedido no válidos${invalido ? ` (${invalido[0]})` : ""}` }, 400);
  }
  if ((cajas3 ?? 0) + (cajas6 ?? 0) < 1) return json({ error: "El pedido no tiene cajas" }, 400);
  if (pedido.total_litros !== (cajas3 ?? 0) * 15 + (cajas6 ?? 0) * 12) {
    return json({ error: "Los litros no coinciden con las cajas" }, 400);
  }

  // 3. Guardar el pedido (el aviso por email lo dispara la base de datos, igual que antes)
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await supabase.from("pedidos").insert(pedido);
  if (error) {
    console.error("Error al guardar el pedido:", error);
    return json({ error: "No se pudo guardar el pedido" }, 500);
  }

  return json({ ok: true });
});
