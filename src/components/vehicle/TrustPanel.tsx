"use client";

import { useState } from "react";
import { BadgeCheck, FileText, Gauge, ScrollText, ShieldCheck, X } from "lucide-react";
import type { Vehicle, VehicleDocument } from "@/types";
import { num } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Field, FillField, useContent, useText } from "@/lib/site-data";
import { vehicleIndex } from "@/data/vehicles";

const icons = { "auction-sheet": ScrollText, inspection: ShieldCheck, service: FileText, cr: FileText } as const;

/* Wording is editable in Fivora (`trust`); each car's documents are `vehicles[i].documents`. */
export function TrustPanel({ v }: { v: Vehicle }) {
  const text = useText();
  const i = vehicleIndex(v);
  const [doc, setDoc] = useState<VehicleDocument | null>(null);
  return (
    <div className="rounded-3xl border border-line p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Field as="p" className="eyebrow" data-preview-field-path="trust.eyebrow" />
          <Field as="h2" className="mt-2 font-display text-xl font-semibold md:text-2xl" data-preview-field-path="trust.title" />
        </div>
        {v.verified && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-3 py-1.5 text-sm font-semibold text-ok">
            <BadgeCheck className="size-4" /> <Field data-preview-field-path="trust.verifiedBadge" />
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl bg-surface p-5">
          <Gauge className="size-6 text-ink" strokeWidth={1.4} />
          <Field as="p" className="mt-3 text-sm text-muted-strong" data-preview-field-path="trust.mileageTitle" />
          <p className="font-display text-3xl font-light tracking-tight" data-num>
            <Field data-preview-field-path={`vehicles[${i}].mileageKm`} format={(m) => num(Number(m))} />{" "}
            <Field className="text-base text-muted" data-preview-field-path="common.units.km" />
          </p>
          <p className="mt-2 text-sm">
            <Field data-preview-field-path="trust.sourceLabel" />{" "}
            <Field
              as="strong"
              className="font-semibold"
              data-preview-field-path={`vehicles[${i}].mileageSource`}
              format={(s) => text(`labels.mileageSource.${s}`) || s}
            />
          </p>
          {v.auctionGrade && (
            <p className="mt-1 text-sm">
              <Field data-preview-field-path="trust.gradeLabel" />{" "}
              <Field as="strong" className="font-semibold" data-preview-field-path={`vehicles[${i}].auctionGrade`} />
            </p>
          )}
          {!!v.owners && (
            <p className="mt-1 text-sm">
              <Field data-preview-field-path="trust.ownersLabel" />{" "}
              <Field as="strong" className="font-semibold" data-preview-field-path={`vehicles[${i}].owners`} />
            </p>
          )}
          <Field as="p" className="mt-3 text-xs leading-relaxed text-muted" data-preview-field-path="trust.mileageNote" />
        </div>

        <ul className="divide-y divide-line rounded-2xl border border-line" data-preview-list-path={`vehicles[${i}].documents`}>
          {v.documents.map((d, n) => {
            const Icon = icons[d.type] ?? FileText;
            return (
              <li key={`${d.label}-${n}`} className="flex items-center gap-4 p-4" data-preview-item-path={`vehicles[${i}].documents[${n}]`}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface" data-preview-field-path={`vehicles[${i}].documents[${n}].type`}>
                  <Icon className="size-[1.1rem]" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <Field as="p" className="text-sm font-semibold" data-preview-field-path={`vehicles[${i}].documents[${n}].label`} />
                  <Field as="p" className="text-xs leading-snug text-muted" data-preview-field-path={`vehicles[${i}].documents[${n}].note`} />
                </div>
                <Field
                  as="button"
                  type="button"
                  onClick={() => setDoc(d)}
                  className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold hover:border-ink"
                  data-preview-field-path="trust.viewLabel"
                />
              </li>
            );
          })}
        </ul>
      </div>

      {doc && <DocDialog doc={doc} v={v} onClose={() => setDoc(null)} />}
    </div>
  );
}

function DocDialog({ doc, v, onClose }: { doc: VehicleDocument; v: Vehicle; onClose: () => void }) {
  const text = useText();
  return (
    <div role="dialog" aria-modal="true" aria-label={doc.label} className="fixed inset-0 z-80 flex items-end justify-center bg-night/50 p-3 sm:items-center" onClick={onClose}>
      <div className="max-h-[90dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-3xl bg-paper" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-semibold">{doc.label}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={text("trust.closeLabel")}
            data-preview-field-path="trust.closeLabel"
            className="flex size-10 items-center justify-center rounded-full bg-surface"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">
          {doc.type === "auction-sheet" ? <AuctionSheet v={v} /> : <GenericDoc doc={doc} v={v} />}
          <Field as="p" className="mt-4 text-xs text-muted" data-preview-field-path="trust.demoNote" />
        </div>
      </div>
    </div>
  );
}

function AuctionSheet({ v }: { v: Vehicle }) {
  const text = useText();
  type Mark = { code: string; label: string; x: number; y: number };
  const sheetMarks = useContent().trust as { sheet?: { marks?: Record<string, Mark> } } | undefined;
  const first = sheetMarks?.sheet?.marks?.first;
  const second = sheetMarks?.sheet?.marks?.second;
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-surface py-3">
          <Field as="p" className="text-xs text-muted" data-preview-field-path="trust.sheet.overallLabel" />
          <p className="font-display text-2xl font-semibold">{v.auctionGrade ?? "4"}</p>
        </div>
        <div className="rounded-xl bg-surface py-3">
          <Field as="p" className="text-xs text-muted" data-preview-field-path="trust.sheet.interiorLabel" />
          <Field as="p" className="font-display text-2xl font-semibold" data-preview-field-path="trust.sheet.interiorGrade" />
        </div>
        <div className="rounded-xl bg-surface py-3">
          <Field as="p" className="text-xs text-muted" data-preview-field-path="trust.sheet.exteriorLabel" />
          <Field as="p" className="font-display text-2xl font-semibold" data-preview-field-path="trust.sheet.exteriorGrade" />
        </div>
      </div>
      <div className="relative mt-4 aspect-2/1 rounded-xl border border-dashed border-line">
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full text-line" aria-hidden>
          <rect x="40" y="18" width="120" height="64" rx="22" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="70" y="28" width="60" height="44" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {first && (
          <span
            title={first.label}
            className={cn("absolute rounded bg-brand px-1.5 py-0.5 text-[0.65rem] font-bold text-white")}
            style={{ left: `${first.x}%`, top: `${first.y}%` }}
            data-preview-field-path="trust.sheet.marks.first.code"
          >
            {first.code}
          </span>
        )}
        {second && (
          <span
            title={second.label}
            className={cn("absolute rounded bg-brand px-1.5 py-0.5 text-[0.65rem] font-bold text-white")}
            style={{ left: `${second.x}%`, top: `${second.y}%` }}
            data-preview-field-path="trust.sheet.marks.second.code"
          >
            {second.code}
          </span>
        )}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <Field as="dt" className="text-muted" data-preview-field-path="trust.sheet.mileageLabel" />
          <dd className="font-medium" data-num data-preview-static="The car's mileage, shown above">
            {num(v.mileageKm)} {text("common.units.km")}
          </dd>
        </div>
        <div className="flex justify-between">
          <Field as="dt" className="text-muted" data-preview-field-path="trust.sheet.marksLabel" />
          <Field as="dd" className="font-medium" data-preview-field-path="trust.sheet.marksValue" />
        </div>
        <div className="flex justify-between">
          <Field as="dt" className="text-muted" data-preview-field-path="trust.sheet.translationLabel" />
          <Field as="dd" className="font-medium" data-preview-field-path="trust.sheet.translationValue" />
        </div>
      </dl>
    </div>
  );
}

function GenericDoc({ doc, v }: { doc: VehicleDocument; v: Vehicle }) {
  return (
    <div className="space-y-3 text-sm">
      <p data-preview-static="The document note, editable on the car's document list">{doc.note}.</p>
      <div className="rounded-xl bg-surface p-4">
        <Field as="p" className="text-xs text-muted" data-preview-field-path="trust.docVehicleLabel" />
        <p className="font-semibold" data-preview-static="The car's own make, model and year, editable on the listing">
          {v.make} {v.model} {v.grade} · {v.yom}
        </p>
        <Field as="p" className="mt-2 text-xs text-muted" data-preview-field-path="trust.docChassisLabel" />
        <FillField as="p" className="font-mono text-sm" data-preview-field-path="trust.docChassisValue" vars={{ id: v.id.toUpperCase() }} />
      </div>
    </div>
  );
}
