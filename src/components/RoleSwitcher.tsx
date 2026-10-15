"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Role } from "@/content/site";
import { DesktopFrame, PanelFrame, PhoneFrame } from "./Frames";
import { Screen } from "./Screen";

/** Homeowner · Manager · Security: one tab per role, each with its real screen. */
export function RoleSwitcher({ roles }: { roles: Role[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = roles.length - 1;
    const keys: Record<string, number> = { ArrowRight: active === last ? 0 : active + 1, ArrowLeft: active === 0 ? last : active - 1, Home: 0, End: last };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key]!;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label="Choose a role" className="roles-tabs" onKeyDown={onKeyDown}>
        {roles.map((role, i) => (
          <button
            key={role.id}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`role-tab-${role.id}`}
            aria-selected={i === active}
            aria-controls={`role-panel-${role.id}`}
            tabIndex={i === active ? 0 : -1}
            className="role-tab"
            onClick={() => setActive(i)}
          >
            {role.label}
          </button>
        ))}
      </div>
      <div className="role-panels">
        {roles.map((role, i) => {
          const shot = (
            <Screen
              name={role.screen}
              alt={role.alt}
              sizes={role.device === "phone" ? "250px" : "(min-width: 1024px) 680px, 92vw"}
            />
          );
          return (
            <div
              key={role.id}
              id={`role-panel-${role.id}`}
              role="tabpanel"
              aria-labelledby={`role-tab-${role.id}`}
              className="role-panel"
              data-active={i === active}
              aria-hidden={i !== active}
              inert={i !== active}
            >
              <div>
                <h3>{role.title}</h3>
                <ul className="ticks">
                  {role.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div className="role-visual">
                {role.device === "phone" ? <PhoneFrame>{shot}</PhoneFrame> : role.device === "desktop" ? <DesktopFrame>{shot}</DesktopFrame> : <PanelFrame>{shot}</PanelFrame>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
