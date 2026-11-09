"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { LinkField } from "@/components/ui/LinkField";
import { num, rs } from "@/lib/format";
import { Field, fill, useText } from "@/lib/site-data";
import { vehicleIndex, vehicles } from "@/data/vehicles";

/**
 * Tesla/Porsche-style big thin numbers, drawn from the listing itself. Which car is featured is
 * editable in Fivora (`home.spotlight.vehicleId`); its details come from that car's own fields.
 */
export function Spotlight() {
  const text = useText();
  const v: Vehicle | undefined = vehicles.find((o) => o.id === text("home.spotlight.vehicleId")) ?? vehicles[0];
  if (!v) return null;
  const i = vehicleIndex(v);
  return (
    <section className="px-3 md:px-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <div className="container-x relative py-14 md:py-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div data-reveal>
              <Field as="p" className="eyebrow-dark" data-preview-field-path="home.spotlight.eyebrow" />
              <h2 className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-5xl">
                <Field data-preview-field-path={`vehicles[${i}].make`} /> <Field data-preview-field-path={`vehicles[${i}].model`} />
              </h2>
              <p className="mt-2 text-white/60">
                <Field data-preview-field-path={`vehicles[${i}].grade`} /> · <Field data-preview-field-path={`vehicles[${i}].colour`} />
              </p>
            </div>
            <div data-reveal className="md:text-right">
              <Field as="p" className="text-sm text-white/55" data-preview-field-path="home.spotlight.priceLabel" />
              <Field
                as="p"
                className="font-display text-3xl font-semibold whitespace-nowrap"
                data-num
                data-preview-field-path={`vehicles[${i}].priceLkr`}
                format={(p) => rs(Number(p))}
              />
            </div>
          </div>

          <div className="relative mt-10 md:mt-6">
            <div className="relative aspect-16/10 overflow-hidden rounded-3xl md:aspect-21/9">
              <Photo
                id={v.images[0]}
                alt={fill(text("home.spotlight.photoAlt"), { colour: v.colour, make: v.make, model: v.model })}
                fill
                sizes="(min-width:1280px) 1200px, 100vw"
                quality={70}
                className="object-cover"
                data-preview-field-path={`vehicles[${i}].images[0]`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-night/70 via-transparent to-night/20" />
            </div>
          </div>

          <dl className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:mt-16">
            <Stat n={0} label={<Field data-preview-field-path="home.spotlight.yearLabel" />}>
              <Field data-preview-field-path={`vehicles[${i}].yom`} />
            </Stat>
            <Stat n={1} label={<Field data-preview-field-path="home.spotlight.mileageLabel" />}>
              <Field data-preview-field-path={`vehicles[${i}].mileageKm`} format={(m) => num(Math.round(Number(m) / 100) * 100)} />
              <Field className="ml-1 align-top text-xs font-normal text-white/60 md:text-base" data-preview-field-path="common.units.km" />
            </Stat>
            <Stat n={2} label={<Field data-preview-field-path="home.spotlight.gradeLabel" />}>
              <Field data-preview-field-path={`vehicles[${i}].auctionGrade`} format={(g) => g || "—"} />
            </Stat>
            <Stat n={3} label={<Field data-preview-field-path="home.spotlight.seatsLabel" />}>
              <Field data-preview-field-path={`vehicles[${i}].seats`} />
            </Stat>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/cars/${v.slug}`} className="btn-light" data-preview-field-path={`vehicles[${i}].slug`}>
              <Field data-preview-field-path="home.spotlight.viewLabel" /> <ArrowRight className="size-4" />
            </Link>
            <LinkField
              data-preview-field-path="home.spotlight.bookHref"
              className="btn-pill border border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              <Field data-preview-field-path="home.spotlight.bookLabel" />
            </LinkField>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label, children }: { n: number; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div data-reveal style={{ ["--reveal-i" as string]: n }} className="relative border-t border-white/15 pt-4">
      {/* Tesla-style dotted leader up into the photo, desktop only */}
      <span aria-hidden className="absolute -top-18 left-0 hidden h-18 w-px bg-[linear-gradient(to_bottom,rgba(255,255,255,.55)_50%,transparent_50%)] bg-size-[1px_6px] lg:block" />
      <span aria-hidden className="absolute top-[-4.85rem] -left-1 hidden size-2.25 rounded-full border-2 border-white bg-brand-bright lg:block" />
      <dd className="font-display text-[2.1rem] leading-none font-extralight tracking-tight sm:text-[2.6rem] md:text-5xl lg:text-6xl" data-num>
        {children}
      </dd>
      <dt className="mt-2 text-xs tracking-[0.12em] text-white/55 uppercase">{label}</dt>
    </div>
  );
}
