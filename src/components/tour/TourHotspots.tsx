"use client";

import type { CSSProperties } from "react";
import type { Hotspot } from "@/content/tour";
import { selectDemo } from "./events";

export type PlacedHotspot = Omit<Hotspot, "world"> & { x: number; y: number };

const ICONS: Record<Hotspot["icon"], string> = {
  gate: "M4 20V9l8-5 8 5v11M9 13l2 2 4-4",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6",
  wrench: "M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z",
  megaphone: "M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6",
  doc: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
};

/**
 * Places on the community map. Each is one real button: pinned over the illustration on wide
 * screens, and a numbered list under it on narrow ones (with matching numbers on the picture).
 */
export function TourHotspots({ spots, hintId }: { spots: PlacedHotspot[]; hintId: string }) {
  return (
    <>
      <ol className="tour-markers" aria-hidden="true">
        {spots.map((s, i) => (
          <li key={s.id} style={{ "--x": `${s.x}%`, "--y": `${s.y}%` } as CSSProperties}>{i + 1}</li>
        ))}
      </ol>
      <ul className="tour-spots" aria-label="Places in Mahoe Ridge">
        {spots.map((s, i) => (
          <li key={s.id} className="tour-spot" data-side={s.side} style={{ "--x": `${s.x}%`, "--y": `${s.y}%` } as CSSProperties}>
            <button type="button" className="tour-spot-btn" aria-describedby={hintId} onClick={() => selectDemo({ demo: s.demo, step: s.step })}>
              <span className="tour-spot-pin" aria-hidden="true"><i /></span>
              <span className="tour-spot-num" aria-hidden="true">{i + 1}</span>
              <span className="tour-spot-label">
                <span className="tour-spot-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={ICONS[s.icon]} /></svg>
                </span>
                <span className="tour-spot-text">
                  <strong>{s.module}</strong>
                  <span className="sr-only">, </span>
                  <span className="tour-spot-place">{s.place}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
