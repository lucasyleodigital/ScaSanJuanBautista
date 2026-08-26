"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "./useMediaQuery";

/**
 * `?motion=on` fuerza el motion completo aunque el sistema pida
 * prefers-reduced-motion: reduce — imprescindible para poder hacer una
 * demo/reunión en un equipo con animaciones del SO desactivadas, sin
 * tener que tocar la configuración de Windows. Se persiste en
 * sessionStorage para que sobreviva a re-renders sin repetir el parámetro.
 * Mismo patrón que `.force-motion` en el demo HTML anterior.
 */
function readForceMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("motion") === "on") {
    sessionStorage.setItem("penolite-force-motion", "1");
  }
  return sessionStorage.getItem("penolite-force-motion") === "1";
}

function useForceMotion(): boolean {
  return useSyncExternalStore(
    () => () => {},
    readForceMotion,
    () => false
  );
}

export function useReducedMotion(): boolean {
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const forced = useForceMotion();
  return systemReduced && !forced;
}

/** Versión no-hook para usar dentro de efectos/callbacks sueltos. */
export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !readForceMotion()
  );
}
