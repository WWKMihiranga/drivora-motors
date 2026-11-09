"use client";

import { Field, useList } from "@/lib/site-data";

/* The three CBSL limit cards, read live so list edits show instantly in the Fivora editor. */
export function FinanceRules() {
  const rules = useList<{ value: string; title: string; text: string }>("finance.rules");
  return (
        <div className="grid gap-4 md:grid-cols-3" data-preview-list-path="finance.rules">
          {rules.map((r, i) => (
            <div
              key={`${r.text}-${i}`}
              data-reveal
              data-preview-item-path={`finance.rules[${i}]`}
              style={{ ["--reveal-i" as string]: i }}
              className="rounded-[1.25rem] bg-surface p-6"
            >
              <Field as="p" className="font-display text-5xl font-extralight tracking-tight" data-num data-preview-field-path={`finance.rules[${i}].value`} />
              <Field as="p" className="mt-2 text-sm font-semibold" data-preview-field-path={`finance.rules[${i}].title`} />
              <Field as="p" className="mt-1 text-sm text-muted" data-preview-field-path={`finance.rules[${i}].text`} />
            </div>
          ))}
        </div>
  );
}
