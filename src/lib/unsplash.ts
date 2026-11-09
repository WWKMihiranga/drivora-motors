import { withBasePath } from "./base-path";

/**
 * Image URL for a photo. Accepts an Unsplash photo id ("1749058983232-59b967855b18"), a full URL
 * (e.g. a dealer's upload from the Fivora editor) or a site-relative path. Unsplash photos get crop
 * params; everything else is returned as-is (relative paths get the Fivora base path).
 */
export function u(id: string, opts: { fit?: "crop" | "max"; ar?: string } = {}) {
  if (!id) return "";
  const isUnsplash = /^[0-9]+-[0-9a-f]+$/.test(id) || id.startsWith("https://images.unsplash.com/");
  if (!isUnsplash) return withBasePath(id);
  const url = new URL(id.startsWith("https://") ? id : `https://images.unsplash.com/photo-${id}`);
  if (opts.fit === "crop") {
    url.searchParams.set("fit", "crop");
    if (opts.ar) url.searchParams.set("ar", opts.ar);
    url.searchParams.set("crop", "entropy");
  }
  return url.toString();
}

/** Photo ids used outside the inventory, all checked by hand on unsplash.com. */
export const IMG = {
  // Hero slides use real stock (v01 Defender, v06 Land Cruiser, v02 BYD Seal) so every slide links to a car.
  heroDefender: "1741905358565-5ae6835ac172",
  heroLandCruiser: "1650530579355-7ad9d4766043",
  heroSeal: "1727098353953-929512ce7b90",
  showroom: "1692406069831-0bb7ea297645",
  showroomLux: "1764013290175-2b76e9a00b2e",
  handoverKeys: "1761014586544-53fe5e1f1e25",
  garlandCar: "1769961236211-3046cbcc474d",
  inspection: "1625047509248-ec889cbff17f",
  evCharging: "1593941707874-ef25b8b4a92b",
  nightRoad: "1501290301209-7a0323622985",
  aerialRoad: "1708286974024-f46c4829f1f6",
  colombo: "1623595289196-007a22dd8560",
  tailLight: "1743114713492-ab7d94a7f082",
  carKeys: "1710006548781-eff5670376fa",
  redShowroomPeople: "1648905968648-b1a6410f54cc",
  defenderFront: "1753030148324-d42f168825ef",
} as const;
