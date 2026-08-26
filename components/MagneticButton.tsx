"use client";

import { useRef } from "react";
import { motion, useSpring } from "motion/react";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "prim" | "sec";
  className?: string;
};

/**
 * Botón magnético con física de resorte real (overshoot al soltar),
 * no un simple transform:scale. Desactivado en touch (hover:none) vía CSS.
 */
export default function MagneticButton({
  href,
  children,
  variant = "prim",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 12, mass: 0.6 });
  const y = useSpring(0, { stiffness: 300, damping: 12, mass: 0.6 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === "prim"
      ? "bg-dorado text-negro"
      : "border border-dorado/50 text-tx-medio";

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor-active
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`magnetic inline-block px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase font-sans ${base} ${className}`}
    >
      {children}
    </motion.a>
  );
}
