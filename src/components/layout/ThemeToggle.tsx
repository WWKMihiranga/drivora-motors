"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { useText } from "@/lib/site-data";

/*
 * Theme = data-theme on <html> ("drivora" | "drivora-dark"), which FlyonUI and our colour
 * tokens in globals.css both key off. ThemeScript sets it before first paint (no flash);
 * with no saved choice it follows the OS setting, live. A click saves an explicit choice.
 */
const KEY = "drv-theme";
const DARK = "drivora-dark";
const LIGHT = "drivora";

export function ThemeScript() {
  const code = `(function(){try{var d=document.documentElement,k='${KEY}',m=matchMedia('(prefers-color-scheme: dark)'),s=function(x){d.dataset.theme=x?'${DARK}':'${LIGHT}'};var v=localStorage.getItem(k);s(v?v==='dark':m.matches);m.addEventListener('change',function(e){if(!localStorage.getItem(k))s(e.matches)})}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.dataset.theme === DARK;

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const text = useText();

  const toggle = () => {
    const html = document.documentElement;
    const next = !isDark();
    html.classList.add("theme-switching");
    html.dataset.theme = next ? DARK : LIGHT;
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {}
    // re-enable transitions after the new colours have painted
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("theme-switching")));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={text("common.ui.darkMode")}
      aria-pressed={dark}
      title={dark ? text("common.ui.switchToLight") : text("common.ui.switchToDark")}
      data-preview-field-path="common.ui.darkMode"
      className={cn(
        "flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface",
        className,
      )}
    >
      {/* both icons render on the server; CSS picks one, so there is no hydration flicker */}
      <Moon className="size-[1.1rem] dark:hidden" strokeWidth={1.75} />
      <Sun className="hidden size-[1.15rem] dark:block" strokeWidth={1.75} />
    </button>
  );
}
