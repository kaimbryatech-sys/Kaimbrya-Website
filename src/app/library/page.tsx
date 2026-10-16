import type { Metadata } from "next";
import { Composition, CtaBand, FaqList, FeatureRow, PageHero, Reveal } from "@/components/blocks";
import { library } from "@/content/communication";

export const metadata: Metadata = { title: library.meta.title, description: library.meta.description };

export default function LibraryPage() {
  const { hero, contents, rows, faq, cta } = library;
  return (
    <>
      <PageHero
        variant="center"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Communication", href: "/communication/" }, { label: "Library" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "What goes in it", href: "#contents" }}
        visual={<Composition layout="single" priority shots={hero.shots} />}
      />

      <section id="contents" className="section bg-paper" aria-labelledby="contents-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{contents.eyebrow}</p>
            <h2 id="contents-title" className="title">{contents.title}</h2>
          </Reveal>
          <ul className="about-values">
            {contents.items.map((c, i) => (
              <li key={c.title}><Reveal i={i}><h3>{c.title}</h3><p>{c.text}</p></Reveal></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-label="The Library in detail">
        <div className="wrap feature-rows" style={{ marginTop: 0 }}>
          {rows.map((r, i) => (
            <FeatureRow key={r.eyebrow} eyebrow={r.eyebrow} title={r.title} text={r.text} points={r.points} flip={i % 2 === 1}
              visual={<Composition layout={r.layout} shots={r.shots} />} />
          ))}
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title">What boards ask about the Library</h2>
          </Reveal>
          <FaqList items={faq} />
        </div>
      </section>

      <CtaBand title={cta.title} text={cta.text} primary={{ label: "Book a demo", href: "/demo/" }} secondary={{ label: "Communication and transparency", href: "/communication/" }} />
    </>
  );
}
