"use client";

import { useEffect, useState } from "react";
import { X, Tag } from "lucide-react";
import { supabase, type Promocion } from "@/lib/supabase";
import { getCookieConsent } from "./CookieConsent";
import { colors, typography, spacing } from "@/lib/design-tokens";

const dismissKey = (id: string) => `penolite-promo-dismissed-${id}`;

export default function PromoPopup() {
  const [promo, setPromo] = useState<Promocion | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPromo = async () => {
      const { data } = await supabase
        .from("promociones")
        .select("*")
        .eq("activo", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled || !data) return;
      const p = data as Promocion;

      if (p.fecha_fin && new Date(p.fecha_fin) < new Date()) return;
      if (localStorage.getItem(dismissKey(p.id))) return;

      setPromo(p);
    };

    // Espera a que el usuario ya haya decidido sobre las cookies para no
    // amontonar dos banners a la vez en la parte inferior de la pantalla.
    if (getCookieConsent()) {
      fetchPromo();
    } else {
      const onConsent = () => fetchPromo();
      window.addEventListener("penolite:cookie-consent", onConsent, { once: true });
      return () => {
        cancelled = true;
        window.removeEventListener("penolite:cookie-consent", onConsent);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!promo) return;
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [promo]);

  if (!promo || !visible) return null;

  const dismiss = () => {
    localStorage.setItem(dismissKey(promo.id), "1");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={promo.titulo}
      className="fixed bottom-6 right-6 left-6 z-[2500] sm:left-auto sm:max-w-sm"
      style={{
        background: colors.negro,
        border: `1px solid ${colors.rule}`,
        borderRadius: "12px",
        padding: spacing.lg,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
      }}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="absolute top-3 right-3 text-tx-bajo hover:text-tx-crema transition-colors"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-2 mb-2" style={{ color: colors.dorado }}>
        <Tag size={15} />
        <span
          style={{
            fontFamily: typography.fontSans,
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Oferta
        </span>
      </div>

      <h3
        style={{
          fontFamily: typography.fontSerif,
          fontSize: "19px",
          color: colors.txCrema,
          marginBottom: "6px",
          paddingRight: "20px",
        }}
      >
        {promo.titulo}
      </h3>

      <p
        style={{
          fontFamily: typography.fontSans,
          fontSize: "13px",
          color: colors.txMedio,
          lineHeight: "1.6",
          marginBottom: promo.codigo ? spacing.sm : spacing.md,
        }}
      >
        {promo.texto}
      </p>

      {promo.codigo && (
        <div
          style={{
            display: "inline-block",
            fontFamily: typography.fontMono,
            fontSize: "12px",
            letterSpacing: "0.08em",
            color: colors.dorado,
            border: `1px dashed ${colors.rule}`,
            borderRadius: "6px",
            padding: "6px 12px",
            marginBottom: spacing.md,
          }}
        >
          {promo.codigo}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          dismiss();
          document.querySelector("#productos")?.scrollIntoView({ behavior: "smooth" });
        }}
        data-cursor-active
        style={{
          display: "block",
          width: "100%",
          padding: "10px 16px",
          backgroundColor: colors.dorado,
          color: colors.negro,
          border: "none",
          fontFamily: typography.fontSans,
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Ver oferta
      </button>
    </div>
  );
}
