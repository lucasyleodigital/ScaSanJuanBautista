"use client";

import { useEffect, useRef } from "react";

/**
 * Partículas doradas en suspensión — polvo de luz / gotas de aceite
 * ascendiendo lentamente. Decoración pura, sin significado narrativo.
 *
 * Movidas con requestAnimationFrame + estilo inline, NO con
 * animation-duration de CSS: Chrome/Edge, cuando el sistema tiene
 * activado "reducir movimiento", escala las duraciones de las
 * animaciones CSS/Web Animations a prácticamente 0 automáticamente
 * (accesibilidad a nivel de motor de navegador, no algo que el CSS del
 * autor pueda anular). Como este efecto es un movimiento lento y de
 * baja intensidad que no supone un problema de accesibilidad real, se
 * anima con JS puro para que siempre se vea, sea cual sea esa opción.
 *
 * Las posiciones/tamaños usan un pseudo-random determinista (mismo
 * resultado en servidor y cliente) para que el marcado inicial no
 * provoque un hydration mismatch.
 */

function seeded(n: number, decimals = 4): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  const raw = x - Math.floor(x);
  const f = 10 ** decimals;
  return Math.round(raw * f) / f;
}

interface Particle {
  left: number;
  size: number;
  duration: number;
  phase: number;
  opacity: number;
  drift: number;
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.round(seeded(i * 7.31) * 100 * 100) / 100,
    size: Math.round((2 + seeded(i * 3.17) * 4.5) * 100) / 100,
    duration: Math.round((13 + seeded(i * 5.73) * 14) * 100) / 100,
    phase: Math.round(seeded(i * 9.29) * 100) / 100,
    opacity: Math.round((0.22 + seeded(i * 2.11) * 0.4) * 100) / 100,
    drift: Math.round((-30 + seeded(i * 4.47) * 60) * 100) / 100,
  }));
}

export default function FloatingParticles({ count = 22 }: { count?: number }) {
  const particlesRef = useRef<Particle[]>(buildParticles(count));
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = particlesRef.current;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;

      particles.forEach((p, i) => {
        const el = spanRefs.current[i];
        if (!el) return;

        const cycle = p.duration;
        const t = ((elapsed / cycle + p.phase) % 1 + 1) % 1; // 0..1, con fase inicial propia

        const yPercent = -t * 115; // sube hasta -115% de su propia altura de referencia (usamos px vía contenedor)
        const containerHeight = containerRef.current?.clientHeight || 800;
        const y = (yPercent / 100) * containerHeight;
        const x = t * p.drift;

        const fadeIn = Math.min(t / 0.08, 1);
        const fadeOut = Math.min((1 - t) / 0.08, 1);
        const opacity = p.opacity * Math.min(fadeIn, fadeOut);

        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        el.style.opacity = opacity.toFixed(3);
      });

      raf = requestAnimationFrame(tick);
    };

    // Solo animar mientras la sección está visible: sin esto, las
    // partículas de cada sección (Terroir, Catálogo...) seguían corriendo
    // en requestAnimationFrame para siempre aunque estuvieran fuera de
    // pantalla, sumando trabajo continuo de compositor/GC que contribuía
    // a los tirones de scroll.
    const container = containerRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    if (container) io.observe(container);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particlesRef.current.map((p, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: `rgba(200, 150, 30, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(200, 150, 30, ${p.opacity * 0.7})`,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
