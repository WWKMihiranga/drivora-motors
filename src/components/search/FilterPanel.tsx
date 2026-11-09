"use client";

import type { Filters } from "./filters";
import { bodyLabel, conditionLabel, fuelLabel } from "@/lib/format";
import { cn } from "@/lib/cn";

const priceSteps = [5, 7, 10, 15, 20, 25, 35, 50, 75, 100].map((m) => m * 1_000_000);

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
  const toggle = (key: "condition" | "make" | "body" | "fuel" | "trans", val: string) => {
    const cur = f[key];
    set({ [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] } as Partial<Filters>);
  };

  return (
    <div className="space-y-7">
      <Group title="Condition">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(conditionLabel) as (keyof typeof conditionLabel)[]).map((c) => (
            <Pill key={c} on={f.condition.includes(c)} onClick={() => toggle("condition", c)} count={counts.condition[c] ?? 0}>
              {conditionLabel[c]}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="Price (Rs)">
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Minimum price"
            value={f.min ?? ""}
            onChange={(e) => set({ min: Number(e.target.value) || undefined })}
            className="field-select h-11 text-sm"
          >
            <option value="">No min</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {p / 1_000_000}M
              </option>
            ))}
          </select>
          <select
            aria-label="Maximum price"
            value={f.max ?? ""}
            onChange={(e) => set({ max: Number(e.target.value) || undefined })}
            className="field-select h-11 text-sm"
          >
            <option value="">No max</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {p / 1_000_000}M
              </option>
            ))}
          </select>
        </div>
      </Group>

      <Group title="Body type">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(bodyLabel) as (keyof typeof bodyLabel)[])
            .filter((b) => (counts.body[b] ?? 0) > 0 || f.body.includes(b))
            .map((b) => (
              <Pill key={b} on={f.body.includes(b)} onClick={() => toggle("body", b)} count={counts.body[b] ?? 0} block>
                {bodyLabel[b]}
              </Pill>
            ))}
        </div>
      </Group>

      <Group title="Fuel">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(fuelLabel) as (keyof typeof fuelLabel)[])
            .filter((x) => (counts.fuel[x] ?? 0) > 0 || f.fuel.includes(x))
            .map((x) => (
              <Pill key={x} on={f.fuel.includes(x)} onClick={() => toggle("fuel", x)} count={counts.fuel[x] ?? 0}>
                {fuelLabel[x]}
              </Pill>
            ))}
        </div>
      </Group>

      <Group title="Make">
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
                <span className="flex-1">{m}</span>
                <span className="text-xs text-muted">{counts.make[m] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Year from">
        <select
          aria-label="Year from"
          value={f.yearMin ?? ""}
          onChange={(e) => set({ yearMin: Number(e.target.value) || undefined })}
          className="field-select h-11 text-sm"
        >
          <option value="">Any year</option>
          {[2024, 2022, 2020, 2018, 2016].map((y) => (
            <option key={y} value={y}>
              {y} or newer
            </option>
          ))}
        </select>
      </Group>

      <Group title="Mileage up to">
        <select
          aria-label="Maximum mileage"
          value={f.kmMax ?? ""}
          onChange={(e) => set({ kmMax: Number(e.target.value) || undefined })}
          className="field-select h-11 text-sm"
        >
          <option value="">Any mileage</option>
          {[10_000, 25_000, 50_000, 75_000, 100_000].map((k) => (
            <option key={k} value={k}>
              {k.toLocaleString("en-LK")} km
            </option>
          ))}
        </select>
      </Group>

      <Group title="Gearbox">
        <div className="flex gap-2">
          <Pill on={f.trans.includes("auto")} onClick={() => toggle("trans", "auto")}>
            Automatic
          </Pill>
          <Pill on={f.trans.includes("manual")} onClick={() => toggle("trans", "manual")}>
            Manual
          </Pill>
        </div>
      </Group>

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
        Show sold cars
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

function Group({ title, children }: { title: string; children: React.ReactNode }) {
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
