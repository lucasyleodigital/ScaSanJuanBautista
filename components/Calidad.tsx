"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

const CERTS = [
  {
    label: "D.O. Sierra de Segura",
    num: "Cert. CA-02-013/25",
    detail:
      "La D.O. más antigua para aceite de oliva en España. Garantiza origen, variedad y proceso. Válida hasta julio de 2030.",
  },
  {
    label: "D.O. Aceite de Jaén",
    num: "Cert. CA-04-044/25",
    detail:
      "La denominación provincial que ampara los mejores aceites de la provincia olivarera más productiva del mundo. Válida hasta mayo de 2028.",
  },
];

/**
 * Capítulo 5 — la calidad se demuestra con papel: cada sello "estampa" al
 * entrar en viewport (keyframe seal-stamp en globals.css), metáfora visual
 * directa de una certificación oficial. Con reduced-motion los sellos
 * aparecen ya estampados, sin el gesto.
 */
export default function Calidad() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".cert-card"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            window.setTimeout(() => card.classList.add("stamped"), i * 150);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.35 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="calidad" className="relative bg-negro px-6 py-20 md:px-10">
      <div className="mx-auto max-w-[1100px] text-center">
        <Reveal as="span" className="mb-3 block font-sans text-[9px] tracking-[0.35em] text-dorado uppercase">
          — Capítulo 04 —
        </Reveal>
        <Reveal as="h2" className="font-serif text-[clamp(24px,4vw,40px)] text-tx-crema">
          Calidad certificada.
          <br />
          No es un eslogan, es un papel.
        </Reveal>
        <Reveal as="p" delay={0.1} className="mx-auto mt-4 mb-14 max-w-md text-[15px] text-tx-medio">
          Dos de las denominaciones de origen más exigentes de España avalan
          cada botella que sale de Peñolite.
        </Reveal>

        <div ref={gridRef} className="flex flex-wrap justify-center gap-6">
          {CERTS.map((c) => (
            <div
              key={c.label}
              className="cert-card min-w-[220px] max-w-[300px] flex-1 border border-rule bg-dorado-suave p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <ShieldCheck size={44} className="text-dorado" strokeWidth={1.4} />
              </div>
              <div className="mb-1.5 font-serif text-[17px] text-tx-crema">{c.label}</div>
              <div className="mb-3 font-sans text-[10px] tracking-[0.15em] text-dorado">{c.num}</div>
              <div className="text-xs leading-relaxed text-tx-medio">{c.detail}</div>
            </div>
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-12 max-w-[600px] border border-rule bg-dorado-suave p-8">
          <div className="font-serif text-[52px] leading-none text-dorado">≤ 0,5°</div>
          <div className="mt-2 text-xs tracking-[0.1em] text-tx-medio uppercase">
            Acidez máxima
          </div>
        </Reveal>
      </div>
    </section>
  );
}
