/**
 * Client runtime for the signature story. Loaded on demand (with GSAP) when the section
 * approaches the viewport. Builds the SVG scene, then lets a scrubbed GSAP timeline direct
 * one state object; every frame applies only the attributes that changed.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { accentCard, buildScene, cameraTransform, communityShot, P, startState, type Anchor, type SNode, type StoryState } from "./scene";

gsap.registerPlugin(ScrollTrigger);

const NS = "http://www.w3.org/2000/svg";
/** Timeline seconds at which each of the seven scenes begins (0–10 overall). */
export const SCENE_STARTS = [0, 1, 2.2, 3.8, 5.4, 7.0, 8.6];
const WAVE_AT = 6.45;
const CLOSING_AT = 9.35;

type Live = { el: Element; d: (s: StoryState) => Record<string, string | number>; last: Record<string, string>; deps: string[] };

/** Which story values a node reads, found by running it once against a recording proxy. */
function depsOf(d: Live["d"], s: StoryState): string[] {
  const seen = new Set<string>();
  const probe = new Proxy(s, { get: (t, k) => { if (typeof k === "string") seen.add(k); return t[k as keyof StoryState]; } });
  d(probe);
  return [...seen];
}

function build(node: SNode, live: Live[], s: StoryState): Element {
  const el = document.createElementNS(NS, node.t);
  for (const [k, v] of Object.entries(node.a ?? {})) el.setAttribute(k, String(v));
  if (node.d) {
    const attrs = node.d(s);
    const last: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) { el.setAttribute(k, String(v)); last[k] = String(v); }
    live.push({ el, d: node.d, last, deps: depsOf(node.d, s) });
  }
  if (node.text) el.textContent = node.text;
  for (const c of node.c ?? []) el.appendChild(build(c, live, s));
  return el;
}

export type StoryCallbacks = { onScene: (index: number) => void; onClosing: (shown: boolean) => void; onProgress: (p: number) => void };

export function mountStory(root: HTMLElement, cb: StoryCallbacks): () => void {
  const stage = root.querySelector<HTMLElement>(".story-stage")!;
  const svg = root.querySelector<SVGSVGElement>("svg.story-svg")!;
  const sky = stage.querySelector<HTMLElement>(".story-sky")!;
  const veil = stage.querySelector<HTMLElement>(".story-veil")!;
  let W = stage.clientWidth, H = stage.clientHeight;
  const lite = W < 700;
  const tall = W / H < 0.9;
  const scene = buildScene({ lite });
  const state = startState();
  // First light: the stage opens in the hero's deep blue and brightens as the visitor scrolls in.
  const light = { dawn: 1 };
  let shown = { dusk: -1, dawn: -1 };
  const live: Live[] = [];

  // ── DOM ────────────────────────────────────────────────────────────────
  svg.replaceChildren();
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `<filter id="story-card-shadow" x="-20%" y="-30%" width="140%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#04141b" flood-opacity=".22"/></filter>
<linearGradient id="story-grade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#993d00" stop-opacity=".1"/><stop offset="1" stop-color="#0a1a2a" stop-opacity=".15"/></linearGradient>`;
  const cam = document.createElementNS(NS, "g");
  cam.appendChild(build(scene.world, live, state));
  cam.appendChild(build(scene.people, live, state));
  const grade = document.createElementNS(NS, "rect");
  grade.setAttribute("fill", "url(#story-grade)");
  // Evening grade: a plain translucent wash tuned to match a 20% multiply (warm top-left, dusk bottom-right)
  // without the cost of a blend mode over the whole scene.
  const accentLayer = document.createElementNS(NS, "g");
  const anchors: Anchor[] = scene.accentAnchors.map((a) => (tall && a.id === "gate" ? { ...a, x: 4.2, y: 15.2, z: 1.8 } : a));
  const cards = anchors.map((a) => {
    const holder = document.createElementNS(NS, "g");
    holder.setAttribute("opacity", "0");
    holder.appendChild(build(accentCard(a), [], state));
    accentLayer.appendChild(holder);
    return { a, holder };
  });
  svg.append(defs, cam, grade, accentLayer);

  // ── Rendering ──────────────────────────────────────────────────────────
  const setSize = () => {
    W = stage.clientWidth; H = stage.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    grade.setAttribute("width", String(W)); grade.setAttribute("height", String(H));
  };
  setSize();
  // Only nodes whose inputs changed are re-evaluated (a pure camera move touches one transform).
  const prev: Record<string, number> = {};
  let firstRender = true;
  const render = () => {
    cam.setAttribute("transform", cameraTransform(state, W, H));
    const changed = new Set<string>();
    for (const k in state) {
      const v = state[k as keyof StoryState];
      if (prev[k] !== v) { changed.add(k); prev[k] = v; }
    }
    for (const n of live) {
      if (!firstRender && !n.deps.some((k) => changed.has(k))) continue;
      const attrs = n.d(state);
      for (const k in attrs) {
        const v = String(attrs[k]);
        if (n.last[k] !== v) { n.el.setAttribute(k, v); n.last[k] = v; }
      }
    }
    firstRender = false;
    if (state.lights !== shown.dusk) {
      grade.setAttribute("opacity", state.lights.toFixed(3));
      sky.style.opacity = state.lights.toFixed(3);
    }
    if (light.dawn !== shown.dawn) {
      veil.style.opacity = (light.dawn * 0.88).toFixed(3);
      const phase = light.dawn > 0.001 ? "rising" : "day";
      if (root.dataset.dawn !== phase) root.dataset.dawn = phase;
    }
    shown = { dusk: state.lights, dawn: light.dawn };
    // accents: counter-scaled cards at projected anchors, clamped inside the stage
    const base = Math.min(W, H) / 520, z = state.zoom * base;
    const [fx, fy] = P(state.camX, state.camY, state.camZ);
    const cardScale = W < 520 ? 0.82 : 1;
    const half = 104 * cardScale, cardH = 50 * cardScale, lift = 90 * cardScale;
    const placed: { x: number; y: number }[] = [];
    const ox = W * (0.5 + state.offX), oy = H * (0.5 + state.offY);
    cards.forEach(({ a, holder }, i) => {
      const o = Math.max(0, Math.min(1, state.accents * 4.2 - i * 0.9));
      if (o <= 0) { holder.setAttribute("opacity", "0"); return; }
      const [ax, ay] = P(a.x, a.y, a.z);
      const sx = ox + z * (ax - fx);
      let sy = oy + z * (ay - fy);
      const cx = Math.min(Math.max(sx, half + 12), W - half - 12);
      // keep each card clear of the cards already placed
      for (let guard = 0; guard < 6; guard++) {
        const top = sy - lift;
        const hit = placed.find((q) => Math.abs(q.x - cx) < half * 2 + 8 && Math.abs(q.y - top) < cardH + 8);
        if (!hit) break;
        sy = hit.y + lift + cardH + 10;
      }
      placed.push({ x: cx, y: sy - lift });
      holder.setAttribute("opacity", o.toFixed(3));
      holder.setAttribute("transform", `translate(${(cx).toFixed(1)} ${(sy + (1 - o) * 10).toFixed(1)}) scale(${cardScale})`);
      const leader = holder.firstElementChild?.firstElementChild;
      if (leader) leader.setAttribute("transform", `translate(${((sx - cx) / cardScale).toFixed(1)} 0)`);
      const dots = holder.firstElementChild?.children;
      if (dots) for (const k of [1, 2]) dots[k]?.setAttribute("transform", `translate(${((sx - cx) / cardScale).toFixed(1)} 0)`);
    });
  };

  // ── Direction ──────────────────────────────────────────────────────────
  // Desktop: frame the subject right of the caption; phones: lift it above the bottom caption.
  const side = () => (W >= 900 ? 0.13 : 0);
  const lift = () => (W < 700 ? -0.1 : 0);
  const camera = { x: state.camX, y: state.camY, z: state.camZ, lz: Math.log(state.zoom), ox: side(), oy: lift() };
  const applyCamera = () => { state.camX = camera.x; state.camY = camera.y; state.camZ = camera.z; state.zoom = Math.exp(camera.lz); state.offX = camera.ox; state.offY = camera.oy; };
  const fit = () => communityShot(W, H);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => { applyCamera(); render(); sceneTick(); } });
  const to = (vars: gsap.TweenVars, at: number, target: object = state) => tl.to(target, vars, at);

  // 1 · The beginning: the camera settles over an empty plot; the survey is pegged out
  tl.set({}, {}, 10);
  to({ dawn: 0, duration: 1.0, ease: "sine.inOut" }, 0, light);
  to({ plot: 1, duration: 0.8, ease: "power2.out" }, 0.1);
  to({ lz: Math.log(1.0), duration: 1.2, ease: "power2.inOut" }, 0, camera);
  // 2 · Foundation: footings trace, the slab rises
  to({ found: 1, duration: 1.15, ease: "power1.inOut" }, 1.0);
  to({ z: 0.4, lz: Math.log(1.06), duration: 1.2, ease: "power1.inOut" }, 1.0, camera);
  // 3 · The house takes shape: walls rise in sequence, openings appear, columns stand
  to({ walls: 1, duration: 1.3, ease: "power1.inOut" }, 2.2);
  to({ openings: 1, duration: 0.7, ease: "power2.out" }, 3.0);
  to({ cols: 1, duration: 0.6, ease: "power2.out" }, 3.15);
  to({ x: 6.8, y: 4.4, z: 1.3, lz: Math.log(1.1), duration: 1.6, ease: "sine.inOut" }, 2.2, camera);
  // 4 · Finishing touches: roof settles, render and glass, the garden, warm light
  to({ roof: 1, duration: 0.9, ease: "power2.out" }, 3.8);
  to({ finish: 1, duration: 0.8, ease: "power1.inOut" }, 4.15);
  to({ glaze: 1, duration: 0.7, ease: "power1.out" }, 4.45);
  to({ garden: 1, duration: 0.9, ease: "power2.out" }, 4.5);
  to({ lights: 1, duration: 0.7, ease: "sine.inOut" }, 5.0);
  to({ x: 6.2, y: 6.2, z: 1.1, lz: Math.log(1.08), duration: 1.4, ease: "sine.inOut" }, 3.9, camera);
  // 5 · A house becomes a home: the door opens, she steps out (the wave plays in real time)
  to({ door: 1, duration: 0.45, ease: "power2.inOut" }, 5.5);
  to({ step: 1, duration: 0.65, ease: "none" }, 5.82);
  to({ x: 6.15, y: 7.85, z: 1.0, lz: Math.log(tall ? 7.2 : 5.0), duration: 1.0, ease: "power2.inOut" }, 5.4, camera);
  // 6 · From home to community: a crane shot back as the neighbourhood appears
  tl.to(camera, { x: () => fit().camX, y: () => fit().camY, z: 0, lz: () => Math.log(fit().zoom), ox: 0, oy: () => (W < 700 ? -0.16 : -0.07), duration: 1.6, ease: "power2.inOut" }, 7.0);
  to({ neighbors: 1, duration: 1.2, ease: "none" }, 7.25);
  to({ community: 1, duration: 1.2, ease: "none" }, 7.35);
  to({ life: 1, duration: 2.1, ease: "none" }, 7.9);
  // 7 · Connected by Kaimbrya
  to({ accents: 1, duration: 0.9, ease: "none" }, 8.7);

  let sceneIndex = -1, closing = false, waved = false;
  const wave = gsap.to(state, { wave: 1, duration: 2.4, ease: "none", paused: true, onUpdate: render });
  function sceneTick() {
    const t = tl.time();
    let i = 0;
    for (let k = 0; k < SCENE_STARTS.length; k++) if (t >= SCENE_STARTS[k]! - 0.05) i = k;
    if (i !== sceneIndex) { sceneIndex = i; cb.onScene(i); }
    const c = t >= CLOSING_AT;
    if (c !== closing) { closing = c; cb.onClosing(c); }
    if (t >= WAVE_AT && !waved) { waved = true; wave.restart(); }
    if (t < WAVE_AT - 0.3 && waved) { waved = false; wave.pause(); gsap.to(state, { wave: 0, duration: 0.35, ease: "power2.out", onUpdate: render }); }
  }

  const st = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.7,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate: (self) => cb.onProgress(self.progress),
    onToggle: (self) => { root.dataset.live = self.isActive ? "true" : "false"; },
  });

  const onResize = () => { setSize(); render(); };
  const ro = new ResizeObserver(onResize);
  ro.observe(stage);
  applyCamera(); render(); sceneTick();
  root.dataset.ready = "true";
  (root as HTMLElement & { __storyTime?: () => number }).__storyTime = () => tl.time();

  return () => {
    ro.disconnect(); st.kill(); tl.kill(); wave.kill();
    svg.replaceChildren();
    delete root.dataset.ready;
    delete root.dataset.dawn;
    sky.style.removeProperty("opacity");
    veil.style.removeProperty("opacity");
  };
}

/** Reduced motion: render a chosen moment instantly (no camera travel, no scrubbing). */
export const REDUCED_FRAMES = ["home", "welcome", "community"] as const;
export function mountStoryStill(root: HTMLElement): { show: (frame: (typeof REDUCED_FRAMES)[number]) => void; destroy: () => void } {
  const stage = root.querySelector<HTMLElement>(".story-stage")!;
  const svg = root.querySelector<SVGSVGElement>("svg.story-svg")!;
  const W = stage.clientWidth, H = stage.clientHeight;
  const scene = buildScene({ lite: W < 700 });
  const state = startState();
  const live: Live[] = [];
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `<filter id="story-card-shadow" x="-20%" y="-30%" width="140%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#04141b" flood-opacity=".22"/></filter>`;
  const cam = document.createElementNS(NS, "g");
  cam.appendChild(build(scene.world, live, state));
  cam.appendChild(build(scene.people, live, state));
  svg.append(defs, cam);
  const done = { plot: 1, found: 1, walls: 1, cols: 1, openings: 1, roof: 1, finish: 1, glaze: 1, garden: 1 };
  const frames: Record<(typeof REDUCED_FRAMES)[number], Partial<StoryState>> = {
    home: { ...done, lights: 0.6, camX: 6.2, camY: 6.2, camZ: 1.1, zoom: 1.08 },
    welcome: { ...done, lights: 1, door: 1, step: 1, wave: 0.45, camX: 6.15, camY: 7.85, camZ: 1, zoom: W / H < 0.9 ? 6.4 : 5.2 },
    community: { ...done, lights: 1, door: 1, step: 1, wave: 1, neighbors: 1, community: 1, life: 1, ...communityShot(W, H) },
  };
  const show = (f: (typeof REDUCED_FRAMES)[number]) => {
    Object.assign(state, startState(), frames[f]);
    cam.setAttribute("transform", cameraTransform(state, W, H));
    for (const n of live) for (const [k, v] of Object.entries(n.d(state))) n.el.setAttribute(k, String(v));
  };
  root.dataset.ready = "true";
  return { show, destroy: () => { svg.replaceChildren(); delete root.dataset.ready; } };
}
