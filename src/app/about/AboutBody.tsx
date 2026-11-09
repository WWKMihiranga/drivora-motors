"use client";

import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { LinkField } from "@/components/ui/LinkField";
import { Field, useList, useText } from "@/lib/site-data";

/* Everything below the page title, read live so list edits show instantly in the Fivora editor. */
export function AboutBody() {
  const text = useText();
  const a = {
    heroImage: text("about.heroImage"),
    heroImageAlt: text("about.heroImageAlt"),
    storyImage: text("about.storyImage"),
    storyImageAlt: text("about.storyImageAlt"),
    stats: useList<{ value: string; label: string }>("about.stats"),
    timeline: useList<{ year: string; text: string }>("about.timeline"),
    team: useList<{ name: string; role: string; text: string }>("about.team"),
  };
  return (
    <>
      <section className="container-x py-12 md:py-16">
        <div className="relative aspect-16/10 overflow-hidden rounded-[1.75rem] md:aspect-21/9" data-reveal>
          <Photo
            id={a.heroImage}
            alt={a.heroImageAlt}
            fill
            sizes="(min-width:1280px) 1200px, 100vw"
            priority
            className="object-cover"
            data-preview-field-path="about.heroImage"
          />
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4" data-preview-list-path="about.stats">
          {a.stats.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              data-reveal
              data-preview-item-path={`about.stats[${i}]`}
              style={{ ["--reveal-i" as string]: i }}
              className="border-t border-line pt-4"
            >
              <Field as="dd" className="font-display text-5xl font-extralight tracking-tight" data-num data-preview-field-path={`about.stats[${i}].value`} />
              <Field as="dt" className="mt-2 text-xs tracking-widest text-muted uppercase" data-preview-field-path={`about.stats[${i}].label`} />
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-10 pb-20 md:pb-28 lg:grid-cols-2">
        <div>
          <Field as="p" className="eyebrow" data-preview-field-path="about.storyEyebrow" />
          <Field as="h2" className="section-title mt-3" data-preview-field-path="about.storyTitle" />
          <ol className="mt-8 space-y-0" data-preview-list-path="about.timeline">
            {a.timeline.map((t, i) => (
              <li
                key={`${t.year}-${i}`}
                data-reveal
                data-preview-item-path={`about.timeline[${i}]`}
                style={{ ["--reveal-i" as string]: i }}
                className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line py-4"
              >
                <Field className="font-display font-semibold text-brand" data-num data-preview-field-path={`about.timeline[${i}].year`} />
                <Field className="text-muted-strong" data-preview-field-path={`about.timeline[${i}].text`} />
              </li>
            ))}
          </ol>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-[1.75rem]" data-reveal>
          <Photo
            id={a.storyImage}
            alt={a.storyImageAlt}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
            data-preview-field-path="about.storyImage"
          />
        </div>
      </section>

      <section className="container-x pb-20 md:pb-28">
        <Field as="p" className="eyebrow" data-preview-field-path="about.teamEyebrow" />
        <Field as="h2" className="section-title mt-3" data-preview-field-path="about.teamTitle" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-preview-list-path="about.team">
          {a.team.map((m, i) => (
            <li
              key={`${m.name}-${i}`}
              data-reveal
              data-preview-item-path={`about.team[${i}]`}
              style={{ ["--reveal-i" as string]: i }}
              className="rounded-[1.25rem] bg-surface p-5"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-on-ink">
                {m.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <Field as="p" className="mt-4 font-semibold" data-preview-field-path={`about.team[${i}].name`} />
              <Field as="p" className="text-sm text-brand" data-preview-field-path={`about.team[${i}].role`} />
              <Field as="p" className="mt-2 text-sm text-muted" data-preview-field-path={`about.team[${i}].text`} />
            </li>
          ))}
        </ul>
        <Field as="p" className="mt-4 text-xs text-muted" data-preview-field-path="about.teamNote" />
        <LinkField data-preview-field-path="about.ctaHref" className="btn-ink mt-10">
          <Field data-preview-field-path="about.ctaLabel" /> <ArrowRight className="size-4" />
        </LinkField>
      </section>
    </>
  );
}
