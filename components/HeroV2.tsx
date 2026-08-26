"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { colors, motion, typography } from "@/lib/design-tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function HeroV2() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current) return;

    const ctx = gsap.context(() => {
      // Animar título por palabras
      const splitTitle = new SplitText(titleRef.current, { type: "words" });

      // Timeline del hero: entrada + transición por scroll
      const tl = gsap.timeline();

      // Entrada: título aparece palabra por palabra
      tl.from(
        splitTitle.words,
        {
          duration: 0.6,
          opacity: 0,
          y: 20,
          stagger: 0.08,
          ease: motion.easeDivine,
        },
        0
      );

      // Subtítulo entra después
      tl.from(
        subtitleRef.current,
        {
          duration: 0.8,
          opacity: 0,
          y: 16,
          ease: motion.easeDivine,
        },
        "-=0.3"
      );

      // Scroll trigger para la transición del hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1.2,
        onUpdate: (self) => {
          // Asignación directa de estilo en vez de crear un tween nuevo por
          // cada frame de scroll: scrub ya suaviza self.progress, así que
          // gsap.to() aquí solo añadía creación/cancelación de tweens en
          // cada tick y provocaba tirones al hacer scroll.
          if (!titleRef.current || !subtitleRef.current) return;
          const easedProgress = gsap.parseEase("power2.inOut")(self.progress);
          const weight = gsap.utils.interpolate(400, 700, easedProgress);
          titleRef.current.style.fontVariationSettings = `"opsz" ${400 + self.getVelocity() * 0.1}, "wght" ${weight}`;
          subtitleRef.current.style.opacity = String(1 - self.progress * 0.5);
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero/olivares-amanecer.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay cinematográfico */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, rgba(6, 13, 3, 0.55) 0%, rgba(6, 13, 3, 0.7) 45%, rgba(6, 13, 3, 0.55) 100%)`,
        }}
      />

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div
          className="inline-block mb-6"
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: colors.dorado,
            opacity: 0.7,
          }}
        >
          Sierra de Segura · Desde 1958
        </div>

        {/* Title con variable font */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(48px, 9vw, 120px)",
            lineHeight: "1.1",
            color: colors.txCrema,
            margin: "20px 0 24px",
            fontVariationSettings: '"opsz" 400, "wght" 400',
            textShadow: "0 4px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          500 Familias. Cero Intermediarios.
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: typography.fontSans,
            fontSize: "clamp(16px, 2.5vw, 24px)",
            color: colors.txMedio,
            fontWeight: 300,
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.6",
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.7)",
          }}
        >
          Aceite Picual 100%, directo de la cooperativa que lo cultiva. Sin nadie de por medio que suba el precio o baje la calidad.
        </p>

        {/* CTA Hero */}
        <div style={{ marginTop: "48px" }}>
          <button
            onClick={() =>
              document
                .querySelector("#productos")
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
              borderRadius: "2px",
              transition: `all ${motion.durationPress}ms ${motion.easeResponsive}`,
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.08,
                boxShadow: `0 12px 32px rgba(200, 150, 30, 0.3)`,
                duration: 0.3,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow: "none",
                duration: 0.3,
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
                scale: 1.08,
                duration: motion.durationPress / 1000,
                overwrite: "auto",
              });
            }}
          >
            Ver Nuestros Precios
          </button>
        </div>
      </div>

      {/* Línea decorativa de scroll */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: colors.dorado,
          opacity: 0.5,
          animation: "pulse 2s infinite",
        }}
      >
        Desplaza para continuar
      </div>
    </section>
  );
}
