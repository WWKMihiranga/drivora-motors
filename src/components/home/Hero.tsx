"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { IMG } from "@/lib/unsplash";
import { site } from "@/config/site";
import { num } from "@/lib/format";
import { cn } from "@/lib/cn";

const slides = [
  {
    img: IMG.heroDefender,
    alt: "Black Land Rover Defender 110 lit in a dark studio",
    car: { href: "/cars/land-rover-defender-110-2023", label: "Land Rover Defender 110 · 2023" },
    eyebrow: "Reconditioned · grade 4 and above",
    title: "Cars with nothing to hide.",
    text: "Every car comes with its auction sheet or service history, a 150-point inspection, and a price that doesn't change at the desk.",
    link: { href: "/cars?condition=reconditioned", label: "Reconditioned stock" },
  },
  {
    img: IMG.heroLandCruiser,
    alt: "Dark grey Toyota Land Cruiser 200 parked in afternoon sun",
    car: { href: "/cars/toyota-land-cruiser-200-2015", label: "Toyota Land Cruiser 200 · 2015" },
    eyebrow: "Central Bank rules, built in",
    title: "Know your monthly payment first.",
    text: "Our leasing calculator applies the 2026 down-payment limits, and shows both the flat and the true rate.",
    link: { href: "/finance", label: "Open the calculator" },
  },
  {
    img: IMG.heroSeal,
    alt: "White BYD Seal electric saloon at night, headlights on",
    car: { href: "/cars/byd-seal-2025", label: "BYD Seal · 2025" },
    eyebrow: "EV and hybrid",
    title: "Electric, without the guesswork.",
    text: "Battery health is tested and printed on every listing, and we arrange your home charger before delivery.",
    link: { href: "/cars?fuel=electric", label: "Electric cars" },
  },
] as const;

const INTERVAL = 6500;

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touch = useRef<number | null>(null);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || userPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(i + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, paused, userPaused, go]);

  const s = slides[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="hero-gradient relative overflow-hidden pt-24 pb-10 md:pt-28 lg:pb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      {/*
       * Layout: on lg+ the photo is pinned to the section's padding box (top-28 / bottom-16 match
       * pt-28 / pb-16) and bleeds off the right edge, so its top lines up with the eyebrow and its
       * bottom with the stats rule. Below lg it sits in the flow above the copy.
       */}
      <div className="container-x lg:grid lg:min-h-[clamp(32rem,62svh,38rem)] lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-night sm:aspect-16/10 md:rounded-4xl lg:absolute lg:top-28 lg:right-0 lg:bottom-16 lg:left-[calc(50%+1.5rem)] lg:aspect-auto lg:rounded-none lg:rounded-l-[2.25rem]">
          {slides.map((sl, idx) => (
            <div
              key={sl.img}
              aria-hidden={idx !== i}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-1100 ease-out-soft",
                idx === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
              )}
            >
              <Photo
                id={sl.img}
                alt={sl.alt}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "low"}
                loading={idx === 0 ? "eager" : "lazy"}
                quality={75}
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
          {/* scrims keep the caption and controls legible on any photo; night stays dark in both themes */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-night/75 via-night/25 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-night/35 to-transparent" />

          <Link
            key={s.car.href}
            href={s.car.href}
            className="group absolute bottom-5 left-5 animate-fade-up text-white md:bottom-8 md:left-8"
          >
            <span className="block text-[0.66rem] font-semibold tracking-[0.16em] text-white/65 uppercase">In stock</span>
            <span className="mt-1 flex items-center gap-2 font-display text-base font-semibold lg:text-lg">
              <span className="underline decoration-white/0 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-white/70">
                {s.car.label}
              </span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* controls: top-right, aligned to the container's right edge where the photo bleeds */}
          <div
            className="absolute top-3 right-3 flex items-center rounded-full bg-night/40 p-1 pl-3.5 text-white ring-1 ring-white/15 backdrop-blur-md ring-inset md:top-5 md:right-5 lg:top-6 lg:right-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]"
            data-num
          >
            <span className="text-xs font-semibold">{String(i + 1).padStart(2, "0")}</span>
            <div className="mx-2 flex gap-1" role="tablist" aria-label="Choose slide">
              {slides.map((sl, idx) => (
                <button
                  key={sl.img}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Slide ${idx + 1}: ${sl.title}`}
                  onClick={() => go(idx)}
                  className="relative h-8 w-6 md:w-8"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                    <span
                      key={`${i}-${paused || userPaused}`}
                      className={cn(
                        "absolute inset-0 origin-left rounded-full bg-white",
                        idx < i && "scale-x-100",
                        idx > i && "scale-x-0",
                        idx === i && (paused || userPaused ? "scale-x-100" : "hero-progress"),
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
            <span className="mr-1.5 text-xs text-white/55">{String(slides.length).padStart(2, "0")}</span>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="flex size-8 items-center justify-center rounded-full hover:bg-white/15"
            >
              {userPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous slide"
              className="hidden size-8 items-center justify-center rounded-full hover:bg-white/15 sm:flex"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Next slide"
              className="hidden size-8 items-center justify-center rounded-full hover:bg-white/15 sm:flex"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* copy: top block aligns with the photo's top edge, stats rule with its bottom edge */}
        <div className="relative z-10 flex flex-col pt-7 md:pt-10 lg:justify-between lg:pt-0">
          <div>
            <div key={i} className="space-y-5">
              <p data-hero-in className="eyebrow animate-fade-up">
                {s.eyebrow}
              </p>
              <h1
                data-hero-in
                className="animate-fade-up font-display text-[2.35rem] leading-[1.04] font-semibold [animation-delay:80ms] sm:text-5xl lg:text-[3.6rem]"
              >
                {s.title}
              </h1>
              <p
                data-hero-in
                className="max-w-md animate-fade-up text-[1.02rem] leading-relaxed text-muted-strong [animation-delay:160ms]"
              >
                {s.text}
              </p>
            </div>
            <div data-hero-in className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <Link href="/cars" className="btn-ink">
                Browse cars <ArrowRight className="size-4" />
              </Link>
              <Link href={s.link.href} className="btn-line">
                {s.link.label}
              </Link>
            </div>
          </div>

          <dl
            data-hero-in
            className="mt-10 grid animate-fade-up grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:320ms] lg:mt-12"
          >
            {[
              [`${site.stats.years}+`, "years in Nugegoda"],
              [`${num(site.stats.carsSold)}+`, "cars sold"],
              [`${site.stats.happy}%`, "would buy again"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-semibold md:text-[1.75rem]" data-num>
                  {n}
                </dd>
                <dd className="mt-1 text-xs leading-snug text-muted-strong">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
