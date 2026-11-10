"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { Field, fill, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

type Slide = {
  image: string;
  alt: string;
  imageDark: string;
  altDark: string;
  eyebrow: string;
  title: string;
  text: string;
  linkHref: string;
  linkLabel: string;
};

/*
 * "Studio" hero: copy on the left, the car standing in the same continuous studio gradient on the
 * right, key figures below. Each slide has two photos so the car melts into the backdrop in both
 * themes: `image` (a car shot on WHITE, blended with multiply) for light mode and `imageDark` (a car
 * shot on BLACK, blended with screen) for dark mode. Everything is editable in Fivora (`home.hero`).
 */
const INTERVAL = 6500; // keep in sync with .hero-progress in globals.css

/** entrance stagger; the splash rule in globals.css adds the same offset after the intro */
const delay = (ms: number) => ({ ["--hero-d" as string]: `${ms}ms`, animationDelay: `${ms}ms` });
const pad = (n: number) => String(n).padStart(2, "0");

export function Hero() {
  const text = useText();
  const slides = useList<Slide>("home.hero.slides");
  const stats = useList<{ icon: string; value: string; label: string }>("home.hero.stats");
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const cur = count ? Math.min(i, count - 1) : 0;
  const go = useCallback(
    (n: number) => {
      if (!count) return;
      const next = (n + count) % count;
      if (next === cur) return;
      setPrev(cur);
      setI(next);
    },
    [count, cur],
  );

  useEffect(() => {
    if (paused || userPaused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(cur + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [cur, paused, userPaused, count, go]);

  /* the car drifts a few pixels against the mouse, for depth */
  const onPointerMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--hy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const resetPointer = () => {
    stage.current?.style.setProperty("--hx", "0");
    stage.current?.style.setProperty("--hy", "0");
  };

  const s: Slide | undefined = slides[cur];
  const running = !(paused || userPaused);

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="hero-carousel-label"
      className="hero-studio relative overflow-hidden pt-24 md:pt-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        resetPointer();
      }}
      onPointerMove={onPointerMove}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Field id="hero-carousel-label" className="sr-only" data-preview-field-path="home.hero.carouselLabel" />

      <div className="container-x relative lg:grid lg:min-h-[clamp(34rem,68svh,42rem)] lg:grid-cols-12">
        {/*
         * ── Studio: in the flow on small screens; the right side of the section on lg+ ──
         * No background or stacking context here on purpose: the cars must blend straight into the
         * section's gradient (see .hero-studio in globals.css).
         */}
        <div
          ref={stage}
          className="hero-stage relative aspect-[5/4] sm:aspect-[16/10] lg:absolute lg:top-0 lg:right-[calc((100%-100vw)/2)] lg:bottom-0 lg:left-[calc(41.666%+2rem)] lg:aspect-auto"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1));
            touch.current = null;
          }}
        >
          {/* cars: the group blends into the backdrop, so each photo's white (or black) background vanishes */}
          <div
            data-preview-list-path="home.hero.slides"
            className="hero-cars absolute inset-x-[0%] bottom-[12%] aspect-[2/1] sm:bottom-[14%] lg:right-[-2%] lg:bottom-[8%] lg:left-[-7%]"
          >
            {slides.map((sl, idx) => {
              const state = idx === cur ? "in" : idx === prev ? "out" : "wait";
              return (
                <div
                  key={`${sl.image}-${idx}`}
                  inert={idx !== cur}
                  data-preview-item-path={`home.hero.slides[${idx}]`}
                  data-state={state}
                  className="hero-car absolute inset-0"
                >
                  <span className="hero-shot-light absolute inset-0">
                    <Photo
                      id={sl.image}
                      alt={sl.alt}
                      data-preview-field-path={`home.hero.slides[${idx}].image`}
                      fill
                      priority={idx === 0}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      quality={80}
                      sizes="(min-width:1024px) 55vw, 95vw"
                      className="object-contain"
                    />
                  </span>
                  <span className="hero-shot-dark absolute inset-0">
                    <Photo
                      id={sl.imageDark}
                      alt={sl.altDark}
                      data-preview-field-path={`home.hero.slides[${idx}].imageDark`}
                      fill
                      fetchPriority="low"
                      loading={idx === 0 ? "eager" : "lazy"}
                      quality={80}
                      sizes="(min-width:1024px) 55vw, 95vw"
                      className="object-contain"
                    />
                  </span>
                </div>
              );
            })}
          </div>

          {/* slide controls (sm+): progress, counter, pause, previous / next */}
          <div
            className="absolute right-4 bottom-4 z-10 hidden items-center gap-1 rounded-full bg-white/70 p-1 pl-4 text-night shadow-[0_10px_30px_-18px_rgba(14,17,22,0.45)] ring-1 ring-night/5 backdrop-blur-md sm:flex dark:bg-white/6 dark:text-white dark:shadow-none dark:ring-white/10 md:right-6 md:bottom-6 lg:right-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]"
            data-num
          >
            <span className="text-xs font-semibold" data-preview-static="Slide number, counted automatically">{pad(cur + 1)}</span>
            <div className="mx-2 flex gap-1" role="tablist" aria-labelledby="hero-choose-label">
              <Field id="hero-choose-label" className="sr-only" data-preview-field-path="home.hero.chooseSlideLabel" />
              {slides.map((sl, idx) => (
                <button
                  key={`${sl.image}-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === cur}
                  aria-label={fill(text("home.hero.slideLabel"), { n: idx + 1, title: sl.title })}
                  data-preview-field-path="home.hero.slideLabel"
                  onClick={() => go(idx)}
                  className="relative h-8 w-7 md:w-9"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-night/15 dark:bg-white/15">
                    <span
                      key={`${cur}-${running}`}
                      className={cn(
                        "absolute inset-0 origin-left rounded-full bg-night dark:bg-brand",
                        idx < cur && "scale-x-100",
                        idx > cur && "scale-x-0",
                        idx === cur && (running ? "hero-progress" : "scale-x-100"),
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
            <span className="mr-1 text-xs text-night/45 dark:text-white/45" data-preview-static="Number of slides, counted automatically">
              {pad(count)}
            </span>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? text("home.hero.playLabel") : text("home.hero.pauseLabel")}
              data-preview-field-path="home.hero.pauseLabel"
              className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-night/5 dark:hover:bg-white/10"
            >
              {userPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => go(cur - 1)}
              aria-label={text("home.hero.prevLabel")}
              data-preview-field-path="home.hero.prevLabel"
              className="flex size-9 items-center justify-center rounded-full border border-night/10 transition-colors hover:bg-night hover:text-white dark:border-white/15 dark:hover:border-brand dark:hover:bg-brand"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => go(cur + 1)}
              aria-label={text("home.hero.nextLabel")}
              data-preview-field-path="home.hero.nextLabel"
              className="flex size-9 items-center justify-center rounded-full border border-night/10 transition-colors hover:bg-night hover:text-white dark:border-white/15 dark:hover:border-brand dark:hover:bg-brand"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* phones: dots (the studio is swipeable) */}
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5 sm:hidden" aria-hidden>
            {slides.map((sl, idx) => (
              <span
                key={`${sl.image}-${idx}`}
                className={cn("h-1.5 rounded-full bg-night transition-all duration-500 dark:bg-white", idx === cur ? "w-5 dark:bg-brand" : "w-1.5 opacity-25")}
              />
            ))}
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="relative z-10 flex flex-col pt-9 md:pt-12 lg:col-span-5 lg:justify-center lg:py-12">
          {s && (
            <div key={cur}>
              <p
                data-hero-in
                style={delay(120)}
                className="flex animate-fade-up items-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.2em] text-muted uppercase"
              >
                <span className="text-brand" data-num data-preview-static="Slide number, counted automatically">
                  {pad(cur + 1)}
                </span>
                <span aria-hidden className="text-ink/30">/</span>
                <Field data-preview-field-path={`home.hero.slides[${cur}].eyebrow`} />
              </p>
              <div className="mt-5 overflow-hidden pb-[0.1em]">
                <Field
                  as="h1"
                  data-hero-in
                  style={delay(200)}
                  className="hero-rise font-display text-[2.6rem] leading-[1.03] font-semibold tracking-[-0.03em] text-balance sm:text-[3.25rem] lg:text-[clamp(3rem,4.3vw,4rem)]"
                  data-preview-field-path={`home.hero.slides[${cur}].title`}
                />
              </div>
              <Field
                as="p"
                data-hero-in
                style={delay(320)}
                className="mt-5 max-w-[26rem] animate-fade-up text-[1.02rem] leading-relaxed text-muted"
                data-preview-field-path={`home.hero.slides[${cur}].text`}
              />
            </div>
          )}

          <div data-hero-in style={delay(420)} className="mt-9 flex animate-fade-up flex-col items-center gap-5 lg:flex-row lg:gap-8">
            <Link
              href={text("home.hero.browseHref") || "/cars"}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pr-2 pl-6 text-[0.95rem] font-medium text-on-ink transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(14,17,22,0.55)]"
              data-preview-field-path="home.hero.browseHref"
            >
              <Field data-preview-field-path="home.hero.browseLabel" />
              <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-on-ink/10 dark:bg-brand dark:text-white">
                <ArrowRight className="hero-arrow size-4" />
              </span>
            </Link>
            {s && (
              <Link
                key={cur}
                href={s.linkHref || "/"}
                className="group relative inline-flex items-center gap-2 pb-1.5 text-sm font-medium text-ink lg:pt-1.5"
                data-preview-field-path={`home.hero.slides[${cur}].linkHref`}
              >
                <Field data-preview-field-path={`home.hero.slides[${cur}].linkLabel`} />
                <ArrowRight className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out-soft group-hover:scale-x-100 dark:bg-brand"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Key figures ── */}
      <div className="container-x relative">
        <dl
          data-preview-list-path="home.hero.stats"
          className="mx-auto grid max-w-4xl grid-cols-3 pt-9 pb-12 md:pt-11 md:pb-20"
        >
          {stats.map((st, n) => (
            <div
              key={n}
              data-preview-item-path={`home.hero.stats[${n}]`}
              data-hero-in
              style={delay(560 + n * 90)}
              className="flex animate-fade-up flex-col items-center gap-0.5 border-line px-2 text-center not-first:border-l sm:grid sm:grid-cols-[auto_auto] sm:justify-center sm:gap-x-4 sm:text-left"
            >
              <dt className="contents">
                <span
                  className="mb-2 text-ink sm:row-span-2 sm:mb-0 sm:self-center dark:text-brand"
                  data-preview-field-path={`home.hero.stats[${n}].icon`}
                >
                  <ContentIcon name={st.icon} className="size-6 md:size-7" strokeWidth={1.3} />
                </span>
                <Field
                  className="text-[0.7rem] leading-snug text-muted sm:col-start-2 sm:self-end md:text-xs"
                  data-preview-field-path={`home.hero.stats[${n}].label`}
                />
              </dt>
              <Field
                as="dd"
                className="font-display text-xl font-semibold sm:col-start-2 md:text-[1.7rem] md:leading-tight"
                data-num
                data-preview-field-path={`home.hero.stats[${n}].value`}
              />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
