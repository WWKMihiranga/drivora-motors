import siteData from "@/data/site-data.json";
import { vehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types";
import { rsM } from "@/lib/format";
import { fill } from "@/lib/fill";

/* Every reply below is editable in Fivora (site-data.json `chat`); the matching logic stays in code. */
const C = siteData.content.chat;
const list = (s: string) => s.split("|").map((x) => x.trim()).filter(Boolean);
const esc = (s: string) => s.replace(/[.*+?^${}()[\]\\]/g, "\\$&");

export interface BotReply {
  text: string;
  cars?: Vehicle[];
  quick?: string[];
  handover?: boolean;
  link?: { href: string; label: string };
}

const BODY: Record<string, Vehicle["bodyType"]> = {
  suv: "suv", jeep: "suv", crossover: "suv",
  sedan: "sedan", saloon: "sedan",
  hatch: "hatchback", hatchback: "hatchback", small: "hatchback",
  pickup: "pickup", "pick-up": "pickup", cab: "pickup", truck: "pickup",
};
const FUEL: Record<string, Vehicle["fuel"]> = {
  hybrid: "hybrid", electric: "electric", ev: "electric", diesel: "diesel", petrol: "petrol",
};

/** "10m", "10 million", "100 lakhs", "1 crore", "8,500,000" → rupees */
export function parseBudget(t: string): number | undefined {
  const s = t.toLowerCase().replace(/,/g, "");
  const m =
    s.match(/(\d+(?:\.\d+)?)\s*(m|mn|mil|million)\b/) ??
    s.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|l)\b/) ??
    s.match(/(\d+(?:\.\d+)?)\s*(crore|cr)\b/) ??
    s.match(/\b(\d{6,9})\b/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const unit = m[2] ?? "";
  if (/^m/.test(unit)) return n * 1_000_000;
  if (/^l/.test(unit)) return n * 100_000;
  if (/^c/.test(unit)) return n * 10_000_000;
  return n;
}

const FAQ = Object.values(C.answers).map((a) => ({
  re: new RegExp(`(${list(a.keywords).map(esc).join("|")})`),
  text: a.text,
  link: a.linkHref && a.linkLabel ? { href: a.linkHref, label: a.linkLabel } : undefined,
}));

export function reply(input: string): BotReply {
  const t = input.toLowerCase();

  if (/(human|person|agent|someone|call me|talk)/.test(t)) {
    return { text: C.handover, handover: true };
  }
  if (/^(hi|hello|hey|ayubowan|vanakkam)\b/.test(t)) {
    return { text: C.greeting, quick: QUICK };
  }

  const budget = parseBudget(t);
  const body = Object.entries(BODY).find(([k]) => new RegExp(`\\b${k}s?\\b`).test(t))?.[1];
  const fuel = Object.entries(FUEL).find(([k]) => new RegExp(`\\b${k}\\b`).test(t))?.[1];
  const make = vehicles.map((v) => v.make).find((m) => t.includes(m.toLowerCase()));
  const condition = /recon/.test(t) ? "reconditioned" : /brand ?new/.test(t) ? "brand-new" : /\bused\b/.test(t) ? "used" : undefined;

  if (budget || body || fuel || make || condition) {
    const hits = vehicles
      .filter((v) => v.status !== "sold")
      .filter((v) => (budget ? v.priceLkr <= budget * 1.05 : true))
      .filter((v) => (body ? v.bodyType === body : true))
      .filter((v) => (fuel ? v.fuel === fuel : true))
      .filter((v) => (make ? v.make === make : true))
      .filter((v) => (condition ? v.condition === condition : true))
      .sort((a, b) => (budget ? b.priceLkr - a.priceLkr : a.priceLkr - b.priceLkr));
    const parts = [fuel, body, make, condition].filter(Boolean).join(" ");
    const q = new URLSearchParams();
    if (budget) q.set("max", String(Math.round(budget)));
    if (body) q.set("body", body);
    if (fuel) q.set("fuel", fuel);
    if (condition) q.set("condition", condition);
    if (make) q.set("make", make);
    if (hits.length === 0) {
      const filters = `${parts ? `(${parts}) ` : ""}${budget ? `${fill(C.under, { amount: rsM(budget) })} ` : ""}`;
      return { text: fill(C.none, { filters }), quick: list(C.noneQuickReplies) };
    }
    const what = `${parts || C.carWord}${hits.length === 1 ? "" : C.pluralSuffix}`;
    const under = budget ? ` ${fill(C.under, { amount: rsM(budget) })}` : "";
    return {
      text: fill(C.found, { count: hits.length, what, under }),
      cars: hits.slice(0, 3),
      link: { href: `/cars?${q.toString()}`, label: fill(C.seeAll, { count: hits.length }) },
    };
  }

  for (const { re, text, link } of FAQ) if (re.test(t)) return { text, link };

  if (/show all|all cars|stock|inventory/.test(t)) {
    return { text: C.stock, link: { href: C.stockLinkHref || "/cars", label: C.stockLinkLabel } };
  }

  return { text: C.fallback, quick: QUICK };
}

export const QUICK = list(C.quickReplies);
