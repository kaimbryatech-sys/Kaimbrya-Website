# Pricing calculator: QA evidence

Feature: `/pricing/`, the estimate simulator and quote request. Website only; no change to the Kaimbrya app or its database.
Rate card `2026-10-16.1` in `src/content/pricing-config.ts`: US$150.00 per community + US$0.50 per home, monthly. Illustrative simulation rates: US$0.40, 0.50, 0.65, 0.80, 1.00 (not approved prices). USD only at launch; JMD is off until a dated rate is set in the same file.

## How it's tested

| Layer | Command | What it covers |
| --- | --- | --- |
| Calculation engine | `npm run test:pricing` | `src/lib/pricing.ts` with Node's test runner (19 tests) |
| Browser, local build | `npm run build && npm run verify` | The page as a visitor uses it: amounts on screen, presets, validation, quote payload, accessibility, overflow |
| Browser, live site | `npm run verify:live` | Page loads, links, accessibility and form registration on Netlify |

All money is integer US cents; formatting happens only for display. The page posts the visitor's inputs (class names, homes, rates, rate-card version) with the estimate, marked "website estimate, not an accepted quotation", so the team can recompute before quoting.

## Scenario matrix (16 October 2026)

| Scenario | Expected | Engine test | Browser check | Result |
| --- | --- | --- | --- | --- |
| 190 standard homes | US$245.00/month | Yes | Yes | Pass |
| 50 standard homes | US$175.00/month | Yes | Yes | Pass |
| 500 standard homes | US$400.00/month | Yes | Yes | Pass |
| Ruby 80 @ 0.50, Onyx 60 @ 0.65, Diamond 50 @ 0.80 | US$119.00 charges, US$269.00/month, +US$24.00 vs US$245.00 | Yes | Yes | Pass |
| Ruby and Diamond both 3-bedroom villas | Independent classes and subtotals | Yes | Yes | Pass |
| All custom classes at US$0.50 | Same as standard; no difference shown | Yes | — | Pass |
| Class added / removed | Units and totals move by that class | Yes | Yes | Pass |
| Bedrooms or property type changed | No change to the estimate | Yes | Yes | Pass |
| Class renamed | No change to the estimate | Yes | — | Pass |
| Zero homes | Base subscription only; per-home shows "—" | Yes | — | Pass |
| Negative count | Rejected with a message | Yes | Yes | Pass |
| Decimal count | Rejected with a message | Yes | Yes | Pass |
| Rate not on the rate card | Rejected | Yes | — (not selectable) | Pass |
| Standard comparison | Every home at US$0.50 | Yes | Yes | Pass |
| Annual estimate | 12 × monthly | Yes | — | Pass |
| Effective cost per home | Rounded half-up to the cent (US$269.00 / 190 = US$1.42) | Yes | — | Pass |
| Excessive values (100,001 per class; 21 classes) | Rejected; largest valid case exact | Yes | — | Pass |
| Blank and duplicate class names | Flagged (case- and space-insensitive); class left out until fixed | Yes | Yes | Pass |
| Malformed input (`abc`, `1e3`, `12a`) | Rejected | Yes | — | Pass |
| Floating-point trap (3 × US$0.65) | US$1.95 exactly | Yes | — | Pass |
| Every preset | Valid estimate | Yes | Premium, 190 | Pass |
| Loading a preset over changes | Warns, then replaces only on confirm | — | Yes | Pass |
| "I'm not sure of my property breakdown" | Back to standard with the total; explanation shown | — | Yes (US$245.00) | Pass |
| Reset | Restores 190 standard homes | — | Manual | Pass |

## Quote request

| Check | Result |
| --- | --- |
| Empty submit shows field errors and focuses the first | Pass (3 errors) |
| Valid submit posts form `pricing-inquiry` to Netlify Forms | Pass |
| Payload: homes, configuration, rate card, scenario text including "Monthly estimate: US$245.00", marked not a quotation | Pass |
| Confirmation shown only after a successful response | Pass |
| Button disabled while sending; form replaced after success (no double submit) | Pass |
| Network failure shows an error with the contact email | By design (same pattern as the demo form) |
| Spam protection | Honeypot field + Netlify's built-in spam filtering |
| Live submission and email notification | Not yet run: needs your approval, because it emails kaimbryatech@gmail.com |

## Responsive, accessibility, performance

- Widths 320, 360, 375, 390, 414, 600, 768, 900, 1024, 1180, 1440, 1920, in standard and premium modes, scrolled top to bottom: no horizontal overflow (120 checks).
- Desktop: the summary stays in view beside the editor and never overlaps the quote section. Below 1024 px a slim estimate bar stays at the bottom of the screen while editing.
- axe (WCAG 2.2 AA): no violations on the page at phone and desktop sizes, or after using the calculator and sending a quote.
- Native radios, buttons, inputs and selects throughout, so keyboard use follows the browser. The estimate is announced to screen readers after a short pause, not on every keystroke.
- Reduced motion turns off the calculator's transitions.
- Calculations run in the browser with no network requests. The homepage's JavaScript is unchanged (171 KB gzipped, under the 175 KB budget); the calculator loads only on `/pricing/`.

## Known limits and follow-ups

1. Netlify Forms has no server-side hook without adding a Netlify Function, so the received totals are the browser's. The request includes all inputs and the rate-card version, and is labelled for recomputation before quoting.
2. The illustrative rates (US$0.40–1.00) need commercial approval before they're treated as anything more than simulation values.
3. JMD equivalents are off. To switch them on, set `jmd` in `src/content/pricing-config.ts` with the rate, effective date and source, and keep it current.
4. The privacy policy now describes quote requests; it still needs the legal review listed in `LEGAL-REVIEW.md`.
