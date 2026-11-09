import { vehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types";
import { rsM } from "@/lib/format";

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

const FAQ: [RegExp, string, { href: string; label: string }?][] = [
  [/(lease|leasing|loan|finance|down ?payment|ltv|instal)/, "Since 25 May 2026, lenders can finance up to 40% of an unregistered or newly registered car, so you need at least 60% down. Cars registered over a year and commercial vehicles can be financed up to 60%. The leasing calculator works it out for you.", { href: "/finance", label: "Open the leasing calculator" }],
  [/(trade|sell my|exchange|swap)/, "Yes, we take trade-ins. Send a few photos and details and we usually reply with a price range the same day.", { href: "/sell", label: "Get a trade-in price" }],
  [/(auction sheet|grade|mileage|odometer|rollback|history)/, "Every reconditioned car has its auction sheet and English translation on the listing, and we print the verified mileage. For used cars we show the service history."],
  [/(deliver|delivery|outside colombo|kandy|galle|jaffna|kurunegala)/, "We deliver island-wide. Within 30 km of Nugegoda it's free; further away we only charge the driver's cost."],
  [/(warranty|guarantee)/, "Brand-new cars carry the agent warranty. Reconditioned and used cars come with our 6-month engine and gearbox cover."],
  [/(where|location|address|open|hours|time)/, "We're at 214 High Level Road, Nugegoda. Open Mon–Sat 9.00–18.00 and Sun 10.00–14.00.", { href: "/contact", label: "Directions" }],
  [/(reserve|deposit|hold)/, "A refundable Rs 100,000 deposit holds a car for 5 days while your finance is approved."],
  [/(test ?drive|visit|view|see the car)/, "Happy to arrange that. Pick a car and a time slot and we'll confirm on WhatsApp.", { href: "/book", label: "Book a test drive" }],
];

export function reply(input: string): BotReply {
  const t = input.toLowerCase();

  if (/(human|person|agent|someone|call me|talk)/.test(t)) {
    return { text: "Of course. Tap below to continue on WhatsApp with our sales team. They usually reply within 10 minutes during opening hours.", handover: true };
  }
  if (/^(hi|hello|hey|ayubowan|vanakkam)\b/.test(t)) {
    return { text: "Hello! Tell me your budget and what kind of car you want, for example \"hybrid SUV under 20m\".", quick: QUICK };
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
      return {
        text: `Nothing ${parts ? `(${parts}) ` : ""}${budget ? `under ${rsM(budget)} ` : ""}in stock right now. Want our team to source one for you?`,
        quick: ["Talk to a person", "Show all cars"],
      };
    }
    return {
      text: `I found ${hits.length} ${parts || "car"}${hits.length === 1 ? "" : "s"}${budget ? ` under ${rsM(budget)}` : ""}. Here are the best matches:`,
      cars: hits.slice(0, 3),
      link: { href: `/cars?${q.toString()}`, label: `See all ${hits.length}` },
    };
  }

  for (const [re, text, link] of FAQ) if (re.test(t)) return { text, link };

  if (/show all|all cars|stock|inventory/.test(t)) {
    return { text: "Here's everything we have in stock.", link: { href: "/cars", label: "Browse all cars" } };
  }

  return {
    text: "I'm a simple demo assistant, so I might have missed that. Try a budget or car type, or ask about leasing, trade-ins or delivery.",
    quick: QUICK,
  };
}

export const QUICK = ["Hybrid SUV under 20m", "Cars under 10m", "Electric cars", "Leasing help", "Talk to a person"];
