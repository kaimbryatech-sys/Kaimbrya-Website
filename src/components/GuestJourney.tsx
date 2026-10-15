"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { GuestStep } from "@/content/site";
import { PanelFrame, PhoneFrame } from "./Frames";
import { Screen } from "./Screen";

/**
 * Signature C: invite → approve → arrive. The visitor drives it (click, arrow keys or
 * swipe); it never plays on its own. Each step's screen is a real capture.
 */
export function GuestJourney({ steps, children }: { steps: GuestStep[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const swipeStart = useRef<number | null>(null);

  const go = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: steps.length - 1 };
    if (e.key in keys) { e.preventDefault(); go(keys[e.key]!, true); }
  };

  const onPointerDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") swipeStart.current = e.clientX; };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="guest-grid">
      <div>
        {children}
        <div role="tablist" aria-label="Guest access, step by step" aria-orientation="vertical" className="steps" onKeyDown={onKeyDown}>
          {steps.map((step, i) => (
            <button
              key={step.id}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`guest-tab-${step.id}`}
              aria-selected={i === active}
              aria-controls="guest-panel"
              aria-labelledby={`guest-label-${step.id} guest-title-${step.id}`}
              aria-describedby={`guest-text-${step.id}`}
              tabIndex={i === active ? 0 : -1}
              className="step-tab"
              onClick={() => go(i)}
            >
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <span>
                <span className="step-label" id={`guest-label-${step.id}`}>{step.label}</span>
                <span className="step-title" id={`guest-title-${step.id}`}>{step.title}</span>
                <span className="step-text"><span id={`guest-text-${step.id}`}>{step.text}</span></span>
              </span>
            </button>
          ))}
        </div>
        <div className="progress" aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / steps.length})` }} /></div>
        <div className="step-controls">
          <button type="button" onClick={() => go(active - 1, true)} disabled={active === 0}>Previous step</button>
          <button type="button" onClick={() => go(active + 1, true)} disabled={active === steps.length - 1}>Next step</button>
        </div>
      </div>

      <div
        id="guest-panel"
        role="tabpanel"
        aria-labelledby={`guest-tab-${steps[active]?.id}`}
        className="guest-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipeStart.current = null; }}
      >
        <p className="sr-only" aria-live="polite">Step {active + 1} of {steps.length}: {steps[active]?.title}</p>
        {steps.map((step, i) => {
          const shot = (
            <Screen
              name={step.screen}
              alt={step.alt}
              sizes={step.device === "phone" ? "(min-width: 640px) 260px, 220px" : "(min-width: 640px) 420px, 82vw"}
            />
          );
          return (
            <div key={step.id} className="guest-shot" data-active={i === active} aria-hidden={i !== active}>
              {step.device === "phone" ? <PhoneFrame>{shot}</PhoneFrame> : <PanelFrame>{shot}</PanelFrame>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
