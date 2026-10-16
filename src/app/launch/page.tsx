import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Composition, CtaBand, FaqList, PageHero, Reveal } from "@/components/blocks";
import { ArrowRight } from "@/components/icons";
import { gatherList, journey, launch, rolloutSentence } from "@/content/extras";
import "./launch.css";

export const metadata: Metadata = { title: launch.meta.title, description: launch.meta.description };

const more = [
  { title: "Community readiness check", text: "Seven questions that show where Kaimbrya would help first, with an indicative price.", href: "/readiness/", accent: "#1f5f75" },
  { title: "Board presentation kit", text: "A printable overview to share with your HOA, strata committee or board.", href: "/board-kit/", accent: "#c98a2b" },
  { title: "Resources", text: "Guides for boards and homeowners, from fair votes to moving off spreadsheets.", href: "/resources/", accent: "#2f7d57" },
];

export default function LaunchPage() {
  const { hero, journeyIntro, rollout, gather, faq } = launch;
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Your journey to launch" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Book a consultation", href: "/demo/" }}
        secondary={{ label: "See the steps", href: "#journey" }}
        visual={
          <Composition
            layout="panel-phone"
            priority
            shots={[
              { name: "setup-wizard", device: "panel", alt: "The Kaimbrya property setup wizard: batch ranges and developments organised in sections" },
              { name: "owner-home", device: "phone", alt: "The Kaimbrya home screen on a homeowner's phone", sizes: "(min-width: 1024px) 180px, 240px" },
            ]}
          />
        }
      />

      <section id="journey" className="section bg-paper" aria-labelledby="journey-title">
        <div className="wrap lj-layout">
          <div className="lj-intro">
            <Reveal className="section-head">
              <p className="eyebrow">{journeyIntro.eyebrow}</p>
              <h2 id="journey-title" className="title">{journeyIntro.title}</h2>
              <p className="lead">{journeyIntro.lead}</p>
            </Reveal>
            <nav className="lj-jump" aria-label="Jump to a step">
              <ol>
                {journey.map((s, i) => (
                  <li key={s.id}><a href={`#step-${s.id}`}><span aria-hidden="true">{i + 1}</span>{s.label}</a></li>
                ))}
              </ol>
            </nav>
          </div>

          <ol className="lj-steps" aria-label="The journey to launch">
            {journey.map((s, i) => (
              <li key={s.id} id={`step-${s.id}`} className="lj-step">
                <span className="lj-num" aria-hidden="true">{i + 1}</span>
                <Reveal className="lj-card">
                  <p className="lj-label">Step {i + 1} · {s.label}</p>
                  <h3 className="lj-title">{s.title}</h3>
                  <p className="lj-text">{s.text}</p>
                  <div className="lj-meta">
                    <div>
                      <h4>Who&apos;s involved</h4>
                      <p>{s.who}</p>
                    </div>
                    <div>
                      <h4>Helpful to have ready</h4>
                      <ul className="ticks">{s.ready.map((r) => <li key={r}>{r}</li>)}</ul>
                    </div>
                  </div>
                  <p className="lj-links">
                    {s.links.map((l) => (
                      <a key={l.href} href={l.href} className="link-arrow">{l.label} <ArrowRight /></a>
                    ))}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section on-dark dots lj-rollout" aria-labelledby="rollout-title">
        <div className="wrap lj-rollout-grid">
          <Reveal>
            <p className="eyebrow">{rollout.eyebrow}</p>
            <h2 id="rollout-title" className="title" style={{ marginTop: 16 }}>{rollout.title}</h2>
            <p className="lead lj-rollout-lead">{rolloutSentence}</p>
          </Reveal>
          <Reveal i={1} className="lj-milestones">
            <h3>{rollout.milestonesTitle}</h3>
            <ul className="ticks">{rollout.milestones.map((m) => <li key={m}>{m}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="gather-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{gather.eyebrow}</p>
            <h2 id="gather-title" className="title">{gather.title}</h2>
            <p className="lead">{gather.lead}</p>
          </Reveal>
          <ul className="lj-gather">
            {gatherList.map((g, i) => (
              <li key={g.title}>
                <Reveal i={i % 3} className="lj-gather-item">
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title">Onboarding questions</h2>
          </Reveal>
          <FaqList items={faq} />
        </div>
      </section>

      <section className="section" aria-labelledby="more-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">For your board</p>
            <h2 id="more-title" className="title">Help your board decide.</h2>
          </Reveal>
          <ul className="module-grid">
            {more.map((m, i) => (
              <li key={m.href}>
                <Reveal i={i} className="h-full">
                  <a href={m.href} className="module-card" style={{ "--accent": m.accent } as CSSProperties}>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                    <span className="link-arrow">Open <ArrowRight /></span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Start with a conversation."
        text="Tell us about your community, and we'll walk your board or team through Kaimbrya and the journey to launch."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Estimate your price", href: "/pricing/" }}
      />
    </>
  );
}
