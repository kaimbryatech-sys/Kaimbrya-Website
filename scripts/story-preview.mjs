// Renders key frames of the signature story to PNGs for art direction (and the static poster).
//   node scripts/story-preview.mjs <outDir> [wide|tall]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { buildScene, cameraTransform, communityShot, endState, startState, toSVG, accentCard, P } from "../src/story/scene.ts";

const out = process.argv[2] ?? "qa/story";
const shape = process.argv[3] ?? "wide";
mkdirSync(out, { recursive: true });
const [W, H] = shape === "tall" ? [390, 760] : [1440, 860];
const scene = buildScene({ lite: shape === "tall" });
const fit = communityShot(W, H);
const S = (o) => ({ ...startState(), ...o });
const done = { plot: 1, found: 1, walls: 1, cols: 1, openings: 1, roof: 1, finish: 1, glaze: 1 };
const frames = {
  "1-plot": S({ plot: 1, camX: 6, camY: 5, zoom: 0.95 }),
  "2-foundation": S({ plot: 1, found: 1, camX: 6, camY: 5, zoom: 1.05 }),
  "3-walls": S({ plot: 1, found: 1, walls: 0.55, camX: 6.5, camY: 4.5, camZ: 1, zoom: 1.1 }),
  "4-shape": S({ plot: 1, found: 1, walls: 1, cols: 1, openings: 1, camX: 6.5, camY: 4.5, camZ: 1.2, zoom: 1.1 }),
  "5-finish": S({ ...done, garden: 0.7, roof: 1, camX: 6.5, camY: 5.5, camZ: 1.2, zoom: 1.05 }),
  "6-home": S({ ...done, garden: 1, lights: 1, camX: 6, camY: 6.5, camZ: 1.2, zoom: 1.15 }),
  "7-wave": S({ ...done, garden: 1, lights: 1, door: 1, step: 1, wave: 0.45, camX: 5.6, camY: 8.3, camZ: 1.1, zoom: 4.6 }),
  "7b-wave-up": S({ ...done, garden: 1, lights: 1, door: 1, step: 1, wave: 0.3, camX: 5.6, camY: 8.3, camZ: 1.1, zoom: 4.6 }),
  "8-pullback": S({ ...done, garden: 1, lights: 1, door: 1, step: 1, wave: 1, neighbors: 0.55, community: 0.4, camX: (6 + fit.camX) / 2, camY: (6 + fit.camY) / 2, zoom: Math.sqrt(1.1 * fit.zoom) }),
  "9-community": { ...endState(fit) },
};
const css = `body{margin:0} svg{display:block} .story-ping{opacity:.6}`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
for (const [name, st] of Object.entries(frames)) {
  const cam = cameraTransform(st, W, H);
  const base = Math.min(W, H) / 520, z = st.zoom * base; const [fx, fy] = P(st.camX, st.camY, st.camZ);
  const cards = st.accents > 0 ? scene.accentAnchors.map((a, i) => { const [ax, ay] = P(a.x, a.y, a.z); const sx = W / 2 + z * (ax - fx), sy = H / 2 + z * (ay - fy); return `<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${shape === "tall" ? 0.8 : 1})" opacity="${Math.min(1, Math.max(0, st.accents * 4 - i))}">${toSVG(accentCard(a), st)}</g>`; }).join("") : "";
  const sky = st.lights > 0 ? "#f3d7b0" : "#eaf2ef";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${st.lights > 0 ? "#163f50" : "#cfe4e6"}"/><stop offset="1" stop-color="${sky}"/></linearGradient>
<linearGradient id="grade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb35c"/><stop offset="1" stop-color="#1f3f5a"/></linearGradient>
<filter id="story-card-shadow" x="-20%" y="-30%" width="140%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#04141b" flood-opacity=".22"/></filter></defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<g transform="${cam}">${toSVG(scene.world, st)}${toSVG(scene.people, st)}</g>
<rect width="${W}" height="${H}" fill="url(#grade)" opacity="${(st.lights * 0.22).toFixed(3)}" style="mix-blend-mode:multiply"/>
<g transform="${cam}">${toSVG(scene.glows, st)}</g>${cards}</svg>`;
  await pg.setContent(`<!doctype html><style>${css}</style>${svg}`);
  await pg.screenshot({ path: `${out}/${shape}-${name}.png` });
}
// Poster: the finished home, used before the runtime loads and when JavaScript is off.
if (process.argv[4] === "poster") {
  const PW = 1600, PH = 1000, st = frames["6-home"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5e8e8"/><stop offset="1" stop-color="#f4efe2"/></linearGradient></defs><rect width="${PW}" height="${PH}" fill="url(#sky)"/><g transform="${cameraTransform({ ...st, lights: 0.4 }, PW, PH)}">${toSVG(scene.world, { ...st, lights: 0.4 })}</g></svg>`;
  const { writeFileSync } = await import("node:fs");
  writeFileSync("public/art/story-poster.svg", svg);
  console.log("poster", (svg.length / 1024).toFixed(0), "KB");
}
await b.close(); console.log("rendered", Object.keys(frames).length, "frames", shape);
