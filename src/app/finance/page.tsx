import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinanceCalculatorFromUrl } from "./FinanceCalculatorFromUrl";
import { LeasingCalculator } from "@/components/finance/LeasingCalculator";
import { BudgetFinder } from "@/components/finance/BudgetFinder";
import { RunningCost } from "@/components/finance/RunningCost";
import { SectionHeader } from "@/components/home/SectionHeader";
import { LTV_RULES } from "@/lib/finance";

export const metadata: Metadata = {
  title: "Leasing calculator",
  description:
    "Work out your monthly lease payment with the Central Bank's 2026 loan-to-value limits built in. Compare flat and reducing-balance rates.",
};

export default function FinancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Leasing"
        title="Your real monthly payment, before you visit"
        text={`Built around the Central Bank of Sri Lanka's loan-to-value limits effective ${LTV_RULES.effectiveDate}. Switch between flat and reducing-balance rates to compare offers fairly.`}
        crumbs={[{ href: "/finance", label: "Leasing" }]}
      />

      <section className="container-x py-12 md:py-16">
        <Suspense fallback={<LeasingCalculator />}>
          <FinanceCalculatorFromUrl />
        </Suspense>
      </section>

      <section className="container-x pb-16 md:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["40%", "Max financing", "Cars, SUVs and vans that are unregistered or registered under a year"],
            ["60%", "Max financing", "Commercial vehicles that are unregistered or registered under a year"],
            ["60%", "Max financing", "Any vehicle registered and used in Sri Lanka for over a year"],
          ].map(([n, k, d], i) => (
            <div key={d} data-reveal style={{ ["--reveal-i" as string]: i }} className="rounded-[1.25rem] bg-surface p-6">
              <p className="font-display text-5xl font-extralight tracking-tight" data-num>
                {n}
              </p>
              <p className="mt-2 text-sm font-semibold">{k}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Source: {LTV_RULES.source}, effective {LTV_RULES.effectiveDate}. Lenders may apply stricter limits.
        </p>
      </section>

      <section className="container-x pb-16 md:pb-20">
        <SectionHeader eyebrow="Budget finder" title="Work backwards from what you can pay" className="mb-8" />
        <BudgetFinder />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <SectionHeader eyebrow="Running costs" title="Petrol, hybrid or electric: what you'd spend each month" className="mb-8" />
        <RunningCost />
      </section>
    </>
  );
}
