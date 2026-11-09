"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Post } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { Field, fill, useList, useText } from "@/lib/site-data";

export const fmtDate = (d: string) =>
  d ? new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

/* Articles live in site-data.json `posts` and are editable in Fivora. */
export function BlogList() {
  const text = useText();
  const posts = useList<Post>("posts");
  const [lead, ...rest] = posts;
  if (!lead) return null;
  return (
    <div data-preview-list-path="posts">
      <Link
        href={`/blog/${lead.slug}`}
        className="group grid overflow-hidden rounded-[1.75rem] bg-surface md:grid-cols-2"
        data-preview-item-path="posts[0]"
        data-preview-field-path="posts[0].slug"
      >
        <div className="relative aspect-16/10 md:aspect-auto">
          <Photo
            id={lead.image}
            alt=""
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            data-preview-field-path="posts[0].image"
          />
        </div>
        <div className="p-6 md:p-10">
          <Field as="p" className="eyebrow" data-preview-field-path="posts[0].category" />
          <Field as="h2" className="mt-3 font-display text-2xl leading-snug font-semibold md:text-3xl" data-preview-field-path="posts[0].title" />
          <Field as="p" className="mt-3 text-muted-strong" data-preview-field-path="posts[0].excerpt" />
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" />{" "}
            <span>
              <Field data-preview-field-path="posts[0].readMins" format={(n) => fill(text("blog.readShort"), { n })} /> ·{" "}
              <Field data-preview-field-path="posts[0].date" format={fmtDate} />
            </span>
          </p>
        </div>
      </Link>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rest.map((p, n) => {
          const i = n + 1;
          return (
            <Link
              key={`${p.slug}-${i}`}
              href={`/blog/${p.slug}`}
              data-reveal
              data-preview-item-path={`posts[${i}]`}
              data-preview-field-path={`posts[${i}].slug`}
              style={{ ["--reveal-i" as string]: n }}
              className="group rounded-[1.25rem] border border-line p-2.5"
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-[0.9rem] bg-surface">
                <Photo
                  id={p.image}
                  alt=""
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  data-preview-field-path={`posts[${i}].image`}
                />
              </div>
              <div className="p-3">
                <Field as="p" className="text-xs font-semibold text-brand" data-preview-field-path={`posts[${i}].category`} />
                <Field as="h3" className="mt-2 font-display text-lg leading-snug font-semibold" data-preview-field-path={`posts[${i}].title`} />
                <Field
                  as="p"
                  className="mt-2 text-sm text-muted"
                  data-preview-field-path={`posts[${i}].readMins`}
                  format={(m) => fill(text("blog.readLong"), { n: m })}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* One article. `i` is the post's position in `posts`, so every part of it is editable in place. */
export function PostBody({ i }: { i: number }) {
  const text = useText();
  const p = useList<Post>("posts")[i];
  if (!p) return null;
  return (
    <article>
      <header className="hero-gradient pt-28 pb-10 md:pt-36">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href={text("blog.post.backHref") || "/blog"}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
            data-preview-field-path="blog.post.backHref"
          >
            <ArrowLeft className="size-4" /> <Field data-preview-field-path="blog.post.backLabel" />
          </Link>
          <Field as="p" className="eyebrow mt-6" data-preview-field-path={`posts[${i}].category`} />
          <Field
            as="h1"
            className="mt-3 font-display text-[2rem] leading-tight font-semibold md:text-5xl"
            data-preview-field-path={`posts[${i}].title`}
          />
          <p className="mt-4 text-sm text-muted">
            <Field data-preview-field-path={`posts[${i}].date`} format={fmtDate} /> ·{" "}
            <Field data-preview-field-path={`posts[${i}].readMins`} format={(m) => fill(text("blog.readLong"), { n: m })} />
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative aspect-video overflow-hidden rounded-3xl">
          <Photo
            id={p.image}
            alt=""
            fill
            priority
            sizes="(min-width:1024px) 900px, 100vw"
            className="object-cover"
            data-preview-field-path={`posts[${i}].image`}
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <Field as="p" className="text-lg leading-relaxed text-muted-strong" data-preview-field-path={`posts[${i}].excerpt`} />
        <div data-preview-list-path={`posts[${i}].body`}>
          {(p.body ?? []).map((b, j) => (
            <section key={j} className="mt-8" data-preview-item-path={`posts[${i}].body[${j}]`}>
              {b.heading && (
                <Field as="h2" className="font-display text-xl font-semibold md:text-2xl" data-preview-field-path={`posts[${i}].body[${j}].heading`} />
              )}
              <Field as="p" className="mt-3 leading-[1.75] text-ink/85" data-preview-field-path={`posts[${i}].body[${j}].text`} />
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-[1.25rem] bg-surface p-6">
          <Field as="p" className="font-semibold" data-preview-field-path="blog.post.ctaTitle" />
          <Field as="p" className="mt-1 text-sm text-muted" data-preview-field-path="blog.post.ctaText" />
          <Link href={text("blog.post.ctaHref") || "/cars"} className="btn-ink mt-4" data-preview-field-path="blog.post.ctaHref">
            <Field data-preview-field-path="blog.post.ctaLabel" />
          </Link>
        </div>
      </div>
    </article>
  );
}
