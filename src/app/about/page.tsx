import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { IMG } from "@/lib/unsplash";
import { site } from "@/config/site";
import { num } from "@/lib/format";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} has sold reconditioned and used cars from Nugegoda since ${site.founded}.`,
};

const timeline = [
  ["2011", "Opened with six cars on High Level Road."],
  ["2015", "Started publishing auction sheets for every import."],
  ["2019", "Built our own inspection bay and 150-point checklist."],
  ["2025", "Imports reopened; added EV and hybrid battery testing."],
  ["2026", "Leasing calculator updated for the new CBSL limits."],
];

const team = [
  ["Ruwan Fernando", "Founder", "Has bought cars at Japanese auctions since 2009."],
  ["Kasun Silva", "Sales", "The one who answers WhatsApp at 9 pm."],
  ["Nilmini Perera", "Leasing", "Knows every lender's paperwork by heart."],
  ["Suresh Kumar", "Workshop", "Runs the 150-point inspection."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Since ${site.founded}`}
        title="A car yard that shows its paperwork"
        text="We started with a simple rule: if we wouldn't sell a car to our own family, it doesn't go on the forecourt. Fifteen years later the rule hasn't changed."
        crumbs={[{ href: "/about", label: "About" }]}
      />

      <section className="container-x py-12 md:py-16">
        <div className="relative aspect-16/10 overflow-hidden rounded-[1.75rem] md:aspect-21/9" data-reveal>
          <Photo id={IMG.showroom} alt="Our showroom floor" fill sizes="(min-width:1280px) 1200px, 100vw" priority className="object-cover" />
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            [`${site.stats.years}`, "years in business"],
            [num(site.stats.carsSold), "cars sold"],
            ["150", "point inspection"],
            [`${site.stats.happy}%`, "would buy again"],
          ].map(([n, l], i) => (
            <div key={l} data-reveal style={{ ["--reveal-i" as string]: i }} className="border-t border-line pt-4">
              <dd className="font-display text-5xl font-extralight tracking-tight" data-num>
                {n}
              </dd>
              <dt className="mt-2 text-xs tracking-widest text-muted uppercase">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-10 pb-20 md:pb-28 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="section-title mt-3">Fifteen years, one rule</h2>
          <ol className="mt-8 space-y-0">
            {timeline.map(([y, t], i) => (
              <li key={y} data-reveal style={{ ["--reveal-i" as string]: i }} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line py-4">
                <span className="font-display font-semibold text-brand" data-num>
                  {y}
                </span>
                <span className="text-muted-strong">{t}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-[1.75rem]" data-reveal>
          <Photo id={IMG.inspection} alt="A technician inspecting an engine bay" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-x pb-20 md:pb-28">
        <p className="eyebrow">The team</p>
        <h2 className="section-title mt-3">People you&apos;ll actually talk to</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(([n, r, d], i) => (
            <li key={n} data-reveal style={{ ["--reveal-i" as string]: i }} className="rounded-[1.25rem] bg-surface p-5">
              <span className="flex size-12 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-on-ink">
                {n
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <p className="mt-4 font-semibold">{n}</p>
              <p className="text-sm text-brand">{r}</p>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">Team names are placeholders for the demo.</p>
        <Link href="/contact" className="btn-ink mt-10">
          Visit the showroom <ArrowRight className="size-4" />
        </Link>
      </section>
    </>
  );
}
