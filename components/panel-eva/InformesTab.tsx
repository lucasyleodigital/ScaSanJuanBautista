"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, type Pedido } from "@/lib/supabase";
import { esEnvioAConsultar } from "@/lib/envios";
import {
  AGRUPACION_ETIQUETAS,
  COLUMNAS_CLIENTES,
  COMUNIDADES_ORDENADAS,
  ESTADO_ETIQUETAS,
  ORDEN_CLIENTES_ETIQUETAS,
  PESOS_CAJA_POR_DEFECTO,
  PROVINCIAS_ORDENADAS,
  ZONA_INTERNACIONAL,
  agruparClientes,
  agruparPedidos,
  calcularTotales,
  columnasEnvios,
  construirDetalle,
  descargarCsv,
  descargarExcel,
  etiquetaZona,
  fetchTodosLosPedidos,
  filtrarPedidos,
  fmtFecha,
  mesesDisponibles,
  ordenarClientes,
  ordenarPedidosPorFecha,
  pesoDePedido,
  resolverPeriodo,
  zonaDePedido,
  type Agrupacion,
  type ClienteResumen,
  type EstadoFiltro,
  type InformeExportable,
  type OrdenClientes,
  type PesosCaja,
  type Totales,
} from "@/lib/informes";

// En pantalla se muestran como mucho estas filas por tabla para que el panel
// siga ágil con miles de pedidos; el Excel/CSV siempre lleva todas.
const LIMITE_FILAS = 300;

const CAMPO =
  "rounded-md border border-rule bg-black/40 px-3 py-2 text-sm text-tx-crema focus:outline-none focus:border-dorado";
const BOTON =
  "rounded-md border border-dorado px-4 py-2 text-xs font-medium uppercase tracking-wide text-dorado transition-colors hover:bg-dorado hover:text-negro disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dorado";

const TITULO_GRUPO: Record<Agrupacion, string> = {
  ninguna: "",
  mes: "Mes",
  dia: "Día",
  provincia: "Provincia",
  comunidad: "Comunidad",
};

const COLOR_ESTADO: Record<Pedido["estado"], string> = {
  pendiente: "text-amber-300",
  confirmado: "text-sky-300",
  enviado: "text-emerald-300",
  cancelado: "text-red-400",
};

// useGrouping "always": el español omite por defecto el punto de miles en
// números de 4 cifras (5225 pero 77.638), lo que desordena las columnas.
const eur = (n: number) =>
  `${n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" })} €`;
const entero = (n: number) => n.toLocaleString("es-ES", { useGrouping: "always" });

type Informe = "clientes" | "envios";

/** Carga todos los pedidos (paginando) y muestra los informes. */
export default function InformesTab() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [pesos, setPesos] = useState<PesosCaja>(PESOS_CAJA_POR_DEFECTO);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodosLosPedidos()
      .then(setPedidos)
      .catch((e: { message?: string }) => setError(e?.message ?? "No se han podido cargar los pedidos"));

    // Pesos de las cajas que Eva fija en Envíos; si aún no existen, los de siempre.
    supabase
      .from("pricing_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        const c3 = Number(data?.peso_caja_3x5l);
        const c2 = Number(data?.peso_caja_6x2l);
        if (c3 > 0 && c2 > 0) setPesos({ cajas3x5l: c3, cajas6x2l: c2 });
      });
  }, []);

  if (error) return <p className="text-sm text-red-400">Error: {error}</p>;
  if (!pedidos) return <p className="text-sm text-tx-bajo">Cargando pedidos…</p>;
  return <InformesVista pedidos={pedidos} pesos={pesos} />;
}

export function InformesVista({
  pedidos,
  pesos = PESOS_CAJA_POR_DEFECTO,
}: {
  pedidos: Pedido[];
  pesos?: PesosCaja;
}) {
  const [informe, setInforme] = useState<Informe>("clientes");
  const [periodo, setPeriodo] = useState("todo");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [zona, setZona] = useState("todas");
  const [estado, setEstado] = useState<EstadoFiltro>("activos");
  const [busqueda, setBusqueda] = useState("");
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("ninguna");
  const [ordenClientes, setOrdenClientes] = useState<OrdenClientes>("pedidos");
  const [antiguosPrimero, setAntiguosPrimero] = useState(false);
  const [exportando, setExportando] = useState<"" | "xlsx" | "csv">("");
  const [errorExport, setErrorExport] = useState("");
  const [abrirTodos, setAbrirTodos] = useState(false);
  const [versionApertura, setVersionApertura] = useState(0);

  const meses = useMemo(() => mesesDisponibles(pedidos), [pedidos]);
  const provinciasAlfabeticas = useMemo(
    () => [...PROVINCIAS_ORDENADAS].sort((a, b) => a.localeCompare(b, "es")),
    []
  );

  const filtros = { periodo, desde, hasta, zona, estado, busqueda: informe === "clientes" ? busqueda : "" };
  const filtrados = useMemo(
    () => filtrarPedidos(pedidos, filtros),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pedidos, periodo, desde, hasta, zona, estado, busqueda, informe]
  );
  const totales = useMemo(() => calcularTotales(filtrados), [filtrados]);
  const pesoTotalKg = useMemo(() => filtrados.reduce((a, p) => a + pesoDePedido(p, pesos), 0), [filtrados, pesos]);
  const grupos = useMemo(() => agruparPedidos(filtrados, agrupacion), [filtrados, agrupacion]);

  const gruposClientes = useMemo(
    () =>
      informe === "clientes"
        ? grupos.map((g) => ({ ...g, clientes: ordenarClientes(agruparClientes(g.pedidos), ordenClientes) }))
        : [],
    [grupos, informe, ordenClientes]
  );
  const gruposEnvios = useMemo(
    () =>
      informe === "envios"
        ? grupos.map((g) => ({ ...g, envios: ordenarPedidosPorFecha(g.pedidos, antiguosPrimero) }))
        : [],
    [grupos, informe, antiguosPrimero]
  );

  const agrupado = agrupacion !== "ninguna";
  const hayDatos = filtrados.length > 0;

  const construirInforme = (): InformeExportable => {
    const rango = resolverPeriodo(periodo, desde, hasta);
    const filtrosTexto: [string, string][] = [
      ["Periodo", rango.etiqueta],
      ["Zona", etiquetaZona(zona)],
      ["Estado", ESTADO_ETIQUETAS[estado]],
      ["Agrupado", AGRUPACION_ETIQUETAS[agrupacion]],
    ];
    if (informe === "clientes" && busqueda.trim()) filtrosTexto.push(["Búsqueda", busqueda.trim()]);
    const resumenGrupos = agrupado
      ? grupos.map((g) => ({ etiqueta: g.etiqueta, totales: calcularTotales(g.pedidos) }))
      : null;

    if (informe === "clientes") {
      return {
        clave: "clientes",
        titulo: "Informe de clientes — Dehesa de Peñolite",
        filtros: filtrosTexto,
        totales,
        resumenGrupos,
        tituloGrupo: TITULO_GRUPO[agrupacion],
        detalle: construirDetalle(
          COLUMNAS_CLIENTES,
          gruposClientes.map((g) => ({ etiqueta: g.etiqueta, filas: g.clientes })),
          agrupado,
          TITULO_GRUPO[agrupacion]
        ),
      };
    }
    return {
      clave: "envios",
      titulo: "Informe de envíos — Dehesa de Peñolite",
      filtros: filtrosTexto,
      totales,
      resumenGrupos,
      tituloGrupo: TITULO_GRUPO[agrupacion],
      detalle: construirDetalle(
        columnasEnvios(pesos),
        gruposEnvios.map((g) => ({ etiqueta: g.etiqueta, filas: g.envios })),
        agrupado,
        TITULO_GRUPO[agrupacion]
      ),
    };
  };

  const exportar = async (formato: "xlsx" | "csv") => {
    setErrorExport("");
    setExportando(formato);
    try {
      const datos = construirInforme();
      if (formato === "xlsx") await descargarExcel(datos);
      else descargarCsv(datos);
    } catch (e) {
      setErrorExport(e instanceof Error ? e.message : "No se ha podido generar el archivo");
    } finally {
      setExportando("");
    }
  };

  const alternarApertura = () => {
    setAbrirTodos((v) => !v);
    setVersionApertura((v) => v + 1);
  };

  if (pedidos.length === 0) return <p className="text-sm text-tx-bajo">Todavía no hay pedidos.</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["clientes", "Listado de clientes"],
            ["envios", "Listado de envíos"],
          ] as [Informe, string][]
        ).map(([id, etiqueta]) => (
          <button
            key={id}
            onClick={() => setInforme(id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              informe === id
                ? "border-dorado bg-dorado/15 text-dorado"
                : "border-rule text-tx-bajo hover:text-tx-crema"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <section className="grid gap-3 rounded-lg border border-rule bg-black/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Campo etiqueta="Periodo">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={CAMPO}>
            <option value="todo">Todo el histórico</option>
            <option value="este-mes">Este mes</option>
            <option value="mes-pasado">Mes pasado</option>
            <option value="este-anio">Este año</option>
            {meses.length > 0 && (
              <optgroup label="Un mes concreto">
                {meses.map((m) => (
                  <option key={m.clave} value={`mes:${m.clave}`}>
                    {m.etiqueta}
                  </option>
                ))}
              </optgroup>
            )}
            <option value="rango">Rango de fechas…</option>
          </select>
        </Campo>

        {periodo === "rango" && (
          <>
            <Campo etiqueta="Desde">
              <input
                type="date"
                value={desde}
                max={hasta || undefined}
                onChange={(e) => setDesde(e.target.value)}
                className={`${CAMPO} [color-scheme:dark]`}
              />
            </Campo>
            <Campo etiqueta="Hasta">
              <input
                type="date"
                value={hasta}
                min={desde || undefined}
                onChange={(e) => setHasta(e.target.value)}
                className={`${CAMPO} [color-scheme:dark]`}
              />
            </Campo>
          </>
        )}

        <Campo etiqueta="Zona">
          <select value={zona} onChange={(e) => setZona(e.target.value)} className={CAMPO}>
            <option value="todas">Todas las zonas</option>
            <option value="internacional">{ZONA_INTERNACIONAL}</option>
            <optgroup label="Comunidad autónoma">
              {COMUNIDADES_ORDENADAS.map((c) => (
                <option key={c} value={`ccaa:${c}`}>
                  {c}
                </option>
              ))}
            </optgroup>
            <optgroup label="Provincia">
              {provinciasAlfabeticas.map((p) => (
                <option key={p} value={`prov:${p}`}>
                  {p}
                </option>
              ))}
            </optgroup>
          </select>
        </Campo>

        <Campo etiqueta="Estado del pedido">
          <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoFiltro)} className={CAMPO}>
            {(Object.keys(ESTADO_ETIQUETAS) as EstadoFiltro[]).map((k) => (
              <option key={k} value={k}>
                {ESTADO_ETIQUETAS[k]}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Agrupar">
          <select
            value={agrupacion}
            onChange={(e) => setAgrupacion(e.target.value as Agrupacion)}
            className={CAMPO}
          >
            {(Object.keys(AGRUPACION_ETIQUETAS) as Agrupacion[]).map((k) => (
              <option key={k} value={k}>
                {AGRUPACION_ETIQUETAS[k]}
              </option>
            ))}
          </select>
        </Campo>

        {informe === "clientes" ? (
          <>
            <Campo etiqueta="Ordenar clientes por">
              <select
                value={ordenClientes}
                onChange={(e) => setOrdenClientes(e.target.value as OrdenClientes)}
                className={CAMPO}
              >
                {(Object.keys(ORDEN_CLIENTES_ETIQUETAS) as OrdenClientes[]).map((k) => (
                  <option key={k} value={k}>
                    {ORDEN_CLIENTES_ETIQUETAS[k]}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo etiqueta="Buscar">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, email, teléfono o localidad…"
                className={CAMPO}
              />
            </Campo>
          </>
        ) : (
          <Campo etiqueta="Ordenar por fecha">
            <select
              value={antiguosPrimero ? "antiguos" : "recientes"}
              onChange={(e) => setAntiguosPrimero(e.target.value === "antiguos")}
              className={CAMPO}
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
            </select>
          </Campo>
        )}
      </section>

      <Resumen totales={totales} tipo={informe} pesoKg={pesoTotalKg} />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => exportar("xlsx")} disabled={!hayDatos || !!exportando} className={BOTON}>
          {exportando === "xlsx" ? "Generando…" : "Descargar Excel"}
        </button>
        <button onClick={() => exportar("csv")} disabled={!hayDatos || !!exportando} className={BOTON}>
          {exportando === "csv" ? "Generando…" : "Descargar CSV"}
        </button>
        {agrupado && hayDatos && (
          <button onClick={alternarApertura} className="text-xs text-dorado hover:text-amber-300">
            {abrirTodos ? "Cerrar todos los grupos" : "Abrir todos los grupos"}
          </button>
        )}
        <span className="text-xs text-tx-bajo">
          {entero(filtrados.length)} de {entero(pedidos.length)} pedidos cumplen los filtros
        </span>
      </div>
      {errorExport && <p className="text-sm text-red-400">No se ha podido generar el archivo: {errorExport}</p>}

      {!hayDatos ? (
        <p className="rounded-lg border border-rule p-4 text-sm text-tx-bajo">
          Ningún pedido cumple estos filtros. Prueba con otro periodo, zona o estado.
        </p>
      ) : !agrupado ? (
        informe === "clientes" ? (
          <TablaClientes clientes={gruposClientes[0]?.clientes ?? []} />
        ) : (
          <TablaEnvios envios={gruposEnvios[0]?.envios ?? []} pesos={pesos} />
        )
      ) : (
        <div className="flex flex-col gap-3">
          {(informe === "clientes" ? gruposClientes : gruposEnvios).map((g) => {
            const t = calcularTotales(g.pedidos);
            return (
              <details
                key={`${g.clave}-${versionApertura}`}
                open={abrirTodos}
                className="rounded-lg border border-rule"
              >
                <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-6 gap-y-1 bg-verde-noche/60 p-3 text-sm">
                  <span className="font-medium text-dorado">{g.etiqueta}</span>
                  <span className="text-tx-medio">{entero(t.clientes)} clientes</span>
                  <span className="text-tx-medio">{entero(t.pedidos)} pedidos</span>
                  <span className="text-tx-medio">{entero(t.litros)} L</span>
                  {informe === "envios" && (
                    <span className="text-tx-medio">
                      {entero(Math.round(g.pedidos.reduce((a, p) => a + pesoDePedido(p, pesos), 0)))} kg
                    </span>
                  )}
                  <span className="font-mono text-dorado">{eur(t.total)}</span>
                </summary>
                {"clientes" in g ? <TablaClientes clientes={g.clientes} /> : <TablaEnvios envios={g.envios} pesos={pesos} />}
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-tx-bajo">{etiqueta}</span>
      {children}
    </label>
  );
}

function Resumen({ totales, tipo, pesoKg }: { totales: Totales; tipo: Informe; pesoKg: number }) {
  const tarjetas: [string, string][] =
    tipo === "clientes"
      ? [
          ["Clientes", entero(totales.clientes)],
          ["Pedidos", entero(totales.pedidos)],
          ["Litros", entero(totales.litros)],
          ["Total", eur(totales.total)],
          ["Ticket medio", eur(totales.pedidos ? totales.total / totales.pedidos : 0)],
        ]
      : [
          ["Envíos", entero(totales.pedidos)],
          ["Cajas 3×5L", entero(totales.cajas3x5l)],
          ["Cajas 6×2L", entero(totales.cajas6x2l)],
          ["Litros", entero(totales.litros)],
          ["Peso aprox.", `${entero(Math.round(pesoKg))} kg`],
          ["Portes", eur(totales.portes)],
          ["Total", eur(totales.total)],
        ];
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
      {tarjetas.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="rounded-lg border border-rule bg-black/20 p-3">
          <div className="text-[11px] uppercase tracking-wide text-tx-bajo">{etiqueta}</div>
          <div className="mt-1 font-mono text-lg text-dorado">{valor}</div>
        </div>
      ))}
    </div>
  );
}

function AvisoLimite({ total }: { total: number }) {
  if (total <= LIMITE_FILAS) return null;
  return (
    <p className="border-t border-rule p-3 text-xs text-tx-bajo">
      Se muestran {entero(LIMITE_FILAS)} de {entero(total)}. El Excel y el CSV incluyen todos.
    </p>
  );
}

const CABECERA = "bg-verde-noche/60 text-xs uppercase tracking-wide text-dorado";

function TablaClientes({ clientes }: { clientes: ClienteResumen[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-rule">
      <table className="w-full text-left text-sm">
        <thead className={CABECERA}>
          <tr>
            <th className="p-3">Cliente</th>
            <th className="p-3">Zona</th>
            <th className="p-3">Pedidos</th>
            <th className="p-3">Litros</th>
            <th className="p-3">Total</th>
            <th className="p-3">Primer / último pedido</th>
          </tr>
        </thead>
        <tbody>
          {clientes.slice(0, LIMITE_FILAS).map((c) => (
            <tr key={c.email} className="border-t border-rule">
              <td className="p-3">
                {c.nombre}
                <div className="text-xs text-tx-medio">
                  {c.email}
                  <br />
                  {c.telefono}
                </div>
              </td>
              <td className="p-3 text-xs text-tx-medio">
                {c.provincia}
                <br />
                <span className="text-tx-bajo">{c.comunidad}</span>
              </td>
              <td className="p-3">{c.pedidos}</td>
              <td className="p-3">{entero(c.litros)}</td>
              <td className="p-3 font-mono text-dorado">{eur(c.total)}</td>
              <td className="p-3 text-xs text-tx-medio">
                {fmtFecha(c.primerPedido)}
                <br />
                {fmtFecha(c.ultimoPedido)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AvisoLimite total={clientes.length} />
    </div>
  );
}

function TablaEnvios({ envios, pesos }: { envios: Pedido[]; pesos: PesosCaja }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-rule">
      <table className="w-full text-left text-sm">
        <thead className={CABECERA}>
          <tr>
            <th className="p-3">Fecha</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Dirección de envío</th>
            <th className="p-3">Cajas</th>
            <th className="p-3">Litros</th>
            <th className="p-3">Peso aprox.</th>
            <th className="p-3">Portes</th>
            <th className="p-3">Total</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {envios.slice(0, LIMITE_FILAS).map((p) => {
            const z = zonaDePedido(p);
            return (
              <tr key={p.id} className="border-t border-rule">
                <td className="p-3 text-xs text-tx-bajo">{fmtFecha(new Date(p.created_at))}</td>
                <td className="p-3">
                  {p.nombre}
                  <div className="text-xs text-tx-medio">{p.telefono}</div>
                </td>
                <td className="p-3 text-xs text-tx-medio">
                  {p.direccion ?? <span className="text-tx-bajo">Sin dirección registrada</span>}
                  <br />
                  {p.localidad ? `${p.localidad} ` : ""}({p.codigo_postal}) · {z.provincia}
                </td>
                <td className="p-3 text-xs">
                  {p.cajas_3x5l > 0 && <div>{p.cajas_3x5l}× 3×5L</div>}
                  {p.cajas_6x2l > 0 && <div>{p.cajas_6x2l}× 6×2L</div>}
                </td>
                <td className="p-3">{entero(p.total_litros)}</td>
                <td className="p-3 text-xs text-tx-medio">
                  {pesoDePedido(p, pesos).toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg
                </td>
                <td className="p-3 font-mono text-tx-medio">
                  {esEnvioAConsultar(p.destino_envio) ? (
                    <span className="font-sans text-xs text-amber-300">a consultar</span>
                  ) : (
                    eur(p.portes)
                  )}
                </td>
                <td className="p-3 font-mono text-dorado">{eur(p.total_estimado)}</td>
                <td className={`p-3 text-xs uppercase ${COLOR_ESTADO[p.estado]}`}>{p.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AvisoLimite total={envios.length} />
    </div>
  );
}
