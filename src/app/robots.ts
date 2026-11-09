import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/*
 * Demo deployment: keep it out of search engines. For a live client site, switch
 * `disallow` to ["/admin"] and explicitly allow AI crawlers (GPTBot, Google-Extended,
 * PerplexityBot) so listings can be cited in AI answers (SRS NFR-06).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
