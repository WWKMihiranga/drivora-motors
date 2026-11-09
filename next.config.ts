import type { NextConfig } from "next";

const immutable = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
  async headers() {
    return [
      { source: "/models/:path*", headers: [{ key: "Cache-Control", value: immutable }] },
      { source: "/draco/:path*", headers: [{ key: "Cache-Control", value: immutable }] },
      { source: "/lottie/:path*", headers: [{ key: "Cache-Control", value: immutable }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
