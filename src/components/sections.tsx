import Link from "next/link";
import type { CSSProperties } from "react";
import {
  audiences,
  audiencesSection,
  community,
  convergence,
  credibility,
  finalCta,
  finance,
  guestAccess,
  hero,
  operations,
  roles,
} from "@/content/site";
import { Art, Scene } from "./Art";
import { CtaBand, Reveal } from "./blocks";
import { DesktopFrame, PanelFrame, PhoneFrame } from "./Frames";
import { GuestJourney } from "./GuestJourney";
import { ArrowRight, Check, Receipt } from "./icons";
import { RoleSwitcher } from "./RoleSwitcher";
import { Screen } from "./Screen";

// ── 1 · Hero (signature A) ──────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="hero on-dark" aria-labelledby="hero-title">
      <Scene name="hero-scene" className="hero-art" priority position="72% 100%" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="display">
            {hero.titleStart} <em>{hero.titleEmphasis}</em>
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-ctas">
            <Link prefetch={false} href={hero.primary.href} className="btn btn-primary">{hero.primary.label} <ArrowRight /></Link>
            <a href={hero.secondary.href} className="btn btn-secondary">{hero.secondary.label}</a>
          </div>
        </div>
        <div data-tilt-zone>
          <div className="hero-stage" data-tilt>
            <DesktopFrame>
              <Screen
                name="maintenance-board"
                alt="Kaimbrya on a desktop: the maintenance task board with open, blocked and completed counts"
                sizes="(min-width: 1024px) 560px, 86vw"
                priority
                hideBelow={640}
              />
            </DesktopFrame>
            <PhoneFrame>
              <Screen
                name="guest-pass"
                alt="A Kaimbrya guest pass on a phone: a QR code marked Approved for entry"
                sizes="(min-width: 640px) 170px, 222px"
                priority
              />
            </PhoneFrame>
            <div className="hero-chip hero-chip--a">
              <span className="chip-icon" style={{ background: "var(--color-leaf)" }}><Check /></span>
              <span className="chip-text"><strong>Guest approved</strong><span>Lot 23 · arriving at 2:00 PM</span></span>
            </div>
            <div className="hero-chip hero-chip--b">
              <span className="chip-icon" style={{ background: "var(--color-petrol-light)" }}><Receipt /></span>
              <span className="chip-text"><strong>Dues paid · October</strong><span>Receipt in the owner&apos;s app</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 2 · Credibility ─────────────────────────────────────────────────────────
export function Credibility() {
  return (
    <section className="cred" aria-labelledby="cred-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{credibility.eyebrow}</p>
          <h2 id="cred-title" className="title" style={{ marginTop: 16, maxWidth: 720 }}>{credibility.title}</h2>
        </Reveal>
        <div className="cred-grid">
          {credibility.items.map((item, i) => (
            <Reveal key={item.title} i={i + 1} className="cred-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 3 · The old way vs Kaimbrya (signature B) ───────────────────────────────
const FRAGMENTS = [
  { art: "fragChat", cls: "frag--chat" },
  { art: "fragSheet", cls: "frag--sheet" },
  { art: "fragStatement", cls: "frag--statement" },
  { art: "fragLogbook", cls: "frag--logbook" },
  { art: "fragPhone", cls: "frag--phone" },
] as const;

export function Convergence() {
  return (
    <section id="platform" className="conv on-dark dots" data-scroll-progress aria-labelledby="conv-title">
      <div className="wrap conv-stage">
        <div className="conv-before">
          <p className="eyebrow">{convergence.before.eyebrow}</p>
          <h2 id="conv-title" className="title">{convergence.before.title}</h2>
          <ul className="conv-list">
            {convergence.before.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="conv-frags" aria-hidden="true">
          {FRAGMENTS.map((f) => <Art key={f.art} name={f.art} className={`frag ${f.cls}`} />)}
        </div>
        <div className="conv-after">
          <p className="eyebrow">{convergence.after.eyebrow}</p>
          <h2 className="title">{convergence.after.title}</h2>
          <p className="lead">{convergence.after.text}</p>
          <Link prefetch={false} href={convergence.after.cta.href} className="btn btn-primary">{convergence.after.cta.label} <ArrowRight /></Link>
        </div>
        <div className="conv-result">
          <DesktopFrame>
            <Screen
              name="manager-dashboard"
              alt="The Kaimbrya home screen for a manager: pending requests, votes, events, recent activity and every module in the sidebar"
              sizes="(min-width: 1024px) 680px, 92vw"
            />
          </DesktopFrame>
        </div>
      </div>
    </section>
  );
}

// ── 4 · Finance ─────────────────────────────────────────────────────────────
export function Finance() {
  return (
    <section id="finance" className="section bg-paper" aria-labelledby="finance-title">
      <div className="wrap split">
        <Reveal>
          <p className="eyebrow">{finance.eyebrow}</p>
          <h2 id="finance-title" className="title" style={{ marginTop: 16 }}>{finance.title}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{finance.lead}</p>
          <div className="points points--two">
            <div>
              <h3>For the board and managers</h3>
              <ul className="ticks">{finance.board.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="home">
              <h3>For homeowners</h3>
              <ul className="ticks">{finance.owners.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </div>
        </Reveal>
        <Reveal i={1}>
          <div className="fin-stage">
            <PanelFrame className="frame-panel--main">
              <Screen name="payments-overview" alt="Kaimbrya Payments Center: total outstanding, pending review and overdue invoices" sizes="(min-width: 1024px) 560px, 92vw" />
            </PanelFrame>
            <PanelFrame className="frame-panel--over">
              <Screen name="overdue-accounts" alt="Overdue accounts in Kaimbrya: four units with their outstanding amounts and last payment dates" sizes="(min-width: 1024px) 440px, 92vw" />
            </PanelFrame>
            <PhoneFrame>
              <Screen name="owner-payments" alt="A homeowner's Payments Center on a phone: paid up, with a Proof of Payment button" sizes="170px" hideBelow={640} />
            </PhoneFrame>
            <span className="callout callout--a">{finance.callouts[0]}</span>
            <span className="callout callout--b">{finance.callouts[1]}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── 5 · Guest access (signature C) ──────────────────────────────────────────
export function GuestAccess() {
  return (
    <section id="guest-access" className="section on-dark dots" aria-labelledby="guest-title">
      <div className="wrap">
        <GuestJourney steps={guestAccess.steps}>
          <div className="guest-intro">
            <p className="eyebrow">{guestAccess.eyebrow}</p>
            <h2 id="guest-title" className="title" style={{ marginTop: 16 }}>{guestAccess.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{guestAccess.lead}</p>
          </div>
        </GuestJourney>
      </div>
    </section>
  );
}

// ── 6 · Every role ──────────────────────────────────────────────────────────
export function Roles() {
  return (
    <section id="roles" className="section" aria-labelledby="roles-title">
      <div className="wrap">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">{roles.eyebrow}</p>
          <h2 id="roles-title" className="title">{roles.title}</h2>
        </Reveal>
        <RoleSwitcher roles={roles.items} />
      </div>
    </section>
  );
}

// ── 7 · Properties and maintenance ──────────────────────────────────────────
export function Operations() {
  return (
    <section id="operations" className="section bg-paper" aria-labelledby="ops-title">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">{operations.eyebrow}</p>
          <h2 id="ops-title" className="title">{operations.title}</h2>
        </Reveal>
        <div className="ops-rows">
          <div className="split split--flip">
            <Reveal>
              <h3 className="title" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}>{operations.property.title}</h3>
              <p className="lead" style={{ marginTop: 14 }}>{operations.property.text}</p>
            </Reveal>
            <Reveal i={1}>
              <PanelFrame>
                <Screen name="property-register" alt="Kaimbrya property register: property, occupied, vacant and pending counts, with the unit list" sizes="(min-width: 1024px) 640px, 92vw" />
              </PanelFrame>
            </Reveal>
          </div>
          <div className="split">
            <Reveal>
              <h3 className="title" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}>{operations.maintenance.title}</h3>
              <p className="lead" style={{ marginTop: 14 }}>{operations.maintenance.text}</p>
              <div className="lifecycle" data-reveal style={{ "--i": 2 } as CSSProperties}>
                <ol aria-label="How a request moves">
                  {operations.lifecycle.map((step, i) => <li key={step}><i aria-hidden="true">{i + 1}</i>{step}</li>)}
                </ol>
              </div>
            </Reveal>
            <Reveal i={1}>
              <div className="ops-stage">
                <PanelFrame>
                  <Screen name="maintenance-tasks" alt="Kaimbrya maintenance tasks: counts by status and a task list with priorities and due dates" sizes="(min-width: 1024px) 640px, 92vw" />
                </PanelFrame>
                <PanelFrame className="frame-panel--over">
                  <Screen name="owner-request-card" alt="A homeowner's request card: Water pressure low in the mornings, in progress" sizes="(min-width: 1024px) 360px, 92vw" />
                </PanelFrame>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 8 · Communication and governance ────────────────────────────────────────
export function Community() {
  return (
    <section id="community" className="section" aria-labelledby="community-title">
      <div className="wrap comm-grid">
        <Reveal>
          <p className="eyebrow">{community.eyebrow}</p>
          <h2 id="community-title" className="title" style={{ marginTop: 16 }}>{community.title}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{community.lead}</p>
          <div className="comm-cards">
            <PanelFrame>
              <Screen name="vote-card" alt="A Kaimbrya vote: Approve the 2027 budget, anonymous ballot, quorum 50%, 21 of 36 voted" sizes="(min-width: 1024px) 620px, 92vw" />
            </PanelFrame>
            <PanelFrame>
              <Screen name="ideas-board" alt="The Kaimbrya idea exchange: three resident ideas with their support counts" sizes="(min-width: 1024px) 620px, 92vw" />
            </PanelFrame>
          </div>
          <p className="note">{community.note}</p>
          <a href={community.link.href} className="link-arrow" style={{ marginTop: 20 }}>{community.link.label} <ArrowRight /></a>
        </Reveal>
        <Reveal i={1} className="comm-phone">
          <PhoneFrame>
            <Screen name="owner-notices" alt="Announcements on a homeowner's phone: a pinned, high-priority notice about a water interruption" sizes="260px" />
          </PhoneFrame>
        </Reveal>
      </div>
    </section>
  );
}

// ── 9 · Solutions ───────────────────────────────────────────────────────────
export function Audiences() {
  return (
    <section id="solutions" className="section bg-paper" aria-labelledby="solutions-title">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="eyebrow">{audiencesSection.eyebrow}</p>
          <h2 id="solutions-title" className="title">{audiencesSection.title}</h2>
        </Reveal>
        <div className="aud-grid">
          {audiences.map((a, i) => (
            <Reveal key={a.id} i={i}>
              <article id={a.anchor} className="aud-card">
                <Scene name={a.art} className="aud-art" />
                <div className="aud-body">
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <a className="link-arrow" href={`/solutions/${a.slug}/`}>
                    {audiencesSection.linkLabel}<span className="sr-only">: {a.title.toLowerCase()}</span> <ArrowRight />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 10 · Final call to action ───────────────────────────────────────────────
export function FinalCta() {
  return <CtaBand title={finalCta.title} text={finalCta.text} primary={finalCta.primary} secondary={finalCta.secondary} />;
}
