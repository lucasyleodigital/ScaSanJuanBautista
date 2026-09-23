"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, DEFAULT_PRICING, type PricingConfig, type Pedido, type Promocion } from "@/lib/supabase";

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

type Tab = "pedidos" | "clientes" | "tarifas" | "ofertas";

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
                {p.telefono} · {p.codigo_postal}
              </td>
              <td className="p-3 text-xs">
                {p.cajas_3x5l > 0 && <div>{p.cajas_3x5l}× Caja 3x5L</div>}
                {p.cajas_6x2l > 0 && <div>{p.cajas_6x2l}× Caja 6x2L</div>}
                <div className="text-tx-bajo">{p.total_litros}L total</div>
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

function ClientesTab() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);

  useEffect(() => {
    supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPedidos((data as Pedido[]) ?? []));
  }, []);

  if (!pedidos) return <p className="text-sm text-tx-bajo">Cargando clientes…</p>;

  const clientesMap = new Map<
    string,
    { nombre: string; email: string; telefono: string; pedidos: number; totalGastado: number }
  >();
  for (const p of pedidos) {
    const key = p.email.toLowerCase();
    const existing = clientesMap.get(key);
    if (existing) {
      existing.pedidos += 1;
      existing.totalGastado += p.total_estimado;
    } else {
      clientesMap.set(key, {
        nombre: p.nombre,
        email: p.email,
        telefono: p.telefono,
        pedidos: 1,
        totalGastado: p.total_estimado,
      });
    }
  }
  const clientes = [...clientesMap.values()].sort((a, b) => b.totalGastado - a.totalGastado);

  if (clientes.length === 0) return <p className="text-sm text-tx-bajo">Todavía no hay clientes.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-rule">
      <table className="w-full text-left text-sm">
        <thead className="bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Contacto</th>
            <th className="p-3">Pedidos</th>
            <th className="p-3">Total gastado</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.email} className="border-t border-rule">
              <td className="p-3">{c.nombre}</td>
              <td className="p-3 text-xs text-tx-medio">
                {c.email}
                <br />
                {c.telefono}
              </td>
              <td className="p-3">{c.pedidos}</td>
              <td className="p-3 font-mono text-dorado">{c.totalGastado.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PRICING_FIELDS: { key: keyof PricingConfig; label: string; suffix: string }[] = [
  { key: "precio_caja_3x5l", label: "Precio caja 3×5L", suffix: "€" },
  { key: "precio_caja_6x2l", label: "Precio caja 6×2L", suffix: "€" },
  { key: "envio_peninsula", label: "Envío España peninsular", suffix: "€" },
  { key: "envio_baleares", label: "Envío Baleares/Canarias", suffix: "€" },
  { key: "envio_ue", label: "Envío Unión Europea", suffix: "€" },
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
        Estos valores se reflejan al instante en el configurador de pedido de la web pública.
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

const OFERTA_VACIA = { titulo: "", texto: "", codigo: "", fecha_fin: "" };

function OfertasTab() {
  const [ofertas, setOfertas] = useState<Promocion[] | null>(null);
  const [error, setError] = useState("");
  const [nueva, setNueva] = useState(OFERTA_VACIA);
  const [creando, setCreando] = useState(false);

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
    await supabase.from("promociones").insert({
      titulo: nueva.titulo.trim(),
      texto: nueva.texto.trim(),
      codigo: nueva.codigo.trim() || null,
      fecha_fin: nueva.fecha_fin || null,
      activo: false,
    });
    setNueva(OFERTA_VACIA);
    setCreando(false);
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
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Título</label>
          <input
            type="text"
            value={nueva.titulo}
            onChange={(e) => setNueva((prev) => ({ ...prev, titulo: e.target.value }))}
            placeholder="Ej: Portes gratis esta semana"
            className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">Texto</label>
          <textarea
            value={nueva.texto}
            onChange={(e) => setNueva((prev) => ({ ...prev, texto: e.target.value }))}
            placeholder="Ej: Envío gratis en pedidos superiores a 50L hasta el domingo."
            rows={2}
            className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-dorado">
              Código (opcional)
            </label>
            <input
              type="text"
              value={nueva.codigo}
              onChange={(e) => setNueva((prev) => ({ ...prev, codigo: e.target.value }))}
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
              value={nueva.fecha_fin}
              onChange={(e) => setNueva((prev) => ({ ...prev, fecha_fin: e.target.value }))}
              className="w-full rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado"
            />
          </div>
        </div>
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
        <div className="overflow-x-auto rounded-lg border border-rule">
          <table className="w-full text-left text-sm">
            <thead className="bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado">
              <tr>
                <th className="p-3">Activa</th>
                <th className="p-3">Título</th>
                <th className="p-3">Texto</th>
                <th className="p-3">Código</th>
                <th className="p-3">Caduca</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((o) => (
                <tr key={o.id} className="border-t border-rule">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={o.activo}
                      onChange={(e) => toggleActivo(o.id, e.target.checked)}
                      aria-label={`Activar oferta "${o.titulo}"`}
                    />
                  </td>
                  <td className="p-3">{o.titulo}</td>
                  <td className="p-3 max-w-xs text-xs text-tx-medio">{o.texto}</td>
                  <td className="p-3 font-mono text-xs text-dorado">{o.codigo || "—"}</td>
                  <td className="p-3 text-xs text-tx-bajo">
                    {o.fecha_fin ? new Date(o.fecha_fin).toLocaleDateString("es-ES") : "—"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => borrarOferta(o.id, o.titulo)}
                      className="text-xs text-red-400 hover:text-red-300"
                      title="Borrar oferta"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
