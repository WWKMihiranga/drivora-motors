"use client";

import { useApp, type Lang } from "@/store";
import { langNames } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const langs: Lang[] = ["en", "si", "ta"];

export function LanguageSwitcher({ className, dark = false }: { className?: string; dark?: boolean }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "items-center rounded-full p-1 text-xs font-semibold",
        dark ? "bg-white/10" : "bg-surface",
        className,
      )}
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "h-8 min-w-9 rounded-full px-2 transition-colors",
            lang === l
              ? dark
                ? "bg-white text-night"
                : "bg-paper text-ink shadow-sm"
              : dark
                ? "text-white/70 hover:text-white"
                : "text-muted hover:text-ink",
          )}
        >
          {langNames[l]}
        </button>
      ))}
    </div>
  );
}
