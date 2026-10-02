"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Aceitunas en suspensión — cada una es un SVG diminuto
 * (cuerpo + rabito + hojita) en vez del óvalo CSS anterior, para que
 * se reconozcan de verdad como aceitunas. Decoración pura, sin
 * significado narrativo.
 *
 * Nacen verde oliva y maduran mientras caen, como las de verdad: se
 * mantienen verdes la mayor parte del recorrido y hacia el final viran
 * a morado hasta quedar casi negras (momento en que ya se desvanecen).
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

type RGB = [number, number, number];

// Etapas de maduración del cuerpo y del brillo, de verde a negro-morado.
const BODY_STOPS: RGB[] = [
  [118, 146, 48], // verde oliva
  [98, 54, 108], // morado
  [46, 25, 54], // negro-morado
];
const SHINE_STOPS: RGB[] = [
  [196, 222, 140],
  [176, 142, 196],
  [120, 96, 134],
];

/** 0 = verde, 1 = negro-morado. Verde hasta ~30% de la caída. */
function ripeness(t: number): number {
  const x = Math.min(Math.max((t - 0.3) / 0.65, 0), 1);
  return x * x * (3 - 2 * x);
}

function mixStops(stops: RGB[], k: number): string {
  const scaled = k * (stops.length - 1);
  const i = Math.min(Math.floor(scaled), stops.length - 2);
  const f = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  const c = a.map((v, n) => Math.round(v + (b[n] - v) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
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
    size: Math.round((9 + seeded(i * 3.17) * 7) * 100) / 100,
    duration: Math.round((28 + seeded(i * 5.73) * 26) * 100) / 100,
    phase: Math.round(seeded(i * 9.29) * 100) / 100,
    opacity: Math.round((0.28 + seeded(i * 2.11) * 0.42) * 100) / 100,
    drift: Math.round((-30 + seeded(i * 4.47) * 60) * 100) / 100,
  }));
}

export default function FloatingParticles({
  count = 14,
  mobileCount,
}: {
  count?: number;
  /** Si se indica, en móvil (<768px) se renderizan solo estas — el
   * tamaño/opacidad se aumentan para verse bien en pantalla estrecha,
   * así que menos cantidad evita que se amontonen visualmente. */
  mobileCount?: number;
}) {
  const particlesRef = useRef<Particle[]>(buildParticles(count));
  const spanRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const shineRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

        const yPercent = -15 + t * 130; // cae desde -15% (justo encima) hasta +115% (justo debajo) de la sección
        const containerHeight = containerRef.current?.clientHeight || 800;
        const y = (yPercent / 100) * containerHeight;
        const x = t * p.drift;

        const fadeIn = Math.min(t / 0.08, 1);
        const fadeOut = Math.min((1 - t) / 0.08, 1);
        // Solo el envolvente de aparición/desaparición va aquí: la opacidad
        // "de base" de cada aceituna ya está fijada en el relleno del SVG
        // (p.opacity). Multiplicar los dos aquí daba opacidad al cuadrado
        // (0.3 de base se quedaba en 0.09 real) — por eso apenas se veían.
        const opacity = Math.min(fadeIn, fadeOut);

        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        el.style.opacity = opacity.toFixed(3);

        const k = ripeness(t);
        bodyRefs.current[i]?.setAttribute("fill", mixStops(BODY_STOPS, k));
        shineRefs.current[i]?.setAttribute("fill", mixStops(SHINE_STOPS, k));
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
      {particlesRef.current.slice(0, isMobile && mobileCount != null ? Math.min(mobileCount, count) : count).map((p, i) => {
        const effectiveSize = isMobile ? p.size * 1.55 : p.size;
        const effectiveOpacity = isMobile ? Math.min(p.opacity * 1.35, 0.85) : p.opacity;
        const w = effectiveSize * 0.72;
        const h = effectiveSize * 1.35; // deja hueco arriba para el rabito/hoja
        return (
          <div
            key={i}
            ref={(el) => {
              spanRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              width: `${w}px`,
              height: `${h}px`,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <svg
              width={w}
              height={h}
              viewBox="0 0 20 27"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 ${effectiveSize * 0.5}px rgba(120, 150, 55, ${effectiveOpacity * 0.55}))`,
              }}
            >
              {/* Cuerpo: el color lo anima el bucle según la maduración */}
              <ellipse
                ref={(el) => {
                  bodyRefs.current[i] = el;
                }}
                cx="10"
                cy="16"
                rx="6.3"
                ry="9"
                fill={mixStops(BODY_STOPS, 0)}
                fillOpacity={effectiveOpacity}
              />
              {/* Brillo */}
              <ellipse
                ref={(el) => {
                  shineRefs.current[i] = el;
                }}
                cx="7.8"
                cy="11.5"
                rx="1.9"
                ry="2.6"
                fill={mixStops(SHINE_STOPS, 0)}
                fillOpacity={effectiveOpacity * 0.8}
              />
              {/* Rabito */}
              <path
                d="M10 7C10 7 10.3 4 12 2.5"
                stroke={`rgba(92, 78, 36, ${effectiveOpacity})`}
                strokeWidth="1.1"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hojita */}
              <ellipse
                cx="14.2"
                cy="2.3"
                rx="2.6"
                ry="1.2"
                fill={`rgba(150, 178, 78, ${effectiveOpacity * 0.9})`}
                transform="rotate(-24 14.2 2.3)"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
