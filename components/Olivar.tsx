"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import Reveal from "./Reveal";
import { isReducedMotion } from "@/hooks/useReducedMotion";

const DATOS = [
  { num: "840m", lab: "Altitud" },
  { num: "Picual", lab: "Variedad 100%" },
  { num: "D.O.", lab: "Sierra de Segura" },
  { num: "Nov–Ene", lab: "Campaña cosecha" },
];

/**
 * Capítulo 3 — el territorio antes que el producto. La entrada usa un
 * curtain-reveal (clip-path) para marcar el corte de "pasado" (Historia,
 * verde noche) a "presente" (Olivar, crema) — un cambio de tema, no
 * movimiento decorativo. El parallax de la imagen es sutil y se apaga con
 * reduced-motion.
 */
export default function Olivar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !curtainRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        curtainRef.current,
        { clipPath: "inset(0 0 0 0)" },
        {
          clipPath: "inset(0 0 0 100%)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      if (imgWrapRef.current) {
        gsap.to(imgWrapRef.current.querySelector("img"), {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="olivar"
      ref={sectionRef}
      className="relative bg-crema text-tx-oscuro"
    >
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 bg-verde-noche"
      />
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-2 md:gap-16 md:px-10">
        <div>
          <Reveal as="span" className="mb-4 block font-sans text-[9px] tracking-[0.35em] text-verde-oliva uppercase">
            — Capítulo 02 —
          </Reveal>
          <Reveal as="h2" className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.15] text-tx-oscuro">
            El territorio que
            <br />
            da sabor al aceite
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-base leading-relaxed text-tx-medio-osc">
            Peñolite se alza a 840 metros sobre el nivel del mar, en el
            corazón de la Sierra de Segura. A esa altitud, las aceitunas
            maduran más despacio, concentran más polifenoles y producen un
            aceite con carácter propio: frutado intenso, amargo elegante,
            picante persistente.
          </Reveal>
          <Reveal as="p" delay={0.2} className="mt-4 max-w-lg text-base leading-relaxed text-tx-medio-osc">
            La variedad Picual — la reina de Jaén — prospera aquí como en
            ningún otro lugar. Resistente, robusta, capaz de dar un aceite
            excepcional incluso en años difíciles.
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {DATOS.map((d, i) => (
              <Reveal key={d.lab} delay={i * 0.1}>
                <div className="border-l-[3px] border-dorado bg-pergamino p-5">
                  <div className="font-serif text-[28px] text-verde-oliva">{d.num}</div>
                  <div className="mt-1 text-[11px] tracking-[0.12em] text-tx-medio-osc uppercase">
                    {d.lab}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="relative aspect-[4/3] overflow-hidden">
          <div ref={imgWrapRef} className="absolute inset-0 h-[116%] -top-[8%]">
            <Image
              src="/images/dehesa-penolite-lg.jpg"
              alt="Vista de los olivares de Peñolite en la Sierra de Segura, con el pueblo al fondo"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
