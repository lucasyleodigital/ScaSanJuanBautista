"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import { Leaf, Trophy, Mountain, Snowflake, CheckCircle2, MapPin, Users, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import FloatingParticles from "./FloatingParticles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductSpec {
  label: string;
  value: string;
  icon: ReactNode;
}

const specs: ProductSpec[] = [
  { label: "Variedad", value: "Picual 100%", icon: <Leaf size={22} /> },
  { label: "D.O.", value: "Sierra de Segura", icon: <Trophy size={22} /> },
  { label: "Altitud", value: "840 metros", icon: <Mountain size={22} /> },
  { label: "Prensado", value: "En frío", icon: <Snowflake size={22} /> },
  { label: "Aditivos", value: "Cero", icon: <CheckCircle2 size={22} /> },
];

const benefits: { icon: ReactNode; text: string }[] = [
  { icon: <MapPin size={18} />, text: "Sabes qué cooperativa lo prensó y en qué sierra — no una etiqueta de \"mezcla de aceites de la Unión Europea\"" },
  { icon: <Users size={18} />, text: "Tu dinero llega directo a las 500 familias que lo cultivan" },
  { icon: <Wallet size={18} />, text: "Sin el margen del intermediario metido en el precio" },
  { icon: <Leaf size={18} />, text: "Sigue siendo aceite de oliva virgen extra de verdad, sin venderlo como si fuera una novedad" },
];

export default function ProductoV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Transición de entrada con zoom
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: motion.easeDivine,
      });

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

      // Balanceo sutil de la botella al scroll
      if (bottleRef.current) {
        gsap.fromTo(
          bottleRef.current,
          { rotationY: -8 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
              end: "bottom 20%",
              scrub: 1.2,
            },
            rotationY: 8,
            ease: "none",
          }
        );
      }

      // Specs fade-in staggered
      const specItems = sectionRef.current?.querySelectorAll(".spec-item");
      if (specItems) {
        gsap.from(specItems, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center 60%",
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
      id="historia"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.verdeOscuro} 0%, ${colors.negro} 100%)`,
      }}
    >
      <FloatingParticles />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Título */}
        <h2
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(42px, 6vw, 72px)",
            color: colors.txCrema,
            marginBottom: spacing.md,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          Picual Puro: El Sabor que Vuelve
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
          Una gota y reconoces de dónde viene. Sabor intenso, persistente. Pimienta noble. Notas de hierba fresca. Polifenoles que duran.
        </p>

        {/* Layout 2 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: spacing.xxl,
            alignItems: "center",
            marginBottom: spacing.xxxl,
          }}
        >
          {/* Columna izquierda: Botella de producto */}
          <div
            ref={bottleRef}
            style={{
              perspective: "1000px",
              minHeight: "440px",
              backgroundImage: "url(/images/producto/expositor-dehesa-penolite.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `1px solid ${colors.rule}`,
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(200,150,30,0.25)",
            }}
            role="img"
            aria-label="Garrafas de 5L y 2L de Aceite de Oliva Virgen Extra Dehesa de Peñolite, D.O. Sierra de Segura"
          />

          {/* Columna derecha: Especificaciones */}
          <div>
            <h3
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "32px",
                color: colors.txCrema,
                marginBottom: spacing.lg,
                fontVariationSettings: '"wght" 600',
              }}
            >
              Picual Puro de Montaña
            </h3>

            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "16px",
                color: colors.txMedio,
                lineHeight: "1.7",
                marginBottom: spacing.lg,
              }}
            >
              Nuestro aceite virgen extra es el resultado de 68 años de
              experiencia cooperativa, técnicas tradicionales y la tierra
              excepcional de la Sierra de Segura a 840 metros de altitud.
            </p>

            {/* Grid de especificaciones */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="spec-item"
                  style={{
                    background: `${colors.doradoSuave}`,
                    border: `1px solid ${colors.rule}`,
                    borderRadius: "6px",
                    padding: spacing.md,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: colors.dorado,
                      marginBottom: "4px",
                    }}
                  >
                    {spec.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: typography.fontSerif,
                      fontSize: "16px",
                      color: colors.txCrema,
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {spec.value}
                  </div>
                  <div
                    style={{
                      fontFamily: typography.fontSans,
                      fontSize: "11px",
                      color: colors.txBajo,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {spec.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Descripción narrativa */}
            <div
              style={{
                background: colors.verdeOliva,
                border: `1px solid ${colors.rule}`,
                borderRadius: "8px",
                padding: spacing.lg,
              }}
            >
              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.txMedio,
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                <strong style={{ color: colors.dorado }}>Sensorial:</strong> Aroma
                frutado con notas de manzana verde, tomate y hierba fresca.
                Sabor intenso con amargo y picante característicos del Picual.
                Textura fluida, sin aditivos ni conservantes.
              </p>
            </div>
          </div>
        </div>

        {/* Beneficios para la salud */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
            border: `1px solid ${colors.rule}`,
            borderRadius: "8px",
            padding: spacing.lg,
          }}
        >
          <h4
            style={{
              fontFamily: typography.fontSerif,
              fontSize: "20px",
              color: colors.txCrema,
              marginBottom: spacing.md,
              fontVariationSettings: '"wght" 600',
            }}
          >
            Lo Que Cambia Cuando Compras Directo
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
              gap: spacing.md,
              fontSize: "14px",
              color: colors.txMedio,
              lineHeight: "1.6",
            }}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
              >
                <span style={{ color: colors.dorado, flexShrink: 0, display: "flex", marginTop: "2px" }}>
                  {benefit.icon}
                </span>
                {benefit.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
