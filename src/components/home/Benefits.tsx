"use client";

import { ContentIcon } from "@/components/ui/ContentIcon";
import { Field, useList } from "@/lib/site-data";

type Item = { icon: string; title: string; text: string };

/* Editable in Fivora: site-data.json `home.benefits.items` (icon is chosen by name). */
export function Benefits() {
  const items = useList<Item>("home.benefits.items");
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:divide-x lg:divide-line" data-preview-list-path="home.benefits.items">
      {items.map((item, i) => (
        <li
          key={`${item.title}-${i}`}
          data-reveal
          data-preview-item-path={`home.benefits.items[${i}]`}
          style={{ ["--reveal-i" as string]: i }}
          className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4 lg:px-6 lg:first:pl-0"
        >
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink"
            data-preview-field-path={`home.benefits.items[${i}].icon`}
          >
            <ContentIcon name={item.icon} className="size-5" strokeWidth={1.4} />
          </span>
          <div>
            <Field as="h3" className="font-sans text-[0.92rem] font-semibold" data-preview-field-path={`home.benefits.items[${i}].title`} />
            <Field as="p" className="mt-1 text-[0.85rem] leading-snug text-muted" data-preview-field-path={`home.benefits.items[${i}].text`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
