"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { Field, useText } from "@/lib/site-data";
import { WhatsAppIcon } from "@/components/ui/icons";
import { openChat } from "@/components/chat/chat-bus";
import { cn } from "@/lib/cn";

/** Sticky bottom actions on phones and tablets. Hides while scrolling down. */
export function ActionBar() {
  const text = useText();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  // Car detail pages have their own sticky price bar.
  const isDetail = /^\/cars\/[^/]+$/.test(pathname);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) > 8) {
        setHidden(delta > 0 && y > 240);
        last.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDetail) return null;

  return (
    <div
      className={cn(
        "safe-bottom fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-transform duration-300 ease-out-soft lg:hidden",
        hidden ? "translate-y-[120%]" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-1 rounded-full border border-line bg-paper/95 p-1.5 shadow-[0_10px_30px_-12px_rgba(14,17,22,0.35)] backdrop-blur">
        <a
          href={site.phoneHref}
          className="flex h-12 flex-1 flex-col items-center justify-center rounded-full text-[0.68rem] font-medium text-ink active:bg-surface"
          data-preview-field-path="common.business.phone"
        >
          <Phone className="size-[1.1rem]" strokeWidth={1.75} />
          <Field data-preview-field-path="common.ui.call" />
        </a>
        <button
          type="button"
          onClick={() => openChat()}
          className="flex h-12 flex-1 flex-col items-center justify-center rounded-full text-[0.68rem] font-medium text-ink active:bg-surface"
        >
          <MessageCircle className="size-[1.1rem]" strokeWidth={1.75} />
          <Field data-preview-field-path="common.ui.ask" />
        </button>
        <a
          href={whatsappLink(text("common.messages.whatsappGeneral"))}
          target="_blank"
          rel="noopener"
          className="flex h-12 flex-1 flex-col items-center justify-center rounded-full text-[0.68rem] font-medium text-ink active:bg-surface"
          data-preview-field-path="common.business.whatsapp"
        >
          <WhatsAppIcon className="size-[1.1rem]" />
          <Field data-preview-field-path="common.ui.whatsapp" />
        </a>
        <Link
          href={text("common.links.book") || "/book"}
          className="flex h-12 flex-[1.4] items-center justify-center rounded-full bg-ink px-4 text-sm font-medium text-on-ink"
          data-preview-field-path="common.links.book"
        >
          <Field data-preview-field-path="common.ui.bookShort" />
        </Link>
      </div>
    </div>
  );
}
