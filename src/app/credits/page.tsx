import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Credits" };

export default function CreditsPage() {
  return (
    <>
      <PageHeader eyebrow="Credits" title="Photos, 3D model and libraries" crumbs={[{ href: "/credits", label: "Credits" }]} />
      <section className="container-x max-w-3xl space-y-8 py-12 leading-relaxed text-muted-strong md:py-16">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Photography</h2>
          <p className="mt-2">
            All photos are from{" "}
            <a href="https://unsplash.com" className="underline underline-offset-2" rel="noopener" target="_blank">
              Unsplash
            </a>{" "}
            and used under the Unsplash License. Thank you to the photographers. Photos illustrate the type of car listed and are not the
            actual vehicles.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">3D model</h2>
          <p className="mt-2">
            Demonstration model &ldquo;Ferrari 458 Italia&rdquo; by vicent091036, distributed with the three.js examples. Used only to show the
            3D viewer; it is not stock for sale.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Software</h2>
          <p className="mt-2">Next.js, React, Tailwind CSS, FlyonUI, Lucide icons, Motion, three.js, lottie-web and Zustand, all under open-source licences.</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">About this demo</h2>
          <p className="mt-2">
            Drivora Motors is a fictional dealer. Cars, prices, reviews and people are illustrative. Leasing limits follow the Central Bank of
            Sri Lanka directions effective 25 May 2026; rates are samples.
          </p>
        </div>
      </section>
    </>
  );
}
