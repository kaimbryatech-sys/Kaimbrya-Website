// Headless verification of the static build (out/), served from disk through Playwright's
// request interception: no dev server. Writes screenshots and qa/report.json.
//
//   npm run build && npm run verify
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const root = path.resolve(import.meta.dirname, "..");
const OUT = path.join(root, "out");
const QA = path.join(root, "qa");
const ORIGIN = "http://kaimbrya.test";
await mkdir(QA, { recursive: true });

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".avif": "image/avif", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json", ".ico": "image/x-icon", ".png": "image/png" };

/** Serve out/ for ORIGIN. Optional throttle: per-request latency + bandwidth (approximate). */
async function serve(context, { throttle = false, ledger } = {}) {
  await context.route(`${ORIGIN}/**`, async (route) => {
    const url = new URL(route.request().url());
    let file = path.join(OUT, decodeURIComponent(url.pathname));
    try { if ((await stat(file)).isDirectory()) file = path.join(file, "index.html"); } catch { /* not a directory */ }
    try {
      const body = await readFile(file);
      // Text is sent gzip-compressed by any real host; images and fonts are already compressed.
      const wire = /\.(html|js|css|svg|txt|json)$/.test(file) ? gzipSync(body).length : body.length;
      if (ledger) ledger.push({ path: url.pathname, bytes: body.length, wire });
      if (throttle) await new Promise((r) => setTimeout(r, 150 + (wire / (1.6e6 / 8)) * 1000)); // ~Fast 4G: 150 ms RTT, 1.6 Mbps
      await route.fulfill({ status: 200, body, contentType: TYPES[path.extname(file)] ?? "application/octet-stream" });
    } catch {
      await route.fulfill({ status: 404, body: "not found" });
    }
  });
}

const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
const SECTIONS = ["main", "platform", "finance", "guest-access", "roles", "operations", "community", "solutions"];

const report = { problems: [], overflow: {}, a11y: {}, perf: {}, interactions: {} };
const browser = await chromium.launch();

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.6)) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300));
  });
}

for (const [name, opts] of Object.entries(VIEWPORTS)) {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    if (reducedMotion === "reduce" && name === "tablet") continue;
    const context = await browser.newContext({ ...opts, reducedMotion });
    await serve(context);
    const page = await context.newPage();
    page.on("pageerror", (e) => report.problems.push(`${name}/${reducedMotion} pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") report.problems.push(`${name}/${reducedMotion} console: ${m.text()}`); });
    page.on("response", (r) => { if (r.status() >= 400) report.problems.push(`${name}/${reducedMotion} ${r.status()} ${r.url()}`); });
    await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600); // hero entrance
    const tag = `${name}${reducedMotion === "reduce" ? "-reduced" : ""}`;
    await page.screenshot({ path: path.join(QA, `${tag}-00-hero.png`) });
    await scrollThrough(page);
    report.overflow[tag] = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("body *")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > w + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed"; })
        .filter((el) => !el.closest(".hero-art, .conv-frags, [aria-hidden='true']"))
        .slice(0, 6).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(el.getBoundingClientRect().left)}→${Math.round(el.getBoundingClientRect().right)}`);
      return { scrollWidth: document.documentElement.scrollWidth, clientWidth: w, offenders: wide };
    });
    for (const [i, id] of SECTIONS.entries()) {
      if (id === "main") continue;
      await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }), id);
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(QA, `${tag}-${String(i).padStart(2, "0")}-${id}.png`) });
    }
    // Signature B at three points of its scroll (pinned only on desktop with motion).
    if (name === "desktop" && reducedMotion === "no-preference") {
      for (const p of [0.05, 0.5, 0.95]) {
        await page.evaluate((p) => {
          const el = document.getElementById("platform");
          const top = el.getBoundingClientRect().top + scrollY;
          scrollTo({ top: top + (el.offsetHeight - innerHeight) * p, behavior: "instant" });
        }, p);
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(QA, `${tag}-conv-${Math.round(p * 100)}.png`) });
      }
    }
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(QA, `${tag}-99-end.png`) });
    if (reducedMotion === "no-preference") {
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      report.a11y[`${name}-home`] = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
    }
    await context.close();
  }
}

// Interactions: keyboard on the tabs, the mobile menu, the demo form.
{
  const context = await browser.newContext(VIEWPORTS.desktop);
  await serve(context);
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  const guest = page.getByRole("tab", { name: /Invite/ });
  await guest.focus();
  await page.keyboard.press("ArrowDown");
  report.interactions.guestArrowKey = await page.getByRole("tab", { name: /Approve/ }).getAttribute("aria-selected");
  await page.keyboard.press("End");
  report.interactions.guestEnd = await page.getByRole("tab", { name: /Arrive/ }).getAttribute("aria-selected");
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  report.interactions.roleClick = await page.getByRole("tab", { name: "Security", exact: true }).getAttribute("aria-selected");
  await page.getByRole("tab", { name: "Security", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  report.interactions.roleWraps = await page.getByRole("tab", { name: "Homeowner", exact: true }).getAttribute("aria-selected");
  await page.getByRole("button", { name: "Platform" }).click();
  report.interactions.megaOpens = await page.locator("#menu-platform").getAttribute("data-open");
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(QA, "desktop-mega-menu.png") });
  await page.keyboard.press("Escape");
  report.interactions.megaEscapeCloses = (await page.locator("#menu-platform").getAttribute("data-open")) === "false";
  report.interactions.megaEscapeFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());

  await page.goto(`${ORIGIN}/demo/?type=gated`, { waitUntil: "networkidle" });
  report.interactions.demoPreset = await page.locator("#f-type").inputValue();
  await page.getByRole("button", { name: /Request my demo/ }).click();
  report.interactions.demoErrors = await page.locator(".field-error").count();
  report.interactions.demoFocus = await page.evaluate(() => document.activeElement?.id);
  await page.screenshot({ path: path.join(QA, "desktop-demo-errors.png"), fullPage: true });
  await page.fill("#f-name", "Andrea Campbell");
  await page.fill("#f-email", "andrea@mahoeridge.example");
  await page.fill("#f-org", "Mahoe Ridge");
  await page.selectOption("#f-size", { index: 3 });
  await page.getByRole("button", { name: /Request my demo/ }).click();
  await page.waitForSelector(".success", { timeout: 5000 });
  report.interactions.demoSuccess = await page.locator(".success h2").innerText();
  report.interactions.demoPrototypeNote = await page.locator(".prototype-note").count();
  await page.screenshot({ path: path.join(QA, "desktop-demo-success.png") });
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  report.a11y["desktop-demo"] = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
  await context.close();

  const mobile = await browser.newContext({ ...VIEWPORTS.mobile });
  await serve(mobile);
  const m = await mobile.newPage();
  await m.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
  await m.getByRole("button", { name: "Open menu" }).click();
  await m.waitForTimeout(400);
  report.interactions.mobileMenuFocus = await m.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  await m.screenshot({ path: path.join(QA, "mobile-menu.png") });
  await m.keyboard.press("Escape");
  await m.waitForTimeout(300);
  report.interactions.mobileMenuClosed = await m.locator("#mobile-menu").getAttribute("data-open");
  await m.goto(`${ORIGIN}/demo/`, { waitUntil: "networkidle" });
  await m.screenshot({ path: path.join(QA, "mobile-demo.png"), fullPage: true });
  await mobile.close();
}

// Approximate lab performance on a phone: 4× CPU slowdown, ~Fast 4G per request.
{
  const ledger = [];
  const context = await browser.newContext(VIEWPORTS.mobile);
  await serve(context, { throttle: true, ledger });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0; window.__lcpEl = "";
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = e.element ? `${e.element.tagName.toLowerCase()}${e.element.id ? "#" + e.element.id : ""} ${e.element.className || ""}`.trim() : e.url; } }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(`${ORIGIN}/`, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const { lcp, cls, lcpEl } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls, lcpEl: window.__lcpEl }));
  const js = ledger.filter((r) => r.path.endsWith(".js"));
  let jsGzip = 0;
  for (const r of js) jsGzip += gzipSync(await readFile(path.join(OUT, r.path))).length;
  report.perf = {
    note: "Approximate: request interception with simulated latency/bandwidth and 4x CPU slowdown; confirm with Lighthouse once deployed.",
    lcpMs: Math.round(lcp),
    lcpElement: lcpEl,
    cls: Number(cls.toFixed(3)),
    firstLoadTransferBytes: ledger.reduce((s, r) => s + r.wire, 0),
    firstLoadRawBytes: ledger.reduce((s, r) => s + r.bytes, 0),
    firstLoadRequests: ledger.length,
    jsFiles: js.length,
    jsGzipBytes: jsGzip,
    requests: [...ledger].sort((a, b) => b.wire - a.wire).map((r) => `${r.path} ${Math.round(r.wire / 1024)} KB`),
  };
  await context.close();
}

await browser.close();
await writeFile(path.join(QA, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
