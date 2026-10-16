"use client";

import { useRef, useState } from "react";

/** Print (or save as PDF) and share the board kit. Share falls back to copying the link. */
export function BoardKitActions({ title, text }: { title: string; text: string }) {
  const [status, setStatus] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const manualRef = useRef<HTMLInputElement>(null);

  const share = async () => {
    setStatus("");
    setManualUrl("");
    const url = window.location.href.split("#")[0] ?? window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // The visitor closed the share sheet: nothing more to do.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied. Paste it into an email or message to your board.");
    } catch {
      setManualUrl(url);
      setStatus("Copy the link below to share this page.");
      requestAnimationFrame(() => manualRef.current?.select());
    }
  };

  return (
    <div className="bk-actions">
      <div className="bk-actions-buttons">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
          <PrintIcon /> Print or save as PDF
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={share}>
          <ShareIcon /> Share this page
        </button>
      </div>
      <p className="bk-actions-status" role="status" aria-live="polite">{status}</p>
      {manualUrl ? (
        <div className="field bk-manual">
          <label htmlFor="bk-manual-url">Page link</label>
          <input id="bk-manual-url" ref={manualRef} readOnly value={manualUrl} onFocus={(e) => e.currentTarget.select()} />
        </div>
      ) : null}
    </div>
  );
}

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

function PrintIcon() {
  return <svg {...iconProps}><path d="M7 9V3h10v6M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7z" /></svg>;
}

function ShareIcon() {
  return <svg {...iconProps}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>;
}
