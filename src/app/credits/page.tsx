import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";
import { CreditsBody } from "./CreditsBody";

export const metadata: Metadata = pageMeta("credits");

/* Editable in Fivora (site-data.json `credits.sections`); a section may include one inline link. */
export default function CreditsPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="credits.header.eyebrow" />}
        title={<Field data-preview-field-path="credits.header.title" />}
        crumbs={[<Crumb key="c" data-preview-field-path="credits.header.crumbHref" label={<Field data-preview-field-path="credits.header.crumbLabel" />} />]}
      />
      <CreditsBody />
    </>
  );
}
