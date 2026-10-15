# Kaimbrya website: homepage prototype

The public marketing site for Kaimbrya, as a separate project from the app. It's a static Next.js site: every page is pre-rendered HTML, so it holds no app data, sessions or credentials.

The specification behind it is the "Kaimbrya Website Specification" doc.

## Run it

```bash
npm install
npm run dev        # http://localhost:3400
```

Production build (static files in `out/`, ready for Vercel or any static host):

```bash
npm run build
```

Checks (headless, no server needed):

```bash
npm run typecheck
npm run build && npm run verify   # screenshots and qa/report.json
```

## What's built

**Homepage**, ten sections:
1. Hero
2. Credibility
3. The old way vs Kaimbrya
4. Finance
5. Guest access
6. Every role
7. Properties and maintenance
8. Communication and governance
9. Solutions
10. Final call to action

**Three signature sequences:**
- **A · Hero.** The headline is readable on the first frame. The screens and notifications settle in, the illustration drifts slowly, and a mouse tilts the screens slightly (desktop only).
- **B · Convergence.** On desktop with motion allowed, a pinned scene driven by scroll: the five old tools (group chat, spreadsheet, bank statement, gate logbook, phone) converge into the Kaimbrya dashboard while the copy swaps. It reverses when you scroll back. On phones, with reduced motion, or without JavaScript, it's a static before and after.
- **C · Guest access.** Invite → Approve → Arrive. You control it (click, arrow keys or swipe), with a progress bar and no autoplay.

**Navigation:** a transparent header that turns solid on scroll, Platform and Solutions mega menus, and a full-screen mobile menu.

**Book a demo (`/demo/`):** a six-field form with validation, a spam honeypot, and the organisation type pre-selected from the Solutions cards (`?type=`).

## How it's put together

| Path | What it holds |
| --- | --- |
| `src/content/site.ts` | All copy and configuration. Claims are checked against the app. |
| `src/components/sections.tsx` | The homepage sections (server components, static HTML) |
| `src/components/Header.tsx`, `GuestJourney.tsx`, `RoleSwitcher.tsx`, `DemoForm.tsx` | The only client components |
| `public/enhance.js` | Reveals, the scroll progress for the convergence scene, and the hero tilt. About 2 KB. The page is complete without it. |
| `src/app/globals.css` | Brand and motion tokens, and all styles, including the reduced-motion rules |
| `assets/screens/` | Full-resolution app captures and `RECORD.md`, which lists the source page, date and use of each |
| `scripts/build-images.mjs` | Turns the captures into responsive AVIF and WebP files plus a typed size list (`npm run images`) |
| `scripts/build_art.py` | Builds the illustrations from the brochure's drawing code (`npm run art`) |
| `scripts/verify.mjs` | Headless checks; see below |

Motion uses one set of tokens, defined in `globals.css`:

| Token | Duration | Used for |
| --- | --- | --- |
| fast | 180 ms | Hover and focus |
| menu | 240 ms | Menus |
| reveal | 500 ms, staggered by 70 ms | Section reveals |
| swap | 400 ms | Tabs and steps |

The ambient drift is 22 s. Only `transform` and `opacity` are animated.

## Verification (15 October 2026)

`npm run verify` serves `out/` from disk and checks the site at 390, 768 and 1440 px, with and without reduced motion:

- **Errors:** no console errors and no failed requests.
- **Overflow:** no horizontal overflow at any width.
- **Accessibility:** axe finds no WCAG 2.2 AA violations on the homepage (phone, tablet, desktop) or the demo page.
- **Keyboard:** arrow keys, Home and End work on the guest-access steps and role tabs. Escape closes the mega menu and returns focus to its button.
- **Mobile menu:** focus moves into the menu and Escape closes it.
- **Demo form:** errors are announced, focus moves to the first problem, the success state appears, and the prototype note shows.
- **Performance** (simulated phone, roughly Fast 4G with a 4× CPU slowdown; confirm with Lighthouse once deployed):
  - largest contentful paint: about 0.9 s (the hero headline);
  - layout shift: 0;
  - first-load transfer: 294 KB in 16 requests;
  - JavaScript: 143 KB gzipped, of which Next.js and React are about 113 KB.

## Before launch: open items

| Item | Status |
| --- | --- |
| Demo requests | They go nowhere until `NEXT_PUBLIC_DEMO_ENDPOINT` is set. The form shows a visible prototype note until then. |
| Sign in | The link stays hidden until `NEXT_PUBLIC_APP_SIGN_IN_URL` is set. |
| Company pages | About, Contact, Privacy, Terms and the Company menu aren't built yet. They need company details. |
| Platform and Solutions pages | Menu links point to the homepage sections until the dedicated pages exist. |
| Search indexing | The site is set to `noindex` while it's a prototype. Remove that in `src/app/layout.tsx` at launch. |
| Rollout facts | The credibility strip says "more than 190 homes" (anonymous). Confirm the wording before launch. |
| Screens | They show the fictional "Mahoe Ridge" test community. The QR code in the guest pass is a test token that expires on 17 October 2026. |
