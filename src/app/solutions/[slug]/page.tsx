import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArtStage, Composition, CtaBand, FaqList, FeatureRow, PageHero, PricingTeaser, Reveal, StepsFlow } from "@/components/blocks";
import { GuestJourney } from "@/components/GuestJourney";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { guestAccess, roles } from "@/content/site";
import { solutions } from "@/content/solutions";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  return s ? { title: s.meta.title, description: s.meta.description } : {};
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) notFound();
  const demo = { label: "Book a tailored demo", href: `/demo/?type=${s.audience}` };

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Solutions", href: "/#solutions" }, { label: s.name }]}
        eyebrow={s.hero.eyebrow}
        title={s.hero.title}
        emphasis={s.hero.emphasis}
        lead={s.hero.lead}
        primary={demo}
        secondary={{ label: "Explore the platform", href: "/platform/" }}
        visual={<ArtStage scene={s.hero.scene} shot={s.hero.shot} />}
      />

      <section className="section bg-paper" aria-labelledby="challenges-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{s.challenges.eyebrow}</p>
            <h2 id="challenges-title" className="title">{s.challenges.title}</h2>
          </Reveal>
          <ul className="challenge-grid" style={{ "--n": s.challenges.items.length } as CSSProperties}>
            {s.challenges.items.map((c, i) => (
              <li key={c.title}>
                <Reveal i={i} className="challenge">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="helps-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{s.capabilities.eyebrow}</p>
            <h2 id="helps-title" className="title">{s.capabilities.title}</h2>
            <p className="lead">{s.capabilities.lead}</p>
          </Reveal>
          <div className="feature-rows">
            {s.capabilities.items.map((c, i) => (
              <FeatureRow
                key={c.title}
                titleLevel={3}
                title={c.title}
                text={c.text}
                points={c.points}
                link={{ label: c.linkLabel, href: c.link }}
                flip={i % 2 === 1}
                visual={<Composition layout={c.layout} shots={c.shots} />}
              />
            ))}
          </div>
        </div>
      </section>

      {s.experience.kind === "guest" ? (
        <section className="section on-dark dots" aria-labelledby="experience-title">
          <div className="wrap">
            <GuestJourney steps={guestAccess.steps}>
              <div className="guest-intro">
                <p className="eyebrow">{s.experience.eyebrow}</p>
                <h2 id="experience-title" className="title" style={{ marginTop: 16 }}>{s.experience.title}</h2>
                <p className="lead" style={{ marginTop: 18 }}>{s.experience.lead}</p>
              </div>
            </GuestJourney>
          </div>
        </section>
      ) : (
        <section className="section bg-paper" aria-labelledby="experience-title">
          <div className="wrap">
            <Reveal className={s.experience.kind === "roles" ? "section-head section-head--center" : "section-head"}>
              <p className="eyebrow">{s.experience.eyebrow}</p>
              <h2 id="experience-title" className="title">{s.experience.title}</h2>
              <p className="lead">{s.experience.lead}</p>
            </Reveal>
            {s.experience.kind === "roles" ? (
              <RoleSwitcher roles={s.experience.roleOrder.map((id) => roles.items.find((r) => r.id === id)!)} />
            ) : (
              <div style={{ "--n": s.experience.steps.length } as CSSProperties}>
                <StepsFlow steps={s.experience.steps} label={s.experience.title} />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="title">What {s.faqAudience} ask us</h2>
          </Reveal>
          <FaqList items={s.faq} />
        </div>
      </section>

      <PricingTeaser />

      <CtaBand title={s.cta.title} text={s.cta.text} primary={demo} secondary={{ label: "Explore the platform", href: "/platform/" }} />
    </>
  );
}
