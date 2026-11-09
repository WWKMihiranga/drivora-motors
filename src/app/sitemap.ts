import type { MetadataRoute } from "next";

// Required by `output: "export"` (static export for Fivora): prerender this file at build time.
export const dynamic = "force-static";
import { site } from "@/config/site";
import { getPosts, getVehicles } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, posts] = await Promise.all([getVehicles(), getPosts()]);
  const pages = ["", "/cars", "/finance", "/sell", "/book", "/about", "/contact", "/faq", "/blog", "/compare"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...cars.map((v) => ({ url: `${site.url}/cars/${v.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
