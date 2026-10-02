"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Award, Medal } from "lucide-react";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import FloatingParticles from "./FloatingParticles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PremioArdilla {
  categoria: string;
  campana: string;
}

const MEDALLA = {
  titulo: "Medalla de Oro de Andalucía 2022",
  detalle: "Economía y Empresa (Jaencoop Grupo)",
};

// Mismo premio, 6 campañas distintas — se listan juntas para no repetir el
// nombre del premio 6 veces y disparar el scroll en móvil.
const premiosArdilla: PremioArdilla[] = [
  { categoria: "Mejor Aceite de Oliva Virgen Extra", campana: "Campaña 2017/18" },
  { categoria: "Mejor Aceite de Oliva Virgen Extra", campana: "Campaña 2007/08" },
  { categoria: "Mayor Proporción de Aceite de Oliva Virgen Extra", campana: "Campaña 2018/19" },
  { categoria: "Mayor Proporción de Aceite Calificado", campana: "Campaña 2004/05" },
  { categoria: "1er Accésit Mejor Depósito de Aceite Virgen Extra", campana: "Campaña 2007/08" },
  { categoria: "Accésit Mayor Proporción de Aceite de Oliva Virgen Extra", campana: "Campaña 2015/16" },
];

export default function PremiosV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
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

      const cards = sectionRef.current?.querySelectorAll(".premio-card");
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.6,
          ease: motion.easeDivine,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="premios"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.negro} 0%, rgba(200, 150, 30, 0.06) 50%, ${colors.negro} 100%)`,
      }}
    >
      <FloatingParticles />
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(36px, 5vw, 60px)",
            color: colors.txCrema,
            marginBottom: spacing.md,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          Calidad Reconocida, No Solo Prometida
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "16px",
            color: colors.txMedio,
            maxWidth: "620px",
            margin: `0 auto ${spacing.xxl}`,
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          No lo decimos nosotros. Estos son los premios que ha recibido
          nuestro aceite, jurado tras jurado, campaña tras campaña.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          <div
            className="premio-card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: spacing.sm,
              maxWidth: "560px",
              width: "100%",
              margin: "0 auto",
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              padding: spacing.md,
            }}
          >
            <div style={{ color: colors.dorado, flexShrink: 0, marginTop: "2px" }}>
              <Medal size={22} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.txCrema,
                  lineHeight: "1.5",
                  marginBottom: "4px",
                }}
              >
                {MEDALLA.titulo} — {MEDALLA.detalle}
              </p>
              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "12px",
                  color: colors.dorado,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                2022
              </p>
            </div>
          </div>

          <div
            className="premio-card"
            style={{
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              padding: spacing.lg,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: spacing.sm, marginBottom: "4px" }}>
              <Award size={22} style={{ color: colors.dorado, flexShrink: 0 }} />
              <h3
                style={{
                  fontFamily: typography.fontSerif,
                  fontSize: "19px",
                  color: colors.txCrema,
                }}
              >
                Premio Ardilla D.O. Sierra de Segura
              </h3>
            </div>
            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "12px",
                color: colors.dorado,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: spacing.sm,
                marginLeft: "34px",
              }}
            >
              Premiados 6 veces en los últimos 20 años
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
                columnGap: spacing.lg,
              }}
            >
              {premiosArdilla.map((premio, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: spacing.sm,
                    padding: "10px 0",
                    borderBottom: `1px solid ${colors.rule}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: typography.fontSans,
                      fontSize: "13px",
                      color: colors.txCrema,
                      lineHeight: "1.4",
                    }}
                  >
                    {premio.categoria}
                  </span>
                  <span
                    style={{
                      fontFamily: typography.fontSans,
                      fontSize: "11px",
                      color: colors.dorado,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {premio.campana}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
