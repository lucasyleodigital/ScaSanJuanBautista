import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { fichaPorSlug, SITE_URL } from "@/lib/catalogo-seo";

const SLUG = "aceite-oliva-virgen-extra-garrafa-5-litros";
const ficha = fichaPorSlug(SLUG);

export const metadata: Metadata = {
  title: ficha.titulo,
  description: ficha.descripcion,
  alternates: { canonical: `/${SLUG}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: ficha.titulo,
    description: ficha.descripcion,
    url: `${SITE_URL}/${SLUG}`,
    siteName: "SCA San Juan Bautista de Peñolite",
    images: [{ url: ficha.imagen, alt: ficha.imagenAlt }],
    locale: "es_ES",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: ficha.titulo, description: ficha.descripcion, images: [ficha.imagen] },
};

export default function Page() {
  return <ProductPage slug={SLUG} />;
}
