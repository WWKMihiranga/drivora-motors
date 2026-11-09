import siteData from "@/data/site-data.json";

/*
 * Every brand detail lives in src/data/site-data.json (the Fivora content bank), so a dealer can
 * re-skin the site from the Fivora editor and the demo can be re-skinned for a prospect in minutes.
 * This object keeps the original `site` shape so the rest of the app reads it unchanged.
 */
const b = siteData.content.common.business;

export const site = {
  name: b.name,
  shortName: b.shortName,
  tagline: b.tagline,
  description: b.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://drivora-demo.vercel.app",
  phone: b.phone,
  phoneHref: `tel:${b.phone.replace(/[^\d+]/g, "")}`,
  whatsapp: b.whatsapp,
  email: b.email,
  address: {
    line1: b.addressLine1,
    city: b.city,
    region: b.region,
    postcode: b.postcode,
    country: "LK",
  },
  hours: b.hours,
  hoursShort: b.hoursShort,
  registration: b.registration,
  founded: b.founded,
  mapEmbed: b.mapEmbedUrl,
  socials: siteData.content.common.socials,
  stats: { years: 15, carsSold: 2400, happy: 98 },
} as const;

export const nav = [
  { href: "/cars", key: "cars" },
  { href: "/finance", key: "finance" },
  { href: "/sell", key: "sell" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
