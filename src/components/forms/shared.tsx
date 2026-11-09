"use client";

import Link from "next/link";
import { Lottie } from "@/components/ui/Lottie";
import { cn } from "@/lib/cn";

/** Sri Lankan mobile/landline: 07XXXXXXXX, 0XXXXXXXXX or +94XXXXXXXXX (spaces allowed). */
export function validPhone(v: string) {
  const d = v.replace(/[\s-]/g, "");
  return /^(?:\+94|0)\d{9}$/.test(d);
}

export function Field({
  label,
  id,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
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
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-bad">
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
          I agree that Drivora may contact me about this request and store my details as described in the{" "}
          <Link href="/faq" className="underline underline-offset-2">
            privacy notice
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs font-medium text-bad">{error}</p>}
    </div>
  );
}

export function DemoNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted", className)}>
      Demo form: your details stay in this browser and are not sent anywhere.
    </p>
  );
}

export function Success({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center" role="status">
      <Lottie src="/lottie/success.json" className="size-28" label="Done" />
      <h3 className="mt-2 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{text}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

export const inputCls = (err?: string) => cn("field", err && "border-bad");
