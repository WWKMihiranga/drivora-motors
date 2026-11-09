import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";
import { SavedView } from "./SavedView";

export const metadata: Metadata = pageMeta("saved");

export default function SavedPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="saved.header.eyebrow" />}
        title={<Field data-preview-field-path="saved.header.title" />}
        crumbs={[<Crumb key="c" data-preview-field-path="saved.header.crumbHref" label={<Field data-preview-field-path="saved.header.crumbLabel" />} />]}
      />
      <section className="container-x py-12 md:py-16">
        <SavedView />
      </section>
    </>
  );
}
