"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Grano cinematográfico — decoración pura, sin significado narrativo.
 * También actúa como dither para evitar el banding en los degradados
 * oscuros de la web (por eso no se puede quitar del todo).
 *
 * Importante: el ruido se aplica en MOSAICO a su tamaño real (128px),
 * nunca estirado a pantalla completa — estirar un lienzo pequeño con
 * imageRendering:pixelated convierte cada píxel de ruido en un bloque
 * grande y visible ("pixelado"), justo lo contrario de un dither fino.
 * En mosaico, cada mota de ruido mide 1 píxel real, que es lo que
 * realmente rompe el banding sin verse como bloques.
 *
 * El cambio de frame se hace escribiendo backgroundImage directamente
 * en el DOM (nunca vía useState/re-render de React) — mismo motivo que
 * en FloatingParticles/OliveGuide: esto corre sin parar durante toda
 * la sesión, así que tiene que ser lo más barato posible.
 */
export default function GrainOverlay() {
  const divRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Precalcular un puñado de frames de ruido UNA sola vez y ciclar entre
    // ellos, en vez de generar 16.384 píxeles aleatorios de nuevo en cada
    // actualización para siempre — eso corría continuamente en el hilo
    // principal durante toda la sesión y competía con el scroll/cursor.
    const FRAME_COUNT = 8;
    const frames: string[] = [];
    for (let f = 0; f < FRAME_COUNT; f++) {
      const imageData = ctx.createImageData(size, size);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 90;
      }
      ctx.putImageData(imageData, 0, 0);
      frames.push(`url(${canvas.toDataURL("image/png")})`);
    }

    const el = divRef.current;
    if (el) el.style.backgroundImage = frames[0];

    let raf = 0;
    let frame = 0;
    let idx = 0;

    const draw = () => {
      frame++;
      if (frame % 3 === 0) {
        idx = (idx + 1) % FRAME_COUNT;
        if (el) el.style.backgroundImage = frames[idx];
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      id="grain-overlay"
      ref={divRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.05]"
      style={{
        backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}
