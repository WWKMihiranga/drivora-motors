"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart3, Car, Clock3, Inbox, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { vehicles, vehicleIndex } from "@/data/vehicles";
import { seedLeads } from "@/data/content";
import { useApp, useHydrated } from "@/store";
import { Photo } from "@/components/ui/Photo";
import { LogoMark } from "@/components/ui/Logo";
import { StatusBadge } from "@/components/vehicle/Badges";
import { rsM, vehicleTitle } from "@/lib/format";
import { Field, fill, useList, useText } from "@/lib/site-data";
import type { Lead } from "@/types";
import { cn } from "@/lib/cn";

type Row = Lead & { ago: string };
type Tab = "overview" | "stock";
const NAV_ICONS = { dashboard: LayoutDashboard, car: Car, message: MessageSquare, chart: BarChart3, settings: Settings } as const;
const LIVE = "Live figure, counted from leads and stock";
const DEMO_LEAD = "Demo enquiry; real leads come from the site's forms";
const STAGES: { key: Lead["stage"]; label: React.ReactNode }[] = [
  { key: "New", label: <Field data-preview-field-path="admin.stageLabels.new" /> },
  { key: "Contacted", label: <Field data-preview-field-path="admin.stageLabels.contacted" /> },
  { key: "Test drive", label: <Field data-preview-field-path="admin.stageLabels.testDrive" /> },
  { key: "Negotiation", label: <Field data-preview-field-path="admin.stageLabels.negotiation" /> },
  { key: "Won", label: <Field data-preview-field-path="admin.stageLabels.won" /> },
];

/* Demo dealer dashboard. Wording is editable in Fivora (`admin`); demo leads are `leads`. */
export function AdminView() {
  const text = useText();
  const nav = useList<{ icon: string; label: string; tab: string }>("admin.nav");
  const hydrated = useHydrated();
  const stored = useApp((s) => s.leads);
  const [tab, setTab] = useState<Tab>("overview");

  const ago = (hours: number) => {
    if (hours < 1) return text("admin.justNow");
    if (hours < 24) return fill(text("admin.hoursAgo"), { n: Math.round(hours) });
    return fill(text("admin.daysAgo"), { n: Math.round(hours / 24) });
  };

  const leads: Row[] = useMemo(() => {
    const mine = hydrated
      ? stored.map((l) => ({
          ...l,
          ago: fill(text("admin.today"), { time: new Date(l.createdAt).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }) }),
        }))
      : [];
    const seeded = seedLeads.map(({ hoursAgo, ...l }) => ({ ...l, createdAt: 0, ago: ago(hoursAgo) }));
    return [...mine, ...seeded];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored, hydrated, text]);

  const bySource = useMemo(() => {
    const m = new Map<string, number>();
    leads.forEach((l) => m.set(l.source, (m.get(l.source) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [leads]);
  const maxSource = Math.max(1, ...bySource.map(([, n]) => n));
  const inStock = vehicles.filter((v) => v.status !== "sold");
  const avgAge = inStock.length ? Math.round(inStock.reduce((a, v) => a + v.listedDaysAgo, 0) / inStock.length) : 0;
  const drives = leads.filter((l) => l.type === "test-drive").length + (Number(text("admin.kpiDrivesBase")) || 0);

  return (
    <div className="min-h-dvh bg-surface pt-24 lg:grid lg:grid-cols-[240px_1fr] lg:pt-0">
      <aside className="hidden bg-night pt-20 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-6 pt-8 pb-10">
          <LogoMark className="size-7" />
          <Field className="font-display text-sm font-semibold tracking-[0.16em]" data-preview-field-path="admin.brand" />
        </div>
        <nav className="flex-1 space-y-1 px-3 text-sm" data-preview-list-path="admin.nav">
          {nav.map((item, n) => {
            const I = NAV_ICONS[item.icon as keyof typeof NAV_ICONS] ?? LayoutDashboard;
            const active = !!item.tab && item.tab === tab;
            return (
              <button
                key={`${item.label}-${n}`}
                type="button"
                onClick={() => item.tab && setTab(item.tab as Tab)}
                data-preview-item-path={`admin.nav[${n}]`}
                className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", active ? "bg-white/10 text-white" : "text-white/60 hover:text-white")}
              >
                <I className="size-4" strokeWidth={1.75} /> <Field data-preview-field-path={`admin.nav[${n}].label`} />
              </button>
            );
          })}
        </nav>
        <Field as="p" className="px-6 pb-8 text-xs text-white/40" data-preview-field-path="admin.sidebarNote" />
      </aside>

      <div className="min-w-0 px-4 pb-16 md:px-8 lg:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Field as="p" className="eyebrow" data-preview-field-path="admin.eyebrow" />
            <Field as="h1" className="mt-2 font-display text-3xl font-semibold" data-preview-field-path="admin.greeting" />
          </div>
          <div className="flex rounded-full border border-line bg-paper p-1 text-sm lg:hidden">
            <Field
              as="button"
              type="button"
              onClick={() => setTab("overview")}
              className={cn("h-9 rounded-full px-4 capitalize", tab === "overview" ? "bg-ink text-on-ink" : "text-muted")}
              data-preview-field-path="admin.tabOverview"
            />
            <Field
              as="button"
              type="button"
              onClick={() => setTab("stock")}
              className={cn("h-9 rounded-full px-4 capitalize", tab === "stock" ? "bg-ink text-on-ink" : "text-muted")}
              data-preview-field-path="admin.tabStock"
            />
          </div>
        </div>

        {tab === "overview" ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <Kpi icon={Inbox} k={<Field data-preview-field-path="admin.kpiLeads" />} d={<Field data-preview-field-path="admin.kpiLeadsDelta" />}>
                <span data-preview-static={LIVE}>{leads.length}</span>
              </Kpi>
              <Kpi icon={Clock3} k={<Field data-preview-field-path="admin.kpiReply" />} d={<Field data-preview-field-path="admin.kpiReplyDelta" />}>
                <Field data-preview-field-path="admin.kpiReplyValue" />
              </Kpi>
              <Kpi icon={Users} k={<Field data-preview-field-path="admin.kpiDrives" />} d={<Field data-preview-field-path="admin.kpiDrivesDelta" />}>
                <span data-preview-static={LIVE}>{drives}</span>
              </Kpi>
              <Kpi
                icon={Car}
                k={<Field data-preview-field-path="admin.kpiStock" />}
                d={<Field data-preview-field-path="admin.kpiStockDelta" format={(t) => fill(t, { days: avgAge })} />}
              >
                <span data-preview-static={LIVE}>{inStock.length}</span>
              </Kpi>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
              <section className="rounded-[1.25rem] bg-paper p-5">
                <Field as="h2" className="font-sans text-sm font-semibold" data-preview-field-path="admin.pipelineTitle" />
                <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                  {STAGES.map((st, n) => {
                    const items = leads.filter((l) => l.stage === st.key);
                    return (
                      <div key={`${st.key}-${n}`} className="w-56 shrink-0 rounded-2xl bg-surface p-3">
                        <p className="flex items-center justify-between px-1 text-xs font-semibold tracking-wide text-muted uppercase">
                          {st.label} <span>{items.length}</span>
                        </p>
                        <ul className="mt-3 space-y-2">
                          {items.slice(0, 4).map((l) => (
                            <li
                              key={l.id}
                              className="rounded-xl bg-paper p-3 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                              data-preview-static={DEMO_LEAD}
                            >
                              <p className="font-medium">{l.name}</p>
                              <p className="truncate text-xs text-muted">{l.vehicle}</p>
                              <p className="mt-2 flex items-center justify-between text-[0.7rem] text-muted">
                                <span className="rounded-full bg-surface px-2 py-0.5">{l.source}</span>
                                {l.ago}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[1.25rem] bg-paper p-5">
                <Field as="h2" className="font-sans text-sm font-semibold" data-preview-field-path="admin.sourcesTitle" />
                <ul className="mt-5 space-y-4">
                  {bySource.map(([s, n]) => (
                    <li key={s}>
                      <div className="flex justify-between text-sm">
                        <span data-preview-static={LIVE}>{s}</span>
                        <span className="font-semibold" data-num>
                          {n}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 rounded-full bg-surface">
                        <div className={cn("h-full rounded-full", s === "Website" ? "bg-brand" : "bg-ink")} style={{ width: `${(n / maxSource) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <Field as="p" className="mt-5 text-xs text-muted" data-preview-field-path="admin.sourcesNote" />
              </section>
            </div>
          </>
        ) : (
          <section className="mt-6 overflow-hidden rounded-[1.25rem] bg-paper">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs tracking-wide text-muted uppercase">
                    <Field as="th" className="px-5 py-3 font-medium" data-preview-field-path="admin.colCar" />
                    <Field as="th" className="px-3 py-3 font-medium" data-preview-field-path="admin.colPrice" />
                    <Field as="th" className="px-3 py-3 font-medium" data-preview-field-path="admin.colStatus" />
                    <Field as="th" className="px-3 py-3 font-medium" data-preview-field-path="admin.colDays" />
                    <Field as="th" className="px-3 py-3 font-medium" data-preview-field-path="admin.colDocs" />
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const i = vehicleIndex(v);
                    return (
                      <tr key={v.id} className="border-b border-line last:border-0">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                              <Photo
                                id={v.images[0]}
                                alt=""
                                fill
                                sizes="56px"
                                crop="4:3"
                                quality={55}
                                className="object-cover"
                                data-preview-field-path={`vehicles[${i}].images[0]`}
                              />
                            </span>
                            <span>
                              <span className="block font-medium" data-preview-static="The car's own title, editable on its listing">
                                {vehicleTitle(v)}
                              </span>
                              <Field className="block text-xs text-muted" data-preview-field-path={`vehicles[${i}].grade`} />
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-medium" data-num>
                          <Field data-preview-field-path={`vehicles[${i}].priceLkr`} format={(p) => rsM(Number(p))} />
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={v.status} data-preview-field-path={`vehicles[${i}].status`} />
                        </td>
                        <td className={cn("px-3 py-3", v.listedDaysAgo > 30 && "font-semibold text-warn")} data-num>
                          <Field data-preview-field-path={`vehicles[${i}].listedDaysAgo`} />
                        </td>
                        <td className="px-3 py-3 text-ok">
                          {v.documents.length}/{v.documents.length} ✓
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Link
                            href={`/cars/${v.slug}`}
                            className="text-sm font-medium text-brand hover:underline"
                            data-preview-field-path={`vehicles[${i}].slug`}
                          >
                            <Field data-preview-field-path="admin.viewLabel" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  k,
  d,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  k: React.ReactNode;
  d: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.25rem] bg-paper p-5">
      <Icon className="size-5 text-muted" strokeWidth={1.5} />
      <p className="mt-4 font-display text-3xl font-semibold" data-num>
        {children}
      </p>
      <p className="mt-1 text-sm font-medium">{k}</p>
      <p className="text-xs text-muted">{d}</p>
    </div>
  );
}
