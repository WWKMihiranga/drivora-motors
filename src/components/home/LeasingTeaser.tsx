"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { calculateLease, DEFAULT_RATES, LTV_RULES, minDownPayment } from "@/lib/finance";
import { lakhs, rs } from "@/lib/format";
import { cn } from "@/lib/cn";

const terms = [24, 36, 48, 60];

export function LeasingTeaser() {
  const [price, setPrice] = useState(15_000_000);
  const [registered, setRegistered] = useState(false);
  const [term, setTerm] = useState(60);
  const minDown = minDownPayment(price, "car", registered ? "over-1-year" : "unregistered");
  const res = useMemo(
    () => calculateLease(price - minDown, DEFAULT_RATES.reducingAnnual, term, "reducing"),
    [price, minDown, term],
  );

  return (
    <div className="grid gap-6 rounded-[1.75rem] bg-surface p-5 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="space-y-7">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="lt-price" className="text-sm font-medium">
              Car price
            </label>
            <output htmlFor="lt-price" className="font-display text-xl font-semibold" data-num>
              {rs(price)}
            </output>
          </div>
          <input
            id="lt-price"
            type="range"
            min={5_000_000}
            max={60_000_000}
            step={250_000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="range range-primary mt-4 w-full"
            aria-valuetext={`${rs(price)}, ${lakhs(price)}`}
          />
          <div className="mt-1.5 flex justify-between text-xs text-muted" data-num>
            <span>Rs 5M</span>
            <span>Rs 60M</span>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Registration</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-full bg-paper p-1">
            {[
              [false, "Recon / brand new"],
              [true, "Registered 1+ year"],
            ].map(([val, label]) => (
              <button
                key={String(val)}
                type="button"
                aria-pressed={registered === val}
                onClick={() => setRegistered(val as boolean)}
                className={cn(
                  "h-10 rounded-full text-sm font-medium transition-colors",
                  registered === val ? "bg-ink text-on-ink" : "text-muted-strong hover:text-ink",
                )}
              >
                {label as string}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">Term</legend>
          <div className="mt-2.5 flex gap-2">
            {terms.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={term === t}
                onClick={() => setTerm(t)}
                className={cn(
                  "h-10 flex-1 rounded-full border text-sm font-medium transition-colors",
                  term === t ? "border-ink bg-paper text-ink" : "border-transparent text-muted-strong hover:text-ink",
                )}
              >
                {t} mo
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col justify-between rounded-[1.25rem] bg-night p-6 text-white md:p-7">
        <div>
          <p className="text-sm text-white/60">Estimated monthly payment</p>
          <p className="mt-1 font-display text-[2.6rem] leading-none font-light tracking-tight md:text-5xl" data-num aria-live="polite">
            {rs(res.monthly)}
          </p>
          <dl className="mt-6 space-y-2.5 text-sm">
            <Row k="Minimum down payment" v={rs(minDown)} hint={`${Math.round((1 - (registered ? 0.6 : 0.4)) * 100)}% under CBSL rules`} />
            <Row k="Amount financed" v={rs(price - minDown)} />
            <Row k="Sample rate (reducing)" v={`${(DEFAULT_RATES.reducingAnnual * 100).toFixed(1)}% p.a.`} />
          </dl>
        </div>
        <div className="mt-7">
          <Link href={`/finance?price=${price}&reg=${registered ? "over-1-year" : "unregistered"}&term=${term}`} className="btn-light w-full">
            Full calculator <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 flex gap-1.5 text-[0.72rem] leading-snug text-white/45">
            <Info className="mt-px size-3.5 shrink-0" />
            Estimate only. LTV limits per CBSL directions effective {LTV_RULES.effectiveDate}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, hint }: { k: string; v: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5">
      <dt className="text-white/60">
        {k}
        {hint && <span className="block text-[0.72rem] text-white/40">{hint}</span>}
      </dt>
      <dd className="font-medium" data-num>
        {v}
      </dd>
    </div>
  );
}
