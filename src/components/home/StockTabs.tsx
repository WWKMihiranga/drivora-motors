"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "all", label: "All", href: "/cars", test: () => true },
  { key: "recon", label: "Reconditioned", href: "/cars?condition=reconditioned", test: (v: Vehicle) => v.condition === "reconditioned" },
  { key: "used", label: "Used", href: "/cars?condition=used", test: (v: Vehicle) => v.condition === "used" },
  { key: "new", label: "Brand new", href: "/cars?condition=brand-new", test: (v: Vehicle) => v.condition === "brand-new" },
  {
    key: "green",
    label: "EV & hybrid",
    href: "/cars?fuel=hybrid,electric",
    test: (v: Vehicle) => v.fuel === "electric" || v.fuel === "hybrid" || v.fuel === "plug-in-hybrid",
  },
] as const;

export function StockTabs({ vehicles }: { vehicles: Vehicle[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const current = tabs.find((t) => t.key === tab)!;
  const list = useMemo(() => vehicles.filter(current.test), [vehicles, current]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter stock"
        className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0"
      >
        {tabs.map((t) => {
          const count = vehicles.filter(t.test).length;
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
                tab === t.key ? "border-ink bg-ink text-on-ink" : "border-line bg-paper text-ink hover:border-ink/40",
              )}
            >
              {t.label} <span className={cn("ml-1 text-xs", tab === t.key ? "text-white/60" : "text-muted")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="no-scrollbar snap-x-mandatory -mx-6 mt-6 flex gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3"
      >
        {list.slice(0, 6).map((v, idx) => (
          <VehicleCard
            key={v.id}
            v={v}
            index={idx}
            className="w-[82%] shrink-0 snap-start sm:w-auto"
            sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 82vw"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href={current.href} className="btn-line">
          See all {list.length} {current.key === "all" ? "cars" : current.label.toLowerCase()} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
