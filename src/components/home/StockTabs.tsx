"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { LinkField } from "@/components/ui/LinkField";
import { Field, fill, useList } from "@/lib/site-data";
import { cn } from "@/lib/cn";

type Tab = { label: string; filter: string; href: string; seeAllLabel: string };

/** What each tab's `filter` value (editable in Fivora) selects. Unknown values show all cars. */
function matches(filter: string, v: Vehicle) {
  if (filter === "green") return v.fuel === "electric" || v.fuel === "hybrid" || v.fuel === "plug-in-hybrid";
  if (filter === "reconditioned" || filter === "used" || filter === "brand-new") return v.condition === filter;
  if (filter === "electric" || filter === "hybrid" || filter === "petrol" || filter === "diesel") return v.fuel === filter;
  return true;
}

export function StockTabs({ vehicles }: { vehicles: Vehicle[] }) {
  const tabs = useList<Tab>("home.stock.tabs");
  const [tab, setTab] = useState(0);
  const t = Math.min(tab, Math.max(tabs.length - 1, 0));
  const current = tabs[t];
  const list = useMemo(() => vehicles.filter((v) => (current ? matches(current.filter, v) : true)), [vehicles, current]);

  return (
    <div>
      <div
        role="tablist"
        aria-labelledby="stock-tabs-label"
        className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0"
        data-preview-list-path="home.stock.tabs"
      >
        <Field id="stock-tabs-label" className="sr-only" data-preview-field-path="home.stock.tablistLabel" />
        {tabs.map((tb, i) => {
          const count = vehicles.filter((v) => matches(tb.filter, v)).length;
          return (
            <button
              key={`${tb.filter}-${i}`}
              role="tab"
              type="button"
              aria-selected={t === i}
              onClick={() => setTab(i)}
              data-preview-item-path={`home.stock.tabs[${i}]`}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
                t === i ? "border-ink bg-ink text-on-ink" : "border-line bg-paper text-ink hover:border-ink/40",
              )}
            >
              <Field data-preview-field-path={`home.stock.tabs[${i}].label`} />{" "}
              <span className={cn("ml-1 text-xs", t === i ? "text-white/60" : "text-muted")}>{count}</span>
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

      {current && (
        <div className="mt-8 flex justify-center">
          <LinkField data-preview-field-path={`home.stock.tabs[${t}].href`} className="btn-line">
            <Field
              data-preview-field-path="home.stock.seeAll"
              format={(tpl) => fill(tpl, { count: list.length, label: current.seeAllLabel })}
            />{" "}
            <ArrowRight className="size-4" />
          </LinkField>
        </div>
      )}
    </div>
  );
}
