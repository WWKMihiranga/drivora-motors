import type { Metadata } from "next";
import { Banknote, Clock3, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TradeInForm } from "@/components/forms/TradeInForm";

export const metadata: Metadata = {
  title: "Sell or trade in your car",
  description: "Get a same-day price range for your car, then sell it to us or trade it in against your next one.",
};

export default function SellPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sell or trade in"
        title="A fair price for your car, the same day"
        text="Tell us about your car and we'll send a price range. Sell it outright, or trade it in and we'll take it off your next car's price."
        crumbs={[{ href: "/sell", label: "Sell or trade in" }]}
      />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_320px]">
        <TradeInForm />
        <aside className="space-y-6">
          {[
            [Clock3, "Same-day reply", "Most estimates go out within a few hours during opening hours."],
            [FileCheck2, "We do the paperwork", "Transfer forms, finance settlement and the RMV visit."],
            [Banknote, "Paid on the spot", "Bank transfer while you wait, once the papers are signed."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Clock3;
            return (
              <div key={t as string} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line">
                  <I className="size-5" strokeWidth={1.4} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t as string}</p>
                  <p className="mt-1 text-sm text-muted">{d as string}</p>
                </div>
              </div>
            );
          })}
        </aside>
      </section>
    </>
  );
}
