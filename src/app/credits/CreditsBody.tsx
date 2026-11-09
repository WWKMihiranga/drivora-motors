"use client";

import { Field, useList } from "@/lib/site-data";

type Section = { title: string; text: string; linkLabel: string; linkHref: string; textAfter: string };

/* Credits sections, read live so list edits show instantly in the Fivora editor. */
export function CreditsBody() {
  const sections = useList<Section>("credits.sections");
  return (
      <section
        className="container-x max-w-3xl space-y-8 py-12 leading-relaxed text-muted-strong md:py-16"
        data-preview-list-path="credits.sections"
      >
        {sections.map((s, i) => (
          <div key={`${s.title}-${i}`} data-preview-item-path={`credits.sections[${i}]`}>
            <Field as="h2" className="font-display text-xl font-semibold text-ink" data-preview-field-path={`credits.sections[${i}].title`} />
            <p className="mt-2">
              <Field data-preview-field-path={`credits.sections[${i}].text`} />
              {s.linkLabel && (
                <>
                  {" "}
                  <a
                    href={s.linkHref}
                    className="underline underline-offset-2"
                    rel="noopener"
                    target="_blank"
                    data-preview-field-path={`credits.sections[${i}].linkHref`}
                  >
                    <Field data-preview-field-path={`credits.sections[${i}].linkLabel`} />
                  </a>{" "}
                  <Field data-preview-field-path={`credits.sections[${i}].textAfter`} />
                </>
              )}
            </p>
          </div>
        ))}
      </section>
  );
}
