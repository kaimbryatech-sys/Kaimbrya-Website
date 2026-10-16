# Kaimbrya website

The public marketing site for Kaimbrya, kept separate from the app. It's a static Next.js site: every page is pre-rendered HTML, so it holds no app data, sessions or credentials.

- **Live (public demonstration):** https://kaimbrya.netlify.app
- **Repo:** `kaimbryatech-sys/Kaimbrya-Website`. Pushing to `main` deploys to Netlify.
- **Specification:** the "Kaimbrya Website Specification" doc. Product claims must follow its "Product facts" table.

## Run it

```bash
npm install
npm run dev        # http://localhost:3400
npm run build      # static site in out/
```

## Pages

| Page | Path |
| --- | --- |
| Home | `/` (opens with the signature story: a home is built and the community comes to life as you scroll) |
| Platform overview | `/platform/` (seven module sections with anchors, e.g. `#finance`) |
| Communication and transparency | `/communication/` (four pillars and the rumour-to-facts story) |
| Document library | `/library/` |
| Pricing | `/pricing/` (estimate simulator, free community domain setup and quote request; see `PRICING-QA.md`) |
| Explore Kaimbrya | `/tour/` (clickable community map, guided demos of guest access, finance, maintenance and governance, and a day in the community; fictional data, runs in the browser) |
| Readiness check | `/readiness/` (seven questions that recommend modules and show an indicative price; nothing is sent) |
| Journey to launch | `/launch/` (onboarding steps, free domain setup, rollout status, FAQs) |
| Board presentation kit | `/board-kit/` (printable, or save as PDF, to share with a board) |
| Resources | `/resources/` (guides: strata vs gated subdivisions, getting started, fair votes, moving off spreadsheets) |
| Solutions | `/solutions/gated-communities/`, `/strata-and-hoas/`, `/property-managers/`, `/developers/` |
| Book a demo | `/demo/` (`?type=gated` and similar pre-select the organisation type) |
| About, Contact | `/about/`, `/contact/` |
| Privacy policy, Terms of use | `/privacy/`, `/terms/` |

Copy lives in `src/content/` (`site.ts`, `platform.ts`, `solutions.ts`, `communication.ts`). Every price, rate and pricing disclaimer lives in `src/content/pricing-config.ts`; the arithmetic is in `src/lib/pricing.ts`; the legal and company pages are in `src/app/<page>/page.tsx`.

## Hosting and the demo form

- **Netlify** builds with `npm run build` and publishes `out/` (`netlify.toml`). HTTPS is on.
- **Demo and quote requests** use Netlify Forms (`demo-request` and `pricing-inquiry`). `public/__forms.html` is a hidden copy of the form that Netlify reads at deploy time. The page posts to it, and the thank-you message only shows once Netlify accepts the request. If sending fails, the form shows the contact email.
- **Notifications:** submissions are stored under Forms → demo-request in the Netlify dashboard. Email notifications to kaimbryatech@gmail.com are configured there, not in code.
- **Sign in:** the link stays hidden until `NEXT_PUBLIC_APP_SIGN_IN_URL` is set.
- **Site address:** link previews use Netlify's `URL` at build time, so a custom domain is picked up automatically. `NEXT_PUBLIC_SITE_URL` overrides it.
- **Search engines:** the site is `noindex` while it's a demonstration. Remove that in `src/app/layout.tsx` at the commercial launch.

## How it's put together

| Path | What it holds |
| --- | --- |
| `src/components/sections.tsx`, `blocks.tsx` | Page sections and shared blocks (server components, static HTML) |
| `src/components/Header.tsx`, `GuestJourney.tsx`, `RoleSwitcher.tsx`, `DemoForm.tsx`, `PricingSimulator.tsx`, `SignatureStory.tsx` | The only client components |
| `src/components/motion-features.ts` | framer-motion features, loaded after the page is interactive. Used only by the guest journey. |
| `src/story/` | The signature story: `scene.ts` draws the isometric home and community as functions of the story state; `runtime.ts` scrubs it with GSAP ScrollTrigger. It loads on the visitor's first scroll, so it stays out of the first-load budget. Reduced motion gets three still frames; without JavaScript, a poster and the full story as text. Copy is in `src/content/story.ts`. |
| `public/enhance.js` | Under 2 KB: reveal-on-scroll and the hero tilt. The page is complete without it. |
| `src/app/globals.css` | Brand and motion tokens, all styles, reduced-motion rules |
| `public/og.jpg` | The link-preview card shown by WhatsApp, email and social apps |
| `assets/screens/` | Full-resolution app captures, with `RECORD.md` listing the source and use of each |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run images` | Turns `assets/screens/` into responsive AVIF and WebP files |
| `npm run art` | Builds the illustrations in `public/art/` |
| `npm run og` | Rebuilds the link-preview card from the hero illustration |
| `npm run test:pricing` | Calculation tests for the pricing engine (Node's test runner, no extra dependencies) |
| `npm run verify` | Headless checks of the local build (run `npm run build` first) |
| `npm run verify:live` | Read-only checks of the deployed site; never submits the form. Add a URL to check another address. |
| `node scripts/story-record.mjs [outDir] [url]` | Records the signature story from the homepage (desktop and phone video plus stills). Serve `out/` first, or pass the live URL. |
| `node scripts/story-preview.mjs qa/story wide poster` | Rebuilds `public/art/story-poster.svg`, the frame shown before the story loads and without JavaScript |

## Checks

`npm run verify` serves `out/` from disk. On phone, tablet and desktop widths, with and without reduced motion, it checks:
- no console errors or failed requests;
- no horizontal overflow and no sections left hidden;
- axe finds no WCAG 2.2 AA violations;
- every internal link and anchor resolves;
- keyboard use of the menus, guest-journey steps and role tabs;
- demo form validation;
- performance on a simulated phone, with a 175 KB budget for gzipped JavaScript, which fails the run if exceeded.

`npm run verify:live` repeats the page, link, accessibility and placeholder checks against the live site. It also confirms Netlify has registered the demo form. Results are written to `qa/` (gitignored).

## Before the commercial launch

| Item | Status |
| --- | --- |
| Legal details | See `LEGAL-REVIEW.md`: the LLC's name, registration and address, governing law, data-protection obligations, retention period, plus a lawyer's review. |
| App sign-in address | Needed before the Sign in link can appear. |
| Custom domain | Still on the Netlify address. |
| Search indexing | Remove `noindex` at launch. |
| Naming the client | The rollout stays anonymous. Pyramid Point is named only with written permission. |
| Screens | They show the fictional "Mahoe Ridge" test community. |
