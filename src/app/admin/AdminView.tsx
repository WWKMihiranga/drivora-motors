"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart3, Car, Clock3, Inbox, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { seedLeads } from "@/data/content";
import { useApp, useHydrated } from "@/store";
import { Photo } from "@/components/ui/Photo";
import { LogoMark } from "@/components/ui/Logo";
import { StatusBadge } from "@/components/vehicle/Badges";
import { rsM, vehicleTitle } from "@/lib/format";
import type { Lead } from "@/types";
import { cn } from "@/lib/cn";

const stages: Lead["stage"][] = ["New", "Contacted", "Test drive", "Negotiation", "Won"];
type Row = Lead & { ago: string };

function ago(ms: number) {
  const h = Math.round(ms / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function AdminView() {
  const hydrated = useHydrated();
  const stored = useApp((s) => s.leads);
  const [tab, setTab] = useState<"overview" | "stock">("overview");

  const leads: Row[] = useMemo(() => {
    const mine = hydrated
      ? stored.map((l) => ({ ...l, ago: `today ${new Date(l.createdAt).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}` }))
      : [];
    const seeded = seedLeads.map(({ hoursAgo, ...l }) => ({ ...l, createdAt: 0, ago: ago(hoursAgo * 3_600_000) }));
    return [...mine, ...seeded];
  }, [stored, hydrated]);

  const bySource = useMemo(() => {
    const m = new Map<string, number>();
    leads.forEach((l) => m.set(l.source, (m.get(l.source) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [leads]);
  const maxSource = Math.max(...bySource.map(([, n]) => n));
  const inStock = vehicles.filter((v) => v.status !== "sold");
  const avgAge = Math.round(inStock.reduce((a, v) => a + v.listedDaysAgo, 0) / inStock.length);

  const kpis = [
    { icon: Inbox, k: "Leads this week", v: String(leads.length), d: "+18% vs last week" },
    { icon: Clock3, k: "Median first reply", v: "4 min", d: "Target ≤ 5 min" },
    { icon: Users, k: "Test drives booked", v: String(leads.filter((l) => l.type === "test-drive").length + 6), d: "this week" },
    { icon: Car, k: "Cars in stock", v: String(inStock.length), d: `avg ${avgAge} days listed` },
  ];

  return (
    <div className="min-h-dvh bg-surface pt-24 lg:grid lg:grid-cols-[240px_1fr] lg:pt-0">
      <aside className="hidden bg-night pt-20 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-6 pt-8 pb-10">
          <LogoMark className="size-7" />
          <span className="font-display text-sm font-semibold tracking-[0.16em]">DEALER VIEW</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 text-sm">
          {[
            [LayoutDashboard, "Overview", "overview"],
            [Car, "Stock", "stock"],
            [MessageSquare, "Leads inbox", "overview"],
            [BarChart3, "Reports", "overview"],
            [Settings, "Settings", "overview"],
          ].map(([Icon, l, t]) => {
            const I = Icon as typeof Car;
            const active = (t === tab && (l === "Overview" || l === "Stock"));
            return (
              <button
                key={l as string}
                type="button"
                onClick={() => setTab(t as "overview" | "stock")}
                className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", active ? "bg-white/10 text-white" : "text-white/60 hover:text-white")}
              >
                <I className="size-4" strokeWidth={1.75} /> {l as string}
              </button>
            );
          })}
        </nav>
        <p className="px-6 pb-8 text-xs text-white/40">Read-only preview with demo data.</p>
      </aside>

      <div className="min-w-0 px-4 pb-16 md:px-8 lg:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Dealer view · demo</p>
            <h1 className="mt-2 font-display text-3xl font-semibold">Good afternoon, Ruwan</h1>
          </div>
          <div className="flex rounded-full border border-line bg-paper p-1 text-sm lg:hidden">
            {(["overview", "stock"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} className={cn("h-9 rounded-full px-4 capitalize", tab === t ? "bg-ink text-on-ink" : "text-muted")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "overview" ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {kpis.map(({ icon: Icon, k, v, d }) => (
                <div key={k} className="rounded-[1.25rem] bg-paper p-5">
                  <Icon className="size-5 text-muted" strokeWidth={1.5} />
                  <p className="mt-4 font-display text-3xl font-semibold" data-num>
                    {v}
                  </p>
                  <p className="mt-1 text-sm font-medium">{k}</p>
                  <p className="text-xs text-muted">{d}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
              <section className="rounded-[1.25rem] bg-paper p-5">
                <h2 className="font-sans text-sm font-semibold">Lead pipeline</h2>
                <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                  {stages.map((s) => {
                    const items = leads.filter((l) => l.stage === s);
                    return (
                      <div key={s} className="w-56 shrink-0 rounded-2xl bg-surface p-3">
                        <p className="flex items-center justify-between px-1 text-xs font-semibold tracking-wide text-muted uppercase">
                          {s} <span>{items.length}</span>
                        </p>
                        <ul className="mt-3 space-y-2">
                          {items.slice(0, 4).map((l) => (
                            <li key={l.id} className="rounded-xl bg-paper p-3 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
                <h2 className="font-sans text-sm font-semibold">Leads by source</h2>
                <ul className="mt-5 space-y-4">
                  {bySource.map(([s, n]) => (
                    <li key={s}>
                      <div className="flex justify-between text-sm">
                        <span>{s}</span>
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
                <p className="mt-5 text-xs text-muted">Website leads are the ones this site captures. Try a form, then refresh this page.</p>
              </section>
            </div>
          </>
        ) : (
          <section className="mt-6 overflow-hidden rounded-[1.25rem] bg-paper">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs tracking-wide text-muted uppercase">
                    <th className="px-5 py-3 font-medium">Car</th>
                    <th className="px-3 py-3 font-medium">Price</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Days listed</th>
                    <th className="px-3 py-3 font-medium">Docs</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                            <Photo id={v.images[0]} alt="" fill sizes="56px" crop="4:3" quality={55} className="object-cover" />
                          </span>
                          <span>
                            <span className="block font-medium">{vehicleTitle(v)}</span>
                            <span className="block text-xs text-muted">{v.grade}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium" data-num>
                        {rsM(v.priceLkr)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className={cn("px-3 py-3", v.listedDaysAgo > 30 && "font-semibold text-warn")} data-num>
                        {v.listedDaysAgo}
                      </td>
                      <td className="px-3 py-3 text-ok">{v.documents.length}/{v.documents.length} ✓</td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/cars/${v.slug}`} className="text-sm font-medium text-brand hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
