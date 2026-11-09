import { ArrowRight } from "lucide-react";
import { LinkField } from "@/components/ui/LinkField";
import { cn } from "@/lib/cn";

/*
 * Section title block. Pass <Field> elements for eyebrow/title, and for the optional link pass the
 * marker path of its URL (`linkHref`, written literally) plus a <Field> label, so all of it is editable.
 */
export function SectionHeader({
  eyebrow,
  title,
  link,
  dark = false,
  className,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  link?: { "data-preview-field-path": string; label: React.ReactNode };
  dark?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div data-reveal className="max-w-2xl">
        <p className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</p>
        <h2 className={cn("section-title mt-3", dark && "text-white")}>{title}</h2>
        {children}
      </div>
      {link && (
        <LinkField
          {...{ "data-preview-field-path": link["data-preview-field-path"] }}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold",
            dark ? "text-white" : "text-ink",
          )}
        >
          <span className="underline-offset-4 group-hover:underline">{link.label}</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </LinkField>
      )}
    </div>
  );
}
