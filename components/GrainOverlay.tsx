"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Grano cinematográfico — decoración pura, sin significado narrativo.
 * Se oculta bajo prefers-reduced-motion, salvo que ?motion=on lo fuerce.
 */
export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 128;
    canvas.width = size;
    canvas.height = size;

    let raf = 0;
    let frame = 0;

    const draw = () => {
      frame++;
      if (frame % 3 === 0) {
        const imageData = ctx.createImageData(size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = Math.random() * 255;
          imageData.data[i] = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 22;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      id="grain-overlay"
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] h-full w-full opacity-[0.06]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
