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
import { currency } from "@/lib/format";
import { LinkField } from "@/components/ui/LinkField";
import { Field, fill, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

/** Reads the URL (needs a Suspense boundary); the server-rendered fallback is the same explorer with no filters. */
export function CarsExplorerFromUrl({ vehicles }: { vehicles: Vehicle[] }) {
  const params = useSearchParams();
  return <CarsExplorer vehicles={vehicles} query={params.toString()} />;
}

export function CarsExplorer({ vehicles, query = "" }: { vehicles: Vehicle[]; query?: string }) {
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [f, setF] = useState<Filters>(() => parseFilters(new URLSearchParams(params.toString())));
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [qDraft, setQDraft] = useState(f.q);
  const text = useText();
  const sorts = useList<{ key: SortKey; label: string }>("cars.explorer.sorts");
  const carsWord = (n: number) => text(n === 1 ? "cars.explorer.carOne" : "cars.explorer.carMany");

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
    ...f.condition.map((c) => ({ label: text(`labels.condition.${c}`) || c, clear: () => set({ condition: f.condition.filter((x) => x !== c) }) })),
    ...f.body.map((b) => ({ label: text(`labels.body.${b}`) || b, clear: () => set({ body: f.body.filter((x) => x !== b) }) })),
    ...f.fuel.map((x) => ({ label: text(`labels.fuel.${x}`) || x, clear: () => set({ fuel: f.fuel.filter((y) => y !== x) }) })),
    ...f.make.map((m) => ({ label: m, clear: () => set({ make: f.make.filter((x) => x !== m) }) })),
    ...f.trans.map((t) => ({ label: text(`labels.transmissionLong.${t}`) || t, clear: () => set({ trans: f.trans.filter((x) => x !== t) }) })),
    ...(f.min ? [{ label: fill(text("cars.explorer.chipFrom"), { currency, n: f.min / 1e6 }), clear: () => set({ min: undefined }) }] : []),
    ...(f.max ? [{ label: fill(text("cars.explorer.chipTo"), { currency, n: f.max / 1e6 }), clear: () => set({ max: undefined }) }] : []),
    ...(f.yearMin ? [{ label: fill(text("cars.explorer.chipYear"), { year: f.yearMin }), clear: () => set({ yearMin: undefined }) }] : []),
    ...(f.kmMax ? [{ label: fill(text("cars.explorer.chipKm"), { km: f.kmMax.toLocaleString("en-LK") }), clear: () => set({ kmMax: undefined }) }] : []),
    ...(f.status === "all" ? [{ label: text("cars.explorer.chipSold"), clear: () => set({ status: "available" }) }] : []),
  ];
  const clearAll = () =>
    setF((p) => ({ ...parseFilters(new URLSearchParams()), sort: p.sort }));

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
      {/* desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-6">
          <div className="mb-6 flex items-center justify-between">
            <Field as="h2" className="font-sans text-sm font-semibold" data-preview-field-path="cars.explorer.filtersTitle" />
            {nActive > 0 && (
              <Field
                as="button"
                type="button"
                onClick={clearAll}
                className="text-sm text-brand hover:underline"
                data-preview-field-path="cars.explorer.clearAll"
              />
            )}
          </div>
          <FilterPanel f={f} set={set} makes={makes} counts={counts} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Field className="sr-only" data-preview-field-path="cars.explorer.searchLabel" />
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder={text("cars.explorer.searchPlaceholder")}
              data-preview-field-path="cars.explorer.searchPlaceholder"
              className="h-12 w-full rounded-full border border-line bg-paper pr-4 pl-11 text-[16px] focus:border-ink focus:outline-none md:text-[0.95rem]"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 text-sm font-medium md:flex-none lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> <Field data-preview-field-path="cars.explorer.filtersButton" />
              {nActive > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[0.7rem] text-on-ink">{nActive}</span>
              )}
            </button>
            <label className="relative flex-1 md:flex-none">
              <Field className="sr-only" data-preview-field-path="cars.explorer.sortLabel" />
              <select
                data-preview-list-path="cars.explorer.sorts"
                value={f.sort}
                onChange={(e) => set({ sort: e.target.value as SortKey })}
                className="h-12 w-full appearance-none rounded-full border border-line bg-paper pr-9 pl-5 text-[16px] font-medium md:w-auto md:text-sm"
              >
                {sorts.map((s, n) => (
                  <option
                    key={`${s.key}-${n}`}
                    value={s.key}
                    data-preview-item-path={`cars.explorer.sorts[${n}]`}
                    data-preview-field-path={`cars.explorer.sorts[${n}].label`}
                  >
                    {s.label}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-muted">
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </label>
            <div className="hidden rounded-full border border-line bg-paper p-1 md:flex" role="group" aria-labelledby="view-label">
              <Field id="view-label" className="sr-only" data-preview-field-path="cars.explorer.viewLabel" />
              <button
                type="button"
                aria-pressed={view === "grid"}
                aria-label={text("cars.explorer.gridView")}
                data-preview-field-path="cars.explorer.gridView"
                onClick={() => setView("grid")}
                className={cn("flex size-10 items-center justify-center rounded-full", view === "grid" ? "bg-ink text-on-ink" : "text-muted hover:text-ink")}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                aria-label={text("cars.explorer.listView")}
                data-preview-field-path="cars.explorer.listView"
                onClick={() => setView("list")}
                className={cn("flex size-10 items-center justify-center rounded-full", view === "list" ? "bg-ink text-on-ink" : "text-muted hover:text-ink")}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-muted-strong" aria-live="polite">
            <strong className="font-semibold text-ink">{results.length}</strong>{" "}
            {results.length === 1 ? (
              <Field data-preview-field-path="cars.explorer.carOne" />
            ) : (
              <Field data-preview-field-path="cars.explorer.carMany" />
            )}
          </p>
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.clear}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface pr-2.5 pl-3 text-xs font-medium text-ink hover:bg-line"
              data-preview-static="Active filter chip, generated from the visitor's current filters"
            >
              {c.label} <X className="size-3.5" aria-label={text("cars.explorer.removeChip")} />
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl bg-surface px-6 py-14 text-center">
            {/* the (empty) car list stays mounted so the Fivora editor can add the first car */}
            <div data-preview-list-path="vehicles" />
            <Lottie
              src="/lottie/searching.json"
              loop
              className="size-28"
              labelId="cars-empty-anim"
              label={<Field id="cars-empty-anim" className="sr-only" data-preview-field-path="cars.explorer.emptyAnimationLabel" />}
            />
            <Field as="h2" className="mt-2 font-display text-xl font-semibold" data-preview-field-path="cars.explorer.emptyTitle" />
            <Field as="p" className="mt-2 max-w-sm text-sm text-muted" data-preview-field-path="cars.explorer.emptyText" />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Field as="button" type="button" onClick={clearAll} className="btn-ink" data-preview-field-path="cars.explorer.emptyClear" />
              <LinkField data-preview-field-path="cars.explorer.emptyAskHref" className="btn-line">
                <Field data-preview-field-path="cars.explorer.emptyAskLabel" />
              </LinkField>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-preview-list-path="vehicles">
            {results.map((v, i) => (
              <VehicleCard key={v.id} v={v} index={i} priority={i < 3} sizes="(min-width:1280px) 300px, (min-width:640px) 45vw, 100vw" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-3" data-preview-list-path="vehicles">
            {results.map((v, i) => (
              <VehicleRow key={v.id} v={v} priority={i < 3} />
            ))}
          </div>
        )}
      </div>

      {/* mobile / tablet filter sheet */}
      <div
        className={cn("fixed inset-0 z-55 lg:hidden", sheet ? "visible" : "invisible")}
        inert={!sheet}
      >
        <div
          className={cn("absolute inset-0 bg-night/40 transition-opacity duration-300", sheet ? "opacity-100" : "opacity-0")}
          onClick={() => setSheet(false)}
        />
        <div
          role="dialog"
          aria-labelledby="filters-sheet-title"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-paper transition-transform duration-300 ease-out-soft",
            sheet ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="mx-auto mb-2 hidden h-1 w-10 rounded-full bg-line" />
            <Field as="h2" id="filters-sheet-title" className="font-sans text-base font-semibold" data-preview-field-path="cars.explorer.sheetTitle" />
            <div className="flex items-center gap-3">
              {nActive > 0 && (
                <Field as="button" type="button" onClick={clearAll} className="text-sm text-brand" data-preview-field-path="cars.explorer.sheetClear" />
              )}
              <button
                type="button"
                aria-label={text("cars.explorer.sheetCloseLabel")}
                data-preview-field-path="cars.explorer.sheetCloseLabel"
                onClick={() => setSheet(false)}
                className="flex size-10 items-center justify-center rounded-full bg-surface"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            <FilterPanel f={f} set={set} makes={makes} counts={counts} />
          </div>
          <div className="safe-bottom border-t border-line px-6 pt-3 pb-4">
            <Field
              as="button"
              type="button"
              onClick={() => setSheet(false)}
              className="btn-ink w-full"
              data-preview-field-path="cars.explorer.sheetShow"
              format={(t) => fill(t, { count: results.length, cars: carsWord(results.length) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
