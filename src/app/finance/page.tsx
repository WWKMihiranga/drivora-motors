import type { Metadata } from "next";
import { Suspense } from "react";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { FinanceCalculatorFromUrl } from "./FinanceCalculatorFromUrl";
import { LeasingCalculator } from "@/components/finance/LeasingCalculator";
import { BudgetFinder } from "@/components/finance/BudgetFinder";
import { RunningCost } from "@/components/finance/RunningCost";
import { FinanceRules } from "@/components/finance/FinanceRules";
import { SectionHeader } from "@/components/home/SectionHeader";
import { LTV_RULES } from "@/lib/finance";
import { pageMeta } from "@/lib/seo";
import { Field, FillField } from "@/lib/site-data";

export const metadata: Metadata = pageMeta("finance");

export default function FinancePage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="finance.header.eyebrow" />}
        title={<Field data-preview-field-path="finance.header.title" />}
        text={<FillField data-preview-field-path="finance.header.text" vars={{ date: LTV_RULES.effectiveDate }} />}
        crumbs={[<Crumb key="c" data-preview-field-path="finance.header.crumbHref" label={<Field data-preview-field-path="finance.header.crumbLabel" />} />]}
      />

      <section className="container-x py-12 md:py-16">
        <Suspense fallback={<LeasingCalculator />}>
          <FinanceCalculatorFromUrl />
        </Suspense>
      </section>

      <section className="container-x pb-16 md:pb-20">
        <FinanceRules />
        <FillField
          as="p"
          className="mt-4 text-xs text-muted"
          data-preview-field-path="finance.rulesSource"
          vars={{ source: LTV_RULES.source, date: LTV_RULES.effectiveDate }}
        />
      </section>

      <section className="container-x pb-16 md:pb-20">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="finance.budgetEyebrow" />}
          title={<Field data-preview-field-path="finance.budgetTitle" />}
          className="mb-8"
        />
        <BudgetFinder />
      </section>

      <section className="container-x pb-20 md:pb-28">
        <SectionHeader
          eyebrow={<Field data-preview-field-path="finance.runningEyebrow" />}
          title={<Field data-preview-field-path="finance.runningTitle" />}
          className="mb-8"
        />
        <RunningCost />
      </section>
    </>
  );
}
