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

interface Premio {
  titulo: string;
  campana: string;
}

const premios: Premio[] = [
  { titulo: "Medalla de Oro de Andalucía 2022 — Economía y Empresa (Jaencoop Grupo)", campana: "2022" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — Mejor Aceite de Oliva Virgen Extra", campana: "Campaña 2017/18" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — Mejor Aceite de Oliva Virgen Extra", campana: "Campaña 2007/08" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — Mayor Proporción de Aceite de Oliva Virgen Extra", campana: "Campaña 2018/19" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — Mayor Proporción de Aceite Calificado", campana: "Campaña 2004/05" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — 1er Accésit Mejor Depósito de Aceite Virgen Extra", campana: "Campaña 2007/08" },
  { titulo: "Premio Ardilla D.O. Sierra de Segura — Accésit Mayor Proporción de Aceite de Oliva Virgen Extra", campana: "Campaña 2015/16" },
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: spacing.md,
          }}
        >
          {premios.map((premio, i) => (
            <div
              key={i}
              className="premio-card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: spacing.sm,
                background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
                border: `1px solid ${colors.rule}`,
                borderRadius: "8px",
                padding: spacing.md,
              }}
            >
              <div style={{ color: colors.dorado, flexShrink: 0, marginTop: "2px" }}>
                {i === 0 ? <Medal size={22} /> : <Award size={22} />}
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
                  {premio.titulo}
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
                  {premio.campana}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
