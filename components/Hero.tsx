"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText } from "@/lib/gsap";
import MagneticButton from "./MagneticButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSessionFlag } from "@/hooks/useSessionFlag";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [introJustFinished, setIntroJustFinished] = useState(false);
  const introSeen = useSessionFlag("penolite-intro-seen");
  const isDesktopFine = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reducedMotion = useReducedMotion();
  const show3d = isDesktopFine && !reducedMotion;
  const visible = introSeen || introJustFinished;

  useEffect(() => {
    const onIntroDone = () => setIntroJustFinished(true);
    window.addEventListener("intro-done", onIntroDone);
    return () => window.removeEventListener("intro-done", onIntroDone);
  }, []);

  useEffect(() => {
    if (!visible || !titleRef.current) return;
    if (reducedMotion) return;

    const split = new SplitText(titleRef.current, {
      type: "chars",
      charsClass: "char",
    });
    gsap.set(split.chars, { opacity: 0, y: 16, filter: "blur(12px)" });
    gsap.to(split.chars, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.9,
      stagger: 0.02,
      ease: "power3.out",
      delay: 0.15,
    });

    return () => split.revert();
  }, [visible, reducedMotion]);

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 100%, var(--verde-oscuro) 0%, var(--negro) 70%)",
      }}
    >
      {show3d && (
        <div className="absolute inset-0 z-[1]" aria-hidden="true">
          <HeroScene />
        </div>
      )}

      <div className="relative z-20 max-w-4xl px-6 pb-32 text-center">
        <p
          className={`font-sans text-[9px] tracking-[0.4em] text-dorado uppercase transition-all duration-800 ${
            visible ? "opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          — D.O. Sierra de Segura · Jaén · 840 m —
        </p>

        <h1
          ref={titleRef}
          aria-label="El Alma del Olivar"
          className={`my-5 font-serif text-[clamp(42px,8vw,100px)] leading-[0.98] tracking-[-0.01em] text-tx-crema ${
            visible ? "" : "invisible"
          }`}
        >
          {visible ? "El Alma del Olivar" : ""}
        </h1>

        <p
          className={`mx-auto mb-10 max-w-lg font-serif text-[clamp(14px,2vw,18px)] text-tx-medio transition-all delay-500 duration-1000 ${
            visible ? "opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Virgen Extra Picual 100% de la Sierra de Segura.
          <br />
          Seis décadas de tradición en Peñolite, Jaén.
        </p>

        <div
          className={`flex flex-wrap justify-center gap-4 transition-opacity delay-700 duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <MagneticButton href="#productos" variant="prim">
            Ver productos
          </MagneticButton>
          <MagneticButton href="#historia" variant="sec">
            Nuestra historia
          </MagneticButton>
        </div>
      </div>

      <div
        className={`absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 transition-opacity duration-800 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          animation:
            visible && !reducedMotion
              ? "hero-float 3s ease-in-out infinite"
              : undefined,
        }}
      >
        <div className="flex h-9 w-[22px] justify-center rounded-full border border-dorado/65 pt-1.5">
          <span
            className="h-[7px] w-[3px] rounded-sm bg-dorado"
            style={{
              animation: reducedMotion
                ? undefined
                : "wheel-drop 1.8s cubic-bezier(.23,1,.32,1) infinite",
            }}
          />
        </div>
        <span className="font-sans text-[7.5px] tracking-[0.35em] text-dorado/60 uppercase">
          Descubrir
        </span>
      </div>
    </section>
  );
}
