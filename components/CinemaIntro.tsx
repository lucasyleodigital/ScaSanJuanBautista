"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useSessionFlag } from "@/hooks/useSessionFlag";
import { isReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Capítulo 0 — intro de cine, una sola vez por sesión. Ancla el tono
 * (patrimonio, no producto de supermercado) antes de mostrar el Hero.
 * Se puede saltar con click/tap o cualquier tecla; nunca atrapa el foco.
 */
export default function CinemaIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [skippable, setSkippable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const introSeen = useSessionFlag("penolite-intro-seen");

  useEffect(() => {
    if (introSeen) return;

    if (isReducedMotion()) {
      finish();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => setSkippable(true),
    });
    tl.to("#cLine", { height: 60, duration: 0.7 })
      .to("#cLoc", { opacity: 1, duration: 0.6 }, "-=0.2")
      .to("#cTit", { opacity: 1, duration: 0.8 }, "-=0.3")
      .to("#cYr", { opacity: 1, duration: 0.6 }, "-=0.4")
      .to("#cSkip", { opacity: 1, duration: 0.6 })
      .to({}, { duration: 1.4 });

    const auto = window.setTimeout(finish, 4200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      tl.kill();
      window.clearTimeout(auto);
      window.removeEventListener("keydown", onKey);
    };
  }, [introSeen]);

  function finish() {
    sessionStorage.setItem("penolite-intro-seen", "1");
    window.dispatchEvent(new Event("intro-done"));
    const el = rootRef.current;
    if (!el) {
      setDismissed(true);
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.7,
      onComplete: () => setDismissed(true),
    });
  }

  if (introSeen || dismissed) return null;

  return (
    <div
      ref={rootRef}
      onClick={finish}
      className="fixed inset-0 z-[8000] flex cursor-pointer flex-col items-center justify-center gap-3 bg-negro"
    >
      <div
        id="cLine"
        className="h-0 w-px bg-dorado transition-[height] duration-700"
      />
      <div className="mt-4 flex flex-col items-center gap-2.5">
        <p
          id="cLoc"
          className="font-sans text-[11px] tracking-[0.35em] text-dorado/70 uppercase opacity-0 transition-opacity duration-600"
        >
          Sierra de Segura · Jaén · España
        </p>
        <p
          id="cTit"
          className="text-center font-serif text-[clamp(24px,4vw,48px)] leading-tight tracking-[0.06em] text-tx-crema opacity-0 transition-opacity duration-800"
        >
          SCA San Juan Bautista
          <br />
          de Peñolite
        </p>
        <p
          id="cYr"
          className="font-sans text-[10px] tracking-[0.5em] text-dorado/50 uppercase opacity-0 transition-opacity duration-600"
        >
          · Desde 1958 ·
        </p>
      </div>
      {skippable && (
        <button
          id="cSkip"
          type="button"
          onClick={finish}
          className="absolute bottom-8 font-sans text-[9px] tracking-[0.25em] text-dorado/40 uppercase opacity-0 transition-opacity duration-600"
        >
          Toca para continuar
        </button>
      )}
    </div>
  );
}
