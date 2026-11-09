"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarPlus, Car, Home } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { useApp } from "@/store";
import { rs, vehicleTitle } from "@/lib/format";
import { site, whatsappLink } from "@/config/site";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Consent, DemoNote, Field, Success, inputCls, validPhone } from "./shared";
import { cn } from "@/lib/cn";

const slots = ["09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30"];

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    out.push(new Date(d));
  }
  return out;
}

function icsHref(title: string, date: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 45 * 60_000);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${site.address.line1}, ${site.address.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

export function BookingForm() {
  const params = useSearchParams();
  const addLead = useApp((s) => s.addLead);
  const bookable = vehicles.filter((v) => v.status === "available");
  const [slug, setSlug] = useState(params.get("car") ?? bookable[0].slug);
  const days = useMemo(() => nextDays(10), []);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const [where, setWhere] = useState<"showroom" | "home">("showroom");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const car = vehicles.find((v) => v.slug === slug) ?? bookable[0];
  const dateLabel = days[day].toLocaleDateString("en-LK", { weekday: "long", day: "numeric", month: "long" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!time) er.time = "Pick a time.";
    if (name.trim().length < 2) er.name = "Please enter your name.";
    if (!validPhone(phone)) er.phone = "Enter a Sri Lankan number, e.g. 077 123 4567.";
    if (!consent) er.consent = "Please tick to continue.";
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "test-drive", name, phone, vehicle: vehicleTitle(car), date: `${dateLabel} ${time}` });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done)
    return (
      <div className="rounded-[1.75rem] border border-line">
        <Success
          title="You're booked in"
          text={`${vehicleTitle(car)} · ${dateLabel} at ${time}${where === "home" ? " · we'll bring it to you" : ` · ${site.address.line1}, ${site.address.city}`}. We'll confirm on WhatsApp.`}
        >
          <a href={icsHref(`Test drive: ${vehicleTitle(car)}`, days[day], time)} download="drivora-test-drive.ics" className="btn-ink">
            <CalendarPlus className="size-4" /> Add to calendar
          </a>
          <a href={whatsappLink(`Hi, I booked a test drive of the ${vehicleTitle(car)} on ${dateLabel} at ${time}.`)} target="_blank" rel="noopener" className="btn-line">
            <WhatsAppIcon className="size-4" /> Confirm on WhatsApp
          </a>
        </Success>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <Step n={1} title="Which car?">
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="field-select" aria-label="Car">
            {bookable.map((v) => (
              <option key={v.slug} value={v.slug}>
                {vehicleTitle(v)} · {rs(v.priceLkr)}
              </option>
            ))}
          </select>
        </Step>

        <Step n={2} title="Where?">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["showroom", Car, "At our showroom", `${site.address.city}, with a 20-minute route`],
                ["home", Home, "At your home or office", "Within 30 km of Nugegoda, free"],
              ] as const
            ).map(([k, Icon, t, d]) => (
              <button
                key={k}
                type="button"
                aria-pressed={where === k}
                onClick={() => setWhere(k)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                  where === k ? "border-ink bg-surface" : "border-line hover:border-ink/40",
                )}
              >
                <Icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                <span>
                  <span className="block text-sm font-semibold">{t}</span>
                  <span className="block text-xs text-muted">{d}</span>
                </span>
              </button>
            ))}
          </div>
        </Step>

        <Step n={3} title="When?">
          <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0" role="radiogroup" aria-label="Day">
            {days.map((d, k) => {
              const sunday = d.getDay() === 0;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={day === k}
                  onClick={() => setDay(k)}
                  className={cn(
                    "flex w-17 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors",
                    day === k ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink/40",
                  )}
                >
                  <span className={cn("text-[0.7rem] uppercase", day === k ? "text-white/70" : "text-muted")}>
                    {d.toLocaleDateString("en-LK", { weekday: "short" })}
                  </span>
                  <span className="font-display text-xl font-semibold" data-num>
                    {d.getDate()}
                  </span>
                  {sunday && <span className={cn("text-[0.6rem]", day === k ? "text-white/60" : "text-muted")}>till 2</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7" role="radiogroup" aria-label="Time">
            {slots
              .filter((s) => days[day].getDay() !== 0 || s < "14:00")
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={time === s}
                  onClick={() => setTime(s)}
                  className={cn(
                    "h-11 rounded-full border text-sm font-medium transition-colors",
                    time === s ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink/40",
                  )}
                  data-num
                >
                  {s}
                </button>
              ))}
          </div>
          {errors.time && <p className="mt-2 text-xs font-medium text-bad">{errors.time}</p>}
        </Step>

        <Step n={4} title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" id="bk-name" error={errors.name}>
              <input id="bk-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
            </Field>
            <Field label="Mobile number" id="bk-phone" error={errors.phone} hint="We confirm on WhatsApp">
              <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="077 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls(errors.phone)} />
            </Field>
          </div>
          <div className="mt-4">
            <Consent checked={consent} onChange={setConsent} error={errors.consent} />
          </div>
        </Step>
      </div>

      <aside>
        <div className="space-y-4 rounded-3xl border border-line p-4 lg:sticky lg:top-28">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface">
            <Photo id={car.images[0]} alt={vehicleTitle(car)} fill crop="4:3" sizes="340px" className="object-cover" />
          </div>
          <div className="px-1">
            <p className="font-display text-lg font-semibold">{vehicleTitle(car)}</p>
            <p className="text-sm text-muted">{car.grade}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Day</dt>
                <dd className="font-medium">{dateLabel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Time</dt>
                <dd className="font-medium">{time || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Where</dt>
                <dd className="font-medium">{where === "home" ? "Your place" : "Showroom"}</dd>
              </div>
            </dl>
          </div>
          <button type="submit" className="btn-ink w-full">
            Confirm booking
          </button>
          <DemoNote className="text-center" />
          <Link href={`/cars/${car.slug}`} className="block text-center text-sm font-medium text-muted hover:text-ink">
            View car details
          </Link>
        </div>
      </aside>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-ink font-display text-xs font-semibold text-on-ink">{n}</span>
        <span className="font-display text-lg font-semibold">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}
