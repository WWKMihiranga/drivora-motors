"use client";

import { BadgeCheck } from "lucide-react";
import { Field, useText } from "@/lib/site-data";
import type { Condition, Status } from "@/types";
import { cn } from "@/lib/cn";

/*
 * Tags come in two surfaces:
 * - "photo": sits on a car photo. Smoked glass + white text, identical in light and dark mode
 *   (the photo doesn't change with the theme, so the tag shouldn't either).
 * - "page": sits on a page background. Soft tint + hairline ring from theme tokens, so it adapts.
 * Squared-off corners keep tags visually distinct from the pill-shaped buttons.
 */
type Surface = "photo" | "page";
/** Optional Fivora marker: the vehicle field the badge shows, e.g. `vehicles[${i}].status`. */
type Marker = { "data-preview-field-path"?: string };

const base =
  "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[0.7rem] leading-none font-semibold";
const glass = "bg-night/70 text-white ring-1 ring-inset ring-white/12 backdrop-blur-md";

// On glass the dot carries the meaning, so it needs to be bright; these stay fixed across themes.
const statusDot: Record<Status, string> = {
  available: "bg-emerald-300",
  reserved: "bg-amber-300",
  sold: "bg-rose-300",
  arriving: "bg-sky-300",
};
const statusTint: Record<Status, string> = {
  available: "bg-ok/10 text-ok ring-ok/25",
  reserved: "bg-warn/10 text-warn ring-warn/25",
  sold: "bg-bad/10 text-bad ring-bad/25",
  arriving: "bg-note/10 text-note ring-note/25",
};

export function StatusBadge({ status, on = "page", className, ...marker }: { status: Status; on?: Surface; className?: string } & Marker) {
  const text = useText();
  return (
    <span className={cn(base, on === "photo" ? glass : cn("ring-1 ring-inset", statusTint[status]), className)} {...marker}>
      <span className={cn("size-1.5 rounded-full", on === "photo" ? statusDot[status] : "bg-current")} />
      {text(`labels.status.${status}`) || status}
    </span>
  );
}

export function ConditionBadge({
  condition,
  on = "page",
  className,
  ...marker
}: { condition: Condition; on?: Surface; className?: string } & Marker) {
  const text = useText();
  return (
    <span className={cn(base, on === "photo" ? glass : "bg-surface text-ink ring-1 ring-inset ring-line", className)} {...marker}>
      {text(`labels.condition.${condition}`) || condition}
    </span>
  );
}

/** Dealer highlight such as "Just landed" or "Popular": the one tag meant to catch the eye. */
export function HighlightBadge({
  children,
  on = "page",
  className,
  ...marker
}: { children: React.ReactNode; on?: Surface; className?: string } & Marker) {
  return (
    <span
      className={cn(
        base,
        on === "photo" ? "bg-white text-night" : "bg-brand/10 text-brand ring-1 ring-inset ring-brand/25",
        className,
      )}
      {...marker}
    >
      {children}
    </span>
  );
}

export function VerifiedTick({ className, label = true }: { className?: string; label?: boolean }) {
  const text = useText();
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-[0.75rem] font-semibold text-ok", className)}
      title={text("common.vehicleCard.verifiedTitle")}
      data-preview-field-path="common.vehicleCard.verifiedTitle"
    >
      <BadgeCheck className="size-4" strokeWidth={2} />
      {label && <Field data-preview-field-path="common.vehicleCard.verified" />}
    </span>
  );
}
