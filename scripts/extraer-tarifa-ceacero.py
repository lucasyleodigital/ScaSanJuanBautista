"""
Extrae la tarifa de CEACERO del Excel que envía el transportista y la deja en
JSON, listo para cargar en Supabase (tabla `tarifa_transporte`).

Uso (necesita Python 3 y `pip install xlrd`):

    python scripts/extraer-tarifa-ceacero.py "Tarifa CEACERO.xls" tarifa-ceacero.json
    python scripts/extraer-tarifa-ceacero.py "Tarifa CEACERO.xls" tarifa-ceacero.json --sql supabase-tarifa-ceacero.sql

Qué lee del Excel (todo son valores visibles, no fórmulas):
  - Matriz de zonas: filas = prefijo postal de ORIGEN, columnas = prefijo de DESTINO.
    Solo se extrae la fila del origen indicado (por defecto 23, Jaén).
  - Tabla de precios: filas = escalón de peso tope, columnas = zona (1 a 24).

Qué NO lee: el descuento, el carburante ni el IVA. En el Excel van dentro de
fórmulas protegidas por el transportista; se configuran aparte desde el panel
de Eva (Envíos).

Los destinos sin zona en la matriz (en la tarifa de 2026: Canarias, Ceuta y
Melilla) quedan con valor null: no tienen tarifa y se presupuestan aparte.
"""
import argparse
import json
import sys

import xlrd

# Prefijos postales de España (01 a 52) a los que se aplica la tarifa
PREFIJOS_ESPANA = range(1, 53)

# Límites de peso por destino cuando la tabla deja de coincidir con la
# calculadora oficial de CEACERO. Baleares (07): hasta 50 kg la tabla coincide
# con su calculadora; por encima la calculadora da otros precios (comprobado
# con la tarifa de 2026), así que se presupuesta aparte.
LIMITES_KG = {"07": 50}


def extraer(ruta, origen):
    hoja = xlrd.open_workbook(ruta).sheet_by_index(0)

    # Cabecera de destinos: fila 10 (índice 9), columnas R..BZ
    cols_destino = {}
    for c in range(17, 78):
        v = hoja.cell_value(9, c)
        if isinstance(v, float) and v > 0:
            cols_destino[int(v)] = c

    fila_origen = next(
        (r for r in range(10, hoja.nrows) if hoja.cell_value(r, 16) == origen), None
    )
    if fila_origen is None:
        sys.exit(f"No se encuentra el prefijo de origen {origen} en la matriz de zonas")

    zonas = {}
    for d in PREFIJOS_ESPANA:
        celda = hoja.cell_value(fila_origen, cols_destino[d]) if d in cols_destino else ""
        zonas[f"{d:02d}"] = int(celda) if celda != "" else None

    # Tabla de precios: cabecera de zonas en la fila 7 (índice 6), columna CB = peso tope
    cols_zona = {}
    for c in range(80, hoja.ncols):
        v = hoja.cell_value(6, c)
        if isinstance(v, float) and 1 <= v <= 24:
            cols_zona[int(v)] = c

    escalones, filas = [], []
    for r in range(8, min(62, hoja.nrows)):
        peso = hoja.cell_value(r, 79)
        if isinstance(peso, float) and 0 < peso <= 2000:
            escalones.append(int(peso))
            filas.append(r)

    precios = {
        str(zona): [round(hoja.cell_value(r, c), 2) for r in filas]
        for zona, c in sorted(cols_zona.items())
    }

    return {
        "origen_cp": origen,
        "zonas": zonas,
        "escalones": escalones,
        "precios": precios,
        "limites_kg": LIMITES_KG,
    }


def a_sql(datos, transportista, vigente_desde):
    cuerpo = json.dumps(datos, ensure_ascii=False, separators=(",", ":")).replace("'", "''")
    return (
        "-- Tarifa del transportista cargada con scripts/extraer-tarifa-ceacero.py\n"
        "-- Se puede ejecutar varias veces: actualiza la tarifa sin tocar los parámetros\n"
        "-- (descuento, carburante, IVA, margen, redondeo) que Eva ha configurado.\n"
        "insert into public.tarifa_transporte (id, transportista, vigente_desde, origen_cp, zonas, escalones, precios, limites_kg)\n"
        f"select 1, '{transportista}', '{vigente_desde}', t.origen_cp, t.zonas, t.escalones, t.precios, t.limites_kg\n"
        f"from jsonb_to_record('{cuerpo}'::jsonb)\n"
        "  as t(origen_cp int, zonas jsonb, escalones jsonb, precios jsonb, limites_kg jsonb)\n"
        "on conflict (id) do update set\n"
        "  transportista = excluded.transportista,\n"
        "  vigente_desde = excluded.vigente_desde,\n"
        "  origen_cp = excluded.origen_cp,\n"
        "  zonas = excluded.zonas,\n"
        "  escalones = excluded.escalones,\n"
        "  precios = excluded.precios,\n"
        "  limites_kg = excluded.limites_kg;\n"
    )


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("excel")
    ap.add_argument("salida_json")
    ap.add_argument("--origen", type=int, default=23, help="prefijo postal de origen (23 = Jaén)")
    ap.add_argument("--sql", help="además, escribe un .sql para cargar la tarifa en Supabase")
    ap.add_argument("--transportista", default="CEACERO")
    ap.add_argument("--vigente-desde", default="2026-02-01")
    a = ap.parse_args()

    datos = extraer(a.excel, a.origen)
    with open(a.salida_json, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
    sin = [p for p, z in datos["zonas"].items() if z is None]
    print(f"{len(datos['escalones'])} escalones de peso, {len(datos['precios'])} zonas")
    print(f"Destinos sin tarifa: {', '.join(sin) if sin else 'ninguno'}")
    if a.sql:
        with open(a.sql, "w", encoding="utf-8") as f:
            f.write(a_sql(datos, a.transportista, a.vigente_desde))
        print(f"SQL escrito en {a.sql}")
