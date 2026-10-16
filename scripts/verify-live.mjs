// End-to-end checks against the deployed site (default https://kaimbrya.netlify.app).
// Read-only: it never submits the demo form. Usage: node scripts/verify-live.mjs [baseUrl]
import { writeFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = (process.argv[2] ?? "https://kaimbrya.netlify.app").replace(/\/$/, "");
const PAGES = ["/", "/platform/", "/solutions/gated-communities/", "/solutions/strata-and-hoas/", "/solutions/property-managers/", "/solutions/developers/", "/about/", "/contact/", "/privacy/", "/terms/", "/demo/"];
const VIEWPORTS = { mobile: { width: 390, height: 844, isMobile: true, hasTouch: true }, desktop: { width: 1440, height: 900 } };
const report = { base: BASE, problems: [], pages: {}, links: { checked: 0, broken: [] }, interactions: {} };
await mkdir("qa/live", { recursive: true });
const browser = await chromium.launch();
const hrefs = new Set();

for (const [vp, opts] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, isMobile: opts.isMobile, hasTouch: opts.hasTouch });
  for (const route of PAGES) {
    const page = await context.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(`pageerror ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errs.push(`console ${m.text()}`); });
    page.on("response", (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += Math.round(opts.height * 0.4)) {
      await page.evaluate((t) => scrollTo({ top: t, behavior: "instant" }), y); await page.waitForTimeout(80);
    }
    await page.waitForTimeout(900);
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      hidden: document.querySelectorAll(".enhanced [data-reveal]:not([data-shown])").length,
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:")).map((i) => i.src),
      placeholders: (document.body.innerText.match(/\b(TODO|TBD|lorem ipsum|to confirm|prototype)\b/gi) ?? []),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    }));
    info.links.filter((h) => h.startsWith("/")).forEach((h) => hrefs.add(h.split("#")[0] || "/"));
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const key = `${vp} ${route}`;
    report.pages[key] = { status: res?.status(), title: info.title, h1: info.h1, overflow: info.overflow, hiddenSections: info.hidden, brokenImages: info.brokenImages, placeholders: info.placeholders, robots: info.robots, a11y: axe.violations.map((v) => `${v.id} (${v.nodes.length})`), errors: errs };
    if (res?.status() !== 200 || info.overflow > 0 || info.hidden || info.brokenImages.length || info.placeholders.length || axe.violations.length || errs.length) report.problems.push(key);
    await page.screenshot({ path: `qa/live/${vp}${route.replace(/\//g, "_") || "_"}.png` });
    await page.close();
  }
  await context.close();
}

// Every internal link resolves.
const ctx = await browser.newContext();
for (const h of hrefs) {
  if (h.startsWith("mailto:")) continue;
  const r = await ctx.request.get(BASE + h, { maxRedirects: 5 });
  report.links.checked++;
  if (r.status() >= 400) report.links.broken.push(`${h} ${r.status()}`);
}

// Interactions on the live build (desktop mouse + keyboard, mobile menu, demo form validation only).
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto(BASE + "/", { waitUntil: "networkidle" });
const trigger = desk.locator(".nav-item button").first();
const box = await trigger.boundingBox();
await desk.mouse.move(box.x + 200, box.y + 120); await desk.waitForTimeout(400);
report.interactions.hoverBelowNavOpens = await desk.locator('.mega[data-open="true"]').count();
await desk.mouse.move(box.x + 20, box.y + 10); await desk.waitForTimeout(400);
report.interactions.hoverTriggerOpens = await desk.locator('.mega[data-open="true"]').count();
await desk.keyboard.press("Escape");
await desk.locator(".guest-grid").scrollIntoViewIfNeeded();
await desk.locator('[role="tab"]').nth(1).click(); await desk.waitForTimeout(700);
report.interactions.guestStep2Active = await desk.locator('.guest-shot[data-active="true"]').count() === 1 && await desk.locator('[role="tab"]').nth(1).getAttribute("aria-selected");
await desk.goto(BASE + "/demo/?type=gated", { waitUntil: "networkidle" });
report.interactions.demoPreset = await desk.locator("#f-type").inputValue();
await desk.locator('form button[type="submit"]').click();
report.interactions.demoValidationErrors = await desk.locator(".field-error").count();
report.interactions.demoNetlifyForm = await (await desk.request.get(BASE + "/__forms.html")).text().then((t) =>
  // After detection Netlify rewrites the tag (drops data-netlify, adds method='post').
  /<form[^>]*method='post'[^>]*name='demo-request'/.test(t) && !/data-netlify/.test(t));
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await mob.goto(BASE + "/", { waitUntil: "networkidle" });
await mob.locator(".menu-button").first().tap(); await mob.waitForTimeout(400);
report.interactions.mobileMenuOpens = await mob.evaluate(() => document.activeElement?.getAttribute("aria-label"));

await writeFile("qa/live/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ problems: report.problems, links: report.links, interactions: report.interactions }, null, 1));
await browser.close();
