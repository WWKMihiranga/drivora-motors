"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight, Heart, MapPin, Phone } from "lucide-react";
import { nav, site, whatsappLink } from "@/config/site";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const links = [...nav, { href: "/saved", key: "saved" as const }];

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-45 bg-paper transition-[opacity,visibility] duration-300 xl:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="flex h-full flex-col px-6 pt-24 pb-8">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-line border-y border-line">
            {links.map((item, i) => (
              <li
                key={item.href}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-out-soft",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 font-display text-[1.6rem] font-semibold"
                >
                  <span className="flex items-center gap-3">
                    {item.key === "saved" && <Heart className="size-5" strokeWidth={1.75} />}
                    {t(item.key)}
                  </span>
                  <ArrowUpRight className="size-5 text-muted" strokeWidth={1.5} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="flex" />
            <ThemeToggle className="bg-surface" />
          </div>
          <span className="text-xs text-muted">Demo site · sample data</span>
        </div>

        <div className="mt-auto space-y-3">
          <Link href="/book" onClick={onClose} className="btn-ink w-full">
            {t("book")}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href={site.phoneHref} className="btn-line">
              <Phone className="size-4" strokeWidth={1.75} /> {t("call")}
            </a>
            <a
              href={whatsappLink("Hi Drivora, I'd like to ask about a car.")}
              target="_blank"
              rel="noopener"
              className="btn-line"
            >
              <WhatsAppIcon className="size-4" /> {t("whatsapp")}
            </a>
          </div>
          <p className="flex items-start gap-2 pt-2 text-sm text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            {site.address.line1}, {site.address.city} · {site.hours}
          </p>
        </div>
      </div>
    </div>
  );
}
