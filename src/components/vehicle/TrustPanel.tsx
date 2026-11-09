"use client";

import { useState } from "react";
import { BadgeCheck, FileText, Gauge, ScrollText, ShieldCheck, X } from "lucide-react";
import type { Vehicle, VehicleDocument } from "@/types";
import { num } from "@/lib/format";
import { cn } from "@/lib/cn";

const icons = { "auction-sheet": ScrollText, inspection: ShieldCheck, service: FileText, cr: FileText } as const;

const mileageSourceLabel = {
  "auction-sheet": "Japanese auction sheet",
  "service-log": "Stamped service history",
  odometer: "Odometer photo at intake",
  new: "Brand new, zero kilometres",
} as const;

export function TrustPanel({ v }: { v: Vehicle }) {
  const [doc, setDoc] = useState<VehicleDocument | null>(null);
  return (
    <div className="rounded-3xl border border-line p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Trust & paperwork</p>
          <h2 className="mt-2 font-display text-xl font-semibold md:text-2xl">What we checked on this car</h2>
        </div>
        {v.verified && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-3 py-1.5 text-sm font-semibold text-ok">
            <BadgeCheck className="size-4" /> Documents verified
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl bg-surface p-5">
          <Gauge className="size-6 text-ink" strokeWidth={1.4} />
          <p className="mt-3 text-sm text-muted-strong">Mileage</p>
          <p className="font-display text-3xl font-light tracking-tight" data-num>
            {num(v.mileageKm)} <span className="text-base text-muted">km</span>
          </p>
          <p className="mt-2 text-sm">
            Source: <strong className="font-semibold">{mileageSourceLabel[v.mileageSource]}</strong>
          </p>
          {v.auctionGrade && (
            <p className="mt-1 text-sm">
              Auction grade: <strong className="font-semibold">{v.auctionGrade}</strong>
            </p>
          )}
          {v.owners && (
            <p className="mt-1 text-sm">
              Previous owners: <strong className="font-semibold">{v.owners}</strong>
            </p>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted">
            We record our own odometer reading at handover, so you can check the two match.
          </p>
        </div>

        <ul className="divide-y divide-line rounded-2xl border border-line">
          {v.documents.map((d) => {
            const Icon = icons[d.type];
            return (
              <li key={d.label} className="flex items-center gap-4 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface">
                  <Icon className="size-[1.1rem]" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{d.label}</p>
                  <p className="text-xs leading-snug text-muted">{d.note}</p>
                </div>
                <button type="button" onClick={() => setDoc(d)} className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold hover:border-ink">
                  View
                </button>
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
  return (
    <div role="dialog" aria-modal="true" aria-label={doc.label} className="fixed inset-0 z-80 flex items-end justify-center bg-night/50 p-3 sm:items-center" onClick={onClose}>
      <div className="max-h-[90dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-3xl bg-paper" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-semibold">{doc.label}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-10 items-center justify-center rounded-full bg-surface">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">
          {doc.type === "auction-sheet" ? <AuctionSheet v={v} /> : <GenericDoc doc={doc} v={v} />}
          <p className="mt-4 text-xs text-muted">
            Demo preview. On a live site this opens the scanned original, with personal details masked.
          </p>
        </div>
      </div>
    </div>
  );
}

function AuctionSheet({ v }: { v: Vehicle }) {
  const marks: [string, string, string][] = [
    ["A1", "left-[18%] top-[30%]", "Tiny scratch, front bumper"],
    ["U1", "left-[62%] top-[64%]", "Small dent, rear door"],
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Overall", v.auctionGrade ?? "4"],
          ["Interior", "B"],
          ["Exterior", "B"],
        ].map(([k, val]) => (
          <div key={k} className="rounded-xl bg-surface py-3">
            <p className="text-xs text-muted">{k}</p>
            <p className="font-display text-2xl font-semibold">{val}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-4 aspect-2/1 rounded-xl border border-dashed border-line">
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full text-line" aria-hidden>
          <rect x="40" y="18" width="120" height="64" rx="22" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="70" y="28" width="60" height="44" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {marks.map(([code, pos, label]) => (
          <span key={code} title={label} className={cn("absolute rounded bg-brand px-1.5 py-0.5 text-[0.65rem] font-bold text-white", pos)}>
            {code}
          </span>
        ))}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Mileage at auction</dt>
          <dd className="font-medium" data-num>
            {num(v.mileageKm)} km
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Marks</dt>
          <dd className="font-medium">A1 front bumper · U1 rear door</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Translation</dt>
          <dd className="font-medium">English, by Drivora</dd>
        </div>
      </dl>
    </div>
  );
}

function GenericDoc({ doc, v }: { doc: VehicleDocument; v: Vehicle }) {
  return (
    <div className="space-y-3 text-sm">
      <p>{doc.note}.</p>
      <div className="rounded-xl bg-surface p-4">
        <p className="text-xs text-muted">Vehicle</p>
        <p className="font-semibold">
          {v.make} {v.model} {v.grade} · {v.yom}
        </p>
        <p className="mt-2 text-xs text-muted">Chassis no.</p>
        <p className="font-mono text-sm">•••• •••• {v.id.toUpperCase()}7 (masked)</p>
      </div>
    </div>
  );
}
