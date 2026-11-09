"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Hand, Loader2, RotateCcw } from "lucide-react";
import { isLowPowerDevice, useMounted } from "@/lib/device";
import type { ViewerApi } from "@/components/three/viewer";
import { cn } from "@/lib/cn";

const paints = [
  { name: "Signal orange", hex: "#c2410c" },
  { name: "Ink black", hex: "#14171c" },
  { name: "Pearl white", hex: "#e8e8e4" },
  { name: "Graphite", hex: "#555b66" },
  { name: "Lagoon blue", hex: "#1f4f7a" },
];

type State = "idle" | "loading" | "ready" | "error";

export function Studio3D() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ViewerApi | null>(null);
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  const [paint, setPaint] = useState(paints[0]);
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
            <p className="eyebrow-dark">3D studio · preview</p>
            <h2 id="studio-title" className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-[2.6rem]">
              Walk around a car before you visit.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">
              Drag to turn it, pinch or scroll to zoom, and try a colour. We can add 3D scans of selected stock for
              your showroom. This model is a demonstration.
            </p>

            <fieldset className="mt-8">
              <legend className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Paint</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {paints.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => setPaint(p)}
                    aria-pressed={paint.hex === p.hex}
                    aria-label={p.name}
                    title={p.name}
                    className={cn(
                      "size-10 rounded-full border-2 transition-transform hover:scale-110",
                      paint.hex === p.hex ? "border-white" : "border-white/15",
                    )}
                    style={{ background: `radial-gradient(circle at 35% 30%, #ffffff55, ${p.hex} 55%)` }}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-white/70">{paint.name}</p>
            </fieldset>
          </div>

          <div className="relative">
            <div
              ref={host}
              className="relative aspect-4/3 w-full overflow-hidden rounded-3xl md:aspect-16/10"
              aria-label="Interactive 3D car model"
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
                      <p className="text-sm text-white/60">Loading model… {Math.round(progress * 100)}%</p>
                    </>
                  ) : state === "error" ? (
                    <p className="text-sm text-white/70">3D isn&apos;t available on this device. Photos are on every car page.</p>
                  ) : (
                    <>
                      <Box className="size-10 text-white/60" strokeWidth={1.2} />
                      <button type="button" onClick={load} className="btn-light h-11">
                        Load 3D model · 1.7 MB
                      </button>
                      {lowPower && <p className="text-xs text-white/50">Data saver is on, so we waited for your tap.</p>}
                    </>
                  )}
                </div>
              )}
            </div>
            {state === "ready" && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/40 px-4 py-2 text-xs text-white/75 backdrop-blur">
                <span className="flex items-center gap-1.5">
                  <Hand className="size-3.5" /> Drag to rotate
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="size-3.5" /> Pinch to zoom
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
