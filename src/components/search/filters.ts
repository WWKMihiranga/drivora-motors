import type { Vehicle } from "@/types";

export type SortKey = "recommended" | "newest" | "price-asc" | "price-desc" | "mileage" | "year";

export interface Filters {
  q: string;
  condition: string[];
  make: string[];
  body: string[];
  fuel: string[];
  trans: string[];
  min?: number;
  max?: number;
  yearMin?: number;
  kmMax?: number;
  status: "available" | "all";
  sort: SortKey;
}

const list = (p: URLSearchParams, k: string) => (p.get(k) ? p.get(k)!.split(",").filter(Boolean) : []);
const n = (p: URLSearchParams, k: string) => (p.get(k) ? Number(p.get(k)) || undefined : undefined);

export function parseFilters(p: URLSearchParams): Filters {
  return {
    q: p.get("q") ?? "",
    condition: list(p, "condition"),
    make: list(p, "make"),
    body: list(p, "body"),
    fuel: list(p, "fuel"),
    trans: list(p, "trans"),
    min: n(p, "min"),
    max: n(p, "max"),
    yearMin: n(p, "year"),
    kmMax: n(p, "km"),
    status: p.get("status") === "all" ? "all" : "available",
    sort: (p.get("sort") as SortKey) ?? "recommended",
  };
}

export function toParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.condition.length) p.set("condition", f.condition.join(","));
  if (f.make.length) p.set("make", f.make.join(","));
  if (f.body.length) p.set("body", f.body.join(","));
  if (f.fuel.length) p.set("fuel", f.fuel.join(","));
  if (f.trans.length) p.set("trans", f.trans.join(","));
  if (f.min) p.set("min", String(f.min));
  if (f.max) p.set("max", String(f.max));
  if (f.yearMin) p.set("year", String(f.yearMin));
  if (f.kmMax) p.set("km", String(f.kmMax));
  if (f.status === "all") p.set("status", "all");
  if (f.sort !== "recommended") p.set("sort", f.sort);
  return p;
}

export function activeCount(f: Filters) {
  return (
    f.condition.length +
    f.make.length +
    f.body.length +
    f.fuel.length +
    f.trans.length +
    (f.min ? 1 : 0) +
    (f.max ? 1 : 0) +
    (f.yearMin ? 1 : 0) +
    (f.kmMax ? 1 : 0) +
    (f.status === "all" ? 1 : 0)
  );
}

export function applyFilters(all: Vehicle[], f: Filters): Vehicle[] {
  const q = f.q.trim().toLowerCase();
  const out = all.filter((v) => {
    if (f.status === "available" && v.status === "sold") return false;
    if (q && !`${v.make} ${v.model} ${v.grade ?? ""} ${v.yom} ${v.colour}`.toLowerCase().includes(q)) return false;
    if (f.condition.length && !f.condition.includes(v.condition)) return false;
    if (f.make.length && !f.make.includes(v.make)) return false;
    if (f.body.length && !f.body.includes(v.bodyType)) return false;
    if (f.fuel.length && !f.fuel.includes(v.fuel)) return false;
    if (f.trans.length && !f.trans.includes(v.transmission)) return false;
    if (f.min && v.priceLkr < f.min) return false;
    if (f.max && v.priceLkr > f.max) return false;
    if (f.yearMin && v.yom < f.yearMin) return false;
    if (f.kmMax && v.mileageKm > f.kmMax) return false;
    return true;
  });
  const by: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
    recommended: (a, b) =>
      Number(a.status !== "available") - Number(b.status !== "available") || a.listedDaysAgo - b.listedDaysAgo,
    newest: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
    "price-asc": (a, b) => a.priceLkr - b.priceLkr,
    "price-desc": (a, b) => b.priceLkr - a.priceLkr,
    mileage: (a, b) => a.mileageKm - b.mileageKm,
    year: (a, b) => b.yom - a.yom,
  };
  return out.sort(by[f.sort] ?? by.recommended);
}
