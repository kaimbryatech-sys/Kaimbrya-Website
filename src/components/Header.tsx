"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { config, platformLinks, solutionLinks } from "@/content/site";
import { ArrowRight, ChevronDown, Close, LogoMark, Menu } from "./icons";

type MenuId = "platform" | "solutions";
const MENUS: ReadonlyArray<{ id: MenuId; label: string; links: typeof platformLinks }> = [
  { id: "platform", label: "Platform", links: platformLinks },
  { id: "solutions", label: "Solutions", links: solutionLinks },
];

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Solid once the page scrolls (one rAF-throttled passive listener).
  useEffect(() => {
    let frame = 0;
    const read = () => { frame = 0; setScrolled(window.scrollY > 24); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  // Close the mega menu on Escape or on a click outside the navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { triggerRefs.current[open]?.focus(); setOpen(null); }
    };
    const onPointer = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    mobileToggleRef.current?.focus();
  }, []);

  // Mobile menu: lock page scroll, focus the close button, Escape closes, Tab stays inside.
  useEffect(() => {
    if (!mobileOpen) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    mobileCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMobile(); return; }
      if (e.key !== "Tab" || !mobilePanelRef.current) return;
      const focusables = mobilePanelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { html.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [mobileOpen, closeMobile]);

  const hoverOpen = (id: MenuId) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    if (open !== id) hoverOpenedAt.current = performance.now();
    setOpen(id);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const solid = !overHero || scrolled || open !== null;

  // The mobile menu is a sibling of <header>, not a child: the header's backdrop-filter
  // would otherwise become the containing block of the fixed, full-screen menu.
  return (
    <>
    <header className="site-header" data-solid={solid}>
      <div className="wrap">
        <Link href="/" className="wordmark" aria-label="Kaimbrya home" prefetch={false}>
          <LogoMark />
          <span>Kaimbrya</span>
        </Link>

        <nav ref={navRef} className="nav" aria-label="Main">
          {MENUS.map((menu) => (
            <div
              key={menu.id}
              className="nav-item"
              onPointerEnter={hoverOpen(menu.id)}
              onPointerLeave={hoverClose}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((cur) => (cur === menu.id ? null : cur)); }}
            >
              <button
                ref={(el) => { triggerRefs.current[menu.id] = el; }}
                type="button"
                className="nav-trigger"
                aria-expanded={open === menu.id}
                aria-controls={`menu-${menu.id}`}
                // A click straight after a hover-open (the mouse arriving) keeps the menu open.
                onClick={() => setOpen((cur) => (cur === menu.id && performance.now() - hoverOpenedAt.current > 400 ? null : menu.id))}
              >
                {menu.label}
                <ChevronDown />
              </button>
              <div id={`menu-${menu.id}`} className="mega" data-open={open === menu.id}>
                {menu.links.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setOpen(null)} tabIndex={open === menu.id ? 0 : -1}>
                    <strong>{link.title}</strong>
                    <span>{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="header-actions">
          {config.appSignInUrl ? <a className="header-signin" href={config.appSignInUrl}>Sign in</a> : null}
          <Link href="/demo/" className="btn btn-primary" prefetch={false}>Book a demo</Link>
          <button
            ref={mobileToggleRef}
            type="button"
            className="menu-button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>

      <div
        id="mobile-menu"
        ref={mobilePanelRef}
        className="mobile-menu"
        data-open={mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!mobileOpen}
      >
        <div className="mobile-menu-top">
          <Link href="/" className="wordmark" prefetch={false} onClick={closeMobile}><LogoMark /><span>Kaimbrya</span></Link>
          <button ref={mobileCloseRef} type="button" className="menu-button" aria-label="Close menu" onClick={closeMobile}><Close /></button>
        </div>
        <div className="mobile-menu-body">
          {MENUS.map((menu) => (
            <section key={menu.id} aria-labelledby={`m-${menu.id}`}>
              <h2 id={`m-${menu.id}`}>{menu.label}</h2>
              {menu.links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <strong>{link.title}</strong>
                  <span>{link.text}</span>
                </a>
              ))}
            </section>
          ))}
        </div>
        <div className="mobile-menu-foot">
          {config.appSignInUrl ? <a className="btn btn-secondary" href={config.appSignInUrl}>Sign in</a> : null}
          <Link href="/demo/" className="btn btn-primary" prefetch={false} onClick={() => setMobileOpen(false)}>Book a demo <ArrowRight /></Link>
        </div>
      </div>
    </>
  );
}
