"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { Leaf, Truck, Cog, CheckCircle, Droplet, Package } from "lucide-react";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import FloatingParticles from "./FloatingParticles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: ProcessStep[] = [
  {
    number: 1,
    title: "Cosecha en su Punto",
    description:
      "Nuestros socios cosechan a mano y con maquinaria, según la parcela. Lo que no cambia nunca es el momento: solo aceituna madura, en su punto exacto.",
    icon: <Leaf size={24} />,
  },
  {
    number: 2,
    title: "Transporte a la Almazara",
    description: "En tractores y remolques, a granel, directo a la almazara. Cuanto antes llegue la aceituna, mejor conserva sus propiedades.",
    icon: <Truck size={24} />,
  },
  {
    number: 3,
    title: "Prensado en Frío",
    description: "Máximo 27°C. Sin calor. Sin presión química. El aceite mantiene toda su esencia, polifenoles intactos.",
    icon: <Cog size={24} />,
  },
  {
    number: 4,
    title: "Control Certificado",
    description: "Análisis de laboratorio externo: polifenoles, pureza, calidad. Cada lote es oro verificado.",
    icon: <CheckCircle size={24} />,
  },
  {
    number: 5,
    title: "Envasado en Garrafa",
    description: "Garrafas de 2 y 5 litros que protegen el aceite de la luz. Bajo pedido, también envasamos en otros formatos.",
    icon: <Droplet size={24} />,
  },
  {
    number: 6,
    title: "Tu Cocina",
    description: "Listo para envío a toda España. De nuestras manos a las tuyas, directo, sin que nadie más lo toque.",
    icon: <Package size={24} />,
  },
];

export default function ProcesoV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

      // Animar pasos del timeline
      const steps = timelineRef.current?.querySelectorAll(".process-step");
      if (steps) {
        gsap.from(steps, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
          },
          opacity: 0,
          y: 60,
          stagger: 0.10,
          duration: 0.8,
          ease: motion.easeDivine,
        });

        // Animar línea conectora
        gsap.from(".process-line", {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 20%",
            scrub: 1.5,
          },
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="calidad"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: colors.negro }}
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
          De Oliva a Gota: Cuidado Obsesivo
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
          Seis pasos donde cada detalle importa. Nada es al azar. Nada es rápido. Nada es fácil. Solo así se preserva la pureza desde la rama hasta tu cocina.
        </p>

        {/* Galería de imágenes del proceso */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: spacing.lg,
            marginBottom: spacing.xxxl,
          }}
        >
          {[
            { src: "/images/proceso/cosecha-manual.jpg", label: "Cosecha" },
            { src: "/images/proceso/prensa.jpg", label: "Prensa Tradicional" },
            { src: "/images/proceso/embotellado.jpg", label: "Embotellado" },
          ].map((img) => (
            <div
              key={img.src}
              style={{
                position: "relative",
                height: "220px",
                borderRadius: "8px",
                overflow: "hidden",
                border: `1px solid ${colors.rule}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${img.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 50%, rgba(6,13,3,0.85) 100%)`,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: spacing.sm,
                  left: spacing.sm,
                  fontFamily: typography.fontSans,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.txCrema,
                }}
              >
                {img.label}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline vertical */}
        <div
          ref={timelineRef}
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: spacing.xl,
          }}
        >
          {/* Línea decorativa (solo en desktop) */}
          <div
            className="process-line"
            style={{
              display: "none",
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "2px",
              background: `linear-gradient(180deg, ${colors.dorado} 0%, transparent 100%)`,
              transform: "translateX(-50%)",
            }}
          />

          {/* Pasos */}
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="process-step"
              style={{
                background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
                border: `1px solid ${colors.rule}`,
                borderRadius: "8px",
                padding: spacing.lg,
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Número */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  background: colors.dorado,
                  color: colors.negro,
                  borderRadius: "50%",
                  fontFamily: typography.fontSerif,
                  fontSize: "24px",
                  fontWeight: 700,
                  marginBottom: spacing.md,
                }}
              >
                {step.number}
              </div>

              {/* Icono Lucide */}
              <div
                style={{
                  marginBottom: spacing.sm,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.dorado,
                }}
              >
                {step.icon}
              </div>

              {/* Contenido */}
              <h3
                style={{
                  fontFamily: typography.fontSerif,
                  fontSize: "20px",
                  color: colors.txCrema,
                  marginBottom: spacing.sm,
                  fontVariationSettings: '"wght" 600',
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.txMedio,
                  lineHeight: "1.6",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Dato destacado */}
        <div
          style={{
            marginTop: spacing.xxxl,
            background: `linear-gradient(135deg, ${colors.verdeOliva} 0%, transparent 100%)`,
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
            <strong style={{ color: colors.dorado }}>De la rama a la prensa, sin demora:</strong> minimizamos el tiempo entre
            cosecha y molturación para preservar los polifenoles y aromas naturales del Picual de montaña.
          </p>
        </div>
      </div>
    </section>
  );
}
