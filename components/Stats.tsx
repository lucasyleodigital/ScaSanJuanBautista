"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isReducedMotion } from "@/hooks/useReducedMotion";

const STATS = [
  { target: 500, suffix: "+", label: "Familias olivareras" },
  { target: 66, suffix: " años", label: "De tradición" },
  { target: 840, suffix: " m", label: "Altitud del olivar" },
  { target: 0.5, suffix: "°", prefix: "≤ ", decimals: 1, label: "Acidez máxima" },
  { target: 2, suffix: " D.O.", label: "Denominaciones de origen" },
];

/**
 * Cifras que comunican escala de un vistazo, entre Hero y Historia.
 * Cuentan hacia arriba una sola vez al entrar en viewport; con
 * reduced-motion aparecen ya con su valor final (ver hook).
 */
export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 flex flex-wrap justify-center bg-dorado">
      {STATS.map((s) => (
        <StatItem key={s.label} {...s} started={started} />
      ))}
    </div>
  );
}

function StatItem({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  started,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  started: boolean;
}) {
  const numRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started || !numRef.current) return;
    if (isReducedMotion()) {
      numRef.current.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div className="min-w-[140px] flex-1 border-r border-negro/15 px-10 py-5 text-center last:border-r-0">
      <div
        ref={numRef}
        className="font-serif text-[28px] leading-none text-negro tabular-nums"
      >
        {prefix}0{suffix}
      </div>
      <div className="mt-1.5 text-[9px] tracking-[0.2em] text-negro/65 uppercase">
        {label}
      </div>
    </div>
  );
}
