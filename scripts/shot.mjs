// Usage: node scripts/shot.mjs <path> <name> [width] [height] [fullPage] [extra-js]
import { chromium } from "playwright-core";
const [path = "/", name = "home", w = "1440", h = "900", full = "1", js = ""] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  isMobile: +w < 768,
  hasTouch: +w < 768,
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
// Unsplash is blocked in this sandbox: serve a neutral placeholder so layout can be checked.
await page.route(/images\.unsplash\.com/, (r) =>
  r.fulfill({ contentType: "image/svg+xml", body: `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'><defs><linearGradient id='g' x2='1' y2='1'><stop offset='0' stop-color='#cfd4db'/><stop offset='1' stop-color='#9aa3ae'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' font-family='sans-serif' font-size='60' fill='#ffffff' text-anchor='middle'>photo</text></svg>` }),
);
await page.addInitScript(() => sessionStorage.setItem("drv-splash", "1"));
await page.goto(`http://localhost:3123${path}`, { waitUntil: "networkidle" });
if (js) await page.evaluate(js);
if (full === "1") {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
}
// reveal everything for full-page shots
await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.animate([{ opacity: 1, transform: "none" }], { duration: 0, fill: "forwards" })));
await page.waitForTimeout(900);
await page.screenshot({ path: `/tmp/shots/${name}.png`, fullPage: full === "1" });
console.log(name, "errors:", errors.length ? errors.slice(0, 5) : "none");
await browser.close();
