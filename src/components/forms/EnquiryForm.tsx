"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useApp } from "@/store";
import { whatsappLink } from "@/config/site";
import { Field, FillField, fill, useText } from "@/lib/site-data";
import { Consent, DemoNote, FormField, Success, inputCls, validPhone } from "./shared";

/* Wording is editable in Fivora (site-data.json `forms.enquiry` and `forms.common`). */
export function EnquiryForm({ vehicle }: { vehicle: string }) {
  const text = useText();
  const addLead = useApp((s) => s.addLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(() => fill(text("forms.enquiry.defaultMessage"), { vehicle }));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (name.trim().length < 2) er.name = text("forms.common.errorName");
    if (!validPhone(phone)) er.phone = text("forms.common.errorPhone");
    if (!consent) er.consent = text("forms.common.errorConsent");
    setErrors(er);
    if (Object.keys(er).length) return;
    addLead({ type: "enquiry", name, phone, vehicle, message });
    setSent(true);
  };

  if (sent)
    return (
      <Success
        title={<Field data-preview-field-path="forms.enquiry.successTitle" />}
        text={<FillField data-preview-field-path="forms.enquiry.successText" vars={{ vehicle }} />}
      >
        <a href={whatsappLink(message)} target="_blank" rel="noopener" className="btn-line" data-preview-field-path="common.business.whatsapp">
          <WhatsAppIcon className="size-4" /> <Field data-preview-field-path="forms.enquiry.whatsappLabel" />
        </a>
      </Success>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={<Field data-preview-field-path="forms.common.nameLabel" />} id="eq-name" error={errors.name}>
          <input id="eq-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} aria-invalid={!!errors.name} />
        </FormField>
        <FormField label={<Field data-preview-field-path="forms.common.phoneLabel" />} id="eq-phone" error={errors.phone}>
          <input
            id="eq-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={text("forms.common.phonePlaceholder")}
            data-preview-field-path="forms.common.phonePlaceholder"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls(errors.phone)}
            aria-invalid={!!errors.phone}
          />
        </FormField>
      </div>
      <FormField label={<Field data-preview-field-path="forms.enquiry.messageLabel" />} id="eq-msg">
        <textarea
          id="eq-msg"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea w-full rounded-xl border-line bg-paper py-3 text-[16px]"
          data-preview-field-path="forms.enquiry.defaultMessage"
        />
      </FormField>
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Field as="button" type="submit" className="btn-ink" data-preview-field-path="forms.enquiry.submit" />
        <DemoNote />
      </div>
    </form>
  );
}
