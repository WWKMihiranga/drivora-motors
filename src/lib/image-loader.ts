"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Unsplash URLs go straight to images.unsplash.com with resize + format params
 * (auto=format serves AVIF/WebP where supported). Local files are returned as-is.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", url.searchParams.get("fit") ?? "max");
    return url.toString();
  }
  return src;
}
