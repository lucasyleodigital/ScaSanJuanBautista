"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor decorativo — solo dispositivos con puntero real (hover: hover).
 * Nunca sustituye el cursor nativo en touch, y no atrapa el foco de teclado.
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
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const active = target.closest("a, button, [data-cursor-active]");
      document.body.classList.toggle("cur-active", Boolean(active));
    };

    const loop = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
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
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2 w-2 rounded-full bg-ambar transition-[width,height] duration-200 [.cur-active_&]:h-4 [.cur-active_&]:w-4 [.cur-active_&]:bg-white pointer-fine:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-9 w-9 rounded-full border border-dorado/50 transition-[width,height,border-color] duration-200 [.cur-active_&]:h-16 [.cur-active_&]:w-16 [.cur-active_&]:border-dorado/25 pointer-fine:block"
      />
    </>
  );
}
