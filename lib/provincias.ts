// Correspondencia oficial entre los dos primeros dígitos del código postal
// español y su provincia (INE / Correos). Verificado contra Wikipedia y
// codigopostal.org antes de usarlo — determina un coste real de envío,
// así que no se puede aproximar de memoria.
export const PREFIJO_A_PROVINCIA: Record<string, string> = {
  "01": "Álava",
  "02": "Albacete",
  "03": "Alicante",
  "04": "Almería",
  "05": "Ávila",
  "06": "Badajoz",
  "07": "Baleares",
  "08": "Barcelona",
  "09": "Burgos",
  "10": "Cáceres",
  "11": "Cádiz",
  "12": "Castellón",
  "13": "Ciudad Real",
  "14": "Córdoba",
  "15": "A Coruña",
  "16": "Cuenca",
  "17": "Girona",
  "18": "Granada",
  "19": "Guadalajara",
  "20": "Guipúzcoa",
  "21": "Huelva",
  "22": "Huesca",
  "23": "Jaén",
  "24": "León",
  "25": "Lleida",
  "26": "La Rioja",
  "27": "Lugo",
  "28": "Madrid",
  "29": "Málaga",
  "30": "Murcia",
  "31": "Navarra",
  "32": "Ourense",
  "33": "Asturias",
  "34": "Palencia",
  "35": "Las Palmas",
  "36": "Pontevedra",
  "37": "Salamanca",
  "38": "Santa Cruz de Tenerife",
  "39": "Cantabria",
  "40": "Segovia",
  "41": "Sevilla",
  "42": "Soria",
  "43": "Tarragona",
  "44": "Teruel",
  "45": "Toledo",
  "46": "Valencia",
  "47": "Valladolid",
  "48": "Vizcaya",
  "49": "Zamora",
  "50": "Zaragoza",
  "51": "Ceuta",
  "52": "Melilla",
};

// Orden de las provincias para mostrarlas en el panel de Eva (mismo orden
// que el prefijo, 01 a 52).
export const PROVINCIAS_ORDENADAS = Object.values(PREFIJO_A_PROVINCIA);

export function getProvinciaFromCP(codigoPostal: string): string | null {
  const prefijo = codigoPostal.trim().slice(0, 2);
  return PREFIJO_A_PROVINCIA[prefijo] ?? null;
}

// Comunidad autónoma de cada provincia (para agrupar listados por zonas más
// amplias que la provincia). Los nombres de provincia son exactamente los de
// PREFIJO_A_PROVINCIA, y hay una prueba que comprueba que no falta ninguna.
const COMUNIDADES: Record<string, string[]> = {
  "Andalucía": ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
  "Aragón": ["Huesca", "Teruel", "Zaragoza"],
  "Asturias": ["Asturias"],
  "Islas Baleares": ["Baleares"],
  "Canarias": ["Las Palmas", "Santa Cruz de Tenerife"],
  "Cantabria": ["Cantabria"],
  "Castilla y León": ["Ávila", "Burgos", "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
  "Cataluña": ["Barcelona", "Girona", "Lleida", "Tarragona"],
  "Comunidad Valenciana": ["Alicante", "Castellón", "Valencia"],
  "Extremadura": ["Badajoz", "Cáceres"],
  "Galicia": ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
  "Comunidad de Madrid": ["Madrid"],
  "Región de Murcia": ["Murcia"],
  "Navarra": ["Navarra"],
  "País Vasco": ["Álava", "Guipúzcoa", "Vizcaya"],
  "La Rioja": ["La Rioja"],
  "Ceuta": ["Ceuta"],
  "Melilla": ["Melilla"],
};

export const COMUNIDADES_ORDENADAS = Object.keys(COMUNIDADES);

export const PROVINCIA_A_COMUNIDAD: Record<string, string> = Object.fromEntries(
  Object.entries(COMUNIDADES).flatMap(([comunidad, provincias]) =>
    provincias.map((provincia) => [provincia, comunidad])
  )
);
