import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";
import { Field, FillField } from "@/lib/site-data";
import { AboutBody } from "./AboutBody";

export const metadata: Metadata = pageMeta("about");

/* Every word, photo, stat, milestone and team member is editable in Fivora (site-data.json `about`). */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={<FillField data-preview-field-path="about.header.eyebrow" vars={{ year: site.founded }} />}
        title={<Field data-preview-field-path="about.header.title" />}
        text={<Field data-preview-field-path="about.header.text" />}
        crumbs={[<Crumb key="c" data-preview-field-path="about.header.crumbHref" label={<Field data-preview-field-path="about.header.crumbLabel" />} />]}
      />

      <AboutBody />
    </>
  );
}
