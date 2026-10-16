import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CtaBand, PageHero, Reveal } from "@/components/blocks";
import { ReadinessCheck } from "@/components/extras/ReadinessCheck";
import { ArrowRight } from "@/components/icons";
import { readiness } from "@/content/extras";
import "./readiness.css";

export const metadata: Metadata = { title: readiness.meta.title, description: readiness.meta.description };

const more = [
  { title: "Your journey to launch", text: "Every step from first conversation to launch day.", href: "/launch/", accent: "#1f5f75" },
  { title: "Board presentation kit", text: "A printable overview to share with your board.", href: "/board-kit/", accent: "#c98a2b" },
  { title: "Pricing", text: "Estimate your price, including developments with property classes.", href: "/pricing/", accent: "#2f7d57" },
];

export default function ReadinessPage() {
  const { hero, questions } = readiness;
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Readiness check" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Start the check", href: "#check" }}
        secondary={{ label: "See pricing", href: "/pricing/" }}
        visual={
          <div className="rc-hero-card">
            <p className="rc-hero-title">What we&apos;ll ask about</p>
            <ol>
              {questions.map((q, i) => (
                <li key={q.id}><span aria-hidden="true">{i + 1}</span>{q.topic}</li>
              ))}
            </ol>
            <p className="rc-hero-foot">You&apos;ll get the parts of Kaimbrya that fit, and an indicative price. Nothing is sent or saved.</p>
          </div>
        }
      />

      <section id="check" className="section bg-paper rc-section" aria-label="Readiness check">
        <div className="wrap">
          <ReadinessCheck />
        </div>
      </section>

      <section className="section" aria-labelledby="more-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Keep going</p>
            <h2 id="more-title" className="title">Take the next step with your board.</h2>
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
        title="See the parts that fit, working together."
        text="We'll walk your board or team through the areas your answers point to, using demonstration data."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Request a quote", href: "/pricing/#quote" }}
      />
    </>
  );
}
