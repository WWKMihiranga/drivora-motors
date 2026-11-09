import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CompareView } from "./CompareView";

export const metadata: Metadata = { title: "Compare cars" };

export default function ComparePage() {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Side by side, no spreadsheet needed" crumbs={[{ href: "/compare", label: "Compare" }]} />
      <section className="container-x py-12 md:py-16">
        <CompareView />
      </section>
    </>
  );
}
