import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { getPost, getPosts } from "@/lib/api";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  return p ? { title: p.title, description: p.excerpt } : { title: "Article not found" };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();
  const date = new Date(`${p.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <article>
      <header className="hero-gradient pt-28 pb-10 md:pt-36">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> All guides
          </Link>
          <p className="eyebrow mt-6">{p.category}</p>
          <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold md:text-5xl">{p.title}</h1>
          <p className="mt-4 text-sm text-muted">
            {date} · {p.readMins} min read
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative aspect-video overflow-hidden rounded-3xl">
          <Photo id={p.image} alt="" fill priority sizes="(min-width:1024px) 900px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <p className="text-lg leading-relaxed text-muted-strong">{p.excerpt}</p>
        {p.body.map((b, i) => (
          <section key={i} className="mt-8">
            {b.heading && <h2 className="font-display text-xl font-semibold md:text-2xl">{b.heading}</h2>}
            <p className="mt-3 leading-[1.75] text-ink/85">{b.text}</p>
          </section>
        ))}
        <div className="mt-12 rounded-[1.25rem] bg-surface p-6">
          <p className="font-semibold">Want to see what this looks like on a real car?</p>
          <p className="mt-1 text-sm text-muted">Every listing shows its documents and a leasing estimate.</p>
          <Link href="/cars" className="btn-ink mt-4">
            Browse cars
          </Link>
        </div>
      </div>
    </article>
  );
}
