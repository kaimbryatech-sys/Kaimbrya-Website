"use client";

import { useEffect, useRef, useState } from "react";
import { story } from "@/content/story";
import { ArrowRight } from "./icons";

type Mode = "idle" | "motion" | "reduced";

/**
 * Signature story: a house is built, a resident steps out and waves, the camera pulls back to the
 * community, and Kaimbrya connects it. Scroll-scrubbed with GSAP; the runtime (and GSAP) load only
 * once the visitor starts scrolling toward it. Without JavaScript the poster and all captions are shown; with reduced
 * motion the story becomes three still frames the visitor steps through.
 */
export function SignatureStory() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [scene, setScene] = useState(0);
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState<(typeof story.reducedFrames)[number]["id"]>("home");
  const still = useRef<{ show: (f: "home" | "welcome" | "community") => void; destroy: () => void } | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // Kept off first load: the runtime (GSAP + scene) is fetched once the visitor starts moving through
    // the page and the story is near, or straight away if the story is already on screen.
    let started = false;
    let interacted = false;
    let near = false;
    const INTENT = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    const afterLoad = (fn: () => void) => (document.readyState === "complete" ? fn() : window.addEventListener("load", fn, { once: true }));
    const start = () => {
      if (started || cancelled) return;
      started = true;
      unwatch();
      import("@/story/runtime").then((m) => {
        if (cancelled) return;
        if (reduce) {
          setMode("reduced");
          requestAnimationFrame(() => {
            still.current = m.mountStoryStill(el);
            still.current.show("home");
          });
          cleanup = () => still.current?.destroy();
        } else {
          setMode("motion");
          requestAnimationFrame(() => {
            if (cancelled) return;
            cleanup = m.mountStory(el, { onScene: setScene, onClosing: setClosing, onProgress: setProgress });
          });
        }
      }).catch(() => { el.dataset.dawn = "failed"; }); // lift the veil off the poster if the runtime can't load
    };
    const onIntent = () => { interacted = true; if (near) afterLoad(start); };
    const approach = new IntersectionObserver((entries) => { near = entries.some((e) => e.isIntersecting); if (near && interacted) afterLoad(start); }, { rootMargin: "150% 0px" });
    const visible = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) afterLoad(start); });
    const unwatch = () => { approach.disconnect(); visible.disconnect(); INTENT.forEach((t) => window.removeEventListener(t, onIntent)); };
    INTENT.forEach((t) => window.addEventListener(t, onIntent, { passive: true }));
    approach.observe(el);
    visible.observe(el);
    return () => { cancelled = true; unwatch(); cleanup?.(); };
  }, []);

  const replay = () => root.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  const showFrame = (id: typeof frame) => { setFrame(id); still.current?.show(id); };
  const current = story.scenes[scene] ?? story.scenes[0];

  return (
    <section ref={root} id="story" className={`story story--${mode}`} aria-labelledby="story-title" data-closing={closing}>
      <h2 id="story-title" className="sr-only">{story.eyebrow}: from a single home to a connected community</h2>
      <div className="story-stage">
        <div className="story-sky" aria-hidden="true" />
        <img className="story-poster" src="/art/story-poster.svg" alt={mode === "idle" ? story.posterAlt : ""} loading="lazy" decoding="async" aria-hidden={mode !== "idle"} />
        <svg className="story-svg" role="img" aria-label={story.posterAlt} preserveAspectRatio="xMidYMid slice" />
        <div className="story-veil" aria-hidden="true" />

        {mode === "motion" ? (
          <>
            <div className="story-caption" aria-live="polite">
              <p className="eyebrow">{story.eyebrow}</p>
              <div className="story-caption-body" key={scene}>
                <p className="story-caption-title">{current.title}</p>
                <p className="story-caption-text">{current.text}</p>
              </div>
            </div>
            <ol className="story-progress" aria-hidden="true">
              {story.scenes.map((s, i) => <li key={s.title} data-done={i < scene} data-active={i === scene} />)}
            </ol>
            <div className="story-closing" aria-hidden={!closing}>
              <p className="story-closing-line">{story.closing.line}</p>
              <p className="story-closing-brand"><strong>{story.closing.brand}</strong> · {story.closing.tagline}</p>
              <div className="story-closing-actions">
                <a href="/platform/" className="btn btn-primary" tabIndex={closing ? 0 : -1}>See the platform <ArrowRight /></a>
                <button type="button" className="btn btn-secondary" onClick={replay} tabIndex={closing ? 0 : -1}>Replay the story</button>
              </div>
            </div>
            <span className="story-meter" style={{ transform: `scaleX(${progress.toFixed(3)})` }} aria-hidden="true" />
          </>
        ) : null}

        {mode === "reduced" ? (
          <div className="story-still">
            <div className="story-still-text" aria-live="polite">
              <p className="eyebrow">{story.eyebrow}</p>
              <p className="story-caption-title">{story.reducedFrames.find((f) => f.id === frame)?.title}</p>
              <p className="story-caption-text">{story.reducedFrames.find((f) => f.id === frame)?.text}</p>
            </div>
            <div className="story-still-steps" role="group" aria-label="Story frames">
              {story.reducedFrames.map((f) => (
                <button key={f.id} type="button" aria-pressed={frame === f.id} onClick={() => showFrame(f.id)}>{f.label}</button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Full narrative as text: always present for screen readers, shown when the animation isn't running */}
      <ol className="story-script">
        {story.scenes.map((s) => <li key={s.title}><strong>{s.title}</strong> {s.text}</li>)}
        <li><strong>{story.closing.line}</strong> {story.closing.brand}: {story.closing.tagline}</li>
      </ol>
    </section>
  );
}
