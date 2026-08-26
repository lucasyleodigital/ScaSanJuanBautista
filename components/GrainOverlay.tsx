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

    // Precalcular un puñado de frames de ruido UNA sola vez y ciclar entre
    // ellos, en vez de generar 16.384 píxeles aleatorios de nuevo en cada
    // actualización para siempre: eso corría continuamente en el hilo
    // principal durante toda la sesión y competía con el scroll/cursor.
    const FRAME_COUNT = 8;
    const frames: ImageData[] = [];
    for (let f = 0; f < FRAME_COUNT; f++) {
      const imageData = ctx.createImageData(size, size);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 22;
      }
      frames.push(imageData);
    }

    let raf = 0;
    let frame = 0;
    let idx = 0;

    const draw = () => {
      frame++;
      if (frame % 3 === 0) {
        ctx.putImageData(frames[idx], 0, 0);
        idx = (idx + 1) % FRAME_COUNT;
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
