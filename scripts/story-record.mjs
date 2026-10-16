// Records the signature story: a smooth scroll-through video plus key-frame stills.
//   node scripts/story-record.mjs <outDir> [url]
import { chromium } from "@playwright/test";
import { mkdirSync, renameSync, readdirSync } from "node:fs";
import path from "node:path";
const out = process.argv[2] ?? "qa/story-rec";
const url = process.argv[3] ?? "http://localhost:8899/";
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const [name, w, h, mobile] of [["desktop", 1440, 900, false], ["mobile", 390, 844, true]]) {
  const dir = path.join(out, `video-${name}`);
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, recordVideo: { dir, size: { width: w, height: h } } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(url, { waitUntil: "networkidle" });
  const geo = await p.evaluate(() => { const s = document.querySelector(".story"); return { top: s.getBoundingClientRect().top + scrollY, len: s.offsetHeight - innerHeight }; });
  // From the hero into the story, as a visitor arrives at it (the first scroll loads the runtime).
  await p.waitForTimeout(1500);
  for (let i = 1; i <= 90; i++) {
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geo.top * (i / 90));
    await p.waitForTimeout(30);
  }
  await p.waitForTimeout(400);
  const frames = [0, 0.1, 0.22, 0.34, 0.46, 0.56, 0.64, 0.72, 0.8, 0.9, 1];
  let fi = 0;
  const steps = 420;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geo.top + t * geo.len);
    await p.waitForTimeout(t > 0.63 && t < 0.69 ? 70 : 34);
    if (fi < frames.length && t >= frames[fi]) {
      await p.waitForTimeout(t > 0.6 && t < 0.7 ? 1400 : 900);
      await p.screenshot({ path: path.join(out, `${name}-${String(fi).padStart(2, "0")}.png`) });
      fi++;
    }
  }
  // ...and out of it into the rest of the page.
  await p.waitForTimeout(1500);
  for (let i = 1; i <= 60; i++) {
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), geo.top + geo.len + h * 1.2 * (i / 60));
    await p.waitForTimeout(30);
  }
  await p.waitForTimeout(800);
  await ctx.close();
  const vid = readdirSync(dir).find((f) => f.endsWith(".webm"));
  if (vid) renameSync(path.join(dir, vid), path.join(out, `story-${name}.webm`));
  console.log(name, "errors:", errors.length ? errors : "none");
}
await b.close();
