import type { Metadata } from "next";
import { Suspense } from "react";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { BookingForm, BookingFormFromUrl } from "@/components/forms/BookingForm";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";

export const metadata: Metadata = pageMeta("book");

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="book.header.eyebrow" />}
        title={<Field data-preview-field-path="book.header.title" />}
        text={<Field data-preview-field-path="book.header.text" />}
        crumbs={[<Crumb key="c" data-preview-field-path="book.header.crumbHref" label={<Field data-preview-field-path="book.header.crumbLabel" />} />]}
      />
      <section className="container-x py-12 md:py-16">
        <Suspense fallback={<BookingForm />}>
          <BookingFormFromUrl />
        </Suspense>
      </section>
    </>
  );
}
