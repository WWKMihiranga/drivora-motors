"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { useContentValue } from "@/lib/site-data";

/**
 * A link whose target is an editable Fivora field. Write the path literally at the call site, e.g.
 * <LinkField data-preview-field-path="home.stock.linkHref" className="..."><Field ... /></LinkField>.
 * Put the label in a nested <Field> so the editor can change the text and the URL separately.
 */
export function LinkField({
  fallback = "/",
  ...rest
}: { "data-preview-field-path": string; fallback?: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">) {
  const href = useContentValue(rest["data-preview-field-path"]) || fallback;
  return <Link href={href} {...rest} />;
}
