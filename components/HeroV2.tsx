"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { colors, motion, typography } from "@/lib/design-tokens";
import { useAudio } from "./AudioEngine";
import { Sparkles, Award, ArrowDownRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function HeroV2() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playGoldDrop, playClick } = useAudio();

  // Interactive Particle Field Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    const numParticles = Math.min(60, Math.floor(width / 25));
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2, // Upward float
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", onPointerMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Subtle attraction to mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 150, 30, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#C8961E";
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current) return;

    const ctx = gsap.context(() => {
      const splitTitle = new SplitText(titleRef.current, { type: "words" });

      const tl = gsap.timeline();

      tl.from(
        splitTitle.words,
        {
          duration: 0.8,
          opacity: 0,
          y: 30,
          stagger: 0.08,
          ease: motion.easeDivine,
        },
        0
      );

      tl.from(
        subtitleRef.current,
        {
          duration: 0.9,
          opacity: 0,
          y: 20,
          ease: motion.easeDivine,
        },
        "-=0.4"
      );

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1.2,
        onUpdate: (self) => {
          if (!titleRef.current || !subtitleRef.current) return;
          const easedProgress = gsap.parseEase("power2.inOut")(self.progress);
          const weight = gsap.utils.interpolate(400, 700, easedProgress);
          titleRef.current.style.fontVariationSettings = `"opsz" ${400 + self.getVelocity() * 0.1}, "wght" ${weight}`;
          subtitleRef.current.style.opacity = String(1 - self.progress * 0.5);
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-negro"
      style={{
        backgroundImage: "url(/images/hero/hero-olivares-amanecer.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dynamic Gold Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
      />

      {/* Cinematic Dark Glass Overlay */}
      <div
        className="absolute inset-0 z-0 backdrop-blur-[1px]"
        style={{
          background: `linear-gradient(180deg, rgba(6, 13, 3, 0.70) 0%, rgba(6, 13, 3, 0.82) 50%, rgba(6, 13, 3, 0.95) 100%)`,
        }}
      />

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-16">
        {/* Eyebrow Badges */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-dorado/40 bg-black/60 backdrop-blur-md mb-8">
          <Award className="w-4 h-4 text-dorado animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-dorado">
            D.O. Sierra de Segura · 840m Altitud · Fundada 1958
          </span>
        </div>

        {/* Title con variable font */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(44px, 8.5vw, 110px)",
            lineHeight: "1.08",
            color: colors.txCrema,
            margin: "12px 0 24px",
            fontVariationSettings: '"opsz" 400, "wght" 400',
            textShadow: "0 6px 32px rgba(0, 0, 0, 0.8)",
          }}
          className="tracking-tight"
        >
          500 Familias. Cero Intermediarios.
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: typography.fontSans,
            fontSize: "clamp(16px, 2.2vw, 24px)",
            color: colors.txMedio,
            fontWeight: 300,
            maxWidth: "780px",
            margin: "0 auto 40px",
            lineHeight: "1.6",
            textShadow: "0 2px 16px rgba(0, 0, 0, 0.9)",
          }}
        >
          Aceite Picual 100% de montaña, directo de la almazara de Peñolite a tu mesa. Con la frescura, el aroma a tomillo silvestre y la acidez más baja (&lt;0.5°).
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
          <button
            onClick={() => {
              playClick();
              document
                .querySelector("#productos")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onMouseEnter={playGoldDrop}
            className="w-full sm:w-auto px-8 py-4 bg-dorado hover:bg-amber-400 text-negro font-semibold text-xs tracking-widest uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(200,150,30,0.4)] flex items-center justify-center gap-2 group"
            data-cursor="COMPRAR"
          >
            <span>Ver Precios Directos</span>
            <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </button>

          <button
            onClick={() => {
              playClick();
              document
                .querySelector("#formulario-contacto")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onMouseEnter={playGoldDrop}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-tx-crema text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2"
            data-cursor="PEDIDO"
          >
            <Sparkles className="w-4 h-4 text-dorado" />
            <span>Configurador de Pedido</span>
          </button>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-dorado/60 font-mono flex items-center gap-2 animate-bounce cursor-pointer z-20"
        onClick={() => {
          document.querySelector("#terroir")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span>Desplaza para descubrir</span>
      </div>
    </section>
  );
}

