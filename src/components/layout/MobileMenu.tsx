"use client";

import Link from "next/link";
import { Field, useList, useText } from "@/lib/site-data";
import { useEffect } from "react";
import { ArrowUpRight, Heart, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const text = useText();
  const nav = useList<{ label: string; href: string }>("common.nav");

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

  return (
    <div
      id="mobile-menu"
      inert={!open}
      className={cn(
        "fixed inset-0 z-45 bg-paper transition-[opacity,visibility] duration-300 xl:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="flex h-full flex-col px-6 pt-24 pb-8">
        <nav aria-labelledby="nav-mobile-label">
          <Field id="nav-mobile-label" className="sr-only" data-preview-field-path="common.ui.mobileNavLabel" />
          <ul className="divide-y divide-line border-y border-line" data-preview-list-path="common.nav">
            {nav.map((item, i) => (
              <li
                key={`${item.href}-${i}`}
                data-preview-item-path={`common.nav[${i}]`}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-out-soft",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={item.href || "/"}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 font-display text-[1.6rem] font-semibold"
                  data-preview-field-path={`common.nav[${i}].href`}
                >
                  <span className="flex items-center gap-3">
                    <Field data-preview-field-path={`common.nav[${i}].label`} />
                  </span>
                  <ArrowUpRight className="size-5 text-muted" strokeWidth={1.5} />
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "border-b border-line transition-[opacity,transform] duration-500 ease-out-soft",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
            style={{ transitionDelay: open ? `${80 + nav.length * 45}ms` : "0ms" }}
          >
            <Link
              href={text("common.links.saved") || "/saved"}
              onClick={onClose}
              className="flex items-center justify-between py-4 font-display text-[1.6rem] font-semibold"
              data-preview-field-path="common.links.saved"
            >
              <span className="flex items-center gap-3">
                <Heart className="size-5" strokeWidth={1.75} />
                <Field data-preview-field-path="common.ui.saved" />
              </span>
              <ArrowUpRight className="size-5 text-muted" strokeWidth={1.5} />
            </Link>
          </div>
        </nav>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="flex" />
            <ThemeToggle className="bg-surface" />
          </div>
          <Field className="text-xs text-muted" data-preview-field-path="common.ui.demoNote" />
        </div>

        <div className="mt-auto space-y-3">
          <Link
            href={text("common.links.book") || "/book"}
            onClick={onClose}
            className="btn-ink w-full"
            data-preview-field-path="common.links.book"
          >
            <Field data-preview-field-path="common.ui.book" />
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href={site.phoneHref} className="btn-line" data-preview-field-path="common.business.phone">
              <Phone className="size-4" strokeWidth={1.75} /> <Field data-preview-field-path="common.ui.call" />
            </a>
            <a
              href={whatsappLink(text("common.messages.whatsappGeneral"))}
              target="_blank"
              rel="noopener"
              className="btn-line"
              data-preview-field-path="common.business.whatsapp"
            >
              <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="common.ui.whatsapp" />
            </a>
          </div>
          <p className="flex items-start gap-2 pt-2 text-sm text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              <Field data-preview-field-path="common.business.addressLine1" />, <Field data-preview-field-path="common.business.city" /> ·{" "}
              <Field data-preview-field-path="common.business.hours" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
