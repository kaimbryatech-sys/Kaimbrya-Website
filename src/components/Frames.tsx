import type { ReactNode } from "react";

/** A light browser-style window for full desktop screens. */
export function DesktopFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`frame-desktop ${className}`}>
      <div className="frame-desktop-bar" aria-hidden="true"><i /><i /><i /></div>
      {children}
    </div>
  );
}

/** A plain card for cropped parts of a screen. */
export function PanelFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`frame-panel ${className}`}>{children}</div>;
}

/** A phone body for 390 px-wide captures. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`frame-phone ${className}`}>{children}</div>;
}
