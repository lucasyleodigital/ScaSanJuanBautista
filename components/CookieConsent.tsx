"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "penolite-cookie-consent";

export interface CookieConsentValue {
  necessary: true;
  analytics: boolean;
  timestamp: string;
}

/** Lee el consentimiento guardado, o null si el usuario no ha decidido aún. */
export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsentValue) : null;
  } catch {
    return null;
  }
}

/**
 * Comprueba si el usuario ha dado consentimiento para cookies analíticas.
 * Cualquier script de analítica con cookies (Google Analytics, etc.) que
 * se añada en el futuro debe comprobar esto ANTES de cargarse — nunca
 * insertar el script y luego preguntar.
 */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.analytics === true;
}

function saveConsent(analytics: boolean) {
  const value: CookieConsentValue = {
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("penolite:cookie-consent", { detail: value }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);

    const onReopen = () => {
      setCustomizing(false);
      setVisible(true);
    };
    window.addEventListener("penolite:abrir-preferencias-cookies", onReopen);
    return () => window.removeEventListener("penolite:abrir-preferencias-cookies", onReopen);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent(true);
    setVisible(false);
  };
  const rejectAll = () => {
    saveConsent(false);
    setVisible(false);
  };
  const savePreferences = () => {
    saveConsent(analyticsChecked);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-[3000] border-t border-rule bg-negro/97 backdrop-blur-md px-6 py-6 md:px-10"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <p className="text-sm leading-relaxed text-tx-medio">
          Usamos únicamente almacenamiento técnico necesario para el
          funcionamiento de la web. Si aceptas, también podremos activar
          estadísticas de visitas anónimas para mejorar el sitio. Puedes
          leer más en nuestra{" "}
          <a href="/politica-cookies" className="text-dorado underline">
            Política de Cookies
          </a>
          .
        </p>

        {customizing && (
          <div className="flex flex-col gap-3 rounded-lg border border-rule bg-verde-noche/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-tx-crema">Necesarias</p>
                <p className="text-xs text-tx-bajo">
                  Imprescindibles para que la web funcione. Siempre activas.
                </p>
              </div>
              <input type="checkbox" checked disabled aria-label="Cookies necesarias, siempre activas" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-tx-crema">Analíticas</p>
                <p className="text-xs text-tx-bajo">
                  Estadísticas de visitas anónimas. Desactivadas por defecto.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                aria-label="Activar cookies analíticas"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={rejectAll}
            className="flex-1 min-w-[140px] rounded-md border border-rule px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-tx-crema transition-colors hover:border-dorado"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => (customizing ? savePreferences() : setCustomizing(true))}
            className="flex-1 min-w-[140px] rounded-md border border-rule px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-tx-crema transition-colors hover:border-dorado"
          >
            {customizing ? "Guardar preferencias" : "Personalizar"}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="flex-1 min-w-[140px] rounded-md bg-dorado px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-negro transition-opacity hover:opacity-90"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
