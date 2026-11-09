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
import { Field, fill, useContentValue, useText } from "@/lib/site-data";
import { BalanceChart } from "./BalanceChart";
import { cn } from "@/lib/cn";

export interface CalcInit {
  price?: number;
  vehicleClass?: VehicleClass;
  reg?: RegistrationStatus;
  term?: number;
}

/** Results recalculate from the inputs, so they are not editable text. */
const CALC = "Calculated from the values chosen in the calculator";

/* Every label and limit is editable in Fivora (site-data.json `calc`); lending rules in `financeSettings`. */
export function LeasingCalculator({ init = {}, compact = false, lockPrice = false }: { init?: CalcInit; compact?: boolean; lockPrice?: boolean }) {
  const text = useText();
  const maxPrice = Number(useContentValue("calc.maxPrice")) || 500_000_000;
  const downStep = Number(useContentValue("calc.downStep")) || 50_000;
  const termMin = Number(useContentValue("calc.termMin")) || 12;
  const termMax = Number(useContentValue("calc.termMax")) || 60;
  const [price, setPrice] = useState(() => init.price ?? (Number(text("calc.defaultPrice")) || 15_000_000));
  const [vClass, setVClass] = useState<VehicleClass>(init.vehicleClass ?? "car");
  const [reg, setReg] = useState<RegistrationStatus>(init.reg ?? "unregistered");
  const minDown = minDownPayment(price, vClass, reg);
  const [downRaw, setDown] = useState<number | null>(null);
  const down = Math.min(price, Math.max(minDown, downRaw ?? minDown));
  const [term, setTerm] = useState(() => init.term ?? (Number(text("calc.termDefault")) || 60));
  const [rateType, setRateType] = useState<RateType>("reducing");
  const [rate, setRate] = useState(DEFAULT_RATES.reducingAnnual * 100);

  const res = useMemo(() => calculateLease(price - down, rate / 100, term, rateType), [price, down, rate, term, rateType]);
  const belowMin = downRaw !== null && downRaw < minDown;
  const termTicks: number[] = [];
  for (let t = termMin; t <= termMax; t += 12) termTicks.push(t);

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
              <Field as="label" htmlFor="lc-price" className="field-label mb-0" data-preview-field-path="calc.priceLabel" />
              <span className="text-xs text-muted" data-num data-preview-static={CALC}>
                {lakhs(price)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Field className="text-sm text-muted" data-preview-field-path="common.business.currency" />
              <input
                id="lc-price"
                inputMode="numeric"
                value={price.toLocaleString("en-LK")}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/[^\d]/g, ""));
                  setPrice(Math.min(maxPrice, n));
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
            <Field as="label" htmlFor="lc-class" className="field-label" data-preview-field-path="calc.typeLabel" />
            <select
              id="lc-class"
              value={vClass}
              onChange={(e) => {
                setVClass(e.target.value as VehicleClass);
                setDown(null);
              }}
              className="field-select"
              data-preview-field-path="calc.typeCar"
            >
              <option value="car">{text("calc.typeCar")}</option>
              <option value="commercial">{text("calc.typeCommercial")}</option>
            </select>
          </div>
          <div>
            <Field as="label" htmlFor="lc-reg" className="field-label" data-preview-field-path="calc.regLabel" />
            <select
              id="lc-reg"
              value={reg}
              onChange={(e) => {
                setReg(e.target.value as RegistrationStatus);
                setDown(null);
              }}
              className="field-select"
              data-preview-field-path="calc.regUnregistered"
            >
              <option value="unregistered">{text("calc.regUnregistered")}</option>
              <option value="under-1-year">{text("calc.regUnder1")}</option>
              <option value="over-1-year">{text("calc.regOver1")}</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Field as="label" htmlFor="lc-down" className="field-label mb-0" data-preview-field-path="calc.downLabel" />
            <span className="font-display font-semibold" data-num data-preview-static={CALC}>
              {rs(down)} <span className="text-xs font-normal text-muted">({pct(down / price)})</span>
            </span>
          </div>
          <input
            id="lc-down"
            type="range"
            min={0}
            max={price}
            step={downStep}
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
            {belowMin ? (
              <Field data-preview-field-path="calc.belowMin" format={(t) => fill(t, { min: rs(minDown) })} />
            ) : (
              <Field
                data-preview-field-path="calc.minNote"
                format={(t) => fill(t, { min: rs(minDown), ltv: pct(maxLtv(vClass, reg)), date: LTV_RULES.effectiveDate })}
              />
            )}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Field as="label" htmlFor="lc-term" className="field-label mb-0" data-preview-field-path="calc.termLabel" />
            <span className="font-display font-semibold" data-num>
              <Field data-preview-field-path="calc.termValue" format={(t) => fill(t, { n: term })} />{" "}
              <Field className="text-xs font-normal text-muted" data-preview-field-path="calc.termYears" format={(t) => fill(t, { n: term / 12 })} />
            </span>
          </div>
          <input
            id="lc-term"
            type="range"
            min={termMin}
            max={termMax}
            step={12}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="range range-primary mt-3 w-full"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted" data-num>
            {termTicks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
          <fieldset>
            <Field as="legend" className="field-label" data-preview-field-path="calc.rateTypeLabel" />
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
                  {t === "reducing" ? <Field data-preview-field-path="calc.reducing" /> : <Field data-preview-field-path="calc.flat" />}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <Field as="label" htmlFor="lc-rate" className="field-label" data-preview-field-path="calc.rateLabel" />
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
        <Field as="p" className="text-sm text-white/60" data-preview-field-path="calc.monthlyLabel" />
        <p
          className="mt-1 font-display text-[2.6rem] leading-none font-light tracking-tight md:text-5xl"
          data-num
          aria-live="polite"
          data-preview-static={CALC}
        >
          {rs(res.monthly)}
        </p>
        <Field
          as="p"
          className="mt-2 text-xs text-white/50"
          data-preview-field-path="calc.forTerm"
          format={(t) => fill(t, { n: term, amount: rs(res.principal) })}
        />

        <dl className="mt-6 space-y-2.5 text-sm">
          <Row k={<Field data-preview-field-path="calc.downRow" />} v={rs(down)} />
          <Row k={<Field data-preview-field-path="calc.financedRow" />} v={rs(res.principal)} />
          <Row k={<Field data-preview-field-path="calc.interestRow" />} v={rs(res.totalInterest)} />
          <Row k={<Field data-preview-field-path="calc.totalRow" />} v={rs(res.totalPayable + down)} />
        </dl>

        {rateType === "flat" && res.principal > 0 && (
          <Field
            as="p"
            className="mt-4 rounded-xl bg-white/[0.07] p-3 text-xs leading-relaxed text-white/75"
            data-preview-field-path="calc.flatNote"
            format={(t) => {
              // keep the highlighted figure: split the editable sentence around {effective}
              const [before, after = ""] = fill(t, { rate }).split("{effective}");
              return (
                <>
                  {before}
                  <strong className="text-brand-bright" data-num>
                    {(res.effectiveAnnual * 100).toFixed(1)}%
                  </strong>
                  {after}
                </>
              );
            }}
          />
        )}

        <div className="mt-6">
          <BalanceChart principal={res.principal} balances={res.balances} />
        </div>

        <p className="mt-auto flex gap-1.5 pt-6 text-[0.7rem] leading-snug text-white/45">
          <Info className="mt-px size-3.5 shrink-0" />
          <Field data-preview-field-path="calc.disclaimer" />
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
      <dt className="text-white/60">{k}</dt>
      <dd className="font-medium" data-num data-preview-static={CALC}>
        {v}
      </dd>
    </div>
  );
}
