import type { ScreenName } from "./screens.generated";

/**
 * All homepage copy and site configuration. Every product claim here was checked
 * against the app (see "Product facts" in the website specification): no online
 * payments, transfers matched by staff, one community per Kaimbrya, anonymous rollout.
 */

export const config = {
  /** Business inbox, confirmed October 2026. */
  contactEmail: "kaimbryatech@gmail.com",
  /** Open question: the app's sign-in address. The Sign in link is hidden until this is set. */
  appSignInUrl: process.env.NEXT_PUBLIC_APP_SIGN_IN_URL ?? "",
  /** Optional custom endpoint for demo requests. Unset = submissions go to Netlify Forms ("demo-request"). */
  demoEndpoint: process.env.NEXT_PUBLIC_DEMO_ENDPOINT ?? "",
};

export type AudienceId = "gated" | "strata" | "managers" | "developers";

export const audiences: ReadonlyArray<{
  id: AudienceId;
  /** URL segment of the audience's page: /solutions/<slug>/ */
  slug: string;
  anchor: string;
  title: string;
  text: string;
  art: "audience-gated" | "audience-strata" | "audience-managers" | "audience-developers";
}> = [
  {
    id: "gated",
    slug: "gated-communities",
    anchor: "for-gated-communities",
    title: "Gated communities",
    text: "Guest passes, guard review and a searchable record of every visit.",
    art: "audience-gated",
  },
  {
    id: "strata",
    slug: "strata-and-hoas",
    anchor: "for-strata-and-hoas",
    title: "Strata corporations and HOAs",
    text: "Fees, arrears, owner records and notices in one shared system.",
    art: "audience-strata",
  },
  {
    id: "managers",
    slug: "property-managers",
    anchor: "for-property-managers",
    title: "Property management companies",
    text: "Run Kaimbrya for each community you look after, each with its own records.",
    art: "audience-managers",
  },
  {
    id: "developers",
    slug: "developers",
    anchor: "for-developers",
    title: "Residential developers",
    text: "Set up every unit in one go, and let owners claim their homes before handover.",
    art: "audience-developers",
  },
];

export const platformLinks = [
  { href: "/platform/", title: "Platform overview", text: "Every module, and how they fit together" },
  { href: "/platform/#finance", title: "Finance and collections", text: "Invoices, recorded payments and arrears" },
  { href: "/platform/#guest-access", title: "Guest access and security", text: "Visitors, the gate, incidents and shifts" },
  { href: "/platform/#properties", title: "Properties and maintenance", text: "One register; work tracked to done" },
  { href: "/communication/", title: "Communication and transparency", text: "Official notices, events, votes and ideas" },
  { href: "/library/", title: "Document library", text: "Bylaws, minutes, budgets and forms in one place" },
  { href: "/platform/#community", title: "Community life", text: "Bookings, yard sale and donations" },
  { href: "/platform/#administration", title: "Roles and records", text: "Permissions, audit trail and exports" },
];

export const solutionLinks = audiences.map((a) => ({ href: `/solutions/${a.slug}/`, title: a.title, text: a.text }));

export const hero = {
  eyebrow: "Community management for Jamaica",
  titleStart: "Community management,",
  titleEmphasis: "reimagined.",
  lead: "One connected platform for community finances, guest access, properties, maintenance and communication. Built for modern Jamaican communities.",
  primary: { label: "Book a personal demo", href: "/demo/" },
  secondary: { label: "Explore the platform", href: "/platform/" },
};

export const credibility = {
  eyebrow: "Rolling out now",
  title: "Built for real communities. Designed for everyday life.",
  items: [
    { title: "190+ homes", text: "Kaimbrya is currently being rolled out to a Jamaican residential community comprising more than 190 homes." },
    { title: "Phone-first", text: "Homeowners and guards use the phones they already carry. There's nothing to install at the gate." },
    { title: "One record", text: "Collections, the gate, repairs and notices share one system, so nothing is copied between tools." },
  ],
};

export const convergence = {
  before: {
    eyebrow: "The old way",
    title: "Running a community shouldn't mean managing disconnected systems.",
    items: ["Fee spreadsheets on someone's laptop", "Bank statements checked by hand", "A paper logbook at the gate", "Notices buried in WhatsApp groups", "Repair requests lost in messages"],
  },
  after: {
    eyebrow: "With Kaimbrya",
    title: "One platform. Everything connected.",
    text: "Collections, the gate, notices, repairs and votes share one record. The board, the office, the guards and every homeowner each see the part that's theirs.",
    cta: { label: "See it for your community", href: "/demo/" },
  },
};

export const finance = {
  eyebrow: "Finance and collections",
  title: "Know where your community stands. Without the spreadsheet.",
  lead: "Invoices go out on their own every month. When an owner pays by bank transfer, your team records it and matches it to the right unit, and no balance changes until someone confirms the match.",
  board: ["Outstanding and overdue totals, always current", "Overdue accounts flagged by rules you set", "Owners alerted in the app when an account falls overdue"],
  owners: ["Balances, invoices and PDF receipts in one place", "Proof of payment sent from the phone"],
  callouts: ["Total owed, always current", "Overdue accounts, flagged for follow-up"],
};

export type GuestStep = { id: string; label: string; title: string; text: string; screen: ScreenName; device: "phone" | "panel"; alt: string };

export const guestAccess = {
  eyebrow: "Guest access and security",
  title: "Your guests are expected. Your community is prepared.",
  lead: "Three steps replace the phone call to the house and the name in the logbook.",
  steps: [
    {
      id: "invite",
      label: "Invite",
      title: "The homeowner registers the visit",
      text: "Name, phone number, purpose and arrival window, entered from the homeowner's phone.",
      screen: "owner-register-visitor",
      device: "phone",
      alt: "Kaimbrya on a phone: the Register New Visitor form with the guest's name and phone number filled in",
    },
    {
      id: "approve",
      label: "Approve",
      title: "Security reviews the request",
      text: "The guard sees the home, the guest and the visit window, then approves or denies the request.",
      screen: "guard-review",
      device: "panel",
      alt: "Kaimbrya security view: a visitor request for Lot 23 with Deny Access and Authorize Entry buttons",
    },
    {
      id: "arrive",
      label: "Arrive",
      title: "The guest shows a QR pass",
      text: "The pass works only for that visit. The guard scans it at the gate, and the visit is recorded.",
      screen: "guest-pass",
      device: "phone",
      alt: "A Kaimbrya guest access pass on a phone: a QR code marked Approved for entry, with the guest, destination and visit window",
    },
  ] satisfies GuestStep[],
};

export type Role = { id: string; label: string; title: string; points: string[]; screen: ScreenName; device: "phone" | "desktop" | "panel"; alt: string };

export const roles = {
  eyebrow: "One system, every role",
  title: "Built for the people who manage the community. And the people who call it home.",
  items: [
    {
      id: "homeowner",
      label: "Homeowner",
      title: "Everything about my home, on my phone",
      points: ["See what you owe and send proof of payment", "Invite guests and share their passes", "Report a problem and follow it until it's fixed", "Read notices and vote"],
      screen: "owner-home",
      device: "phone",
      alt: "Kaimbrya homeowner home screen on a phone: dues paid, open requests and violations",
    },
    {
      id: "manager",
      label: "Manager",
      title: "The whole community at a glance",
      points: ["Collections and overdue accounts", "Every unit, owner and resident", "Maintenance tasks, weekly plans and recurring jobs", "Sign-ins and key changes on record"],
      screen: "property-register-full",
      device: "desktop",
      alt: "Kaimbrya manager view: the property register with occupied and vacant counts and the unit list",
    },
    {
      id: "security",
      label: "Security",
      title: "The gate, organised",
      points: ["Review visitor requests as they arrive", "Scan guest passes and licences at the gate", "Log incidents and hand over between shifts", "Check the shared blocklist"],
      screen: "security-reviews",
      device: "panel",
      alt: "Kaimbrya security view: pending visitor reviews, with Scan ID and Register Visitor buttons",
    },
  ] satisfies Role[],
};

export const operations = {
  eyebrow: "Properties and maintenance",
  title: "Every property accounted for. Every task moving forward.",
  property: {
    title: "One live register",
    text: "Units, owners, residents and occupancy in one place. New residents request access to their home, and staff approve it.",
  },
  maintenance: {
    title: "Work tracked until it's done",
    text: "Assign tasks, set priorities, plan the week and repeat regular jobs. Homeowners report problems and follow them until they're fixed.",
  },
  lifecycle: ["Report", "Assign", "Track", "Complete"],
};

export const community = {
  eyebrow: "Communication and transparency",
  title: "One community. One trusted source of information.",
  lead: "Post a water interruption or an AGM once, and every resident sees it in the app, pinned and prioritised. Bylaws, minutes and approved budgets sit in the Library for owners to open any time. Owners vote with anonymous ballots and quorum tracking, and suggest improvements the board can see.",
  note: "Online votes support the meetings and votes your governing documents require. They don't replace them.",
  link: { label: "See how communication works", href: "/communication/" },
};

export const audiencesSection = {
  eyebrow: "Solutions",
  title: "Whatever your community looks like, Kaimbrya helps bring it together.",
  linkLabel: "See how it works",
};

export const finalCta = {
  title: "Your community deserves better management.",
  text: "See how Kaimbrya could simplify everyday operations for your community or development.",
  primary: { label: "Schedule your demonstration", href: "/demo/" },
  secondary: { label: "Contact our team", href: "/demo/" },
};

export const demoPage = {
  eyebrow: "Book a demo",
  title: "See Kaimbrya with a community like yours.",
  lead: "Tell us a little about your community and we'll arrange a walkthrough with your board or team.",
  next: [
    { title: "We reply to arrange a time", text: "that suits your board, committee or management team." },
    { title: "You see the real app", text: "using demonstration data, focused on what matters to you." },
    { title: "You decide what's next", text: "and we answer any questions about setting up your community." },
  ],
  orgTypes: [
    { value: "strata", label: "Strata corporation or HOA" },
    { value: "gated", label: "Gated community" },
    { value: "managers", label: "Property management company" },
    { value: "developers", label: "Residential developer" },
    { value: "other", label: "Something else" },
  ],
  sizes: ["Under 50 homes", "50–150 homes", "150–300 homes", "More than 300 homes", "Several communities"],
};
