"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { IMG } from "@/lib/unsplash";
import { site } from "@/config/site";

/** Google Maps iframe is ~1 MB of scripts, so it only loads on request. */
export function MapEmbed() {
  const [load, setLoad] = useState(false);
  return (
    <div className="relative min-h-105 overflow-hidden rounded-[1.75rem] bg-surface lg:min-h-full">
      {load ? (
        <iframe
          title={`Map to ${site.name}`}
          src={site.mapEmbed}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <Photo id={IMG.colombo} alt="Colombo skyline with the Lotus Tower" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-night/35" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-paper p-5">
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4" /> {site.address.line1}, {site.address.city}
            </p>
            <p className="mt-1 text-sm text-muted">Five minutes from Nugegoda junction, opposite the bus depot.</p>
            <button type="button" onClick={() => setLoad(true)} className="btn-ink mt-4 h-11">
              Show map
            </button>
          </div>
        </>
      )}
    </div>
  );
}
