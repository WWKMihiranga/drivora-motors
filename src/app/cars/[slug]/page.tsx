import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { getSimilar, getVehicle, getVehicles } from "@/lib/api";
import { Gallery } from "@/components/vehicle/Gallery";
import { TrustPanel } from "@/components/vehicle/TrustPanel";
import { DetailActions } from "@/components/vehicle/DetailActions";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { ConditionBadge, HighlightBadge, VerifiedTick } from "@/components/vehicle/Badges";
import { LeasingCalculator } from "@/components/finance/LeasingCalculator";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { bodyLabel, conditionLabel, fuelLabel, num, rs, vehicleTitle } from "@/lib/format";
import { registrationOf } from "@/lib/estimate";
import { vehicleJsonLd } from "@/lib/seo";
import { u } from "@/lib/unsplash";

export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) return { title: "Car not found" };
  const title = `${vehicleTitle(v)} ${v.grade ?? ""}`.trim();
  const description = `${conditionLabel[v.condition]} ${title}, ${num(v.mileageKm)} km, ${fuelLabel[v.fuel]}. ${rs(v.priceLkr)}. ${v.highlights.join(". ")}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: `${u(v.images[0])}?w=1200&q=70&auto=format` }] },
  };
}

/*
 * The page itself stays synchronous so the route's App Shell (header, layout, skeleton) can render
 * the moment a car link is clicked. Everything that reads `params` lives below the Suspense
 * boundary; each slug is still prerendered from generateStaticParams, so it streams in from static output.
 */
export default function CarPage({ params }: PageProps<"/cars/[slug]">) {
  return (
    <Suspense fallback={<CarSkeleton />}>
      <CarDetails params={params} />
    </Suspense>
  );
}

function CarSkeleton() {
  return (
    <div className="container-x pt-24 md:pt-28" aria-busy="true" aria-label="Loading car">
      <div className="mb-5 hidden h-4 w-64 animate-pulse rounded-full bg-surface md:block" />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="-mx-6 aspect-4/3 animate-pulse bg-surface md:aspect-16/10 lg:mx-0 lg:aspect-16/11 lg:rounded-3xl" />
          <div className="mt-6 space-y-3 md:mt-8">
            <div className="h-7 w-40 animate-pulse rounded-full bg-surface" />
            <div className="h-10 w-72 max-w-full animate-pulse rounded-xl bg-surface" />
            <div className="h-5 w-56 animate-pulse rounded-full bg-surface" />
          </div>
          <div className="mt-8 h-28 animate-pulse rounded-2xl bg-surface" />
        </div>
        <div className="hidden h-105 animate-pulse rounded-[1.75rem] bg-surface lg:block" />
      </div>
    </div>
  );
}

async function CarDetails({ params }: { params: PageProps<"/cars/[slug]">["params"] }) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) notFound();
  const similar = await getSimilar(v);
  const title = vehicleTitle(v);

  const bigStats = [
    { n: String(v.yom), l: v.yor && v.yor !== v.yom ? `Year · reg. ${v.yor}` : "Year" },
    { n: num(v.mileageKm), u: "km", l: "Mileage" },
    v.batteryKwh ? { n: String(v.batteryKwh), u: "kWh", l: "Battery" } : { n: num(v.engineCc ?? 0), u: "cc", l: "Engine" },
    { n: String(v.seats), l: "Seats" },
  ];

  const specs: [string, string][] = [
    ["Condition", conditionLabel[v.condition]],
    ["Make / model", `${v.make} ${v.model}`],
    ["Grade", v.grade ?? "—"],
    ["Year of manufacture", String(v.yom)],
    ["First registered", v.yor ? String(v.yor) : "Not yet registered"],
    ["Mileage", `${num(v.mileageKm)} km`],
    ["Fuel", fuelLabel[v.fuel]],
    ["Gearbox", v.transmission === "auto" ? "Automatic" : "Manual"],
    [v.batteryKwh ? "Battery" : "Engine", v.batteryKwh ? `${v.batteryKwh} kWh` : `${num(v.engineCc ?? 0)} cc`],
    ["Body", bodyLabel[v.bodyType]],
    ["Colour", v.colour],
    ["Seats", String(v.seats)],
    ["Location", v.location],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd(v)) }} />

      <div className="container-x pt-24 md:pt-28">
        <nav aria-label="Breadcrumb" className="mb-5 hidden md:block">
          <ol className="flex items-center gap-1.5 text-xs text-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li>
              <Link href="/cars" className="hover:text-ink">
                Cars
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li>
              <Link href={`/cars?make=${encodeURIComponent(v.make)}`} className="hover:text-ink">
                {v.make}
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li aria-current="page" className="text-ink">
              {v.model} {v.yom}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 xl:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <Gallery images={v.images} alt={`${v.colour} ${title}`} ghost={v.model.split(" ")[0].toUpperCase()} />

            <div className="mt-6 md:mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <ConditionBadge condition={v.condition} />
                {v.verified && <VerifiedTick />}
                {v.badge && <HighlightBadge>{v.badge}</HighlightBadge>}
              </div>
              <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold md:text-[2.6rem]">
                {v.make} {v.model}
              </h1>
              <p className="mt-1 text-muted-strong">
                {v.grade} · {v.colour} · {v.location}
              </p>
            </div>

            <div className="mt-6 lg:hidden">
              <DetailActions v={v} placement="inline" />
            </div>

            {/* Tesla/Porsche-style big numbers */}
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-6 md:grid-cols-4">
              {bigStats.map((s) => (
                <div key={s.l}>
                  <dd className="font-display text-[2.1rem] leading-none font-extralight tracking-tight md:text-[2.6rem]" data-num>
                    {s.n}
                    {s.u && <span className="ml-1 align-top text-sm font-normal text-muted">{s.u}</span>}
                  </dd>
                  <dt className="mt-2 text-xs tracking-widest text-muted uppercase">{s.l}</dt>
                </div>
              ))}
            </dl>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold md:text-2xl">About this car</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-strong">{v.description}</p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {v.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[0.95rem]">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ok/10 text-ok">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <TrustPanel v={v} />
            </section>

            <section className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-display text-xl font-semibold">Specifications</h2>
                <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
                  {specs.map(([k, val]) => (
                    <div key={k} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Features</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {v.features.map((f) => (
                    <li key={f} className="chip h-9 px-3.5 text-[0.82rem] text-ink">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {v.status !== "sold" && (
              <section id="leasing" className="mt-12 scroll-mt-28">
                <p className="eyebrow">Leasing estimate</p>
                <h2 className="mt-2 font-display text-xl font-semibold md:text-2xl">What would this cost per month?</h2>
                <div className="mt-5">
                  <LeasingCalculator
                    compact
                    lockPrice
                    init={{ price: v.priceLkr, vehicleClass: v.vehicleClass, reg: registrationOf(v) }}
                  />
                </div>
              </section>
            )}

            <section id="enquire" className="mt-12 scroll-mt-28 rounded-3xl bg-surface p-5 md:p-8">
              <h2 className="font-display text-xl font-semibold md:text-2xl">Ask about this car</h2>
              <p className="mt-1 mb-6 text-sm text-muted">We reply by phone or WhatsApp, usually within 10 minutes.</p>
              <EnquiryForm vehicle={`${title} ${v.grade ?? ""}`.trim()} />
            </section>
          </div>

          <aside className="lg:pt-0">
            <div className="lg:sticky lg:top-28">
              <DetailActions v={v} />
            </div>
          </aside>
        </div>
      </div>

      <section className="container-x py-16 md:py-24" aria-labelledby="similar-title">
        <h2 id="similar-title" className="section-title">
          Similar cars
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((s, i) => (
            <VehicleCard key={s.id} v={s} index={i} sizes="(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw" />
          ))}
        </div>
      </section>
    </>
  );
}
