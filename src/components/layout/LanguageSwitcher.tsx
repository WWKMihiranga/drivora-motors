"use client";

import { useId } from "react";
import { useApp } from "@/store";
import { Field } from "@/lib/site-data";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className, dark = false }: { className?: string; dark?: boolean }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const labelId = useId();
  const btn = (active: boolean) =>
    cn(
      "h-8 min-w-9 rounded-full px-2 transition-colors",
      active
        ? dark
          ? "bg-white text-night"
          : "bg-paper text-ink shadow-sm"
        : dark
          ? "text-white/70 hover:text-white"
          : "text-muted hover:text-ink",
    );
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn("items-center rounded-full p-1 text-xs font-semibold", dark ? "bg-white/10" : "bg-surface", className)}
    >
      <Field id={labelId} className="sr-only" data-preview-field-path="common.ui.languageLabel" />
      <Field as="button" type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={btn(lang === "en")} data-preview-field-path="common.ui.langEn" />
      <Field as="button" type="button" onClick={() => setLang("si")} aria-pressed={lang === "si"} className={btn(lang === "si")} data-preview-field-path="common.ui.langSi" />
      <Field as="button" type="button" onClick={() => setLang("ta")} aria-pressed={lang === "ta"} className={btn(lang === "ta")} data-preview-field-path="common.ui.langTa" />
    </div>
  );
}
