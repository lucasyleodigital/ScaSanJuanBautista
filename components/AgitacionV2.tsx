"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { CircleOff, Clock, Layers, HandCoins } from "lucide-react";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const dolores = [
  {
    icon: CircleOff,
    titulo: "“Virgen extra” que no dice de dónde viene",
    texto: "Etiquetas que mezclan aceites de varios países sin origen claro. Compras la etiqueta, no sabes qué hay dentro.",
  },
  {
    icon: HandCoins,
    titulo: "Un precio bajo que alguien paga",
    texto: "Si el aceite cuesta poco, el recorte sale de algún sitio: del agricultor, de la calidad, o de ambos.",
  },
  {
    icon: Clock,
    titulo: "Meses en un almacén antes de llegar a ti",
    texto: "Cuanto más tiempo pasa entre la prensa y tu cocina, más aroma y polifenoles pierde el aceite por el camino.",
  },
  {
    icon: Layers,
    titulo: "Intermediarios que no cultivan nada",
    texto: "Entre el olivar y tu mesa se cuelan manos que suben el precio sin aportar una sola aceituna.",
  },
];

export default function AgitacionV2() {
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

      const cards = sectionRef.current?.querySelectorAll(".dolor-card");
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: motion.easeDivine,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ backgroundColor: colors.negro }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(34px, 5vw, 56px)",
            color: colors.txCrema,
            marginBottom: spacing.md,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          El Aceite del Súper No Siempre Es Lo Que Dice Ser
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "17px",
            color: colors.txMedio,
            maxWidth: "640px",
            margin: `0 auto ${spacing.xxl}`,
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          La mayoría del aceite que se vende en gran superficie pasa por
          manos que nunca han pisado un olivar. Esto es lo que suele
          esconder ese precio de estantería:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: spacing.md,
            marginBottom: spacing.xxl,
          }}
        >
          {dolores.map((d) => (
            <div
              key={d.titulo}
              className="dolor-card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: spacing.sm,
                border: `1px solid ${colors.rule}`,
                borderRadius: "8px",
                padding: spacing.md,
                background: `linear-gradient(135deg, rgba(200, 150, 30, 0.06) 0%, transparent 100%)`,
              }}
            >
              <div style={{ color: colors.dorado, flexShrink: 0, marginTop: "2px" }}>
                <d.icon size={20} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: typography.fontSans,
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: colors.txCrema,
                    marginBottom: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  {d.titulo}
                </p>
                <p
                  style={{
                    fontFamily: typography.fontSans,
                    fontSize: "13px",
                    color: colors.txMedio,
                    lineHeight: "1.6",
                  }}
                >
                  {d.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(20px, 2.6vw, 28px)",
            color: colors.dorado,
            textAlign: "center",
            lineHeight: "1.5",
            fontVariationSettings: '"wght" 500',
          }}
        >
          Nosotros hacemos justo lo contrario.
        </p>
      </div>
    </section>
  );
}
