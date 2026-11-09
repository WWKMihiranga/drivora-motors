"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { Gallery } from "@/components/vehicle/Gallery";
import { TrustPanel } from "@/components/vehicle/TrustPanel";
import { DetailActions } from "@/components/vehicle/DetailActions";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { ConditionBadge, HighlightBadge, VerifiedTick } from "@/components/vehicle/Badges";
import { LeasingCalculator } from "@/components/finance/LeasingCalculator";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { LinkField } from "@/components/ui/LinkField";
import { num, vehicleTitle } from "@/lib/format";
import { registrationOf } from "@/lib/estimate";
import { Field, fill, useText } from "@/lib/site-data";
import { vehicleIndex } from "@/data/vehicles";

/*
 * Car detail body. The car's own data is `vehicles[i]` in site-data.json; headings and labels are
 * `carDetail.*`. Everything is editable in Fivora.
 */
export function CarDetail({ v, similar }: { v: Vehicle; similar: Vehicle[] }) {
  const text = useText();
  const i = vehicleIndex(v);
  const title = vehicleTitle(v);
  const km = (n: number | string) => `${num(Number(n))}`;

  return (
    <>
      <div className="container-x pt-24 md:pt-28" data-preview-item-path={`vehicles[${i}]`}>
        <nav aria-labelledby="car-breadcrumb-label" className="mb-5 hidden md:block">
          <Field id="car-breadcrumb-label" className="sr-only" data-preview-field-path="common.ui.breadcrumbLabel" />
          <ol className="flex items-center gap-1.5 text-xs text-muted">
            <li>
              <LinkField data-preview-field-path="common.links.home" className="hover:text-ink">
                <Field data-preview-field-path="common.ui.breadcrumbHome" />
              </LinkField>
            </li>
            <ChevronRight className="size-3" />
            <li>
              <LinkField data-preview-field-path="carDetail.breadcrumbCarsHref" className="hover:text-ink">
                <Field data-preview-field-path="carDetail.breadcrumbCars" />
              </LinkField>
            </li>
            <ChevronRight className="size-3" />
            <li>
              <Link
                href={`/cars?make=${encodeURIComponent(v.make)}`}
                className="hover:text-ink"
                data-preview-field-path={`vehicles[${i}].make`}
              >
                <Field data-preview-field-path={`vehicles[${i}].make`} />
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li aria-current="page" className="text-ink">
              <Field data-preview-field-path={`vehicles[${i}].model`} /> <Field data-preview-field-path={`vehicles[${i}].yom`} />
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 xl:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <Gallery
              images={v.images}
              vi={i}
              alt={fill(text("carDetail.photoAlt"), { colour: v.colour, title })}
              ghost={v.model.split(" ")[0].toUpperCase()}
            />

            <div className="mt-6 md:mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <ConditionBadge condition={v.condition} data-preview-field-path={`vehicles[${i}].condition`} />
                {v.verified && <VerifiedTick />}
                {v.badge && <HighlightBadge data-preview-field-path={`vehicles[${i}].badge`}>{v.badge}</HighlightBadge>}
              </div>
              <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold md:text-[2.6rem]">
                <Field data-preview-field-path={`vehicles[${i}].make`} /> <Field data-preview-field-path={`vehicles[${i}].model`} />
              </h1>
              <p className="mt-1 text-muted-strong">
                <Field data-preview-field-path={`vehicles[${i}].grade`} /> · <Field data-preview-field-path={`vehicles[${i}].colour`} /> ·{" "}
                <Field data-preview-field-path={`vehicles[${i}].location`} />
              </p>
            </div>

            <div className="mt-6 lg:hidden">
              <DetailActions v={v} placement="inline" />
            </div>

            {/* Tesla/Porsche-style big numbers */}
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-6 md:grid-cols-4">
              <BigStat
                label={
                  v.yor && v.yor !== v.yom ? (
                    <Field data-preview-field-path="carDetail.statYearReg" format={(t) => fill(t, { year: v.yor ?? "" })} />
                  ) : (
                    <Field data-preview-field-path="carDetail.statYear" />
                  )
                }
              >
                <Field data-preview-field-path={`vehicles[${i}].yom`} />
              </BigStat>
              <BigStat label={<Field data-preview-field-path="carDetail.statMileage" />}>
                <Field data-preview-field-path={`vehicles[${i}].mileageKm`} format={km} />
                <Field className="ml-1 align-top text-sm font-normal text-muted" data-preview-field-path="common.units.km" />
              </BigStat>
              {v.batteryKwh ? (
                <BigStat label={<Field data-preview-field-path="carDetail.statBattery" />}>
                  <Field data-preview-field-path={`vehicles[${i}].batteryKwh`} />
                  <Field className="ml-1 align-top text-sm font-normal text-muted" data-preview-field-path="common.units.kwh" />
                </BigStat>
              ) : (
                <BigStat label={<Field data-preview-field-path="carDetail.statEngine" />}>
                  <Field data-preview-field-path={`vehicles[${i}].engineCc`} format={km} />
                  <Field className="ml-1 align-top text-sm font-normal text-muted" data-preview-field-path="common.units.cc" />
                </BigStat>
              )}
              <BigStat label={<Field data-preview-field-path="carDetail.statSeats" />}>
                <Field data-preview-field-path={`vehicles[${i}].seats`} />
              </BigStat>
            </dl>

            <section className="mt-10">
              <Field as="h2" className="font-display text-xl font-semibold md:text-2xl" data-preview-field-path="carDetail.aboutTitle" />
              <Field
                as="p"
                className="mt-3 max-w-2xl leading-relaxed text-muted-strong"
                data-preview-field-path={`vehicles[${i}].description`}
              />
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2" data-preview-list-path={`vehicles[${i}].highlights`}>
                {v.highlights.map((h, n) => (
                  <li
                    key={`${h}-${n}`}
                    className="flex items-start gap-2.5 text-[0.95rem]"
                    data-preview-item-path={`vehicles[${i}].highlights[${n}]`}
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ok/10 text-ok">
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <Field data-preview-field-path={`vehicles[${i}].highlights[${n}]`} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <TrustPanel v={v} />
            </section>

            <section className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <Field as="h2" className="font-display text-xl font-semibold" data-preview-field-path="carDetail.specsTitle" />
                <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
                  <Spec k={<Field data-preview-field-path="carDetail.specCondition" />}>
                    <Field data-preview-field-path={`vehicles[${i}].condition`} format={(c) => text(`labels.condition.${c}`) || c} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specMakeModel" />}>
                    <Field data-preview-field-path={`vehicles[${i}].make`} /> <Field data-preview-field-path={`vehicles[${i}].model`} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specGrade" />}>
                    <Field data-preview-field-path={`vehicles[${i}].grade`} format={(g) => g || "—"} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specYom" />}>
                    <Field data-preview-field-path={`vehicles[${i}].yom`} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specFirstReg" />}>
                    {v.yor ? (
                      <Field data-preview-field-path={`vehicles[${i}].yor`} />
                    ) : (
                      <Field data-preview-field-path="carDetail.specNotRegistered" />
                    )}
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specMileage" />}>
                    <Field
                      data-preview-field-path={`vehicles[${i}].mileageKm`}
                      format={(m) => `${km(m)} ${text("common.units.km")}`}
                    />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specFuel" />}>
                    <Field data-preview-field-path={`vehicles[${i}].fuel`} format={(f) => text(`labels.fuel.${f}`) || f} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specGearbox" />}>
                    <Field
                      data-preview-field-path={`vehicles[${i}].transmission`}
                      format={(t) => text(`labels.transmissionLong.${t}`) || t}
                    />
                  </Spec>
                  {/* plug-in hybrids can have both; a car with neither shows an engine row of 0 as before */}
                  {(!!v.engineCc || !v.batteryKwh) && (
                    <Spec k={<Field data-preview-field-path="carDetail.specEngine" />}>
                      <Field
                        data-preview-field-path={`vehicles[${i}].engineCc`}
                        format={(c) => `${km(c || 0)} ${text("common.units.cc")}`}
                      />
                    </Spec>
                  )}
                  {!!v.batteryKwh && (
                    <Spec k={<Field data-preview-field-path="carDetail.specBattery" />}>
                      <Field
                        data-preview-field-path={`vehicles[${i}].batteryKwh`}
                        format={(b) => `${b} ${text("common.units.kwh")}`}
                      />
                    </Spec>
                  )}
                  <Spec k={<Field data-preview-field-path="carDetail.specBody" />}>
                    <Field data-preview-field-path={`vehicles[${i}].bodyType`} format={(b) => text(`labels.body.${b}`) || b} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specColour" />}>
                    <Field data-preview-field-path={`vehicles[${i}].colour`} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specSeats" />}>
                    <Field data-preview-field-path={`vehicles[${i}].seats`} />
                  </Spec>
                  <Spec k={<Field data-preview-field-path="carDetail.specLocation" />}>
                    <Field data-preview-field-path={`vehicles[${i}].location`} />
                  </Spec>
                </dl>
              </div>
              <div>
                <Field as="h2" className="font-display text-xl font-semibold" data-preview-field-path="carDetail.featuresTitle" />
                <ul className="mt-4 flex flex-wrap gap-2" data-preview-list-path={`vehicles[${i}].features`}>
                  {v.features.map((f, n) => (
                    <li
                      key={`${f}-${n}`}
                      className="chip h-9 px-3.5 text-[0.82rem] text-ink"
                      data-preview-item-path={`vehicles[${i}].features[${n}]`}
                    >
                      <Field data-preview-field-path={`vehicles[${i}].features[${n}]`} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {v.status !== "sold" && (
              <section id="leasing" className="mt-12 scroll-mt-28">
                <Field as="p" className="eyebrow" data-preview-field-path="carDetail.leasingEyebrow" />
                <Field
                  as="h2"
                  className="mt-2 font-display text-xl font-semibold md:text-2xl"
                  data-preview-field-path="carDetail.leasingTitle"
                />
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
              <Field as="h2" className="font-display text-xl font-semibold md:text-2xl" data-preview-field-path="carDetail.enquireTitle" />
              <Field as="p" className="mt-1 mb-6 text-sm text-muted" data-preview-field-path="carDetail.enquireText" />
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
        <Field as="h2" id="similar-title" className="section-title" data-preview-field-path="carDetail.similarTitle" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((s, n) => (
            <VehicleCard key={s.id} v={s} index={n} sizes="(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw" />
          ))}
        </div>
      </section>
    </>
  );
}

function BigStat({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <dd className="font-display text-[2.1rem] leading-none font-extralight tracking-tight md:text-[2.6rem]" data-num>
        {children}
      </dd>
      <dt className="mt-2 text-xs tracking-widest text-muted uppercase">{label}</dt>
    </div>
  );
}

function Spec({ k, children }: { k: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
