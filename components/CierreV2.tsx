"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function CierreV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Animate title por carácter — una sola vez, siempre completa
      // "words" además de "chars": sin agrupar por palabras, en pantallas
      // estrechas el navegador podía cortar la línea a mitad de palabra
      // ("Cooper / ativa.").
      const splitTitle = new SplitText(titleRef.current, { type: "words,chars" });

      gsap.from(splitTitle.chars, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 20,
        stagger: 0.03,
        duration: 0.6,
        ease: motion.easeDivine,
      });

      // Fade in de la sección
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        opacity: 0,
        duration: 0.8,
        ease: motion.easeDivine,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cooperativa"
      ref={sectionRef}
      className="cierre-bg relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-6"
      style={{
        backgroundImage: "url(/images/cierre/cosecha-manos-olivas.webp)",
        backgroundSize: "cover",
        backgroundPosition: "70% 55%",
        backgroundColor: colors.negro,
      }}
      role="img"
      aria-label="Agricultor de la cooperativa recogiendo aceitunas a mano"
    >
      {/* En móvil, "cover" sobre una foto panorámica dentro de una sección
          tan alta (con toda la tarjeta de texto) solo deja ver ~18% del
          ancho de la foto, y el sujeto (manos + aceitunas) quedaba fuera.
          Aquí la foto se escala al ancho de la pantalla para verse entera,
          como una banda arriba con degradado hacia el fondo oscuro, y la
          tarjeta empieza justo debajo, solapando un poco el degradado. */}
      <style>{`
        @media (max-width: 767px) {
          .cierre-bg {
            min-height: 0 !important;
            align-items: flex-start !important;
            padding-top: calc(54.55vw - 16px) !important;
            padding-bottom: 72px !important;
            background-size: 100% auto !important;
            background-position: center top !important;
            background-repeat: no-repeat !important;
          }
          .cierre-bg::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: calc(54.55vw - 88px);
            height: 88px;
            background: linear-gradient(180deg, rgba(6, 13, 3, 0) 0%, #060d03 100%);
            z-index: 1;
            pointer-events: none;
          }
        }
      `}</style>
      {/* Overlay cinematográfico */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${colors.doradoSuave} 0%, transparent 70%), linear-gradient(180deg, rgba(6, 13, 3, 0.4) 0%, rgba(45, 74, 43, 0.3) 100%)`,
          opacity: 0.6,
        }}
      />

      <div
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, rgba(6, 13, 3, 0.75) 100%)`,
          border: `1px solid ${colors.rule}`,
          borderRadius: "12px",
          padding: "clamp(24px, 6vw, 80px)",
        }}
      >
        {/* Título épico */}
        <h2
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(36px, 6vw, 68px)",
            color: colors.txCrema,
            lineHeight: "1.25",
            marginBottom: spacing.lg,
            fontVariationSettings: '"wght" 600',
            wordBreak: "keep-all",
            overflowWrap: "normal",
            whiteSpace: "normal",
            textShadow: "0 4px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          Compra Directo. Apoya la Cooperativa.
        </h2>

        {/* Subtítulo */}
        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "18px",
            color: colors.txMedio,
            lineHeight: "1.7",
            marginBottom: spacing.xxl,
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.7)",
          }}
        >
68 años vendiendo directo, desde antes de que "comprar directo" fuera una tendencia. 200 familias, un aceite, cero intermediarios. Cuando compras aquí, tu dinero llega a quien realmente lo cultivó — no se queda repartido por el camino.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: spacing.lg,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: spacing.xl,
          }}
        >
          <button
            onClick={() =>
              document
                .querySelector("#formulario-contacto")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "14px 32px",
              backgroundColor: colors.dorado,
              color: colors.negro,
              border: "none",
              fontFamily: typography.fontSans,
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px",
              transition: `all ${motion.durationPress}ms ${motion.easeResponsive}`,
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.08,
                boxShadow: `0 12px 32px rgba(200, 150, 30, 0.3)`,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { scale: 1, boxShadow: "none" });
            }}
            onMouseDown={(e) => {
              gsap.to(e.currentTarget, {
                scale: 0.97,
                duration: motion.durationPress / 1000,
                overwrite: "auto",
              });
            }}
            onMouseUp={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.08,
                duration: motion.durationPress / 1000,
                overwrite: "auto",
              });
            }}
          >
            Solicitar Presupuesto
          </button>

          <a
            href={`https://wa.me/34620022801?text=${encodeURIComponent(
              "Hola, me gustaría más información sobre vuestro aceite."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 32px",
              backgroundColor: "transparent",
              color: colors.dorado,
              border: `2px solid ${colors.dorado}`,
              fontFamily: typography.fontSans,
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px",
              textDecoration: "none",
              transition: `all ${motion.durationPress}ms ${motion.easeResponsive}`,
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                backgroundColor: colors.dorado,
                color: colors.negro,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                backgroundColor: "transparent",
                color: colors.dorado,
                transform: "scale(1)",
              });
            }}
            onMouseDown={(e) => {
              gsap.to(e.currentTarget, {
                scale: 0.97,
                duration: motion.durationPress / 1000,
                overwrite: "auto",
              });
            }}
            onMouseUp={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: motion.durationPress / 1000,
                overwrite: "auto",
              });
            }}
          >
            Escríbenos por WhatsApp
          </a>
        </div>

        {/* Info de contacto */}
        <div
          style={{
            borderTop: `1px solid ${colors.rule}`,
            paddingTop: spacing.lg,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
            gap: spacing.lg,
            fontSize: "14px",
            color: colors.txMedio,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
                color: colors.dorado,
                marginBottom: "4px",
              }}
            >
              Email
            </div>
            <a
              href="mailto:info@dehesapenolite.com"
              style={{
                color: colors.txMedio,
                textDecoration: "none",
                transition: `color 300ms ${motion.easeSmooth}, filter 300ms ${motion.easeSmooth}`,
                position: "relative",
                borderBottom: `1px solid ${colors.dorado}`,
                paddingBottom: "4px",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  color: colors.dorado,
                  filter: "blur(0px)",
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  color: colors.txMedio,
                  filter: "blur(0px)",
                  duration: 0.3,
                });
              }}
            >
              info@dehesapenolite.com
            </a>
          </div>

          <div>
            <div
              style={{
                fontWeight: 600,
                color: colors.dorado,
                marginBottom: "4px",
              }}
            >
              Teléfono
            </div>
            <a
              href="tel:+34953435316"
              style={{
                color: colors.txMedio,
                textDecoration: "none",
                transition: `color 300ms ${motion.easeSmooth}, filter 300ms ${motion.easeSmooth}`,
                position: "relative",
                borderBottom: `1px solid ${colors.dorado}`,
                paddingBottom: "4px",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  color: colors.dorado,
                  filter: "blur(0px)",
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  color: colors.txMedio,
                  filter: "blur(0px)",
                  duration: 0.3,
                });
              }}
            >
              +34 953 435 316
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
