"""Generates the brochure's vector illustrations (brand palette, shared style).

    python3 build.py      # writes cover.svg, security.svg, repair.svg, amenities.svg,
                          # communities.svg, rollout.svg, welcome.svg next to this file

challenge.svg (page 2) was drawn by hand and is not generated here.
Every id is prefixed per illustration so they can all be inlined in one HTML page.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).parent
FONT = "font-family=\"'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif\""

DEEP, PETROL, PETROL_L, PALE = "#123d4c", "#1f5f75", "#2a7591", "#c4d6dd"
WHITE, PAPER, WALL = "#ffffff", "#f6f8f9", "#e9f0f2"
MAHOE, MAHOE_S, LEAF, LEAF_L, LEAF_D = "#c98a2b", "#f1c27d", "#2f7d57", "#3f8f66", "#24603f"
INK, MUTED, RED, SEA, SEA_L, TRUNK = "#15232d", "#586873", "#d64545", "#2a8fa8", "#5cc3d6", "#7a6343"


def f(n):
    return f"{n:.1f}".rstrip("0").rstrip(".")


def dotfield(w, h, seed=1, step=18):
    """Dots that swell and fade along two slow waves; a few brighter ones in sea blue."""
    rnd = random.Random(seed)
    ph = rnd.random() * 6.28
    out = []
    for yy in range(step // 2, h, step):
        for xx in range(step // 2, w, step):
            v = 0.5 + 0.5 * math.sin(xx * 0.017 + yy * 0.009 + ph) * math.cos(yy * 0.021 - xx * 0.006)
            v = v ** 1.6
            r_ = 0.45 + 1.55 * v
            o = 0.04 + 0.22 * v
            col = SEA_L if v > 0.78 and rnd.random() < 0.35 else PALE
            out.append(f'<circle cx="{xx}" cy="{yy}" r="{f(r_)}" fill="{col}" fill-opacity="{f(o)}"/>')
    return '<g>' + "".join(out) + '</g>'


def ground(p, w, h, glow=(0.75, 0.25), warm=(0.15, 0.85)):
    return f"""<defs>
    <pattern id="{p}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#fff" fill-opacity=".07"/></pattern>
    <radialGradient id="{p}-g1" cx="{glow[0]}" cy="{glow[1]}" r="0.6"><stop offset="0" stop-color="{PETROL_L}" stop-opacity=".75"/><stop offset="1" stop-color="{PETROL_L}" stop-opacity="0"/></radialGradient>
    <radialGradient id="{p}-g2" cx="{warm[0]}" cy="{warm[1]}" r="0.5"><stop offset="0" stop-color="{MAHOE}" stop-opacity=".22"/><stop offset="1" stop-color="{MAHOE}" stop-opacity="0"/></radialGradient>
    <filter id="{p}-sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="11" flood-color="#04141b" flood-opacity=".5"/></filter>
  </defs>
  <rect width="{w}" height="{h}" fill="{DEEP}"/><rect width="{w}" height="{h}" fill="url(#{p}-g1)"/><rect width="{w}" height="{h}" fill="url(#{p}-g2)"/>""" + dotfield(w, h, seed=sum(map(ord, p)))


def svg(name, w, h, body, label):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="{label}" {FONT}>\n{body}\n</svg>\n'
    (OUT / f"{name}.svg").write_text(s)


def leaf(tx, ty, ang, length, width, droop, color):
    a = math.radians(ang)
    tip = (tx + length * math.cos(a), ty + length * math.sin(a) + droop)
    nx, ny = -math.sin(a), math.cos(a)
    mx, my = tx + 0.55 * length * math.cos(a), ty + 0.55 * length * math.sin(a) + droop * 0.4
    c1 = (mx + nx * width, my + ny * width)
    c2 = (mx - nx * width, my - ny * width)
    return f'<path d="M{f(tx)} {f(ty)}Q{f(c1[0])} {f(c1[1])} {f(tip[0])} {f(tip[1])}Q{f(c2[0])} {f(c2[1])} {f(tx)} {f(ty)}Z" fill="{color}"/>'


def palm(x, y, s=1.0, lean=8):
    tx, ty = x + lean * s, y - 92 * s
    out = [f'<path d="M{f(x)} {f(y)}Q{f(x + 16 * s)} {f(y - 46 * s)} {f(tx)} {f(ty)}" fill="none" stroke="{TRUNK}" stroke-width="{f(5.5 * s)}" stroke-linecap="round"/>']
    for i, (ang, droop) in enumerate([(160, 18), (200, 10), (235, 0), (275, -4), (310, 0), (345, 10), (20, 18)]):
        out.append(leaf(tx, ty, ang, 48 * s, 9 * s, droop * s, LEAF if i % 2 else LEAF_L))
    out.append(f'<circle cx="{f(tx)}" cy="{f(ty)}" r="{f(4 * s)}" fill="{LEAF_D}"/>')
    return "".join(out)


def crown(cx, cy, r=34):
    out = [leaf(cx, cy, k * 45 + 10, r, r * 0.22, 0, LEAF if k % 2 else LEAF_L) for k in range(8)]
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{f(r * 0.16)}" fill="{LEAF_D}"/>')
    return "".join(out)


def house(x, y, w, h, kind="flat", lit=True, roof=MAHOE):
    out = []
    if kind == "flat":
        out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{WALL}"/>')
        out.append(f'<rect x="{f(x - 6)}" y="{f(y - 7)}" width="{f(w + 12)}" height="7" fill="{PALE}"/>')
    else:
        out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{WALL}"/>')
        out.append(f'<path d="M{f(x - 7)} {f(y)}L{f(x + w / 2)} {f(y - h * 0.42)}L{f(x + w + 7)} {f(y)}Z" fill="{roof}"/>')
    floors = 2 if h > 52 else 1
    fh = h / floors
    for fl in range(floors):
        for c in range(2):
            wx = x + w * (0.16 + c * 0.46)
            wy = y + fl * fh + fh * 0.22
            on = lit and (fl + c) % 2 == 0
            out.append(f'<rect x="{f(wx)}" y="{f(wy)}" width="{f(w * 0.3)}" height="{f(fh * 0.34)}" rx="1.5" fill="{MAHOE_S if on else PETROL_L}"/>')
    out.append(f'<rect x="{f(x + w * 0.42)}" y="{f(y + h - fh * 0.38)}" width="{f(w * 0.16)}" height="{f(fh * 0.38)}" fill="{PETROL}"/>')
    return "".join(out)


def chip(p, x, y, w, icon_color, icon, title, sub, rot=0):
    return f"""<g transform="translate({x} {y}) rotate({rot})" filter="url(#{p}-sh)">
    <rect width="{w}" height="58" rx="16" fill="{WHITE}"/>
    <circle cx="29" cy="29" r="15" fill="{icon_color}"/>{icon}
    <text x="54" y="25" font-size="14" font-weight="600" fill="{INK}">{title}</text>
    <text x="54" y="42" font-size="11" fill="{MUTED}">{sub}</text>
  </g>"""


CHECK = f'<path d="M22 29l5 5 9-10" fill="none" stroke="{WHITE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
BELL = f'<path d="M23 34h12M25 34v-6a4 4 0 0 1 8 0v6M29 37v1" fill="none" stroke="{WHITE}" stroke-width="2.2" stroke-linecap="round"/>'
RECEIPT = f'<path d="M24 21h10v16l-2.5-1.6L29 37l-2.5-1.6L24 37Z M26.5 26h5M26.5 30h5" fill="none" stroke="{WHITE}" stroke-width="2" stroke-linejoin="round"/>'
LOCK = f'<path d="M24 28h10v8H24ZM26 28v-3a3 3 0 0 1 6 0v3" fill="none" stroke="{WHITE}" stroke-width="2" stroke-linejoin="round"/>'


def qr(x, y, size, seed=7, n=17):
    rnd = random.Random(seed)
    m = size / n
    cells = []
    finder = lambda r, c: any(r0 <= r < r0 + 7 and c0 <= c < c0 + 7 for r0, c0 in [(0, 0), (0, n - 7), (n - 7, 0)])
    for r in range(n):
        for c in range(n):
            if not finder(r, c) and rnd.random() < 0.48:
                cells.append(f'<rect x="{f(x + c * m)}" y="{f(y + r * m)}" width="{f(m)}" height="{f(m)}"/>')
    for r0, c0 in [(0, 0), (0, n - 7), (n - 7, 0)]:
        X, Y = x + c0 * m, y + r0 * m
        cells.append(f'<rect x="{f(X + m / 2)}" y="{f(Y + m / 2)}" width="{f(6 * m)}" height="{f(6 * m)}" fill="none" stroke="{INK}" stroke-width="{f(m)}"/>')
        cells.append(f'<rect x="{f(X + 2 * m)}" y="{f(Y + 2 * m)}" width="{f(3 * m)}" height="{f(3 * m)}"/>')
    return f'<g fill="{INK}">{"".join(cells)}</g>'


# ── 1 · Cover: a gated hillside community ─────────────────────────────────────
def cover():
    p, w, h = "cv", 680, 845
    b = [ground(p, w, h, glow=(0.7, 0.28))]
    b.append(f'<circle cx="530" cy="168" r="96" fill="{MAHOE_S}" fill-opacity=".08"/><circle cx="530" cy="168" r="58" fill="{MAHOE_S}" fill-opacity=".92"/>')
    b.append(f'<path d="M0 430C110 352 220 372 300 330S480 252 570 300S680 292 680 292V845H0Z" fill="#1a5266"/>')
    b.append(f'<path d="M0 520C140 448 262 486 384 440S600 418 680 452V845H0Z" fill="{PETROL}"/>')
    for (x, y, ww, hh, k, roof) in [(30, 462, 90, 70, "pitched", MAHOE), (140, 440, 112, 90, "flat", None), (272, 436, 94, 70, "pitched", "#d9a35a"),
                                     (384, 414, 116, 94, "flat", None), (520, 424, 92, 68, "pitched", MAHOE)]:
        b.append(house(x, y, ww, hh, k, True, roof or MAHOE))
    b.append(f'<path d="M0 600C200 566 420 610 680 568V845H0Z" fill="#174b5d"/>')
    b.append(f'<path d="M170 845C196 760 226 690 252 640L300 640C318 690 338 760 360 845Z" fill="#0f3442"/>')
    b.append(f'<path d="M276 646V845" stroke="{MAHOE_S}" stroke-opacity=".7" stroke-width="3" stroke-dasharray="14 14"/>')
    for x in (232, 322):
        b.append(f'<rect x="{x - 14}" y="560" width="28" height="86" fill="{WALL}"/><rect x="{x - 18}" y="552" width="36" height="10" fill="{PALE}"/><circle cx="{x}" cy="546" r="6" fill="{MAHOE_S}"/><circle cx="{x}" cy="546" r="16" fill="{MAHOE_S}" fill-opacity=".18"/>')
    arm = "".join(f'<rect x="{12 + k * 30}" y="0" width="15" height="9" fill="{RED}"/>' for k in range(4))
    b.append(f'<g transform="translate(336 598) rotate(-24)"><rect width="132" height="9" rx="2" fill="{WHITE}"/>{arm}</g>')
    for (x, y, s) in [(110, 560, 1.15), (420, 520, .95), (612, 520, 1.05), (34, 620, 1.3)]:
        b.append(palm(x, y, s))
    b.append(f'<g transform="translate(40 150) rotate(-3)"><rect x="22" y="30" width="218" height="58" rx="16" fill="{WHITE}" fill-opacity=".28"/><rect x="11" y="16" width="240" height="58" rx="16" fill="{WHITE}" fill-opacity=".55"/></g>')
    b.append(chip(p, 40, 150, 262, LEAF, CHECK, "Guest approved", "Lot 23 · arriving at 2:00 PM", -3))
    b.append(f'<g transform="translate(40 150) rotate(-3)"><circle cx="258" cy="2" r="13" fill="{RED}"/><text x="258" y="6.5" font-size="11" font-weight="700" fill="{WHITE}" text-anchor="middle">3</text></g>')
    b.append(chip(p, 330, 262, 250, PETROL_L, RECEIPT, "Dues paid · October", "Receipt in the owner’s app", 3))
    b.append(chip(p, 70, 330, 258, MAHOE, BELL, "Water interruption", "Thursday, 9 a.m. to 1 p.m.", -2))
    svg("cover", w, h, "\n".join(b), "A gated hillside community with homes, palms and a gate, and app notifications")


# ── 7 · Security: the gate, a pass, the record ───────────────────────────────
def security():
    p, w, h = "sc", 344, 840
    b = [ground(p, w, h, glow=(0.5, 0.18))]
    for r, o in [(120, .1), (90, .16), (62, .25)]:
        b.append(f'<circle cx="172" cy="150" r="{r}" fill="none" stroke="{MAHOE_S}" stroke-opacity="{o}" stroke-width="1.5"/>')
    b.append(f'<path d="M172 96L214 112V146C214 174 196 194 172 204C148 194 130 174 130 146V112Z" fill="{PETROL_L}" stroke="{PALE}" stroke-opacity=".5" stroke-width="2"/>')
    b.append(f'<path d="M154 150l12 12 22-24" fill="none" stroke="{WHITE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')
    # pass card with QR
    b.append(f"""<g transform="translate(184 262) rotate(5)" filter="url(#{p}-sh)">
    <rect width="132" height="164" rx="12" fill="{WHITE}"/>{qr(20, 16, 92)}
    <rect x="12" y="120" width="108" height="30" rx="8" fill="{LEAF}"/>
    <text x="66" y="139.5" font-size="11" font-weight="600" fill="{WHITE}" text-anchor="middle">Approved</text></g>""")
    # gatehouse, guard, barrier
    b.append(f'<rect x="0" y="560" width="344" height="80" fill="#0f3442"/><path d="M0 600H344" stroke="{MAHOE_S}" stroke-opacity=".6" stroke-width="3" stroke-dasharray="16 14"/>')
    b.append(f'<rect x="26" y="404" width="118" height="156" fill="{WALL}"/><rect x="18" y="392" width="134" height="14" fill="{PALE}"/>')
    b.append(f'<rect x="40" y="426" width="90" height="64" rx="3" fill="{PETROL_L}"/>')
    b.append(f'<circle cx="84" cy="452" r="11" fill="#0f2f3a"/><path d="M62 490c2-18 12-26 22-26s20 8 22 26Z" fill="#0f2f3a"/><path d="M73 446h22l-3-7H76Z" fill="#0f2f3a"/>')
    b.append(f'<rect x="62" y="508" width="44" height="52" fill="{PETROL}"/><text x="85" y="542" font-size="10" font-weight="700" fill="{WALL}" text-anchor="middle" letter-spacing="1">GATE</text>')
    arm = "".join(f'<rect x="{14 + k * 34}" y="0" width="17" height="10" fill="{RED}"/>' for k in range(5))
    b.append(f'<rect x="150" y="500" width="16" height="62" fill="{PALE}"/><g transform="translate(160 504) rotate(-28)"><rect width="190" height="10" rx="2" fill="{WHITE}"/>{arm}</g>')
    b.append(f'<g transform="translate(206 560)"><path d="M0 0V-26C0-38 12-46 30-48L64-52C78-54 90-46 98-34L126-30C136-28 142-22 142-14V0Z" fill="{MAHOE}"/><path d="M34-46L64-50C72-50 80-46 86-36H30Z" fill="{PALE}"/><circle cx="30" cy="0" r="14" fill="#0f1a20"/><circle cx="30" cy="0" r="5" fill="{PALE}"/><circle cx="112" cy="0" r="14" fill="#0f1a20"/><circle cx="112" cy="0" r="5" fill="{PALE}"/></g>')
    # the record
    for i, (y, ic, icol, title, sub, pill, pcol) in enumerate([
        (676, "!", MAHOE, "Gate left open", "Mailroom gate · 4:10 PM", "Low", PALE),
        (756, "✓", LEAF, "Shift handover", "Night shift · 2 open items", "Done", "#cfe8da")]):
        b.append(f"""<g transform="translate(26 {y}) rotate({-2 if i == 0 else 2})" filter="url(#{p}-sh)">
    <rect width="292" height="62" rx="14" fill="{WHITE}"/><circle cx="31" cy="31" r="15" fill="{icol}"/>
    <text x="31" y="36" font-size="14" font-weight="700" fill="{WHITE}" text-anchor="middle">{ic}</text>
    <text x="56" y="27" font-size="13.5" font-weight="600" fill="{INK}">{title}</text><text x="56" y="44" font-size="10.5" fill="{MUTED}">{sub}</text>
    <rect x="232" y="20" width="46" height="22" rx="11" fill="{pcol}"/><text x="255" y="35" font-size="10.5" font-weight="600" fill="{INK}" text-anchor="middle">{pill}</text></g>""")
    svg("security", w, h, "\n".join(b), "A gatehouse with a lifting barrier, an approved QR pass, and incident and handover records")


# ── 9 · A repair, reported and tracked ───────────────────────────────────────
def repair():
    p, w, h = "rp", 456, 400
    b = [ground(p, w, h, glow=(0.3, 0.3))]
    b.append(f'<path d="M0 320C120 296 240 316 456 300V400H0Z" fill="{PETROL}"/>')
    b.append(house(40, 170, 170, 140, "pitched", True, MAHOE))
    b.append(f'<path d="M210 250h24v10h-10v14" fill="none" stroke="{PALE}" stroke-width="7" stroke-linejoin="round"/>')
    for (x, y, s) in [(224, 290, 1), (230, 312, .8), (219, 330, .65)]:
        b.append(f'<path d="M{x} {y}c-5 7-7 10-7 14a7 7 0 0 0 14 0c0-4-2-7-7-14Z" transform="scale(1)" fill="{SEA_L}" fill-opacity="{s}"/>')
    b.append(f'<circle cx="214" cy="140" r="26" fill="{MAHOE}" filter="url(#{p}-sh)"/>')
    b.append(f'<g transform="translate(214 142) rotate(45)"><rect x="-3.5" y="-2" width="7" height="20" rx="3.5" fill="{WHITE}"/><circle cx="0" cy="-6" r="8.5" fill="{WHITE}"/><rect x="-3" y="-16.5" width="6" height="9" fill="{MAHOE}"/></g>')
    steps = [("Reported", LEAF, True, "Oct 9"), ("In progress", MAHOE, True, "Plumber booked"), ("Fixed", PALE, False, "")]
    rows = []
    for i, (lbl, col, done, sub) in enumerate(steps):
        y = 168 + i * 50
        ring = f'<circle cx="34" cy="{y}" r="13" fill="{col}" fill-opacity=".25"/>' if i == 1 else ""
        rows.append(f'{ring}<circle cx="34" cy="{y}" r="8" fill="{col}"/><text x="54" y="{y + 1}" font-size="12.5" font-weight="{600 if done else 400}" fill="{INK if done else MUTED}">{lbl}</text>' + (f'<text x="54" y="{y + 16}" font-size="10" fill="{MUTED}">{sub}</text>' if sub else ""))
    b.append(f"""<g transform="translate(276 30) rotate(4)" filter="url(#{p}-sh)">
    <rect width="156" height="318" rx="24" fill="#0f1a20"/><rect x="7" y="12" width="142" height="294" rx="18" fill="{PAPER}"/>
    <rect x="58" y="18" width="40" height="6" rx="3" fill="#0f1a20"/>
    <text x="20" y="56" font-size="10" font-weight="600" fill="{PETROL}" letter-spacing="1">MY REQUEST</text>
    <text x="20" y="80" font-size="12.5" font-weight="600" fill="{INK}">Low water pressure</text>
    <text x="20" y="98" font-size="11" fill="{MUTED}">Lot 23 · Plumbing</text>
    <path d="M34 168V268" stroke="{PALE}" stroke-width="2"/><path d="M34 168V218" stroke="{LEAF}" stroke-width="2"/>
    {"".join(rows)}</g>""")
    svg("repair", w, h, "\n".join(b), "A house with a leaking pipe and a phone tracking the repair from reported to fixed")


# ── 11 · Amenities: the pool from above ──────────────────────────────────────
def amenities():
    p, w, h = "am", 368, 600
    b = [ground(p, w, h, glow=(0.6, 0.2))]
    b.append(f'<defs><linearGradient id="am-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{SEA_L}"/><stop offset="1" stop-color="{SEA}"/></linearGradient></defs>')
    b.append(f'<rect x="26" y="34" width="316" height="430" rx="18" fill="#e7dcc6"/>')
    b.append(f'<rect x="96" y="84" width="176" height="300" rx="14" fill="url(#am-water)"/><rect x="96" y="84" width="176" height="300" rx="14" fill="none" stroke="{WHITE}" stroke-width="5"/>')
    for k in range(7):
        y = 120 + k * 38
        b.append(f'<path d="M116 {y}q14-8 28 0t28 0 28 0 28 0 28 0" fill="none" stroke="{WHITE}" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>')
    b.append(f'<path d="M248 360h18M248 350h18M248 340h18" stroke="{WHITE}" stroke-width="3"/>')
    for i in range(4):
        y = 104 + i * 66
        b.append(f'<rect x="44" y="{y}" width="30" height="50" rx="6" fill="{WHITE}"/><rect x="44" y="{y}" width="30" height="14" rx="6" fill="{PALE}"/>')
    for (cx, cy, c) in [(308, 130, MAHOE), (308, 250, MAHOE_S), (308, 370, MAHOE)]:
        segs = "".join(f'<path d="M{cx} {cy}L{f(cx + 24 * math.cos(math.radians(a)))} {f(cy + 24 * math.sin(math.radians(a)))}" stroke="{WHITE}" stroke-opacity=".6" stroke-width="1.4"/>' for a in range(0, 360, 45))
        b.append(f'<circle cx="{cx}" cy="{cy}" r="24" fill="{c}"/>{segs}')
    for (cx, cy, r) in [(40, 44, 46), (334, 46, 40), (36, 440, 44), (330, 452, 48), (182, 430, 30)]:
        b.append(crown(cx, cy, r))
    b.append(f"""<g transform="translate(150 196) rotate(-4)" filter="url(#{p}-sh)">
    <rect width="176" height="78" rx="14" fill="{WHITE}"/>
    <text x="16" y="28" font-size="13.5" font-weight="600" fill="{INK}">Pool · Saturday</text>
    <text x="16" y="47" font-size="11" fill="{MUTED}">10:00 a.m. – 12:00 p.m.</text>
    <rect x="16" y="54" width="62" height="18" rx="9" fill="#cfe8da"/><text x="47" y="67" font-size="10" font-weight="600" fill="{LEAF}" text-anchor="middle">Booked</text></g>""")
    svg("amenities", w, h, "\n".join(b), "A community pool from above, with loungers, umbrellas, palms and a booking card")


# ── 12 · Communities, each kept separate ─────────────────────────────────────
def communities():
    p, w, h = "mc", 360, 600
    b = [ground(p, w, h, glow=(0.5, 0.5))]
    def mini(seed):
        rnd = random.Random(seed)
        out = [f'<rect width="250" height="96" rx="12" fill="{PETROL}"/>',
               f'<path d="M0 60C60 40 120 56 170 44S240 40 250 46V84a12 12 0 0 1-12 12H12A12 12 0 0 1 0 84Z" fill="#1a5266"/>']
        x = 16
        while x < 220:
            ww = rnd.choice([26, 30, 34]); hh = rnd.choice([20, 24, 28])
            out.append(house(x, 76 - hh, ww, hh, rnd.choice(["flat", "pitched"]), True, rnd.choice([MAHOE, "#d9a35a"])))
            x += ww + rnd.choice([12, 16, 20])
        return "".join(out)
    for i, (x, y, rot, name) in enumerate([(30, 34, -3, "Mahoe Ridge"), (82, 222, 2.5, "Palm Grove"), (40, 410, -2, "Seaview Heights")]):
        b.append(f"""<g transform="translate({x} {y}) rotate({rot})" filter="url(#{p}-sh)">
    <rect width="270" height="160" rx="16" fill="{WHITE}"/><g transform="translate(10 10)">{mini(i + 3)}</g>
    <circle cx="28" cy="133" r="12" fill="none" stroke="{PETROL}" stroke-width="2"/><path d="M23 139v-6l5-3.5 5 3.5v6h-3v-4h-4v4Z" fill="{PETROL}"/>
    <text x="48" y="138" font-size="13" font-weight="600" fill="{INK}">{name}</text>
    <rect x="182" y="122" width="76" height="22" rx="11" fill="{PAPER}" stroke="{PALE}"/>
    <path d="M195 133h7v6h-7ZM196.5 133v-2a2 2 0 0 1 4 0v2" fill="none" stroke="{PETROL}" stroke-width="1.5"/>
    <text x="208" y="137.5" font-size="9.5" fill="{MUTED}">Own records</text></g>""")
    svg("communities", w, h, "\n".join(b), "Three separate communities, each with its own records")


# ── 12 · Six areas, one shared record (hub and beams) ────────────────────
def hub():
    p, w, h = "hb", 360, 600
    b = [ground(p, w, h, glow=(0.5, 0.5), warm=(0.5, 0.95))]
    cx, cy = 180, 300
    icons = {
        "Collections": f'<path d="M-7-10h14v20l-3.5-2.2L0 10l-3.5-2.2L-7 10ZM-3.5-4h7M-3.5 1h7" fill="none" stroke="{PETROL}" stroke-width="2.2" stroke-linejoin="round"/>',
        "The gate": f'<path d="M-10 9V-6M10 9V-6M-10-2H10M-5-2V9M0-2V9M5-2V9" fill="none" stroke="{PETROL}" stroke-width="2.2" stroke-linecap="round"/>',
        "Notices": f'<path d="M-8 6h16M-6 6V-1a6 6 0 0 1 12 0v7M0 9.5v.5" fill="none" stroke="{PETROL}" stroke-width="2.2" stroke-linecap="round"/>',
        "Repairs": f'<g transform="rotate(45)"><rect x="-2.6" y="-1" width="5.2" height="13" rx="2.6" fill="{PETROL}"/><circle cx="0" cy="-4.5" r="6.2" fill="{PETROL}"/><rect x="-2.2" y="-12" width="4.4" height="6.5" fill="{WHITE}"/></g>',
        "Decisions": f'<path d="M-9-9h18v18h-18ZM-4.5 0l3 3 6-7" fill="none" stroke="{PETROL}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>',
        "Records": f'<path d="M-9-8h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-7ZM9-8H2a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7Z" fill="none" stroke="{PETROL}" stroke-width="2.1" stroke-linejoin="round"/>',
    }
    nodes = [("Collections", 62, 112), ("Notices", 62, 300), ("Decisions", 62, 488), ("The gate", 298, 112), ("Repairs", 298, 300), ("Records", 298, 488)]
    defs = []
    for i, (name, x, y) in enumerate(nodes):
        d = f"M{x} {y}C{f((x + cx) / 2)} {y} {f((x + cx) / 2)} {cy} {cx} {cy}"
        defs.append(f'<linearGradient id="{p}-beam{i}" gradientUnits="userSpaceOnUse" x1="{x}" y1="{y}" x2="{cx}" y2="{cy}"><stop offset="0" stop-color="{MAHOE_S}" stop-opacity="0"/><stop offset=".55" stop-color="{MAHOE_S}"/><stop offset="1" stop-color="{SEA_L}" stop-opacity=".2"/></linearGradient>')
        b.append(f'<path d="{d}" fill="none" stroke="{PALE}" stroke-opacity=".22" stroke-width="2"/>')
        b.append(f'<path d="{d}" fill="none" stroke="url(#{p}-beam{i})" stroke-width="3" stroke-linecap="round" stroke-dasharray="70 400" stroke-dashoffset="{-20 - (i % 3) * 22}"/>')
    b.insert(1, "<defs>" + "".join(defs) + "</defs>")
    for r_, o in [(118, .06), (88, .1), (64, .16)]:
        b.append(f'<circle cx="{cx}" cy="{cy}" r="{r_}" fill="{PETROL_L}" fill-opacity="{o}"/>')
    b.append(f'<g filter="url(#{p}-sh)"><rect x="{cx - 46}" y="{cy - 46}" width="92" height="92" rx="24" fill="{WHITE}"/></g>')
    b.append(f'<g transform="translate({cx - 26} {cy - 26}) scale(1.3)" fill="none"><circle cx="20" cy="20" r="17" stroke="{PETROL}" stroke-width="2.25"/><path d="M12.5 28.5V17.75L20 12.5L27.5 17.75V28.5H22.75V21.5H17.25V28.5H12.5Z" fill="{PETROL}"/></g>')
    b.append(f'<text x="{cx}" y="{cy + 72}" font-size="12" font-weight="600" fill="{WHITE}" text-anchor="middle" letter-spacing=".5">Kaimbrya</text>')
    for name, x, y in nodes:
        b.append(f'<g filter="url(#{p}-sh)"><circle cx="{x}" cy="{y}" r="27" fill="{WHITE}"/></g><g transform="translate({x} {y})">{icons[name]}</g>')
        b.append(f'<text x="{x}" y="{y + 46}" font-size="11.5" font-weight="600" fill="{WHITE}" text-anchor="middle">{name}</text>')
    svg("hub", w, h, "\n".join(b), "Six areas of community management feeding one shared Kaimbrya record")


# ── 13 · Rollout banner: a hillside of homes above the sea ───────────────────
def rollout():
    p, w, h = "ro", 1212, 400
    rnd = random.Random(19)
    b = [ground(p, w, h, glow=(0.8, 0.35), warm=(0.92, 0.2))]
    b.append(f'<circle cx="1110" cy="86" r="70" fill="{MAHOE_S}" fill-opacity=".1"/><circle cx="1110" cy="86" r="38" fill="{MAHOE_S}" fill-opacity=".9"/>')
    b.append(f'<path d="M0 330C260 320 520 300 680 250C760 205 820 200 880 168S1000 118 1090 150S1190 150 1212 140V400H0Z" fill="#174b5d" fill-opacity=".55"/>')
    u, ox, oy = 31, 862, 100
    iso = lambda x, y, z=0: (ox + (x - y) * u * 0.866, oy + (x + y) * u * 0.5 - z * u)
    poly = lambda pts, fill, op=1, stroke=PALE, sw=.8, so=.45: f'<path d="M{"L".join(f"{f(X)} {f(Y)}" for X, Y in (iso(*q) for q in pts))}Z" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-opacity="{so}" stroke-width="{sw}" stroke-linejoin="round"/>'
    GX, GY = 10, 5
    # floating platform
    b.append(poly([(-.4, GY + .4, 0), (GX + .4, GY + .4, 0), (GX + .4, GY + .4, -.55), (-.4, GY + .4, -.55)], "#0f3442", so=.25))
    b.append(poly([(GX + .4, -.4, 0), (GX + .4, GY + .4, 0), (GX + .4, GY + .4, -.55), (GX + .4, -.4, -.55)], "#0b2a35", so=.25))
    b.append(poly([(-.4, -.4, 0), (GX + .4, -.4, 0), (GX + .4, GY + .4, 0), (-.4, GY + .4, 0)], "#1d5a6e", so=.35))
    # the street through the middle, with a gate at its entrance
    b.append(poly([(-.4, 2.18, 0), (GX + .4, 2.18, 0), (GX + .4, 2.82, 0), (-.4, 2.82, 0)], "#0f3442", so=.2))
    for k in range(GX):
        X1, Y1 = iso(k + .2, 2.5); X2, Y2 = iso(k + .6, 2.5)
        b.append(f'<path d="M{f(X1)} {f(Y1)}L{f(X2)} {f(Y2)}" stroke="{MAHOE_S}" stroke-opacity=".6" stroke-width="1.6"/>')
    items = []
    for gx in range(GX):
        for gy in range(GY):
            if gy == 2:
                continue
            if rnd.random() < 0.16:
                items.append((gx + gy, "tree", gx, gy)); continue
            items.append((gx + gy, "house", gx, gy))
    items.append((-.5 + 2.5, "gate", 0, 0))
    for _, kind, gx, gy in sorted(items):
        if kind == "gate":
            for yy in (2.12, 2.88):
                b.append(poly([(-.62, yy - .1, 0), (-.42, yy - .1, 0), (-.42, yy + .1, 0), (-.62, yy + .1, 0)], WALL, so=.3))
                b.append(poly([(-.42, yy - .1, 0), (-.42, yy + .1, 0), (-.42, yy + .1, .55), (-.42, yy - .1, .55)], WALL, so=.4))
                b.append(poly([(-.62, yy + .1, 0), (-.42, yy + .1, 0), (-.42, yy + .1, .55), (-.62, yy + .1, .55)], PALE, so=.4))
            X1, Y1 = iso(-.52, 2.2, .42); X2, Y2 = iso(-.52, 2.95, .62)
            b.append(f'<path d="M{f(X1)} {f(Y1)}L{f(X2)} {f(Y2)}" stroke="{RED}" stroke-width="3.2" stroke-linecap="round"/><path d="M{f(X1)} {f(Y1)}L{f(X2)} {f(Y2)}" stroke="{WHITE}" stroke-width="3.2" stroke-dasharray="5 5" stroke-linecap="round"/>')
            continue
        if kind == "tree":
            X, Y = iso(gx + .5, gy + .5)
            b.append(f'<path d="M{f(X)} {f(Y)}V{f(Y - 20)}" stroke="{TRUNK}" stroke-width="2.4" stroke-linecap="round"/><circle cx="{f(X)}" cy="{f(Y - 24)}" r="10" fill="{LEAF}"/><circle cx="{f(X - 6)}" cy="{f(Y - 18)}" r="7" fill="{LEAF_L}"/><circle cx="{f(X + 6)}" cy="{f(Y - 19)}" r="7" fill="{LEAF_L}"/>')
            continue
        x0, x1, y0, y1 = gx + .14, gx + .86, gy + .16, gy + .84
        hgt = rnd.choice([.55, .6, .75]) if gy in (0, 1) else rnd.choice([.5, .6])
        rh = .32; ym = (y0 + y1) / 2
        roof = rnd.choice([MAHOE, "#d9a35a", MAHOE, "#b97a24"])
        b.append(poly([(x1, y0, 0), (x1, y1, 0), (x1, y1, hgt), (x1, y0, hgt)], "#174b5d"))
        b.append(poly([(x0, y1, 0), (x1, y1, 0), (x1, y1, hgt), (x0, y1, hgt)], WALL, so=.6))
        for wx in (.22, .58):
            lit = rnd.random() < .55
            b.append(poly([(x0 + wx * (x1 - x0), y1, hgt * .38), (x0 + (wx + .16) * (x1 - x0), y1, hgt * .38), (x0 + (wx + .16) * (x1 - x0), y1, hgt * .72), (x0 + wx * (x1 - x0), y1, hgt * .72)], MAHOE_S if lit else PETROL_L, so=0))
        b.append(poly([(x1, y0, hgt), (x1, y1, hgt), (x1, ym, hgt + rh)], PALE, so=.5))
        b.append(poly([(x0, y1, hgt), (x1, y1, hgt), (x1, ym, hgt + rh), (x0, ym, hgt + rh)], roof, so=.35))
    svg("rollout", w, h, "\n".join(b), "An isometric model of a gated community: homes either side of a street, with a gate at the entrance")


# ── 14 · Welcome: an open gate and the path home ─────────────────────────────
def welcome():
    p, w, h = "wl", 432, 840
    b = [ground(p, w, h, glow=(0.55, 0.3), warm=(0.5, 0.55))]
    b.append(f'<defs><linearGradient id="wl-path" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e9dcc0"/><stop offset="1" stop-color="#e9dcc0" stop-opacity=".35"/></linearGradient></defs>')
    b.append(f'<path d="M0 470C120 430 300 440 432 420V840H0Z" fill="{PETROL}"/>')
    b.append(house(186, 400, 96, 70, "pitched", True, MAHOE))
    b.append(f'<circle cx="234" cy="430" r="80" fill="{MAHOE_S}" fill-opacity=".08"/>')
    b.append(f'<path d="M150 840C186 700 214 560 226 470H242C254 560 282 700 318 840Z" fill="url(#wl-path)"/>')
    for (x, y, s) in [(140, 470, .8), (330, 470, .85), (60, 600, 1.2), (400, 610, 1.15)]:
        b.append(palm(x, y, s))
    for x in (110, 358):
        b.append(f'<rect x="{x - 18}" y="520" width="36" height="140" fill="{WALL}"/><rect x="{x - 23}" y="510" width="46" height="12" fill="{PALE}"/><circle cx="{x}" cy="500" r="8" fill="{MAHOE_S}"/><circle cx="{x}" cy="500" r="22" fill="{MAHOE_S}" fill-opacity=".2"/>')
    bars = lambda x0, x1, top0, top1, bot0, bot1: "".join(
        f'<path d="M{f(x0 + (x1 - x0) * t)} {f(top0 + (top1 - top0) * t)}V{f(bot0 + (bot1 - bot0) * t)}" />' for t in [i / 6 for i in range(7)])
    b.append(f'<g fill="none" stroke="{MAHOE_S}" stroke-width="3">{bars(128, 70, 540, 520, 652, 690)}<path d="M128 540L70 520M128 596L70 604M128 652L70 690"/></g>')
    b.append(f'<g fill="none" stroke="{MAHOE_S}" stroke-width="3">{bars(340, 398, 540, 520, 652, 690)}<path d="M340 540L398 520M340 596L398 604M340 652L398 690"/></g>')
    b.append(f"""<g transform="translate(60 168) rotate(-3)" filter="url(#{p}-sh)">
    <rect width="300" height="86" rx="18" fill="{WHITE}"/>
    <rect x="18" y="20" width="46" height="46" rx="10" fill="{PETROL}"/><rect x="18" y="20" width="46" height="13" rx="6" fill="{MAHOE}"/>
    <path d="M28 46h8M28 54h8M42 46h12M42 54h12" stroke="{WHITE}" stroke-width="3" stroke-linecap="round"/>
    <text x="80" y="38" font-size="16" font-weight="600" fill="{INK}">Your walkthrough</text>
    <text x="80" y="58" font-size="12" fill="{MUTED}">Set up with your own units and fees</text></g>""")
    svg("welcome", w, h, "\n".join(b), "An open gate and a path leading to a home")


if __name__ == "__main__":
    for fn in (cover, security, repair, amenities, communities, hub, rollout, welcome):
        fn()
    print("ok")
