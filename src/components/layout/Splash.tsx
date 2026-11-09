"use client";

import { useEffect } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Field, useText } from "@/lib/site-data";

/**
 * "Headlights on" intro. The markup is server-rendered and hidden by default;
 * an inline script in <head> (see layout.tsx) adds `splash-on` to <html> before
 * first paint on the first visit of a session, so there is never a flash.
 * Everything below is CSS animation; this component only handles skip + cleanup.
 */
export const SPLASH_MS = 2400;

export function SplashScript() {
  const code = `(function(){try{var d=document.documentElement,f=location.search.indexOf('splash=1')>-1,s=sessionStorage.getItem('drv-splash');if(s&&!f){d.classList.add('splash-off');return}sessionStorage.setItem('drv-splash','1');d.classList.add('splash-on');if(matchMedia('(prefers-reduced-motion: reduce)').matches||(navigator.connection&&navigator.connection.saveData))d.classList.add('splash-lite')}catch(e){document.documentElement.classList.add('splash-off')}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function Splash() {
  const text = useText();
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash-on")) return;
    const lite = html.classList.contains("splash-lite");
    html.style.overflow = "hidden";

    const finish = () => {
      if (html.classList.contains("splash-done")) return;
      html.classList.add("splash-done");
      html.style.overflow = "";
      window.setTimeout(() => {
        html.classList.remove("splash-on");
        html.classList.add("splash-off");
        document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      }, 650);
    };
    const t = window.setTimeout(finish, lite ? 900 : SPLASH_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    const el = document.getElementById("splash");
    el?.addEventListener("click", finish);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      el?.removeEventListener("click", finish);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
    };
  }, []);

  const word = text("common.ui.splashWord").split("");

  return (
    <div id="splash" role="status" aria-labelledby="splash-label" className="splash">
      <Field id="splash-label" className="sr-only" data-preview-field-path="common.ui.splashLoading" />
      <div className="splash-door splash-door-top" />
      <div className="splash-door splash-door-bottom" />
      <div className="splash-beam splash-beam-a" />
      <div className="splash-beam splash-beam-b" />

      <div className="splash-content">
        <LogoMark draw className="splash-mark size-14 text-white" />
        <div className="mt-6 flex overflow-hidden font-display text-4xl font-bold tracking-[0.22em] text-white sm:text-5xl">
          {/* display:contents keeps the letters as flex items; the span only carries the editable marker */}
          <span className="contents" data-preview-field-path="common.ui.splashWord">
            {word.map((ch, i) => (
              <span key={i} className="splash-letter" style={{ ["--i" as string]: i }}>
                {ch}
              </span>
            ))}
          </span>
        </div>
        <Field as="p" className="splash-sub mt-2 text-[0.7rem] font-medium tracking-[0.6em] text-white/55" data-preview-field-path="common.ui.splashSub" />
        <div className="mt-8 flex w-56 items-center gap-3">
          <div className="relative h-px flex-1 overflow-hidden bg-white/15">
            <div className="splash-road absolute inset-0 origin-left bg-brand-bright" />
          </div>
          <span className="splash-counter w-8 text-right font-display text-xs font-light text-white/70" data-num />
        </div>
        <Field as="p" data-preview-field-path="common.business.tagline" className="splash-tagline mt-5 text-sm text-white/60" />
      </div>

      <button type="button" className="splash-skip" aria-label={text("common.ui.splashSkipLabel")} data-preview-field-path="common.ui.splashSkip">
        <Field data-preview-field-path="common.ui.splashSkip" />
      </button>
    </div>
  );
}
