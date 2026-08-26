"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "span" | "h2" | "p";
  className?: string;
};

/**
 * Reveal simple (aparición + traslación) vía IntersectionObserver.
 * Elegido sobre animation-timeline: scroll() por soporte de navegador
 * disparejo en 2026; sobre GSAP por ser una animación trivial de una sola
 * vez que no justifica el coste de la librería.
 *
 * `as` está limitado a un set fijo de etiquetas (en vez de un componente
 * polimórfico genérico) para que el ref y las props sigan siendo
 * comprobables por TypeScript y por las reglas de pureza de refs de React.
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sharedProps = {
    ref: ref as React.Ref<never>,
    className: `reveal ${className}`,
    style: { transitionDelay: delay ? `${delay}s` : undefined },
  };

  if (as === "span") return <span {...sharedProps}>{children}</span>;
  if (as === "h2") return <h2 {...sharedProps}>{children}</h2>;
  if (as === "p") return <p {...sharedProps}>{children}</p>;
  return <div {...sharedProps}>{children}</div>;
}
