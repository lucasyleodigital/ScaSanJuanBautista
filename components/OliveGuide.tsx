"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Una aceituna que acompaña al lector mientras baja por la web,
 * cruzando de un lado a otro (como si flotara entre los títulos) en
 * vez de subir en línea recta por el margen — busca guiar la mirada,
 * no solo marcar el progreso.
 *
 * La posición (JS, ligada al scroll) y el balanceo de flotación en
 * reposo (CSS puro) viven en DOS elementos separados a propósito: si
 * compartieran el mismo transform, se pisarían entre sí. El listener
 * de scroll no usa ningún requestAnimationFrame en bucle de fondo —
 * solo se recalcula cuando hay un evento de scroll real (mismo patrón
 * que ScrollProgress).
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

      const viewportH = window.innerHeight;
      const travelY = viewportH - 64; // deja margen arriba/abajo (tamaño del icono)
      const y = 32 + pct * travelY;

      // Cruza de un lado a otro de la página según se avanza el scroll
      // (2 idas y vueltas completas), pero solo si hay hueco de sobra
      // fuera del contenido central — si no, se queda en el margen
      // derecho de siempre para no tapar nunca el texto.
      const vw = window.innerWidth;
      const iconSize = 34;
      const margin = 20;
      const rightX = vw - margin - iconSize;
      const hasGutters = vw > 1440;
      let x = rightX;
      if (hasGutters) {
        const leftX = margin;
        const swing = (Math.sin(pct * Math.PI * 2.4) + 1) / 2; // 0..1
        x = rightX + (leftX - rightX) * swing;
      }

      const deltaY = window.scrollY - lastY;
      lastY = window.scrollY;
      const tilt = Math.max(-18, Math.min(18, deltaY * 0.6));

      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
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
      className="pointer-events-none fixed top-0 left-0 z-[1999] hidden md:block"
      style={{ willChange: "transform" }}
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
