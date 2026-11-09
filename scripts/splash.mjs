import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.route(/images\.unsplash\.com/, (r) => r.fulfill({ contentType: "image/svg+xml", body: "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='10' height='10' fill='#c9ced6'/></svg>" }));
  page.goto("http://localhost:3123/?splash=1");
  await page.waitForSelector("#splash");
  const t0 = Date.now();
  for (const at of [300, 750, 1300, 2000, 3200]) {
    await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    await page.screenshot({ path: `/tmp/shots/splash-${tag}-${at}.png` });
  }
  console.log(tag, "classes:", await page.evaluate(() => document.documentElement.className));
}
await browser.close();
