import type { ReactNode } from "react";

/** Light, text-first layout for the contact and legal pages. */
export function DocPage({ eyebrow, title, lead, updated, children }: { eyebrow: string; title: string; lead?: string; updated?: string; children: ReactNode }) {
  return (
    <section className="doc-page" aria-labelledby="doc-title">
      <div className="wrap">
        <div className="doc-head">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="doc-title" className="title" style={{ marginTop: 16 }}>{title}</h1>
          {lead ? <p className="lead" style={{ marginTop: 18 }}>{lead}</p> : null}
          {updated ? <p className="doc-updated">Last updated {updated}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
