"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useApp } from "@/store";
import { whatsappLink } from "@/config/site";
import { Consent, DemoNote, Field, Success, inputCls, validPhone } from "./shared";

export function EnquiryForm({ vehicle }: { vehicle: string }) {
  const addLead = useApp((s) => s.addLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi, is the ${vehicle} still available? I'd like to know more.`);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (name.trim().length < 2) er.name = "Please enter your name.";
    if (!validPhone(phone)) er.phone = "Enter a Sri Lankan number, e.g. 077 123 4567.";
    if (!consent) er.consent = "Please tick to continue.";
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "enquiry", name, phone, vehicle, message });
    setSent(true);
  };

  if (sent)
    return (
      <Success title="Thanks, we've got it" text={`A salesperson will call you about the ${vehicle}, usually within 10 minutes during opening hours.`}>
        <a href={whatsappLink(message)} target="_blank" rel="noopener" className="btn-line">
          <WhatsAppIcon className="size-4" /> Faster on WhatsApp
        </a>
      </Success>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" id="eq-name" error={errors.name}>
          <input id="eq-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Mobile number" id="eq-phone" error={errors.phone}>
          <input
            id="eq-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="077 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls(errors.phone)}
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>
      <Field label="Message" id="eq-msg">
        <textarea
          id="eq-msg"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea w-full rounded-xl border-line bg-paper py-3 text-[16px]"
        />
      </Field>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-ink">
          Send enquiry
        </button>
        <DemoNote />
      </div>
    </form>
  );
}
