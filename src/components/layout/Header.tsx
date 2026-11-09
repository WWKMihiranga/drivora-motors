"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Phone } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/config/site";
import { Field, useList, useText } from "@/lib/site-data";
import { useT } from "@/lib/i18n";
import { useApp } from "@/store";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const t = useT();
  const text = useText();
  const nav = useList<{ label: string; href: string }>("common.nav");
  const savedCount = useApp((s) => s.saved.length);
  // Sinhala and Tamil labels run much wider than English, so those languages get the short CTA
  // and the menu button until xl, or the header row overflows. The phone is a call icon in every
  // language: the full number + hours block doesn't fit in Tamil even at max width, so it was
  // dropped everywhere for consistency (the number is in the footer, menu and contact page).
  const latin = useApp((s) => s.lang) === "en";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/";
  const solid = scrolled || !overHero || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation (render-time state adjustment, no effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <div
          className={cn(
            "mx-auto flex h-14 max-w-330 items-center gap-3 rounded-full pr-2 pl-4 transition-[background-color,box-shadow,border-color] duration-300 md:h-16 md:pl-6",
            solid
              ? "border border-line/80 bg-paper/90 shadow-[0_8px_30px_-18px_rgba(14,17,22,0.35)] backdrop-blur-md"
              : "border border-transparent bg-white/0",
          )}
        >
          <Link
            href={text("common.links.home") || "/"}
            aria-label={text("common.ui.homeLinkLabel")}
            className="shrink-0"
            data-preview-field-path="common.ui.homeLinkLabel"
          >
            <BrandLogo />
          </Link>

          <nav
            aria-labelledby="nav-main-label"
            className={cn("ml-3 hidden shrink-0 items-center xl:ml-6 xl:flex xl:gap-1", latin && "lg:flex")}
            data-preview-list-path="common.nav"
          >
            <Field id="nav-main-label" className="sr-only" data-preview-field-path="common.ui.mainNavLabel" />
            {nav.map((item, i) => {
              const active = !!item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href || "/"}
                  data-preview-item-path={`common.nav[${i}]`}
                  data-preview-field-path={`common.nav[${i}].href`}
                  className={cn(
                    "group relative rounded-full px-3 py-2 text-[0.92rem] font-medium whitespace-nowrap transition-colors xl:px-3.5",
                    active ? "text-ink" : "text-muted-strong hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Field data-preview-field-path={`common.nav[${i}].label`} />
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ease-out-soft",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-1.5 xl:gap-2">
            <LanguageSwitcher className="hidden md:flex" />
            <ThemeToggle className="hidden sm:flex" />
            <Link
              href={text("common.links.saved") || "/saved"}
              aria-label={`${text("common.ui.savedLinkLabel")} (${savedCount})`}
              data-preview-field-path="common.ui.savedLinkLabel"
              className="relative hidden size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface sm:flex"
            >
              <Heart className="size-[1.15rem]" strokeWidth={1.75} />
              {savedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-brand text-[0.6rem] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </Link>
            <a
              href={site.phoneHref}
              aria-label={`${t("call")} ${text("common.business.phone")}`}
              title={text("common.business.phone")}
              data-preview-field-path="common.business.phone"
              className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
            >
              <Phone className="size-[1.1rem]" strokeWidth={1.75} />
            </a>
            <Link
              href={text("common.links.book") || "/book"}
              className="btn-ink hidden h-11 px-5 text-[0.9rem] whitespace-nowrap md:inline-flex"
              data-preview-field-path="common.links.book"
            >
              {latin ? (
                <>
                  <Field className="xl:hidden" data-preview-field-path="common.ui.bookShort" />
                  <Field className="hidden xl:inline" data-preview-field-path="common.ui.book" />
                </>
              ) : (
                <Field data-preview-field-path="common.ui.bookShort" />
              )}
            </Link>
            <button
              type="button"
              aria-label={open ? text("common.ui.closeMenu") : t("menu")}
              data-preview-field-path="common.ui.menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className={cn("group relative flex size-11 items-center justify-center rounded-full bg-ink text-on-ink", latin ? "lg:hidden" : "xl:hidden")}
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-4.5 rounded-full bg-current transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] rounded-full bg-current transition-all duration-300",
                  open ? "w-4.5 -rotate-45" : "w-3 translate-x-0.75 translate-y-1",
                )}
              />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
