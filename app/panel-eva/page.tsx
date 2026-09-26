"use client";

import { Fragment, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, DEFAULT_PRICING, type PricingConfig, type Pedido, type Promocion, type Provincia } from "@/lib/supabase";

export default function PanelEvaPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return <CenteredScreen>Cargando…</CenteredScreen>;
  }

  return session ? <Dashboard /> : <LoginScreen />;
}

const PANEL_BACKGROUND =
  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(45, 74, 43, 0.22) 0%, rgba(20, 33, 12, 0.45) 40%, #060D03 70%)";

function CenteredScreen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-tx-crema"
      style={{ background: PANEL_BACKGROUND }}
    >
      {children}
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Email o código de acceso incorrectos.");
  };

  return (
    <CenteredScreen>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-rule bg-verde-noche/40 p-8"
      >
        <h1 className="mb-1 font-serif text-2xl text-tx-crema">Panel de Eva</h1>
        <p className="mb-6 text-xs text-tx-bajo">
          SCA San Juan Bautista de Peñolite — acceso privado
        </p>

        <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
        />

        <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Código de acceso</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
        />

        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-dorado py-2.5 text-sm font-semibold uppercase tracking-wide text-negro disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </CenteredScreen>
  );
}

type Tab = "pedidos" | "clientes" | "tarifas" | "envios" | "ofertas";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("pedidos");

  return (
    <div className="min-h-screen text-tx-crema" style={{ background: PANEL_BACKGROUND }}>
      <header className="flex items-center justify-between border-b border-rule px-6 py-4">
        <h1 className="font-serif text-xl">Panel de Eva</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs uppercase tracking-wide text-tx-bajo hover:text-dorado"
        >
          Cerrar sesión
        </button>
      </header>

      <nav className="flex gap-1 border-b border-rule px-6">
        {([
          ["pedidos", "Pedidos"],
          ["clientes", "Clientes"],
          ["tarifas", "Tarifas"],
          ["envios", "Envíos"],
          ["ofertas", "Ofertas"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              tab === id
                ? "border-b-2 border-dorado text-dorado"
                : "text-tx-bajo hover:text-tx-crema"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="p-6">
        {tab === "pedidos" && <PedidosTab />}
        {tab === "clientes" && <ClientesTab />}
        {tab === "tarifas" && <TarifasTab />}
        {tab === "envios" && <EnviosTab />}
        {tab === "ofertas" && <OfertasTab />}
      </main>
    </div>
  );
}

const ESTADOS: Pedido["estado"][] = ["pendiente", "confirmado", "enviado", "cancelado"];

function PedidosTab() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPedidos(data as Pedido[]);
      });
  };

  useEffect(load, []);

  const updateEstado = async (id: string, estado: Pedido["estado"]) => {
    setPedidos((prev) => prev?.map((p) => (p.id === id ? { ...p, estado } : p)) ?? null);
    await supabase.from("pedidos").update({ estado }).eq("id", id);
  };

  const deletePedido = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Borrar el pedido de "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setPedidos((prev) => prev?.filter((p) => p.id !== id) ?? null);
    await supabase.from("pedidos").delete().eq("id", id);
  };

  if (error) return <p className="text-sm text-red-400">Error: {error}</p>;
  if (!pedidos) return <p className="text-sm text-tx-bajo">Cargando pedidos…</p>;
  if (pedidos.length === 0) return <p className="text-sm text-tx-bajo">Todavía no hay pedidos.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-rule">
      <table className="w-full text-left text-sm">
        <thead className="bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado">
          <tr>
            <th className="p-3">Fecha</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Contacto</th>
            <th className="p-3">Pedido</th>
            <th className="p-3">Envío</th>
            <th className="p-3">Total</th>
            <th className="p-3">Estado</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id} className="border-t border-rule">
              <td className="p-3 text-xs text-tx-bajo">
                {new Date(p.created_at).toLocaleString("es-ES")}
              </td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3 text-xs text-tx-medio">
                {p.email}
                <br />
                {p.telefono}
                {p.direccion && (
                  <>
                    <br />
                    {p.direccion}
                    {p.localidad && `, ${p.localidad}`} ({p.codigo_postal})
                  </>
                )}
              </td>
              <td className="p-3 text-xs">
                {p.cajas_3x5l > 0 && <div>{p.cajas_3x5l}× Caja 3x5L</div>}
                {p.cajas_6x2l > 0 && <div>{p.cajas_6x2l}× Caja 6x2L</div>}
                <div className="text-tx-bajo">{p.total_litros}L total</div>
                {p.codigo_promo && (
                  <div className="text-dorado">Código: {p.codigo_promo}</div>
                )}
              </td>
              <td className="p-3 text-xs uppercase text-tx-bajo">{p.destino_envio}</td>
              <td className="p-3 font-mono text-dorado">{p.total_estimado.toFixed(2)} €</td>
              <td className="p-3">
                <select
                  value={p.estado}
                  onChange={(e) => updateEstado(p.id, e.target.value as Pedido["estado"])}
                  className="rounded-md border border-rule bg-black/40 px-2 py-1 text-xs text-tx-crema"
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => deletePedido(p.id, p.nombre)}
                  className="text-xs text-red-400 hover:text-red-300"
                  title="Borrar pedido"
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ClienteAgregado {
  email: string;
  nombre: string;
  telefono: string;
  direccion: string | null;
  localidad: string | null;
  codigoPostal: string;
  destinoEnvio: string;
  totalGastado: number;
  pedidos: Pedido[];
}

function ClientesTab() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [filtro, setFiltro] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPedidos((data as Pedido[]) ?? []));
  }, []);

  if (!pedidos) return <p className="text-sm text-tx-bajo">Cargando clientes…</p>;

  // pedidos ya viene ordenado del más reciente al más antiguo, así que la
  // primera vez que aparece un email es su pedido más reciente — de ahí
  // sacamos su direccion/telefono actuales, no de un pedido antiguo.
  const clientesMap = new Map<string, ClienteAgregado>();
  for (const p of pedidos) {
    const key = p.email.toLowerCase();
    const existing = clientesMap.get(key);
    if (existing) {
      existing.totalGastado += p.total_estimado;
      existing.pedidos.push(p);
    } else {
      clientesMap.set(key, {
        email: p.email,
        nombre: p.nombre,
        telefono: p.telefono,
        direccion: p.direccion,
        localidad: p.localidad,
        codigoPostal: p.codigo_postal,
        destinoEnvio: p.destino_envio,
        totalGastado: p.total_estimado,
        pedidos: [p],
      });
    }
  }
  const clientesTodos = [...clientesMap.values()].sort((a, b) => b.totalGastado - a.totalGastado);

  const q = filtro.trim().toLowerCase();
  const clientes = q
    ? clientesTodos.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono.includes(q) ||
          (c.localidad ?? "").toLowerCase().includes(q) ||
          c.destinoEnvio.toLowerCase().includes(q)
      )
    : clientesTodos;

  if (clientesTodos.length === 0) return <p className="text-sm text-tx-bajo">Todavía no hay clientes.</p>;

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar por nombre, email, teléfono o localidad…"
        className="w-full max-w-md rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
      />

      <div className="overflow-x-auto rounded-lg border border-rule">
        <table className="w-full text-left text-sm">
          <thead className="bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Pedidos</th>
              <th className="p-3">Total gastado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const abierto = expandido === c.email;
              return (
                <Fragment key={c.email}>
                  <tr className="border-t border-rule">
                    <td className="p-3">{c.nombre}</td>
                    <td className="p-3 text-xs text-tx-medio">
                      {c.email}
                      <br />
                      {c.telefono}
                    </td>
                    <td className="p-3 text-xs text-tx-medio">
                      {c.direccion ? (
                        <>
                          {c.direccion}
                          {c.localidad && `, ${c.localidad}`}
                          <br />
                          {c.codigoPostal} · {c.destinoEnvio}
                        </>
                      ) : (
                        <span className="text-tx-bajo">Sin dirección registrada</span>
                      )}
                    </td>
                    <td className="p-3">{c.pedidos.length}</td>
                    <td className="p-3 font-mono text-dorado">{c.totalGastado.toFixed(2)} €</td>
                    <td className="p-3">
                      <button
                        onClick={() => setExpandido(abierto ? null : c.email)}
                        className="text-xs text-dorado hover:text-amber-300"
                      >
                        {abierto ? "Ocultar" : "Ver envíos"}
                      </button>
                    </td>
                  </tr>
                  {abierto && (
                    <tr className="border-t border-rule bg-black/20">
                      <td colSpan={6} className="p-3">
                        <div className="flex flex-col gap-2">
                          {c.pedidos.map((p) => (
                            <div
                              key={p.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-rule p-2 text-xs"
                            >
                              <span className="text-tx-bajo">
                                {new Date(p.created_at).toLocaleDateString("es-ES")}
                              </span>
                              <span className="text-tx-medio">
                                {p.cajas_3x5l > 0 && `${p.cajas_3x5l}× 3x5L `}
                                {p.cajas_6x2l > 0 && `${p.cajas_6x2l}× 6x2L`}
                                {" · "}
                                {p.total_litros}L
                              </span>
                              <span className="text-tx-medio">
                                {p.direccion ? `${p.direccion}, ` : ""}
                                {p.localidad ? `${p.localidad} ` : ""}({p.codigo_postal})
                              </span>
                              <span className="uppercase text-tx-bajo">{p.estado}</span>
                              <span className="font-mono text-dorado">
                                {p.total_estimado.toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-xs text-tx-bajo">
                  No se encuentra ningún cliente con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PRICING_FIELDS: { key: keyof PricingConfig; label: string; suffix: string }[] = [
  { key: "precio_caja_3x5l", label: "Precio caja 3×5L", suffix: "€" },
  { key: "precio_caja_6x2l", label: "Precio caja 6×2L", suffix: "€" },
  { key: "envio_ue", label: "Envío fuera de España (UE)", suffix: "€" },
  { key: "envio_gratis_desde", label: "Envío gratis a partir de", suffix: "€" },
  { key: "descuento_50l_pct", label: "Descuento a partir de 50L", suffix: "%" },
  { key: "descuento_100l_pct", label: "Descuento a partir de 100L", suffix: "%" },
];

function TarifasTab() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("pricing_config")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setPricing(data as PricingConfig);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: keyof PricingConfig, value: string) => {
    setPricing((prev) => ({ ...prev, [key]: Number(value) }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { id, updated_at, ...fields } = pricing;
    void id;
    void updated_at;
    await supabase
      .from("pricing_config")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    setSaved(true);
  };

  if (loading) return <p className="text-sm text-tx-bajo">Cargando tarifas…</p>;

  return (
    <div className="max-w-2xl rounded-lg border border-rule p-6">
      <p className="mb-6 text-xs text-tx-bajo">
        Estos valores se reflejan al instante en el configurador de pedido de la web pública. Los
        portes dentro de España se gestionan por provincia en la pestaña "Envíos".
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRICING_FIELDS.map(({ key, label, suffix }) => (
          <div key={key}>
            <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                value={pricing[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
              />
              <span className="text-xs text-tx-bajo">{suffix}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-md bg-dorado px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-negro disabled:opacity-60"
      >
        {saving ? "Guardando…" : saved ? "Guardado ✓" : "Guardar cambios"}
      </button>
    </div>
  );
}

function EnviosTab() {
  const [provincias, setProvincias] = useState<Provincia[] | null>(null);
  const [precios, setPrecios] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    supabase
      .from("envio_provincias")
      .select("*")
      .order("provincia", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          return;
        }
        const rows = data as Provincia[];
        setProvincias(rows);
        setPrecios(Object.fromEntries(rows.map((p) => [p.id, String(p.precio)])));
      });
  }, []);

  const handleChange = (id: number, value: string) => {
    setPrecios((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!provincias) return;
    setSaving(true);
    const updates = provincias
      .filter((p) => Number(precios[p.id]) !== p.precio)
      .map((p) =>
        supabase
          .from("envio_provincias")
          .update({ precio: Number(precios[p.id]), updated_at: new Date().toISOString() })
          .eq("id", p.id)
      );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
  };

  if (error) return <p className="text-sm text-red-400">Error: {error}</p>;
  if (!provincias) return <p className="text-sm text-tx-bajo">Cargando envíos…</p>;

  const visibles = provincias.filter((p) =>
    p.provincia.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-2xl rounded-lg border border-rule p-6">
      <p className="mb-4 text-xs text-tx-bajo">
        Precio de envío para cada provincia española. El configurador de la web detecta la
        provincia automáticamente a partir del código postal que escribe el cliente. Envío fuera
        de España (Unión Europea) se gestiona en la pestaña "Tarifas".
      </p>

      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar provincia…"
        className="mb-4 w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
      />

      <div className="max-h-[420px] overflow-y-auto rounded-md border border-rule">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-verde-noche/90 text-xs uppercase tracking-wide text-dorado">
            <tr>
              <th className="p-3">Provincia</th>
              <th className="p-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id} className="border-t border-rule">
                <td className="p-3">{p.provincia}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={precios[p.id] ?? ""}
                      onChange={(e) => handleChange(p.id, e.target.value)}
                      className="w-24 rounded-md border border-rule bg-black/40 px-2 py-1 text-sm text-tx-crema focus:outline-none focus:border-dorado"
                    />
                    <span className="text-xs text-tx-bajo">€</span>
                  </div>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-xs text-tx-bajo">
                  No se encuentra ninguna provincia con ese nombre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-md bg-dorado px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-negro disabled:opacity-60"
      >
        {saving ? "Guardando…" : saved ? "Guardado ✓" : "Guardar cambios"}
      </button>
    </div>
  );
}

interface OfertaForm {
  titulo: string;
  texto: string;
  codigo: string;
  descuento_pct: string;
  envio_gratis: boolean;
  fecha_fin: string;
}

const OFERTA_VACIA: OfertaForm = {
  titulo: "",
  texto: "",
  codigo: "",
  descuento_pct: "",
  envio_gratis: false,
  fecha_fin: "",
};

function ofertaAForm(o: Promocion): OfertaForm {
  return {
    titulo: o.titulo,
    texto: o.texto,
    codigo: o.codigo ?? "",
    descuento_pct: o.descuento_pct != null ? String(o.descuento_pct) : "",
    envio_gratis: o.envio_gratis,
    fecha_fin: o.fecha_fin ?? "",
  };
}

function formACampos(f: OfertaForm) {
  return {
    titulo: f.titulo.trim(),
    texto: f.texto.trim(),
    codigo: f.codigo.trim() || null,
    descuento_pct: f.descuento_pct.trim() ? Number(f.descuento_pct) : null,
    envio_gratis: f.envio_gratis,
    fecha_fin: f.fecha_fin || null,
  };
}

function OfertaCampos({
  value,
  onChange,
}: {
  value: OfertaForm;
  onChange: (next: OfertaForm) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Título</label>
        <input
          type="text"
          value={value.titulo}
          onChange={(e) => onChange({ ...value, titulo: e.target.value })}
          placeholder="Ej: Portes gratis esta semana"
          className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Texto</label>
        <textarea
          value={value.texto}
          onChange={(e) => onChange({ ...value, texto: e.target.value })}
          placeholder="Ej: Envío gratis en pedidos superiores a 50L hasta el domingo."
          rows={2}
          className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">
            Código para el cliente (opcional)
          </label>
          <input
            type="text"
            value={value.codigo}
            onChange={(e) => onChange({ ...value, codigo: e.target.value })}
            placeholder="Ej: PENOLITE10"
            className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">
            Caduca el (opcional)
          </label>
          <input
            type="date"
            value={value.fecha_fin}
            onChange={(e) => onChange({ ...value, fecha_fin: e.target.value })}
            className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
          />
        </div>
      </div>
      <p className="text-xs text-tx-bajo">
        Si el código va con descuento o envío gratis, el configurador de pedido lo aplica
        automáticamente cuando un cliente lo escriba — sin esto solo es un aviso informativo.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">
            Descuento al aplicar el código (%, opcional)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={value.descuento_pct}
            onChange={(e) => onChange({ ...value, descuento_pct: e.target.value })}
            placeholder="Ej: 10"
            className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-tx-crema">
            <input
              type="checkbox"
              checked={value.envio_gratis}
              onChange={(e) => onChange({ ...value, envio_gratis: e.target.checked })}
            />
            El código también da envío gratis
          </label>
        </div>
      </div>
    </div>
  );
}

function OfertasTab() {
  const [ofertas, setOfertas] = useState<Promocion[] | null>(null);
  const [error, setError] = useState("");
  const [nueva, setNueva] = useState<OfertaForm>(OFERTA_VACIA);
  const [creando, setCreando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<OfertaForm>(OFERTA_VACIA);
  const [guardando, setGuardando] = useState(false);

  const load = () => {
    supabase
      .from("promociones")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOfertas(data as Promocion[]);
      });
  };

  useEffect(load, []);

  const crearOferta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nueva.titulo.trim() || !nueva.texto.trim()) return;
    setCreando(true);
    await supabase.from("promociones").insert({ ...formACampos(nueva), activo: false });
    setNueva(OFERTA_VACIA);
    setCreando(false);
    load();
  };

  const empezarEdicion = (o: Promocion) => {
    setEditandoId(o.id);
    setEditDraft(ofertaAForm(o));
  };

  const guardarEdicion = async (id: string) => {
    setGuardando(true);
    await supabase.from("promociones").update(formACampos(editDraft)).eq("id", id);
    setGuardando(false);
    setEditandoId(null);
    load();
  };

  // Solo una oferta a la vez tiene sentido como popup en la web pública:
  // al activar una, se desactivan automáticamente las demás.
  const toggleActivo = async (id: string, activo: boolean) => {
    setOfertas(
      (prev) => prev?.map((o) => ({ ...o, activo: o.id === id ? activo : activo ? false : o.activo })) ?? null
    );
    if (activo) {
      await supabase.from("promociones").update({ activo: false }).neq("id", id);
    }
    await supabase.from("promociones").update({ activo }).eq("id", id);
  };

  const borrarOferta = async (id: string, titulo: string) => {
    if (!window.confirm(`¿Borrar la oferta "${titulo}"? Esta acción no se puede deshacer.`)) return;
    setOfertas((prev) => prev?.filter((o) => o.id !== id) ?? null);
    await supabase.from("promociones").delete().eq("id", id);
  };

  if (error) return <p className="text-sm text-red-400">Error: {error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={crearOferta}
        className="flex flex-col gap-4 rounded-lg border border-rule p-6 max-w-2xl"
      >
        <p className="text-xs text-tx-bajo">
          Crea la oferta y luego actívala desde la lista de abajo — solo se muestra en la web la que
          esté marcada como activa.
        </p>
        <OfertaCampos value={nueva} onChange={setNueva} />
        <button
          type="submit"
          disabled={creando}
          className="self-start rounded-md bg-dorado px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-negro disabled:opacity-60"
        >
          {creando ? "Creando…" : "Crear oferta"}
        </button>
      </form>

      {!ofertas ? (
        <p className="text-sm text-tx-bajo">Cargando ofertas…</p>
      ) : ofertas.length === 0 ? (
        <p className="text-sm text-tx-bajo">Todavía no hay ninguna oferta creada.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {ofertas.map((o) =>
            editandoId === o.id ? (
              <div key={o.id} className="rounded-lg border border-dorado/60 p-6 max-w-2xl">
                <OfertaCampos value={editDraft} onChange={setEditDraft} />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => guardarEdicion(o.id)}
                    disabled={guardando}
                    className="rounded-md bg-dorado px-5 py-2 text-xs font-semibold uppercase tracking-wide text-negro disabled:opacity-60"
                  >
                    {guardando ? "Guardando…" : "Guardar cambios"}
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="rounded-md border border-rule px-5 py-2 text-xs uppercase tracking-wide text-tx-bajo hover:text-tx-crema"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={o.id}
                className={`rounded-lg border p-4 flex flex-col gap-2 ${
                  o.activo ? "border-dorado bg-dorado/5" : "border-rule"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={o.activo}
                      onChange={(e) => toggleActivo(o.id, e.target.checked)}
                      aria-label={`Activar oferta "${o.titulo}"`}
                    />
                    <span className="font-semibold text-tx-crema">{o.titulo}</span>
                    {o.activo && (
                      <span className="rounded-full bg-dorado/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-dorado">
                        Activa en la web
                      </span>
                    )}
                  </label>
                  <div className="flex shrink-0 gap-3 text-xs">
                    <button onClick={() => empezarEdicion(o)} className="text-dorado hover:text-amber-300">
                      Editar
                    </button>
                    <button
                      onClick={() => borrarOferta(o.id, o.titulo)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                <p className="text-xs text-tx-medio">{o.texto}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tx-bajo">
                  {o.codigo && (
                    <span>
                      Código: <span className="font-mono text-dorado">{o.codigo}</span>
                    </span>
                  )}
                  {o.descuento_pct != null && <span>Descuento: {o.descuento_pct}%</span>}
                  {o.envio_gratis && <span>Envío gratis</span>}
                  {o.fecha_fin && <span>Caduca: {new Date(o.fecha_fin).toLocaleDateString("es-ES")}</span>}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
