import type { SceneName } from "@/components/Art";
import type { CompositionLayout, Faq, Shot, Step } from "@/components/blocks";
import type { AudienceId } from "./site";

/**
 * The four Solutions pages share one template (src/app/solutions/[slug]/page.tsx).
 * Copy follows the website specification's product facts: no online payments, staff
 * match transfers by hand, one community per Kaimbrya, anonymous rollout.
 */

type Capability = { title: string; text: string; points: string[]; link: string; linkLabel: string; layout: CompositionLayout; shots: Shot[] };
type Experience =
  | { kind: "guest"; eyebrow: string; title: string; lead: string }
  | { kind: "roles"; eyebrow: string; title: string; lead: string; roleOrder: string[] }
  | { kind: "flow"; eyebrow: string; title: string; lead: string; steps: Step[] };

export type Solution = {
  slug: string;
  audience: AudienceId;
  name: string;
  faqAudience: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; emphasis?: string; lead: string; scene: SceneName; shot: Shot };
  challenges: { eyebrow: string; title: string; items: Array<{ title: string; text: string }> };
  capabilities: { eyebrow: string; title: string; lead: string; items: Capability[] };
  experience: Experience;
  faq: Faq[];
  cta: { title: string; text: string };
};

const shot = {
  guestPass: { name: "guest-pass", device: "phone", alt: "A guest's QR pass on a phone, marked Approved for entry", sizes: "(min-width: 1024px) 170px, 30vw" },
  registerVisitor: { name: "owner-register-visitor", device: "phone", alt: "The Register New Visitor form on a homeowner's phone", sizes: "(min-width: 640px) 200px, 240px" },
  guardReview: { name: "guard-review", device: "panel", alt: "A guard's review of a visitor request: home, guest and visit window, with Deny Access and Authorize Entry", sizes: "(min-width: 1024px) 400px, 80vw" },
  securityReviews: { name: "security-reviews", device: "panel", alt: "Pending visitor reviews for security, with Scan ID and Register Visitor buttons" },
  incidents: { name: "incidents-queue", device: "panel", alt: "Kaimbrya incidents: new, urgent, on hold and open counts, and the incident list" },
  payments: { name: "payments-overview", device: "panel", alt: "Kaimbrya Payments Center: total outstanding, pending review and overdue invoices" },
  overdue: { name: "overdue-accounts", device: "panel", alt: "Overdue accounts in Kaimbrya, with outstanding amounts and last payment dates" },
  announcements: { name: "announcements-table", device: "panel", alt: "Kaimbrya announcements for managers: category, priority and author" },
  notices: { name: "owner-notices", device: "phone", alt: "Announcements on a homeowner's phone", sizes: "(min-width: 640px) 180px, 240px" },
  vote: { name: "vote-card", device: "panel", alt: "A Kaimbrya vote on the 2027 budget, anonymous, with 50% quorum" },
  ideas: { name: "ideas-board", device: "panel", alt: "The Kaimbrya idea exchange: resident ideas and their support" },
  register: { name: "property-register", device: "panel", alt: "Kaimbrya property register: property, occupied, vacant and pending counts with the unit list" },
  wizard: { name: "setup-wizard", device: "panel", alt: "The Kaimbrya property setup wizard: batch ranges and developments organised in sections" },
  dataExport: { name: "data-export", device: "panel", alt: "The Kaimbrya Data Export Center: members, properties, guest log, requests, incidents and violations" },
  roles: { name: "roles-permissions", device: "panel", alt: "Kaimbrya access control: roles, and the permissions for a Security Supervisor role" },
  maintenance: { name: "maintenance-tasks", device: "panel", alt: "Kaimbrya maintenance tasks with counts by status and a prioritised task list" },
  request: { name: "owner-request-card", device: "panel", alt: "A homeowner's service request, in progress" },
  ownerHome: { name: "owner-home", device: "phone", alt: "The Kaimbrya home screen on a homeowner's phone", sizes: "(min-width: 640px) 240px, 240px" },
  ownerPayments: { name: "owner-payments", device: "phone", alt: "A homeowner's Payments Center on a phone, with a Proof of Payment button", sizes: "(min-width: 640px) 180px, 240px" },
  managerDashboard: { name: "manager-dashboard", device: "desktop", alt: "The Kaimbrya home screen for a manager", sizes: "(min-width: 1024px) 360px, 60vw" },
} satisfies Record<string, Shot>;

const challengesEyebrow = "What gets in the way";
const capabilitiesEyebrow = "How Kaimbrya helps";

export const solutions: Solution[] = [
  {
    slug: "gated-communities",
    audience: "gated",
    name: "Gated communities",
    faqAudience: "gated communities",
    meta: {
      title: "For gated communities",
      description: "Guest passes, guard review, gate scanning, incidents and a shared blocklist for gated communities in Jamaica.",
    },
    hero: {
      eyebrow: "For gated communities",
      title: "A gate that knows",
      emphasis: "who's expected.",
      lead: "Homeowners register their guests, guards approve them and scan their passes, and every visit is on record, so guards make fewer calls to the house.",
      scene: "audience-gated",
      shot: shot.guestPass,
    },
    challenges: {
      eyebrow: challengesEyebrow,
      title: "Security that depends on phone calls and paper.",
      items: [
        { title: "Every visitor means a call", text: "Guards ring the house to check who's expected, and residents get calls at the worst times." },
        { title: "A logbook nobody can search", text: "When something happens, finding who came in, and when, means paging through handwriting." },
        { title: "Unwanted visitors come back", text: "Without a shared list, a guard on another shift may not know who was turned away before." },
        { title: "Shift changes lose information", text: "What the night guard saw rarely reaches the morning guard in full." },
      ],
    },
    capabilities: {
      eyebrow: capabilitiesEyebrow,
      title: "Guest access and security, built for the gate.",
      lead: "Guards work from a phone or tablet at the gate. Homeowners use the phones they already carry.",
      items: [
        {
          title: "Guests registered before they arrive",
          text: "Homeowners add a visitor's name, phone number, purpose and arrival window. Security approves or denies each request, and the guest gets a QR pass for that visit only.",
          points: ["Passes stop working after the visit", "Guards scan passes with any phone or tablet camera", "Licence barcodes scanned, with only a hashed, masked number kept"],
          link: "/platform/#guest-access",
          linkLabel: "More about guest access",
          layout: "panel-phone",
          shots: [shot.securityReviews, shot.registerVisitor],
        },
        {
          title: "Incidents logged and followed up",
          text: "Guards and residents report what they see, with photos. Managers see what's new and what's urgent, and every report keeps its history.",
          points: ["Severity and status on every report, with a timeline", "Clock-in at the guard's post, with location checks", "Shift handovers the next guard must acknowledge"],
          link: "/platform/#security",
          linkLabel: "More about security operations",
          layout: "single",
          shots: [shot.incidents],
        },
        {
          title: "A blocklist every shift can see",
          text: "Guards suggest a block when someone shouldn't be let in, and managers review and decide. Managers can also suspend a member's guest access.",
          points: ["Guards suggest, managers decide", "One list, shared by every shift", "Each block keeps its reason and history"],
          link: "/platform/#security",
          linkLabel: "More about the blocklist",
          layout: "portrait",
          shots: [shot.guardReview],
        },
      ],
    },
    experience: {
      kind: "guest",
      eyebrow: "How a visit works",
      title: "From invitation to the gate, in three steps.",
      lead: "Step through what the homeowner, the guard and the guest each see.",
    },
    faq: [
      { q: "Do guards need special equipment?", a: "No. Guards use Kaimbrya on a phone or tablet with a camera, which scans guest passes and driver's licence barcodes." },
      { q: "What if a guest doesn't have a smartphone?", a: "Guards can find an expected guest by name and check them in and out by hand. Guards can also admit a walk-up visitor and record how the host confirmed." },
      { q: "What if the signal drops at the gate?", a: "Gate scans are kept on the device and sent when the connection returns, so a brief signal drop doesn't stop the gate." },
      { q: "Can residents see each other's visitors?", a: "No. Homeowners see the visitors registered for their own home." },
      { q: "How is ID information stored?", a: "When a guard scans a licence, Kaimbrya keeps a protected (hashed) form of the number and a masked version for display, such as DL-*****4829, not the number itself." },
      { q: "What happens to a pass after the visit?", a: "It expires. Each pass belongs to one approved visit and stops working soon after the visit ends." },
    ],
    cta: {
      title: "See Kaimbrya at your gate.",
      text: "We'll walk your board and security team through the guest flow, from invitation to the gate.",
    },
  },
  {
    slug: "strata-and-hoas",
    audience: "strata",
    name: "Strata corporations and HOAs",
    faqAudience: "boards and committees",
    meta: {
      title: "For strata corporations and HOAs",
      description: "Fees, arrears, owner records, notices and votes in one place for strata corporations and homeowners' associations in Jamaica.",
    },
    hero: {
      eyebrow: "For strata corporations and HOAs",
      title: "Fees collected, owners informed,",
      emphasis: "decisions on record.",
      lead: "Kaimbrya gives the board and its manager one place for fees, arrears, owner records, notices and votes, and gives every owner a clear view of their own account.",
      scene: "audience-strata",
      shot: shot.payments,
    },
    challenges: {
      eyebrow: challengesEyebrow,
      title: "Running a strata on spreadsheets and goodwill.",
      items: [
        { title: "Fees chased by hand", text: "Matching bank transfers to units and working out who is behind takes hours every month." },
        { title: "Owners who miss notices", text: "Important updates get buried in group chats, and the same questions keep coming back." },
        { title: "Votes only the room can cast", text: "Owners who can't attend a meeting have no simple way to take part." },
        { title: "Records that leave with people", text: "When a treasurer or manager moves on, the history often goes with them." },
      ],
    },
    capabilities: {
      eyebrow: capabilitiesEyebrow,
      title: "One place for the board's everyday work.",
      lead: "Your manager runs it day to day, and the board can see where things stand at any time.",
      items: [
        {
          title: "Collections without the spreadsheet",
          text: "Invoices go out automatically every month. Your team records each bank transfer, or imports the statement, and confirms the match, and rules flag overdue accounts for follow-up.",
          points: ["Owners alerted in the app when an account falls overdue", "Payment plans for owners who need time", "Earlier payments and outstanding charges brought over from paper"],
          link: "/platform/#finance",
          linkLabel: "More about finance",
          layout: "panel-over",
          shots: [shot.payments, shot.overdue],
        },
        {
          title: "Notices owners actually see",
          text: "Post a water interruption or an AGM once, and it reaches every resident in the app, pinned and prioritised.",
          points: ["Categories, priorities and pinned notices", "Sent by email, push or in the app", "Events on a shared calendar, with reminders"],
          link: "/platform/#community",
          linkLabel: "More about communication",
          layout: "panel-phone",
          shots: [shot.announcements, shot.notices],
        },
        {
          title: "Votes every owner can take part in",
          text: "Run votes with anonymous ballots and quorum tracking, and let residents suggest improvements the board can see.",
          points: ["Votes can be scheduled to open later", "A reminder email before each vote closes", "Results counted automatically"],
          link: "/platform/#community",
          linkLabel: "More about votes",
          layout: "panel-over",
          shots: [shot.ideas, shot.vote],
        },
        {
          title: "A record that stays with the community",
          text: "Units, owners and residents in one register, with a history of changes that doesn't leave with any one person.",
          points: ["Property and ownership register", "Sign-ins and key changes on record", "Exports whenever the board needs them"],
          link: "/platform/#administration",
          linkLabel: "More about records",
          layout: "panel-over",
          shots: [shot.dataExport, shot.register],
        },
      ],
    },
    experience: {
      kind: "flow",
      eyebrow: "How a payment works",
      title: "From invoice to confirmed payment.",
      lead: "Owners keep paying the way they already do, by bank transfer. Kaimbrya keeps the record straight.",
      steps: [
        { title: "The invoice goes out", text: "Each unit's monthly invoice is created automatically and appears in the owner's app." },
        { title: "The owner pays and sends proof", text: "The owner pays by bank transfer and uploads proof of payment from their phone." },
        { title: "Your team confirms the match", text: "Staff check the transfer against the bank record and approve it. Nothing changes until they do, and the owner is emailed the decision." },
        { title: "The account updates", text: "The invoice is marked paid, the owner sees their new balance, and they can download a receipt." },
      ],
    },
    faq: [
      { q: "Can owners pay online in Kaimbrya?", a: "Not today. Owners pay by bank transfer, as most communities already do, and send proof of payment in the app. Your team confirms each payment before a balance changes." },
      { q: "Does online voting replace our AGM?", a: "No. Online votes support the meetings and votes your governing documents require. They don't replace them." },
      { q: "Can we bring in our existing balances?", a: "Yes. Earlier payments, opening credits and outstanding charges can be recorded, one by one or from a spreadsheet, when your community moves onto Kaimbrya." },
      { q: "Do owners get receipts?", a: "Yes. Owners can download a PDF receipt for any confirmed payment, and a statement of account for their unit." },
      { q: "Can owners see each other's accounts?", a: "No. Each owner sees only their own invoices, payments and requests." },
    ],
    cta: {
      title: "See Kaimbrya with your board.",
      text: "We'll walk your committee through collections, notices and votes, and answer the questions your owners will ask.",
    },
  },
  {
    slug: "property-managers",
    audience: "managers",
    name: "Property management companies",
    faqAudience: "property managers",
    meta: {
      title: "For property management companies",
      description: "Run Kaimbrya for each community you manage: collections, maintenance, guest access, roles and exports, with each community's records kept separate.",
    },
    hero: {
      eyebrow: "For property management companies",
      title: "Every community you manage,",
      emphasis: "run the same way.",
      lead: "Run Kaimbrya for each community you look after. Each one keeps its own records, residents and settings, and your team works the same way in all of them.",
      scene: "audience-managers",
      shot: shot.managerDashboard,
    },
    challenges: {
      eyebrow: challengesEyebrow,
      title: "Every client, a different way of working.",
      items: [
        { title: "A different system for each client", text: "Each community has its own spreadsheets, logbooks and habits, and your staff have to learn them all." },
        { title: "Boards asking where things stand", text: "Updating each committee on collections and repairs means rebuilding the same report by hand." },
        { title: "Requests by phone and WhatsApp", text: "Residents reach your team on whatever channel they like, and requests slip through." },
        { title: "Knowledge that walks out the door", text: "When a staff member leaves, much of what they knew about each community leaves with them." },
      ],
    },
    capabilities: {
      eyebrow: capabilitiesEyebrow,
      title: "The same tools in every community.",
      lead: "One way of working for every client, so any member of your team can cover any community.",
      items: [
        {
          title: "Collections and arrears for each client",
          text: "Monthly invoices run automatically. Your team records bank transfers or imports the statement, confirms each match, and rules flag overdue accounts for follow-up.",
          points: ["Payment plans for owners who need time", "Overdue accounts exported to CSV for follow-up", "Members, properties and logs exported to CSV, Excel, JSON or PDF"],
          link: "/platform/#finance",
          linkLabel: "More about finance",
          layout: "panel-over",
          shots: [shot.dataExport, shot.overdue],
        },
        {
          title: "Maintenance your team can plan",
          text: "Residents report problems in the app instead of calling. Your team assigns the work, plans the week and repeats regular jobs automatically.",
          points: ["Service requests for a unit or a common area, with photos", "Priorities, assignees and planned dates on every task", "Recurring jobs that create themselves"],
          link: "/platform/#maintenance",
          linkLabel: "More about maintenance",
          layout: "panel-over",
          shots: [shot.maintenance, shot.request],
        },
        {
          title: "The right access for each person",
          text: "Give managers, supervisors, guards and owners the access their role needs, with permissions you can set one by one.",
          points: ["Built-in roles, plus your own custom roles", "Roles approved by an admin; nobody approves their own", "Sign-ins and key changes on record"],
          link: "/platform/#administration",
          linkLabel: "More about roles and records",
          layout: "single",
          shots: [shot.roles],
        },
      ],
    },
    experience: {
      kind: "roles",
      eyebrow: "One system, every role",
      title: "Your staff, the guards and the owners, each with the right view.",
      lead: "Switch roles to see what each person works with.",
      roleOrder: ["manager", "security", "homeowner"],
    },
    faq: [
      { q: "Can we see all our communities in one dashboard?", a: "Not today. Each community runs its own Kaimbrya with its own records, so your team works in each community separately. Ask us about what's planned." },
      { q: "Can each staff member have different access?", a: "Yes. Use the built-in roles or create your own, and switch individual permissions on or off." },
      { q: "Can we export data for our own reports?", a: "Yes. Admins can export members, properties, the guest log, service requests, incidents, violations and inventory to CSV, Excel, JSON or PDF, choosing the columns they need." },
    ],
    cta: {
      title: "See Kaimbrya for the communities you manage.",
      text: "We'll walk your team through collections, maintenance and roles, one community at a time.",
    },
  },
  {
    slug: "developers",
    audience: "developers",
    name: "Residential developers",
    faqAudience: "developers",
    meta: {
      title: "For residential developers",
      description: "Set up every unit, let owners claim their homes and hand over a community with records from day one.",
    },
    hero: {
      eyebrow: "For residential developers",
      title: "Hand over a community",
      emphasis: "that's ready to run.",
      lead: "Set up every unit before the first owner moves in, let owners claim their homes, and hand the board a working system with records from day one.",
      scene: "audience-developers",
      shot: shot.register,
    },
    challenges: {
      eyebrow: challengesEyebrow,
      title: "Handover shouldn't start from nothing.",
      items: [
        { title: "No records at handover", text: "Buyers move in to a community with no fee process, no gate procedure and no register." },
        { title: "Owner details scattered", text: "Contact and unit information sits in sales spreadsheets and email threads." },
        { title: "A new board with no tools", text: "The first committee has to set up collections, notices and security from scratch." },
      ],
    },
    capabilities: {
      eyebrow: capabilitiesEyebrow,
      title: "From the first unit to the first board meeting.",
      lead: "Set the community up while you build, so it's working on the day owners arrive.",
      items: [
        {
          title: "Every unit set up in one go",
          text: "Add a single unit, a numbered range or a development organised in sections, up to 1,000 units at a time, so the register matches the site plan.",
          points: ["Numbered ranges for standard blocks", "Sections for phased or mixed-use developments", "Unit type, use and monthly fee recorded for each home"],
          link: "/platform/#properties",
          linkLabel: "More about properties",
          layout: "single",
          shots: [shot.wizard],
        },
        {
          title: "Owners claim their homes",
          text: "New owners choose their unit when they sign up, and your team approves them, so every owner is linked to the right home.",
          points: ["Every sign-up reviewed by your team", "Owners can add a co-owner, resident or property manager", "Owners see their home, dues and requests in one app"],
          link: "/platform/#properties",
          linkLabel: "More about residents",
          layout: "single",
          shots: [shot.ownerHome],
        },
        {
          title: "Services running before handover",
          text: "Start collections, guest access and service requests while you still manage the site, so the board inherits a working system.",
          points: ["Monthly invoices and proof of payment", "Guest passes and gate scanning", "Service requests and maintenance"],
          link: "/platform/",
          linkLabel: "See the whole platform",
          layout: "panel-phone",
          shots: [shot.payments, shot.ownerPayments],
        },
      ],
    },
    experience: {
      kind: "flow",
      eyebrow: "From site plan to handover",
      title: "Four steps to a community that's ready on day one.",
      lead: "A simple path your sales, site and handover teams can follow.",
      steps: [
        { title: "Set up the units", text: "Add the whole development with the setup wizard: single units, numbered ranges or sections." },
        { title: "Bring owners in", text: "Owners sign up, choose their home, and your team approves each one." },
        { title: "Switch on the services", text: "Start monthly invoices, guest access and service requests before handover." },
        { title: "Hand over to the board", text: "Approve the board's and manager's roles, then revoke your team's. The records stay with the community." },
      ],
    },
    faq: [
      { q: "Can we set up a phased development?", a: "Yes. The setup wizard adds units in numbered ranges or in sections, up to 1,000 at a time, so you can add each phase as it's released." },
      { q: "How do owners get access to their homes?", a: "Owners sign up in the app and choose their unit, and your team approves them before they can see anything." },
      { q: "What happens to our access after handover?", a: "Roles are granted on request and approved by an admin, and an admin can revoke a role at any time, with the reason recorded. Nobody can approve or revoke their own, so the board stays in control of who keeps access." },
    ],
    cta: {
      title: "Plan your handover with us.",
      text: "We'll show your team how to set up the development and what the board inherits.",
    },
  },
];
