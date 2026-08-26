/**
 * Partículas doradas en suspensión — polvo de luz / gotas de aceite
 * ascendiendo lentamente. Decoración pura, sin significado narrativo.
 *
 * Implementación 100% CSS (sin canvas, sin JS de medición, sin
 * requestAnimationFrame): cada partícula es un <span> posicionado en
 * porcentaje del contenedor padre (que debe tener position:relative) y
 * animado con @keyframes. Se oculta bajo prefers-reduced-motion vía
 * media query CSS pura, sin depender de ningún hook de React.
 *
 * Las posiciones/tamaños usan un pseudo-random determinista (mismo
 * resultado en servidor y cliente) para no provocar un hydration
 * mismatch, cosa que sí pasaría con Math.random() directo en el render.
 */

// Redondeado a pocos decimales para que el resultado sea idéntico en
// servidor y cliente: Math.sin puede diferir en el último bit de
// precisión entre procesos, y eso basta para disparar un aviso de
// hydration mismatch en React si se usa el valor "en crudo".
function seeded(n: number, decimals = 4): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  const raw = x - Math.floor(x);
  const f = 10 ** decimals;
  return Math.round(raw * f) / f;
}

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const left = Math.round(seeded(i * 7.31) * 100 * 100) / 100;
    const top = Math.round((10 + seeded(i * 6.53) * 80) * 100) / 100;
    const size = Math.round((2 + seeded(i * 3.17) * 4.5) * 100) / 100;
    const duration = Math.round((13 + seeded(i * 5.73) * 14) * 100) / 100;
    const delay = Math.round(-seeded(i * 9.29) * duration * 100) / 100;
    const opacity = Math.round((0.22 + seeded(i * 2.11) * 0.4) * 100) / 100;
    const drift = Math.round((-30 + seeded(i * 4.47) * 60) * 100) / 100;
    return { left, top, size, duration, delay, opacity, drift };
  });
}

export default function FloatingParticles({ count = 22 }: { count?: number }) {
  const particles = buildParticles(count);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="floating-particle"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(200, 150, 30, ${p.opacity})`,
              boxShadow: `0 0 ${p.size * 3}px rgba(200, 150, 30, ${p.opacity * 0.7})`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--particle-drift": `${p.drift}px`,
              "--particle-top": `${p.top}%`,
            } as React.CSSProperties
          }
        />
      ))}

      <style>{`
        .floating-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          animation-name: floatParticleUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes floatParticleUp {
          0% { transform: translate(0, 0); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { transform: translate(var(--particle-drift, 0px), -115vh); opacity: 0; }
        }

        /* Con movimiento reducido, se quita el desplazamiento pero se
           deja el punto estático y visible — no tiene sentido ocultar
           un detalle decorativo tan sutil solo por esa preferencia. */
        @media (prefers-reduced-motion: reduce) {
          .floating-particle {
            animation: none;
            top: var(--particle-top, 40%);
            bottom: auto;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
