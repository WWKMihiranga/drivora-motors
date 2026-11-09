"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Gallery({ images, alt, ghost }: { images: string[]; alt: string; ghost: string }) {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const n = images.length;
  const go = (k: number) => setI((k + n) % n);

  // mobile: follow the swipe position
  const onScroll = () => {
    const el = strip.current;
    if (!el) return;
    const k = Math.round(el.scrollLeft / el.clientWidth);
    if (k !== i) setI(k);
  };

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, i]);

  return (
    // Only reserve the 88px thumbnail column when there are thumbnails to show; otherwise a
    // single-photo car would land its main image in that narrow column.
    <div className={cn("grid gap-3", n > 1 && "lg:grid-cols-[88px_1fr]")}>
      {/* vertical thumbnail rail (desktop) */}
      {n > 1 && (
        <div className="order-2 hidden max-h-140 flex-col gap-2 overflow-y-auto lg:order-1 lg:flex">
          {images.map((id, k) => (
            <button
              key={id}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Photo ${k + 1}`}
              aria-current={k === i}
              className={cn(
                "relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl border-2 transition-[border-color,opacity]",
                k === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Photo id={id} alt="" fill crop="4:3" sizes="88px" quality={55} className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative order-1 lg:order-2">
        <span aria-hidden className="ghost-text absolute -top-10 right-0 z-0 hidden text-[8rem] leading-none lg:block">
          {ghost}
        </span>
        {/* desktop: crossfade */}
        <div className="relative z-10 hidden aspect-16/11 overflow-hidden rounded-3xl bg-surface lg:block">
          {images.map((id, k) => (
            <div key={id} className={cn("absolute inset-0 transition-opacity duration-500", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
              <Photo
                id={id}
                alt={`${alt}, photo ${k + 1} of ${n}`}
                fill
                priority={k === 0}
                loading={k === 0 ? "eager" : "lazy"}
                sizes="(min-width:1280px) 760px, 60vw"
                quality={75}
                className="object-cover"
              />
            </div>
          ))}
          <LogoMark className="pointer-events-none absolute right-5 bottom-5 size-9 text-white/70 drop-shadow" />
          {n > 1 && (
            <>
              <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 hover:bg-paper">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 hover:bg-paper">
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          <button type="button" onClick={() => setFull(true)} className="absolute top-4 right-4 flex h-10 items-center gap-2 rounded-full bg-paper/90 px-4 text-sm font-medium hover:bg-paper">
            <Expand className="size-4" /> {i + 1} / {n}
          </button>
        </div>

        {/* mobile / tablet: native swipe with scroll-snap */}
        <div className="relative -mx-6 lg:hidden">
          <div ref={strip} onScroll={onScroll} className="no-scrollbar snap-x-mandatory flex overflow-x-auto">
            {images.map((id, k) => (
              <button
                key={id}
                type="button"
                onClick={() => setFull(true)}
                className="relative aspect-4/3 w-full shrink-0 snap-center bg-surface md:aspect-16/10"
                aria-label={`Open photo ${k + 1} full screen`}
              >
                <Photo id={id} alt={`${alt}, photo ${k + 1} of ${n}`} fill priority={k === 0} sizes="100vw" quality={70} className="object-cover" />
              </button>
            ))}
          </div>
          <span className="pointer-events-none absolute right-8 bottom-3 rounded-full bg-night/70 px-2.5 py-1 text-xs font-medium text-white" data-num>
            {i + 1} / {n}
          </span>
          {n > 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5">
              {images.map((id, k) => (
                <span key={id} className={cn("h-1.5 rounded-full bg-white transition-all", k === i ? "w-5" : "w-1.5 opacity-60")} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* full-screen viewer */}
      {full && (
        <div role="dialog" aria-modal="true" aria-label="Photos" className="fixed inset-0 z-80 flex flex-col bg-night">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm" data-num>
              {i + 1} / {n}
            </span>
            <button type="button" onClick={() => setFull(false)} aria-label="Close" className="flex size-11 items-center justify-center rounded-full bg-white/10">
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex-1">
            <Photo id={images[i]} alt={`${alt}, photo ${i + 1}`} fill sizes="100vw" quality={80} className="object-contain" />
            {n > 1 && (
              <>
                <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className="absolute top-1/2 left-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className="absolute top-1/2 right-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white">
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
