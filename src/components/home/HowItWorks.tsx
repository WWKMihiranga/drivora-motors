"use client";

import { ContentIcon } from "@/components/ui/ContentIcon";
import { SteeringIcon } from "@/components/ui/icons";
import { Field, useList } from "@/lib/site-data";

type Step = { icon: string; title: string; text: string };

/* Editable in Fivora: site-data.json `home.how.steps`. "car" shows the steering-wheel icon. */
export function HowItWorks() {
  const steps = useList<Step>("home.how.steps");
  return (
    <ol className="relative grid gap-8 md:grid-cols-5 md:gap-5" data-preview-list-path="home.how.steps">
      {/* connecting line */}
      <span aria-hidden className="absolute top-5.5 right-[10%] left-[10%] hidden h-px bg-line md:block" />
      <span aria-hidden className="absolute top-0 bottom-0 left-5.25 w-px bg-line md:hidden" />
      {steps.map((step, i) => (
        <li
          key={`${step.title}-${i}`}
          data-reveal
          data-preview-item-path={`home.how.steps[${i}]`}
          style={{ ["--reveal-i" as string]: i }}
          className="relative grid grid-cols-[44px_1fr] gap-4 md:block"
        >
          <span
            className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink md:mx-0"
            data-preview-field-path={`home.how.steps[${i}].icon`}
          >
            {step.icon === "car" ? (
              <SteeringIcon className="size-5" strokeWidth={1.4} />
            ) : (
              <ContentIcon name={step.icon} className="size-5" strokeWidth={1.4} />
            )}
          </span>
          <div className="md:mt-5">
            <p className="font-display text-xs font-semibold text-brand" data-num>
              {String(i + 1).padStart(2, "0")}
            </p>
            <Field as="h3" className="mt-1 font-sans text-[0.98rem] font-semibold" data-preview-field-path={`home.how.steps[${i}].title`} />
            <Field as="p" className="mt-1.5 text-[0.88rem] leading-relaxed text-muted" data-preview-field-path={`home.how.steps[${i}].text`} />
          </div>
        </li>
      ))}
    </ol>
  );
}
