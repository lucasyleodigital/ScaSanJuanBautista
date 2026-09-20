"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import FloatingParticles from "./FloatingParticles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TerroirV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animar título
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: motion.easeDivine,
      });

      // Stagger de cards
      const cards = cardsRef.current?.querySelectorAll(".terroir-card");
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.15,
          ease: motion.easeDivine,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="olivar"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: colors.negro }}
    >
      <FloatingParticles />
      <div
        className="max-w-7xl mx-auto"
        style={{
          position: "relative",
          zIndex: 1,
          background: `linear-gradient(135deg, rgba(45, 74, 43, 0.1) 0%, transparent 100%)`,
          padding: spacing.xxxl,
          borderRadius: "12px",
          border: `1px solid ${colors.rule}`,
        }}
      >
        {/* Título */}
        <h2
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(42px, 6vw, 72px)",
            color: colors.txCrema,
            marginBottom: spacing.xl,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          La Tierra: Jaén, Cuna del Mejor Aceite de España
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "18px",
            color: colors.txMedio,
            maxWidth: "700px",
            margin: `0 auto ${spacing.xxxl}`,
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          Sierra de Segura, 840 metros donde la montaña respira. Por las noches cae a 2°C, por el día sube a 35°C. Esa oscilación extrema es lo que hace que el Picual de Peñolite sea inigualable. Suelo volcánico, agua mineral perfecta, clima salvaje. La naturaleza hizo su obra maestra. Nosotros solo la cultivamos con respeto.
        </p>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="terroir-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: spacing.lg,
            marginBottom: spacing.xxxl,
          }}
        >
          {/* Card 1: Grande - Terreno */}
          <div
            className="terroir-card terroir-card-large"
            style={{
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              padding: spacing.lg,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "260px",
                backgroundImage: 'url(/images/terroir/terroir-sierra-segura.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: "6px",
                marginBottom: spacing.md,
              }}
              role="img"
              aria-label="Paisaje de olivar en la Sierra de Segura a 840 metros de altitud"
            />
            <h3
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "24px",
                color: colors.txCrema,
                marginBottom: spacing.sm,
              }}
            >
              Altitud: Donde Crece el Carácter
            </h3>
            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "14px",
                color: colors.txMedio,
                lineHeight: "1.6",
              }}
            >
              840 metros de altura. Noches frías, días ardientes. El estrés térmico extremo fuerza al Picual a producir polifenoles antioxidantes poderosos. Por eso nuestro aceite es intenso, vivo, con sabor que perdura.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="terroir-card"
            style={{
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              padding: spacing.lg,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "160px",
                backgroundImage: 'url(/images/terroir/rama-aceitunas.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: "6px",
                marginBottom: spacing.md,
              }}
              role="img"
              aria-label="Rama de olivo Picual con aceitunas"
            />
            <h3
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "20px",
                color: colors.txCrema,
                marginBottom: spacing.sm,
              }}
            >
              Picual: La Variedad Más Cultivada del Mundo
            </h3>
            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "13px",
                color: colors.txMedio,
                lineHeight: "1.6",
              }}
            >
              No es casualidad que el Picual sea la variedad de olivo más plantada del planeta. Pimienta fresca, hierbas silvestres, manzana verde. Un picante que se nota de verdad.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="terroir-card"
            style={{
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              padding: spacing.lg,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "160px",
                backgroundImage: 'url(/images/terroir/cooperativa-socios.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: "6px",
                marginBottom: spacing.md,
              }}
              role="img"
              aria-label="Socios de la cooperativa SCA San Juan Bautista de Peñolite"
            />
            <h3
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "20px",
                color: colors.txCrema,
                marginBottom: spacing.sm,
              }}
            >
              1958: Se Cansaron del Intermediario
            </h3>
            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "13px",
                color: colors.txMedio,
                lineHeight: "1.6",
              }}
            >
              El 23 de julio de 1958, un grupo de familias de Peñolite dejó de vender su aceituna por separado y unió fuerzas. Hoy son 500. Cuando compras aquí, le compras a esas mismas familias — no a quien se pone en medio.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: spacing.md,
            borderTop: `1px solid ${colors.rule}`,
            paddingTop: spacing.lg,
          }}
        >
          {[
            { label: "Socios", value: "500" },
            { label: "Altitud", value: "840m" },
            { label: "Desde", value: "1958" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: typography.fontSerif,
                  fontSize: "28px",
                  color: colors.dorado,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "12px",
                  color: colors.txBajo,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .terroir-grid {
            grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)) !important;
          }
          .terroir-card-large {
            grid-column: span 2;
          }
        }
      `}</style>
    </section>
  );
}
