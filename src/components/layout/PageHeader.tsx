"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Field, useContentValue } from "@/lib/site-data";
import { LinkField } from "@/components/ui/LinkField";

/**
 * A breadcrumb link whose target and label are both editable. Write the paths literally at the call
 * site: <Crumb data-preview-field-path="about.header.crumbHref" label={<Field data-preview-field-path="about.header.crumbLabel" />} />
 */
export function Crumb({ label, ...rest }: { label: React.ReactNode; "data-preview-field-path": string }) {
  return (
    <LinkField className="hover:text-ink" {...rest}>
      {label}
    </LinkField>
  );
}

/* Page title band. Pass <Field> elements so every word stays editable in Fivora. */
export function PageHeader({
  eyebrow,
  title,
  text,
  crumbs = [],
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  text?: React.ReactNode;
  crumbs?: React.ReactNode[];
  children?: React.ReactNode;
}) {
  const home = useContentValue("common.links.home") || "/";
  return (
    <div className="hero-gradient relative overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14">
      <div className="container-x relative">
        {crumbs.length > 0 && (
          <nav aria-labelledby="breadcrumb-label" className="mb-5">
            <Field id="breadcrumb-label" className="sr-only" data-preview-field-path="common.ui.breadcrumbLabel" />
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <li>
                <Link href={home} className="hover:text-ink" data-preview-field-path="common.links.home">
                  <Field data-preview-field-path="common.ui.breadcrumbHome" />
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" />
                  {c}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow animate-fade-up">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl animate-fade-up font-display text-[2.1rem] leading-[1.08] font-semibold [animation-delay:60ms] md:text-5xl">
          {title}
        </h1>
        {text && (
          <p className="mt-4 max-w-2xl animate-fade-up text-[1.02rem] leading-relaxed text-muted-strong [animation-delay:120ms]">
            {text}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
