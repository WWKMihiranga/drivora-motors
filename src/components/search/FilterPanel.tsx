"use client";

import type { Filters } from "./filters";
import { cn } from "@/lib/cn";
import { Field, fill, LabelField, useContent, useList, useText } from "@/lib/site-data";

export function FilterPanel({
  f,
  set,
  makes,
  counts,
}: {
  f: Filters;
  set: (patch: Partial<Filters>) => void;
  makes: string[];
  counts: { condition: Record<string, number>; fuel: Record<string, number>; body: Record<string, number>; make: Record<string, number> };
}) {
  const text = useText();
  const labels = useContent().labels as Record<string, Record<string, string>> | undefined;
  const keys = (group: string) => Object.keys(labels?.[group] ?? {});
  const priceSteps = useList<number>("cars.filters.priceSteps").map((m) => m * 1_000_000);
  const yearOptions = useList<number>("cars.filters.yearOptions");
  const mileageOptions = useList<number>("cars.filters.mileageOptions");
  const toggle = (key: "condition" | "make" | "body" | "fuel" | "trans", val: string) => {
    const cur = f[key];
    set({ [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] } as Partial<Filters>);
  };

  return (
    <div className="space-y-7">
      <Group title={<Field data-preview-field-path="cars.filters.condition" />}>
        <div className="flex flex-wrap gap-2">
          {keys("condition").map((c) => (
            <Pill key={c} on={f.condition.includes(c)} onClick={() => toggle("condition", c)} count={counts.condition[c] ?? 0}>
              <LabelField group="condition" value={c} />
            </Pill>
          ))}
        </div>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.price" />}>
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label={text("cars.filters.minPriceLabel")}
            data-preview-field-path="cars.filters.minPriceLabel"
            data-preview-list-path="cars.filters.priceSteps"
            value={f.min ?? ""}
            onChange={(e) => set({ min: Number(e.target.value) || undefined })}
            className="field-select h-11 text-sm"
          >
            <option value="">{text("cars.filters.noMin")}</option>
            {priceSteps.map((p, n) => (
              <option
                key={p}
                value={p}
                data-preview-item-path={`cars.filters.priceSteps[${n}]`}
                data-preview-field-path={`cars.filters.priceSteps[${n}]`}
              >
                {fill(text("cars.filters.priceStepLabel"), { n: p / 1_000_000 })}
              </option>
            ))}
          </select>
          <select
            aria-label={text("cars.filters.maxPriceLabel")}
            data-preview-field-path="cars.filters.maxPriceLabel"
            value={f.max ?? ""}
            onChange={(e) => set({ max: Number(e.target.value) || undefined })}
            className="field-select h-11 text-sm"
          >
            <option value="">{text("cars.filters.noMax")}</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {fill(text("cars.filters.priceStepLabel"), { n: p / 1_000_000 })}
              </option>
            ))}
          </select>
        </div>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.body" />}>
        <div className="grid grid-cols-2 gap-2">
          {keys("body")
            .filter((b) => (counts.body[b] ?? 0) > 0 || f.body.includes(b))
            .map((b) => (
              <Pill key={b} on={f.body.includes(b)} onClick={() => toggle("body", b)} count={counts.body[b] ?? 0} block>
                <LabelField group="body" value={b} />
              </Pill>
            ))}
        </div>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.fuel" />}>
        <div className="flex flex-wrap gap-2">
          {keys("fuel")
            .filter((x) => (counts.fuel[x] ?? 0) > 0 || f.fuel.includes(x))
            .map((x) => (
              <Pill key={x} on={f.fuel.includes(x)} onClick={() => toggle("fuel", x)} count={counts.fuel[x] ?? 0}>
                <LabelField group="fuel" value={x} />
              </Pill>
            ))}
        </div>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.make" />}>
        <ul className="max-h-60 space-y-0.5 overflow-y-auto pr-1">
          {makes.map((m) => (
            <li key={m}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm hover:bg-surface">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary rounded-[5px]"
                  checked={f.make.includes(m)}
                  onChange={() => toggle("make", m)}
                />
                <span className="flex-1" data-preview-static="Make name, generated from the cars in your inventory">
                  {m}
                </span>
                <span className="text-xs text-muted">{counts.make[m] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.yearFrom" />}>
        <select
          aria-label={text("cars.filters.yearFrom")}
          data-preview-field-path="cars.filters.anyYear"
          data-preview-list-path="cars.filters.yearOptions"
          value={f.yearMin ?? ""}
          onChange={(e) => set({ yearMin: Number(e.target.value) || undefined })}
          className="field-select h-11 text-sm"
        >
          <option value="">{text("cars.filters.anyYear")}</option>
          {yearOptions.map((y, n) => (
            <option
              key={y}
              value={y}
              data-preview-item-path={`cars.filters.yearOptions[${n}]`}
              data-preview-field-path={`cars.filters.yearOptions[${n}]`}
            >
              {fill(text("cars.filters.yearOption"), { year: y })}
            </option>
          ))}
        </select>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.mileage" />}>
        <select
          aria-label={text("cars.filters.mileageLabel")}
          data-preview-field-path="cars.filters.anyMileage"
          data-preview-list-path="cars.filters.mileageOptions"
          value={f.kmMax ?? ""}
          onChange={(e) => set({ kmMax: Number(e.target.value) || undefined })}
          className="field-select h-11 text-sm"
        >
          <option value="">{text("cars.filters.anyMileage")}</option>
          {mileageOptions.map((k, n) => (
            <option
              key={k}
              value={k}
              data-preview-item-path={`cars.filters.mileageOptions[${n}]`}
              data-preview-field-path={`cars.filters.mileageOptions[${n}]`}
            >
              {fill(text("cars.filters.mileageOption"), { km: k.toLocaleString("en-LK") })}
            </option>
          ))}
        </select>
      </Group>

      <Group title={<Field data-preview-field-path="cars.filters.gearbox" />}>
        <div className="flex gap-2">
          <Pill on={f.trans.includes("auto")} onClick={() => toggle("trans", "auto")}>
            <LabelField group="transmissionLong" value="auto" />
          </Pill>
          <Pill on={f.trans.includes("manual")} onClick={() => toggle("trans", "manual")}>
            <LabelField group="transmissionLong" value="manual" />
          </Pill>
        </div>
      </Group>

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
        <Field data-preview-field-path="cars.filters.showSold" />
        <input
          type="checkbox"
          className="switch switch-primary"
          checked={f.status === "all"}
          onChange={(e) => set({ status: e.target.checked ? "all" : "available" })}
        />
      </label>
    </div>
  );
}

function Group({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">{title}</legend>
      {children}
    </fieldset>
  );
}

function Pill({
  on,
  onClick,
  children,
  count,
  block,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  block?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-between gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
        block && "w-full",
        on ? "border-ink bg-ink text-on-ink" : "border-line bg-paper text-ink hover:border-ink/40",
      )}
    >
      {children}
      {count !== undefined && <span className={cn("text-xs", on ? "text-white/60" : "text-muted")}>{count}</span>}
    </button>
  );
}
