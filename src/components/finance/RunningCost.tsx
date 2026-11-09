"use client";

import { useState } from "react";
import { rs } from "@/lib/format";
import { Field, useList, useText } from "@/lib/site-data";

type CarType = { name: string; efficiency: number; unit: string; energy: string };

/*
 * Fuel and electricity prices change often, so every number here is an editable input with a
 * clearly labelled sample default rather than a "live" figure. Defaults, car types and wording are
 * editable in Fivora (site-data.json `finance.running`).
 */
export function RunningCost() {
  const text = useText();
  const types = useList<CarType>("finance.running.types");
  const [km, setKm] = useState(() => Number(text("finance.running.kmDefault")) || 1200);
  const [petrolPrice, setPetrolPrice] = useState(() => Number(text("finance.running.petrolDefault")) || 300);
  const [unitPrice, setUnitPrice] = useState(() => Number(text("finance.running.unitDefault")) || 55);

  const rows = types.map((t) => ({
    ...t,
    cost: (km / (t.efficiency || 1)) * (t.energy === "electric" ? unitPrice : petrolPrice),
  }));
  const max = Math.max(1, ...rows.map((r) => r.cost));

  return (
    <div className="grid gap-6 rounded-[1.75rem] border border-line p-5 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
      <div className="grid gap-4">
        <Num id="rc-km" label={<Field data-preview-field-path="finance.running.kmLabel" />} value={km} set={setKm} suffix={<Field data-preview-field-path="finance.running.kmSuffix" />} />
        <Num id="rc-p" label={<Field data-preview-field-path="finance.running.petrolLabel" />} value={petrolPrice} set={setPetrolPrice} suffix={<Field data-preview-field-path="common.business.currency" />} />
        <Num id="rc-e" label={<Field data-preview-field-path="finance.running.unitLabel" />} value={unitPrice} set={setUnitPrice} suffix={<Field data-preview-field-path="common.business.currency" />} />
        <Field as="p" className="text-xs leading-relaxed text-muted" data-preview-field-path="finance.running.note" />
      </div>
      <ul className="space-y-5 self-center" data-preview-list-path="finance.running.types">
        {rows.map((r, i) => (
          <li key={`${r.name}-${i}`} data-preview-item-path={`finance.running.types[${i}]`}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">
                <Field data-preview-field-path={`finance.running.types[${i}].name`} />{" "}
                <span className="text-muted">
                  · <Field data-preview-field-path={`finance.running.types[${i}].efficiency`} />{" "}
                  <Field data-preview-field-path={`finance.running.types[${i}].unit`} />
                </span>
              </span>
              <span className="font-display text-lg font-semibold" data-num data-preview-static="Calculated from the values entered">
                {rs(r.cost)}
                <span className="text-xs font-normal text-muted">{text("finance.running.perMonth")}</span>
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out-soft"
                style={{ width: `${Math.max(4, (r.cost / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Num({
  id,
  label,
  value,
  set,
  suffix,
}: {
  id: string;
  label: React.ReactNode;
  value: number;
  set: (n: number) => void;
  suffix: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(e) => set(Math.max(0, Number(e.target.value)))}
          className="field pr-12"
          data-num
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted">{suffix}</span>
      </div>
    </div>
  );
}
