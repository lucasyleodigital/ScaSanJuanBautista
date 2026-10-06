import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import { FICHAS, SITE_URL, fichaPorSlug, precioPorLitro } from "@/lib/catalogo-seo";

const DATOS_ACEITE: [string, string][] = [
  ["Variedad", "Picual 100%"],
  ["Denominación de origen", "D.O. Sierra de Segura"],
  ["Altitud del olivar", "840 metros"],
  ["Extracción", "Prensado en frío, máximo 27 °C"],
  ["Control", "Análisis de laboratorio externo en cada lote"],
  ["Envase", "Garrafas opacas, que protegen el aceite de la luz"],
];

export default function ProductPage({ slug }: { slug: string }) {
  const ficha = fichaPorSlug(slug);
  const otra = fichaPorSlug(ficha.otra.slug);
  const url = `${SITE_URL}/${ficha.slug}`;
  const enlacePedido = "/#formulario-contacto";

  const productoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${ficha.nombreCorto} — AOVE Picual D.O. Sierra de Segura`,
    description: ficha.descripcion,
    image: [`${SITE_URL}${ficha.imagen}`],
    brand: { "@type": "Brand", name: "Dehesa de Peñolite" },
    offers: {
      "@type": "Offer",
      price: ficha.precio.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
      seller: { "@type": "Organization", name: "SCA San Juan Bautista de Peñolite" },
      acceptedPaymentMethod: ["http://purl.org/goodrelations/v1#ByBankTransferInAdvance"],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ficha.preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };

  const migasJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: ficha.nombreCorto, item: url },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-negro text-tx-crema">
      {[productoJsonLd, faqJsonLd, migasJsonLd].map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
      ))}

      <header className="flex items-center justify-between gap-4 border-b border-rule px-6 py-6 md:px-10">
        <Link
          href="/"
          className="font-sans text-[11px] tracking-[0.14em] text-dorado uppercase no-underline transition-colors hover:text-ambar"
        >
          ← Dehesa de Peñolite
        </Link>
        <a
          href={enlacePedido}
          className="border border-dorado px-4 py-2 font-sans text-[10.5px] tracking-[0.16em] text-dorado uppercase no-underline transition-colors hover:bg-dorado hover:text-negro"
        >
          Hacer el pedido
        </a>
      </header>

      <main id="contenido" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:px-10 md:py-16">
        <nav aria-label="Ruta" className="mb-8 text-xs text-tx-bajo">
          <Link href="/" className="text-tx-bajo no-underline hover:text-dorado">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span>{ficha.nombreCorto}</span>
        </nav>

        <section className="grid items-center gap-10 md:grid-cols-2">
          <Image
            src={ficha.imagen}
            alt={ficha.imagenAlt}
            width={900}
            height={900}
            priority
            unoptimized
            className="h-auto w-full rounded-xl border border-rule"
          />
          <div>
            <h1 className="mb-4 font-serif text-3xl leading-tight text-tx-crema md:text-4xl">{ficha.h1}</h1>
            <p className="mb-6 text-sm leading-relaxed text-tx-medio md:text-base">{ficha.entradilla}</p>

            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-serif text-4xl text-dorado">{ficha.precio} €</span>
              <span className="text-sm text-tx-bajo">
                IVA incluido · {precioPorLitro(ficha)} €/litro · envío aparte
              </span>
            </div>
            <p className="mb-6 text-xs text-tx-bajo">
              {ficha.garrafas} garrafas de {ficha.litrosPorGarrafa} litros · {ficha.litros} litros · caja de unos{" "}
              {ficha.pesoKg} kg
            </p>

            <a
              href={enlacePedido}
              className="inline-block bg-dorado px-7 py-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] text-negro uppercase no-underline transition-colors hover:bg-ambar"
            >
              Calcular envío y hacer el pedido
            </a>
            <p className="mt-4 text-xs leading-relaxed text-tx-bajo">
              Compras directamente a la cooperativa. Te confirmamos el pedido y se paga por Bizum o transferencia.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-serif text-2xl text-tx-crema">Para quién es esta caja</h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-tx-medio">
              {ficha.paraQuien.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-serif text-2xl text-tx-crema">Cómo es este aceite</h2>
            <dl className="divide-y divide-rule border-y border-rule text-sm">
              {DATOS_ACEITE.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-tx-bajo">{k}</dt>
                  <dd className="text-right text-tx-crema">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-4 font-serif text-2xl text-tx-crema">Quién lo elabora</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-tx-medio">
            La S.C.A. San Juan Bautista de Peñolite es una cooperativa fundada en 1958 en Peñolite (Puente de Génave),
            en la Sierra de Segura, Jaén. Hoy la forman unas 200 familias socias y vende su aceite sin intermediarios: lo que
            pagas llega a quien cultiva el olivar.{" "}
            <Link href="/#historia" className="text-dorado">
              Conoce la historia de la cooperativa
            </Link>
            .
          </p>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl text-tx-crema">Preguntas frecuentes</h2>
          <div className="divide-y divide-rule border-y border-rule">
            {ficha.preguntas.map((p) => (
              <details key={p.pregunta} className="group py-4">
                <summary className="cursor-pointer list-none font-serif text-lg text-tx-crema marker:hidden">
                  {p.pregunta}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-tx-medio">{p.respuesta}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 border border-rule p-6 md:p-8">
          <p className="mb-4 text-sm text-tx-medio">{ficha.otra.texto}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${otra.slug}`}
              className="border border-dorado px-5 py-2.5 font-sans text-[10.5px] tracking-[0.16em] text-dorado uppercase no-underline transition-colors hover:bg-dorado hover:text-negro"
            >
              {otra.nombreCorto} · {otra.precio} €
            </Link>
            <a
              href={enlacePedido}
              className="px-5 py-2.5 font-sans text-[10.5px] tracking-[0.16em] text-tx-medio uppercase no-underline hover:text-dorado"
            >
              Hacer el pedido
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const slugsProducto = FICHAS.map((f) => f.slug);
