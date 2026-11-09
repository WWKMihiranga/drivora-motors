import siteData from "@/data/site-data.json";
import type { Vehicle } from "@/types";

/*
 * Inventory lives in src/data/site-data.json (`content.vehicles`) so a dealer can manage it in the
 * Fivora editor. Prices are illustrative, not quotes. Demo photos are from Unsplash.
 */
export const vehicles = (siteData.content.vehicles ?? []) as unknown as Vehicle[];

/** Position of a car in `content.vehicles`, used to build its Fivora field paths. */
export function vehicleIndex(v: Pick<Vehicle, "id">): number {
  return vehicles.findIndex((o) => o.id === v.id);
}
