import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { TradeInForm } from "@/components/forms/TradeInForm";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";
import { SellPoints } from "./SellPoints";

export const metadata: Metadata = pageMeta("sell");

export default function SellPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="sell.header.eyebrow" />}
        title={<Field data-preview-field-path="sell.header.title" />}
        text={<Field data-preview-field-path="sell.header.text" />}
        crumbs={[<Crumb key="c" data-preview-field-path="sell.header.crumbHref" label={<Field data-preview-field-path="sell.header.crumbLabel" />} />]}
      />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_320px]">
        <TradeInForm />
        <SellPoints />
      </section>
    </>
  );
}
