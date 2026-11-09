"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck, Lock, Phone, X } from "lucide-react";
import type { Vehicle } from "@/types";
import { WhatsAppIcon } from "@/components/ui/icons";
import { site, whatsappLink } from "@/config/site";
import { lakhs, rs, vehicleTitle } from "@/lib/format";
import { monthlyFrom } from "@/lib/estimate";
import { useApp } from "@/store";
import { SaveButton } from "./SaveButton";
import { StatusBadge } from "./Badges";
import { Success } from "@/components/forms/shared";

/** Sticky price card (desktop) + bottom price bar (mobile/tablet) + demo reservation sheet. */
export function DetailActions({ v, placement = "aside" }: { v: Vehicle; placement?: "aside" | "inline" }) {
  const pushRecent = useApp((s) => s.pushRecent);
  const [reserve, setReserve] = useState(false);
  const title = vehicleTitle(v);
  const sold = v.status === "sold";
  const wa = whatsappLink(`Hi Drivora, I'm interested in the ${title} (${rs(v.priceLkr)}). ${site.url}/cars/${v.slug}`);

  useEffect(() => {
    if (placement === "aside") pushRecent(v.id);
  }, [v.id, pushRecent, placement]);

  return (
    <>
      <div
        className={`rounded-3xl border border-line bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(14,17,22,0.5)] md:p-6 ${placement === "aside" ? "hidden lg:block" : "lg:hidden"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            {v.status !== "available" && <StatusBadge status={v.status} className="mb-3" />}
            {v.previousPriceLkr && (
              <p className="text-sm text-muted line-through" data-num>
                {rs(v.previousPriceLkr)}
              </p>
            )}
            <p className="font-display text-[2rem] leading-none font-semibold" data-num>
              {rs(v.priceLkr)}
            </p>
            <p className="mt-1.5 text-sm text-muted" data-num>
              {lakhs(v.priceLkr)} · all duties paid
            </p>
          </div>
          <SaveButton id={v.id} label={title} className="border border-line" />
        </div>
        {!sold && (
          <a href="#leasing" className="mt-4 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm transition-colors hover:bg-line">
            <span className="text-muted-strong">Leasing from</span>
            <span className="font-semibold" data-num>
              {rs(monthlyFrom(v))}/month*
            </span>
          </a>
        )}

        <div className="mt-5 grid gap-2.5">
          {sold ? (
            <Link href={`/cars?body=${v.bodyType}`} className="btn-ink">
              See similar cars
            </Link>
          ) : (
            <>
              <Link href={`/book?car=${v.slug}`} className="btn-ink">
                <CalendarCheck className="size-4" /> Book a test drive
              </Link>
              <a href={wa} target="_blank" rel="noopener" className="btn-line">
                <WhatsAppIcon className="size-4" /> Ask on WhatsApp
              </a>
              {v.status !== "reserved" && (
                <button type="button" onClick={() => setReserve(true)} className="btn-pill btn-text text-ink hover:bg-surface">
                  <Lock className="size-4" /> Reserve for Rs 100,000
                </button>
              )}
            </>
          )}
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <Phone className="size-3.5" />
          <a href={site.phoneHref} className="hover:text-ink" data-num>
            {site.phone}
          </a>
          · {site.hoursShort}
        </p>
      </div>

      {/* mobile sticky price bar */}
      {!sold && placement === "aside" && (
        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pt-3 pb-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-display text-lg font-semibold" data-num>
                {rs(v.priceLkr)}
              </p>
              <p className="text-xs text-muted" data-num>
                from {rs(monthlyFrom(v))}/mo*
              </p>
            </div>
            <a href={wa} target="_blank" rel="noopener" aria-label="Ask on WhatsApp" className="flex size-12 items-center justify-center rounded-full border border-line">
              <WhatsAppIcon className="size-5" />
            </a>
            <Link href={`/book?car=${v.slug}`} className="btn-ink h-12 px-5">
              Test drive
            </Link>
          </div>
        </div>
      )}

      {reserve && <ReserveSheet v={v} onClose={() => setReserve(false)} />}
    </>
  );
}

function ReserveSheet({ v, onClose }: { v: Vehicle; onClose: () => void }) {
  const addLead = useApp((s) => s.addLead);
  const [method, setMethod] = useState<"card" | "lankaqr" | "bank">("card");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Reserve this car" className="fixed inset-0 z-80 flex items-end justify-center bg-night/50 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md animate-fade-up rounded-t-[1.75rem] bg-paper sm:rounded-[1.75rem]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-semibold">Reserve {vehicleTitle(v)}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-10 items-center justify-center rounded-full bg-surface">
            <X className="size-4" />
          </button>
        </div>
        {done ? (
          <Success title="Reserved for 5 days" text="We'll hold the car while your finance is approved. The deposit is fully refundable if the lender says no.">
            <button type="button" onClick={onClose} className="btn-ink">
              Done
            </button>
          </Success>
        ) : (
          <div className="space-y-5 p-5">
            <div className="flex justify-between rounded-2xl bg-surface p-4 text-sm">
              <span className="text-muted-strong">Refundable deposit</span>
              <span className="font-display text-lg font-semibold">Rs 100,000</span>
            </div>
            <fieldset>
              <legend className="field-label">Pay with</legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["card", "Card"],
                    ["lankaqr", "LANKAQR"],
                    ["bank", "Bank transfer"],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={method === k}
                    onClick={() => setMethod(k)}
                    className={`h-12 rounded-xl border text-sm font-medium transition-colors ${method === k ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink/40"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="text-xs leading-relaxed text-muted">
              On the live site this opens a Central Bank–approved payment gateway (e.g. PayHere). This demo does not take any payment.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                window.setTimeout(() => {
                  addLead({ type: "reservation", name: "Website visitor", phone: "—", vehicle: vehicleTitle(v) });
                  setDone(true);
                }, 900);
              }}
              className="btn-ink w-full"
            >
              {busy ? <span className="loading loading-spinner loading-sm" /> : "Simulate payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
