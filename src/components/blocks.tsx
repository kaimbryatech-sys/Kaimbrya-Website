import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ScreenName } from "@/content/screens.generated";
import { Scene, type SceneName } from "./Art";
import { DesktopFrame, PanelFrame, PhoneFrame } from "./Frames";
import { ArrowRight } from "./icons";
import { Screen } from "./Screen";

/** Fades and rises into view once (see public/enhance.js); `i` staggers siblings. */
export function Reveal({ i = 0, className, children, id }: { i?: number; className?: string; children: ReactNode; id?: string }) {
  return (
    <div data-reveal id={id} className={className} style={{ "--i": i } as CSSProperties}>
      {children}
    </div>
  );
}

export type Shot = { name: ScreenName; alt: string; device: "phone" | "panel" | "desktop"; sizes?: string };

const DEFAULT_SIZES: Record<Shot["device"], string> = {
  phone: "(min-width: 640px) 220px, 240px",
  panel: "(min-width: 1024px) 600px, 92vw",
  desktop: "(min-width: 1024px) 640px, 92vw",
};

/** One app screen in the right frame for its device. */
export function ShotFrame({ shot, priority = false, className = "" }: { shot: Shot; priority?: boolean; className?: string }) {
  const img = <Screen name={shot.name} alt={shot.alt} sizes={shot.sizes ?? DEFAULT_SIZES[shot.device]} priority={priority} />;
  if (shot.device === "phone") return <PhoneFrame className={className}>{img}</PhoneFrame>;
  if (shot.device === "desktop") return <DesktopFrame className={className}>{img}</DesktopFrame>;
  return <PanelFrame className={className}>{img}</PanelFrame>;
}

export type CompositionLayout = "single" | "portrait" | "panel-over" | "panel-phone" | "panel-over-phone" | "phones";

/**
 * Two or three real screens arranged with a little overlap. Built on a 12-column grid
 * (not absolute positioning), so every image keeps its natural height; on phones it
 * becomes a simple stack.
 */
export function Composition({ layout, shots, priority = false }: { layout: CompositionLayout; shots: Shot[]; priority?: boolean }) {
  return (
    <div className={`comp comp--${layout}`}>
      {shots.map((shot, i) => (
        <div key={shot.name} className={`comp-item comp-${"abc"[i]} comp-${shot.device}`}>
          <ShotFrame shot={shot} priority={priority && i === 0} />
        </div>
      ))}
    </div>
  );
}

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={c.label}>
            {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
            {i < items.length - 1 ? <span aria-hidden="true" className="crumb-sep">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type Action = { label: string; href: string };

/** Dark hero for inner pages. `center` puts a wide visual under centred copy. */
export function PageHero({
  eyebrow, title, emphasis, lead, primary, secondary, visual, breadcrumb, variant = "split",
}: {
  eyebrow: string; title: string; emphasis?: string; lead: string; primary: Action; secondary?: Action;
  visual: ReactNode; breadcrumb?: Crumb[]; variant?: "split" | "center";
}) {
  return (
    <section className={`page-hero page-hero--${variant} on-dark dots`} aria-labelledby="page-title">
      <div className="wrap page-hero-grid">
        <div className="page-hero-copy">
          {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="display display--page">
            {title}{emphasis ? <> <em>{emphasis}</em></> : null}
          </h1>
          <p className="lead">{lead}</p>
          <div className="hero-ctas">
            <Link prefetch={false} href={primary.href} className="btn btn-primary">{primary.label} <ArrowRight /></Link>
            {secondary ? <a href={secondary.href} className="btn btn-secondary">{secondary.label}</a> : null}
          </div>
        </div>
        <div className="page-hero-visual">{visual}</div>
      </div>
    </section>
  );
}

/** An audience illustration with one real screen overlapping its corner. */
export function ArtStage({ scene, shot }: { scene: SceneName; shot: Shot }) {
  return (
    <div className={`art-stage art-stage--${shot.device}`}>
      <Scene name={scene} className="art-stage-scene" priority />
      <div className="art-stage-shot"><ShotFrame shot={shot} priority /></div>
    </div>
  );
}

/** Copy on one side, screens on the other, with an anchor for deep links. */
export function FeatureRow({
  id, eyebrow, title, text, points, link, visual, flip = false, titleLevel = 2,
}: {
  id?: string; eyebrow?: string; title: string; text: string; points?: string[]; link?: Action; visual: ReactNode; flip?: boolean; titleLevel?: 2 | 3;
}) {
  const Heading = titleLevel === 2 ? "h2" : "h3";
  return (
    <div id={id} className={`split feature-row${flip ? " split--flip" : ""}`}>
      <Reveal>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading className={titleLevel === 2 ? "title feature-title" : "title feature-title feature-title--sm"}>{title}</Heading>
        <p className="lead feature-lead">{text}</p>
        {points?.length ? <ul className="ticks feature-points">{points.map((p) => <li key={p}>{p}</li>)}</ul> : null}
        {link ? <a href={link.href} className="link-arrow feature-link">{link.label} <ArrowRight /></a> : null}
      </Reveal>
      <Reveal i={1}>{visual}</Reveal>
    </div>
  );
}

export type Step = { title: string; text: string };

/** A short numbered flow (a real sequence, so the numbers mean something). */
export function StepsFlow({ steps, label }: { steps: Step[]; label: string }) {
  return (
    <Reveal className="flow">
      <ol aria-label={label}>
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="flow-num" aria-hidden="true">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export type Faq = { q: string; a: string };

/** Native <details> disclosure: keyboard and screen-reader friendly, no script needed. */
export function FaqList({ items }: { items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary><span>{f.q}</span><i aria-hidden="true" /></summary>
          <p>{f.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

/** The closing call to action, shared by every page. */
export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: Action; secondary?: Action }) {
  return (
    <section className="section cta on-dark dots" aria-labelledby="cta-title">
      <div className="wrap cta-grid">
        <Reveal>
          <h2 id="cta-title" className="title">{title}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{text}</p>
          <div className="cta-actions">
            <Link prefetch={false} href={primary.href} className="btn btn-primary">{primary.label} <ArrowRight /></Link>
            {secondary ? <Link prefetch={false} href={secondary.href} className="btn btn-secondary">{secondary.label}</Link> : null}
          </div>
        </Reveal>
        <Reveal i={1}>
          <Scene name="welcome" className="cta-art" position="50% 70%" />
        </Reveal>
      </div>
    </section>
  );
}
