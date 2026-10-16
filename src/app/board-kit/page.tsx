import type { Metadata } from "next";
import { ArtStage, CtaBand, PageHero } from "@/components/blocks";
import { BoardKitActions } from "@/components/extras/BoardKitActions";
import { LogoMark } from "@/components/icons";
import { boardKit, journey, rolloutSentence } from "@/content/extras";
import { platform } from "@/content/platform";
import { pricingConfig as cfg } from "@/content/pricing-config";
import { config } from "@/content/site";
import { formatUSD, standardEstimate } from "@/lib/pricing";
import "./board-kit.css";

export const metadata: Metadata = { title: boardKit.meta.title, description: boardKit.meta.description };

// The same address the layout uses, so printed links point at the live site.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "https://kaimbrya.netlify.app").replace(/\/+$/, "");
const siteHost = siteUrl.replace(/^https?:\/\//, "");

const sections = [
  { id: "what", title: boardKit.what.title },
  { id: "problems", title: boardKit.problems.title },
  { id: "modules", title: boardKit.modulesTitle },
  { id: "pricing", title: boardKit.pricing.title },
  { id: "rollout", title: boardKit.rolloutTitle },
  { id: "domain", title: boardKit.domain.title },
  { id: "decisions", title: boardKit.decisions.title },
  { id: "next", title: boardKit.next.title },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SheetHead({ id }: { id: SectionId }) {
  const index = sections.findIndex((s) => s.id === id);
  const section = sections[index];
  return (
    <header className="bk-sheet-head">
      <p className="bk-sheet-meta"><span>Kaimbrya · Board presentation kit</span><span>Section {index + 1} of {sections.length}</span></p>
      <h2 id={`bk-${id}-title`} className="bk-sheet-title">{section?.title}</h2>
    </header>
  );
}

export default function BoardKitPage() {
  const { hero, what, problems, pricing, domain, decisions, next } = boardKit;
  const examples = pricing.examples.map((units) => ({ units, est: standardEstimate(units, cfg) }));
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Board presentation kit" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Read the kit", href: "#kit" }}
        secondary={{ label: "Book a board demo", href: "/demo/" }}
        visual={<ArtStage scene="audience-strata" shot={{ name: "vote-card", device: "panel", alt: "A Kaimbrya vote on the 2027 budget, anonymous, with 50% quorum" }} />}
      />

      <section id="kit" className="section bg-paper bk" aria-label="Board presentation kit">
        <div className="wrap bk-wrap">
          <div className="bk-toolbar">
            <p className="bk-toolbar-text">Each section prints on its own A4 page.</p>
            <BoardKitActions title="Kaimbrya: board presentation kit" text="An overview of Kaimbrya to share with our board." />
          </div>

          <div className="bk-doc">
            {/* Cover */}
            <section className="bk-sheet bk-cover" aria-labelledby="bk-cover-title">
              <p className="bk-brand"><LogoMark /><span>Kaimbrya</span></p>
              <p className="eyebrow bk-cover-eyebrow">Board presentation kit</p>
              <h2 id="bk-cover-title" className="bk-cover-title">Kaimbrya for our community</h2>
              <p className="bk-cover-lead">A short overview for the board: what Kaimbrya is, what it costs, how it would roll out and what we&apos;d need to decide.</p>
              <dl className="bk-fill">
                <div><dt>Prepared for</dt><dd><span className="sr-only">Blank, to fill in</span></dd></div>
                <div><dt>Presented by</dt><dd><span className="sr-only">Blank, to fill in</span></dd></div>
                <div><dt>Date</dt><dd><span className="sr-only">Blank, to fill in</span></dd></div>
              </dl>
              <nav aria-label="Kit contents" className="bk-contents">
                <h3>Contents</h3>
                <ol>
                  {sections.map((s, i) => (
                    <li key={s.id}><a href={`#bk-${s.id}`}><span>{i + 1}</span>{s.title}</a></li>
                  ))}
                </ol>
              </nav>
            </section>

            {/* 1 · What Kaimbrya is */}
            <section id="bk-what" className="bk-sheet" aria-labelledby="bk-what-title">
              <SheetHead id="what" />
              <p className="bk-lead">{what.lead}</p>
              <ul className="ticks bk-list">{what.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              <p className="bk-callout"><strong>Rolling out now.</strong> {rolloutSentence}</p>
            </section>

            {/* 2 · Problems it solves */}
            <section id="bk-problems" className="bk-sheet" aria-labelledby="bk-problems-title">
              <SheetHead id="problems" />
              <p className="bk-lead">{problems.lead}</p>
              <table className="bk-table bk-table--compare">
                <caption className="sr-only">Today, and with Kaimbrya</caption>
                <thead><tr><th scope="col">Today</th><th scope="col">With Kaimbrya</th></tr></thead>
                <tbody>
                  {problems.rows.map((r) => (
                    <tr key={r.today}><td data-label="Today">{r.today}</td><td data-label="With Kaimbrya">{r.with}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 3 · Modules */}
            <section id="bk-modules" className="bk-sheet" aria-labelledby="bk-modules-title">
              <SheetHead id="modules" />
              <p className="bk-lead">{platform.index.lead}</p>
              <div className="bk-modules">
                {platform.index.groups.map((g) => (
                  <div key={g.id} className="bk-module" style={{ borderTopColor: g.accent }}>
                    <h3>{g.title}</h3>
                    <p>{g.text}</p>
                    <ul aria-label={`${g.title}: modules`}>{g.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="bk-small">More detail: <a href="/platform/">{siteHost}/platform/</a></p>
            </section>

            {/* 4 · Pricing */}
            <section id="bk-pricing" className="bk-sheet" aria-labelledby="bk-pricing-title">
              <SheetHead id="pricing" />
              <p className="bk-formula">
                <span><strong>{formatUSD(cfg.baseCents)}</strong> a month for the community</span>
                <span className="bk-plus" aria-label="plus">+</span>
                <span><strong>{formatUSD(cfg.standardRateCents)}</strong> per home, per month</span>
              </p>
              <p className="bk-lead">The standard price is the same for every home, whatever its size or type. Here&apos;s what it comes to for a few community sizes:</p>
              <table className="bk-table bk-table--price">
                <caption className="sr-only">Indicative monthly and yearly prices by number of homes</caption>
                <thead><tr><th scope="col">Community size</th><th scope="col">A month</th><th scope="col">A year</th><th scope="col">Per home, per month</th></tr></thead>
                <tbody>
                  {examples.map(({ units, est }) => (
                    <tr key={units} className={units === cfg.defaultUnits ? "bk-row-highlight" : undefined}>
                      <th scope="row">{units.toLocaleString("en-US")} homes</th>
                      <td data-label="A month">{formatUSD(est.monthlyCents)}</td>
                      <td data-label="A year">{formatUSD(est.annualCents)}</td>
                      <td data-label="Per home, per month">{est.perUnitCents === null ? "–" : formatUSD(est.perUnitCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="disclaimer bk-disclaimer">
                <p className="disclaimer-title">{cfg.copy.disclaimerTitle}</p>
                <p>{cfg.copy.disclaimer}</p>
                <p>{cfg.copy.extras}</p>
                <p className="disclaimer-version">Rate card {cfg.version}. Estimate your own: <a href="/pricing/">{siteHost}/pricing/</a></p>
              </div>
            </section>

            {/* 5 · Rollout */}
            <section id="bk-rollout" className="bk-sheet" aria-labelledby="bk-rollout-title">
              <SheetHead id="rollout" />
              <p className="bk-lead">Seven steps, in this order. The timing is planned with the board before anything is agreed.</p>
              <ol className="bk-steps">
                {journey.map((s, i) => (
                  <li key={s.id}>
                    <span className="bk-step-num" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="bk-small">The full journey: <a href="/launch/">{siteHost}/launch/</a></p>
            </section>

            {/* 6 · Domain */}
            <section id="bk-domain" className="bk-sheet" aria-labelledby="bk-domain-title">
              <SheetHead id="domain" />
              <p className="bk-lead">{domain.lead}</p>
              <ul className="ticks bk-list">{domain.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <dl className="bk-costs" aria-label="What a community domain costs">
                {cfg.domain.costs.map((c) => (
                  <div key={c.item}><dt>{c.item}</dt><dd>{c.cost}</dd></div>
                ))}
              </dl>
              <p className="bk-small">Domain setup never changes the subscription price. More: <a href="/pricing/#domain">{siteHost}/pricing/#domain</a></p>
            </section>

            {/* 7 · Decisions */}
            <section id="bk-decisions" className="bk-sheet" aria-labelledby="bk-decisions-title">
              <SheetHead id="decisions" />
              <p className="bk-lead">{decisions.lead}</p>
              <ul className="bk-decide">
                {decisions.items.map((d) => (
                  <li key={d.title}><span className="bk-box" aria-hidden="true" /><p><strong>{d.title}:</strong> {d.text}</p></li>
                ))}
              </ul>
              <p className="bk-callout">{decisions.note}</p>
            </section>

            {/* 8 · Next steps */}
            <section id="bk-next" className="bk-sheet" aria-labelledby="bk-next-title">
              <SheetHead id="next" />
              <ol className="bk-next">
                {next.steps.map((s) => (
                  <li key={s.href}>
                    <h3><a href={s.href}>{s.title}</a></h3>
                    <p>{s.text}</p>
                    <p className="bk-url">{siteHost}{s.href}</p>
                  </li>
                ))}
              </ol>
              <div className="bk-contact">
                <h3>Questions?</h3>
                <p>Email <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> or visit <a href="/contact/">{siteHost}/contact/</a>.</p>
              </div>
              <p className="bk-small">Kaimbrya is community management software. This kit is general information, not legal or financial advice. Prices are indicative; final pricing is confirmed in a personalized proposal and signed agreement.</p>
            </section>
          </div>
        </div>
      </section>

      <CtaBand
        title="Show your board the real thing."
        text="We'll walk your board through Kaimbrya with demonstration data, and answer their questions."
        primary={{ label: "Book a board demo", href: "/demo/" }}
        secondary={{ label: "Request a quote", href: "/pricing/#quote" }}
      />
    </>
  );
}
