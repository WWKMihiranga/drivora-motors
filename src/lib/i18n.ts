"use client";

import { useText } from "@/lib/site-data";

/*
 * Interface words (nav, key calls to action). English lives in site-data.json `common.ui`; Sinhala and
 * Tamil live in `translations.si` / `translations.ta` and are edited in the Fivora side panel.
 * Sinhala and Tamil strings need a native-speaker review before client demos.
 */
export type DictKey =
  | "cars" | "finance" | "sell" | "about" | "contact" | "book" | "bookShort" | "call" | "whatsapp"
  | "browse" | "calc" | "saved" | "menu";

export function useT() {
  const text = useText();
  return (k: DictKey) => text(`common.ui.${k}`);
}

export const langNames = { en: "EN", si: "සිං", ta: "தமி" } as const;
