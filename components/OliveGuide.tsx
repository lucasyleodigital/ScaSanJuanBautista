"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Una aceituna que acompaña al lector mientras baja por la web, a modo
 * de guía discreta — no es solo decoración, marca visualmente cuánto
 * queda de página.
 *
 * Igual que ScrollProgress: todo se recalcula dentro del propio
 * listener de "scroll" (pasivo), sin ningún requestAnimationFrame
 * corriendo en segundo plano. Solo transform (posición + rotación +
 * balanceo lateral), nunca top/left directamente, para que el
 * navegador no tenga que recalcular layout en cada scroll.
 */
export default function OliveGuide() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;

      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? window.scrollY / max : 0;

      const viewport = window.innerHeight;
      const travel = viewport - 64; // deja margen arriba/abajo (tamaño del icono)
      const y = 32 + pct * travel;

      const deltaY = window.scrollY - lastY;
      lastY = window.scrollY;
      const tilt = Math.max(-18, Math.min(18, deltaY * 0.6));
      const wobble = Math.sin(pct * Math.PI * 10) * 4;

      el.style.transform = `translate3d(${wobble}px, ${y}px, 0) rotate(${tilt}deg)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 z-[1999] hidden md:block"
      style={{ right: "18px", willChange: "transform" }}
    >
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <ellipse cx="17" cy="19" rx="10" ry="13" fill="#5B6B2E" />
        <ellipse cx="13.5" cy="14" rx="3" ry="4" fill="#7A8F3E" opacity="0.7" />
        <path
          d="M17 6C17 6 20 2 25 3C25 3 24 8 19 8.5"
          fill="#3F5A2A"
          stroke="#3F5A2A"
        />
        <ellipse cx="20.5" cy="5.5" rx="4.5" ry="2.3" fill="#6B8F3E" transform="rotate(-25 20.5 5.5)" />
      </svg>
    </div>
  );
}
