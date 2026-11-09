"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { calculateLease, DEFAULT_RATES, LTV_RULES, minDownPayment } from "@/lib/finance";
import { lakhs, rs } from "@/lib/format";
import { Field, fill, useContentValue, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

const CALC = "Calculated from the values chosen above";

/* All wording, the price range and the terms are editable in Fivora (site-data.json `home.leasing`). */
export function LeasingTeaser() {
  const text = useText();
  const terms = useList<number>("home.leasing.terms");
  const priceMin = Number(useContentValue("home.leasing.priceMin")) || 5_000_000;
  const priceMax = Number(useContentValue("home.leasing.priceMax")) || 60_000_000;
  const [price, setPrice] = useState(() => Number(text("home.leasing.priceDefault")) || 15_000_000);
  const [registered, setRegistered] = useState(false);
  const [term, setTerm] = useState(() => Number(text("home.leasing.termDefault")) || 60);
  const minDown = minDownPayment(price, "car", registered ? "over-1-year" : "unregistered");
  const res = useMemo(
    () => calculateLease(price - minDown, DEFAULT_RATES.reducingAnnual, term, "reducing"),
    [price, minDown, term],
  );
  const downPercent = Math.round((1 - (registered ? LTV_RULES.registeredOverOneYear : LTV_RULES.newOrRecent.car)) * 100);

  return (
    <div className="grid gap-6 rounded-[1.75rem] bg-surface p-5 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="space-y-7">
        <div>
          <div className="flex items-baseline justify-between">
            <Field as="label" htmlFor="lt-price" className="text-sm font-medium" data-preview-field-path="home.leasing.priceLabel" />
            <output htmlFor="lt-price" className="font-display text-xl font-semibold" data-num data-preview-static={CALC}>
              {rs(price)}
            </output>
          </div>
          <input
            id="lt-price"
            type="range"
            min={priceMin}
            max={priceMax}
            step={250_000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="range range-primary mt-4 w-full"
            aria-valuetext={`${rs(price)}, ${lakhs(price)}`}
          />
          <div className="mt-1.5 flex justify-between text-xs text-muted" data-num>
            <Field data-preview-field-path="home.leasing.priceMinLabel" />
            <Field data-preview-field-path="home.leasing.priceMaxLabel" />
          </div>
        </div>

        <fieldset>
          <Field as="legend" className="text-sm font-medium" data-preview-field-path="home.leasing.registrationLabel" />
          <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-full bg-paper p-1">
            {[false, true].map((val) => (
              <button
                key={String(val)}
                type="button"
                aria-pressed={registered === val}
                onClick={() => setRegistered(val)}
                className={cn(
                  "h-10 rounded-full text-sm font-medium transition-colors",
                  registered === val ? "bg-ink text-on-ink" : "text-muted-strong hover:text-ink",
                )}
              >
                {val ? (
                  <Field data-preview-field-path="home.leasing.registeredLabel" />
                ) : (
                  <Field data-preview-field-path="home.leasing.unregisteredLabel" />
                )}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <Field as="legend" className="text-sm font-medium" data-preview-field-path="home.leasing.termLabel" />
          <div className="mt-2.5 flex gap-2" data-preview-list-path="home.leasing.terms">
            {terms.map((t, n) => (
              <button
                key={`${t}-${n}`}
                type="button"
                aria-pressed={term === t}
                onClick={() => setTerm(t)}
                data-preview-item-path={`home.leasing.terms[${n}]`}
                data-preview-field-path={`home.leasing.terms[${n}]`}
                className={cn(
                  "h-10 flex-1 rounded-full border text-sm font-medium transition-colors",
                  term === t ? "border-ink bg-paper text-ink" : "border-transparent text-muted-strong hover:text-ink",
                )}
              >
                {fill(text("home.leasing.termSuffix"), { n: t })}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col justify-between rounded-[1.25rem] bg-night p-6 text-white md:p-7">
        <div>
          <Field as="p" className="text-sm text-white/60" data-preview-field-path="home.leasing.monthlyLabel" />
          <p
            className="mt-1 font-display text-[2.6rem] leading-none font-light tracking-tight md:text-5xl"
            data-num
            aria-live="polite"
            data-preview-static={CALC}
          >
            {rs(res.monthly)}
          </p>
          <dl className="mt-6 space-y-2.5 text-sm">
            <Row
              k={<Field data-preview-field-path="home.leasing.minDownLabel" />}
              v={rs(minDown)}
              hint={<Field data-preview-field-path="home.leasing.minDownHint" format={(t) => fill(t, { percent: downPercent })} />}
            />
            <Row k={<Field data-preview-field-path="home.leasing.financedLabel" />} v={rs(price - minDown)} />
            <Row
              k={<Field data-preview-field-path="home.leasing.rateLabel" />}
              v={
                <Field
                  data-preview-field-path="home.leasing.rateValue"
                  format={(t) => fill(t, { rate: (DEFAULT_RATES.reducingAnnual * 100).toFixed(1) })}
                />
              }
            />
          </dl>
        </div>
        <div className="mt-7">
          <Link
            href={`${text("home.leasing.linkHref") || "/finance"}?price=${price}&reg=${registered ? "over-1-year" : "unregistered"}&term=${term}`}
            className="btn-light w-full"
            data-preview-field-path="home.leasing.linkHref"
          >
            <Field data-preview-field-path="home.leasing.cta" /> <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 flex gap-1.5 text-[0.72rem] leading-snug text-white/45">
            <Info className="mt-px size-3.5 shrink-0" />
            <Field
              data-preview-field-path="home.leasing.disclaimer"
              format={(t) => fill(t, { date: LTV_RULES.effectiveDate })}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, hint }: { k: React.ReactNode; v: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5">
      <dt className="text-white/60">
        {k}
        {hint && <span className="block text-[0.72rem] text-white/40">{hint}</span>}
      </dt>
      <dd className="font-medium" data-num {...(typeof v === "string" ? { "data-preview-static": CALC } : {})}>
        {v}
      </dd>
    </div>
  );
}
