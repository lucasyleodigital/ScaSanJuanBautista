"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Una aceituna que va saltando, en orden estricto de arriba a abajo,
 * de un titular de sección al siguiente (Hero → Terroir → Proceso →
 * Producto → Catálogo → Configurador → FAQ → Cierre) — un único punto
 * de parada por capítulo, nunca varios candidatos a la vez, para que
 * el recorrido tenga sintonía real con el orden de la página en vez
 * de parecer aleatorio.
 *
 * En cada scroll (limitado a un cálculo por frame) se elige el titular
 * cuyo centro esté más cerca del centro real de la pantalla — hay
 * siempre exactamente uno "más cercano", así que la progresión es
 * monótona según se baja, sin parpadeos entre candidatos empatados.
 */
export default function OliveGuide() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Un único titular por capítulo — evita ambigüedad entre elementos
    // que comparten casi la misma altura (p. ej. varias tarjetas en fila).
    const landmarks = Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2"));
    if (landmarks.length === 0) return;

    let current: HTMLElement | null = null;
    let ticking = false;

    const moveTo = (el: HTMLElement) => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = el.getBoundingClientRect();
      const iconSize = 34;
      const margin = 16;

      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      const x =
        spaceRight > iconSize + margin * 2
          ? rect.right + margin
          : spaceLeft > iconSize + margin * 2
          ? rect.left - iconSize - margin
          : window.innerWidth - iconSize - margin;

      const y = rect.top + rect.height / 2 - iconSize / 2;
      outer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const update = () => {
      ticking = false;
      const viewportCenter = window.innerHeight / 2;

      let closest: HTMLElement | null = null;
      let closestDist = Infinity;
      for (const el of landmarks) {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = el;
        }
      }

      if (closest && closest !== current) {
        current = closest;
        moveTo(closest);
      }
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
      ref={outerRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[1999] hidden md:block olive-hop"
      style={{ willChange: "transform", transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div className="olive-float">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <ellipse cx="17" cy="19" rx="10" ry="13" fill="#5B6B2E" />
          <ellipse cx="13.5" cy="14" rx="3" ry="4" fill="#7A8F3E" opacity="0.7" />
          <path d="M17 6C17 6 20 2 25 3C25 3 24 8 19 8.5" fill="#3F5A2A" stroke="#3F5A2A" />
          <ellipse cx="20.5" cy="5.5" rx="4.5" ry="2.3" fill="#6B8F3E" transform="rotate(-25 20.5 5.5)" />
        </svg>
      </div>

      <style>{`
        .olive-hop {
          transition: transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes olive-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        .olive-float {
          animation: olive-float 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
