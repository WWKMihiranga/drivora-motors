"use client";

import { Heart } from "lucide-react";
import { useApp } from "@/store";
import { cn } from "@/lib/cn";
import { fill, useText } from "@/lib/site-data";

export function SaveButton({ id, className, label }: { id: string; className?: string; label?: string }) {
  const saved = useApp((s) => s.saved.includes(id));
  const toggle = useApp((s) => s.toggleSaved);
  const text = useText();
  const car = label ?? "car";
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={fill(text(saved ? "common.vehicleCard.unsaveLabel" : "common.vehicleCard.saveLabel"), { car })}
      data-preview-field-path="common.vehicleCard.saveLabel"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-paper/95 text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:bg-paper",
        className,
      )}
    >
      <Heart
        key={saved ? "on" : "off"}
        className={cn("size-[1.1rem] transition-colors", saved && "animate-heart-pop fill-brand text-brand")}
        strokeWidth={1.75}
      />
    </button>
  );
}
