"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isReducedMotion } from "@/hooks/useReducedMotion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Lenis mide la altura scrolleable de la página UNA vez, al crearse —
  // vive en el layout raíz, que no se remonta al navegar entre rutas
  // (ej. ir a "Aviso Legal", mucho más corta, y volver a la home). Sin
  // esto, se queda con la medida de la página anterior y no deja bajar
  // más allá de esa altura hasta recargar a mano.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    // Lenis's eased inertia is itself a motion effect — respect the OS
    // preference (unless overridden with ?motion=on) by leaving native
    // (instant) scrolling in place instead.
    if (isReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
