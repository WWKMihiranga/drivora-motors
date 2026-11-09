"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const budgets = [
  ["", "Budget"],
  ["7000000", "Under Rs 7M"],
  ["10000000", "Under Rs 10M"],
  ["15000000", "Under Rs 15M"],
  ["25000000", "Under Rs 25M"],
  ["40000000", "Under Rs 40M"],
] as const;

export function QuickSearch({ makes, total }: { makes: string[]; total: number }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [max, setMax] = useState("");
  const [body, setBody] = useState("");
  const [condition, setCondition] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (make) q.set("make", make);
    if (max) q.set("max", max);
    if (body) q.set("body", body);
    if (condition) q.set("condition", condition);
    router.push(`/cars${q.size ? `?${q}` : ""}`);
  };

  const selectCls =
    "h-12 w-full appearance-none rounded-xl border-0 bg-surface pr-8 pl-4 text-[16px] font-medium text-ink focus:ring-2 focus:ring-ink/15 focus:outline-none md:text-[0.95rem]";

  return (
    <form
      onSubmit={submit}
      aria-label="Quick search"
      className="relative z-20 -mt-2 rounded-3xl border border-line bg-paper p-3 shadow-[0_24px_60px_-34px_rgba(14,17,22,0.45)] md:-mt-8 md:p-4"
    >
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor="qs-make">Make</label>
        <div className="relative">
          <select id="qs-make" value={make} onChange={(e) => setMake(e.target.value)} className={selectCls}>
            <option value="">Make</option>
            {makes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <Chevron />
        </div>
        <label className="sr-only" htmlFor="qs-budget">Budget</label>
        <div className="relative">
          <select id="qs-budget" value={max} onChange={(e) => setMax(e.target.value)} className={selectCls}>
            {budgets.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <label className="sr-only" htmlFor="qs-body">Body type</label>
        <div className="relative">
          <select id="qs-body" value={body} onChange={(e) => setBody(e.target.value)} className={selectCls}>
            <option value="">Body type</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="hatchback">Hatchback</option>
            <option value="pickup">Pick-up</option>
          </select>
          <Chevron />
        </div>
        <label className="sr-only" htmlFor="qs-cond">Condition</label>
        <div className="relative">
          <select id="qs-cond" value={condition} onChange={(e) => setCondition(e.target.value)} className={selectCls}>
            <option value="">Condition</option>
            <option value="reconditioned">Reconditioned</option>
            <option value="used">Used</option>
            <option value="brand-new">Brand new</option>
          </select>
          <Chevron />
        </div>
        <button type="submit" className="btn-ink col-span-2 h-12 md:col-span-1 md:px-7">
          <Search className="size-4" /> Show {total} cars
        </button>
      </div>
    </form>
  );
}

function Chevron() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 text-muted">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
