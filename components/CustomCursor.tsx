"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor decorativo — solo dispositivos con puntero real (hover: hover).
 * Nunca sustituye el cursor nativo en touch, y no atrapa el foco de teclado.
 *
 * El crecimiento al pasar sobre elementos activos se hace con
 * transform: scale() (no width/height): animar width/height fuerza layout
 * en cada fotograma — Chrome lo marca como Layout Shift en Speed Insights.
 * Como la posición también se fija por JS vía transform, la escala se
 * combina en la misma cadena de transform para no pisarse entre sí.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let ringX = 0;
    let ringY = 0;
    let isActive = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (dotRef.current) {
        const scale = isActive ? 2 : 1;
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(${scale})`;
      }
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const active = target.closest("a, button, [data-cursor-active]");
      isActive = Boolean(active);
      document.body.classList.toggle("cur-active", isActive);
    };

    const loop = () => {
      if (ringRef.current) {
        const scale = isActive ? 16 / 9 : 1;
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(loop);
    };

    document.body.style.cursor = "none";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2 w-2 rounded-full bg-ambar transition-[transform,background-color] duration-200 [.cur-active_&]:bg-white pointer-fine:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-9 w-9 rounded-full border border-dorado/50 transition-[transform,border-color] duration-200 [.cur-active_&]:border-dorado/25 pointer-fine:block"
      />
    </>
  );
}
