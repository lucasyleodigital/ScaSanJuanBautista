"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "./AudioEngine";

const LINKS = [
  { href: "#historia", label: "Historia" },
  { href: "#olivar", label: "El Olivar" },
  { href: "#productos", label: "Productos" },
  { href: "#calidad", label: "Calidad" },
  { href: "#cooperativa", label: "Cooperativa" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { isMuted, toggleMute } = useAudio();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", open);
    return () => document.body.classList.remove("nav-menu-open");
  }, [open]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[1000] flex items-center justify-between px-6 py-5 transition-[background,padding,box-shadow] duration-300 md:px-10 ${
        solid ? "py-3.5 shadow-[0_1px_0_var(--rule)]" : ""
      }`}
      style={{ backgroundColor: solid ? "rgba(6, 13, 3, 0.95)" : "transparent" }}
    >
      <a href="#inicio" className="flex items-center gap-3 no-underline">
        <Image
          src="/images/logo/logo-nav.png"
          alt="SCA San Juan Bautista de Peñolite"
          width={44}
          height={44}
          className="h-9 w-9 shrink-0 md:h-11 md:w-11"
          priority
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-serif text-[15px] tracking-[0.06em] text-tx-crema">
            San Juan Bautista de Peñolite
          </span>
          <span className="font-sans text-[8.5px] tracking-[0.22em] text-dorado uppercase opacity-80">
            AOVE Picual · D.O. Sierra de Segura
          </span>
        </span>
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              data-cursor-active
              className="group relative font-sans text-[11px] tracking-[0.14em] text-tx-medio uppercase transition-colors hover:text-tx-crema"
            >
              {l.label}
              <span className="absolute -bottom-[3px] left-0 h-px w-full origin-center scale-x-0 bg-dorado transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {/* Sound Toggle Button */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dorado/40 bg-black/40 text-dorado text-xs hover:border-dorado transition-all"
          title={isMuted ? "Activar Sonido UI" : "Desactivar Sonido UI"}
          data-cursor="SONIDO"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 opacity-60" />
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-dorado animate-pulse" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-dorado animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-0.5 h-2/3 bg-dorado animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-0.5 h-4/5 bg-dorado animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </>
          )}
          <span className="font-mono text-[10px] hidden sm:inline uppercase tracking-widest">
            {isMuted ? "Sound Off" : "Sound On"}
          </span>
        </button>

        <a
          href="#formulario-contacto"
          data-cursor-active
          className="group relative hidden overflow-hidden border border-dorado px-5 py-2 font-sans text-[10.5px] tracking-[0.16em] text-dorado uppercase transition-colors duration-350 hover:text-negro md:block"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-dorado transition-transform duration-350 ease-[cubic-bezier(.83,0,.17,1)] group-hover:scale-y-100" />
          <span className="relative">Solicitar Pedido</span>
        </a>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-tx-crema md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 top-[60px] z-[10001] flex flex-col gap-6 bg-negro px-8 py-10 md:hidden"
          style={{ backgroundColor: "#060d03", backdropFilter: "none" }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif text-2xl text-tx-crema"
              style={{ color: "#f0e8cc" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#formulario-contacto"
            onClick={() => setOpen(false)}
            className="mt-4 border border-dorado px-5 py-3 text-center font-sans text-[11px] tracking-[0.16em] text-dorado uppercase"
          >
            Solicitar Pedido
          </a>
        </div>
      )}
    </nav>
  );
}

