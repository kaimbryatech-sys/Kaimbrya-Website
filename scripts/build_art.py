"""Builds the website's inline SVG art into src/art/generated.ts.

    npm run art        (python3 scripts/build_art.py)

The drawing helpers come from the brochure (scripts/art-src/illustrations.py is a copy of
marketing/illustrations/build.py, and art-src/challenge.svg of its hand-drawn page 2 art).
Web-specific differences:
  - no generated dot field: the page paints a CSS dot pattern instead, which keeps each SVG small
  - landscape crops (4:3) for the audience cards
  - the challenge drawing is split into five fragments for the convergence scene
  - no font-family on the <svg>: text inherits the page's IBM Plex Sans from CSS
"""
import json
import random
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "art-src"))
import illustrations as il  # noqa: E402

il.dotfield = lambda *a, **k: ""  # the page draws the dots in CSS
captured: dict[str, tuple[int, int, str]] = {}
il.svg = lambda name, w, h, body, label: captured.__setitem__(name, (w, h, body))

f = il.f


def wrap(body: str, viewbox: str, slice_: bool = True, cls: str = "art") -> str:
    par = "xMidYMid slice" if slice_ else "xMidYMid meet"
    body = re.sub(r"\n\s*", "", body)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" preserveAspectRatio="{par}" class="{cls}" aria-hidden="true" focusable="false">{body}</svg>'


# ── Hero: a gated hillside community, landscape, no notification chips ─────────
def hero_scene() -> str:
    p, w, h = "hs", 1200, 720
    b = [il.ground(p, w, h, glow=(0.72, 0.3), warm=(0.85, 0.15))]
    b.append(f'<circle cx="1010" cy="150" r="104" fill="{il.MAHOE_S}" fill-opacity=".08"/><circle cx="1010" cy="150" r="60" fill="{il.MAHOE_S}" fill-opacity=".9"/>')
    b.append('<path d="M0 470C200 410 380 432 520 402S820 330 980 360S1200 352 1200 352V720H0Z" fill="#1a5266"/>')
    b.append(f'<path d="M0 540C220 492 420 520 600 488S960 458 1200 490V720H0Z" fill="{il.PETROL}"/>')
    for (x, y, ww, hh, k, roof) in [(520, 452, 88, 66, "pitched", il.MAHOE), (628, 430, 110, 88, "flat", None), (760, 436, 92, 68, "pitched", "#d9a35a"),
                                     (872, 408, 114, 92, "flat", None), (1010, 424, 90, 66, "pitched", il.MAHOE), (1112, 440, 84, 60, "flat", None)]:
        b.append(il.house(x, y, ww, hh, k, True, roof or il.MAHOE))
    b.append('<path d="M0 612C300 582 700 622 1200 586V720H0Z" fill="#174b5d"/>')
    b.append('<path d="M640 720C680 684 712 654 736 632L790 632C812 654 842 684 884 720Z" fill="#0f3442"/>')
    b.append(f'<path d="M763 638V720" stroke="{il.MAHOE_S}" stroke-opacity=".7" stroke-width="3" stroke-dasharray="12 12"/>')
    for x in (722, 806):
        b.append(f'<rect x="{x - 12}" y="566" width="24" height="70" fill="{il.WALL}"/><rect x="{x - 16}" y="558" width="32" height="9" fill="{il.PALE}"/><circle cx="{x}" cy="552" r="5" fill="{il.MAHOE_S}"/><circle cx="{x}" cy="552" r="14" fill="{il.MAHOE_S}" fill-opacity=".18"/>')
    arm = "".join(f'<rect x="{10 + k * 26}" y="0" width="13" height="8" fill="{il.RED}"/>' for k in range(4))
    b.append(f'<g transform="translate(818 600) rotate(-24)"><rect width="114" height="8" rx="2" fill="{il.WHITE}"/>{arm}</g>')
    for (x, y, s) in [(600, 600, 1.05), (958, 566, .9), (1156, 580, 1.0), (470, 640, .85)]:
        b.append(il.palm(x, y, s))
    return wrap("".join(b), f"0 0 {w} {h}")


# ── Audience card: three communities, each with its own records (landscape) ──
def communities_wide() -> str:
    p, w, h = "mw", 480, 360
    b = [il.ground(p, w, h, glow=(0.5, 0.4))]
    for i, (x, y, rot, name) in enumerate([(22, 98, -4, "Mahoe Ridge"), (170, 72, 2, "Palm Grove"), (318, 100, -2, "Seaview Heights")]):
        rnd = random.Random(i + 3)
        houses, hx = [], 8
        while hx < 112:
            ww, hh = rnd.choice([20, 24]), rnd.choice([16, 20])
            houses.append(il.house(hx, 62 - hh, ww, hh, rnd.choice(["flat", "pitched"]), True, rnd.choice([il.MAHOE, "#d9a35a"])))
            hx += ww + rnd.choice([8, 10])
        b.append(f'<g transform="translate({x} {y}) rotate({rot})" filter="url(#{p}-sh)">'
                 f'<rect width="140" height="168" rx="14" fill="{il.WHITE}"/>'
                 f'<g transform="translate(8 8)"><rect width="124" height="82" rx="9" fill="{il.PETROL}"/>'
                 f'<path d="M0 52C30 40 60 50 84 42S118 40 124 44V73a9 9 0 0 1-9 9H9A9 9 0 0 1 0 73Z" fill="#1a5266"/>{"".join(houses)}</g>'
                 f'<text x="14" y="114" font-size="11.5" font-weight="600" fill="{il.INK}">{name}</text>'
                 f'<rect x="14" y="128" width="80" height="22" rx="11" fill="{il.PAPER}" stroke="{il.PALE}"/>'
                 f'<path d="M25 136h7v6h-7ZM26.5 136v-2a2 2 0 0 1 4 0v2" fill="none" stroke="{il.PETROL}" stroke-width="1.5"/>'
                 f'<text x="38" y="143" font-size="9.5" fill="{il.MUTED}">Own records</text></g>')
    return wrap("".join(b), f"0 0 {w} {h}")


# ── The challenge drawing, split into fragments ───────────────────────────────
SRC = (HERE / "art-src" / "challenge.svg").read_text()
TAG = re.compile(r"<g\b|</g>")


def group_inner(marker: str) -> str:
    """Inner markup of the <g> whose opening tag contains `marker` (nested groups kept)."""
    at = SRC.index(marker)
    start = SRC.rfind("<g", 0, at)
    i = SRC.index(">", start) + 1
    depth, j = 1, i
    while depth:
        m = TAG.search(SRC, j)
        depth += -1 if m.group(0) == "</g>" else 1
        j = m.end()
    return SRC[i:m.start()]


def fragments() -> dict[str, str]:
    chat = group_inner('translate(36 92) rotate(-6)')
    sheet = group_inner('translate(196 252) rotate(5)')
    statement = group_inner('translate(28 412) rotate(-4)')
    logbook = group_inner('translate(232 500) rotate(7)')
    pen = group_inner('translate(248 690) rotate(-32)')
    phone = group_inner('translate(84 616) rotate(-10)')
    chip = ('<g transform="translate(200 79)"><path d="M3 6L-6 11 3 16Z" fill="#c98a2b"/>'
            '<rect width="84" height="22" rx="11" fill="#c98a2b"/>'
            '<text x="42" y="14.5" font-size="9" font-weight="600" fill="#ffffff" text-anchor="middle">Which unit?</text></g>')
    waves = ('<g fill="none" stroke="#f1c27d" stroke-linecap="round" stroke-width="2.5">'
             '<path d="M-10 40a40 40 0 0 0-2 52" stroke-opacity=".9"/><path d="M-22 30a56 56 0 0 0-3 74" stroke-opacity=".5"/>'
             '<path d="M82 38a40 40 0 0 1 2 52" stroke-opacity=".9"/><path d="M94 28a56 56 0 0 1 3 74" stroke-opacity=".5"/></g>')
    return {
        "chat": wrap(chat, "-2 -12 214 166", False, "frag-art"),
        "sheet": wrap(sheet, "0 0 170 132", False, "frag-art"),
        "statement": wrap(statement + chip, "0 0 290 150", False, "frag-art"),
        "logbook": wrap(logbook + f'<g transform="translate(80 170) rotate(-38)">{pen}</g>', "0 -8 178 196", False, "frag-art"),
        "phone": wrap(waves + phone, "-30 -4 136 140", False, "frag-art"),
    }


FILE_FONT = "font-family=\"'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif\""


def main() -> None:
    for fn in (il.security, il.hub, il.rollout, il.welcome):
        fn()
    # Decorative scenes ship as separate, cacheable SVG files (loaded lazily as <img>),
    # so they are neither inlined nor repeated in the page's hydration data.
    files = {
        "hero-scene": hero_scene(),
        "audience-gated": wrap(captured["security"][2], "0 330 344 258"),
        "audience-strata": wrap(captured["hub"][2], "0 170 360 270"),
        "audience-managers": communities_wide(),
        "audience-developers": wrap(captured["rollout"][2], "690 40 480 360"),
        "welcome": wrap(captured["welcome"][2], "0 320 432 520"),
    }
    out_dir = HERE.parent / "public" / "art"
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, svg_ in files.items():
        svg_ = svg_.replace(' class="art" aria-hidden="true" focusable="false"', f" {FILE_FONT}")
        (out_dir / f"{name}.svg").write_text(svg_)
        print(f"public/art/{name}.svg {len(svg_) / 1024:6.1f} KB")
    # The convergence fragments stay inline (small, and their text uses the page font).
    inline = {f"frag{k[0].upper()}{k[1:]}": v for k, v in fragments().items()}
    lines = ["// Generated by scripts/build_art.py. Do not edit by hand; edit the script and run `npm run art`.", ""]
    for k, v in inline.items():
        lines.append(f"export const {k} = {json.dumps(v)};")
    (HERE.parent / "src" / "art" / "generated.ts").write_text("\n".join(lines) + "\n")
    for k, v in inline.items():
        print(f"inline {k:18} {len(v) / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
