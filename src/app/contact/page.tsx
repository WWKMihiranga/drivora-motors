import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";
import { ContactBody } from "./ContactBody";

export const metadata: Metadata = pageMeta("contact");

/* Every word here is editable in Fivora (site-data.json `contact` and `common.business`). */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="contact.header.eyebrow" />}
        title={<Field data-preview-field-path="contact.header.title" />}
        text={<Field data-preview-field-path="contact.header.text" />}
        crumbs={[<Crumb key="c" data-preview-field-path="contact.header.crumbHref" label={<Field data-preview-field-path="contact.header.crumbLabel" />} />]}
      />
      <ContactBody />
    </>
  );
}
