"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarPlus, Car, Home } from "lucide-react";
import { vehicleIndex, vehicles } from "@/data/vehicles";
import { useApp } from "@/store";
import { rs, vehicleTitle } from "@/lib/format";
import { site, whatsappLink } from "@/config/site";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Consent, DemoNote, FormField, Success, inputCls, validPhone } from "./shared";
import { Field, FillField, fill, useContentValue, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

const GENERATED = "Generated from the calendar and the visitor's choices";

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

/** Reads ?car= (needs a Suspense boundary); the server-rendered fallback is the same form without it. */
export function BookingFormFromUrl() {
  const params = useSearchParams();
  return <BookingForm key={params.get("car") ?? ""} car={params.get("car")} />;
}

/* Wording, time slots and options are editable in Fivora (site-data.json `forms.booking`). */
export function BookingForm({ car: carParam = null }: { car?: string | null }) {
  const text = useText();
  const slots = useList<string>("forms.booking.slots");
  const sundayCutoff = useContentValue("forms.booking.sundayCutoff") || "14:00";
  const daysAhead = Number(useContentValue("forms.booking.daysAhead")) || 10;
  const addLead = useApp((s) => s.addLead);
  const bookable = vehicles.filter((v) => v.status === "available");
  const [slug, setSlug] = useState(carParam ?? bookable[0]?.slug ?? "");
  const days = useMemo(() => nextDays(daysAhead), [daysAhead]);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const [where, setWhere] = useState<"showroom" | "home">("showroom");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const car = vehicles.find((v) => v.slug === slug) ?? bookable[0] ?? vehicles[0];
  const ci = car ? vehicleIndex(car) : 0;
  // With an empty inventory the form still renders (Fivora keeps its editable labels mounted).
  const title = car ? vehicleTitle(car) : "";
  const dateLabel = days[day].toLocaleDateString("en-LK", { weekday: "long", day: "numeric", month: "long" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!time) er.time = text("forms.booking.errorTime");
    if (name.trim().length < 2) er.name = text("forms.common.errorName");
    if (!validPhone(phone)) er.phone = text("forms.common.errorPhone");
    if (!consent) er.consent = text("forms.common.errorConsent");
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "test-drive", name, phone, vehicle: title, date: `${dateLabel} ${time}` });
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whereText = where === "home" ? text("forms.booking.successWhereHome") : `${site.address.line1}, ${site.address.city}`;

  if (done)
    return (
      <div className="rounded-[1.75rem] border border-line">
        <Success
          title={<Field data-preview-field-path="forms.booking.successTitle" />}
          text={
            <FillField
              data-preview-field-path="forms.booking.successText"
              vars={{ car: title, date: dateLabel, time, where: whereText }}
            />
          }
        >
          <a
            href={icsHref(fill(text("forms.booking.calendarTitle"), { car: title }), days[day], time)}
            download={text("forms.booking.calendarFile")}
            className="btn-ink"
            data-preview-field-path="forms.booking.calendarTitle"
          >
            <CalendarPlus className="size-4" /> <Field data-preview-field-path="forms.booking.calendarLabel" />
          </a>
          <a
            href={whatsappLink(fill(text("forms.booking.whatsappMessage"), { car: title, date: dateLabel, time }))}
            target="_blank"
            rel="noopener"
            className="btn-line"
            data-preview-field-path="forms.booking.whatsappMessage"
          >
            <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="forms.booking.whatsappLabel" />
          </a>
        </Success>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <Step n={1} title={<Field data-preview-field-path="forms.booking.step1" />}>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="field-select"
            aria-label={text("forms.booking.carLabel")}
            data-preview-field-path="forms.booking.carLabel"
          >
            {bookable.map((v) => (
              <option key={v.slug} value={v.slug}>
                {vehicleTitle(v)} · {rs(v.priceLkr)}
              </option>
            ))}
          </select>
        </Step>

        <Step n={2} title={<Field data-preview-field-path="forms.booking.step2" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                [
                  "showroom",
                  Car,
                  <Field key="t" data-preview-field-path="forms.booking.showroomTitle" />,
                  <FillField key="d" data-preview-field-path="forms.booking.showroomText" vars={{ city: site.address.city }} />,
                ],
                [
                  "home",
                  Home,
                  <Field key="t" data-preview-field-path="forms.booking.homeTitle" />,
                  <Field key="d" data-preview-field-path="forms.booking.homeText" />,
                ],
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

        <Step n={3} title={<Field data-preview-field-path="forms.booking.step3" />}>
          <Field id="bk-day-label" className="sr-only" data-preview-field-path="forms.booking.dayLabel" />
          <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0" role="radiogroup" aria-labelledby="bk-day-label">
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
                  <span className={cn("text-[0.7rem] uppercase", day === k ? "text-white/70" : "text-muted")} data-preview-static={GENERATED}>
                    {d.toLocaleDateString("en-LK", { weekday: "short" })}
                  </span>
                  <span className="font-display text-xl font-semibold" data-num>
                    {d.getDate()}
                  </span>
                  {sunday && (
                    <Field
                      className={cn("text-[0.6rem]", day === k ? "text-white/60" : "text-muted")}
                      data-preview-field-path="forms.booking.sundayNote"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <Field id="bk-time-label" className="sr-only" data-preview-field-path="forms.booking.timeLabel" />
          <div
            className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7"
            role="radiogroup"
            aria-labelledby="bk-time-label"
            data-preview-list-path="forms.booking.slots"
          >
            {slots
              .map((s, n) => ({ s, n, off: days[day].getDay() === 0 && s >= sundayCutoff }))
              .map(({ s, n, off }) => (
                <button
                  key={s}
                  data-preview-item-path={`forms.booking.slots[${n}]`}
                  data-preview-field-path={`forms.booking.slots[${n}]`}
                  type="button"
                  role="radio"
                  aria-checked={time === s}
                  onClick={() => setTime(s)}
                  disabled={off}
                  className={cn(
                    "h-11 rounded-full border text-sm font-medium transition-colors",
                    time === s ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink/40",
                    off && "hidden", // closed on Sunday afternoons; kept in the page so the slot stays editable
                  )}
                  data-num
                >
                  {s}
                </button>
              ))}
          </div>
          {errors.time && (
            <p className="mt-2 text-xs font-medium text-bad" data-preview-static="Validation message shown after a failed submit">
              {errors.time}
            </p>
          )}
        </Step>

        <Step n={4} title={<Field data-preview-field-path="forms.booking.step4" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={<Field data-preview-field-path="forms.booking.nameLabel" />} id="bk-name" error={errors.name}>
              <input id="bk-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
            </FormField>
            <FormField
              label={<Field data-preview-field-path="forms.common.phoneLabel" />}
              id="bk-phone"
              error={errors.phone}
              hint={<Field data-preview-field-path="forms.booking.phoneHint" />}
            >
              <input
                id="bk-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={text("forms.common.phonePlaceholder")}
                data-preview-field-path="forms.common.phonePlaceholder"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls(errors.phone)}
              />
            </FormField>
          </div>
          <div className="mt-4">
            <Consent checked={consent} onChange={setConsent} error={errors.consent} />
          </div>
        </Step>
      </div>

      <aside>
        <div className="space-y-4 rounded-3xl border border-line p-4 lg:sticky lg:top-28">
          {car && (
          <>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface">
            <Photo
              id={car.images[0]}
              alt={title}
              fill
              crop="4:3"
              sizes="340px"
              className="object-cover"
              data-preview-field-path={`vehicles[${ci}].images[0]`}
            />
          </div>
          <div className="px-1">
            <p className="font-display text-lg font-semibold">
              <Field data-preview-field-path={`vehicles[${ci}].make`} /> <Field data-preview-field-path={`vehicles[${ci}].model`} />{" "}
              <Field data-preview-field-path={`vehicles[${ci}].yom`} />
            </p>
            <Field as="p" className="text-sm text-muted" data-preview-field-path={`vehicles[${ci}].grade`} />
          </div>
          </>
          )}
          <div className="px-1">
            {/* space-y-4 on the card supplies the 1rem gap that mt-4 gave before the car block was split out */}
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Field as="dt" className="text-muted" data-preview-field-path="forms.booking.summaryDay" />
                <dd className="font-medium" data-preview-static={GENERATED}>
                  {dateLabel}
                </dd>
              </div>
              <div className="flex justify-between">
                <Field as="dt" className="text-muted" data-preview-field-path="forms.booking.summaryTime" />
                <dd className="font-medium">{time || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <Field as="dt" className="text-muted" data-preview-field-path="forms.booking.summaryWhere" />
                <dd className="font-medium">
                  {where === "home" ? (
                    <Field data-preview-field-path="forms.booking.summaryHome" />
                  ) : (
                    <Field data-preview-field-path="forms.booking.summaryShowroom" />
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <Field as="button" type="submit" className="btn-ink w-full" data-preview-field-path="forms.booking.submit" />
          <DemoNote className="text-center" />
          {car && (
            <Link
              href={`/cars/${car.slug}`}
              className="block text-center text-sm font-medium text-muted hover:text-ink"
              data-preview-field-path={`vehicles[${ci}].slug`}
            >
              <Field data-preview-field-path="forms.booking.viewCar" />
            </Link>
          )}
        </div>
      </aside>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: React.ReactNode; children: React.ReactNode }) {
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
