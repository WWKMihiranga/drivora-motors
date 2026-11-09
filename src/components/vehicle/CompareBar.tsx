"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useApp } from "@/store";
import { vehicles } from "@/data/vehicles";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

/** Floating tray that appears once a car is added to compare. */
export function CompareBar() {
  const ids = useApp((s) => s.compare);
  const toggle = useApp((s) => s.toggleCompare);
  const clear = useApp((s) => s.clearCompare);
  const pathname = usePathname();
  const show = ids.length > 0 && pathname !== "/compare";
  const cars = ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "fixed inset-x-3 bottom-24 z-40 transition-[transform,opacity] duration-300 ease-out-soft md:inset-x-auto md:left-1/2 md:w-140 md:-translate-x-1/2 lg:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-line bg-paper/95 p-2 pl-3 shadow-[0_18px_40px_-18px_rgba(14,17,22,0.45)] backdrop-blur">
        <div className="flex -space-x-2">
          {cars.map((v) => (
            <button
              key={v!.id}
              type="button"
              onClick={() => toggle(v!.id)}
              aria-label={`Remove ${v!.make} ${v!.model} from compare`}
              className="group relative size-10 overflow-hidden rounded-full border-2 border-white bg-surface"
            >
              <Photo id={v!.images[0]} alt="" fill sizes="40px" crop="1:1" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-night/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <X className="size-3.5" />
              </span>
            </button>
          ))}
        </div>
        <p className="flex-1 text-sm">
          <span className="font-semibold">{ids.length}</span>
          <span className="text-muted"> of 3 to compare</span>
        </p>
        <button type="button" onClick={clear} className="hidden text-sm text-muted hover:text-ink sm:block">
          Clear
        </button>
        <Link href="/compare" className="btn-ink h-10 px-5 text-sm">
          Compare
        </Link>
      </div>
    </div>
  );
}
