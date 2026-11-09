/** Every brand detail lives here, so the demo can be re-skinned for a prospect in minutes. */
export const site = {
  name: "Drivora Motors",
  shortName: "Drivora",
  tagline: "Verified cars. Honest prices.",
  description:
    "Reconditioned, used and brand-new cars in Sri Lanka with verified history, auction sheets and a leasing calculator that follows Central Bank rules.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://drivora-demo.vercel.app",
  phone: "+94 11 234 5678",
  phoneHref: "tel:+94112345678",
  whatsapp: "94771234567",
  email: "hello@drivora.lk",
  address: {
    line1: "214 High Level Road",
    city: "Nugegoda",
    region: "Western Province",
    postcode: "10250",
    country: "LK",
  },
  hours: "Mon–Sat 9.00–18.00 · Sun 10.00–14.00",
  hoursShort: "Open today · 9–6",
  registration: "PV 00264189 (demo)",
  founded: 2011,
  mapEmbed:
    "https://www.google.com/maps?q=High+Level+Road+Nugegoda+Sri+Lanka&output=embed",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
  },
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
