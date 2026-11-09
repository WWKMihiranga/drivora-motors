import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";
import { CompareView } from "./CompareView";

export const metadata: Metadata = pageMeta("compare");

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="compare.header.eyebrow" />}
        title={<Field data-preview-field-path="compare.header.title" />}
        crumbs={[<Crumb key="c" data-preview-field-path="compare.header.crumbHref" label={<Field data-preview-field-path="compare.header.crumbLabel" />} />]}
      />
      <section className="container-x py-12 md:py-16">
        <CompareView />
      </section>
    </>
  );
}
