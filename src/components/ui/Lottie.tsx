"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/base-path";

type Props = {
  src: "/lottie/success.json" | "/lottie/searching.json";
  loop?: boolean;
  className?: string;
  /** An sr-only <Field id={labelId} ...> naming the animation for screen readers. */
  label: React.ReactNode;
  labelId: string;
};

const cache = new Map<string, Promise<unknown>>();
function loadJson(src: string) {
  if (!cache.has(src)) cache.set(src, fetch(withBasePath(src)).then((r) => r.json()));
  return cache.get(src)!;
}

/**
 * Lottie player loaded on demand (lottie-web "light" SVG build, ~60 KB gzip),
 * so pages that never show an animation never download it.
 */
export function Lottie({ src, loop = false, className, label, labelId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let anim: { destroy: () => void; goToAndStop: (f: number, isFrame: boolean) => void; totalFrames: number } | null =
      null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Promise.all([import("lottie-web/build/player/lottie_light"), loadJson(src)]).then(([mod, data]) => {
      if (destroyed || !ref.current) return;
      const lottie = mod.default;
      anim = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: reduced ? false : loop,
        autoplay: !reduced,
        animationData: data,
        rendererSettings: { progressiveLoad: true },
      });
      if (reduced) anim.goToAndStop(anim.totalFrames - 1, true);
    });
    return () => {
      destroyed = true;
      anim?.destroy();
    };
  }, [src, loop]);

  // The label is a node (an sr-only <Field> with id={labelId}) so its text stays editable in Fivora.
  return (
    <>
      <div ref={ref} role="img" aria-labelledby={labelId} className={className} />
      {label}
    </>
  );
}
