// Renders the link-preview card (public/og.jpg, 1200×630) shown by WhatsApp, email and social apps.
// Uses the site's own hero illustration and brand type. Run: node scripts/build-og.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const art = (await readFile(path.join(root, "public/art/hero-scene.svg"), "utf8")).replace("<svg ", '<svg class="art" ');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Serif:ital,wght@0,500;1,500&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #123d4c; font-family: "IBM Plex Sans", sans-serif; color: #fff; position: relative; }
  .art { position: absolute; right: -40px; top: 0; width: 760px; height: 630px; }
  .fade { position: absolute; inset: 0; background: linear-gradient(90deg, #123d4c 38%, rgba(18,61,76,.85) 52%, rgba(18,61,76,0) 72%); }
  .copy { position: absolute; left: 72px; top: 64px; width: 640px; }
  .brand { display: flex; align-items: center; gap: 14px; font-weight: 600; font-size: 30px; }
  .brand svg { width: 44px; height: 44px; color: #fff; }
  .eyebrow { margin-top: 70px; font-size: 18px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #f1c27d; display: flex; align-items: center; gap: 14px; }
  .eyebrow::before { content: ""; width: 34px; height: 2px; background: #f1c27d; }
  h1 { margin-top: 22px; font-family: "IBM Plex Serif", serif; font-weight: 500; font-size: 68px; line-height: 1.04; letter-spacing: -.01em; }
  h1 em { color: #f1c27d; }
  p { margin-top: 26px; font-size: 22px; line-height: 1.45; color: #cfe0e6; max-width: 560px; }
</style></head><body>
${art}<div class="fade"></div>
<div class="copy">
  <div class="brand"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="17" stroke="currentColor" stroke-width="2.25"/><path d="M12.5 28.5V17.75L20 12.5L27.5 17.75V28.5H22.75V21.5H17.25V28.5H12.5Z" fill="currentColor"/></svg>Kaimbrya</div>
  <div class="eyebrow">Community management for Jamaica</div>
  <h1>Community management,<br><em>reimagined.</em></h1>
  <p>Finances, guest access, properties, maintenance and communication in one connected platform.</p>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await browser.close();
// JPEG keeps it well under WhatsApp's ~300 KB preview limit.
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(root, "public/og.jpg"));
console.log("wrote public/og.jpg");
