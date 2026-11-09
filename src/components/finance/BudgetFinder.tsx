"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { affordablePrice, DEFAULT_RATES, LTV_RULES } from "@/lib/finance";
import { rs } from "@/lib/format";
import { vehicles } from "@/data/vehicles";
import { Field, fill, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

const CALC = "Calculated from the values chosen above";

/* Wording and slider ranges are editable in Fivora (site-data.json `finance.budget`). */
export function BudgetFinder() {
  const text = useText();
  const n = (path: string, fallback: number) => Number(text(path)) || fallback;
  const [monthly, setMonthly] = useState(() => n("finance.budget.monthlyDefault", 150_000));
  const [cash, setCash] = useState(() => n("finance.budget.cashDefault", 6_000_000));
  const [registered, setRegistered] = useState(false);
  const ltv = registered ? LTV_RULES.registeredOverOneYear : LTV_RULES.newOrRecent.car;
  const max = useMemo(() => affordablePrice(monthly, cash, DEFAULT_RATES.reducingAnnual, 60, ltv), [monthly, cash, ltv]);
  const limitedByCash = Math.abs(max - cash / (1 - ltv)) < 1;
  const matches = vehicles.filter(
    (v) => v.status !== "sold" && v.priceLkr <= max && (registered ? v.condition === "used" : v.condition !== "used"),
  ).length;
  const base = text("finance.budget.resultsHref") || "/cars";

  return (
    <div className="grid gap-6 rounded-[1.75rem] border border-line p-5 md:p-8 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-6">
        <Slider
          id="bf-m"
          label={<Field data-preview-field-path="finance.budget.monthlyLabel" />}
          value={monthly}
          set={setMonthly}
          min={n("finance.budget.monthlyMin", 40_000)}
          max={n("finance.budget.monthlyMax", 600_000)}
          step={n("finance.budget.monthlyStep", 5_000)}
        />
        <Slider
          id="bf-c"
          label={<Field data-preview-field-path="finance.budget.cashLabel" />}
          value={cash}
          set={setCash}
          min={n("finance.budget.cashMin", 1_000_000)}
          max={n("finance.budget.cashMax", 40_000_000)}
          step={n("finance.budget.cashStep", 250_000)}
        />
        <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
          {[false, true].map((val) => (
            <button
              key={String(val)}
              type="button"
              aria-pressed={registered === val}
              onClick={() => setRegistered(val)}
              className={cn("h-10 rounded-full text-sm font-medium", registered === val ? "bg-paper shadow-sm" : "text-muted-strong")}
            >
              {val ? (
                <Field data-preview-field-path="finance.budget.registeredLabel" />
              ) : (
                <Field data-preview-field-path="finance.budget.unregisteredLabel" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-[1.25rem] bg-surface p-6">
        <div>
          <Field as="p" className="text-sm text-muted-strong" data-preview-field-path="finance.budget.resultLabel" />
          <p
            className="mt-1 font-display text-[2.4rem] leading-none font-light tracking-tight md:text-5xl"
            data-num
            aria-live="polite"
            data-preview-static={CALC}
          >
            {rs(Math.floor(max / 50_000) * 50_000)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {limitedByCash ? (
              <Field data-preview-field-path="finance.budget.cashLimit" format={(t) => fill(t, { percent: Math.round(ltv * 100) })} />
            ) : (
              <Field data-preview-field-path="finance.budget.monthlyLimit" />
            )}
          </p>
        </div>
        <Link
          href={`${base}?max=${Math.round(max)}${registered ? "&condition=used" : "&condition=reconditioned,brand-new"}`}
          className="btn-ink mt-6"
          data-preview-field-path="finance.budget.resultsHref"
        >
          <Field
            data-preview-field-path="finance.budget.cta"
            format={(t) => fill(t, { count: matches, cars: text(matches === 1 ? "finance.budget.carOne" : "finance.budget.carMany") })}
          />{" "}
          <ArrowRight className="size-4" />
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
  label: React.ReactNode;
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
        <output htmlFor={id} className="font-display text-lg font-semibold" data-num data-preview-static={CALC}>
          {rs(value)}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="range range-primary mt-3 w-full" />
    </div>
  );
}
