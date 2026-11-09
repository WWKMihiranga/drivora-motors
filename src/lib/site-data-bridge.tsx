"use client";

/*
 * Loaded ONLY inside the Fivora visual editor (the site runs in an iframe there); see site-data.tsx.
 * DENEB's official SiteDataProvider receives the editor's live edits (FIVORA_PREVIEW_SITE_DATA) and
 * announces readiness (FIVORA_PREVIEW_READY). We relay its live data into our own context.
 */
import { useEffect, type ReactNode } from "react";
import { SiteDataProvider, useSiteData } from "@deneb-ui/ui";
import siteData from "@/data/site-data.json";

function Relay({ onData, children }: { onData: (content: unknown) => void; children: ReactNode }) {
  const live = useSiteData();
  useEffect(() => onData(live?.content), [live, onData]);
  return <>{children}</>;
}

export default function Bridge({ onData, children }: { onData: (content: unknown) => void; children: ReactNode }) {
  return (
    <SiteDataProvider initialSiteData={siteData}>
      <Relay onData={onData}>{children}</Relay>
    </SiteDataProvider>
  );
}
