"use client";

import { useState, type CSSProperties } from "react";
import type { DayTime } from "@/content/tour";
import { ArrowRight } from "@/components/icons";
import { selectDemo } from "./events";

const TONES: DayTime["tone"][] = ["dawn", "morning", "noon", "afternoon", "evening", "night"];

/**
 * A day in the community: pick a time (native radio buttons, so arrow keys work) and see what
 * happens across the modules at that hour. Each time links to the matching guided demo.
 */
export function DaySimulator({ times }: { times: DayTime[] }) {
  const [id, setId] = useState(times[0]?.id ?? "");
  const [touched, setTouched] = useState(false);
  const index = Math.max(0, times.findIndex((t) => t.id === id));
  const t = times[index];
  if (!t) return null;
  const night = t.tone === "night";

  return (
    <div className="tour-day">
      <fieldset className="tour-day-picker">
        <legend className="sr-only">Time of day</legend>
        <div className="tour-day-track" aria-hidden="true"><i style={{ transform: `scaleX(${index / Math.max(1, times.length - 1)})` }} /></div>
        {times.map((x) => (
          <label key={x.id} className="tour-day-stop" data-checked={x.id === t.id}>
            <input type="radio" name="tour-day-time" value={x.id} checked={x.id === t.id} onChange={() => { setId(x.id); setTouched(true); }} />
            <span className="tour-day-dot" aria-hidden="true" />
            <span className="tour-day-time"><span className="tour-day-long">{x.time}</span><span className="tour-day-short" aria-hidden="true">{x.short}</span></span>
          </label>
        ))}
      </fieldset>

      <div className="tour-day-panel" data-tone={t.tone}>
        <div className="tour-day-sky" aria-hidden="true">
          {TONES.map((tone) => <i key={tone} data-tone={tone} data-on={tone === t.tone} />)}
          <span className="tour-day-sun" data-night={night} style={{ "--sx": `${t.sun[0]}%`, "--sy": `${t.sun[1]}%` } as CSSProperties} />
          <span className="tour-day-ground" />
        </div>
        <p className="sr-only" aria-live="polite">{touched ? `${t.time}: ${t.title}` : ""}</p>
        <div className="tour-day-body">
          <p className="tour-day-when">{t.time}</p>
          <h3 className="tour-day-title">{t.title}</h3>
          <ul className="tour-day-events" key={t.id}>
            {t.events.map((ev, i) => (
              <li key={ev.text} style={{ "--i": i } as CSSProperties}>
                <span className="tour-day-meta"><strong>{ev.module}</strong><span className="sr-only">, </span><span className="tour-day-who">{ev.who}</span></span>
                <p>{ev.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="tour-day-foot">
          <button type="button" className="link-arrow tour-day-link" onClick={() => selectDemo({ demo: t.demo, step: 0 })}>
            {t.demoLabel} <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
