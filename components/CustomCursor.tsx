"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor decorativo — solo dispositivos con puntero real (hover: hover).
 * Nunca sustituye el cursor nativo en touch, y no atrapa el foco de teclado.
 *
 * La posición se actualiza por JS en cada frame/evento vía transform en un
 * contenedor SIN transición (debe seguir al ratón al instante). El
 * crecimiento al pasar sobre elementos activos vive en un hijo interno
 * aparte, con su propia transición de transform: scale() — así el punto/
 * anillo no "flotan" detrás del cursor real (si transform tuviera
 * transition en el mismo elemento que la posición, cada movimiento de
 * ratón se animaría con easing en vez de seguirlo al instante, dando la
 * sensación de un cursor lento que de repente da un salto).
 */
export default function CustomCursor() {
  const dotOuterRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let ringX = 0;
    let ringY = 0;
    let isActive = false;
    let raf = 0;

    const applyActive = (active: boolean) => {
      if (dotInnerRef.current) {
        dotInnerRef.current.style.transform = `scale(${active ? 2 : 1})`;
      }
      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = `scale(${active ? 16 / 9 : 1})`;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (dotOuterRef.current) {
        dotOuterRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const active = target.closest("a, button, [data-cursor-active]");
      isActive = Boolean(active);
      document.body.classList.toggle("cur-active", isActive);
      applyActive(isActive);
    };

    const loop = () => {
      if (ringOuterRef.current) {
        ringOuterRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
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
        id="custom-cursor-dot"
        ref={dotOuterRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2 w-2 pointer-fine:block"
      >
        <div
          ref={dotInnerRef}
          className="h-full w-full rounded-full bg-ambar transition-[transform,background-color] duration-200 [.cur-active_&]:bg-white"
        />
      </div>
      <div
        id="custom-cursor-ring"
        ref={ringOuterRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-9 w-9 pointer-fine:block"
      >
        <div
          ref={ringInnerRef}
          className="h-full w-full rounded-full border border-dorado/50 transition-[transform,border-color] duration-200 [.cur-active_&]:border-dorado/25"
        />
      </div>
    </>
  );
}
