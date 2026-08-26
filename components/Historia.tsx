"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Reveal from "./Reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HITOS = [
  {
    year: "1958",
    head: "Fundación",
    text: "El 23 de julio, un grupo de familias agricultoras de Peñolite une sus fuerzas y constituye la cooperativa.",
  },
  {
    year: "1970s",
    head: "Crecimiento",
    text: "La cooperativa crece rápidamente. Más familias de la comarca se incorporan como socios.",
  },
  {
    year: "1990s",
    head: "Embotellado propio",
    text: "Comienza a embotellar su propio aceite bajo nombre propio, el primer paso hacia la venta directa.",
  },
  {
    year: "2008",
    head: "D.O. Sierra de Segura",
    text: "El aceite obtiene la Denominación de Origen más antigua del aceite español.",
  },
  {
    year: "2024",
    head: "Doble D.O.",
    text: "Se suma la D.O. Aceite de Jaén: dos de las certificaciones más exigentes del mundo.",
  },
  {
    year: "2026",
    head: "Primera web",
    text: "Por primera vez en 66 años, el aceite de Peñolite llega a quien lo busca.",
    highlight: true,
  },
];

/**
 * Capítulo 2 — 66 años no se leen, se recorren: el scroll vertical avanza
 * una timeline horizontal mientras la sección queda pineada. Se libera al
 * llegar a 2026. Con reduced-motion o en móvil, cae a una cuadrícula
 * estática normal — la misma información, sin el gesto de scroll.
 */
export default function Historia() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();
  const pinned = isDesktop && !reducedMotion;

  useEffect(() => {
    if (!pinned || !pinRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const distance = track.scrollWidth - window.innerWidth;
    if (distance <= 0) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: () => `+=${distance}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(track, { x: -distance * self.progress });
        },
      });
      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [pinned]);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative bg-verde-noche text-tx-crema"
    >
      <div className="mx-auto max-w-[1100px] px-6 pt-24 md:px-10">
        <Reveal as="span" className="mb-4 block font-sans text-[9px] tracking-[0.35em] text-dorado uppercase">
          — Capítulo 01 —
        </Reveal>
        <Reveal as="h2" className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.15] text-tx-crema">
          Seis décadas
          <br />
          enraizadas en la tierra
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mt-6 max-w-xl text-base leading-relaxed text-tx-medio"
        >
          Lo que empezó como la unión de unas pocas familias de agricultores
          en Peñolite se convirtió en el corazón económico y social de todo
          un pueblo. Hoy, más de 500 socios comparten la misma filosofía:
          hacer el mejor aceite posible, con respeto por la tradición y la
          tierra que lo produce.
        </Reveal>
      </div>

      {pinned ? (
        <div ref={pinRef} className="mt-16 h-screen overflow-hidden">
          <div className="flex h-full items-center">
            <div ref={trackRef} className="flex gap-24 pr-[40vw] pl-10 md:pl-24">
              {HITOS.map((h) => (
                <HitoCard key={h.year} {...h} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-x-8 gap-y-10 px-6 py-16 sm:grid-cols-3 md:px-10">
          {HITOS.map((h) => (
            <Reveal key={h.year}>
              <HitoCard {...h} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function HitoCard({
  year,
  head,
  text,
  highlight,
}: {
  year: string;
  head: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div className="w-[260px] shrink-0">
      <div
        className={`mb-6 h-2.5 w-2.5 rounded-full ${
          highlight ? "bg-ambar shadow-[0_0_0_4px_rgba(232,184,64,.3)]" : "bg-dorado shadow-[0_0_0_4px_rgba(200,150,30,.2)]"
        }`}
      />
      <div
        className={`mb-2 font-sans text-[11px] tracking-[0.2em] ${highlight ? "text-ambar" : "text-dorado"}`}
      >
        {year}
      </div>
      <div className={`mb-1.5 font-serif text-lg ${highlight ? "text-ambar" : "text-tx-crema"}`}>
        {head}
      </div>
      <div className="text-[13px] leading-relaxed text-tx-medio">{text}</div>
    </div>
  );
}
