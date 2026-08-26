"use client";

import { useSyncExternalStore } from "react";

/**
 * Suscripción pura a un media query (useSyncExternalStore) en vez de leer
 * window.matchMedia dentro de un efecto y volcarlo a setState — evita el
 * doble render y el hydration mismatch que ese patrón provoca.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
