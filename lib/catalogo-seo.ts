// Datos de las páginas de producto indexables (una por formato de caja).
// Los precios deben coincidir con los de CatalogV2 y con pricing_config.

export const SITE_URL = "https://www.dehesapenolite.com";

export interface FichaProducto {
  slug: string;
  /** Título de la pestaña y de Google. */
  titulo: string;
  descripcion: string;
  h1: string;
  entradilla: string;
  nombreCorto: string;
  imagen: string;
  imagenAlt: string;
  precio: number;
  litros: number;
  garrafas: number;
  litrosPorGarrafa: number;
  pesoKg: string;
  paraQuien: string[];
  /** Otra ficha, para enlazarlas entre sí. */
  otra: { slug: string; texto: string };
  preguntas: { pregunta: string; respuesta: string }[];
}

const PREGUNTAS_COMUNES = [
  {
    pregunta: "¿Cómo se paga?",
    respuesta:
      "Compras directamente a la cooperativa. Envías el pedido desde la web y te lo confirmamos por email, teléfono o WhatsApp. El pago se hace por Bizum o por transferencia bancaria, directamente a la cooperativa.",
  },
  {
    pregunta: "¿Cuánto cuesta el envío?",
    respuesta:
      "Se calcula según el peso del pedido y la provincia de entrega, y lo ves en el configurador antes de enviar el pedido. Para Canarias, Ceuta y Melilla el envío se presupuesta aparte: escríbenos y te lo confirmamos.",
  },
  {
    pregunta: "¿Cómo debo conservar el aceite?",
    respuesta:
      "En un lugar fresco y seco, alejado de la luz directa. Por eso lo envasamos en garrafas opacas: así conserva mejor sus propiedades y su sabor durante más tiempo.",
  },
];

export const FICHAS: FichaProducto[] = [
  {
    slug: "aceite-oliva-virgen-extra-garrafa-5-litros",
    titulo: "Comprar Aceite de Oliva Virgen Extra 15 Litros (3 Garrafas de 5 L) | Dehesa de Peñolite",
    descripcion:
      "Caja de 3 garrafas de 5 litros de AOVE Picual 100% D.O. Sierra de Segura, 85 €. Directo de la cooperativa de Peñolite, Jaén, con envío.",
    h1: "Aceite de oliva virgen extra en garrafa de 5 litros",
    entradilla:
      "Caja de 3 garrafas de 5 litros: 15 litros de aceite de oliva virgen extra Picual, D.O. Sierra de Segura, directamente de la cooperativa que lo elabora en Peñolite (Jaén).",
    nombreCorto: "Caja 3 garrafas × 5 L",
    imagen: "/images/productos/caja-3x5l.webp",
    imagenAlt: "Caja de 3 garrafas de 5 litros de aceite de oliva virgen extra Dehesa de Peñolite",
    precio: 85,
    litros: 15,
    garrafas: 3,
    litrosPorGarrafa: 5,
    pesoKg: "13,74",
    paraQuien: [
      "Familias que gastan aceite a diario y quieren comprar para meses.",
      "Quien prefiere pocas garrafas grandes y un precio por litro más bajo.",
      "Compras en común entre vecinos, familia o amigos: una caja se reparte bien entre varios.",
    ],
    otra: {
      slug: "aceite-oliva-virgen-extra-garrafa-2-litros",
      texto: "¿Prefieres un formato más manejable? Mira la caja de 6 garrafas de 2 litros.",
    },
    preguntas: [
      {
        pregunta: "¿Cuántos litros trae la caja de 3 garrafas de 5 litros?",
        respuesta:
          "15 litros en total, en tres garrafas opacas de 5 litros. La caja pesa unos 13,74 kg con el envase.",
      },
      ...PREGUNTAS_COMUNES,
    ],
  },
  {
    slug: "aceite-oliva-virgen-extra-garrafa-2-litros",
    titulo: "Comprar Aceite de Oliva Virgen Extra 12 Litros (6 Garrafas de 2 L) | Dehesa de Peñolite",
    descripcion:
      "Caja de 6 garrafas de 2 litros de AOVE Picual 100% D.O. Sierra de Segura, 69 €. Directo de la cooperativa de Peñolite, Jaén, con envío.",
    h1: "Aceite de oliva virgen extra en garrafa de 2 litros",
    entradilla:
      "Caja de 6 garrafas de 2 litros: 12 litros de aceite de oliva virgen extra Picual, D.O. Sierra de Segura, directamente de la cooperativa que lo elabora en Peñolite (Jaén).",
    nombreCorto: "Caja 6 garrafas × 2 L",
    imagen: "/images/productos/caja-6x2l.webp",
    imagenAlt: "Caja de 6 garrafas de 2 litros de aceite de oliva virgen extra Dehesa de Peñolite",
    precio: 69,
    litros: 12,
    garrafas: 6,
    litrosPorGarrafa: 2,
    pesoKg: "10,98",
    paraQuien: [
      "Restaurantes, bares y negocios de hostelería con consumo frecuente.",
      "Hogares que prefieren garrafas fáciles de manejar y de ir abriendo una a una.",
      "Quien quiere varios envases pequeños para repartir o regalar.",
    ],
    otra: {
      slug: "aceite-oliva-virgen-extra-garrafa-5-litros",
      texto: "¿Buscas el precio por litro más bajo? Mira la caja de 3 garrafas de 5 litros.",
    },
    preguntas: [
      {
        pregunta: "¿Cuántos litros trae la caja de 6 garrafas de 2 litros?",
        respuesta:
          "12 litros en total, en seis garrafas opacas de 2 litros. La caja pesa unos 10,98 kg con el envase.",
      },
      ...PREGUNTAS_COMUNES,
    ],
  },
];

export function fichaPorSlug(slug: string): FichaProducto {
  const ficha = FICHAS.find((f) => f.slug === slug);
  if (!ficha) throw new Error(`Ficha de producto desconocida: ${slug}`);
  return ficha;
}

export const precioPorLitro = (f: FichaProducto) => (f.precio / f.litros).toFixed(2).replace(".", ",");
