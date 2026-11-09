"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/store";

/**
 * - Rehydrates the persisted store after mount (no hydration mismatch).
 * - Runs ONE IntersectionObserver for every [data-reveal] element on the page,
 *   instead of an observer or animation library per component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = useApp((s) => s.lang);

  useEffect(() => {
    useApp.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en-LK" : lang === "si" ? "si-LK" : "ta-LK";
  }, [lang]);

  useEffect(() => {
    // Reveal with the Web Animations API instead of flipping an attribute: React owns every
    // attribute on these elements, and touching one before a streamed subtree hydrates is a
    // hydration mismatch. Animations leave the DOM untouched.
    const seen = new WeakSet<Element>();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = (el: HTMLElement) => {
      if (reduce) return; // CSS already shows [data-reveal] for reduced motion
      const i = Number(getComputedStyle(el).getPropertyValue("--reveal-i")) || 0;
      el.animate(
        [
          { opacity: 0, transform: "translate3d(0, 18px, 0)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 700, delay: i * 70, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.isIntersecting) {
                  reveal(e.target as HTMLElement);
                  io?.unobserve(e.target);
                }
              }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
          )
        : null;
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (io) io.observe(el);
        else reveal(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
