import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { getPosts } from "@/lib/api";

export const metadata: Metadata = { title: "Guides & news", description: "Buying guides, leasing rules and EV advice for Sri Lankan car buyers." };

const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHeader eyebrow="Guides & news" title="Read before you buy" crumbs={[{ href: "/blog", label: "Guides" }]} />
      <section className="container-x py-12 md:py-16">
        <Link href={`/blog/${lead.slug}`} className="group grid overflow-hidden rounded-[1.75rem] bg-surface md:grid-cols-2">
          <div className="relative aspect-16/10 md:aspect-auto">
            <Photo id={lead.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="p-6 md:p-10">
            <p className="eyebrow">{lead.category}</p>
            <h2 className="mt-3 font-display text-2xl leading-snug font-semibold md:text-3xl">{lead.title}</h2>
            <p className="mt-3 text-muted-strong">{lead.excerpt}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4" /> {lead.readMins} min · {fmtDate(lead.date)}
            </p>
          </div>
        </Link>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {rest.map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} data-reveal style={{ ["--reveal-i" as string]: i }} className="group rounded-[1.25rem] border border-line p-2.5">
              <div className="relative aspect-16/10 overflow-hidden rounded-[0.9rem] bg-surface">
                <Photo id={p.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-brand">{p.category}</p>
                <h3 className="mt-2 font-display text-lg leading-snug font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.readMins} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
