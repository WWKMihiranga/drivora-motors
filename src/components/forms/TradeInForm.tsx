"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useApp } from "@/store";
import { rs } from "@/lib/format";
import { Consent, DemoNote, FormField, Success, inputCls, validPhone } from "./shared";
import { LinkField } from "@/components/ui/LinkField";
import { Field, FillField, useContentValue, useList, useText } from "@/lib/site-data";
import { cn } from "@/lib/cn";

type Cond = { key: string; title: string; text: string; factor: number };

/** Rough, clearly-labelled demo estimate. A real valuation comes from our buyer. */
function estimate(year: number, km: number, condF: number, base: number, thisYear: number) {
  const age = Math.max(0, thisYear - year);
  const ageF = Math.pow(0.9, age);
  const kmF = Math.max(0.55, 1 - km / 400_000);
  const mid = base * ageF * kmF * condF;
  return [Math.round((mid * 0.93) / 50_000) * 50_000, Math.round((mid * 1.05) / 50_000) * 50_000];
}

/* Wording, option lists and the estimate inputs are editable in Fivora (site-data.json `forms.tradeIn`). */
export function TradeInForm() {
  const text = useText();
  const makes = useList<string>("forms.tradeIn.makes");
  const conditions = useList<Cond>("forms.tradeIn.conditions");
  const yearNewest = Number(useContentValue("forms.tradeIn.yearNewest")) || 2025;
  const yearCount = Number(useContentValue("forms.tradeIn.yearCount")) || 20;
  const addLead = useApp((s) => s.addLead);
  const [make, setMake] = useState(() => makes[0] ?? "");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2016);
  const [km, setKm] = useState(80_000);
  const [cond, setCond] = useState<string>("good");
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<[number, number] | null>(null);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p)), [photos]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (model.trim().length < 2) er.model = text("forms.tradeIn.errorModel");
    if (name.trim().length < 2) er.name = text("forms.common.errorName");
    if (!validPhone(phone)) er.phone = text("forms.common.errorPhone");
    if (!consent) er.consent = text("forms.common.errorConsent");
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "trade-in", name, phone, vehicle: `${make} ${model} ${year} (trade-in)`, message: `${km} km, ${cond}` });
    const factor = conditions.find((c) => c.key === cond)?.factor ?? 0.9;
    const base = Number(text("forms.tradeIn.estimateBasePrice")) || 9_500_000;
    const thisYear = Number(text("forms.tradeIn.estimateYear")) || 2026;
    setResult(estimate(year, km, factor, base, thisYear) as [number, number]);
  };

  const estimateRange = result ? <span data-preview-static="Calculated estimate">{`${rs(result[0])} – ${rs(result[1])}`}</span> : null;

  if (result)
    return (
      <div className="rounded-[1.75rem] border border-line">
        <Success
          title={estimateRange}
          text={<FillField data-preview-field-path="forms.tradeIn.resultText" vars={{ car: `${make} ${model} ${year}` }} />}
        >
          <LinkField data-preview-field-path="forms.tradeIn.nextCarHref" className="btn-ink">
            <Field data-preview-field-path="forms.tradeIn.nextCarLabel" />
          </LinkField>
          <Field as="button" type="button" className="btn-line" onClick={() => setResult(null)} data-preview-field-path="forms.tradeIn.againLabel" />
        </Success>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-8 rounded-[1.75rem] border border-line p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={<Field data-preview-field-path="forms.tradeIn.makeLabel" />} id="ti-make">
          <select id="ti-make" value={make} onChange={(e) => setMake(e.target.value)} className="field-select" data-preview-list-path="forms.tradeIn.makes">
            {makes.map((m, n) => (
              <option key={`${m}-${n}`} data-preview-item-path={`forms.tradeIn.makes[${n}]`} data-preview-field-path={`forms.tradeIn.makes[${n}]`}>
                {m}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={<Field data-preview-field-path="forms.tradeIn.modelLabel" />} id="ti-model" error={errors.model}>
          <input
            id="ti-model"
            placeholder={text("forms.tradeIn.modelPlaceholder")}
            data-preview-field-path="forms.tradeIn.modelPlaceholder"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={inputCls(errors.model)}
          />
        </FormField>
        <FormField label={<Field data-preview-field-path="forms.tradeIn.yearLabel" />} id="ti-year">
          <select id="ti-year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="field-select">
            {Array.from({ length: yearCount }, (_, k) => yearNewest - k).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </FormField>
        <FormField label={<Field data-preview-field-path="forms.tradeIn.kmLabel" />} id="ti-km">
          <input id="ti-km" type="number" inputMode="numeric" min={0} step={1000} value={km} onChange={(e) => setKm(Math.max(0, Number(e.target.value)))} className="field" data-num />
        </FormField>
      </div>

      <fieldset>
        <Field as="legend" className="field-label" data-preview-field-path="forms.tradeIn.conditionLabel" />
        <div className="grid gap-2 sm:grid-cols-3" data-preview-list-path="forms.tradeIn.conditions">
          {conditions.map((c, n) => (
            <button
              key={`${c.key}-${n}`}
              type="button"
              aria-pressed={cond === c.key}
              onClick={() => setCond(c.key)}
              data-preview-item-path={`forms.tradeIn.conditions[${n}]`}
              className={cn("rounded-2xl border p-4 text-left transition-colors", cond === c.key ? "border-ink bg-surface" : "border-line hover:border-ink/40")}
            >
              <Field className="block text-sm font-semibold" data-preview-field-path={`forms.tradeIn.conditions[${n}].title`} />
              <Field className="block text-xs text-muted" data-preview-field-path={`forms.tradeIn.conditions[${n}].text`} />
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <Field as="p" className="field-label" data-preview-field-path="forms.tradeIn.photosLabel" />
        <div className="flex flex-wrap gap-3">
          {photos.map((src) => (
            <div key={src} className="relative size-20 overflow-hidden rounded-xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={text("forms.tradeIn.photoAlt")} className="size-full object-cover" data-preview-static="Visitor's own photo preview" />
              <button
                type="button"
                onClick={() => setPhotos((p) => p.filter((x) => x !== src))}
                aria-label={text("forms.tradeIn.removePhotoLabel")}
                data-preview-field-path="forms.tradeIn.removePhotoLabel"
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-night/70 text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {photos.length < 6 && (
            <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/25 text-xs text-muted hover:border-ink">
              <ImagePlus className="size-5" strokeWidth={1.5} />
              <Field data-preview-field-path="forms.tradeIn.addPhoto" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []).slice(0, 6 - photos.length);
                  setPhotos((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
        <Field as="p" className="mt-2 text-xs text-muted" data-preview-field-path="forms.tradeIn.photosNote" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={<Field data-preview-field-path="forms.common.nameLabel" />} id="ti-name" error={errors.name}>
          <input id="ti-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
        </FormField>
        <FormField label={<Field data-preview-field-path="forms.common.phoneLabel" />} id="ti-phone" error={errors.phone}>
          <input
            id="ti-phone"
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
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Field as="button" type="submit" className="btn-ink" data-preview-field-path="forms.tradeIn.submit" />
        <DemoNote />
      </div>
    </form>
  );
}
