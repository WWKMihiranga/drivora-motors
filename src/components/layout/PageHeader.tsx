import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  text,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="hero-gradient relative overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14">
      <div className="container-x relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" />
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
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
