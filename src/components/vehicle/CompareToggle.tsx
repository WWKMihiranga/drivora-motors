"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { MAX_COMPARE, useApp } from "@/store";
import { cn } from "@/lib/cn";
import { fill, useText } from "@/lib/site-data";

export function CompareToggle({ id, className }: { id: string; className?: string }) {
  const on = useApp((s) => s.compare.includes(id));
  const toggle = useApp((s) => s.toggleCompare);
  const [full, setFull] = useState(false);
  const text = useText();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = toggle(id);
        setFull(!ok);
        if (!ok) window.setTimeout(() => setFull(false), 1800);
      }}
      aria-pressed={on}
      data-preview-field-path="common.vehicleCard.compare"
      className={cn(
        "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors",
        on ? "text-ink" : "text-muted hover:text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-[5px] border transition-colors",
          on ? "border-ink bg-ink text-on-ink" : "border-line bg-paper",
        )}
      >
        {on ? <Check className="size-3" strokeWidth={3} /> : <Plus className="size-3" strokeWidth={2.5} />}
      </span>
      {full ? fill(text("common.vehicleCard.compareFull"), { max: MAX_COMPARE }) : text("common.vehicleCard.compare")}
    </button>
  );
}
