"use client";

import { useState } from "react";
import { rs } from "@/lib/format";

/*
 * Fuel and electricity prices change often, so every number here is an editable
 * input with a clearly labelled sample default rather than a "live" figure.
 */
export function RunningCost() {
  const [km, setKm] = useState(1200);
  const [petrolPrice, setPetrolPrice] = useState(300);
  const [unitPrice, setUnitPrice] = useState(55);

  const rows = [
    { name: "Petrol car", eff: 12, unit: "km/l", cost: (km / 12) * petrolPrice },
    { name: "Hybrid", eff: 20, unit: "km/l", cost: (km / 20) * petrolPrice },
    { name: "Electric", eff: 6.5, unit: "km/kWh", cost: (km / 6.5) * unitPrice },
  ];
  const max = Math.max(...rows.map((r) => r.cost));

  return (
    <div className="grid gap-6 rounded-[1.75rem] border border-line p-5 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
      <div className="grid gap-4">
        <Num id="rc-km" label="Kilometres per month" value={km} set={setKm} suffix="km" />
        <Num id="rc-p" label="Petrol price per litre (sample)" value={petrolPrice} set={setPetrolPrice} suffix="Rs" />
        <Num id="rc-e" label="Electricity per unit at home (sample)" value={unitPrice} set={setUnitPrice} suffix="Rs" />
        <p className="text-xs leading-relaxed text-muted">
          Efficiency figures are typical real-world averages for the car types. Change the prices to today&apos;s rates.
        </p>
      </div>
      <ul className="space-y-5 self-center">
        {rows.map((r) => (
          <li key={r.name}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">
                {r.name} <span className="text-muted">· {r.eff} {r.unit}</span>
              </span>
              <span className="font-display text-lg font-semibold" data-num>
                {rs(r.cost)}
                <span className="text-xs font-normal text-muted">/mo</span>
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

function Num({ id, label, value, set, suffix }: { id: string; label: string; value: number; set: (n: number) => void; suffix: string }) {
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
