import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Composition, CtaBand, FeatureRow, PageHero, Reveal } from "@/components/blocks";
import { ArrowRight } from "@/components/icons";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { platform } from "@/content/platform";
import { roles } from "@/content/site";

export const metadata: Metadata = {
  title: "Platform",
  description: platform.meta.description,
};

export default function PlatformPage() {
  const { hero, index, modules, rolesIntro, cta } = platform;
  return (
    <>
      <PageHero
        variant="center"
        eyebrow={hero.eyebrow}
        title={hero.title}
        emphasis={hero.emphasis}
        lead={hero.lead}
        primary={{ label: "Book a demo", href: "/demo/" }}
        secondary={{ label: "See what's inside", href: "#modules" }}
        visual={<Composition layout="panel-phone" priority shots={hero.shots} />}
      />

      <section id="modules" className="section bg-paper" aria-labelledby="modules-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">{index.eyebrow}</p>
            <h2 id="modules-title" className="title">{index.title}</h2>
            <p className="lead">{index.lead}</p>
          </Reveal>
          <ul className="module-grid">
            {index.groups.map((g, i) => (
              <li key={g.id}>
                <Reveal i={i} className="h-full">
                  <a href={`#${g.id}`} className="module-card" style={{ "--accent": g.accent } as CSSProperties}>
                    <h3>{g.title}</h3>
                    <p>{g.text}</p>
                    <ul aria-label={`${g.title}: modules`}>{g.items.map((item) => <li key={item}>{item}</li>)}</ul>
                    <span className="link-arrow">Read more <ArrowRight /></span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-label="The modules in detail">
        <div className="wrap feature-rows" style={{ marginTop: 0 }}>
          {modules.map((m, i) => (
            <FeatureRow
              key={m.id}
              id={m.id}
              eyebrow={m.eyebrow}
              title={m.title}
              text={m.text}
              points={m.points}
              flip={i % 2 === 1}
              visual={<Composition layout={m.layout} shots={m.shots} />}
            />
          ))}
        </div>
      </section>

      <section id="roles" className="section bg-paper" aria-labelledby="roles-title">
        <div className="wrap">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">{rolesIntro.eyebrow}</p>
            <h2 id="roles-title" className="title">{rolesIntro.title}</h2>
          </Reveal>
          <RoleSwitcher roles={roles.items} />
        </div>
      </section>

      <CtaBand title={cta.title} text={cta.text} primary={{ label: "Book a demo", href: "/demo/" }} secondary={{ label: "Find your solution", href: "/#solutions" }} />
    </>
  );
}
