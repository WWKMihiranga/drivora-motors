"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Hand, Loader2, RotateCcw } from "lucide-react";
import { isLowPowerDevice, useMounted } from "@/lib/device";
import type { ViewerApi } from "@/components/three/viewer";
import { cn } from "@/lib/cn";
import { Field, fill, useList } from "@/lib/site-data";

type Paint = { name: string; hex: string };
const FALLBACK_PAINT: Paint = { name: "", hex: "#c2410c" };

type State = "idle" | "loading" | "ready" | "error";

export function Studio3D() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ViewerApi | null>(null);
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  const paints = useList<Paint>("home.studio.paints");
  const [paintIndex, setPaintIndex] = useState(0);
  const paint = paints[paintIndex] ?? paints[0] ?? FALLBACK_PAINT;
  const mounted = useMounted();
  const lowPower = mounted && isLowPowerDevice();

  const load = async () => {
    if (!host.current || state === "loading" || state === "ready") return;
    setState("loading");
    try {
      const { mountViewer } = await import("@/components/three/viewer");
      api.current = await mountViewer(host.current, {
        color: paint.hex,
        lite: isLowPowerDevice() || window.innerWidth < 640,
        onProgress: setProgress,
      });
      setState("ready");
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  // Auto-load on capable devices once the section is mostly on screen.
  useEffect(() => {
    if (isLowPowerDevice() || !host.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(host.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => api.current?.dispose(), []);
  useEffect(() => api.current?.setColor(paint.hex), [paint]);

  return (
    <section className="px-3 md:px-5" aria-labelledby="studio-title">
      <div className="relative overflow-hidden rounded-4xl bg-[radial-gradient(120%_90%_at_50%_10%,#252b35_0%,#0e1116_62%)] text-white">
        <div className="container-x grid gap-8 py-14 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div data-reveal>
            <Field as="p" className="eyebrow-dark" data-preview-field-path="home.studio.eyebrow" />
            <Field
              as="h2"
              id="studio-title"
              className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-[2.6rem]"
              data-preview-field-path="home.studio.title"
            />
            <Field as="p" className="mt-4 max-w-md leading-relaxed text-white/65" data-preview-field-path="home.studio.text" />

            <fieldset className="mt-8">
              <Field
                as="legend"
                className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase"
                data-preview-field-path="home.studio.paintLabel"
              />
              <div className="mt-3 flex flex-wrap gap-2.5" data-preview-list-path="home.studio.paints">
                {paints.map((p, n) => (
                  <button
                    key={`${p.hex}-${n}`}
                    type="button"
                    onClick={() => setPaintIndex(n)}
                    aria-pressed={paint.hex === p.hex}
                    aria-label={p.name}
                    title={p.name}
                    data-preview-item-path={`home.studio.paints[${n}]`}
                    data-preview-field-path={`home.studio.paints[${n}].hex`}
                    className={cn(
                      "size-10 rounded-full border-2 transition-transform hover:scale-110",
                      paint.hex === p.hex ? "border-white" : "border-white/15",
                    )}
                    style={{ background: `radial-gradient(circle at 35% 30%, #ffffff55, ${p.hex} 55%)` }}
                  />
                ))}
              </div>
              {paints[paintIndex] && (
                <Field as="p" className="mt-3 text-sm text-white/70" data-preview-field-path={`home.studio.paints[${paintIndex}].name`} />
              )}
            </fieldset>
          </div>

          <div className="relative">
            <Field id="studio-model-label" className="sr-only" data-preview-field-path="home.studio.modelLabel" />
            <div
              ref={host}
              className="relative aspect-4/3 w-full overflow-hidden rounded-3xl md:aspect-16/10"
              aria-labelledby="studio-model-label"
              role="img"
            >
              {/* soft floor shadow, sits behind the transparent WebGL canvas */}
              <div aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[20%] h-12 rounded-[50%] bg-black/60 blur-2xl" />
              {state !== "ready" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  {state === "loading" ? (
                    <>
                      <Loader2 className="size-7 animate-spin text-white/70" />
                      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-brand-bright transition-[width] duration-200" style={{ width: `${Math.round(progress * 100)}%` }} />
                      </div>
                      <Field
                        as="p"
                        className="text-sm text-white/60"
                        data-preview-field-path="home.studio.loading"
                        format={(t) => fill(t, { percent: Math.round(progress * 100) })}
                      />
                    </>
                  ) : state === "error" ? (
                    <Field as="p" className="text-sm text-white/70" data-preview-field-path="home.studio.error" />
                  ) : (
                    <>
                      <Box className="size-10 text-white/60" strokeWidth={1.2} />
                      <Field as="button" type="button" onClick={load} className="btn-light h-11" data-preview-field-path="home.studio.loadButton" />
                      {lowPower && <Field as="p" className="text-xs text-white/50" data-preview-field-path="home.studio.lowPowerNote" />}
                    </>
                  )}
                </div>
              )}
            </div>
            {state === "ready" && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/40 px-4 py-2 text-xs text-white/75 backdrop-blur">
                <span className="flex items-center gap-1.5">
                  <Hand className="size-3.5" /> <Field data-preview-field-path="home.studio.dragHint" />
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="size-3.5" /> <Field data-preview-field-path="home.studio.zoomHint" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
