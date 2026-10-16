import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Composition, CtaBand, FaqList, FeatureRow, PageHero, Reveal } from "@/components/blocks";
import { GuestJourney } from "@/components/GuestJourney";
import { ArrowRight } from "@/components/icons";
import { communication } from "@/content/communication";

export const metadata: Metadata = { title: communication.meta.title, description: communication.meta.description };

export default function CommunicationPage() {
  const { hero, pillars, story, rows, faq, cta } = communication;
  return (
    <>
      <PageHero
        variant="center"
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "See how it works", href: "#story" }}
        visual={<Composition layout="panel-phone" priority shots={hero.shots} />}
      />

      <section className="section bg-paper" aria-labelledby="pillars-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{pillars.eyebrow}</p>
            <h2 id="pillars-title" className="title">{pillars.title}</h2>
          </Reveal>
          <ul className="module-grid module-grid--4">
            {pillars.items.map((p, i) => (
              <li key={p.title}>
                <Reveal i={i} className="h-full">
                  <a href={p.href} className="module-card" style={{ "--accent": p.accent } as CSSProperties}>
                    <p className="pillar-tag">{p.tag}</p>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <span className="link-arrow">{p.href.startsWith("/") ? "Explore the Library" : "Read more"} <ArrowRight /></span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="story" className="section on-dark dots" aria-labelledby="story-title">
        <div className="wrap">
          <GuestJourney steps={story.steps} idPrefix="story" ariaLabel="From rumour to facts, step by step">
            <div className="guest-intro">
              <p className="eyebrow">{story.eyebrow}</p>
              <h2 id="story-title" className="title" style={{ marginTop: 16 }}>{story.title}</h2>
              <p className="lead" style={{ marginTop: 18 }}>{story.lead}</p>
              <p className="story-note">{story.note}</p>
            </div>
          </GuestJourney>
        </div>
      </section>

      <section className="section" aria-label="Communication in detail">
        <div className="wrap feature-rows" style={{ marginTop: 0 }}>
          {rows.map((r, i) => (
            <FeatureRow key={r.eyebrow} id={r.id} eyebrow={r.eyebrow} title={r.title} text={r.text} points={r.points} link={r.link} flip={i % 2 === 1}
              visual={<Composition layout={r.layout} shots={r.shots} />} />
          ))}
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title">What boards and residents ask us</h2>
          </Reveal>
          <FaqList items={faq} />
        </div>
      </section>

      <CtaBand title={cta.title} text={cta.text} primary={{ label: "Book a demo", href: "/demo/" }} secondary={{ label: "Explore the Library", href: "/library/" }} />
    </>
  );
}
