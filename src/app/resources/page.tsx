import type { Metadata } from "next";
import { CtaBand, PageHero, Reveal } from "@/components/blocks";
import { ArrowRight } from "@/components/icons";
import { gatherList, resources, type GuideBlock } from "@/content/extras";
import "./resources.css";

export const metadata: Metadata = { title: resources.meta.title, description: resources.meta.description };

function Block({ block }: { block: GuideBlock }) {
  switch (block.kind) {
    case "p":
      return <p>{block.text}</p>;
    case "h":
      return <h3 className="rs-h">{block.text}</h3>;
    case "list":
      return <ul className="ticks rs-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case "steps":
      return (
        <ol className="rs-steps">
          {block.items.map((s, i) => (
            <li key={s.title}>
              <span className="rs-step-num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="rs-note" aria-label={block.title}>
          <p className="rs-note-title">{block.title}</p>
          <p>{block.text}</p>
        </aside>
      );
    case "gather":
      return (
        <ul className="rs-gather">
          {gatherList.map((g) => (
            <li key={g.title}><strong>{g.title}</strong><span>{g.text}</span></li>
          ))}
        </ul>
      );
  }
}

export default function ResourcesPage() {
  const { hero, guides } = resources;
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Browse the guides", href: "#guides" }}
        secondary={{ label: "Book a demo", href: "/demo/" }}
        visual={
          <ul id="guide-list" className="rs-hero-list" aria-label="Guides on this page">
            {guides.map((g, i) => (
              <li key={g.id}>
                <a href={`#${g.id}`}>
                  <span className="rs-hero-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rs-hero-text">
                    <span className="rs-hero-eyebrow">{g.eyebrow}</span>
                    <strong>{g.title}</strong>
                  </span>
                  <ArrowRight className="rs-hero-arrow" />
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <section id="guides" className="section rs" aria-label="Guides">
        <div className="wrap rs-layout">
          <nav className="rs-toc" aria-label="On this page">
            <p className="rs-toc-title">On this page</p>
            <ol>
              {guides.map((g) => (
                <li key={g.id}><a href={`#${g.id}`}>{g.title}</a></li>
              ))}
            </ol>
          </nav>

          <div className="rs-articles">
            {guides.map((g) => (
              <article key={g.id} id={g.id} className="rs-article" aria-labelledby={`${g.id}-title`}>
                <Reveal>
                  <p className="eyebrow">{g.eyebrow}</p>
                  <h2 id={`${g.id}-title`} className="title rs-title">{g.title}</h2>
                  <p className="lead rs-summary">{g.summary}</p>
                </Reveal>
                <div className="rs-body">
                  {g.blocks.map((b, i) => <Block key={`${g.id}-${i}`} block={b} />)}
                </div>
                <div className="rs-foot">
                  <p className="rs-related">
                    <span>Related:</span>
                    {g.related.map((l) => <a key={l.href} href={l.href} className="link-arrow">{l.label} <ArrowRight /></a>)}
                  </p>
                  <a href="#guide-list" className="rs-top">Back to the list of guides</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Questions about your community?"
        text="We'll walk your board or team through Kaimbrya, and talk through how it fits the way your community is run."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Your journey to launch", href: "/launch/" }}
      />
    </>
  );
}
