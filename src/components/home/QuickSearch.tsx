"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Field, fill, useList, useText } from "@/lib/site-data";

/* All labels and option lists are editable in Fivora (site-data.json `home.quickSearch`). */
export function QuickSearch({ makes, total }: { makes: string[]; total: number }) {
  const router = useRouter();
  const text = useText();
  const budgets = useList<{ max: number; label: string }>("home.quickSearch.budgets");
  const bodies = useList<string>("home.quickSearch.bodyOptions");
  const conditions = useList<string>("home.quickSearch.conditionOptions");
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
    const base = text("home.quickSearch.resultsHref") || "/cars";
    router.push(`${base}${q.size ? `?${q}` : ""}`);
  };

  const selectCls =
    "h-12 w-full appearance-none rounded-xl border-0 bg-surface pr-8 pl-4 text-[16px] font-medium text-ink focus:ring-2 focus:ring-ink/15 focus:outline-none md:text-[0.95rem]";

  return (
    <form
      onSubmit={submit}
      aria-labelledby="qs-label"
      className="relative z-20 -mt-2 rounded-3xl border border-line bg-paper p-3 shadow-[0_24px_60px_-34px_rgba(14,17,22,0.45)] md:-mt-8 md:p-4"
    >
      <Field id="qs-label" className="sr-only" data-preview-field-path="home.quickSearch.formLabel" />
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <Field as="label" className="sr-only" htmlFor="qs-make" data-preview-field-path="home.quickSearch.makeLabel" />
        <div className="relative">
          <select
            id="qs-make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className={selectCls}
            data-preview-field-path="home.quickSearch.makePlaceholder"
          >
            <option value="">{text("home.quickSearch.makePlaceholder")}</option>
            {makes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <Chevron />
        </div>
        <Field as="label" className="sr-only" htmlFor="qs-budget" data-preview-field-path="home.quickSearch.budgetLabel" />
        <div className="relative">
          <select
            id="qs-budget"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className={selectCls}
            data-preview-field-path="home.quickSearch.budgetPlaceholder"
            data-preview-list-path="home.quickSearch.budgets"
          >
            <option value="">{text("home.quickSearch.budgetPlaceholder")}</option>
            {budgets.map((b, i) => (
              <option
                key={`${b.max}-${i}`}
                value={String(b.max)}
                data-preview-item-path={`home.quickSearch.budgets[${i}]`}
                data-preview-field-path={`home.quickSearch.budgets[${i}].label`}
              >
                {b.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <Field as="label" className="sr-only" htmlFor="qs-body" data-preview-field-path="home.quickSearch.bodyLabel" />
        <div className="relative">
          <select
            id="qs-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={selectCls}
            data-preview-field-path="home.quickSearch.bodyPlaceholder"
            data-preview-list-path="home.quickSearch.bodyOptions"
          >
            <option value="">{text("home.quickSearch.bodyPlaceholder")}</option>
            {bodies.map((b, i) => (
              <option
                key={b}
                value={b}
                data-preview-item-path={`home.quickSearch.bodyOptions[${i}]`}
                data-preview-field-path={`home.quickSearch.bodyOptions[${i}]`}
              >
                {text(`labels.body.${b}`) || b}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <Field as="label" className="sr-only" htmlFor="qs-cond" data-preview-field-path="home.quickSearch.conditionLabel" />
        <div className="relative">
          <select
            id="qs-cond"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={selectCls}
            data-preview-field-path="home.quickSearch.conditionPlaceholder"
            data-preview-list-path="home.quickSearch.conditionOptions"
          >
            <option value="">{text("home.quickSearch.conditionPlaceholder")}</option>
            {conditions.map((c, i) => (
              <option
                key={c}
                value={c}
                data-preview-item-path={`home.quickSearch.conditionOptions[${i}]`}
                data-preview-field-path={`home.quickSearch.conditionOptions[${i}]`}
              >
                {text(`labels.condition.${c}`) || c}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <button type="submit" className="btn-ink col-span-2 h-12 md:col-span-1 md:px-7" data-preview-field-path="home.quickSearch.submit">
          <Search className="size-4" /> {fill(text("home.quickSearch.submit"), { count: total })}
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
