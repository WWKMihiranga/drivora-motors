"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import {
  calculateLease,
  DEFAULT_RATES,
  LTV_RULES,
  maxLtv,
  minDownPayment,
  type RateType,
  type RegistrationStatus,
} from "@/lib/finance";
import { lakhs, pct, rs } from "@/lib/format";
import type { VehicleClass } from "@/types";
import { BalanceChart } from "./BalanceChart";
import { cn } from "@/lib/cn";

export interface CalcInit {
  price?: number;
  vehicleClass?: VehicleClass;
  reg?: RegistrationStatus;
  term?: number;
}

const regOptions: { v: RegistrationStatus; l: string }[] = [
  { v: "unregistered", l: "Unregistered (recon / brand new)" },
  { v: "under-1-year", l: "Registered less than 1 year" },
  { v: "over-1-year", l: "Registered over 1 year" },
];

export function LeasingCalculator({ init = {}, compact = false, lockPrice = false }: { init?: CalcInit; compact?: boolean; lockPrice?: boolean }) {
  const [price, setPrice] = useState(init.price ?? 15_000_000);
  const [vClass, setVClass] = useState<VehicleClass>(init.vehicleClass ?? "car");
  const [reg, setReg] = useState<RegistrationStatus>(init.reg ?? "unregistered");
  const minDown = minDownPayment(price, vClass, reg);
  const [downRaw, setDown] = useState<number | null>(null);
  const down = Math.min(price, Math.max(minDown, downRaw ?? minDown));
  const [term, setTerm] = useState(init.term ?? 60);
  const [rateType, setRateType] = useState<RateType>("reducing");
  const [rate, setRate] = useState(DEFAULT_RATES.reducingAnnual * 100);

  const res = useMemo(() => calculateLease(price - down, rate / 100, term, rateType), [price, down, rate, term, rateType]);
  const belowMin = downRaw !== null && downRaw < minDown;

  const switchType = (t: RateType) => {
    setRateType(t);
    setRate((t === "flat" ? DEFAULT_RATES.flatAnnual : DEFAULT_RATES.reducingAnnual) * 100);
  };

  return (
    <div className={cn("grid gap-6", !compact && "lg:grid-cols-[1.15fr_0.85fr] lg:gap-8")}>
      <div className="space-y-6">
        {!lockPrice && (
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="lc-price" className="field-label mb-0">
                Vehicle price
              </label>
              <span className="text-xs text-muted" data-num>
                {lakhs(price)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-muted">Rs</span>
              <input
                id="lc-price"
                inputMode="numeric"
                value={price.toLocaleString("en-LK")}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/[^\d]/g, ""));
                  setPrice(Math.min(500_000_000, n));
                  setDown(null);
                }}
                className="field font-display text-lg font-semibold"
                data-num
              />
            </div>
          </div>
        )}

        <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
          <div>
            <label htmlFor="lc-class" className="field-label">
              Vehicle type
            </label>
            <select
              id="lc-class"
              value={vClass}
              onChange={(e) => {
                setVClass(e.target.value as VehicleClass);
                setDown(null);
              }}
              className="field-select"
            >
              <option value="car">Car, SUV or van</option>
              <option value="commercial">Commercial (truck, single cab)</option>
            </select>
          </div>
          <div>
            <label htmlFor="lc-reg" className="field-label">
              Registration
            </label>
            <select
              id="lc-reg"
              value={reg}
              onChange={(e) => {
                setReg(e.target.value as RegistrationStatus);
                setDown(null);
              }}
              className="field-select"
            >
              {regOptions.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="lc-down" className="field-label mb-0">
              Down payment
            </label>
            <span className="font-display font-semibold" data-num>
              {rs(down)} <span className="text-xs font-normal text-muted">({pct(down / price)})</span>
            </span>
          </div>
          <input
            id="lc-down"
            type="range"
            min={0}
            max={price}
            step={50_000}
            value={downRaw ?? down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="range range-primary mt-3 w-full"
          />
          <p
            className={cn(
              "mt-2 flex items-start gap-1.5 text-xs leading-snug",
              belowMin ? "font-medium text-warn" : "text-muted",
            )}
            aria-live="polite"
          >
            {belowMin ? <AlertTriangle className="mt-px size-3.5 shrink-0" /> : <Info className="mt-px size-3.5 shrink-0" />}
            {belowMin
              ? `Lenders can't go below ${rs(minDown)} for this vehicle. We've used the minimum.`
              : `Minimum ${rs(minDown)}: lenders can finance up to ${pct(maxLtv(vClass, reg))} under CBSL rules (${LTV_RULES.effectiveDate}).`}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="lc-term" className="field-label mb-0">
              Term
            </label>
            <span className="font-display font-semibold" data-num>
              {term} months <span className="text-xs font-normal text-muted">({term / 12} yrs)</span>
            </span>
          </div>
          <input
            id="lc-term"
            type="range"
            min={12}
            max={60}
            step={12}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="range range-primary mt-3 w-full"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted" data-num>
            {[12, 24, 36, 48, 60].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
          <fieldset>
            <legend className="field-label">Rate quoted as</legend>
            <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
              {(["reducing", "flat"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={rateType === t}
                  onClick={() => switchType(t)}
                  className={cn(
                    "h-10 rounded-full text-sm font-medium capitalize transition-colors",
                    rateType === t ? "bg-paper text-ink shadow-sm" : "text-muted-strong",
                  )}
                >
                  {t === "reducing" ? "Reducing balance" : "Flat rate"}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="lc-rate" className="field-label">
              Annual rate (%)
            </label>
            <input
              id="lc-rate"
              type="number"
              min={0}
              max={60}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Math.min(60, Number(e.target.value))))}
              className="field"
              data-num
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl bg-night p-6 text-white md:p-7">
        <p className="text-sm text-white/60">Monthly instalment</p>
        <p className="mt-1 font-display text-[2.6rem] leading-none font-light tracking-tight md:text-5xl" data-num aria-live="polite">
          {rs(res.monthly)}
        </p>
        <p className="mt-2 text-xs text-white/50">
          for {term} months on {rs(res.principal)} financed
        </p>

        <dl className="mt-6 space-y-2.5 text-sm">
          {[
            ["Down payment", rs(down)],
            ["Amount financed", rs(res.principal)],
            ["Total interest", rs(res.totalInterest)],
            ["Total you pay", rs(res.totalPayable + down)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
              <dt className="text-white/60">{k}</dt>
              <dd className="font-medium" data-num>
                {v}
              </dd>
            </div>
          ))}
        </dl>

        {rateType === "flat" && res.principal > 0 && (
          <p className="mt-4 rounded-xl bg-white/[0.07] p-3 text-xs leading-relaxed text-white/75">
            A {rate}% flat rate costs the same as about{" "}
            <strong className="text-brand-bright" data-num>
              {(res.effectiveAnnual * 100).toFixed(1)}%
            </strong>{" "}
            on a reducing balance. Use this figure to compare lenders fairly.
          </p>
        )}

        <div className="mt-6">
          <BalanceChart principal={res.principal} balances={res.balances} />
        </div>

        <p className="mt-auto flex gap-1.5 pt-6 text-[0.7rem] leading-snug text-white/45">
          <Info className="mt-px size-3.5 shrink-0" />
          Estimate only. The lender confirms the final rate, fees and approval. Sample rates are for illustration.
        </p>
      </div>
    </div>
  );
}
