import type { CSSProperties, ReactNode } from "react";
import { sample, tour, type DemoId } from "@/content/tour";

/**
 * Sample screens for the guided demo, drawn in HTML and CSS (not captures) and rendered on the
 * server, so they add nothing to the page's JavaScript. The one primary button on a screen carries
 * `data-demo-action`; GuidedDemo listens for it and moves to the next step.
 */

// ── Icons ────────────────────────────────────────────────────────────────────
const PATHS = {
  menu: "M4 7h16M4 12h16M4 17h16",
  bell: "M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17zM10 21h4",
  home: "M4 11l8-6 8 6v9h-5v-6H9v6H4z",
  megaphone: "M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6",
  wallet: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7zM4 7l11-3v3M16 13.5h.01",
  wrench: "M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
  userCheck: "M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20a7 7 0 0 1 11.5-5.4M15 18l2 2 4-4",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M9 12l2 2 4-4",
  doc: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  photo: "M4 6h16v12H4zM4 15l4-4 4 4 3-3 5 5M15 9.5h.01",
  arrow: "M5 12h14M13 6l6 6-6 6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  chat: "M5 5h14v10H9l-4 4z",
  pin: "M9 4h6l-1 5 3 3H7l3-3zM12 12v8",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  scan: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10",
} as const;
type IconName = keyof typeof PATHS;

function Ico({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className ?? "tour-ico"}>
      <path d={PATHS[name]} />
    </svg>
  );
}

// ── Frames ───────────────────────────────────────────────────────────────────
type Nav = "home" | "notices" | "payments" | "requests" | "more";
const NAV: { id: Nav; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "notices", label: "Notices", icon: "megaphone" },
  { id: "payments", label: "Payments", icon: "wallet" },
  { id: "requests", label: "Requests", icon: "wrench" },
  { id: "more", label: "More", icon: "more" },
];

/** A homeowner's phone, with the app's top bar and tab bar. */
function Phone({ nav, badge = 0, children }: { nav: Nav; badge?: number; children: ReactNode }) {
  return (
    <div className="frame-phone tour-phone">
      <div className="tour-screen">
        <div className="tour-appbar" aria-hidden="true">
          <Ico name="menu" />
          <span className="tour-appbar-logo"><Ico name="home" /></span>
          <span className="tour-appbar-bell"><Ico name="bell" />{badge ? <b>{badge}</b> : null}</span>
        </div>
        <div className="tour-screen-body">{children}</div>
        <div className="tour-tabbar" aria-hidden="true">
          {NAV.map((n) => (
            <span key={n.id} data-active={n.id === nav}><Ico name={n.icon} />{n.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A guest's phone: the pass is a web page, no app or account needed. */
function GuestPhone({ children }: { children: ReactNode }) {
  return (
    <div className="frame-phone tour-phone">
      <div className="tour-screen tour-screen--web">
        <div className="tour-screen-body">{children}</div>
      </div>
    </div>
  );
}

/** A staff or security screen (gate tablet, office computer). */
function Panel({ place, title, children }: { place: string; title: string; children: ReactNode }) {
  return (
    <div className="tour-panel">
      <div className="tour-panel-bar" aria-hidden="true">
        <span className="tour-panel-dots"><i /><i /><i /></span>
        <span>Kaimbrya · {sample.community}</span>
        <span className="tour-panel-place">{place}</span>
      </div>
      <div className="tour-panel-body">
        <p className="tour-h">{title}</p>
        {children}
      </div>
    </div>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────────
type Tone = "ok" | "warn" | "info" | "plain";
const Chip = ({ tone = "plain", icon, children }: { tone?: Tone; icon?: IconName; children: ReactNode }) => (
  <span className={`tour-chip tour-chip--${tone}`}>{icon ? <Ico name={icon} /> : null}{children}</span>
);

/** The screen's one real button: advances the demo. */
const Action = ({ icon, children }: { icon?: IconName; children: ReactNode }) => (
  <button type="button" className="tour-action" data-demo-action="">
    {icon ? <Ico name={icon} /> : null}{children}
  </button>
);

/** Looks like a secondary button in the app, but it's only part of the picture. */
const Ghost = ({ icon, children }: { icon?: IconName; children: ReactNode }) => (
  <span className="tour-ghost">{icon ? <Ico name={icon} /> : null}{children}</span>
);

const Field = ({ label, value, tall = false }: { label: string; value: string; tall?: boolean }) => (
  <div className="tour-field">
    <span className="tour-field-label">{label}</span>
    <span className={`tour-field-value${tall ? " tour-field-value--tall" : ""}`}>{value}</span>
  </div>
);

const Facts = ({ rows }: { rows: [string, ReactNode][] }) => (
  <dl className="tour-facts">
    {rows.map(([k, v]) => (
      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
    ))}
  </dl>
);

const Note = ({ icon, title, text, time, fresh = false }: { icon: IconName; title: string; text: string; time: string; fresh?: boolean }) => (
  <div className="tour-note" data-fresh={fresh}>
    <span className="tour-note-icon"><Ico name={icon} /></span>
    <span className="tour-note-text">
      <strong>{title}</strong>
      <span>{text}</span>
      <small>{time}</small>
    </span>
  </div>
);

const STATUSES = ["Open", "In progress", "Completed"] as const;
function StatusTrack({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="tour-track" aria-label={`Status: ${STATUSES[current]}`}>
      {STATUSES.map((s, i) => (
        <li key={s} data-state={i < current ? "done" : i === current ? "now" : "next"}>
          <i aria-hidden="true">{i < current ? <Ico name="check" /> : null}</i>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/** A decorative QR-style pattern (not a working code). Finder squares in three corners, seeded noise elsewhere. */
function FakeQR({ className = "" }: { className?: string }) {
  const n = 25;
  let seed = 2310;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const finder = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]] as const) {
      const dx = x - ox, dy = y - oy;
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return 0; // quiet separator
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  let d = "";
  for (let y = 0; y < n; y++) {
    let run = 0;
    for (let x = 0; x <= n; x++) {
      const f = x < n ? finder(x, y) : 0;
      const on = x < n && (f === 1 || (f === -1 && rnd() > 0.5));
      if (on) run++;
      if (!on && run) { d += `M${x - run} ${y}h${run}v1h-${run}z`; run = 0; }
    }
  }
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className={`tour-qr ${className}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#15232d" />
    </svg>
  );
}

// ── Guest access ─────────────────────────────────────────────────────────────
const guests: Record<string, ReactNode> = {
  register: (
    <Phone nav="home">
      <p className="tour-h">Register New Visitor</p>
      <p className="tour-sub">{sample.lot} · {sample.community}</p>
      <Field label="Guest" value={sample.guest} />
      <Field label="Phone number" value="+1 876 555 0142" />
      <Field label="Purpose" value="Lunch" />
      <div className="tour-row">
        <Field label="Arrives" value="Today, 2:00 PM" />
        <Field label="Until" value="6:00 PM" />
      </div>
      <Action>Register visit</Action>
    </Phone>
  ),
  review: (
    <Panel place="Gate tablet" title="Visitor review">
      <div className="tour-card">
        <div className="tour-card-head"><Chip tone="warn" icon="clock">Pending review</Chip><span className="tour-meta">Requested 11:02 AM</span></div>
        <Facts rows={[["Destination", `${sample.lot} · ${sample.owner}`], ["Guest", sample.guest], ["Visit window", "Today, 2:00 PM to 6:00 PM"], ["Purpose", "Lunch"]]} />
        <div className="tour-buttons"><Ghost>Deny</Ghost><Action icon="check">Approve entry</Action></div>
      </div>
    </Panel>
  ),
  pass: (
    <GuestPhone>
      <p className="tour-pass-brand"><Ico name="shield" />Kaimbrya</p>
      <div className="tour-pass">
        <p className="tour-pass-label">Guest access pass</p>
        <FakeQR />
        <p className="tour-pass-ok"><Ico name="check" />Approved for entry</p>
        <Facts rows={[["Guest", sample.guest], ["Destination", sample.lot], ["Visit window", "Today, 2:00 PM until 6:00 PM"]]} />
      </div>
    </GuestPhone>
  ),
  scan: (
    <Panel place="Gate tablet" title="Scan a pass">
      <div className="tour-scan">
        <div className="tour-viewfinder" aria-hidden="true">
          <FakeQR className="tour-qr--small" />
          <i className="tour-viewfinder-line" />
        </div>
        <div className="tour-scan-result">
          <Chip tone="ok" icon="check">Pass valid</Chip>
          <p className="tour-scan-name">{sample.guest}</p>
          <p className="tour-meta">{sample.lot} · {sample.owner}</p>
          <p className="tour-meta">Valid until 6:00 PM today</p>
          <Action icon="userCheck">Check in</Action>
        </div>
      </div>
    </Panel>
  ),
  arrived: (
    <Phone nav="home" badge={1}>
      <p className="tour-h">Notifications</p>
      <Note fresh icon="userCheck" title="Your guest has arrived" text={`${sample.guest} checked in at the gate at 2:47 PM.`} time="Just now" />
      <Note icon="userCheck" title="Visitor access authorized" text={`Visitor access to ${sample.lot} has been approved.`} time="11:06 AM" />
      <Note icon="user" title="Visitor request received" text="Your request for 1 guest is being reviewed by security." time="11:02 AM" />
    </Phone>
  ),
};

// ── Finance ──────────────────────────────────────────────────────────────────
const invoiceRow = (paid: boolean) => (
  <div className="tour-card tour-invoice">
    <span><strong>Monthly maintenance fee</strong><span className="tour-meta">{sample.lot} · Issued Oct 25, 2026</span></span>
    <span className="tour-invoice-side"><strong>{sample.fee}</strong>{paid ? <Chip tone="ok">Paid</Chip> : <Chip tone="warn">Unpaid</Chip>}</span>
  </div>
);

const finance: Record<string, ReactNode> = {
  invoice: (
    <Phone nav="payments" badge={1}>
      <p className="tour-h">Payments Center</p>
      <div className="tour-card tour-balance">
        <span className="tour-meta">Outstanding balance</span>
        <span className="tour-amount">{sample.fee}</span>
        <Action icon="wallet">Proof of Payment</Action>
      </div>
      <p className="tour-section">Outstanding invoices</p>
      {invoiceRow(false)}
      <p className="tour-auto"><Ico name="spark" />Created automatically on the 25th</p>
    </Phone>
  ),
  proof: (
    <Phone nav="payments">
      <p className="tour-h">Proof of Payment</p>
      <p className="tour-sub">Paid by bank transfer</p>
      <Field label="Invoice" value="Monthly fee · Oct 25" />
      <Field label="Amount" value={sample.fee} />
      <Field label="Transfer reference" value="LOT23 OCT" />
      <div className="tour-file">
        <Ico name="doc" />
        <span><strong>transfer-confirmation.pdf</strong><span className="tour-meta">212 KB · attached</span></span>
      </div>
      <Action>Submit proof</Action>
    </Phone>
  ),
  match: (
    <Panel place="Office · Finance" title="Bank statement import">
      <ul className="tour-lines">
        <li data-state="suggested"><span>Oct 28 · TRANSFER LOT23 OCT</span><strong>{sample.fee}</strong></li>
        <li data-state="done"><span>Oct 28 · TRANSFER LOT08 OCT</span><strong>{sample.fee}</strong><Chip tone="ok">Confirmed</Chip></li>
      </ul>
      <div className="tour-match">
        <p className="tour-match-label"><Ico name="spark" />Suggested by reference: LOT23</p>
        <div className="tour-match-pair">
          <span><small>Bank line</small>Oct 28 · {sample.fee}</span>
          <Ico name="arrow" className="tour-ico tour-match-arrow" />
          <span><small>{sample.lot} · {sample.owner}</small>Invoice Oct 25 · proof uploaded</span>
        </div>
        <div className="tour-buttons"><Ghost>Choose another</Ghost><Action icon="check">Confirm match</Action></div>
        <p className="tour-fine">Balances change only after a staff member confirms.</p>
      </div>
    </Panel>
  ),
  balance: (
    <Phone nav="payments" badge={1}>
      <p className="tour-h">Payments Center</p>
      <div className="tour-card tour-balance">
        <span className="tour-meta">Outstanding balance</span>
        <span className="tour-amount">JMD 0.00</span>
        <Chip tone="ok" icon="check">Paid up</Chip>
      </div>
      {invoiceRow(true)}
      <Note fresh icon="mail" title="Proof of payment approved" text="We've confirmed your bank transfer for Lot 23. Your receipt is ready." time="Email · just now" />
      <Action icon="doc">View receipt</Action>
    </Phone>
  ),
  receipt: (
    <Phone nav="payments">
      <p className="tour-h">Receipt</p>
      <div className="tour-doc">
        <div className="tour-doc-head"><strong>{sample.community}</strong><span>Receipt R-2026-0147</span></div>
        <Facts rows={[["Received from", `${sample.owner}, ${sample.lot}`], ["Date", "Oct 28, 2026"], ["Method", "Bank transfer"], ["For", "Monthly maintenance fee"]]} />
        <div className="tour-doc-total"><span>Amount received</span><strong>{sample.fee}</strong></div>
        <p className="tour-meta">Balance after payment: JMD 0.00</p>
      </div>
      <div className="tour-buttons"><Ghost>Statement</Ghost><Ghost icon="download">PDF</Ghost></div>
    </Phone>
  ),
};

// ── Maintenance ──────────────────────────────────────────────────────────────
const requestCard = (status: "progress" | "done") => (
  <div className="tour-card">
    <div className="tour-card-head">
      {status === "progress" ? <Chip tone="info" icon="clock">In progress</Chip> : <Chip tone="ok" icon="check">Completed</Chip>}
      <span className="tour-meta">{status === "progress" ? "Oct 21, 2026" : "Oct 22, 2026"}</span>
    </div>
    <p className="tour-card-title">Outside tap leaking</p>
    <p className="tour-meta">{sample.lot} · Front garden</p>
    <p className="tour-card-text">{status === "progress" ? "Work has started. Devon is replacing the washer." : "Washer replaced and tap tested. No more leak."}</p>
  </div>
);

const maintenance: Record<string, ReactNode> = {
  report: (
    <Phone nav="requests">
      <p className="tour-h">New service request</p>
      <Field label="What's wrong?" value="Outside tap leaking" />
      <Field label="Where" value={`${sample.lot} · Front garden`} />
      <Field label="Details" value="Dripping all day, even when it's turned off." tall />
      <div className="tour-photo">
        <span className="tour-photo-thumb" aria-hidden="true"><Ico name="photo" /></span>
        <span><strong>Photo added</strong><span className="tour-meta">tap.jpg</span></span>
      </div>
      <Action>Submit request</Action>
    </Phone>
  ),
  assign: (
    <Panel place="Office · Maintenance" title="Service request">
      <div className="tour-card">
        <div className="tour-card-head"><Chip tone="warn">Open</Chip><span className="tour-meta">Reported 11:48 AM</span></div>
        <p className="tour-card-title">Outside tap leaking</p>
        <p className="tour-meta">{sample.lot} · {sample.owner} · 1 photo</p>
        <Facts rows={[["Assign to", "Devon Brown, Maintenance"], ["Priority", "Medium"], ["Planned for", "Thu, Oct 22"]]} />
        <div className="tour-buttons"><Action icon="check">Assign task</Action></div>
      </div>
      <StatusTrack current={0} />
    </Panel>
  ),
  progress: (
    <Phone nav="requests" badge={1}>
      <p className="tour-h">My requests</p>
      {requestCard("progress")}
      <StatusTrack current={1} />
      <Note fresh icon="wrench" title="Request update" text="Outside tap leaking is now In progress. We've emailed you too." time="Just now" />
    </Phone>
  ),
  done: (
    <Phone nav="requests" badge={1}>
      <p className="tour-h">My requests</p>
      {requestCard("done")}
      <StatusTrack current={2} />
      <Note fresh icon="check" title="Request completed" text="Outside tap leaking has been marked Completed." time="Just now" />
    </Phone>
  ),
};

// ── Announcements and governance ─────────────────────────────────────────────
const governance: Record<string, ReactNode> = {
  announce: (
    <Panel place="Office · Announcements" title="New announcement">
      <Field label="Title" value="Proposed 2027 budget: no change to monthly fees" />
      <div className="tour-row">
        <Field label="Category" value="Policy" />
        <Field label="Priority" value="High" />
      </div>
      <ul className="tour-options">
        <li data-on="true"><Ico name="pin" />Pinned</li>
        <li data-on="true"><Ico name="bell" />In app</li>
        <li data-on="true"><Ico name="bell" />Push</li>
        <li data-on="true"><Ico name="mail" />Email</li>
      </ul>
      <div className="tour-buttons"><Action icon="megaphone">Publish</Action></div>
    </Panel>
  ),
  library: (
    <Panel place="Office · Library" title="Library › Finance">
      <ul className="tour-files">
        <li><Ico name="doc" /><span>Approved Budget 2026.pdf</span><Chip>Home owners</Chip></li>
        <li><Ico name="doc" /><span>Financial Report Q3 2026.pdf</span><Chip>Home owners</Chip></li>
        <li data-new="true"><Ico name="doc" /><span>Proposed Budget 2027.pdf</span><Chip tone="info">New</Chip></li>
      </ul>
      <div className="tour-share">
        <p className="tour-share-title">Share “Proposed Budget 2027”</p>
        <Facts rows={[["Roles", "Home owner"], ["Tell them by", "In app, push and email"]]} />
        <div className="tour-buttons"><Action icon="folder">Share with owners</Action></div>
      </div>
    </Panel>
  ),
  idea: (
    <Phone nav="more">
      <p className="tour-h">Idea exchange</p>
      <div className="tour-card">
        <div className="tour-card-head"><Chip tone="info">Under review</Chip><span className="tour-meta">Tanya Morgan · Lot 8</span></div>
        <p className="tour-card-title">Solar lights for the park path</p>
        <p className="tour-card-text">Evening walks would feel safer with low solar lights along the path.</p>
        <p className="tour-stats"><span><Ico name="heart" />14 supporters</span><span><Ico name="chat" />3 comments</span></p>
        <Action icon="heart">Support this idea</Action>
      </div>
    </Phone>
  ),
  vote: (
    <Phone nav="more">
      <p className="tour-h">Votes</p>
      <div className="tour-card">
        <div className="tour-chips"><Chip tone="ok">Active</Chip><Chip>Anonymous ballot</Chip><Chip>Quorum 50%</Chip></div>
        <p className="tour-card-title">Approve the 2027 budget and reserve-fund contribution</p>
        <p className="tour-meta">One ballot per eligible owner</p>
        <ul className="tour-ballot">
          <li data-on="true"><i aria-hidden="true" />For<span className="sr-only"> (selected)</span></li>
          <li><i aria-hidden="true" />Against</li>
        </ul>
        <Action>Cast ballot</Action>
        <p className="tour-meta tour-center">21 of 36 eligible owners have voted</p>
      </div>
    </Phone>
  ),
  results: (
    <Panel place="Office · Votes" title="Vote results">
      <div className="tour-card">
        <div className="tour-chips"><Chip>Closed</Chip><Chip tone="ok" icon="check">Quorum reached</Chip></div>
        <p className="tour-card-title">Approve the 2027 budget and reserve-fund contribution</p>
        <p className="tour-meta">29 of 36 eligible owners voted (81%). Quorum: 50%.</p>
        <ul className="tour-bars">
          <li style={{ "--w": "79%" } as CSSProperties}><span>For</span><i aria-hidden="true" /><strong>23 · 79%</strong></li>
          <li style={{ "--w": "21%" } as CSSProperties}><span>Against</span><i aria-hidden="true" /><strong>6 · 21%</strong></li>
        </ul>
        <p className="tour-fine">Calculated automatically when the vote closed. Online votes support the meetings your governing documents require; they don&apos;t replace them.</p>
      </div>
    </Panel>
  ),
};

const SCREENS: Record<DemoId, Record<string, ReactNode>> = { guests, finance, maintenance, governance };

/** One screen per step, in the order of the workflow's steps. */
export function buildMocks(): Record<DemoId, ReactNode[]> {
  const out = {} as Record<DemoId, ReactNode[]>;
  for (const wf of tour.workflows) {
    out[wf.id] = wf.steps.map((s) => {
      const screen = SCREENS[wf.id][s.id];
      if (!screen) throw new Error(`No sample screen for ${wf.id}/${s.id}`);
      return screen;
    });
  }
  return out;
}
