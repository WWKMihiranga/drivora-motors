"use client";

import { ContentIcon } from "@/components/ui/ContentIcon";
import { Field, useList } from "@/lib/site-data";

/* Why-sell-to-us points, read live so list edits show instantly in the Fivora editor. */
export function SellPoints() {
  const points = useList<{ icon: string; title: string; text: string }>("sell.points");
  return (
        <aside className="space-y-6" data-preview-list-path="sell.points">
          {points.map((p, i) => (
            <div key={`${p.title}-${i}`} className="flex gap-4" data-preview-item-path={`sell.points[${i}]`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line" data-preview-field-path={`sell.points[${i}].icon`}>
                <ContentIcon name={p.icon} className="size-5" strokeWidth={1.4} />
              </span>
              <div>
                <Field as="p" className="text-sm font-semibold" data-preview-field-path={`sell.points[${i}].title`} />
                <Field as="p" className="mt-1 text-sm text-muted" data-preview-field-path={`sell.points[${i}].text`} />
              </div>
            </div>
          ))}
        </aside>
  );
}
