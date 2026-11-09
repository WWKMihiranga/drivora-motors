# Drivora Motors · car-sales reference site (Phase 1)

A front-end-only demo dealer website for pitching the Dealer Digital Showroom to Sri Lankan car sale businesses.
Drivora Motors is fictional; cars, prices, reviews and people are illustrative.

## Run it

```bash
pnpm install        # Node 20.9+ required
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm test           # leasing maths + CBSL LTV rules (vitest)
pnpm lint
```

Add `?splash=1` to any URL to replay the intro animation (it normally plays once per browser session).

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it in Vercel (framework preset: Next.js, no extra settings).
2. Set `NEXT_PUBLIC_SITE_URL` to the final URL (used for metadata, sitemap and WhatsApp links).
3. Use a **Pro** team: the Hobby plan is for non-commercial use only.

The demo is set to `noindex` (see `src/app/layout.tsx` and `src/app/robots.ts`). Flip both for a live client site.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript strict |
| Styling | Tailwind CSS v4 + **FlyonUI** semantic components with a custom `drivora` theme (`src/app/globals.css`) |
| Icons | lucide-react (+ CSS micro-animations: arrow nudge, heart pop, menu morph) |
| Motion | CSS transitions + one shared IntersectionObserver for scroll reveals (no animation runtime on first load) |
| Lottie | lottie-web *light* player, loaded on demand; two hand-built animations in `public/lottie` (`scripts/make-lottie.mjs`) |
| 3D | three.js (vanilla, dynamic import) + Draco-compressed demo model, loaded only when the 3D section is reached |
| Images | Unsplash via a custom `next/image` loader (`src/lib/image-loader.ts`): Unsplash's CDN resizes and serves AVIF/WebP |
| State | zustand + localStorage (saved cars, compare, demo leads, language) |
| Fonts | Sora + Inter + Noto Sans Sinhala/Tamil, self-hosted from @fontsource via `next/font/local` |

## Where things live

```
src/config/site.ts        brand name, phone, WhatsApp, address: re-skin here
src/data/vehicles.ts      24 demo cars (Unsplash photo ids)
src/data/content.ts       reviews, articles, FAQs, demo leads
src/lib/finance.ts        CBSL LTV rules (25 May 2026) + flat / reducing-balance maths
src/lib/api.ts            async data layer, swap for a real API in phase 2
src/components/           layout, home sections, vehicle, search, finance, forms, chat, three
src/app/                  routes: / cars cars/[slug] finance compare saved sell book about contact faq blog admin credits
```

## Performance and low-end devices

- Every page is prerendered static HTML (49 routes) and served from Vercel's CDN.
- Heavy features are opt-in or lazy: three.js (~170 KB gz + 1.7 MB model) loads only near the 3D section, and only by tap on
  data-saver / low-memory / reduced-motion devices; chat, Lottie and Google Maps load on first use.
- `/models`, `/draco`, `/lottie` are served with `Cache-Control: immutable` for a year.
- `prefers-reduced-motion` turns animations into simple fades; the splash becomes a 0.9 s fade.
- Mobile first: sticky bottom action bar, swipe galleries, bottom-sheet filters, 16 px inputs (no iOS zoom), 44 px targets.

## Credits

Photos: Unsplash (Unsplash License). 3D model: Ferrari 458 Italia by vicent091036, from the three.js examples (demo only).
