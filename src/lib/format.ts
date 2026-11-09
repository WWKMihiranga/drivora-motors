import siteData from "@/data/site-data.json";

const nf = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });
const content = siteData.content;
/** Currency symbol shown before prices (editable in Fivora: common.business.currency). */
export const currency = content.common.business.currency || "Rs";

export function rs(n: number) {
  return `${currency} ${nf.format(Math.round(n || 0))}`;
}

/** 7,850,000 → "78.5 lakhs"; 125,000,000 → "1,250 lakhs" */
export function lakhs(n: number) {
  const l = n / 100_000;
  const v = l >= 100 ? nf.format(Math.round(l)) : l.toFixed(l % 1 === 0 ? 0 : 1);
  return `${v} ${content.common.units.lakhs}`;
}

/** Compact millions for small UI: 7,850,000 → "Rs 7.85M" */
export function rsM(n: number) {
  return `${currency} ${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 2).replace(/\.?0+$/, "")}M`;
}

export function km(n: number) {
  return `${nf.format(n || 0)} ${content.common.units.km}`;
}

export function num(n: number) {
  return nf.format(n);
}

export function pct(n: number, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`;
}

/*
 * Category names (editable in Fivora under `labels`). Lookups fall back to the raw value, so a value
 * the dealer typed that is not in the list still renders instead of breaking the page.
 */
type LabelMap = Record<string, string>;
const withFallback = <T extends LabelMap>(map: T) =>
  new Proxy(map, { get: (t, k: string) => (k in t ? t[k] : k) }) as T & LabelMap;

export const conditionLabel = withFallback(content.labels.condition);
export const fuelLabel = withFallback(content.labels.fuel);
export const bodyLabel = withFallback(content.labels.body);
export const statusLabel = withFallback(content.labels.status);
export const transmissionLabel = withFallback(content.labels.transmission);
export const transmissionLongLabel = withFallback(content.labels.transmissionLong);

export function vehicleTitle(v: { make: string; model: string; yom: number }) {
  return `${v.make} ${v.model} ${v.yom}`;
}
