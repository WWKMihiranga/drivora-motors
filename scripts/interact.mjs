import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ph = (r) => r.fulfill({ contentType: "image/svg+xml", body: "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='10' height='10' fill='#c9ced6'/></svg>" });
const errs = [];
async function ctx(w, h) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 });
  await c.addInitScript(() => sessionStorage.setItem("drv-splash", "1"));
  const p = await c.newPage();
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.route(/images\.unsplash\.com/, ph);
  return p;
}
// 1. 3D studio
let p = await ctx(1440, 900);
await p.goto("http://localhost:3123/", { waitUntil: "networkidle" });
await p.locator("#studio-title").scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
const btn = p.getByRole("button", { name: /Load 3D model/ });
if (await btn.count()) await btn.click();
await p.waitForTimeout(9000);
await p.getByRole("button", { name: "Lagoon blue" }).click();
await p.waitForTimeout(1500);
await p.locator("#studio-title").evaluate((e) => e.closest("section").scrollIntoView({ block: "center" }));
await p.waitForTimeout(800);
await p.screenshot({ path: "/tmp/shots/i-3d.png" });
// 2. chat
await p.getByRole("button", { name: "Ask Drivora" }).click();
await p.waitForTimeout(600);
await p.getByLabel("Message").fill("hybrid suv under 20m");
await p.keyboard.press("Enter");
await p.waitForTimeout(1500);
await p.screenshot({ path: "/tmp/shots/i-chat.png" });
// 3. mobile menu + filters + success lottie
p = await ctx(390, 844);
await p.goto("http://localhost:3123/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Menu" }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/shots/i-menu.png" });
await p.goto("http://localhost:3123/cars?fuel=hybrid", { waitUntil: "networkidle" });
await p.getByRole("button", { name: /Filters/ }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: "/tmp/shots/i-sheet.png" });
await p.goto("http://localhost:3123/cars?max=1000", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: "/tmp/shots/i-empty.png", fullPage: false });
await p.goto("http://localhost:3123/cars/toyota-yaris-2018", { waitUntil: "networkidle" });
await p.locator("#eq-name").fill("Kasun");
await p.locator("#eq-phone").fill("077 123 4567");
await p.locator("#enquire input[type=checkbox]").check();
await p.getByRole("button", { name: "Send enquiry" }).click();
await p.waitForTimeout(1600);
await p.locator("#enquire").screenshot({ path: "/tmp/shots/i-success.png" });
console.log("errors:", errs.slice(0, 8));
await browser.close();
