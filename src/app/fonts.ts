import localFont from "next/font/local";

// Self-hosted from @fontsource (no Google request at build or run time).
export const sora = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2", weight: "100 800" },
    { path: "../../node_modules/@fontsource-variable/sora/files/sora-latin-ext-wght-normal.woff2", weight: "100 800" },
  ],
  variable: "--font-sora",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial"],
});

export const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", weight: "100 900" },
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2", weight: "100 900" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial"],
});

// Only downloaded when Sinhala / Tamil glyphs actually render.
export const sinhala = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-sinhala/files/noto-sans-sinhala-sinhala-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
});

export const tamil = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-tamil/files/noto-sans-tamil-tamil-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-tamil",
  display: "swap",
  preload: false,
});
