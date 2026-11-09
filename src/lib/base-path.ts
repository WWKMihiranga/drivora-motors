/**
 * Prefixes a site-relative URL with the Fivora base path. Fivora serves each dealer's copy of the
 * site under a sub-path (NEXT_PUBLIC_SITE_BASE_PATH); next/link and next/image add it themselves,
 * but hand-written asset URLs (fetch, three.js loaders, <img>) need this.
 */
export function withBasePath(url: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "").replace(/\/$/, "");
  return base && url.startsWith("/") && !url.startsWith("//") && !url.startsWith(base + "/") ? base + url : url;
}
