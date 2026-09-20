"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Una aceituna que va "saltando" de imagen en imagen y de título en
 * título a medida que entran en el centro de la pantalla — no se
 * desliza en continuo, da un salto (con rebote) cada vez que cambia
 * el elemento que está protagonizando la vista.
 *
 * Todo funciona por IntersectionObserver (dispara solo cuando cambia
 * qué elemento está centrado), no por un listener de scroll continuo
 * ni por ningún requestAnimationFrame en bucle — el salto en sí lo
 * anima una transición CSS normal.
 */
export default function OliveGuide() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const landmarks = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main [role="img"], main h1, main h2, main h3'
      )
    );
    if (landmarks.length === 0) return;

    const visible = new Set<HTMLElement>();

    const moveTo = (el: HTMLElement) => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = el.getBoundingClientRect();
      const iconSize = 34;
      const margin = 16;

      // Prioriza el lado con más hueco libre fuera del propio elemento
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      const x =
        spaceRight > iconSize + margin * 2
          ? rect.right + margin
          : spaceLeft > iconSize + margin * 2
          ? rect.left - iconSize - margin
          : window.innerWidth - iconSize - margin; // último recurso: margen derecho de la ventana

      const y = rect.top + rect.height / 2 - iconSize / 2;

      outer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
        // De entre lo que está cruzando el centro ahora mismo, salta al
        // primero en el orden del documento (arriba del todo visible).
        const current = landmarks.find((el) => visible.has(el));
        if (current) moveTo(current);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    landmarks.forEach((el) => observer.observe(el));

    const onResize = () => {
      const current = landmarks.find((el) => visible.has(el));
      if (current) moveTo(current);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
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
          transition: transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1);
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
