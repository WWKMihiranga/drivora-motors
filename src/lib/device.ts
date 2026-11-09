"use client";

import { useSyncExternalStore } from "react";

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/** True on devices where heavy effects (3D, long animations) should be opt-in only. */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  const n = navigator as NavigatorExtras;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = !!n.connection?.saveData;
  const slowNet = ["slow-2g", "2g"].includes(n.connection?.effectiveType ?? "");
  const lowMem = (n.deviceMemory ?? 8) <= 2;
  const fewCores = (n.hardwareConcurrency ?? 8) <= 2;
  return reduced || saveData || slowNet || lowMem || fewCores;
}

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

const noop = () => () => {};
/** Hydration-safe "has mounted" flag. */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
