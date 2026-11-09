"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/config/site";
import { Field, fill, useText } from "@/lib/site-data";

/** Google Maps iframe is ~1 MB of scripts, so it only loads on request. Wording is editable (`contact.map`). */
export function MapEmbed() {
  const text = useText();
  const [load, setLoad] = useState(false);
  return (
    <div className="relative min-h-105 overflow-hidden rounded-[1.75rem] bg-surface lg:min-h-full">
      {load ? (
        <iframe
          title={fill(text("contact.map.iframeTitle"), { name: site.name })}
          src={text("common.business.mapEmbedUrl") || site.mapEmbed}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <Photo
            id={text("contact.map.image")}
            alt={text("contact.map.imageAlt")}
            fill
            sizes="(min-width:1024px) 55vw, 100vw"
            className="object-cover"
            data-preview-field-path="contact.map.image"
          />
          <div className="absolute inset-0 bg-night/35" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-paper p-5">
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4" />{" "}
              <span>
                <Field data-preview-field-path="common.business.addressLine1" />, <Field data-preview-field-path="common.business.city" />
              </span>
            </p>
            <Field as="p" className="mt-1 text-sm text-muted" data-preview-field-path="contact.map.directions" />
            <Field
              as="button"
              type="button"
              onClick={() => setLoad(true)}
              className="btn-ink mt-4 h-11"
              data-preview-field-path="contact.map.button"
            />
          </div>
        </>
      )}
    </div>
  );
}
