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
import { Field, FillField, fill, useText } from "@/lib/site-data";
import { vehicleIndex } from "@/data/vehicles";
import { SaveButton } from "./SaveButton";
import { StatusBadge } from "./Badges";
import { Success } from "@/components/forms/shared";

/**
 * Sticky price card (desktop) + bottom price bar (mobile/tablet) + demo reservation sheet.
 * Wording and the deposit amount are editable in Fivora (site-data.json `carActions`).
 */
export function DetailActions({ v, placement = "aside" }: { v: Vehicle; placement?: "aside" | "inline" }) {
  const text = useText();
  const pushRecent = useApp((s) => s.pushRecent);
  const [reserve, setReserve] = useState(false);
  const title = vehicleTitle(v);
  const i = vehicleIndex(v);
  const sold = v.status === "sold";
  const deposit = rs(Number(text("carActions.depositAmount")) || 100_000);
  const bookHref = `${text("carActions.bookHref") || "/book"}?car=${v.slug}`;
  const wa = whatsappLink(fill(text("carActions.whatsappMessage"), { car: title, price: rs(v.priceLkr), url: `${site.url}/cars/${v.slug}` }));

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
            {v.status !== "available" && (
              <StatusBadge status={v.status} className="mb-3" data-preview-field-path={`vehicles[${i}].status`} />
            )}
            {!!v.previousPriceLkr && (
              <Field
                as="p"
                className="text-sm text-muted line-through"
                data-num
                data-preview-field-path={`vehicles[${i}].previousPriceLkr`}
                format={(p) => rs(Number(p))}
              />
            )}
            <Field
              as="p"
              className="font-display text-[2rem] leading-none font-semibold"
              data-num
              data-preview-field-path={`vehicles[${i}].priceLkr`}
              format={(p) => rs(Number(p))}
            />
            <Field
              as="p"
              className="mt-1.5 text-sm text-muted"
              data-num
              data-preview-field-path="carActions.lakhsSuffix"
              format={(t) => fill(t, { lakhs: lakhs(v.priceLkr) })}
            />
          </div>
          <SaveButton id={v.id} label={title} className="border border-line" />
        </div>
        {!sold && (
          <a
            href={text("carActions.leasingAnchor") || "#leasing"}
            className="mt-4 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm transition-colors hover:bg-line"
            data-preview-field-path="carActions.leasingAnchor"
          >
            <Field className="text-muted-strong" data-preview-field-path="carActions.leasingFrom" />
            <Field
              className="font-semibold"
              data-num
              data-preview-field-path="carActions.leasingFromValue"
              format={(t) => fill(t, { amount: rs(monthlyFrom(v)) })}
            />
          </a>
        )}

        <div className="mt-5 grid gap-2.5">
          {sold ? (
            <Link href={`/cars?body=${v.bodyType}`} className="btn-ink" data-preview-field-path={`vehicles[${i}].bodyType`}>
              <Field data-preview-field-path="carActions.similarLabel" />
            </Link>
          ) : (
            <>
              <Link href={bookHref} className="btn-ink" data-preview-field-path="carActions.bookHref">
                <CalendarCheck className="size-4" /> <Field data-preview-field-path="carActions.bookLabel" />
              </Link>
              <a href={wa} target="_blank" rel="noopener" className="btn-line" data-preview-field-path="carActions.whatsappMessage">
                <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="carActions.whatsappLabel" />
              </a>
              {v.status !== "reserved" && (
                <button
                  type="button"
                  onClick={() => setReserve(true)}
                  className="btn-pill btn-text text-ink hover:bg-surface"
                  data-preview-field-path="carActions.reserveLabel"
                >
                  <Lock className="size-4" /> {fill(text("carActions.reserveLabel"), { deposit })}
                </button>
              )}
            </>
          )}
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <Phone className="size-3.5" />
          <Field as="a" data-preview-field-path="common.business.phone" href={site.phoneHref} className="hover:text-ink" data-num />
          <span>
            · <Field data-preview-field-path="common.business.hoursShort" />
          </span>
        </p>
      </div>

      {/* mobile sticky price bar */}
      {!sold && placement === "aside" && (
        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pt-3 pb-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1 leading-tight">
              <Field
                as="p"
                className="font-display text-lg font-semibold"
                data-num
                data-preview-field-path={`vehicles[${i}].priceLkr`}
                format={(p) => rs(Number(p))}
              />
              <Field
                as="p"
                className="text-xs text-muted"
                data-num
                data-preview-field-path="common.vehicleCard.monthlyFrom"
                format={(t) => fill(t, { amount: rs(monthlyFrom(v)) })}
              />
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              aria-label={text("carActions.whatsappLabel")}
              className="flex size-12 items-center justify-center rounded-full border border-line"
              data-preview-field-path="carActions.whatsappLabel"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <Link href={bookHref} className="btn-ink h-12 px-5" data-preview-field-path="carActions.bookHref">
              <Field data-preview-field-path="carActions.bookShort" />
            </Link>
          </div>
        </div>
      )}

      {reserve && <ReserveSheet v={v} deposit={deposit} onClose={() => setReserve(false)} />}
    </>
  );
}

function ReserveSheet({ v, deposit, onClose }: { v: Vehicle; deposit: string; onClose: () => void }) {
  const text = useText();
  const addLead = useApp((s) => s.addLead);
  const [method, setMethod] = useState<"card" | "lankaqr" | "bank">("card");
  const methods = [
    { key: "card", label: <Field data-preview-field-path="carActions.reserve.methodLabels.card" /> },
    { key: "lankaqr", label: <Field data-preview-field-path="carActions.reserve.methodLabels.lankaqr" /> },
    { key: "bank", label: <Field data-preview-field-path="carActions.reserve.methodLabels.bank" /> },
  ] as const;
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-title"
      className="fixed inset-0 z-80 flex items-end justify-center bg-night/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-md animate-fade-up rounded-t-[1.75rem] bg-paper sm:rounded-[1.75rem]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <FillField as="p" id="reserve-title" className="font-semibold" data-preview-field-path="carActions.reserve.title" vars={{ car: vehicleTitle(v) }} />
          <button
            type="button"
            onClick={onClose}
            aria-label={text("carActions.reserve.closeLabel")}
            data-preview-field-path="carActions.reserve.closeLabel"
            className="flex size-10 items-center justify-center rounded-full bg-surface"
          >
            <X className="size-4" />
          </button>
        </div>
        {done ? (
          <Success
            title={<Field data-preview-field-path="carActions.reserve.successTitle" />}
            text={<Field data-preview-field-path="carActions.reserve.successText" />}
          >
            <Field as="button" type="button" onClick={onClose} className="btn-ink" data-preview-field-path="carActions.reserve.doneLabel" />
          </Success>
        ) : (
          <div className="space-y-5 p-5">
            <div className="flex justify-between rounded-2xl bg-surface p-4 text-sm">
              <Field className="text-muted-strong" data-preview-field-path="carActions.reserve.depositLabel" />
              <span className="font-display text-lg font-semibold" data-preview-field-path="carActions.depositAmount">
                {deposit}
              </span>
            </div>
            <fieldset>
              <Field as="legend" className="field-label" data-preview-field-path="carActions.reserve.payWith" />
              <div className="grid grid-cols-3 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    aria-pressed={method === m.key}
                    onClick={() => setMethod(m.key)}
                    className={`h-12 rounded-xl border text-sm font-medium transition-colors ${method === m.key ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink/40"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <Field as="p" className="text-xs leading-relaxed text-muted" data-preview-field-path="carActions.reserve.gatewayNote" />
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                window.setTimeout(() => {
                  addLead({ type: "reservation", name: text("carActions.reserve.leadName"), phone: "—", vehicle: vehicleTitle(v) });
                  setDone(true);
                }, 900);
              }}
              className="btn-ink w-full"
              data-preview-field-path="carActions.reserve.submit"
            >
              {busy ? <span className="loading loading-spinner loading-sm" /> : text("carActions.reserve.submit")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
