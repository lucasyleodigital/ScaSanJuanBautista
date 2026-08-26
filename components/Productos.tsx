"use client";

import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import Reveal from "./Reveal";

const PRODUCTOS = [
  {
    badge: "Formato familia",
    name: "Botella 2 Litros",
    desc: "El formato ideal para el consumo diario en el hogar. Caja de 6 botellas. El aceite que las familias de Peñolite llevan en su mesa desde hace generaciones.",
    specs: [
      ["Formato", "2 L / botella"],
      ["Unidades por caja", "6 botellas"],
      ["Variedad", "Picual 100%"],
      ["Categoría", "Virgen Extra"],
    ],
    span: "md:col-span-7",
  },
  {
    badge: "Formato hostelería",
    name: "Botella 5 Litros",
    desc: "El formato elegido por la hostelería y los grandes consumidores. Caja de 3 botellas. Calidad certificada para quienes necesitan volumen sin renunciar a la excelencia.",
    specs: [
      ["Formato", "5 L / botella"],
      ["Unidades por caja", "3 botellas"],
      ["Variedad", "Picual 100%"],
      ["Categoría", "Virgen Extra"],
    ],
    span: "md:col-span-5",
  },
];

/**
 * Capítulo 4 — bento asimétrico (7/5, no 6/6): la botella de 2L, la de
 * mayor rotación, ocupa más peso visual. Tilt magnético con física real
 * (Motion springs), no transform:scale.
 */
export default function Productos() {
  return (
    <section id="productos" className="relative bg-verde-noche text-tx-crema">
      <div className="mx-auto max-w-[1100px] px-6 py-24 md:px-10">
        <Reveal as="span" className="mb-4 block font-sans text-[9px] tracking-[0.35em] text-dorado uppercase">
          — Capítulo 03 —
        </Reveal>
        <Reveal as="h2" className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.15]">
          Dos formatos,
          <br />
          un solo aceite
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-base leading-relaxed text-tx-medio">
          Virgen Extra Picual 100%, D.O. Sierra de Segura. El mismo aceite
          que los socios llevan a su mesa, ahora disponible para quien sepa
          apreciarlo.
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
          {PRODUCTOS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12} className={p.span}>
              <ProductCard {...p} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-tx-bajo italic">
          Los pedidos se gestionan directamente con la cooperativa.
          Contáctenos para precios actuales y disponibilidad de campaña.
        </p>
      </div>
    </section>
  );
}

function ProductCard({
  badge,
  name,
  desc,
  specs,
}: (typeof PRODUCTOS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 20 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      data-cursor-active
      className="h-full border border-dorado/18 bg-white/[0.03] p-9 backdrop-blur-md transition-colors hover:border-dorado/40"
    >
      <span className="mb-6 inline-block border border-dorado/40 px-3 py-1 font-sans text-[8.5px] tracking-[0.25em] text-dorado uppercase">
        {badge}
      </span>
      <h3 className="mb-2 font-serif text-[22px] text-tx-crema">{name}</h3>
      <p className="mb-6 text-[13px] leading-relaxed text-tx-medio">{desc}</p>
      <div className="mb-8 flex flex-col gap-2 border-t border-rule pt-5">
        {specs.map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="tracking-[0.08em] text-tx-bajo">{k}</span>
            <span className="text-tx-crema tabular-nums">{v}</span>
          </div>
        ))}
      </div>
      <a
        href="#pedido"
        className="group relative block overflow-hidden border border-dorado/40 py-3 text-center font-sans text-[10px] tracking-[0.2em] text-dorado uppercase transition-colors duration-350 hover:text-negro"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-dorado transition-transform duration-350 ease-[cubic-bezier(.83,0,.17,1)] group-hover:scale-y-100" />
        <span className="relative">Solicitar información</span>
      </a>
    </motion.div>
  );
}
