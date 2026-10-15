import type { Metadata } from "next";
import { Scene } from "@/components/Art";
import { CtaBand, PageHero, Reveal } from "@/components/blocks";
import { config, credibility } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Kaimbrya is community management software made in Jamaica, built to make running a residential community simpler for boards, managers, security teams and homeowners.",
};

const values = [
  { title: "Built for how Jamaican communities work", text: "Owners pay by bank transfer, guards work the gate and boards answer to their members. Kaimbrya is designed around those everyday realities rather than imported assumptions." },
  { title: "One record instead of many tools", text: "Collections, guest access, repairs, notices and votes share the same units, people and history, so nothing has to be copied between spreadsheets, notebooks and group chats." },
  { title: "The right view for every role", text: "Board members, managers, security teams and homeowners each see what they need on the phones and computers they already use, and nothing they shouldn't." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Kaimbrya"
        title="Community management,"
        emphasis="made simpler."
        lead="Kaimbrya is a community management platform made in Jamaica. Our mission is to take the paperwork, phone calls and guesswork out of running a residential community."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Explore the platform", href: "/platform/" }}
        visual={<div className="art-stage"><Scene name="welcome" className="art-stage-scene" priority /></div>}
      />

      <section className="section" aria-labelledby="mission-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Why we built it</p>
            <h2 id="mission-title" className="title">Running a community shouldn&apos;t depend on paper and phone calls.</h2>
            <p className="lead">
              Many communities still track fees in spreadsheets, approve visitors by calling the house and share notices in group chats.
              Kaimbrya brings that work into one connected platform: community finances, guest access and security, properties,
              maintenance and communication.
            </p>
          </Reveal>
          <ul className="about-values">
            {values.map((v, i) => (
              <li key={v.title}><Reveal i={i}><h3>{v.title}</h3><p>{v.text}</p></Reveal></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="today-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{credibility.eyebrow}</p>
            <h2 id="today-title" className="title">Where Kaimbrya is today</h2>
            <p className="lead">{credibility.items[0]!.text} We&apos;re working closely with its board, management and security team as the rollout continues.</p>
            <p className="lead" style={{ marginTop: 14 }}>
              Questions about Kaimbrya? Email us at <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="See Kaimbrya with your community in mind."
        text="We'll walk your board or team through the parts that matter most to you."
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "Contact us", href: "/contact/" }}
      />
    </>
  );
}
