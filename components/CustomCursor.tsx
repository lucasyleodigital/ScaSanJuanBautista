"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAudio } from "./AudioEngine";

export default function CustomCursor() {
  const dotOuterRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const { playHover } = useAudio();
  // El anillo exterior no encaja en un panel de administración: se queda
  // solo el punto, que es un cursor normal y no distrae.
  const pathname = usePathname();
  const showRing = !pathname?.startsWith("/panel-eva");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let ringX = 0;
    let ringY = 0;
    let currentRingX = 0;
    let currentRingY = 0;
    let isActive = false;
    let raf = 0;
    let lastHoveredElem: Element | null = null;

    const applyActive = (active: boolean, text?: string, compact?: boolean) => {
      if (dotInnerRef.current) {
        const scale = !active ? 1 : text ? 0 : compact ? 1.3 : 2.5;
        dotInnerRef.current.style.transform = `scale(${scale})`;
      }
      if (ringInnerRef.current) {
        const scale = !active ? 1 : text ? 2.8 : compact ? 1.15 : 1.8;
        ringInnerRef.current.style.transform = `scale(${scale})`;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (dotOuterRef.current) {
        dotOuterRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const active = target.closest("a, button, [data-cursor-active], [data-cursor]");
      
      if (active && active !== lastHoveredElem) {
        lastHoveredElem = active;
        playHover();
      } else if (!active) {
        lastHoveredElem = null;
      }

      isActive = Boolean(active);
      const text = active?.getAttribute("data-cursor") || "";
      const compact = active?.hasAttribute("data-cursor-compact") ?? false;
      setCursorText(text);

      document.body.classList.toggle("cur-active", isActive);
      applyActive(isActive, text, compact);
    };

    const loop = () => {
      // Smooth LERP movement for ring
      currentRingX += (ringX - currentRingX) * 0.15;
      currentRingY += (ringY - currentRingY) * 0.15;

      if (ringOuterRef.current) {
        ringOuterRef.current.style.transform = `translate3d(${currentRingX}px, ${currentRingY}px, 0) translate(-50%, -50%)`;
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
  }, [playHover]);

  return (
    <>
      <div
        id="custom-cursor-dot"
        ref={dotOuterRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2.5 w-2.5 pointer-fine:block"
      >
        <div
          ref={dotInnerRef}
          className="h-full w-full rounded-full bg-dorado shadow-[0_0_12px_rgba(200,150,30,0.8)] transition-[transform,background-color] duration-200 [.cur-active_&]:bg-amber-300"
        />
      </div>

      {showRing && (
        <div
          id="custom-cursor-ring"
          ref={ringOuterRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-10 w-10 pointer-fine:block"
        >
          <div
            ref={ringInnerRef}
            className="relative flex h-full w-full items-center justify-center rounded-full border border-dorado/60 bg-dorado/5 backdrop-blur-[2px] transition-[transform,border-color,background-color] duration-300 [.cur-active_&]:border-dorado [.cur-active_&]:bg-dorado/20"
          >
            {cursorText && (
              <span
                ref={labelRef}
                className="px-1 text-[9px] font-bold tracking-widest text-tx-crema uppercase animate-fade-in"
              >
                {cursorText}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

