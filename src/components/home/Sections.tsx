"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MessageCircle, Star } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { LinkField } from "@/components/ui/LinkField";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/config/site";
import type { Post, Review } from "@/types";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Field, fill, useList, useText } from "@/lib/site-data";

/* Every word, photo and list on these home sections is editable in Fivora (site-data.json `home.*`). */

/* ---------- Why us: photo + four plain promises ---------- */
export function WhyUs() {
  const text = useText();
  const reasons = useList<{ title: string; text: string }>("home.whyUs.reasons");
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div data-reveal className="relative aspect-4/3 overflow-hidden rounded-[1.75rem] lg:aspect-auto">
        <Photo
          id={text("home.whyUs.image")}
          alt={text("home.whyUs.imageAlt")}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
          data-preview-field-path="home.whyUs.image"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-paper/95 p-4 backdrop-blur md:inset-x-6 md:bottom-6">
          <Field as="p" className="text-sm font-semibold" data-preview-field-path="home.whyUs.cardTitle" />
          <Field as="p" className="mt-1 text-[0.82rem] text-muted" data-preview-field-path="home.whyUs.cardText" />
        </div>
      </div>
      <div>
        <Field as="p" className="eyebrow" data-reveal data-preview-field-path="home.whyUs.eyebrow" />
        <Field as="h2" className="section-title mt-3" data-reveal data-preview-field-path="home.whyUs.title" />
        <dl className="mt-8 divide-y divide-line border-y border-line" data-preview-list-path="home.whyUs.reasons">
          {reasons.map((r, i) => (
            <div
              key={`${r.title}-${i}`}
              data-reveal
              data-preview-item-path={`home.whyUs.reasons[${i}]`}
              style={{ ["--reveal-i" as string]: i }}
              className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-5"
            >
              <span className="font-display text-sm font-semibold text-brand" data-num>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <Field as="dt" className="font-sans font-semibold" data-preview-field-path={`home.whyUs.reasons[${i}].title`} />
                <Field
                  as="dd"
                  className="mt-1 text-[0.92rem] leading-relaxed text-muted"
                  data-preview-field-path={`home.whyUs.reasons[${i}].text`}
                />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ---------- Offer banner ---------- */
export function OfferBanner() {
  const text = useText();
  return (
    <div data-reveal className="relative overflow-hidden rounded-[1.75rem] bg-night text-white">
      <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
        <Photo
          id={text("home.offer.image")}
          alt={text("home.offer.imageAlt")}
          fill
          sizes="(min-width:768px) 58vw, 100vw"
          className="object-cover opacity-90"
          data-preview-field-path="home.offer.image"
        />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/70 to-transparent md:via-night/30" />
      </div>
      <div className="relative max-w-xl p-7 md:p-12">
        <Field as="p" className="eyebrow-dark" data-preview-field-path="home.offer.eyebrow" />
        <Field
          as="h3"
          className="mt-3 font-display text-[1.7rem] leading-tight font-semibold text-white md:text-4xl"
          data-preview-field-path="home.offer.title"
        />
        <Field as="p" className="mt-3 text-white/65" data-preview-field-path="home.offer.text" />
        <LinkField data-preview-field-path="home.offer.ctaHref" className="btn-light mt-7">
          <Field data-preview-field-path="home.offer.ctaLabel" /> <ArrowRight className="size-4" />
        </LinkField>
      </div>
    </div>
  );
}

/* ---------- Reviews ---------- */
export function Reviews() {
  const text = useText();
  const reviews = useList<Review>("reviews");
  return (
    <div
      className="no-scrollbar snap-x-mandatory -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
      data-preview-list-path="reviews"
    >
      {reviews.slice(0, 6).map((r, i) => (
        <figure
          key={r.id ?? i}
          data-reveal
          data-preview-item-path={`reviews[${i}]`}
          style={{ ["--reveal-i" as string]: i % 3 }}
          className="flex w-[85%] shrink-0 snap-start flex-col rounded-[1.25rem] border border-line bg-paper p-5 md:w-auto"
        >
          <span
            className="flex items-center gap-0.5 text-brand"
            role="img"
            aria-label={fill(text("home.reviews.starsLabel"), { rating: r.rating })}
            data-preview-field-path={`reviews[${i}].rating`}
          >
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className={s < r.rating ? "size-4 fill-current" : "size-4 text-line"} strokeWidth={1.5} />
            ))}
          </span>
          <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink">
            &ldquo;<Field data-preview-field-path={`reviews[${i}].text`} />&rdquo;
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-surface">
              <Photo
                id={r.image}
                alt={fill(text("home.reviews.photoAlt"), { name: r.name, car: r.car })}
                fill
                sizes="48px"
                crop="1:1"
                className="object-cover"
                data-preview-field-path={`reviews[${i}].image`}
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold">
                <Field data-preview-field-path={`reviews[${i}].name`} /> · <Field data-preview-field-path={`reviews[${i}].town`} />
              </span>
              <span className="block truncate text-xs text-muted">
                <Field data-preview-field-path="home.reviews.boughtPrefix" /> <Field data-preview-field-path={`reviews[${i}].car`} />
              </span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------- Guides ---------- */
export function Guides() {
  const text = useText();
  const posts = useList<Post>("posts");
  return (
    <div className="grid gap-4 md:grid-cols-3" data-preview-list-path="posts">
      {posts.slice(0, 3).map((p, i) => (
        <Link
          key={p.slug ?? i}
          href={`/blog/${p.slug}`}
          data-reveal
          data-preview-item-path={`posts[${i}]`}
          data-preview-field-path={`posts[${i}].slug`}
          style={{ ["--reveal-i" as string]: i }}
          className="group relative flex aspect-[4/3.4] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-night p-5 text-white md:aspect-[4/4.2] lg:aspect-[4/3.4]"
        >
          <Photo
            id={p.image}
            alt=""
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover opacity-70 transition-transform duration-700 ease-out-soft group-hover:scale-105"
            data-preview-field-path={`posts[${i}].image`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-night via-night/50 to-night/10" />
          <Field
            className="absolute top-4 left-4 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold backdrop-blur"
            data-preview-field-path={`posts[${i}].category`}
          />
          <div className="relative">
            <Field
              as="h3"
              className="font-display text-lg leading-snug font-semibold text-white"
              data-preview-field-path={`posts[${i}].title`}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />{" "}
                <Field data-preview-field-path={`posts[${i}].readMins`} format={(n) => fill(text("home.guides.readTime"), { n })} />
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-night transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------- Closing call to action ---------- */
export function ClosingCta() {
  const text = useText();
  return (
    <section className="px-3 md:px-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <Photo
          id={text("home.closing.image")}
          alt={text("home.closing.imageAlt")}
          fill
          sizes="100vw"
          className="object-cover opacity-55"
          data-preview-field-path="home.closing.image"
        />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/85 to-night/20" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-xl">
            <Field as="p" className="eyebrow-dark" data-reveal data-preview-field-path="home.closing.eyebrow" />
            <Field
              as="h2"
              className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-5xl"
              data-reveal
              data-preview-field-path="home.closing.title"
            />
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <a
                href={whatsappLink(text("home.closing.whatsappMessage"))}
                target="_blank"
                rel="noopener"
                className="btn-light"
                data-preview-field-path="home.closing.whatsappMessage"
              >
                <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="home.closing.whatsappLabel" />
              </a>
              <OpenChatButton className="btn-pill border border-white/25 bg-transparent text-white hover:bg-white/10">
                <MessageCircle className="size-4" /> <Field data-preview-field-path="home.closing.chatLabel" />
              </OpenChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
