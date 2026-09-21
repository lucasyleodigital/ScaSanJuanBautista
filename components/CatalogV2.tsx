"use client";

import { useRef } from "react";
import gsap from "gsap";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import FloatingParticles from "./FloatingParticles";

interface ProductCard {
  id: string;
  title: string;
  subtitle: string;
  bottles: number;
  litersPerBottle: number;
  totalLiters: number;
  price: number;
  description: string;
  highlight: string;
}

const products: ProductCard[] = [
  {
    id: "caja-3x5l",
    title: "Caja 3 Garrafas × 5L",
    subtitle: "Para Quien No Quiere Intermediarios",
    bottles: 3,
    litersPerBottle: 5,
    totalLiters: 15,
    price: 85,
    description: "15 litros de Picual puro, 3 garrafas de 5L. Directo de la cooperativa a tu cocina — sin nadie de por medio subiendo el precio. €5.67/L.",
    highlight: "15 litros de Picual puro",
  },
  {
    id: "caja-6x2l",
    title: "Caja 6 Garrafas × 2L",
    subtitle: "Para Restaurantes y Consumo Frecuente",
    bottles: 6,
    litersPerBottle: 2,
    totalLiters: 12,
    price: 69,
    description: "12 litros en botellas de 2L, fáciles de manejar a diario. Mismo origen, mismo precio directo — sin intermediario que se lleve su parte. €5.75/L.",
    highlight: "12 litros de Picual D.O.",
  },
];

const productsJsonLd = products.map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${product.title} — AOVE Picual D.O. Sierra de Segura`,
  description: product.description,
  brand: { "@type": "Brand", name: "SCA San Juan Bautista de Peñolite" },
  offers: {
    "@type": "Offer",
    price: product.price.toFixed(2),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://web-cinematic-lucasyleo-projects.vercel.app/#productos",
  },
}));

export default function CatalogV2() {
  const cardsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="productos"
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45, 74, 43, 0.3) 0%, ${colors.negro} 70%)`,
      }}
    >
      {productsJsonLd.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
        />
      ))}
      <FloatingParticles />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Título */}
        <h2
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(42px, 6vw, 72px)",
            color: colors.txCrema,
            marginBottom: spacing.lg,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          Elige Tu Tamaño, Cómpralo Directo
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "18px",
            color: colors.txMedio,
            maxWidth: "600px",
            margin: `0 auto ${spacing.xxxl}`,
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          Sin intermediarios que suben el precio. Sin distribuidoras de por medio. Picual 100%, D.O. Sierra de Segura, directo de la cooperativa a tu cocina.
        </p>

        {/* Productos */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: spacing.xl,
            marginBottom: spacing.xxxl,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
                border: `1px solid ${colors.rule}`,
                borderRadius: "12px",
                padding: spacing.lg,
                transition: `all ${motion.durationStd}ms ${motion.easeSmooth}`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -12,
                  boxShadow: `0 20px 40px rgba(200, 150, 30, 0.2)`,
                  duration: 0.4,
                  overwrite: "auto",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  boxShadow: "none",
                  duration: 0.4,
                  overwrite: "auto",
                });
              }}
            >
              {/* Imagen del producto */}
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  backgroundImage: product.id === "caja-3x5l"
                    ? 'url(/images/productos/caja-3x5l.webp)'
                    : 'url(/images/productos/caja-6x2l.webp)',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: colors.negro,
                  borderRadius: "8px",
                  marginBottom: spacing.lg,
                }}
                role="img"
                aria-label={product.title}
              />

              {/* Contenido */}
              <h3
                style={{
                  fontFamily: typography.fontSerif,
                  fontSize: "28px",
                  color: colors.txCrema,
                  marginBottom: "8px",
                  fontVariationSettings: '"wght" 600',
                }}
              >
                {product.title}
              </h3>

              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.dorado,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: spacing.md,
                }}
              >
                {product.subtitle}
              </p>

              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.txMedio,
                  lineHeight: "1.6",
                  marginBottom: spacing.md,
                }}
              >
                {product.description}
              </p>

              {/* Specs */}
              <div
                style={{
                  background: colors.doradoSuave,
                  border: `1px solid ${colors.rule}`,
                  borderRadius: "6px",
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                }}
              >
                <p
                  style={{
                    fontFamily: typography.fontSerif,
                    fontSize: "16px",
                    color: colors.txCrema,
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  {product.highlight}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: spacing.sm,
                    fontSize: "12px",
                    color: colors.txBajo,
                  }}
                >
                  <div>
                    {product.bottles} botellas × {product.litersPerBottle}L
                  </div>
                  <div>Total: {product.totalLiters}L</div>
                </div>
              </div>

              {/* Precio */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: `1px solid ${colors.rule}`,
                  paddingTop: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <span
                  style={{
                    fontFamily: typography.fontSerif,
                    fontSize: "32px",
                    color: colors.dorado,
                    fontWeight: 700,
                  }}
                >
                  {product.price}€
                </span>
                <span
                  style={{
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.txBajo,
                  }}
                >
                  €{(product.price / product.totalLiters).toFixed(2)}/L
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("penolite:formato-seleccionado", {
                      detail: product.id === "caja-3x5l" ? "3x5l" : "6x2l",
                    })
                  );
                  document
                    .querySelector("#formulario-contacto")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: colors.dorado,
                  color: colors.negro,
                  border: "none",
                  fontFamily: typography.fontSans,
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: `all ${motion.durationPress}ms ${motion.easeResponsive}`,
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    backgroundColor: colors.verdeOscuro,
                    color: colors.dorado,
                    duration: 0.3,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    backgroundColor: colors.dorado,
                    color: colors.negro,
                    transform: "scale(1)",
                    duration: 0.3,
                  });
                }}
                onMouseDown={(e) => {
                  gsap.to(e.currentTarget, {
                    transform: "scale(0.97)",
                    duration: motion.durationPress / 1000,
                    overwrite: "auto",
                  });
                }}
                onMouseUp={(e) => {
                  gsap.to(e.currentTarget, {
                    transform: "scale(1)",
                    duration: motion.durationPress / 1000,
                    overwrite: "auto",
                  });
                }}
              >
                Solicitar Presupuesto
              </button>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div
          style={{
            background: colors.verdeOliva,
            border: `1px solid ${colors.rule}`,
            borderRadius: "8px",
            padding: spacing.lg,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: typography.fontSans,
              fontSize: "14px",
              color: colors.txMedio,
              lineHeight: "1.6",
            }}
          >
            ¿Necesitas otro formato? Contacta con nosotros para solicitudes
            especiales, pedidos al por mayor o envíos internacionales.
          </p>
        </div>
      </div>
    </section>
  );
}
