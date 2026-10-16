/**
 * "Where communities come to life": the signature story scene.
 *
 * A tiny isometric engine. Everything is real 3D geometry (metres) projected to SVG, and every
 * moving part is a pure function of one `StoryState`. GSAP directs the film by tweening that state;
 * the same code renders the static poster and the reduced-motion frames. No imports, so build
 * scripts can load it directly with Node.
 */

// ── State ───────────────────────────────────────────────────────────────────
export type StoryState = {
  plot: number; found: number; walls: number; cols: number; openings: number;
  roof: number; finish: number; glaze: number; garden: number; lights: number;
  door: number; step: number; wave: number;
  neighbors: number; community: number; life: number; accents: number;
  camX: number; camY: number; camZ: number; zoom: number;
  /** Screen offset of the focus point as a fraction of the stage (to clear the caption). */
  offX: number; offY: number;
};
export const STATE_KEYS = ["plot", "found", "walls", "cols", "openings", "roof", "finish", "glaze", "garden", "lights", "door", "step", "wave", "neighbors", "community", "life", "accents"] as const;

export const startState = (): StoryState => ({
  plot: 0, found: 0, walls: 0, cols: 0, openings: 0, roof: 0, finish: 0, glaze: 0, garden: 0, lights: 0,
  door: 0, step: 0, wave: 0, neighbors: 0, community: 0, life: 0, accents: 0,
  camX: 6, camY: 5, camZ: 0, zoom: 0.48, offX: 0, offY: 0,
});
export const endState = (fit: { camX: number; camY: number; camZ: number; zoom: number }): StoryState => ({
  plot: 1, found: 1, walls: 1, cols: 1, openings: 1, roof: 1, finish: 1, glaze: 1, garden: 1, lights: 1,
  door: 1, step: 1, wave: 1, neighbors: 1, community: 1, life: 1, accents: 1, offX: 0, offY: 0, ...fit,
});

// ── Geometry ────────────────────────────────────────────────────────────────
export const U = 20;
const C30 = Math.cos(Math.PI / 6);
type V2 = [number, number];
type V3 = [number, number, number];
export const P = (x: number, y: number, z = 0): V2 => [(x - y) * C30 * U, (x + y) * 0.5 * U - z * U];
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();
const poly = (ps: V2[]) => "M" + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L") + "Z";
const line = (ps: V2[]) => "M" + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L");
const proj = (ps: V3[]) => ps.map(([x, y, z]) => P(x, y, z));
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Progress of `v` through the window [a, b], clamped to 0..1. */
export const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** SVG matrix that maps face-local 2D (u along the wall, v up) onto a vertical wall face. */
function faceMatrix(face: "front" | "right", ox: number, oy: number, oz: number) {
  const [e, f] = P(ox, oy, oz);
  return face === "front"
    ? `matrix(${f1(C30 * U)} ${f1(0.5 * U)} 0 ${-U} ${f1(e)} ${f1(f)})`
    : `matrix(${f1(C30 * U)} ${f1(-0.5 * U)} 0 ${-U} ${f1(e)} ${f1(f)})`;
}

// ── Colour ──────────────────────────────────────────────────────────────────
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
export function mix(a: string, b: string, t: number) {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i]! - v) * t).toString(16).padStart(2, "0")).join("");
}
const SHADE = "#0b2a35";
const tone = (base: string, face: "top" | "right" | "front") => (face === "top" ? base : mix(base, SHADE, face === "right" ? 0.13 : 0.27));

const C = {
  lawn: "#a8cf8e", lawnDeep: "#93bf7a", soil: "#9b7652", soilDark: "#7a5a3c",
  concrete: "#d3d6d2", render: "#f6f0e4", sand: "#ead9bb",
  roof: "#24667c", roofDark: "#1b5164", seam: "#2e7891",
  timber: "#a8703f", timberDark: "#7c4f2a", door: "#8a5530",
  glass: "#a9d3df", glassDeep: "#5c97ab", glow: "#ffd38a", interior: "#3a2a20",
  paving: "#ece6da", drive: "#ddd5c6", road: "#5f6c72", roadEdge: "#c9cdc6", mark: "#f3ead6",
  hedge: "#3f8a5c", leaf: "#2f7d57", leafLight: "#4f9a6a", leafDark: "#24603f", trunk: "#8a6a4a",
  flower: "#e0574c", flower2: "#f1c27d", pool: "#7fc8d6", poolDeep: "#4aa6ba",
  teal: "#1f5f75", ink: "#15232d", white: "#ffffff",
};

// ── Node tree ───────────────────────────────────────────────────────────────
type Attrs = Record<string, string | number>;
export type SNode = { t: string; a?: Attrs; d?: (s: StoryState) => Attrs; c?: SNode[]; text?: string; cls?: string };
const g = (c: SNode[], a?: Attrs, d?: SNode["d"]): SNode => ({ t: "g", a, d, c });
const p = (dPath: string, fill: string, extra?: Attrs): SNode => ({ t: "path", a: { d: dPath, fill, ...extra } });
const dyn = (d: (s: StoryState) => Attrs, a?: Attrs, t = "path"): SNode => ({ t, a, d });

/** Axis-aligned box. `grow` scales its height (0..1); `fill` may change with state. */
function box(x: number, y: number, z: number, w: number, dd: number, h: number, base: string | ((s: StoryState) => string), opts: { grow?: (s: StoryState) => number; edge?: string } = {}): SNode {
  const faces = (gh: number) => {
    const x1 = x + w, y1 = y + dd, z1 = z + h * gh;
    return {
      top: poly(proj([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]])),
      right: poly(proj([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]])),
      front: poly(proj([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]])),
    };
  };
  const stroke: Attrs = opts.edge ? { stroke: opts.edge, "stroke-width": 0.6, "stroke-linejoin": "round" } : {};
  if (!opts.grow && typeof base === "string") {
    const f = faces(1);
    return g([p(f.right, tone(base, "right"), stroke), p(f.front, tone(base, "front"), stroke), p(f.top, base, stroke)]);
  }
  const grow = opts.grow ?? (() => 1);
  const col = typeof base === "string" ? () => base : base;
  return g(
    (["right", "front", "top"] as const).map((face) =>
      dyn((s) => {
        const gh = grow(s);
        return { d: gh <= 0.001 ? "M0 0" : faces(gh)[face], fill: tone(col(s), face), ...stroke };
      }),
    ),
    undefined,
    (s) => ({ opacity: grow(s) <= 0.001 ? 0 : 1 }),
  );
}

/** Soft cast shadow of a box on the ground (sun from back-right). */
function shadow(x: number, y: number, w: number, dd: number, h: number, grow?: (s: StoryState) => number, alpha = 0.16): SNode {
  const make = (hh: number) => {
    const ox = -0.55 * hh, oy = 0.42 * hh;
    const pts: [number, number][] = [[x, y], [x + w, y], [x + w, y + dd], [x, y + dd], [x + ox, y + oy], [x + w + ox, y + oy], [x + w + ox, y + dd + oy], [x + ox, y + dd + oy]];
    return poly(hull(pts).map(([a, b]) => P(a, b, 0)));
  };
  if (!grow) return p(make(h), SHADE, { opacity: alpha });
  return dyn((s) => ({ d: make(h * grow(s)), fill: SHADE, opacity: alpha * clamp(grow(s) * 3) }));
}
function hull(points: [number, number][]): [number, number][] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0]! - o[0]!) * (b[1]! - o[1]!) - (a[1]! - o[1]!) * (b[0]! - o[0]!);
  const lower: [number, number][] = [], upper: [number, number][] = [];
  for (const q of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, q) <= 0) lower.pop(); lower.push(q); }
  for (const q of [...pts].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, q) <= 0) upper.pop(); upper.push(q); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** Hip roof over an eave rectangle; returns [front face, right face] paths and seam lines. */
function hipRoof(x0: number, y0: number, x1: number, y1: number, z: number, rise: number) {
  const W = y1 - y0, L = x1 - x0, half = Math.min(W, L) / 2;
  const top = z + rise;
  const rx0 = x0 + half, rx1 = x1 - half, ry = (y0 + y1) / 2;
  const front = poly(proj([[x0, y1, z], [x1, y1, z], [rx1, ry, top], [rx0, ry, top]]));
  const right = poly(proj([[x1, y0, z], [x1, y1, z], [rx1, ry, top]]));
  const back = poly(proj([[x0, y0, z], [x1, y0, z], [rx1, ry, top], [rx0, ry, top]]));
  const left = poly(proj([[x0, y0, z], [x0, y1, z], [rx0, ry, top]]));
  const seams: string[] = [];
  for (let x = x0 + 0.55; x < x1 - 0.2; x += 0.55) {
    const yTop = x < rx0 ? y1 - (x - x0) : x > rx1 ? y1 - (x1 - x) : ry;
    const zTop = z + ((y1 - yTop) / (W / 2)) * rise;
    seams.push(line(proj([[x, y1, z], [x, yTop, zTop]])));
  }
  const rseams: string[] = [];
  for (let y = y0 + 0.55; y < y1 - 0.2; y += 0.55) {
    const xTop = x1 - Math.min(y - y0, y1 - y, half);
    const zTop = z + ((x1 - xTop) / half) * rise;
    rseams.push(line(proj([[x1, y, z], [xTop, y, zTop]])));
  }
  return { front, right, back, left, seams: seams.join(""), rseams: rseams.join(""), ridge: line(proj([[rx0, ry, top], [rx1, ry, top]])) };
}

// ── Plants and people (billboards drawn in local units at a projected ground point) ──
function palm(x: number, y: number, h: number, seed: number, grow?: (s: StoryState) => number): SNode {
  const [bx, by] = P(x, y, 0);
  const sc = h * U / 100;
  const lean = ((seed * 37) % 9) - 4;
  const frond = (ang: number, len: number, col: string) => {
    const r = (ang * Math.PI) / 180;
    const ex = Math.cos(r) * len, ey = Math.sin(r) * len;
    const mx = ex * 0.5 - ey * 0.18, my = ey * 0.5 - Math.abs(ex) * 0.22 - 6;
    return p(`M0 0Q${f1(mx)} ${f1(my - 8)} ${f1(ex)} ${f1(ey + 10)}Q${f1(mx)} ${f1(my + 6)} 0 0Z`, col);
  };
  const crown = g([
    frond(-160, 34, C.leafDark), frond(-20, 34, C.leafDark), frond(-125, 38, C.leaf), frond(-55, 38, C.leaf),
    frond(-95, 30, C.leafLight), frond(170, 30, C.leaf), frond(10, 30, C.leaf), frond(-140, 24, C.leafLight), frond(-40, 26, C.leafLight),
    { t: "circle", a: { cx: 0, cy: 0, r: 3.2, fill: C.timberDark } },
  ], { class: "story-sway", style: `--sway-delay:${-(seed % 5)}s` });
  const trunk = p(`M-2.4 0Q${lean * 0.6} -55 ${lean} -100L${lean + 3.2} -100Q${lean * 0.6 + 3} -55 2.4 0Z`, C.trunk);
  const rings = { t: "path", a: { d: [20, 40, 60, 80].map((v) => `M${f1(-2 + (lean * v) / 100 * 0.8)} ${-v}l4 -1`).join(""), fill: "none", stroke: C.timberDark, "stroke-width": 0.8, opacity: 0.5 } } as SNode;
  const body = g([trunk, rings, g([crown], { transform: `translate(${f1(lean + 1.6)} -100)` })]);
  const groundShadow: SNode = { t: "ellipse", a: { cx: -18, cy: 4, rx: 22, ry: 6, fill: SHADE, opacity: 0.12 } };
  const inner = g([groundShadow, body], { transform: `translate(${f1(bx)} ${f1(by)}) scale(${(Math.round(sc * 100) / 100).toString()})` });
  if (!grow) return inner;
  return g([inner], undefined, (s) => {
    const k = easeOut(grow(s));
    return { opacity: k <= 0.001 ? 0 : 1, transform: `translate(${f1(bx)} ${f1(by)}) scale(${(0.55 + 0.45 * k).toFixed(3)}) translate(${f1(-bx)} ${f1(-by)})` };
  });
}

function tree(x: number, y: number, h: number, seed: number, grow?: (s: StoryState) => number, hue = 0): SNode {
  const [bx, by] = P(x, y, 0);
  const sc = (h * U) / 100;
  const cols = [mix(C.leaf, "#5a8f3c", hue), mix(C.leafLight, "#7aa84d", hue), mix(C.leafDark, "#33602a", hue)];
  const blobs: SNode[] = [
    { t: "ellipse", a: { cx: -30, cy: 6, rx: 34, ry: 9, fill: SHADE, opacity: 0.12 } },
    p("M-3 0L-2 -46L2 -46L3 0Z", C.trunk),
    { t: "circle", a: { cx: -12, cy: -58, r: 24, fill: cols[2]! } },
    { t: "circle", a: { cx: 12, cy: -60, r: 22, fill: cols[0]! } },
    { t: "circle", a: { cx: 0, cy: -76, r: 24, fill: cols[0]! } },
    { t: "circle", a: { cx: -4, cy: -80, r: 15, fill: cols[1]! } },
    { t: "circle", a: { cx: 14, cy: -66, r: 9, fill: cols[1]!, opacity: 0.9 } },
  ];
  const inner = g(blobs, { transform: `translate(${f1(bx)} ${f1(by)}) scale(${(Math.round(sc * 100) / 100).toString()}) rotate(${(seed % 3) - 1})` });
  if (!grow) return inner;
  return g([inner], undefined, (s) => {
    const k = easeOut(grow(s));
    return { opacity: k <= 0.001 ? 0 : 1, transform: `translate(${f1(bx)} ${f1(by)}) scale(${(0.4 + 0.6 * k).toFixed(3)}) translate(${f1(-bx)} ${f1(-by)})` };
  });
}

function shrub(x: number, y: number, r: number, col: string, flowers: string | null, grow: (s: StoryState) => number, delay = 0): SNode {
  const [bx, by] = P(x, y, 0);
  const s = (r * U) / 10;
  const kids: SNode[] = [
    { t: "ellipse", a: { cx: -4, cy: 2, rx: 12, ry: 4, fill: SHADE, opacity: 0.12 } },
    { t: "circle", a: { cx: -5, cy: -6, r: 7, fill: mix(col, SHADE, 0.2) } },
    { t: "circle", a: { cx: 4, cy: -6, r: 7, fill: col } },
    { t: "circle", a: { cx: 0, cy: -11, r: 7, fill: mix(col, "#ffffff", 0.12) } },
  ];
  if (flowers) kids.push(...[[-5, -9], [3, -13], [6, -5], [-1, -5]].map(([cx, cy]) => ({ t: "circle", a: { cx: cx!, cy: cy!, r: 1.6, fill: flowers } }) as SNode));
  return g([g(kids, { transform: `scale(${(Math.round(s * 100) / 100).toString()})` })], undefined, (st) => {
    const k = easeOut(seg(grow(st), delay, delay + 0.5));
    return { opacity: k <= 0.001 ? 0 : 1, transform: `translate(${f1(bx)} ${f1(by)}) scale(${(0.3 + 0.7 * k).toFixed(3)})` };
  });
}

/** A small walking figure for community life (billboard). */
function walker(col: string, skin: string): SNode {
  return g([
    { t: "ellipse", a: { cx: -3, cy: 1, rx: 5, ry: 1.6, fill: SHADE, opacity: 0.15 } },
    p("M-2.2 0L-1.6 -9L1.6 -9L2.2 0L0.9 0L0 -6L-0.9 0Z", "#e8dfcf"),
    p("M-2.6 -9L-2.2 -17L2.2 -17L2.6 -9Z", col),
    { t: "circle", a: { cx: 0, cy: -19.6, r: 2.6, fill: skin } },
  ]);
}

/**
 * The resident: drawn at 100 units tall (feet at 0). Natural proportions, editorial style;
 * her right arm is rigged at the shoulder and elbow for the wave.
 */
function resident(): SNode {
  const skin = "#7b4a2d", skinShade = "#5f3720", hair = "#24170f";
  const top = "#3f8f78", topShade = "#2f7462", trousers = "#efe5d3", trousersShade = "#d9ccb5";
  return g([
    { t: "ellipse", a: { cx: -6, cy: 1, rx: 20, ry: 4.5, fill: SHADE, opacity: 0.18 } },
    // legs (wide-leg linen trousers) with a gentle step
    g([p("M-9.5 -46L-11 -1L-3 -1L-1.2 -46Z", trousersShade), p("M-11 -2.5L-3 -2.5L-2.6 0L-12 0Z", "#b5875a")], undefined, (s) => ({ transform: `rotate(${(Math.sin(seg(s.step, 0.2, 0.95) * Math.PI * 3) * 5).toFixed(2)} -5 -46)` })),
    g([p("M1.2 -46L3 -1L11 -1L9.5 -46Z", trousers), p("M3 -2.5L11 -2.5L12 0L2.6 0Z", "#c4966a")], undefined, (s) => ({ transform: `rotate(${(-Math.sin(seg(s.step, 0.2, 0.95) * Math.PI * 3) * 5).toFixed(2)} 5 -46)` })),
    // torso
    p("M-11 -47Q-12.5 -66 -10.5 -76Q-6 -80 0 -80.5Q6 -80 10.5 -76Q12.5 -66 11 -47Z", top),
    p("M3 -79Q10 -76 10.5 -70Q12 -60 11 -47L6 -47Q8 -62 3 -79Z", topShade),
    p("M-11.5 -48L11.5 -48L11 -45L-11 -45Z", "#2f7462"),
    // left arm, relaxed
    p("M10.4 -76Q14.5 -70 14 -60L13.4 -48Q13 -46 11.4 -46.5L10.8 -60Q10.6 -68 8.6 -73Z", skin),
    p("M10 -77Q14 -75 14.6 -69L10.8 -67Z", top),
    // right arm: shoulder (-9,-75); upper arm, then forearm + hand around the elbow
    g([
      p("M-8 -78Q-12.5 -77 -13.5 -71L-11.6 -66.5L-8.6 -71Z", top),
      p("M-11 -74Q-14.5 -66 -14 -58.5L-10.6 -58.2Q-10.6 -66 -8 -72Z", skin),
      g([
        p("M-14 -59.2Q-14.4 -51 -13.4 -46.5L-10.6 -46.5Q-10.4 -51 -10.6 -58.6Z", skin),
        p("M-14.6 -47Q-15.6 -44.6 -15 -41.8L-14.2 -39.2Q-13.6 -38.6 -13.2 -39.4L-13.2 -41.2L-12.6 -38.4Q-12 -37.8 -11.6 -38.6L-11.8 -41.4L-11 -39Q-10.4 -38.6 -10.1 -39.4L-10.4 -42.2Q-9.2 -42 -8.8 -43.2Q-9.6 -44.6 -10.4 -46.6Z", skin),
      ], undefined, (s) => ({ transform: `rotate(${waveForearm(s.wave).toFixed(2)} -12.3 -58.6)` })),
    ], undefined, (s) => ({ transform: `rotate(${waveShoulder(s.wave).toFixed(2)} -9 -75)` })),
    // neck and head
    p("M-2.6 -80.5L-2.2 -85L2.2 -85L2.6 -80.5Z", skinShade),
    g([
      p("M-5.8 -92Q-6.6 -99 0 -99.5Q6.6 -99 5.8 -92Q5.4 -85.6 0 -84.6Q-5.4 -85.6 -5.8 -92Z", skin),
      p("M0 -84.6Q5.4 -85.6 5.8 -92L3 -91Q2.6 -86.8 0 -84.6Z", skinShade, { opacity: 0.5 }),
      // gentle features: smiling eyes, a soft smile, a hint of nose and cheek light
      { t: "path", a: { d: "M-3.3 -92.6Q-2.4 -93.6 -1.5 -92.6M1.5 -92.6Q2.4 -93.6 3.3 -92.6", fill: "none", stroke: "#2a160c", "stroke-width": 0.55, "stroke-linecap": "round" } },
      { t: "path", a: { d: "M-1.7 -88.4Q0 -86.9 1.7 -88.4", fill: "none", stroke: "#3b1d10", "stroke-width": 0.6, "stroke-linecap": "round" } },
      { t: "path", a: { d: "M0.2 -91.6Q0.9 -90.2 0.1 -89.7", fill: "none", stroke: skinShade, "stroke-width": 0.5, "stroke-linecap": "round" } },
      { t: "ellipse", a: { cx: -3.2, cy: -90.4, rx: 1.2, ry: 0.7, fill: "#a5603d", opacity: 0.35 } },
      { t: "ellipse", a: { cx: 3.3, cy: -90.4, rx: 1.2, ry: 0.7, fill: "#a5603d", opacity: 0.35 } },
      p("M-7.6 -95Q-9.4 -103.5 -2 -105.4Q6.8 -107 8.6 -99.4Q9.4 -94 7 -91.6Q6.6 -96.6 3.6 -98.4Q-2.6 -98.6 -6 -96.2Q-6.6 -93 -6.8 -91.4Q-8 -92.6 -7.6 -95Z", hair),
      { t: "circle", a: { cx: 2.6, cy: -104.4, r: 4.6, fill: hair } },
      { t: "circle", a: { cx: -6.1, cy: -91.4, r: 0.9, fill: C.flower2 } },
    ], undefined, (s) => ({ transform: `rotate(${(Math.sin(seg(s.wave, 0.15, 0.9) * Math.PI * 2) * 2.4 - seg(s.wave, 0, 0.2) * 2).toFixed(2)} 0 -85)` })),
  ]);
}
/** Shoulder: raise (anticipation) then hold; lowers slightly at the end. */
function waveShoulder(w: number) {
  const up = easeInOut(seg(w, 0, 0.22));
  const down = easeInOut(seg(w, 0.86, 1));
  return 122 * up - 26 * down;
}
/** Elbow: three natural waves that decay, a little overlap with the raise. */
function waveForearm(w: number) {
  const t = seg(w, 0.16, 0.86);
  const amp = 22 * (1 - t * 0.55) * smooth(seg(w, 0.14, 0.24));
  return 58 * easeInOut(seg(w, 0.04, 0.24)) + Math.sin(t * Math.PI * 6) * amp - 8 * easeInOut(seg(w, 0.86, 1));
}

// ── Neighbours ──────────────────────────────────────────────────────────────
type NeighborSpec = { x: number; y: number; w: number; d: number; h: number; roof: string; wall: string; order: number; pool?: boolean; facing?: "front" | "back" };
function neighborHouse(n: NeighborSpec): { depth: number; node: SNode; shadowNode: SNode } {
  const appear = (s: StoryState) => easeOut(seg(s.neighbors * 1.45 - n.order * 0.075, 0, 0.5));
  const roofIn = (s: StoryState) => easeOut(seg(s.neighbors * 1.45 - n.order * 0.075, 0.32, 0.62));
  const slab = box(n.x - 0.6, n.y - 0.6, 0, n.w + 1.2, n.d + 1.2, 0.35, C.concrete, { grow: (s) => clamp(appear(s) * 3) });
  const block = box(n.x, n.y, 0.35, n.w, n.d, n.h, n.wall, { grow: (s) => appear(s), edge: mix(n.wall, SHADE, 0.35) });
  const r = hipRoof(n.x - 0.45, n.y - 0.45, n.x + n.w + 0.45, n.y + n.d + 0.45, 0.35 + n.h, Math.min(n.w, n.d) * 0.3);
  const roof = g([
    p(r.back, mix(n.roof, "#ffffff", 0.1)), p(r.left, mix(n.roof, SHADE, 0.05)), p(r.right, tone(n.roof, "right")), p(r.front, tone(n.roof, "top")),
    p(r.seams + r.rseams, "none", { stroke: mix(n.roof, "#ffffff", 0.18), "stroke-width": 0.5, opacity: 0.55 }),
  ], undefined, (s) => ({ opacity: roofIn(s), transform: `translate(0 ${f1(-(1 - roofIn(s)) * 40)})` }));
  // windows on the two visible faces
  const decor: SNode[] = [];
  const winF = (u: number, v: number, w: number, h: number) => ({ t: "rect", a: { x: u, y: v, width: w, height: h, fill: C.glassDeep } }) as SNode;
  const frontWins: SNode[] = [];
  for (let u = 0.8; u < n.w - 1.2; u += 2.6) frontWins.push(winF(u, 1.0, 1.4, 1.3));
  frontWins.push({ t: "rect", a: { x: n.w / 2 - 0.5, y: 0, width: 1.0, height: 2.1, fill: C.door } });
  decor.push(g(frontWins, { transform: faceMatrix("front", n.x, n.y + n.d, 0.35) }));
  const rightWins: SNode[] = [];
  for (let u = 0.8; u < n.d - 1.2; u += 2.6) rightWins.push(winF(u, 1.0, 1.4, 1.3));
  decor.push(g(rightWins, { transform: faceMatrix("right", n.x + n.w, n.y + n.d, 0.35) }));
  const deco = g(decor, undefined, (s) => ({ opacity: seg(appear(s), 0.85, 1) }));
  const glowWins: SNode[] = [];
  for (let u = 0.8; u < n.w - 1.2; u += 5.2) glowWins.push({ t: "rect", a: { x: u, y: 1.0, width: 1.4, height: 1.3, fill: C.glow } });
  const glow = g([g(glowWins, { transform: faceMatrix("front", n.x, n.y + n.d, 0.35) })], undefined, (s) => ({ opacity: 0.85 * seg(appear(s), 0.9, 1) * s.lights }));
  const kids: SNode[] = [];
  if (n.pool) {
    const px = n.x + 1, py = n.y - 5.5;
    kids.push(p(poly(proj([[px - 0.4, py - 0.4, 0.02], [px + 5.4, py - 0.4, 0.02], [px + 5.4, py + 3.4, 0.02], [px - 0.4, py + 3.4, 0.02]])), C.paving));
    kids.push(p(poly(proj([[px, py, 0.03], [px + 5, py, 0.03], [px + 5, py + 3, 0.03], [px, py + 3, 0.03]])), C.pool));
    kids.push(p(poly(proj([[px, py, 0.03], [px + 5, py, 0.03], [px + 4.6, py + 0.5, 0.03], [px + 0.4, py + 0.5, 0.03]])), C.poolDeep, { opacity: 0.6 }));
  }
  const node = g([...kids, g([slab, block, deco, glow, roof])], undefined, (s) => ({ opacity: seg(s.neighbors * 1.45 - n.order * 0.075, 0, 0.08) }));
  return { depth: n.x + n.w / 2 + n.y + n.d / 2, node, shadowNode: shadow(n.x, n.y, n.w, n.d, n.h + 1.5, (s) => appear(s)) };
}

// ── The world ───────────────────────────────────────────────────────────────
export type Anchor = { id: string; x: number; y: number; z: number; title: string; text: string; icon: "gate" | "bell" | "receipt" | "doc" };
export const ACCENTS: Anchor[] = [
  { id: "gate", x: -57, y: 15.5, z: 4.2, title: "Guest approved", text: "Lot 23 · arriving 2:00 PM", icon: "gate" },
  { id: "notice", x: 42, y: 3.5, z: 6.4, title: "New notice", text: "From the board", icon: "bell" },
  { id: "fees", x: 6, y: 3.5, z: 7.6, title: "Dues paid · October", text: "Receipt in the owner's app", icon: "receipt" },
  { id: "library", x: -12, y: 27.5, z: 6.2, title: "Budget 2027 in the Library", text: "Shared with every owner", icon: "doc" },
];

/** World bounds used to frame the final community shot (metres). */
export const COMMUNITY_BOUNDS = { wide: { x0: -64, x1: 62, y0: -26, y1: 38 }, tall: { x0: -26, x1: 34, y0: -14, y1: 30 } };

export type Scene = { world: SNode; glows: SNode; people: SNode; accentAnchors: Anchor[] };

export function buildScene(opts: { lite?: boolean } = {}): Scene {
  const lite = Boolean(opts.lite);
  const ground: SNode[] = [], paths: SNode[] = [], shadows: SNode[] = [];
  const objects: { depth: number; node: SNode }[] = [];

  // Ground: a diorama island of lawn with earth sides
  const G = { x0: -70, x1: 70, y0: -32, y1: 44 };
  ground.push(p(poly(proj([[G.x0, G.y1, 0], [G.x1, G.y1, 0], [G.x1, G.y1, -3], [G.x0, G.y1, -3]])), C.soil));
  ground.push(p(poly(proj([[G.x1, G.y0, 0], [G.x1, G.y1, 0], [G.x1, G.y1, -3], [G.x1, G.y0, -3]])), mix(C.soil, "#ffffff", 0.08)));
  ground.push(p(poly(proj([[G.x0, G.y1, -2.2], [G.x1, G.y1, -2.2], [G.x1, G.y1, -3], [G.x0, G.y1, -3]])), C.soilDark, { opacity: 0.5 }));
  ground.push(p(poly(proj([[G.x0, G.y0, 0], [G.x1, G.y0, 0], [G.x1, G.y1, 0], [G.x0, G.y1, 0]])), C.lawn));
  // mown stripes for texture
  const stripes: string[] = [];
  for (let x = G.x0 + 4; x < G.x1; x += 8) stripes.push(poly(proj([[x, G.y0, 0], [x + 4, G.y0, 0], [x + 4, G.y1, 0], [x, G.y1, 0]])));
  ground.push(p(stripes.join(""), C.lawnDeep, { opacity: 0.35 }));

  // ── Hero lot: survey, foundation, house ────────────────────────────────
  const survey = g([
    p(line(proj([[0, 0, 0.02], [12, 0, 0.02], [12, 9, 0.02], [0, 9, 0.02], [0, 0, 0.02]])), "none", { stroke: C.white, "stroke-width": 1.4, "stroke-dasharray": "5 4", "stroke-linecap": "round" }),
    ...([[0, 0], [12, 0], [12, 9], [0, 9]] as const).map(([x, y]) => {
      const [sx, sy] = P(x, y, 0);
      return g([p("M-1 0L-1 -9L1 -9L1 0Z", "#c98a2b"), p("M-1 -9L1 -9L1 -7L-1 -7Z", "#e0574c")], { transform: `translate(${f1(sx)} ${f1(sy)})` });
    }),
  ], undefined, (s) => ({ opacity: seg(s.plot, 0, 0.6) * (1 - seg(s.found, 0.5, 0.9)) }));

  const house: SNode[] = [];
  // footing trenches draw first, then the slab rises
  house.push(dyn((s) => ({ d: line(proj([[0.3, 0.3, 0.03], [11.7, 0.3, 0.03], [11.7, 9.2, 0.03], [0.3, 9.2, 0.03], [0.3, 0.3, 0.03]])), fill: "none", stroke: "#8a7a64", "stroke-width": 2.4, "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": (1 - seg(s.found, 0, 0.45)).toFixed(3), opacity: 1 - seg(s.found, 0.7, 1) })));
  house.push(box(0, 0, 0, 12, 9.4, 0.4, (s) => mix(C.concrete, "#e9e3d6", s.finish), { grow: (s) => easeOut(seg(s.found, 0.35, 1)), edge: "#b9bbb6" }));
  // rebar hint on the slab while it cures
  house.push(dyn((s) => ({ d: [1, 2.5, 4, 5.5, 7, 8.5].map((y) => line(proj([[0.6, y, 0.41], [11.4, y, 0.41]]))).join(""), fill: "none", stroke: "#9aa29e", "stroke-width": 0.6, opacity: (seg(s.found, 0.8, 1) * (1 - seg(s.walls, 0, 0.3)) * 0.8).toFixed(3) })));

  const wallCol = (s: StoryState) => mix(C.concrete, C.render, easeInOut(s.finish));
  const H = 3.5, Z0 = 0.4;
  const wall = (x: number, y: number, w: number, d: number, i: number) =>
    box(x, y, Z0, w, d, H, wallCol, { grow: (s) => easeInOut(seg(s.walls * 1.35 - i * 0.08, 0, 1)), edge: "#c2c0b8" });
  house.push(wall(1, 1, 10, 0.25, 0));        // back
  house.push(wall(1, 1.25, 0.25, 5.75, 1));   // left
  house.push(wall(6, 1.25, 0.18, 3.2, 2));    // partition
  house.push(wall(4, 4.3, 2, 0.18, 2.5));     // partition
  house.push(wall(10.75, 1.25, 0.25, 5.75, 3)); // right
  house.push(wall(1, 6.75, 10, 0.25, 4));     // front

  // Openings on the front wall (+y face at y = 7): recesses first, then frames, glass, shutters, door
  const frontDecor: SNode[] = [];
  const recess = (u: number, v: number, w: number, h: number): SNode => ({ t: "rect", a: { x: u, y: v, width: w, height: h, fill: C.interior } });
  const windowAt = (u: number, w: number, sill: number, h: number, curtain: boolean, key: string): SNode => g([
    recess(u, sill, w, h),
    dyn((s) => ({ x: u + 0.06, y: sill + 0.06, width: w - 0.12, height: h - 0.12, fill: mix(mix(C.glassDeep, C.glass, s.glaze), C.glow, s.lights * 0.85), opacity: seg(s.glaze, 0, 0.6).toFixed(3) }), undefined, "rect"),
    ...(curtain ? [dyn((s) => ({ d: `M${u + 0.1} ${sill + h - 0.1}L${u + 0.62} ${sill + h - 0.1}Q${u + 0.5} ${sill + h * 0.5} ${u + 0.58} ${sill + 0.1}L${u + 0.1} ${sill + 0.1}Z`, fill: "#f7ecd8", opacity: (seg(s.lights, 0, 1) * 0.9).toFixed(3) }), { class: "story-curtain" })] : []),
    dyn((s) => ({ d: `M${u + w * 0.62} ${sill + h - 0.08}L${u + w * 0.78} ${sill + h - 0.08}L${u + w * 0.42} ${sill + 0.08}L${u + w * 0.26} ${sill + 0.08}Z`, fill: "#ffffff", opacity: (seg(s.glaze, 0.4, 1) * 0.28 * (1 - s.lights * 0.7)).toFixed(3) })),
    { t: "path", a: { d: `M${u} ${sill}h${w}v${h}h${-w}Z M${u + w / 2} ${sill}v${h}`, fill: "none", stroke: C.white, "stroke-width": 0.09 } },
    { t: "rect", a: { x: u - 0.12, y: sill - 0.12, width: w + 0.24, height: 0.12, fill: "#e4dccd" } },
  ], { "data-key": key });
  // Shutters need children: build them separately below
  const shutter = (x: number, sill: number, h: number): SNode => g([
    { t: "rect", a: { x: 0, y: 0, width: 0.62, height: h, fill: C.timber } },
    { t: "path", a: { d: Array.from({ length: Math.floor(h / 0.16) }, (_, i) => `M0.06 ${((i + 0.5) * 0.16).toFixed(2)}h0.5`).join(""), fill: "none", stroke: C.timberDark, "stroke-width": 0.04 } },
  ], undefined, (s) => ({ opacity: seg(s.glaze, 0.3, 1).toFixed(3), transform: `translate(${x} ${sill}) scale(${(0.3 + 0.7 * easeOut(seg(s.glaze, 0.3, 1))).toFixed(3)} 1)` }));
  const trims = (spans: [number, number][], len: number): SNode[] => [
    dyn((s) => ({ x: 0, y: 0, width: len, height: 0.24, fill: mix("#c9c3b8", "#cdbfa6", s.finish), opacity: seg(s.finish, 0, 0.6).toFixed(3) }), undefined, "rect"),
    ...spans.map(([u, w]) => dyn((s) => ({ x: u - 0.14, y: 2.42, width: w + 0.28, height: 0.14, fill: "#fbf7ef", opacity: seg(s.finish, 0.2, 0.8).toFixed(3) }), undefined, "rect")),
  ];
  frontDecor.push(...trims([[1.2, 2.4], [6.8, 2.4], [4.4, 1.25]], 10));
  frontDecor.push(windowAt(1.2, 2.4, 0.9, 1.5, true, "wa"), shutter(0.5, 0.9, 1.5), shutter(3.68, 0.9, 1.5));
  frontDecor.push(windowAt(6.8, 2.4, 0.9, 1.5, true, "wb"), shutter(6.1, 0.9, 1.5), shutter(9.28, 0.9, 1.5));
  // door: dark doorway, warm interior light, then the panel swinging inward
  frontDecor.push(recess(4.4, 0, 1.25, 2.3));
  frontDecor.push(dyn((s) => ({ x: 4.5, y: 0, width: 1.05, height: 2.2, fill: C.glow, opacity: (s.lights * 0.75 * seg(s.door, 0, 0.6)).toFixed(3) }), undefined, "rect"));
  frontDecor.push(dyn((s) => {
    const open = easeInOut(s.door);
    return { d: `M4.45 0L${f1(4.45 + 1.15 * (1 - open * 0.82))} ${f1(0.12 * open)}L${f1(4.45 + 1.15 * (1 - open * 0.82))} ${f1(2.25 - 0.08 * open)}L4.45 2.25Z`, fill: mix(C.door, "#a86a3d", 0.2), opacity: seg(s.glaze, 0.2, 0.7).toFixed(3) };
  }));
  frontDecor.push({ t: "path", a: { d: "M4.3 0V2.42H5.75V0", fill: "none", stroke: "#e4dccd", "stroke-width": 0.14 } });
  // wall lamps beside the door
  frontDecor.push(...[4.05, 6.0].map((u) => dyn((s) => ({ cx: u, cy: 2.05, r: 0.13, fill: mix("#d8cfbf", C.glow, s.lights) }), undefined, "circle")));
  frontDecor.push({ t: "text", a: { x: 6.25, y: -2.02, "font-size": 0.34, fill: "#7c6a55", transform: "scale(1 -1)", "font-family": "IBM Plex Sans, sans-serif", "font-weight": 600 }, text: "23" });
  house.push(g(frontDecor, { transform: faceMatrix("front", 1, 7, Z0) }, (s) => ({ opacity: seg(s.openings, 0, 0.5).toFixed(3) })));

  // Right wall (+x face at x = 11), local u runs from y = 7 toward y = 1
  const rightDecor: SNode[] = [...trims([[1.0, 1.6], [3.4, 1.6]], 6), windowAt(1.0, 1.6, 0.9, 1.5, false, "wc"), windowAt(3.4, 1.6, 0.9, 1.5, true, "wd")];
  house.push(g(rightDecor, { transform: faceMatrix("right", 11, 7, Z0) }, (s) => ({ opacity: seg(s.openings, 0.2, 0.7).toFixed(3) })));

  // Veranda: columns and a flat roof
  const colGrow = (i: number) => (s: StoryState) => easeOut(seg(s.cols * 1.2 - i * 0.15, 0, 1));
  house.push(box(1.15, 8.2, Z0, 0.3, 0.3, 3.2, wallCol, { grow: colGrow(0), edge: "#c2c0b8" }));
  house.push(box(10.55, 8.2, Z0, 0.3, 0.3, 3.2, wallCol, { grow: colGrow(1), edge: "#c2c0b8" }));
  house.push(g([box(0.9, 7, 3.6, 10.2, 1.6, 0.18, (s) => mix(C.concrete, C.render, s.finish), { edge: "#d8d0c1" })], undefined, (s) => {
    const k = easeOut(seg(s.roof, 0, 0.35));
    return { opacity: k.toFixed(3), transform: `translate(0 ${f1(-(1 - k) * 30)})` };
  }));

  // Hip roof (standing-seam metal in the brand teal), settling plane by plane
  const r = hipRoof(0.5, 0.5, 11.5, 7.5, Z0 + H, 2.0);
  const roofPlane = (dPath: string, fill: string, seams: string, from: number) => g([
    p(dPath, fill),
    p(seams, "none", { stroke: C.seam, "stroke-width": 0.7, opacity: 0.8 }),
  ], undefined, (s) => {
    const k = easeOut(seg(s.roof, from, from + 0.45));
    return { opacity: k.toFixed(3), transform: `translate(0 ${f1(-(1 - k) * 46)})` };
  });
  house.push(roofPlane(r.back, mix(C.roof, "#ffffff", 0.1), "", 0));
  house.push(roofPlane(r.left, mix(C.roof, SHADE, 0.04), "", 0.1));
  house.push(roofPlane(r.right, C.roofDark, r.rseams, 0.2));
  house.push(roofPlane(r.front, C.roof, r.seams, 0.35));
  house.push(dyn((s) => ({ d: r.ridge, fill: "none", stroke: "#3a8aa3", "stroke-width": 1.4, "stroke-linecap": "round", opacity: seg(s.roof, 0.75, 1).toFixed(3) })));
  // fascia band along the visible eaves
  house.push(dyn((s) => ({
    d: poly(proj([[0.5, 7.5, Z0 + H], [11.5, 7.5, Z0 + H], [11.5, 7.5, Z0 + H - 0.18], [0.5, 7.5, Z0 + H - 0.18]])) + poly(proj([[11.5, 0.5, Z0 + H], [11.5, 7.5, Z0 + H], [11.5, 7.5, Z0 + H - 0.18], [11.5, 0.5, Z0 + H - 0.18]])),
    fill: "#f3ede2", opacity: seg(s.roof, 0.6, 1).toFixed(3),
  })));
  // solar water heater, a very Jamaican rooftop detail
  house.push(dyn((s) => ({ d: poly(proj([[11.5 - 0.9, 2.2, Z0 + H + 0.62], [11.5 - 0.9, 4.0, Z0 + H + 0.62], [11.5 - 2.1, 4.0, Z0 + H + 1.3], [11.5 - 2.1, 2.2, Z0 + H + 1.3]])), fill: "#2c3f63", stroke: "#cfd8e3", "stroke-width": 0.6, opacity: seg(s.finish, 0.5, 1).toFixed(3) })));

  // Paving, steps, driveway, path to the gate
  const pave = (pts: V3[], fill: string, start: number) => dyn((s) => ({ d: poly(proj(pts)), fill, opacity: easeOut(seg(s.garden, start, start + 0.4)).toFixed(3) }));
  paths.push(pave([[5.2, 9.4, 0.02], [7.2, 9.4, 0.02], [7.2, 12.2, 0.02], [5.2, 12.2, 0.02]], C.paving, 0));
  paths.push(pave([[12.6, 3, 0.02], [15.8, 3, 0.02], [15.8, 12.2, 0.02], [12.6, 12.2, 0.02]], C.drive, 0.1));
  house.push(box(5.1, 9.4, 0, 2.2, 0.5, 0.26, "#e2dacb", { grow: (s) => seg(s.garden, 0, 0.3) }));

  // Boundary wall with a gate opening, hedges and planting
  const bw = (x0: number, x1: number, i: number) => box(x0, 11.9, 0, x1 - x0, 0.3, 0.9, wallCol, { grow: (s) => easeOut(seg(s.garden * 1.3 - i * 0.12, 0.05, 0.6)), edge: "#c2c0b8" });
  const lotFront: { depth: number; node: SNode }[] = [
    { depth: 13.5 + -3, node: bw(-3, 5.1, 0) },
    { depth: 13.5 + 11, node: bw(7.3, 12.4, 1) },
    { depth: 13.5 + 16.5, node: bw(16, 17.5, 2) },
  ];

  shadows.push(shadow(1, 1, 10, 6, H + 1.5, (s) => seg(s.walls, 0, 1) * (0.6 + 0.4 * s.roof)));
  objects.push({ depth: 6 + 4.5, node: g([survey, ...house]) });
  objects.push(...lotFront);

  // existing mature trees and hedgerows around the plot: the setting before anything is built
  const mature: [number, number, number, "tree" | "palm"][] = [[-6, -5, 6.5, "tree"], [17, -6, 6, "tree"], [-7, 6, 5.5, "palm"], [19, 8, 6.2, "palm"], [-5, 13, 5, "tree"], [16, -1, 5.4, "palm"], [-8, 1, 6, "tree"]];
  mature.forEach(([x, y, h, kind], i) => objects.push({ depth: x + y, node: kind === "tree" ? tree(x, y, h, i + 20, undefined, (i % 3) * 0.2) : palm(x, y, h, i + 20) }));
  paths.push(p(poly(proj([[-4, -3.4, 0.01], [17, -3.4, 0.01], [17, -2.6, 0.01], [-4, -2.6, 0.01]])), C.lawnDeep, { opacity: 0.8 }));
  for (let x = -3.5; x < 17; x += 1.6) objects.push({ depth: x - 3, node: shrub(x, -3, 0.9, x % 3.2 < 1.6 ? C.hedge : C.leafDark, null, () => 1) });

  // garden: palms, shrubs, flowers (grow in with the finishing touches)
  const gGrow = (s: StoryState) => s.garden;
  objects.push({ depth: -1 + 9.5, node: palm(-1, 9.5, 5.2, 1, (s) => seg(s.garden, 0.1, 0.8)) });
  objects.push({ depth: 14 + 0.5, node: palm(14, 0.5, 6, 2, (s) => seg(s.garden, 0.2, 0.9)) });
  objects.push({ depth: 11.8 + 10.9, node: palm(11.8, 10.9, 4.4, 3, (s) => seg(s.garden, 0.3, 1)) });
  const shrubs: [number, number, number, string, string | null, number][] = [
    [0.2, 10.6, 1.1, C.hedge, C.flower, 0.2], [2.2, 10.9, 1.0, C.hedge, null, 0.25], [3.8, 10.8, 0.9, C.leafLight, C.flower2, 0.3],
    [8.4, 10.9, 0.9, C.hedge, C.flower, 0.35], [11.2, 10.4, 1.1, C.hedge, null, 0.4], [-1.8, 4, 1.2, C.leafDark, C.flower, 0.3],
    [12.2, 1.2, 1.0, C.hedge, C.flower2, 0.35], [-2, 0, 1.1, C.hedge, null, 0.4],
  ];
  for (const [x, y, rr, col, fl, dl] of shrubs) objects.push({ depth: x + y, node: shrub(x, y, rr, col, fl, gGrow, dl) });

  // the family car in the driveway (finishing touches)
  objects.push({ depth: 14.2 + 7.5, node: car(13.4, 6.4, "#e8e4dc", (s) => seg(s.garden, 0.5, 1)) });

  // ── Community ─────────────────────────────────────────────────────────
  const comm = (s: StoryState) => s.community;
  const roadPts: V3[] = [[-66, 13, 0.01], [66, 13, 0.01], [66, 19.4, 0.01], [-66, 19.4, 0.01]];
  paths.push(dyn((s) => ({ d: poly(proj([[-66, 12.2, 0.01], [66, 12.2, 0.01], [66, 20.2, 0.01], [-66, 20.2, 0.01]])), fill: C.roadEdge, opacity: easeOut(seg(comm(s), 0, 0.4)).toFixed(3) })));
  paths.push(dyn((s) => ({ d: poly(proj(roadPts)), fill: C.road, opacity: easeOut(seg(comm(s), 0, 0.4)).toFixed(3) })));
  paths.push(dyn((s) => ({ d: Array.from({ length: 26 }, (_, i) => line(proj([[-64 + i * 5, 16.2, 0.02], [-61.8 + i * 5, 16.2, 0.02]]))).join(""), fill: "none", stroke: C.mark, "stroke-width": 1.2, opacity: (easeOut(seg(comm(s), 0.2, 0.5)) * 0.9).toFixed(3) })));
  // side street and a park path
  paths.push(dyn((s) => ({ d: poly(proj([[-48, -30, 0.01], [-42, -30, 0.01], [-42, 12.2, 0.01], [-48, 12.2, 0.01]])), fill: C.road, opacity: easeOut(seg(comm(s), 0.1, 0.5)).toFixed(3) })));
  paths.push(dyn((s) => ({ d: poly(proj([[46, 22, 0.015], [48, 22, 0.015], [48, 38, 0.015], [46, 38, 0.015]])) + poly(proj([[40, 29, 0.015], [62, 29, 0.015], [62, 31, 0.015], [40, 31, 0.015]])), fill: C.paving, opacity: easeOut(seg(comm(s), 0.3, 0.7)).toFixed(3) })));
  // gatehouse, entrance pillars and boom gate at the west end of the main road
  objects.push({ depth: -58 + 16, node: g([
    box(-61, 9.2, 0, 4, 2.6, 2.8, C.render, { grow: (s) => easeOut(seg(comm(s), 0.15, 0.55)), edge: "#c2c0b8" }),
    g([box(-61.4, 8.8, 2.8, 4.8, 3.4, 0.3, C.roof)], undefined, (s) => ({ opacity: seg(comm(s), 0.45, 0.65).toFixed(3) })),
    box(-56.5, 12, 0, 0.9, 0.9, 3.4, C.sand, { grow: (s) => easeOut(seg(comm(s), 0.2, 0.6)) }),
    box(-56.5, 20.4, 0, 0.9, 0.9, 3.4, C.sand, { grow: (s) => easeOut(seg(comm(s), 0.25, 0.65)) }),
    dyn((s) => {
      const lift = easeInOut(seg(s.life, 0.18, 0.32)) * (1 - easeInOut(seg(s.life, 0.62, 0.78)));
      const [ax, ay] = P(-56, 13.2, 1.1);
      return { d: "M0 -0.9L118 -0.9L118 0.9L0 0.9Z", fill: "#f4efe6", stroke: "#e0574c", "stroke-width": 0.8, "stroke-dasharray": "6 6", transform: `translate(${f1(ax)} ${f1(ay)}) rotate(${(150 + 62 * lift).toFixed(1)})`, opacity: seg(comm(s), 0.5, 0.7).toFixed(3) };
    }),
  ]) });
  // a cleared lot hint and street trees
  const streetTrees: [number, number, number][] = lite
    ? [[-24, 11, 4], [24, 11, 4.4], [-8, 21, 4.2], [36, 21, 4]]
    : [[-40, 11, 4.2], [-24, 11, 4], [24, 11, 4.4], [40, 11, 4], [-36, 21, 4.4], [-8, 21, 4.2], [16, 21, 4.6], [36, 21, 4], [52, 26, 5], [58, 34, 4.4], [44, 35, 4.8], [56, 24, 4.2], [-66, 6, 4.4], [-66, 24, 4.6], [62, 8, 4]];
  streetTrees.forEach(([x, y, h], i) => objects.push({ depth: x + y, node: tree(x, y, h, i, (s) => seg(comm(s), 0.35 + (i % 5) * 0.08, 0.75 + (i % 5) * 0.05), (i % 3) * 0.25) }));
  const commPalms: [number, number, number][] = lite ? [[30, 2, 6]] : [[30, 2, 6], [-12, 2, 5.6], [48, 2, 5.8], [-34, 30, 6], [26, 31, 5.4]];
  commPalms.forEach(([x, y, h], i) => objects.push({ depth: x + y, node: palm(x, y, h, i + 4, (s) => seg(comm(s), 0.4 + i * 0.06, 0.9)) }));

  // neighbouring homes, ordered by distance from ours so they appear outward
  const specs: NeighborSpec[] = [
    { x: 19, y: 0, w: 10, d: 7, h: 3.3, roof: "#b8654a", wall: "#f3ead9", order: 0 },
    { x: -17, y: 0.5, w: 10, d: 6.5, h: 3.3, roof: C.roof, wall: "#f6f0e4", order: 1 },
    { x: 1, y: 24, w: 11, d: 7, h: 3.4, roof: "#50606b", wall: "#eadcc4", order: 2, pool: true },
    { x: 19, y: 24, w: 10, d: 7, h: 3.3, roof: C.roof, wall: "#f6f0e4", order: 3 },
    { x: -17, y: 24, w: 10, d: 7, h: 3.3, roof: "#c9a86b", wall: "#f3ead9", order: 4, pool: true },
    { x: 37, y: 0, w: 10, d: 7, h: 3.3, roof: "#50606b", wall: "#eadcc4", order: 5 },
    { x: -35, y: 0.5, w: 10, d: 6.5, h: 3.3, roof: "#b8654a", wall: "#f6f0e4", order: 6 },
    { x: 1, y: -18, w: 10, d: 7, h: 3.3, roof: "#c9a86b", wall: "#f6f0e4", order: 7 },
    { x: 19, y: -18, w: 10, d: 7, h: 3.3, roof: C.roof, wall: "#eadcc4", order: 8 },
    { x: -17, y: -18, w: 10, d: 7, h: 3.3, roof: "#50606b", wall: "#f3ead9", order: 9 },
    { x: -35, y: 24, w: 10, d: 7, h: 3.3, roof: C.roof, wall: "#eadcc4", order: 10 },
    { x: 37, y: -18, w: 10, d: 7, h: 3.3, roof: "#b8654a", wall: "#f6f0e4", order: 11 },
  ];
  for (const n of lite ? specs.slice(0, 8) : specs) {
    const h = neighborHouse(n);
    objects.push({ depth: h.depth, node: h.node });
    shadows.push(h.shadowNode);
    // each neighbour gets a garden palm and a hedge line
    objects.push({ depth: n.x - 1 + n.y + n.d + 2, node: palm(n.x - 1.6, n.y + n.d + 2.2, 4.6, n.order + 7, (s) => seg(s.neighbors * 1.45 - n.order * 0.075, 0.4, 0.8)) });
    paths.push(dyn((s) => ({ d: poly(proj([[n.x + n.w + 0.8, n.y + 2, 0.015], [n.x + n.w + 3.6, n.y + 2, 0.015], [n.x + n.w + 3.6, n.y > 10 ? 20.2 : 12.2, 0.015], [n.x + n.w + 0.8, n.y > 10 ? 20.2 : 12.2, 0.015]])), fill: C.drive, opacity: seg(s.neighbors * 1.45 - n.order * 0.075, 0.2, 0.5).toFixed(3) })));
  }

  // community life: a car arriving at the gate, people walking in the park
  objects.push({ depth: 30, node: drivingCar() });
  const walkers: [string, string, number, number, number, number][] = lite
    ? [["#3f8f78", "#6b3e24", 47, 24, 47, 36]]
    : [["#3f8f78", "#6b3e24", 47, 24, 47, 36], ["#c98a2b", "#4a2c1a", 42, 30, 60, 30], ["#1f5f75", "#8a5634", -30, 12.6, -10, 12.6]];
  walkers.forEach(([col, skin, x0, y0, x1, y1], i) => objects.push({ depth: (x0 + x1) / 2 + (y0 + y1) / 2, node: g([walker(col, skin)], undefined, (s) => {
    const t = seg(s.life, 0.1 * i, 0.7 + 0.1 * i);
    const [wx, wy] = P(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 0);
    return { transform: `translate(${f1(wx)} ${f1(wy)}) scale(1.6)`, opacity: (seg(comm(s), 0.6, 0.9) * seg(s.life, 0, 0.1)).toFixed(3) };
  }) }));

  objects.sort((a, b) => a.depth - b.depth);

  // ── People layer: the resident (drawn above the house) ─────────────────
  const [rx0, ry0] = P(5.95, 7.05, Z0);
  const [rx1, ry1] = P(6.15, 7.85, Z0);
  const people = g([resident()], undefined, (s) => {
    const t = easeInOut(seg(s.step, 0.15, 1));
    const x = rx0 + (rx1 - rx0) * t, y = ry0 + (ry1 - ry0) * t + Math.sin(seg(s.step, 0.2, 0.95) * Math.PI * 3) * -0.8;
    const sc = (1.68 * U) / 100;
    return { transform: `translate(${f1(x)} ${f1(y)}) scale(${sc.toFixed(3)})`, opacity: seg(s.step, 0, 0.18).toFixed(3) };
  });

  // ── Glow layer: window light that reads through the dusk grade ─────────
  const glowFront = g([
    { t: "rect", a: { x: 1.26, y: 0.96, width: 2.28, height: 1.38, fill: C.glow } },
    { t: "rect", a: { x: 6.86, y: 0.96, width: 2.28, height: 1.38, fill: C.glow } },
  ], { transform: faceMatrix("front", 1, 7, Z0) });
  const glowRight = g([{ t: "rect", a: { x: 3.46, y: 0.96, width: 1.48, height: 1.38, fill: C.glow } }], { transform: faceMatrix("right", 11, 7, Z0) });
  const glows = g([g([glowFront, glowRight], { style: "mix-blend-mode:screen" })], undefined, () => ({ opacity: 0 }));

  const world = g([g(ground), g(paths), g(shadows), ...objects.map((o) => o.node)]);
  return { world, glows, people, accentAnchors: ACCENTS };
}

function carModel(x: number, y: number, alongX: boolean, body: string): SNode {
  const L = 4.3, Wd = 1.85;
  const [w, d] = alongX ? [L, Wd] : [Wd, L];
  const glass = mix(body, "#1d3b4a", 0.72);
  const cab = alongX ? [x + 1.05, y + 0.12, 2.2, Wd - 0.24] : [x + 0.12, y + 1.05, Wd - 0.24, 2.2];
  const wheelFace = alongX ? faceMatrix("front", x, y + d, 0) : faceMatrix("right", x + w, y + d, 0);
  return g([
    shadow(x - 0.1, y - 0.1, w + 0.2, d + 0.2, 0.9, undefined, 0.16),
    g([{ t: "ellipse", a: { cx: 0.85, cy: 0.33, rx: 0.33, ry: 0.33, fill: "#1e2629" } }, { t: "ellipse", a: { cx: L - 0.85, cy: 0.33, rx: 0.33, ry: 0.33, fill: "#1e2629" } }], { transform: wheelFace }),
    box(x, y, 0.3, w, d, 0.55, body),
    box(cab[0]!, cab[1]!, 0.85, cab[2]!, cab[3]!, 0.5, glass),
    box(cab[0]! + 0.06, cab[1]! + 0.06, 1.35, cab[2]! - 0.12, cab[3]! - 0.12, 0.06, mix(body, "#ffffff", 0.08)),
    g([{ t: "rect", a: { x: 0.12, y: 0.5, width: 0.28, height: 0.12, fill: "#fff1c9" } }, { t: "rect", a: { x: Wd - 0.4, y: 0.5, width: 0.28, height: 0.12, fill: "#fff1c9" } }], { transform: alongX ? faceMatrix("right", x + w, y + d, 0.3) : faceMatrix("front", x, y + d, 0.3) }),
  ]);
}

function car(x: number, y: number, body: string, grow?: (s: StoryState) => number): SNode {
  const node = carModel(x, y, false, body);
  if (!grow) return node;
  return g([node], undefined, (s) => ({ opacity: grow(s).toFixed(3) }));
}

/** A guest's car drives along the main road to the gate, waits for the boom, then drives in. */
function drivingCar(): SNode {
  const xAt = (t: number) => (t < 0.2 ? -66 + 9 * easeOut(t / 0.2) : t < 0.3 ? -57 : -57 + 60 * easeInOut(seg(t, 0.3, 1)));
  return g([carModel(-1, 14.3, true, "#c98a2b")], undefined, (s) => {
    const [dx, dy] = P(xAt(s.life), 0, 0);
    return { transform: `translate(${f1(dx)} ${f1(dy)})`, opacity: (seg(s.community, 0.6, 0.9) * seg(s.life, 0, 0.05)).toFixed(3) };
  });
}

// ── Camera ──────────────────────────────────────────────────────────────────
/** Zoom 1 fits the house in roughly 70% of the stage's short side. */
export function cameraTransform(s: StoryState, W: number, H: number) {
  const base = Math.min(W, H) / 520;
  const z = s.zoom * base;
  const [fx, fy] = P(s.camX, s.camY, s.camZ);
  return `translate(${f1(W * (0.5 + s.offX))} ${f1(H * (0.5 + s.offY))}) scale(${z.toFixed(4)}) translate(${f1(-fx)} ${f1(-fy)})`;
}

/** Camera that frames the whole community for a stage size (portrait stages get a tighter crop). */
export function communityShot(W: number, H: number) {
  const b = W / H < 0.9 ? COMMUNITY_BOUNDS.tall : COMMUNITY_BOUNDS.wide;
  const corners = [P(b.x0, b.y0, 0), P(b.x1, b.y0, 0), P(b.x1, b.y1, 0), P(b.x0, b.y1, 0), P(b.x0, b.y0, 6), P(b.x1, b.y0, 6)];
  const xs = corners.map((c) => c[0]), ys = corners.map((c) => c[1]);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  const base = Math.min(W, H) / 520;
  const zoom = (Math.min(W / w, H / h) / base) * 0.98;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  // invert the projection for the focus point at ground level: sx = (x - y)c, sy = (x + y)/2
  const a = cx / (C30 * U), bb = cy / (0.5 * U);
  return { camX: (a + bb) / 2, camY: (bb - a) / 2, camZ: 0, zoom };
}

// ── Accent card (a counter-scaled SVG group so it stays a constant size) ───────
export function accentCard(a: Anchor): SNode {
  const icons: Record<Anchor["icon"], string> = {
    gate: "M-5 4V-2L0 -5L5 -2V4M-2.4 0.4L-0.6 2.2L2.6 -1.2",
    bell: "M-4 2.6H4L3 1.2V-1.4A3 3 0 0 0 -3 -1.4V1.2ZM-1.2 3.8A1.4 1.4 0 0 0 1.2 3.8",
    receipt: "M-3.6 -5H3.6V5L2.4 4L1.2 5L0 4L-1.2 5L-2.4 4L-3.6 5ZM-2 -2.4H2M-2 0H2M-2 2.2H0.6",
    doc: "M-3.4 -5H1.6L3.6 -3V5H-3.4ZM1.4 -5V-2.8H3.6M-1.6 -0.4H1.8M-1.6 1.8H1.8",
  };
  const w = 208;
  return g([
    { t: "path", a: { d: "M0 0V-38", stroke: "#ffffff", "stroke-width": 1.5, opacity: 0.9 } },
    { t: "circle", a: { cx: 0, cy: 0, r: 4, fill: "#ffffff", stroke: C.teal, "stroke-width": 2 } },
    { t: "circle", a: { cx: 0, cy: 0, r: 9, fill: "none", stroke: "#ffffff", "stroke-width": 1.4, class: "story-ping" } },
    g([
      { t: "rect", a: { x: 2, y: 8, width: w - 4, height: 48, rx: 16, fill: "#04141b", opacity: 0.1 } },
      { t: "rect", a: { x: 0, y: 3, width: w, height: 50, rx: 15, fill: "#04141b", opacity: 0.08 } },
      { t: "rect", a: { x: 0, y: 0, width: w, height: 50, rx: 14, fill: "#ffffff" } },
      { t: "rect", a: { x: 9, y: 9, width: 32, height: 32, rx: 9, fill: a.icon === "receipt" ? "#e4f1ea" : "#e3eef2" } },
      { t: "path", a: { d: icons[a.icon], transform: "translate(25 25) scale(1.6)", fill: "none", stroke: a.icon === "receipt" ? "#2f7d57" : C.teal, "stroke-width": 1.2, "stroke-linecap": "round", "stroke-linejoin": "round" } },
      { t: "text", a: { x: 50, y: 22, "font-size": 13, "font-weight": 600, fill: C.ink, "font-family": "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif" }, text: a.title },
      { t: "text", a: { x: 50, y: 38, "font-size": 11.5, fill: "#586873", "font-family": "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif" }, text: a.text },
    ], { transform: `translate(${-w / 2} -90)` }),
  ]);
}

// ── Serialisation (poster and server rendering) ─────────────────────────────
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
export function toSVG(node: SNode, s: StoryState): string {
  const attrs = { ...(node.a ?? {}), ...(node.d ? node.d(s) : {}) };
  const attrStr = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(String(v))}"`).join("");
  const inner = node.text ? esc(node.text) : (node.c ?? []).map((c) => toSVG(c, s)).join("");
  return `<${node.t}${attrStr}>${inner}</${node.t}>`;
}
