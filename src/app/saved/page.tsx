import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SavedView } from "./SavedView";

export const metadata: Metadata = { title: "Saved cars" };

export default function SavedPage() {
  return (
    <>
      <PageHeader eyebrow="Saved" title="Your shortlist" crumbs={[{ href: "/saved", label: "Saved" }]} />
      <section className="container-x py-12 md:py-16">
        <SavedView />
      </section>
    </>
  );
}
