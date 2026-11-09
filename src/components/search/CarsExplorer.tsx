"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import type { Vehicle } from "@/types";
import { activeCount, applyFilters, parseFilters, toParams, type Filters, type SortKey } from "./filters";
import { FilterPanel } from "./FilterPanel";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehicleRow } from "@/components/vehicle/VehicleRow";
import { Lottie } from "@/components/ui/Lottie";
import { bodyLabel, conditionLabel, fuelLabel } from "@/lib/format";
import { cn } from "@/lib/cn";

const sorts: [SortKey, string][] = [
  ["recommended", "Best match"],
  ["newest", "Newest listings"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["mileage", "Lowest mileage"],
  ["year", "Newest year"],
];

export function CarsExplorer({ vehicles }: { vehicles: Vehicle[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [f, setF] = useState<Filters>(() => parseFilters(new URLSearchParams(params.toString())));
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [qDraft, setQDraft] = useState(f.q);

  // keep URL in sync (shareable searches), without scrolling or adding history entries
  useEffect(() => {
    const qs = toParams(f).toString();
    if (qs !== params.toString()) {
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  // react to navigation from elsewhere (footer links, chat links) while this page stays mounted
  const paramsKey = params.toString();
  const [lastKey, setLastKey] = useState(paramsKey);
  if (paramsKey !== lastKey) {
    setLastKey(paramsKey);
    if (toParams(f).toString() !== paramsKey) {
      const next = parseFilters(new URLSearchParams(paramsKey));
      setF(next);
      setQDraft(next.q);
    }
  }

  // debounce free-text search
  useEffect(() => {
    const t = window.setTimeout(() => setF((p) => (p.q === qDraft ? p : { ...p, q: qDraft })), 250);
    return () => window.clearTimeout(t);
  }, [qDraft]);

  useEffect(() => {
    if (!sheet) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const set = (patch: Partial<Filters>) => setF((p) => ({ ...p, ...patch }));
  const results = useMemo(() => applyFilters(vehicles, f), [vehicles, f]);
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make))].sort(), [vehicles]);
  const counts = useMemo(() => {
    const base = vehicles.filter((v) => f.status === "all" || v.status !== "sold");
    const tally = (k: keyof Vehicle) =>
      base.reduce<Record<string, number>>((a, v) => ((a[String(v[k])] = (a[String(v[k])] ?? 0) + 1), a), {});
    return { condition: tally("condition"), fuel: tally("fuel"), body: tally("bodyType"), make: tally("make") };
  }, [vehicles, f.status]);
  const nActive = activeCount(f);

  const chips: { label: string; clear: () => void }[] = [
    ...f.condition.map((c) => ({ label: conditionLabel[c as keyof typeof conditionLabel], clear: () => set({ condition: f.condition.filter((x) => x !== c) }) })),
    ...f.body.map((b) => ({ label: bodyLabel[b as keyof typeof bodyLabel] ?? b, clear: () => set({ body: f.body.filter((x) => x !== b) }) })),
    ...f.fuel.map((x) => ({ label: fuelLabel[x as keyof typeof fuelLabel] ?? x, clear: () => set({ fuel: f.fuel.filter((y) => y !== x) }) })),
    ...f.make.map((m) => ({ label: m, clear: () => set({ make: f.make.filter((x) => x !== m) }) })),
    ...f.trans.map((t) => ({ label: t === "auto" ? "Automatic" : "Manual", clear: () => set({ trans: f.trans.filter((x) => x !== t) }) })),
    ...(f.min ? [{ label: `From Rs ${f.min / 1e6}M`, clear: () => set({ min: undefined }) }] : []),
    ...(f.max ? [{ label: `Up to Rs ${f.max / 1e6}M`, clear: () => set({ max: undefined }) }] : []),
    ...(f.yearMin ? [{ label: `${f.yearMin}+`, clear: () => set({ yearMin: undefined }) }] : []),
    ...(f.kmMax ? [{ label: `≤ ${f.kmMax.toLocaleString("en-LK")} km`, clear: () => set({ kmMax: undefined }) }] : []),
    ...(f.status === "all" ? [{ label: "Including sold", clear: () => set({ status: "available" }) }] : []),
  ];
  const clearAll = () =>
    setF((p) => ({ ...parseFilters(new URLSearchParams()), sort: p.sort }));

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
      {/* desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-sans text-sm font-semibold">Filters</h2>
            {nActive > 0 && (
              <button type="button" onClick={clearAll} className="text-sm text-brand hover:underline">
                Clear all
              </button>
            )}
          </div>
          <FilterPanel f={f} set={set} makes={makes} counts={counts} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search cars</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Search make, model or colour"
              className="h-12 w-full rounded-full border border-line bg-paper pr-4 pl-11 text-[16px] focus:border-ink focus:outline-none md:text-[0.95rem]"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 text-sm font-medium md:flex-none lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
              {nActive > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[0.7rem] text-on-ink">{nActive}</span>
              )}
            </button>
            <label className="relative flex-1 md:flex-none">
              <span className="sr-only">Sort by</span>
              <select
                value={f.sort}
                onChange={(e) => set({ sort: e.target.value as SortKey })}
                className="h-12 w-full appearance-none rounded-full border border-line bg-paper pr-9 pl-5 text-[16px] font-medium md:w-auto md:text-sm"
              >
                {sorts.map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-muted">
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </label>
            <div className="hidden rounded-full border border-line bg-paper p-1 md:flex" role="group" aria-label="View">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  aria-label={`${v} view`}
                  onClick={() => setView(v)}
                  className={cn("flex size-10 items-center justify-center rounded-full", view === v ? "bg-ink text-on-ink" : "text-muted hover:text-ink")}
                >
                  {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-muted-strong" aria-live="polite">
            <strong className="font-semibold text-ink">{results.length}</strong> {results.length === 1 ? "car" : "cars"}
          </p>
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.clear}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface pr-2.5 pl-3 text-xs font-medium text-ink hover:bg-line"
            >
              {c.label} <X className="size-3.5" aria-label="remove" />
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl bg-surface px-6 py-14 text-center">
            <Lottie src="/lottie/searching.json" loop className="size-28" label="Searching" />
            <h2 className="mt-2 font-display text-xl font-semibold">No cars match those filters</h2>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Try removing a filter, or tell us what you want. We often have cars arriving that aren&apos;t listed yet.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={clearAll} className="btn-ink">
                Clear filters
              </button>
              <a href="/contact" className="btn-line">
                Ask us to find one
              </a>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((v, i) => (
              <VehicleCard key={v.id} v={v} index={i} priority={i < 3} sizes="(min-width:1280px) 300px, (min-width:640px) 45vw, 100vw" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {results.map((v, i) => (
              <VehicleRow key={v.id} v={v} priority={i < 3} />
            ))}
          </div>
        )}
      </div>

      {/* mobile / tablet filter sheet */}
      <div
        className={cn("fixed inset-0 z-55 lg:hidden", sheet ? "visible" : "invisible")}
        aria-hidden={!sheet}
        inert={!sheet}
      >
        <div
          className={cn("absolute inset-0 bg-night/40 transition-opacity duration-300", sheet ? "opacity-100" : "opacity-0")}
          onClick={() => setSheet(false)}
        />
        <div
          role="dialog"
          aria-label="Filters"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-paper transition-transform duration-300 ease-out-soft",
            sheet ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="mx-auto mb-2 hidden h-1 w-10 rounded-full bg-line" />
            <h2 className="font-sans text-base font-semibold">Filters</h2>
            <div className="flex items-center gap-3">
              {nActive > 0 && (
                <button type="button" onClick={clearAll} className="text-sm text-brand">
                  Clear
                </button>
              )}
              <button type="button" aria-label="Close filters" onClick={() => setSheet(false)} className="flex size-10 items-center justify-center rounded-full bg-surface">
                <X className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            <FilterPanel f={f} set={set} makes={makes} counts={counts} />
          </div>
          <div className="safe-bottom border-t border-line px-6 pt-3 pb-4">
            <button type="button" onClick={() => setSheet(false)} className="btn-ink w-full">
              Show {results.length} {results.length === 1 ? "car" : "cars"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
