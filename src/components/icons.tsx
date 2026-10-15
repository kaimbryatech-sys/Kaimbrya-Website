import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden focusable={false} {...props}>
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2.25" />
      <path d="M12.5 28.5V17.75L20 12.5L27.5 17.75V28.5H22.75V21.5H17.25V28.5H12.5Z" fill="currentColor" />
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ChevronDown = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const Check = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.6} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const Bell = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17zM10 21h4" /></svg>
);
export const Receipt = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" /></svg>
);
export const Menu = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Alert = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.5" /></svg>
);
