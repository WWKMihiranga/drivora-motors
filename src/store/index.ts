"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lead } from "@/types";

export type Lang = "en" | "si" | "ta";

interface AppState {
  saved: string[];
  compare: string[];
  recent: string[];
  leads: Lead[];
  lang: Lang;
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  pushRecent: (id: string) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "stage" | "source">) => Lead;
  setLang: (l: Lang) => void;
}

/** Safe storage: some in-app browsers and private modes throw on localStorage. */
const safeStorage = createJSONStorage(() => {
  try {
    const k = "__drv_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
});

export const MAX_COMPARE = 3;

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      saved: [],
      compare: [],
      recent: [],
      leads: [],
      lang: "en",
      toggleSaved: (id) =>
        set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved] })),
      toggleCompare: (id) => {
        const { compare } = get();
        if (compare.includes(id)) {
          set({ compare: compare.filter((x) => x !== id) });
          return true;
        }
        if (compare.length >= MAX_COMPARE) return false;
        set({ compare: [...compare, id] });
        return true;
      },
      clearCompare: () => set({ compare: [] }),
      pushRecent: (id) => set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 8) })),
      addLead: (lead) => {
        const full: Lead = {
          ...lead,
          id: `L-${Math.floor(1043 + Math.random() * 900)}`,
          createdAt: Date.now(),
          stage: "New",
          source: "Website",
        };
        set((s) => ({ leads: [full, ...s.leads].slice(0, 30) }));
        return full;
      },
      setLang: (lang) => set({ lang }),
    }),
    // skipHydration: the Providers component rehydrates after mount, so server HTML and
    // the first client render always match.
    { name: "drivora-demo", storage: safeStorage, version: 1, skipHydration: true },
  ),
);


/** True once the persisted store (saved, compare, leads) has loaded from localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useApp.persist.onFinishHydration(cb),
    () => useApp.persist.hasHydrated(),
    () => false,
  );
}
