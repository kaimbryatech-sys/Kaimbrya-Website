import type { DemoId } from "@/content/tour";

/** The map and the day simulator open a guided demo through one window event, so they stay independent. */
export const TOUR_SELECT = "kaimbrya:tour-select";
export type TourSelect = { demo: DemoId; step?: number };

export const DEMO_SECTION_ID = "guided-demo";
export const tabId = (demo: DemoId) => `tour-tab-${demo}`;
export const panelId = (demo: DemoId) => `tour-panel-${demo}`;

/** Selects a demo (and optionally a step), scrolls to the demo and moves focus to its tab. */
export function selectDemo(detail: TourSelect) {
  window.dispatchEvent(new CustomEvent<TourSelect>(TOUR_SELECT, { detail }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(DEMO_SECTION_ID)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  document.getElementById(tabId(detail.demo))?.focus({ preventScroll: true });
}
