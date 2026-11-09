"use client";

import { usePathname } from "next/navigation";
import { Field } from "@/lib/site-data";

/*
 * Fivora needs a page-key marker (the page id) on each page's <main> so the editor knows which
 * page is open. Ids must match `pages[].id` in fivora-template.json. Routes that are not listed there
 * (car detail pages, blog posts, the demo dealer view, credits) get no key.
 */
const PAGE_KEYS: Record<string, string> = {
  "/": "home",
  "/cars": "cars",
  "/finance": "finance",
  "/sell": "sell",
  "/book": "book",
  "/about": "about",
  "/contact": "contact",
  "/faq": "faq",
  "/blog": "blog",
  "/compare": "compare",
  "/saved": "saved",
};

export function PageMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const route = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const pageKey = PAGE_KEYS[route];
  // Spread so the attribute is omitted entirely on routes that are not Fivora pages.
  const marker = pageKey ? { "data-preview-page-key": pageKey } : {};
  return (
    <main id="main" tabIndex={-1} className="outline-none" {...marker}>
      {children}
    </main>
  );
}

/* "Skip to content" for keyboard users: moves focus to <main>. The label is editable in Fivora. */
export function SkipLink() {
  return (
    <Field
      as="button"
      type="button"
      onClick={() => {
        const main = document.getElementById("main");
        main?.focus();
        main?.scrollIntoView();
      }}
      className="sr-only z-70 rounded-full bg-ink px-4 py-2 text-on-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      data-preview-field-path="common.ui.skipToContent"
    />
  );
}
