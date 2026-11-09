"use client";

import { Lottie } from "@/components/ui/Lottie";
import { LinkField } from "@/components/ui/LinkField";
import { Field } from "@/lib/site-data";
import { cn } from "@/lib/cn";

/** Sri Lankan mobile/landline: 07XXXXXXXX, 0XXXXXXXXX or +94XXXXXXXXX (spaces allowed). */
export function validPhone(v: string) {
  const d = v.replace(/[\s-]/g, "");
  return /^(?:\+94|0)\d{9}$/.test(d);
}

/* Form building blocks. Labels are passed as <Field> nodes so their wording is editable in Fivora. */
export function FormField({
  label,
  id,
  error,
  hint,
  children,
  className,
}: {
  label: React.ReactNode;
  id: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-bad" data-preview-static="Validation message shown after a failed submit">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-muted-strong">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox checkbox-sm checkbox-primary mt-0.5 rounded-[5px]"
          aria-invalid={!!error}
        />
        <span>
          <Field data-preview-field-path="forms.common.consentText" />{" "}
          <LinkField data-preview-field-path="forms.common.privacyHref" className="underline underline-offset-2">
            <Field data-preview-field-path="forms.common.privacyLabel" />
          </LinkField>
          .
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-bad" data-preview-static="Validation message shown after a failed submit">
          {error}
        </p>
      )}
    </div>
  );
}

export function DemoNote({ className }: { className?: string }) {
  return <Field as="p" className={cn("text-xs text-muted", className)} data-preview-field-path="forms.common.demoNote" />;
}

export function Success({
  title,
  text,
  children,
}: {
  title: React.ReactNode;
  text: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center" role="status">
      <Lottie
        src="/lottie/success.json"
        className="size-28"
        labelId="form-success-anim"
        label={<Field id="form-success-anim" className="sr-only" data-preview-field-path="forms.common.successAnimationLabel" />}
      />
      <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{text}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

export const inputCls = (err?: string) => cn("field", err && "border-bad");
