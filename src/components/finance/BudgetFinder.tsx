"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { affordablePrice, DEFAULT_RATES, LTV_RULES } from "@/lib/finance";
import { rs } from "@/lib/format";
import { vehicles } from "@/data/vehicles";
import { cn } from "@/lib/cn";

export function BudgetFinder() {
  const [monthly, setMonthly] = useState(150_000);
  const [cash, setCash] = useState(6_000_000);
  const [registered, setRegistered] = useState(false);
  const ltv = registered ? LTV_RULES.registeredOverOneYear : LTV_RULES.newOrRecent.car;
  const max = useMemo(() => affordablePrice(monthly, cash, DEFAULT_RATES.reducingAnnual, 60, ltv), [monthly, cash, ltv]);
  const limitedByCash = Math.abs(max - cash / (1 - ltv)) < 1;
  const matches = vehicles.filter(
    (v) => v.status !== "sold" && v.priceLkr <= max && (registered ? v.condition === "used" : v.condition !== "used"),
  ).length;

  return (
    <div className="grid gap-6 rounded-[1.75rem] border border-line p-5 md:p-8 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-6">
        <Slider id="bf-m" label="Monthly budget" value={monthly} set={setMonthly} min={40_000} max={600_000} step={5_000} />
        <Slider id="bf-c" label="Cash for down payment" value={cash} set={setCash} min={1_000_000} max={40_000_000} step={250_000} />
        <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
          {[
            [false, "Recon / brand new"],
            [true, "Used (registered)"],
          ].map(([val, l]) => (
            <button
              key={String(val)}
              type="button"
              aria-pressed={registered === val}
              onClick={() => setRegistered(val as boolean)}
              className={cn("h-10 rounded-full text-sm font-medium", registered === val ? "bg-paper shadow-sm" : "text-muted-strong")}
            >
              {l as string}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-[1.25rem] bg-surface p-6">
        <div>
          <p className="text-sm text-muted-strong">You could look at cars up to</p>
          <p className="mt-1 font-display text-[2.4rem] leading-none font-light tracking-tight md:text-5xl" data-num aria-live="polite">
            {rs(Math.floor(max / 50_000) * 50_000)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {limitedByCash
              ? `Your cash is the limit here: lenders can finance only ${Math.round(ltv * 100)}% of this type of car.`
              : "Your monthly budget is the limit here, over 60 months at our sample rate."}
          </p>
        </div>
        <Link
          href={`/cars?max=${Math.round(max)}${registered ? "&condition=used" : "&condition=reconditioned,brand-new"}`}
          className="btn-ink mt-6"
        >
          See {matches} matching {matches === 1 ? "car" : "cars"} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  set,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg font-semibold" data-num>
          {rs(value)}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="range range-primary mt-3 w-full" />
    </div>
  );
}
