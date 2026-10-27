// Datos de las páginas de producto indexables (una por formato de caja).
// Los precios deben coincidir con los de CatalogV2 y con pricing_config.

export const SITE_URL = "https://www.dehesapenolite.com";

// Devoluciones y envío para los datos estructurados de las ofertas (Google).
// Deben coincidir con /condiciones-de-venta.
export const POLITICA_DEVOLUCION = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "ES",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  merchantReturnLink: `${"https://www.dehesapenolite.com"}/condiciones-de-venta`,
};

export const DETALLES_ENVIO = {
  "@type": "OfferShippingDetails",
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "ES" },
  // Una caja a la península según provincia (escalón de 20 kg de envio_tarifas):
  // de Jaén/Granada/Córdoba a la zona norte y oeste. Baleares y el resto se
  // presupuestan aparte. Revisar si cambia la tarifa.
  shippingRate: {
    "@type": "MonetaryAmount",
    minValue: 11.5,
    maxValue: 16.6,
    currency: "EUR",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 7, unitCode: "DAY" },
  },
};

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
    pregunta: "¿Cuánto cuesta el envío y cuánto tarda?",
    respuesta:
      "El coste se calcula según el peso del pedido y la provincia de entrega, y lo ves en el configurador antes de enviar el pedido. Preparamos y enviamos el pedido en 24 horas desde que lo confirmamos y recibimos el pago, y llega en un plazo de entre 24 horas y 6 o 7 días según la zona. Para Canarias, Ceuta y Melilla el envío se presupuesta aparte.",
  },
  {
    pregunta: "¿Puedo devolver el pedido?",
    respuesta:
      "Sí. Tienes 14 días naturales desde que lo recibes para desistir de la compra sin dar motivos. Los gastos de la devolución corren a tu cargo, salvo que el producto llegue dañado o no sea lo que pediste. Los envases precintados que se hayan abierto no se pueden devolver por razones de higiene. Tienes todos los detalles en las condiciones de venta.",
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
      "Caja de 3 garrafas de 5 litros de AOVE Picual 100% DOP Sierra de Segura, 85 €. Directo de la cooperativa de Peñolite, Jaén, con envío.",
    h1: "Aceite de oliva virgen extra en garrafa de 5 litros",
    entradilla:
      "Caja de 3 garrafas de 5 litros: 15 litros de aceite de oliva virgen extra Picual, DOP Sierra de Segura, directamente de la cooperativa que lo elabora en Peñolite (Jaén).",
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
      "Caja de 6 garrafas de 2 litros de AOVE Picual 100% DOP Sierra de Segura, 69 €. Directo de la cooperativa de Peñolite, Jaén, con envío.",
    h1: "Aceite de oliva virgen extra en garrafa de 2 litros",
    entradilla:
      "Caja de 6 garrafas de 2 litros: 12 litros de aceite de oliva virgen extra Picual, DOP Sierra de Segura, directamente de la cooperativa que lo elabora en Peñolite (Jaén).",
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
