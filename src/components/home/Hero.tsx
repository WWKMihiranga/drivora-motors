"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Field, fill, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

type Slide = {
  image: string;
  alt: string;
  carHref: string;
  carLabel: string;
  eyebrow: string;
  title: string;
  text: string;
  linkHref: string;
  linkLabel: string;
};

/* Slides, copy, stats and every control label are editable in Fivora (site-data.json `home.hero`). */
const INTERVAL = 6500;

export function Hero() {
  const text = useText();
  const slides = useList<Slide>("home.hero.slides");
  const stats = useList<{ value: string; label: string }>("home.hero.stats");
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touch = useRef<number | null>(null);

  const count = slides.length;
  const go = useCallback((n: number) => setI(count ? (n + count) % count : 0), [count]);

  useEffect(() => {
    if (paused || userPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(i + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, paused, userPaused, go]);

  const idx0 = count ? Math.min(i, count - 1) : 0;
  const s: Slide | undefined = slides[idx0];

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="hero-carousel-label"
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
      <Field id="hero-carousel-label" className="sr-only" data-preview-field-path="home.hero.carouselLabel" />
      <div className="container-x lg:grid lg:min-h-[clamp(32rem,62svh,38rem)] lg:grid-cols-2 lg:gap-12">
        <div data-preview-list-path="home.hero.slides" className="relative aspect-4/3 overflow-hidden rounded-3xl bg-night sm:aspect-16/10 md:rounded-4xl lg:absolute lg:top-28 lg:right-0 lg:bottom-16 lg:left-[calc(50%+1.5rem)] lg:aspect-auto lg:rounded-none lg:rounded-l-[2.25rem]">
          {slides.map((sl, idx) => (
            <div
              key={`${sl.image}-${idx}`}
              inert={idx !== idx0}
              data-preview-item-path={`home.hero.slides[${idx}]`}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-1100 ease-out-soft",
                idx === idx0 ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
              )}
            >
              <Photo
                id={sl.image}
                alt={sl.alt}
                data-preview-field-path={`home.hero.slides[${idx}].image`}
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

          {s && (
          <Link
            key={`${s.carHref}-${idx0}`}
            href={s.carHref || "/"}
            className="group absolute bottom-5 left-5 animate-fade-up text-white md:bottom-8 md:left-8"
            data-preview-field-path={`home.hero.slides[${idx0}].carHref`}
          >
            <Field
              className="block text-[0.66rem] font-semibold tracking-[0.16em] text-white/65 uppercase"
              data-preview-field-path="home.hero.inStockLabel"
            />
            <span className="mt-1 flex items-center gap-2 font-display text-base font-semibold lg:text-lg">
              <Field
                className="underline decoration-white/0 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-white/70"
                data-preview-field-path={`home.hero.slides[${idx0}].carLabel`}
              />
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          )}

          {/* controls: top-right, aligned to the container's right edge where the photo bleeds */}
          <div
            className="absolute top-3 right-3 flex items-center rounded-full bg-night/40 p-1 pl-3.5 text-white ring-1 ring-white/15 backdrop-blur-md ring-inset md:top-5 md:right-5 lg:top-6 lg:right-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]"
            data-num
          >
            <span className="text-xs font-semibold">{String(idx0 + 1).padStart(2, "0")}</span>
            <div className="mx-2 flex gap-1" role="tablist" aria-labelledby="hero-choose-label">
              <Field id="hero-choose-label" className="sr-only" data-preview-field-path="home.hero.chooseSlideLabel" />
              {slides.map((sl, idx) => (
                <button
                  key={`${sl.image}-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === idx0}
                  aria-label={fill(text("home.hero.slideLabel"), { n: idx + 1, title: sl.title })}
                  data-preview-field-path="home.hero.slideLabel"
                  onClick={() => go(idx)}
                  className="relative h-8 w-6 md:w-8"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                    <span
                      key={`${i}-${paused || userPaused}`}
                      className={cn(
                        "absolute inset-0 origin-left rounded-full bg-white",
                        idx < idx0 && "scale-x-100",
                        idx > idx0 && "scale-x-0",
                        idx === idx0 && (paused || userPaused ? "scale-x-100" : "hero-progress"),
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
            <span className="mr-1.5 text-xs text-white/55">{String(count).padStart(2, "0")}</span>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? text("home.hero.playLabel") : text("home.hero.pauseLabel")}
              data-preview-field-path="home.hero.pauseLabel"
              className="flex size-8 items-center justify-center rounded-full hover:bg-white/15"
            >
              {userPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label={text("home.hero.prevLabel")}
              data-preview-field-path="home.hero.prevLabel"
              className="hidden size-8 items-center justify-center rounded-full hover:bg-white/15 sm:flex"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label={text("home.hero.nextLabel")}
              data-preview-field-path="home.hero.nextLabel"
              className="hidden size-8 items-center justify-center rounded-full hover:bg-white/15 sm:flex"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* copy: top block aligns with the photo's top edge, stats rule with its bottom edge */}
        <div className="relative z-10 flex flex-col pt-7 md:pt-10 lg:justify-between lg:pt-0">
          <div>
            {s && (
            <div key={idx0} className="space-y-5">
              <Field
                as="p"
                data-hero-in
                className="eyebrow animate-fade-up"
                data-preview-field-path={`home.hero.slides[${idx0}].eyebrow`}
              />
              <Field
                as="h1"
                data-hero-in
                className="animate-fade-up font-display text-[2.35rem] leading-[1.04] font-semibold [animation-delay:80ms] sm:text-5xl lg:text-[3.6rem]"
                data-preview-field-path={`home.hero.slides[${idx0}].title`}
              />
              <Field
                as="p"
                data-hero-in
                className="max-w-md animate-fade-up text-[1.02rem] leading-relaxed text-muted-strong [animation-delay:160ms]"
                data-preview-field-path={`home.hero.slides[${idx0}].text`}
              />
            </div>
            )}
            <div data-hero-in className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <Link href={text("home.hero.browseHref") || "/cars"} className="btn-ink" data-preview-field-path="home.hero.browseHref">
                <Field data-preview-field-path="home.hero.browseLabel" /> <ArrowRight className="size-4" />
              </Link>
              {s && (
                <Link
                  href={s.linkHref || "/"}
                  className="btn-line"
                  data-preview-field-path={`home.hero.slides[${idx0}].linkHref`}
                >
                  <Field data-preview-field-path={`home.hero.slides[${idx0}].linkLabel`} />
                </Link>
              )}
            </div>
          </div>

          <dl
            data-preview-list-path="home.hero.stats"
            data-hero-in
            className="mt-10 grid animate-fade-up grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:320ms] lg:mt-12"
          >
            {stats.map((st, n) => (
              <div key={n} data-preview-item-path={`home.hero.stats[${n}]`}>
                <Field as="dt" className="sr-only" data-preview-field-path={`home.hero.stats[${n}].label`} />
                <Field
                  as="dd"
                  className="font-display text-2xl font-semibold md:text-[1.75rem]"
                  data-num
                  data-preview-field-path={`home.hero.stats[${n}].value`}
                />
                <Field
                  as="dd"
                  className="mt-1 text-xs leading-snug text-muted-strong"
                  data-preview-field-path={`home.hero.stats[${n}].label`}
                />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
