import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MessageCircle, Star } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { IMG } from "@/lib/unsplash";
import { whatsappLink } from "@/config/site";
import type { Post, Review } from "@/types";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

/* ---------- Why us: photo + four plain promises ---------- */
const reasons = [
  ["The price is the price", "What you see online is what goes on the invoice. Registration and insurance are quoted separately, up front."],
  ["Leasing in days, not weeks", "We prepare your file and send it to the lenders most likely to say yes, usually within 48 hours."],
  ["We buy your old car", "Fair trade-in prices based on recent sales, not a number pulled out of the air."],
  ["Someone picks up", "Real people on WhatsApp seven days a week, and a follow-up call a week after delivery."],
];

export function WhyUs() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div data-reveal className="relative aspect-4/3 overflow-hidden rounded-[1.75rem] lg:aspect-auto">
        <Photo
          id={IMG.garlandCar}
          alt="A new red car decorated with a garland at handover"
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-paper/95 p-4 backdrop-blur md:inset-x-6 md:bottom-6">
          <p className="text-sm font-semibold">Every handover, a small celebration</p>
          <p className="mt-1 text-[0.82rem] text-muted">Garland, a full tank and a walk-through of every switch.</p>
        </div>
      </div>
      <div>
        <p className="eyebrow" data-reveal>
          Why Drivora
        </p>
        <h2 className="section-title mt-3" data-reveal>
          Buying a car shouldn&apos;t feel like a negotiation you&apos;re losing.
        </h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {reasons.map(([t, d], i) => (
            <div key={t} data-reveal style={{ ["--reveal-i" as string]: i }} className="grid grid-cols-[2.5rem_1fr] gap-x-3 py-5">
              <span className="font-display text-sm font-semibold text-brand" data-num>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <dt className="font-sans font-semibold">{t}</dt>
                <dd className="mt-1 text-[0.92rem] leading-relaxed text-muted">{d}</dd>
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
  return (
    <div data-reveal className="relative overflow-hidden rounded-[1.75rem] bg-night text-white">
      <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
        <Photo id="1706509240407-7f3aa19ae740" alt="" fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/70 to-transparent md:via-night/30" />
      </div>
      <div className="relative max-w-xl p-7 md:p-12">
        <p className="eyebrow-dark">Hybrid month · until 30 November</p>
        <h3 className="mt-3 font-display text-[1.7rem] leading-tight font-semibold text-white md:text-4xl">
          A free first-year service plan on every hybrid.
        </h3>
        <p className="mt-3 text-white/65">
          Includes two services, a hybrid battery health report and a wheel alignment. On cars delivered this month.
        </p>
        <Link href="/cars?fuel=hybrid" className="btn-light mt-7">
          See hybrids <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Reviews ---------- */
export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="no-scrollbar snap-x-mandatory -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
      {reviews.slice(0, 6).map((r, i) => (
        <figure
          key={r.id}
          data-reveal
          style={{ ["--reveal-i" as string]: i % 3 }}
          className="flex w-[85%] shrink-0 snap-start flex-col rounded-[1.25rem] border border-line bg-paper p-5 md:w-auto"
        >
          <div className="flex items-center gap-0.5 text-brand" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className={s < r.rating ? "size-4 fill-current" : "size-4 text-line"} strokeWidth={1.5} />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink">&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-surface">
              <Photo id={r.image} alt={`${r.name}'s ${r.car}`} fill sizes="48px" crop="1:1" className="object-cover" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold">
                {r.name} · {r.town}
              </span>
              <span className="block truncate text-xs text-muted">Bought a {r.car}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------- Guides ---------- */
export function Guides({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.slice(0, 3).map((p, i) => (
        <Link
          key={p.slug}
          href={`/blog/${p.slug}`}
          data-reveal
          style={{ ["--reveal-i" as string]: i }}
          className="group relative flex aspect-[4/3.4] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-night p-5 text-white md:aspect-[4/4.2] lg:aspect-[4/3.4]"
        >
          <Photo
            id={p.image}
            alt=""
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover opacity-70 transition-transform duration-700 ease-out-soft group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-night via-night/50 to-night/10" />
          <span className="absolute top-4 left-4 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold backdrop-blur">
            {p.category}
          </span>
          <div className="relative">
            <h3 className="font-display text-lg leading-snug font-semibold text-white">{p.title}</h3>
            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {p.readMins} min read
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
  return (
    <section className="px-3 md:px-5">
      <div className="relative overflow-hidden rounded-4xl bg-night text-white">
        <Photo id={IMG.tailLight} alt="" fill sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/85 to-night/20" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow-dark" data-reveal>
              Not sure yet?
            </p>
            <h2 className="mt-3 font-display text-[2rem] leading-tight font-semibold text-white md:text-5xl" data-reveal>
              Tell us your budget. We&apos;ll send three good options within the hour.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <a
                href={whatsappLink("Hi Drivora! My budget is Rs ___ and I'm looking for a ___.")}
                target="_blank"
                rel="noopener"
                className="btn-light"
              >
                <WhatsAppIcon className="size-4" /> Message on WhatsApp
              </a>
              <OpenChatButton className="btn-pill border border-white/25 bg-transparent text-white hover:bg-white/10">
                <MessageCircle className="size-4" /> Ask the assistant
              </OpenChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
