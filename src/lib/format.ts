const nf = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

export function rs(n: number) {
  return `Rs ${nf.format(Math.round(n))}`;
}

/** 7,850,000 → "78.5 lakhs"; 125,000,000 → "1,250 lakhs" */
export function lakhs(n: number) {
  const l = n / 100_000;
  const v = l >= 100 ? nf.format(Math.round(l)) : l.toFixed(l % 1 === 0 ? 0 : 1);
  return `${v} lakhs`;
}

/** Compact millions for small UI: 7,850,000 → "Rs 7.85M" */
export function rsM(n: number) {
  return `Rs ${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 2).replace(/\.?0+$/, "")}M`;
}

export function km(n: number) {
  return `${nf.format(n)} km`;
}

export function num(n: number) {
  return nf.format(n);
}

export function pct(n: number, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`;
}

export const conditionLabel = {
  "brand-new": "Brand new",
  reconditioned: "Reconditioned",
  used: "Used",
} as const;

export const fuelLabel = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  "plug-in-hybrid": "Plug-in hybrid",
  electric: "Electric",
} as const;

export const bodyLabel = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  pickup: "Pick-up",
  coupe: "Coupé",
} as const;

export const statusLabel = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  arriving: "Arriving soon",
} as const;

export function vehicleTitle(v: { make: string; model: string; yom: number }) {
  return `${v.make} ${v.model} ${v.yom}`;
}
