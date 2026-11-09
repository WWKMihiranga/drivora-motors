import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Book a test drive",
  description: "Pick a car, a day and a time. Test drives at our Nugegoda showroom or at your home.",
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Test drive"
        title="Book a test drive in under a minute"
        text="At our showroom, or we bring the car to you within 30 km of Nugegoda. Bring your licence; we handle the rest."
        crumbs={[{ href: "/book", label: "Book a test drive" }]}
      />
      <section className="container-x py-12 md:py-16">
        <Suspense fallback={<div className="h-150 animate-pulse rounded-[1.75rem] bg-surface" />}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  );
}
