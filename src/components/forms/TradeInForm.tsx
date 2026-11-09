"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useApp } from "@/store";
import { rs } from "@/lib/format";
import { Consent, DemoNote, Field, Success, inputCls, validPhone } from "./shared";
import { cn } from "@/lib/cn";

const makes = ["Toyota", "Honda", "Suzuki", "Nissan", "Mitsubishi", "Mazda", "Hyundai", "Kia", "Daihatsu", "Perodua", "Micro", "BMW", "Mercedes-Benz", "Other"];
const conditions = [
  ["excellent", "Excellent", "Like new, no repairs needed"],
  ["good", "Good", "Normal wear, small marks"],
  ["fair", "Fair", "Needs some work"],
] as const;

/** Rough, clearly-labelled demo estimate. A real valuation comes from our buyer. */
function estimate(year: number, km: number, cond: string, base: number) {
  const age = Math.max(0, 2026 - year);
  const ageF = Math.pow(0.9, age);
  const kmF = Math.max(0.55, 1 - km / 400_000);
  const condF = cond === "excellent" ? 1 : cond === "good" ? 0.92 : 0.8;
  const mid = base * ageF * kmF * condF;
  return [Math.round((mid * 0.93) / 50_000) * 50_000, Math.round((mid * 1.05) / 50_000) * 50_000];
}

export function TradeInForm() {
  const addLead = useApp((s) => s.addLead);
  const [make, setMake] = useState("Toyota");
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
    if (model.trim().length < 2) er.model = "Which model is it?";
    if (name.trim().length < 2) er.name = "Please enter your name.";
    if (!validPhone(phone)) er.phone = "Enter a Sri Lankan number, e.g. 077 123 4567.";
    if (!consent) er.consent = "Please tick to continue.";
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "trade-in", name, phone, vehicle: `${make} ${model} ${year} (trade-in)`, message: `${km} km, ${cond}` });
    setResult(estimate(year, km, cond, 9_500_000) as [number, number]);
  };

  if (result)
    return (
      <div className="rounded-[1.75rem] border border-line">
        <Success
          title={`${rs(result[0])} – ${rs(result[1])}`}
          text={`Our first estimate for your ${make} ${model} ${year}. A buyer will call to confirm after a quick 20-minute inspection. Demo figure only.`}
        >
          <Link href="/cars" className="btn-ink">
            Choose your next car
          </Link>
          <button type="button" className="btn-line" onClick={() => setResult(null)}>
            Value another car
          </button>
        </Success>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-8 rounded-[1.75rem] border border-line p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Make" id="ti-make">
          <select id="ti-make" value={make} onChange={(e) => setMake(e.target.value)} className="field-select">
            {makes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Model" id="ti-model" error={errors.model}>
          <input id="ti-model" placeholder="e.g. Axio, Vitz, Fit" value={model} onChange={(e) => setModel(e.target.value)} className={inputCls(errors.model)} />
        </Field>
        <Field label="Year of manufacture" id="ti-year">
          <select id="ti-year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="field-select">
            {Array.from({ length: 20 }, (_, k) => 2025 - k).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="Mileage (km)" id="ti-km">
          <input id="ti-km" type="number" inputMode="numeric" min={0} step={1000} value={km} onChange={(e) => setKm(Math.max(0, Number(e.target.value)))} className="field" data-num />
        </Field>
      </div>

      <fieldset>
        <legend className="field-label">Condition</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {conditions.map(([k, t, d]) => (
            <button
              key={k}
              type="button"
              aria-pressed={cond === k}
              onClick={() => setCond(k)}
              className={cn("rounded-2xl border p-4 text-left transition-colors", cond === k ? "border-ink bg-surface" : "border-line hover:border-ink/40")}
            >
              <span className="block text-sm font-semibold">{t}</span>
              <span className="block text-xs text-muted">{d}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="field-label">Photos (optional)</p>
        <div className="flex flex-wrap gap-3">
          {photos.map((src) => (
            <div key={src} className="relative size-20 overflow-hidden rounded-xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Your upload" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((p) => p.filter((x) => x !== src))}
                aria-label="Remove photo"
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-night/70 text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {photos.length < 6 && (
            <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/25 text-xs text-muted hover:border-ink">
              <ImagePlus className="size-5" strokeWidth={1.5} />
              Add
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
        <p className="mt-2 text-xs text-muted">Front, back, both sides, dashboard with mileage. Photos stay on your device in this demo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" id="ti-name" error={errors.name}>
          <input id="ti-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
        </Field>
        <Field label="Mobile number" id="ti-phone" error={errors.phone}>
          <input id="ti-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="077 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls(errors.phone)} />
        </Field>
      </div>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-ink">
          Get my estimate
        </button>
        <DemoNote />
      </div>
    </form>
  );
}
