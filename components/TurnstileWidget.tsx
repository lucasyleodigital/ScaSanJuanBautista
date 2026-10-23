"use client";

import { useEffect, useRef } from "react";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function cargarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error("No se pudo cargar Turnstile"));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Captcha de Cloudflare. `onToken(null)` cuando caduca o falla: el formulario
 * debe bloquear el envío hasta tener un token nuevo. Cambia `resetKey` para
 * pedir un reto nuevo (los tokens solo valen una vez).
 */
export default function TurnstileWidget({
  siteKey,
  onToken,
  onError,
  resetKey,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
  onError?: () => void;
  resetKey?: number;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };

  useEffect(() => {
    let cancelado = false;
    cargarScript()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(contenedor.current, {
          sitekey: siteKey,
          theme: "dark",
          language: "es",
          callback: (t: string) => callbacks.current.onToken(t),
          "expired-callback": () => callbacks.current.onToken(null),
          "error-callback": () => {
            callbacks.current.onToken(null);
            callbacks.current.onError?.();
          },
        });
      })
      .catch(() => callbacks.current.onError?.());
    return () => {
      cancelado = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) {
      callbacks.current.onToken(null);
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  return <div ref={contenedor} className="flex justify-center" />;
}
