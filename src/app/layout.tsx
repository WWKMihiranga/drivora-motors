import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, sinhala, sora, tamil } from "./fonts";
import { site } from "@/config/site";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionBar } from "@/components/layout/ActionBar";
import { Splash, SplashScript } from "@/components/layout/Splash";
import { ThemeScript } from "@/components/layout/ThemeToggle";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { CompareBar } from "@/components/vehicle/CompareBar";
import { dealerJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Verified reconditioned & used cars in Sri Lanka`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_LK",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false }, // demo site: keep it out of search results
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f13" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-LK"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${sinhala.variable} ${tamil.variable}`}
    >
      <head>
        <ThemeScript />
        <SplashScript />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd()) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-70 rounded-full bg-ink px-4 py-2 text-on-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Providers>
          <Splash />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CompareBar />
          <ActionBar />
          <ChatLauncher />
        </Providers>
      </body>
    </html>
  );
}
