"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollTriggerConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollTrigger(
  ref: React.RefObject<HTMLElement>,
  config: ScrollTriggerConfig
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: ref.current!,
        ...config,
      });
    });

    return () => {
      ctx.revert();
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [ref, config]);

  return triggerRef;
}

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  animationFn: (ctx: gsap.Context) => void
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, ref.current);

    return () => ctx.revert();
  }, [ref, animationFn]);
}
