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

## Fivora template (DENEB UI)

The site is a [Fivora](https://deneb.fivora.site) template: a dealer edits every word, photo, car and setting in
Fivora's visual editor. It passes DENEB's strict preflight (`pnpm validate`).

| What | Where |
| --- | --- |
| All content (business details, pages, cars, reviews, posts, FAQs, labels, settings, translations) | `src/data/site-data.json` |
| Template manifest (pages, editor schema, side-panel-only fields) | `fivora-template.json` (generated) |
| Live-edit bridge (loads DENEB only inside the Fivora editor iframe) | `src/lib/site-data.tsx`, `src/lib/site-data-bridge.tsx` |
| Guard that keeps DENEB's injected theme from restyling the site | end of `src/app/globals.css` |

How it works:

- Every visible value is rendered through `<Field data-preview-field-path="…" />` (or carries the marker on its
  element), so clicking it in the editor edits that path of `site-data.json`. Write paths literally; list items use
  `` `vehicles[${i}].make` ``.
- Values that never show as text (alt text, link targets, settings, Sinhala/Tamil translations under `translations`)
  are edited in the side panel. Computed numbers (calculator results, counts) are marked `data-preview-static`.
- Sinhala/Tamil: any path can be translated at `translations.si.<path>` / `translations.ta.<path>`.

Workflow after changing content structure or components:

```bash
pnpm build && pnpm fivora:manifest   # regenerate the editor schema and side-panel list (runs 3 builds)
pnpm validate                        # DENEB strict preflight
pnpm lab                             # local visual-editing lab (localhost:3001)
pnpm validate-and-zip                # creates fivora-template.zip for the Fivora Developer Portal
```

Upload `fivora-template.zip` with a 16:9 WebP thumbnail (`preview.png` is a 1600×900 screenshot to convert).
