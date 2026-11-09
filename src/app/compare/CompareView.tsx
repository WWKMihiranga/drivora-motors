"use client";

import Link from "next/link";
import { Plus, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { Photo } from "@/components/ui/Photo";
import { conditionLabel, fuelLabel, num, rs, vehicleTitle } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";
import { useApp, useHydrated } from "@/store";
import type { Vehicle } from "@/types";
import { cn } from "@/lib/cn";

type Row = { label: string; get: (v: Vehicle) => string | number; best?: "min" | "max" };

const rows: Row[] = [
  { label: "Price", get: (v) => v.priceLkr, best: "min" },
  { label: "Monthly from*", get: (v) => Math.round(monthlyFrom(v)), best: "min" },
  { label: "Condition", get: (v) => conditionLabel[v.condition] },
  { label: "Year", get: (v) => v.yom, best: "max" },
  { label: "Mileage (km)", get: (v) => v.mileageKm, best: "min" },
  { label: "Fuel", get: (v) => fuelLabel[v.fuel] },
  { label: "Engine / battery", get: (v) => (v.batteryKwh ? `${v.batteryKwh} kWh` : `${num(v.engineCc ?? 0)} cc`) },
  { label: "Gearbox", get: (v) => (v.transmission === "auto" ? "Automatic" : "Manual") },
  { label: "Seats", get: (v) => v.seats, best: "max" },
  { label: "Auction grade", get: (v) => v.auctionGrade ?? "—" },
  { label: "Owners", get: (v) => v.owners ?? (v.condition === "used" ? "—" : "0 in Sri Lanka") },
  { label: "Colour", get: (v) => v.colour },
];

const fmt = (label: string, val: string | number) =>
  typeof val === "number" ? (label.startsWith("Price") || label.startsWith("Monthly") ? rs(val) : num(val)) : val;

export function CompareView() {
  const mounted = useHydrated();
  const ids = useApp((s) => s.compare);
  const toggle = useApp((s) => s.toggleCompare);
  const cars = ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean) as Vehicle[];

  if (!mounted) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (cars.length === 0)
    return (
      <div className="rounded-3xl bg-surface px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold">Nothing to compare yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Tick &ldquo;Compare&rdquo; on up to three cars and they&apos;ll line up here, side by side.</p>
        <Link href="/cars" className="btn-ink mt-6">
          Browse cars
        </Link>
      </div>
    );

  const bestIdx = (r: Row) => {
    if (!r.best || cars.length < 2) return -1;
    const vals = cars.map((c) => r.get(c) as number);
    const target = r.best === "min" ? Math.min(...vals) : Math.max(...vals);
    return vals.filter((x) => x === target).length === 1 ? vals.indexOf(target) : -1;
  };

  return (
    <div className="no-scrollbar -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <table className="w-full min-w-160 table-fixed border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Car comparison</caption>
        <thead>
          <tr>
            <th className="w-36 md:w-48" />
            {cars.map((v) => (
              <th key={v.id} scope="col" className="px-2 pb-5 text-left align-top font-normal">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface">
                  <Photo id={v.images[0]} alt={vehicleTitle(v)} fill crop="4:3" sizes="300px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => toggle(v.id)}
                    aria-label={`Remove ${vehicleTitle(v)}`}
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-paper/95"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Link href={`/cars/${v.slug}`} className="mt-3 block font-display text-base font-semibold hover:underline">
                  {vehicleTitle(v)}
                </Link>
                <p className="text-xs text-muted">{v.grade}</p>
              </th>
            ))}
            {cars.length < 3 && (
              <th className="px-2 pb-5 align-top">
                <Link
                  href="/cars"
                  className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 text-sm font-medium text-muted hover:border-ink hover:text-ink"
                >
                  <Plus className="size-5" /> Add a car
                </Link>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const b = bestIdx(r);
            return (
              <tr key={r.label}>
                <th scope="row" className="border-t border-line py-3 pr-3 text-left text-xs font-medium tracking-wide text-muted uppercase">
                  {r.label}
                </th>
                {cars.map((v, k) => (
                  <td key={v.id} className={cn("border-t border-line px-2 py-3 font-medium", k === b && "text-ok")} data-num>
                    {fmt(r.label, r.get(v))}
                    {k === b && <span className="ml-1.5 rounded-full bg-ok/10 px-1.5 py-0.5 text-[0.65rem] font-semibold">best</span>}
                  </td>
                ))}
                {cars.length < 3 && <td className="border-t border-line" />}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted">*Minimum legal down payment, 60 months, sample reducing-balance rate.</p>
    </div>
  );
}
