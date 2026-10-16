import type { Metadata } from "next";
import { CtaBand, FaqList, PageHero, Reveal } from "@/components/blocks";
import { buildMocks } from "@/components/tour/DemoMocks";
import { DaySimulator } from "@/components/tour/DaySimulator";
import { DEMO_SECTION_ID } from "@/components/tour/events";
import { GuidedDemo } from "@/components/tour/GuidedDemo";
import { TourHotspots, type PlacedHotspot } from "@/components/tour/TourHotspots";
import { sample, tour } from "@/content/tour";
import { buildScene, cameraTransform, communityShot, endState, P, toSVG } from "@/story/scene";
import "./tour.css";

export const metadata: Metadata = {
  title: { absolute: tour.meta.title },
  description: tour.meta.description,
};

// ── The community map, drawn once at build time from the signature story's scene ──────────
const ART_W = 1440;
const ART_H = 820;

function communityMap() {
  const scene = buildScene();
  // The finished community in daylight, with a guest's car waiting at the raised barrier.
  const st = { ...endState(communityShot(ART_W, ART_H)), lights: 0.3, life: 0.3 };
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ART_W} ${ART_H}" aria-hidden="true" focusable="false">` +
    `<defs><linearGradient id="tour-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5e8e8"/><stop offset="1" stop-color="#f4efe2"/></linearGradient></defs>` +
    `<rect width="${ART_W}" height="${ART_H}" fill="url(#tour-sky)"/>` +
    `<g transform="${cameraTransform(st, ART_W, ART_H)}">${toSVG(scene.world, st)}${toSVG(scene.people, st)}</g></svg>`;
  // Project world points the same way the camera does, as percentages of the picture.
  const z = st.zoom * (Math.min(ART_W, ART_H) / 520);
  const [fx, fy] = P(st.camX, st.camY, st.camZ);
  const spots: PlacedHotspot[] = tour.map.hotspots.map(({ world, ...h }) => {
    const [px, py] = P(world[0], world[1], world[2]);
    const x = ((ART_W / 2 + z * (px - fx)) / ART_W) * 100;
    const y = ((ART_H / 2 + z * (py - fy)) / ART_H) * 100;
    return { ...h, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  });
  return { svg, spots };
}

export default function TourPage() {
  const map = communityMap();
  return (
    <>
      <PageHero
        variant="center"
        eyebrow={tour.hero.eyebrow}
        title={tour.hero.title}
        emphasis={tour.hero.emphasis}
        lead={tour.hero.lead}
        primary={tour.hero.primary}
        secondary={tour.hero.secondary}
        visual={
          <div className="tour-map">
            <div className="tour-map-stage">
              <div className="tour-map-art" role="img" aria-label={tour.map.alt} dangerouslySetInnerHTML={{ __html: map.svg }} />
              <TourHotspots spots={map.spots} hintId="tour-spot-hint" />
            </div>
            <p className="tour-map-note">
              <span className="tour-sample">{sample.label}</span>
              <span className="tour-map-hint">Choose a place to try it. {tour.map.note}</span>
              <span id="tour-spot-hint" hidden>{tour.map.hint}</span>
            </p>
          </div>
        }
      />

      <section id={DEMO_SECTION_ID} className="section bg-paper tour-demo-section" aria-labelledby="tour-demo-title">
        <div className="wrap">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">{tour.demo.eyebrow}</p>
            <h2 id="tour-demo-title" className="title">{tour.demo.title}</h2>
            <p className="lead">{tour.demo.lead}</p>
          </Reveal>
          <GuidedDemo workflows={tour.workflows} screens={buildMocks()} sampleLabel={sample.label} />
        </div>
      </section>

      <section className="section tour-day-section" aria-labelledby="tour-day-title">
        <div className="wrap">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">{tour.day.eyebrow}</p>
            <h2 id="tour-day-title" className="title">{tour.day.title}</h2>
            <p className="lead">{tour.day.lead}</p>
          </Reveal>
          <DaySimulator times={tour.day.times} />
          <p className="tour-day-note">{sample.label} Names, times and amounts are illustrative.</p>
        </div>
      </section>

      <section className="section bg-paper" aria-labelledby="tour-faq-title">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 id="tour-faq-title" className="title">About this tour</h2>
          </Reveal>
          <FaqList items={tour.faq} />
        </div>
      </section>

      <CtaBand title={tour.cta.title} text={tour.cta.text} primary={tour.cta.primary} secondary={tour.cta.secondary} />
    </>
  );
}
