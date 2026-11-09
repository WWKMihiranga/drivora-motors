import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { getFaqs } from "@/lib/api";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Reconditioned vs used, leasing down payments under the 2026 CBSL rules, trade-ins, delivery and privacy.",
};

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
      <PageHeader eyebrow="FAQ" title="Questions buyers ask us every week" crumbs={[{ href: "/faq", label: "FAQ" }]} />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium">
                {f.q}
                <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
              </summary>
              <p className="pb-5 leading-relaxed text-muted-strong">{f.a}</p>
            </details>
          ))}
          <details className="group py-1 [&_summary::-webkit-details-marker]:hidden" id="privacy">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium">
              How do you handle my personal data?
              <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
            </summary>
            <p className="pb-5 leading-relaxed text-muted-strong">
              We only use your details to answer your enquiry, arrange viewings and prepare leasing applications you ask for, in line with the
              Personal Data Protection Act No. 9 of 2022. You can ask us to see or delete your data at any time. On this demo site, nothing
              you type leaves your browser.
            </p>
          </details>
        </div>
        <aside className="h-fit rounded-3xl bg-night p-6 text-white lg:sticky lg:top-28">
          <p className="font-display text-xl font-semibold text-white">Still unsure?</p>
          <p className="mt-2 text-sm text-white/65">Ask our assistant. It knows our stock and the leasing rules.</p>
          <OpenChatButton className="btn-light mt-5 w-full">Ask a question</OpenChatButton>
        </aside>
      </section>
    </>
  );
}
