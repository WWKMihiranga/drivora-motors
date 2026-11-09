import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { getFaqs } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";

export const metadata: Metadata = pageMeta("faq");

/* Questions live in site-data.json `faqs`; page wording in `faq`. All editable in Fivora. */
export default async function FaqPage() {
  const faqs = await getFaqs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow={<Field data-preview-field-path="faq.header.eyebrow" />}
        title={<Field data-preview-field-path="faq.header.title" />}
        crumbs={[<Crumb key="c" data-preview-field-path="faq.header.crumbHref" label={<Field data-preview-field-path="faq.header.crumbLabel" />} />]}
      />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-line border-y border-line">
          <div className="divide-y divide-line" data-preview-list-path="faqs">
            {faqs.map((f, i) => (
              <details key={`${f.q}-${i}`} className="group py-1 [&_summary::-webkit-details-marker]:hidden" data-preview-item-path={`faqs[${i}]`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium">
                  <Field data-preview-field-path={`faqs[${i}].q`} />
                  <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
                </summary>
                <Field as="p" className="pb-5 leading-relaxed text-muted-strong" data-preview-field-path={`faqs[${i}].a`} />
              </details>
            ))}
          </div>
          <details className="group py-1 [&_summary::-webkit-details-marker]:hidden" id="privacy">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium">
              <Field data-preview-field-path="faq.privacyQuestion" />
              <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
            </summary>
            <Field as="p" className="pb-5 leading-relaxed text-muted-strong" data-preview-field-path="faq.privacyAnswer" />
          </details>
        </div>
        <aside className="h-fit rounded-3xl bg-night p-6 text-white lg:sticky lg:top-28">
          <Field as="p" className="font-display text-xl font-semibold text-white" data-preview-field-path="faq.asideTitle" />
          <Field as="p" className="mt-2 text-sm text-white/65" data-preview-field-path="faq.asideText" />
          <OpenChatButton className="btn-light mt-5 w-full">
            <Field data-preview-field-path="faq.asideButton" />
          </OpenChatButton>
        </aside>
      </section>
    </>
  );
}
