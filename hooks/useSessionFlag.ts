"use client";

import { useSyncExternalStore } from "react";

/**
 * Lee un flag de sessionStorage sin el flash/mismatch de "leer en un
 * efecto y volcar a setState": useSyncExternalStore ya resuelve la
 * reconciliación servidor (siempre false) → cliente (valor real) que un
 * efecto normal haría con un setState síncrono de más.
 */
export function useSessionFlag(key: string): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(key) === "1",
    () => false
  );
}
