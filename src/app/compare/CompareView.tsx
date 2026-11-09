"use client";

import Link from "next/link";
import { Plus, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { Photo } from "@/components/ui/Photo";
import { num, rs, vehicleTitle } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";
import { useApp, useHydrated } from "@/store";
import type { Vehicle } from "@/types";
import { cn } from "@/lib/cn";
import { LinkField } from "@/components/ui/LinkField";
import { Field, fill, useText } from "@/lib/site-data";

type Row = { label: React.ReactNode; key: string; get: (v: Vehicle) => string | number; best?: "min" | "max"; money?: boolean };

const CMP = "Comparison value taken from each car's listing";

/* Wording is editable in Fivora (site-data.json `compare.view`); values come from each car. */
export function CompareView() {
  const text = useText();
  const rows: Row[] = [
    { key: "price", label: <Field data-preview-field-path="compare.view.rowPrice" />, get: (v) => v.priceLkr, best: "min", money: true },
    { key: "monthly", label: <Field data-preview-field-path="compare.view.rowMonthly" />, get: (v) => Math.round(monthlyFrom(v)), best: "min", money: true },
    { key: "condition", label: <Field data-preview-field-path="compare.view.rowCondition" />, get: (v) => text(`labels.condition.${v.condition}`) || v.condition },
    { key: "year", label: <Field data-preview-field-path="compare.view.rowYear" />, get: (v) => v.yom, best: "max" },
    { key: "mileage", label: <Field data-preview-field-path="compare.view.rowMileage" />, get: (v) => v.mileageKm, best: "min" },
    { key: "fuel", label: <Field data-preview-field-path="compare.view.rowFuel" />, get: (v) => text(`labels.fuel.${v.fuel}`) || v.fuel },
    {
      key: "engine",
      label: <Field data-preview-field-path="compare.view.rowEngine" />,
      get: (v) => (v.batteryKwh ? `${v.batteryKwh} ${text("common.units.kwh")}` : `${num(v.engineCc ?? 0)} ${text("common.units.cc")}`),
    },
    { key: "gearbox", label: <Field data-preview-field-path="compare.view.rowGearbox" />, get: (v) => text(`labels.transmissionLong.${v.transmission}`) || v.transmission },
    { key: "seats", label: <Field data-preview-field-path="compare.view.rowSeats" />, get: (v) => v.seats, best: "max" },
    { key: "grade", label: <Field data-preview-field-path="compare.view.rowGrade" />, get: (v) => v.auctionGrade ?? "—" },
    {
      key: "owners",
      label: <Field data-preview-field-path="compare.view.rowOwners" />,
      get: (v) => v.owners ?? (v.condition === "used" ? "—" : text("compare.view.ownersNew")),
    },
    { key: "colour", label: <Field data-preview-field-path="compare.view.rowColour" />, get: (v) => v.colour },
  ];
  const fmt = (r: Row, val: string | number) => (typeof val === "number" ? (r.money ? rs(val) : num(val)) : val);

  const mounted = useHydrated();
  const ids = useApp((s) => s.compare);
  const toggle = useApp((s) => s.toggleCompare);
  const cars = ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean) as Vehicle[];

  if (!mounted) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (cars.length === 0)
    return (
      <div className="rounded-3xl bg-surface px-6 py-16 text-center">
        <Field as="h2" className="font-display text-xl font-semibold" data-preview-field-path="compare.view.emptyTitle" />
        <Field as="p" className="mx-auto mt-2 max-w-sm text-sm text-muted" data-preview-field-path="compare.view.emptyText" />
        <LinkField data-preview-field-path="compare.view.browseHref" className="btn-ink mt-6">
          <Field data-preview-field-path="compare.view.browseLabel" />
        </LinkField>
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
        <Field as="caption" className="sr-only" data-preview-field-path="compare.view.caption" />
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
                    aria-label={fill(text("compare.view.removeLabel"), { car: vehicleTitle(v) })}
                    data-preview-field-path="compare.view.removeLabel"
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-paper/95"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Link
                  href={`/cars/${v.slug}`}
                  className="mt-3 block font-display text-base font-semibold hover:underline"
                  data-preview-static="The car's own title, editable on its listing"
                >
                  {vehicleTitle(v)}
                </Link>
                <p className="text-xs text-muted" data-preview-static="The car's own grade, editable on its listing">
                  {v.grade}
                </p>
              </th>
            ))}
            {cars.length < 3 && (
              <th className="px-2 pb-5 align-top">
                <LinkField
                  data-preview-field-path="compare.view.addHref"
                  className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 text-sm font-medium text-muted hover:border-ink hover:text-ink"
                >
                  <Plus className="size-5" /> <Field data-preview-field-path="compare.view.addLabel" />
                </LinkField>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const b = bestIdx(r);
            return (
              <tr key={r.key}>
                <th scope="row" className="border-t border-line py-3 pr-3 text-left text-xs font-medium tracking-wide text-muted uppercase">
                  {r.label}
                </th>
                {cars.map((v, k) => (
                  <td key={v.id} className={cn("border-t border-line px-2 py-3 font-medium", k === b && "text-ok")} data-num>
                    <span data-preview-static={CMP}>{fmt(r, r.get(v))}</span>
                    {k === b && (
                      <Field
                        className="ml-1.5 rounded-full bg-ok/10 px-1.5 py-0.5 text-[0.65rem] font-semibold"
                        data-preview-field-path="compare.view.best"
                      />
                    )}
                  </td>
                ))}
                {cars.length < 3 && <td className="border-t border-line" />}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Field as="p" className="mt-4 text-xs text-muted" data-preview-field-path="compare.view.footnote" />
    </div>
  );
}
