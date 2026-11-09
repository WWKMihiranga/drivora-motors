import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { num, rs } from "@/lib/format";

/** Tesla/Porsche-style big thin numbers, drawn from the listing itself. */
export function Spotlight({ v }: { v: Vehicle }) {
  const stats = [
    { n: String(v.yom), u: "", l: "Year" },
    { n: num(Math.round(v.mileageKm / 100) * 100), u: "km", l: "Verified mileage" },
    { n: v.auctionGrade ?? "—", u: "", l: "Auction grade" },
    { n: String(v.seats), u: "", l: "Seats" },
  ];
  return (
    <section className="px-3 md:px-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <div className="container-x relative py-14 md:py-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div data-reveal>
              <p className="eyebrow-dark">Spotlight · just landed</p>
              <h2 className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-5xl">
                {v.make} {v.model}
              </h2>
              <p className="mt-2 text-white/60">
                {v.grade} · {v.colour}
              </p>
            </div>
            <div data-reveal className="md:text-right">
              <p className="text-sm text-white/55">Drive-away price</p>
              <p className="font-display text-3xl font-semibold whitespace-nowrap" data-num>
                {rs(v.priceLkr)}
              </p>
            </div>
          </div>

          <div className="relative mt-10 md:mt-6">
            <div className="relative aspect-16/10 overflow-hidden rounded-3xl md:aspect-21/9">
              <Photo
                id={v.images[0]}
                alt={`${v.colour} ${v.make} ${v.model} in a dark studio`}
                fill
                sizes="(min-width:1280px) 1200px, 100vw"
                quality={70}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-night/70 via-transparent to-night/20" />
            </div>

          </div>

          <dl className="relative mt-8 grid grid-cols-2 lg:mt-16 gap-x-6 gap-y-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.l} data-reveal style={{ ["--reveal-i" as string]: i }} className="relative border-t border-white/15 pt-4">
                {/* Tesla-style dotted leader up into the photo, desktop only */}
                <span aria-hidden className="absolute -top-18 left-0 hidden h-18 w-px bg-[linear-gradient(to_bottom,rgba(255,255,255,.55)_50%,transparent_50%)] bg-size-[1px_6px] lg:block" />
                <span aria-hidden className="absolute top-[-4.85rem] -left-1 hidden size-2.25 rounded-full border-2 border-white bg-brand-bright lg:block" />
                <dd className="font-display text-[2.1rem] leading-none font-extralight tracking-tight sm:text-[2.6rem] md:text-5xl lg:text-6xl" data-num>
                  {s.n}
                  {s.u && <span className="ml-1 align-top text-xs font-normal text-white/60 md:text-base">{s.u}</span>}
                </dd>
                <dt className="mt-2 text-xs tracking-[0.12em] text-white/55 uppercase">{s.l}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/cars/${v.slug}`} className="btn-light">
              View this car <ArrowRight className="size-4" />
            </Link>
            <Link href="/book" className="btn-pill border border-white/25 bg-transparent text-white hover:bg-white/10">
              Book a viewing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
