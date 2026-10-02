"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getCookieConsent } from "./CookieConsent";

/**
 * Barra fija solo en móvil que da acceso directo al configurador sin tener
 * que volver a subir. Se oculta mientras el banner de cookies no se ha
 * decidido todavía, mientras el popup de oferta está visible (para no
 * amontonar dos elementos fijos a la vez) y una vez el visitante ya ha
 * llegado al propio formulario.
 */
export default function StickyMobileCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [enFormulario, setEnFormulario] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);
  const [cookieDecidida, setCookieDecidida] = useState(false);

  useEffect(() => {
    setCookieDecidida(!!getCookieConsent());
    const onConsent = () => setCookieDecidida(true);
    window.addEventListener("penolite:cookie-consent", onConsent);

    const onPromo = (e: Event) => setPromoVisible((e as CustomEvent<boolean>).detail);
    window.addEventListener("penolite:promo-visible", onPromo);

    const hero = document.querySelector("#inicio");
    const formulario = document.querySelector("#formulario-contacto");

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    const formObserver = new IntersectionObserver(
      ([entry]) => setEnFormulario(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (hero) heroObserver.observe(hero);
    if (formulario) formObserver.observe(formulario);

    return () => {
      window.removeEventListener("penolite:cookie-consent", onConsent);
      window.removeEventListener("penolite:promo-visible", onPromo);
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !enFormulario && !promoVisible && cookieDecidida;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[1800] md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        data-cursor-active
        onClick={() =>
          document.querySelector("#formulario-contacto")?.scrollIntoView({ behavior: "smooth" })
        }
        className="flex w-full items-center justify-center gap-2 bg-dorado py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-negro"
      >
        <ShoppingCart size={16} />
        Pedir ahora
      </button>
    </div>
  );
}
