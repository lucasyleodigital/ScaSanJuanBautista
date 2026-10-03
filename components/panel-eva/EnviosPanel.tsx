"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase, DEFAULT_PRICING, type PricingConfig } from "@/lib/supabase";
import { PREFIJO_A_PROVINCIA } from "@/lib/provincias";
import {
  PESO_CAJA_3X5L_DEFECTO,
  PESO_CAJA_6X2L_DEFECTO,
  calcularEnvio,
  construirFilasPublicas,
  pesoPedidoKg,
  provinciasSinTarifa,
  type ParametrosEnvio,
  type TarifaTransporte,
} from "@/lib/envios";

const CAMPO =
  "w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado";
const BOTON =
  "rounded-md border border-dorado px-4 py-2 text-xs font-medium uppercase tracking-wide text-dorado transition-colors hover:bg-dorado hover:text-negro disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dorado";

const eur = (n: number) =>
  `${n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" })} €`;
const entero = (n: number) => n.toLocaleString("es-ES", { useGrouping: "always" });
const kgTxt = (n: number) => `${n.toLocaleString("es-ES", { maximumFractionDigits: 2 })} kg`;
const num = (s: string) => Number(s.trim().replace(",", "."));
const pct = (n: number) => String(n).replace(".", ",");

// [prefijo, provincia] en orden 01 a 52. Hay que ordenar a mano: JavaScript pone
// primero las claves que parecen números enteros ("10"…"52") y deja al final "01"…"09".
const PROVINCIAS = Object.entries(PREFIJO_A_PROVINCIA).sort(([a], [b]) => Number(a) - Number(b));

/**
 * Pestaña "Envíos" de Eva. Si el envío automático por peso todavía no está
 * activado en Supabase (falta ejecutar supabase-envio-automatico.sql), muestra
 * un aviso y deja el editor de precios fijos de siempre.
 */
export default function EnviosPanel({ editorPreciosFijos }: { editorPreciosFijos: ReactNode }) {
  const [estado, setEstado] = useState<
    | { tipo: "cargando" }
    | { tipo: "inactivo"; motivo: string }
    | { tipo: "listo"; tarifa: TarifaTransporte; pricing: PricingConfig }
  >({ tipo: "cargando" });

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const [t, p] = await Promise.all([
        supabase.from("tarifa_transporte").select("*").eq("id", 1).maybeSingle(),
        supabase.from("pricing_config").select("*").eq("id", 1).maybeSingle(),
      ]);
      if (cancelado) return;
      if (t.error || !t.data) {
        setEstado({ tipo: "inactivo", motivo: t.error?.message ?? "No hay ninguna tarifa cargada" });
        return;
      }
      setEstado({
        tipo: "listo",
        tarifa: t.data as TarifaTransporte,
        pricing: { ...DEFAULT_PRICING, ...((p.data ?? {}) as Partial<PricingConfig>) },
      });
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  if (estado.tipo === "cargando") return <p className="text-sm text-tx-bajo">Cargando envíos…</p>;

  if (estado.tipo === "inactivo") {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-dorado/40 bg-dorado/10 p-4 text-sm text-tx-medio">
          <p className="font-medium text-dorado">El envío automático por peso todavía no está activado.</p>
          <p className="mt-1">
            Falta ejecutar el archivo <code className="text-tx-crema">supabase-envio-automatico.sql</code> en Supabase.
            Mientras tanto la web cobra los precios fijos por provincia que aparecen debajo.
          </p>
          <p className="mt-1 text-xs text-tx-bajo">Detalle técnico: {estado.motivo}</p>
        </div>
        {editorPreciosFijos}
      </div>
    );
  }

  return <EnviosAutomaticos tarifaInicial={estado.tarifa} pricingInicial={estado.pricing} />;
}

interface FormState {
  peso3x5l: string;
  peso6x2l: string;
  descuento: string;
  carburante: string;
  iva: string;
  margen: string;
  redondeo: string;
}

interface Valores {
  peso3x5l: number;
  peso6x2l: number;
  params: ParametrosEnvio;
}

function aFormulario(t: TarifaTransporte, p: PricingConfig): FormState {
  return {
    peso3x5l: pct(p.peso_caja_3x5l ?? PESO_CAJA_3X5L_DEFECTO),
    peso6x2l: pct(p.peso_caja_6x2l ?? PESO_CAJA_6X2L_DEFECTO),
    descuento: pct(t.descuento_pct),
    carburante: pct(t.carburante_pct),
    iva: pct(t.iva_pct),
    margen: pct(t.margen_pct),
    redondeo: pct(t.redondeo_eur),
  };
}

function validar(f: FormState): { valores: Valores } | { error: string } {
  const v = {
    peso3x5l: num(f.peso3x5l),
    peso6x2l: num(f.peso6x2l),
    descuento: num(f.descuento),
    carburante: num(f.carburante),
    iva: num(f.iva),
    margen: num(f.margen),
    redondeo: num(f.redondeo),
  };
  const rangos: [keyof typeof v, string, number, number][] = [
    ["peso3x5l", "El peso de la caja 3×5 L", 0.1, 100],
    ["peso6x2l", "El peso de la caja 6×2 L", 0.1, 100],
    ["descuento", "El descuento", 0, 90],
    ["carburante", "El carburante", 0, 50],
    ["iva", "El IVA", 0, 30],
    ["margen", "El margen", 0, 100],
    ["redondeo", "El redondeo", 0.01, 5],
  ];
  for (const [k, nombre, min, max] of rangos) {
    if (!Number.isFinite(v[k]) || v[k] < min || v[k] > max) {
      return { error: `${nombre} tiene que ser un número entre ${String(min).replace(".", ",")} y ${max}.` };
    }
  }
  return {
    valores: {
      peso3x5l: v.peso3x5l,
      peso6x2l: v.peso6x2l,
      params: {
        descuento_pct: v.descuento,
        carburante_pct: v.carburante,
        iva_pct: v.iva,
        margen_pct: v.margen,
        redondeo_eur: v.redondeo,
      },
    },
  };
}

const TAMANO_LOTE = 500;

function EnviosAutomaticos({
  tarifaInicial,
  pricingInicial,
}: {
  tarifaInicial: TarifaTransporte;
  pricingInicial: PricingConfig;
}) {
  const [tarifa, setTarifa] = useState(tarifaInicial);
  const [pricing, setPricing] = useState(pricingInicial);
  const [form, setForm] = useState<FormState>(() => aFormulario(tarifaInicial, pricingInicial));
  const [publicando, setPublicando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [filtro, setFiltro] = useState("");

  const guardado = useMemo(() => aFormulario(tarifa, pricing), [tarifa, pricing]);
  const validacion = useMemo(() => validar(form), [form]);
  const valoresGuardados = useMemo(() => {
    const v = validar(guardado);
    return "valores" in v ? v.valores : null;
  }, [guardado]);
  // Vista previa con lo que Eva está escribiendo; si algún campo no es válido, con lo guardado.
  const valores = "valores" in validacion ? validacion.valores : valoresGuardados;
  const hayCambios = (Object.keys(form) as (keyof FormState)[]).some((k) => num(form[k]) !== num(guardado[k]));
  const sinTarifa = useMemo(() => provinciasSinTarifa(tarifa), [tarifa]);

  const cambiar = (campo: keyof FormState, valor: string) => {
    setMensaje(null);
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const publicar = async () => {
    if (!("valores" in validacion)) {
      setMensaje({ tipo: "error", texto: validacion.error });
      return;
    }
    const { peso3x5l, peso6x2l, params } = validacion.valores;
    setPublicando(true);
    setMensaje(null);
    try {
      const ahora = new Date().toISOString();

      const { error: ePesos } = await supabase
        .from("pricing_config")
        .update({ peso_caja_3x5l: peso3x5l, peso_caja_6x2l: peso6x2l })
        .eq("id", 1);
      if (ePesos) throw new Error(`No se han podido guardar los pesos (${ePesos.message}).`);

      const { error: eParams } = await supabase
        .from("tarifa_transporte")
        .update({ ...params, updated_at: ahora })
        .eq("id", 1);
      if (eParams) throw new Error(`No se han podido guardar los parámetros (${eParams.message}).`);

      const filas = construirFilasPublicas(tarifa, params).map((f) => ({ ...f, publicado_at: ahora }));
      for (let i = 0; i < filas.length; i += TAMANO_LOTE) {
        const { error } = await supabase
          .from("envio_tarifas")
          .upsert(filas.slice(i, i + TAMANO_LOTE), { onConflict: "provincia,escalon_kg" });
        if (error) throw new Error(`No se han podido publicar los precios (${error.message}).`);
      }
      // Lo que quede de una publicación anterior (por ejemplo, un escalón que ya no existe) se retira
      // después de subir lo nuevo, así la web nunca se queda sin precios.
      const { error: eBorrar } = await supabase.from("envio_tarifas").delete().neq("publicado_at", ahora);
      if (eBorrar) throw new Error(`Se han publicado los precios nuevos, pero no se han podido retirar los antiguos (${eBorrar.message}).`);

      const { count } = await supabase
        .from("envio_tarifas")
        .select("provincia", { count: "exact", head: true })
        .eq("publicado_at", ahora);
      if (count !== filas.length) {
        throw new Error(`Se esperaban ${filas.length} precios publicados y hay ${count ?? 0}. Vuelve a pulsar el botón.`);
      }

      const { error: ePub } = await supabase.from("tarifa_transporte").update({ publicado_at: ahora }).eq("id", 1);
      if (ePub) throw new Error(`Precios publicados, pero no se ha podido anotar la fecha (${ePub.message}).`);

      setTarifa((t) => ({
        ...t,
        descuento_pct: params.descuento_pct,
        carburante_pct: params.carburante_pct,
        iva_pct: params.iva_pct,
        margen_pct: params.margen_pct,
        redondeo_eur: params.redondeo_eur,
        publicado_at: ahora,
        updated_at: ahora,
      }));
      setPricing((p) => ({ ...p, peso_caja_3x5l: peso3x5l, peso_caja_6x2l: peso6x2l }));
      const provincias = new Set(filas.map((f) => f.provincia)).size;
      setMensaje({ tipo: "ok", texto: `Publicado: ${entero(filas.length)} precios en ${provincias} provincias. La web ya los usa.` });
    } catch (e) {
      setMensaje({ tipo: "error", texto: e instanceof Error ? e.message : "Ha fallado la publicación." });
    } finally {
      setPublicando(false);
    }
  };

  const q = filtro.trim().toLowerCase();
  const provinciasVista = PROVINCIAS.filter(([, nombre]) => !q || nombre.toLowerCase().includes(q));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-1 rounded-lg border border-rule bg-black/20 p-4 text-sm">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="font-medium text-dorado">
            {tarifa.transportista} · origen Jaén ({tarifa.origen_cp})
          </span>
          <span className="text-tx-medio">
            Tarifa vigente desde{" "}
            {tarifa.vigente_desde ? new Date(tarifa.vigente_desde).toLocaleDateString("es-ES") : "—"}
          </span>
        </div>
        <p className="text-xs text-tx-bajo">
          {tarifa.publicado_at
            ? `Últimos precios publicados: ${new Date(tarifa.publicado_at).toLocaleString("es-ES")}.`
            : "Todavía no has publicado precios: la web sigue cobrando los precios fijos antiguos por provincia."}
        </p>
      </section>

      <section className="rounded-lg border border-rule bg-black/20 p-4">
        <h2 className="mb-3 font-serif text-lg text-tx-crema">Parámetros</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Campo etiqueta="Peso caja 3 garrafas × 5 L (kg)" ayuda="Caja cerrada y embalada">
            <input value={form.peso3x5l} onChange={(e) => cambiar("peso3x5l", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="Peso caja 6 garrafas × 2 L (kg)" ayuda="Caja cerrada y embalada">
            <input value={form.peso6x2l} onChange={(e) => cambiar("peso6x2l", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="Descuento CEACERO (%)" ayuda="Sobre la tarifa base">
            <input value={form.descuento} onChange={(e) => cambiar("descuento", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="Carburante (%)" ayuda="Recargo sobre los portes; cambia con el gasóleo">
            <input value={form.carburante} onChange={(e) => cambiar("carburante", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="IVA (%)" ayuda="El precio al cliente lo lleva incluido">
            <input value={form.iva} onChange={(e) => cambiar("iva", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="Margen (%)" ayuda="0 = se cobra el coste exacto">
            <input value={form.margen} onChange={(e) => cambiar("margen", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
          <Campo etiqueta="Redondear al alza a (€)" ayuda="0,10 = a la décima de euro">
            <input value={form.redondeo} onChange={(e) => cambiar("redondeo", e.target.value)} inputMode="decimal" className={CAMPO} />
          </Campo>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={publicar} disabled={publicando || !("valores" in validacion)} className={BOTON}>
            {publicando ? "Publicando…" : "Guardar y publicar precios"}
          </button>
          {hayCambios && !publicando && (
            <button onClick={() => { setForm(guardado); setMensaje(null); }} className="text-xs text-tx-bajo hover:text-dorado">
              Descartar cambios
            </button>
          )}
          {hayCambios && <span className="text-xs text-amber-300">Hay cambios sin publicar</span>}
          {"error" in validacion && <span className="text-xs text-red-400">{validacion.error}</span>}
        </div>
        {mensaje && (
          <p className={`mt-3 text-sm ${mensaje.tipo === "ok" ? "text-emerald-300" : "text-red-400"}`}>{mensaje.texto}</p>
        )}
      </section>

      {valores && <Simulador tarifa={tarifa} valores={valores} />}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg text-tx-crema">Precio al cliente por provincia</h2>
            <p className="text-xs text-tx-bajo">
              IVA incluido, con los parámetros de arriba (antes de publicarlos). Hasta 30 kg el precio es el mismo.
            </p>
          </div>
          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar provincia…"
            className={`${CAMPO} max-w-xs`}
          />
        </div>
        {valores && <TablaProvincias tarifa={tarifa} valores={valores} provincias={provinciasVista} />}
      </section>

      <section className="rounded-lg border border-rule bg-black/20 p-4 text-xs leading-relaxed text-tx-medio">
        <h2 className="mb-2 font-serif text-lg text-tx-crema">Cómo funciona</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            La web calcula el peso del pedido (cajas × peso de cada caja) y cobra el precio del escalón que le corresponde
            (10, 20, 30, 40, 50 kg…) para la provincia del código postal.
          </li>
          <li>
            Sin tarifa, la web muestra «a consultar» y el pedido llega marcado «{`envío a consultar`}»:{" "}
            <strong className="text-tx-crema">{sinTarifa.join(", ") || "ninguna provincia"}</strong>
            {tarifa.limites_kg?.["07"] ? ` y Baleares por encima de ${tarifa.limites_kg["07"]} kg` : ""}. También cualquier peso
            por encima de {tarifa.escalones[tarifa.escalones.length - 1]} kg.
          </li>
          <li>Los envíos fuera de España (UE) y el envío gratis desde cierto importe se ajustan en la pestaña Tarifas.</li>
          <li>
            La tarifa de CEACERO y el descuento solo los ve Eva: la web pública recibe únicamente el precio final por
            provincia y escalón.
          </li>
        </ul>
      </section>
    </div>
  );
}

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-tx-bajo">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-[11px] text-tx-bajo">{ayuda}</span>}
    </label>
  );
}

function Simulador({ tarifa, valores }: { tarifa: TarifaTransporte; valores: Valores }) {
  const [prefijo, setPrefijo] = useState("08");
  const [c5, setC5] = useState("1");
  const [c2, setC2] = useState("0");

  const n5 = Math.max(0, Math.floor(num(c5)) || 0);
  const n2 = Math.max(0, Math.floor(num(c2)) || 0);
  const kg = pesoPedidoKg(n5, n2, valores.peso3x5l, valores.peso6x2l);
  const d = calcularEnvio(prefijo, kg, tarifa, valores.params);

  return (
    <section className="rounded-lg border border-rule bg-black/20 p-4">
      <h2 className="mb-3 font-serif text-lg text-tx-crema">Simulador de envío</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Campo etiqueta="Provincia">
          <select value={prefijo} onChange={(e) => setPrefijo(e.target.value)} className={CAMPO}>
            {PROVINCIAS.map(([p, nombre]) => (
              <option key={p} value={p}>
                {nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Cajas 3×5 L">
          <input value={c5} onChange={(e) => setC5(e.target.value)} inputMode="numeric" className={CAMPO} />
        </Campo>
        <Campo etiqueta="Cajas 6×2 L">
          <input value={c2} onChange={(e) => setC2(e.target.value)} inputMode="numeric" className={CAMPO} />
        </Campo>
      </div>

      <div className="mt-4 text-sm">
        {kg <= 0 ? (
          <p className="text-tx-bajo">Pon al menos una caja.</p>
        ) : !d ? (
          <p className="text-dorado">
            Peso del pedido: {kgTxt(kg)}. Este envío no tiene tarifa automática: se presupuesta aparte con la cooperativa.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <Linea a="Peso del pedido" b={kgTxt(kg)} />
            <Linea a="Escalón de la tarifa" b={`hasta ${d.escalonKg} kg · zona ${d.zona}`} />
            <Linea a="Tarifa base CEACERO" b={eur(d.tarifaBase)} />
            <Linea a={`Portes tras el ${pct(valores.params.descuento_pct)} % de descuento`} b={eur(d.portes)} />
            <Linea a={`Carburante (${pct(valores.params.carburante_pct)} %)`} b={eur(d.carburante)} />
            <Linea a={`IVA (${pct(valores.params.iva_pct)} %)`} b={eur(d.iva)} />
            <Linea a="Coste para la cooperativa (con IVA)" b={eur(d.costeConIva)} />
            {valores.params.margen_pct > 0 && <Linea a={`Margen (${pct(valores.params.margen_pct)} %)`} b={eur(d.margen)} />}
            <div className="flex justify-between border-t border-dorado/30 pt-1 font-medium text-dorado sm:col-span-2">
              <span>Precio que paga el cliente (IVA incluido)</span>
              <span className="font-mono">{eur(d.precioCliente)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Linea({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex justify-between gap-4 text-tx-medio">
      <span>{a}</span>
      <span className="font-mono text-tx-crema">{b}</span>
    </div>
  );
}

const ESCENARIOS: { titulo: string; c5: number; c2: number }[] = [
  { titulo: "1 caja 3×5 L", c5: 1, c2: 0 },
  { titulo: "1 caja 6×2 L", c5: 0, c2: 1 },
  { titulo: "2 cajas 3×5 L", c5: 2, c2: 0 },
  { titulo: "3 cajas 3×5 L", c5: 3, c2: 0 },
  { titulo: "6 cajas 3×5 L", c5: 6, c2: 0 },
];

function TablaProvincias({
  tarifa,
  valores,
  provincias,
}: {
  tarifa: TarifaTransporte;
  valores: Valores;
  provincias: [string, string][];
}) {
  const pesos = ESCENARIOS.map((s) => pesoPedidoKg(s.c5, s.c2, valores.peso3x5l, valores.peso6x2l));
  return (
    <div className="overflow-x-auto rounded-lg border border-rule">
      <table className="w-full text-left text-sm">
        <thead className="bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado">
          <tr>
            <th className="p-3">Provincia</th>
            {ESCENARIOS.map((s, i) => (
              <th key={s.titulo} className="p-3 text-right">
                {s.titulo}
                <div className="font-normal normal-case text-tx-bajo">{kgTxt(pesos[i])}</div>
              </th>
            ))}
            <th className="p-3 text-right">
              Coste CEACERO
              <div className="font-normal normal-case text-tx-bajo">1 caja, con IVA</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {provincias.map(([prefijo, nombre]) => {
            const coste = calcularEnvio(prefijo, pesos[0], tarifa, valores.params);
            return (
              <tr key={prefijo} className="border-t border-rule">
                <td className="p-3">
                  {nombre} <span className="text-xs text-tx-bajo">({prefijo})</span>
                </td>
                {ESCENARIOS.map((s, i) => {
                  const d = calcularEnvio(prefijo, pesos[i], tarifa, valores.params);
                  return (
                    <td key={s.titulo} className="p-3 text-right font-mono">
                      {d ? <span className="text-dorado">{eur(d.precioCliente)}</span> : <span className="text-xs text-tx-bajo">a consultar</span>}
                    </td>
                  );
                })}
                <td className="p-3 text-right font-mono text-tx-medio">{coste ? eur(coste.costeConIva) : "—"}</td>
              </tr>
            );
          })}
          {provincias.length === 0 && (
            <tr>
              <td colSpan={ESCENARIOS.length + 2} className="p-3 text-xs text-tx-bajo">
                Ninguna provincia coincide con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
