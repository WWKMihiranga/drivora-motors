import type { NextConfig } from "next";

/*
 * Fivora / DENEB contract (https://deneb.fivora.site/docs/setup-fivora):
 * the site is built as a static export into `out/`, and Fivora serves each merchant's
 * copy under a sub-path given by NEXT_PUBLIC_SITE_BASE_PATH (empty = served from root).
 * Static export cannot use `headers()`, so the cache/security headers live in vercel.json.
 */
const basePath = (process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  // cacheComponents / partialPrefetching are off: they need a Next.js server, and a static
  // export has none (they also block `dynamic = "force-static"` on robots/sitemap/manifest).
  poweredByHeader: false,
  compress: true,
  images: {
    // Unsplash's CDN (imgix) resizes and converts formats itself, so we hand it the
    // width/quality directly instead of re-optimising on Vercel. Cheaper and cached at the edge.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [55, 70, 75, 80], // keep in sync with every quality= used in src (Photo defaults to 70),
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 200, 256, 320],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
