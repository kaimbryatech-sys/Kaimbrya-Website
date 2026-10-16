"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { DemoId, Workflow } from "@/content/tour";
import { TOUR_SELECT, panelId, tabId, type TourSelect } from "./events";

type Focus = "action" | "next" | null;

/**
 * The guided demo: one tab per workflow, each a short sequence the visitor steps through.
 * Runs entirely in the browser. The sample screens arrive pre-rendered from the server; this
 * component only decides which one shows.
 */
export function GuidedDemo({ workflows, screens, sampleLabel }: { workflows: Workflow[]; screens: Record<DemoId, ReactNode[]>; sampleLabel: string }) {
  const [active, setActive] = useState(0);
  const [steps, setSteps] = useState<Record<DemoId, number>>({ guests: 0, finance: 0, maintenance: 0, governance: 0 });
  const [status, setStatus] = useState("");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const panels = useRef<Array<HTMLDivElement | null>>([]);
  const pendingFocus = useRef<Focus>(null);

  const announce = (wf: Workflow, i: number) => {
    const s = wf.steps[i];
    if (s) setStatus(`${wf.tab}, step ${i + 1} of ${wf.steps.length}: ${s.title}. ${s.text}`);
  };

  const go = (index: number, next: number, focus: Focus = null) => {
    const wf = workflows[index];
    if (!wf) return;
    const i = Math.max(0, Math.min(wf.steps.length - 1, next));
    pendingFocus.current = focus;
    setSteps((cur) => ({ ...cur, [wf.id]: i }));
    announce(wf, i);
  };

  // After a step changes from inside the screen, keep keyboard focus somewhere useful:
  // on the next screen's own button if it has one, otherwise on Next.
  useEffect(() => {
    const want = pendingFocus.current;
    if (!want) return;
    pendingFocus.current = null;
    const panel = panels.current[active];
    const target = (want === "action" ? panel?.querySelector<HTMLElement>("[data-demo-action]") : null) ?? panel?.querySelector<HTMLElement>("[data-demo-next]");
    target?.focus({ preventScroll: true });
  }, [steps, active]);

  // The map and the day simulator ask for a demo through a window event.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const { demo, step } = (e as CustomEvent<TourSelect>).detail;
      const index = workflows.findIndex((w) => w.id === demo);
      const wf = workflows[index];
      if (!wf) return;
      setActive(index);
      if (step !== undefined) setSteps((cur) => ({ ...cur, [demo]: Math.max(0, Math.min(wf.steps.length - 1, step)) }));
    };
    window.addEventListener(TOUR_SELECT, onSelect);
    return () => window.removeEventListener(TOUR_SELECT, onSelect);
  }, [workflows]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = workflows.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1, ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1, ArrowUp: active === 0 ? last : active - 1,
      Home: 0, End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key]!;
    setActive(next);
    tabs.current[next]?.focus();
  };

  // The sample screen's own button (rendered on the server) moves the story on.
  const onScreenClick = (e: MouseEvent<HTMLDivElement>, index: number, current: number) => {
    if (!(e.target as Element).closest("[data-demo-action]")) return;
    go(index, current + 1, "action");
  };

  return (
    <div className="tour-demo">
      <div role="tablist" aria-label="Sample workflows" className="tour-tabs" onKeyDown={onTabKey}>
        {workflows.map((wf, i) => (
          <button
            key={wf.id}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={tabId(wf.id)}
            aria-selected={i === active}
            aria-controls={panelId(wf.id)}
            tabIndex={i === active ? 0 : -1}
            className="tour-tab"
            onClick={() => setActive(i)}
          >
            {wf.tab}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{status}</p>

      {workflows.map((wf, index) => {
        const current = steps[wf.id];
        const step = wf.steps[current];
        const count = wf.steps.length;
        const last = current === count - 1;
        if (!step) return null;
        return (
          <div
            key={wf.id}
            ref={(el) => { panels.current[index] = el; }}
            role="tabpanel"
            id={panelId(wf.id)}
            aria-labelledby={tabId(wf.id)}
            hidden={index !== active}
            className="tour-panel-wrap"
          >
            <div className="tour-demo-head">
              <h3 className="tour-demo-title">{wf.title}</h3>
              <p className="tour-demo-lead">{wf.lead}</p>
            </div>

            <div className="tour-stage">
              <p className="tour-actor" data-role={step.role}><i aria-hidden="true" />{step.actor}</p>
              <div className="tour-device" key={current} onClick={(e) => onScreenClick(e, index, current)} role="group" aria-label={`Sample screen: ${step.actor}`}>
                {screens[wf.id][current]}
              </div>
              <p className="tour-sample-tag">{sampleLabel}</p>
            </div>

            <div className="tour-caption">
              <p className="tour-count">Step {current + 1} of {count}</p>
              <div className="tour-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(current + 1) / count})` }} /></div>
              <p className="tour-step-title">{step.title}</p>
              <p className="tour-step-text">{step.text}</p>
              <div className="tour-controls">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={current === 0}
                  onClick={() => go(index, current - 1, current - 1 === 0 ? "next" : null)}
                >
                  Back
                </button>
                <button type="button" className="btn btn-primary btn-sm" data-demo-next="" onClick={() => go(index, last ? 0 : current + 1)}>
                  {last ? "Start again" : "Next"}
                </button>
              </div>
            </div>

            <ol className="tour-steps" aria-label={`${wf.tab} steps`}>
              {wf.steps.map((s, j) => (
                <li key={s.id}>
                  <button type="button" aria-current={j === current ? "step" : undefined} data-done={j < current} onClick={() => go(index, j)}>
                    <span className="tour-steps-num" aria-hidden="true">{j + 1}</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
