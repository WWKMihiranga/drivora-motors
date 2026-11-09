"use client";

import { Logo } from "./Logo";
import { Field, useContentValue, withBasePath } from "@/lib/site-data";
import { cn } from "@/lib/cn";

/*
 * The dealer's logo. Fivora's `common.logoUrl` field lets a dealer upload their own; until they do,
 * the Drivora wordmark renders exactly as before. Either way the element carries the logo marker so
 * the Fivora editor can open the logo picker from it.
 */
export function BrandLogo({ dark = false, className }: { dark?: boolean; className?: string }) {
  const logoUrl = useContentValue("common.logoUrl");
  const name = useContentValue("common.business.name");
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- dealer upload of unknown size/host
      <img
        data-preview-field-path="common.logoUrl"
        src={withBasePath(logoUrl)}
        alt={name}
        className={cn("h-9 w-auto max-w-40 object-contain", dark && "brightness-0 invert", className)}
      />
    );
  }
  return (
    <Logo
      dark={dark}
      className={className}
      data-preview-field-path="common.logoUrl"
      word={<Field data-preview-field-path="common.ui.logoWord" />}
      sub={<Field data-preview-field-path="common.ui.logoSub" />}
    />
  );
}
