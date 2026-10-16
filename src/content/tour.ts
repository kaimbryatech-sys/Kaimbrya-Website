/**
 * "Explore Kaimbrya" (/tour/): an interactive tour with fictional sample data from the
 * Mahoe Ridge demo community. Every capability shown here appears on /platform/
 * (src/content/platform.ts). Claim rules that apply here: no card or online payments
 * (owners pay by bank transfer and upload proof); matches are suggested by reference and
 * staff confirm every one; invoices are created automatically on the 25th; no automatic
 * payment reminders; one ballot per eligible owner, not per unit.
 */

export type DemoId = "guests" | "finance" | "maintenance" | "governance";
export type Role = "homeowner" | "security" | "staff" | "guest";

export type DemoStep = {
  id: string;
  title: string;
  /** One line: what happens, and why it matters. */
  text: string;
  /** Whose screen the mock shows. */
  actor: string;
  role: Role;
};

export type Workflow = { id: DemoId; tab: string; title: string; lead: string; steps: DemoStep[] };

export type Hotspot = {
  id: string;
  /** The module it opens (bold in the label). */
  module: string;
  /** The place on the map. */
  place: string;
  demo: DemoId;
  step: number;
  /** World point in metres (src/story/scene.ts), projected onto the illustration at build time. */
  world: [number, number, number];
  /** Which side of the pin the label sits on, so labels stay inside the picture. */
  side: "left" | "right";
  icon: "gate" | "receipt" | "wrench" | "megaphone" | "doc";
};

export type DayEvent = { module: string; who: string; text: string };
export type DayTime = {
  id: string;
  time: string;
  short: string;
  title: string;
  tone: "dawn" | "morning" | "noon" | "afternoon" | "evening" | "night";
  /** Sun (or moon) position across the sky band, in percent. */
  sun: [number, number];
  events: DayEvent[];
  demo: DemoId;
  demoLabel: string;
};

export const sample = {
  community: "Mahoe Ridge",
  owner: "Andrea Campbell",
  ownerFirst: "Andrea",
  lot: "Lot 23",
  guest: "Shanice Walters",
  guestFirst: "Shanice",
  fee: "JMD 18,500.00",
  label: "Sample data. Fictional community.",
};

export const tour = {
  meta: {
    title: "Explore Kaimbrya",
    description:
      "Try Kaimbrya in your browser: register a guest, follow a bank-transfer payment to its receipt, track a repair and take part in a community vote, with sample data from a fictional community.",
  },
  hero: {
    eyebrow: "Product tour",
    title: "Explore a living community,",
    emphasis: "run on Kaimbrya.",
    lead: "Mahoe Ridge is a fictional gated community. Choose a place on the map to see how Kaimbrya handles guests, fees, repairs and decisions, step by step, right in your browser.",
    primary: { label: "Start the guided demo", href: "#guided-demo" },
    secondary: { label: "Book a demo", href: "/demo/" },
  },
  map: {
    alt: "Illustration of Mahoe Ridge, a fictional gated community: a gatehouse with a car waiting at the barrier, a main road lined with homes, Andrea Campbell's home at Lot 23 and a small park where neighbours walk.",
    hint: "Opens the matching demo below.",
    note: "Nothing you do on this page is saved or sent.",
    hotspots: [
      { id: "gate", module: "Guest access", place: "The gate", demo: "guests", step: 0, world: [-59, 10.5, 3.2], side: "right", icon: "gate" },
      { id: "library", module: "Library", place: "Budget 2027", demo: "governance", step: 1, world: [-12, 27.5, 5.6], side: "left", icon: "doc" },
      { id: "home", module: "Finance", place: "Lot 23, Andrea's home", demo: "finance", step: 0, world: [6, 3.5, 6.6], side: "right", icon: "receipt" },
      { id: "house", module: "Maintenance", place: "Homes and common areas", demo: "maintenance", step: 0, world: [42, 3.5, 5.4], side: "right", icon: "wrench" },
      { id: "green", module: "Notices and votes", place: "The community green", demo: "governance", step: 0, world: [51, 30, 0.4], side: "right", icon: "megaphone" },
    ] satisfies Hotspot[],
  },
  demo: {
    eyebrow: "Guided demo",
    title: "Four everyday jobs. Try each one.",
    lead: "Pick a workflow and click through it. Each step shows who does what, and what everyone else sees.",
  },
  workflows: [
    {
      id: "guests",
      tab: "Guest access",
      title: "A guest, expected and on record",
      lead: "Andrea invites a friend for lunch. Security approves the visit, the gate scans the pass, and Andrea knows when her guest arrives.",
      steps: [
        { id: "register", title: "Andrea registers her guest", text: "From her phone, she adds Shanice Walters and an arrival window. No call to the gate.", actor: "Andrea's phone", role: "homeowner" },
        { id: "review", title: "Security approves the visit", text: "The guard sees the home, the guest and the visit window on one screen, then approves.", actor: "Gate tablet", role: "security" },
        { id: "pass", title: "Shanice gets a QR pass", text: "The pass works only for this visit and expires after it.", actor: "Shanice's phone", role: "guest" },
        { id: "scan", title: "The guard scans the pass", text: "Any phone or tablet camera reads the pass, and the arrival goes on record.", actor: "Gate tablet", role: "security" },
        { id: "arrived", title: "Andrea knows she's arrived", text: "A notification tells her Shanice is through the gate. She'll be told when Shanice leaves, too.", actor: "Andrea's phone", role: "homeowner" },
      ],
    },
    {
      id: "finance",
      tab: "Finance",
      title: "From invoice to receipt, with every match confirmed",
      lead: "Lot 23's monthly fee, paid by bank transfer. There are no card payments: owners pay at their bank and upload proof.",
      steps: [
        { id: "invoice", title: "The monthly invoice arrives", text: "Kaimbrya creates every owner's invoice automatically on the 25th of the month.", actor: "Andrea's phone", role: "homeowner" },
        { id: "proof", title: "Andrea pays and uploads proof", text: "She pays by bank transfer at her bank, then uploads the transfer confirmation from her phone.", actor: "Andrea's phone", role: "homeowner" },
        { id: "match", title: "Staff confirm the match", text: "Kaimbrya suggests a match by reference. A staff member checks it and confirms, and nothing changes until they do.", actor: "Management office", role: "staff" },
        { id: "balance", title: "The balance updates", text: "Andrea's balance drops to JMD 0.00, and she's emailed the decision.", actor: "Andrea's phone", role: "homeowner" },
        { id: "receipt", title: "A PDF receipt is ready", text: "Her receipt and statement of account stay in the app for whenever she needs them.", actor: "Andrea's phone", role: "homeowner" },
      ],
    },
    {
      id: "maintenance",
      tab: "Maintenance",
      title: "A repair, reported and tracked until it's done",
      lead: "Andrea's outside tap is leaking. She reports it in seconds and follows it until it's fixed.",
      steps: [
        { id: "report", title: "Andrea reports the problem", text: "She describes it, adds a photo and sends it from her phone.", actor: "Andrea's phone", role: "homeowner" },
        { id: "assign", title: "The manager assigns the work", text: "The request becomes a task with an assignee, a priority and a planned date.", actor: "Management office", role: "staff" },
        { id: "progress", title: "Work starts", text: "The status moves from Open to In progress, and Andrea is told in the app and by email.", actor: "Andrea's phone", role: "homeowner" },
        { id: "done", title: "The job is completed", text: "Andrea sees her request marked Completed, with the team's note.", actor: "Andrea's phone", role: "homeowner" },
      ],
    },
    {
      id: "governance",
      tab: "Governance",
      title: "Announcements, documents, ideas and votes",
      lead: "The board proposes the 2027 budget. Owners read it, back ideas and vote online, with one ballot per eligible owner.",
      steps: [
        { id: "announce", title: "The board posts an announcement", text: "A pinned, high-priority notice reaches every resident in the app, and by push or email if the board chooses.", actor: "Management office", role: "staff" },
        { id: "library", title: "The budget goes in the Library", text: "The proposed budget is shared with every homeowner, and they're told it's there.", actor: "Management office", role: "staff" },
        { id: "idea", title: "Owners back an idea", text: "A neighbour suggests solar lights for the park path. Andrea adds her support, and the board can see it.", actor: "Andrea's phone", role: "homeowner" },
        { id: "vote", title: "Owners vote on the budget", text: "Ballots are anonymous, with one ballot per eligible owner, not one per unit.", actor: "Andrea's phone", role: "homeowner" },
        { id: "results", title: "Results are calculated automatically", text: "When the vote closes, Kaimbrya checks the quorum and counts the ballots.", actor: "Management office", role: "staff" },
      ],
    },
  ] satisfies Workflow[],
  day: {
    eyebrow: "A day in the community",
    title: "One day at Mahoe Ridge.",
    lead: "Choose a time to see what's happening at the gate, in the office and at home.",
    times: [
      {
        id: "0600", time: "6:00 AM", short: "6 AM", tone: "dawn", sun: [8, 78], title: "The morning shift takes the gate",
        events: [
          { module: "Security", who: "Guard", text: "Kezia clocks in at the gatehouse, where her location is checked." },
          { module: "Security", who: "Guard", text: "She reads the night guard's handover and acknowledges it before she takes over." },
          { module: "Guest access", who: "Security", text: "Today's approved visitors are already listed, including Shanice Walters for Lot 23 this afternoon." },
        ],
        demo: "guests", demoLabel: "Try the guest access demo",
      },
      {
        id: "0900", time: "9:00 AM", short: "9 AM", tone: "morning", sun: [27, 40], title: "A payment confirmed",
        events: [
          { module: "Finance", who: "Office", text: "Staff import the bank statement. Kaimbrya suggests a match by reference for a JMD 18,500 transfer from Lot 23." },
          { module: "Finance", who: "Office", text: "Andrea has already uploaded her proof of payment. A staff member checks it and confirms the match." },
          { module: "Finance", who: "Homeowner", text: "Andrea's balance drops to JMD 0.00, she's emailed the decision, and her PDF receipt is ready." },
        ],
        demo: "finance", demoLabel: "Try the finance demo",
      },
      {
        id: "1200", time: "12:00 PM", short: "12 PM", tone: "noon", sun: [50, 18], title: "A repair, assigned by lunchtime",
        events: [
          { module: "Maintenance", who: "Homeowner", text: "Andrea reports a leaking outside tap, with a photo, from her phone." },
          { module: "Maintenance", who: "Manager", text: "The manager assigns it to Devon on the maintenance team and sets a planned date." },
          { module: "Maintenance", who: "Homeowner", text: "Andrea is told in the app and by email when the work moves to In progress." },
        ],
        demo: "maintenance", demoLabel: "Try the maintenance demo",
      },
      {
        id: "1500", time: "3:00 PM", short: "3 PM", tone: "afternoon", sun: [73, 40], title: "Guests and a delivery at the gate",
        events: [
          { module: "Guest access", who: "Guard", text: "Shanice Walters shows her QR pass. The guard scans it with the gate tablet's camera and she's checked in." },
          { module: "Guest access", who: "Homeowner", text: "Andrea gets a notification that her guest has arrived." },
          { module: "Guest access", who: "Guard", text: "A courier Andrea registered as a visitor is found by name on the expected list and checked in by hand." },
        ],
        demo: "guests", demoLabel: "Try the guest access demo",
      },
      {
        id: "1800", time: "6:00 PM", short: "6 PM", tone: "evening", sun: [92, 78], title: "Ideas, and a meeting on the calendar",
        events: [
          { module: "Idea exchange", who: "Residents", text: "A resident suggests solar lights for the park path, and neighbours comment and add their support." },
          { module: "Idea exchange", who: "Board", text: "The board selects the idea, so it can become a vote." },
          { module: "Events", who: "Everyone", text: "Owners get an automatic reminder for the AGM on the shared calendar." },
        ],
        demo: "governance", demoLabel: "Try the governance demo",
      },
      {
        id: "2100", time: "9:00 PM", short: "9 PM", tone: "night", sun: [80, 26], title: "The night log",
        events: [
          { module: "Security", who: "Guard", text: "The evening guard logs an incident, a car blocking a neighbour's driveway, with a photo and a severity." },
          { module: "Security", who: "Guard", text: "She writes a handover the night guard must acknowledge before taking over." },
          { module: "Guest access", who: "Manager", text: "Every visit today, from Shanice's lunch to the courier, is in the searchable guest log." },
        ],
        demo: "guests", demoLabel: "Try the guest access demo",
      },
    ] satisfies DayTime[],
  },
  faq: [
    { q: "Is this the real Kaimbrya app?", a: "No. It's a simplified, interactive sample made for this website, with a fictional community and fictional people. The real app's screens look different in places. Book a demo to see the real app with demonstration data." },
    { q: "Is anything I do here saved or sent?", a: "No. The tour runs entirely in your browser. There's no account to create, and nothing you click is stored or sent anywhere." },
    { q: "Can owners pay by card in Kaimbrya?", a: "No. Owners pay by bank transfer and upload proof of payment. Your team records or imports the transfer, Kaimbrya suggests a match by reference, and a staff member confirms it before any balance changes." },
    { q: "Do online votes replace our general meetings?", a: "No. Online votes support the meetings and votes your governing documents require; they don't replace them. Each eligible owner gets one ballot, and results are calculated once the vote closes." },
  ],
  cta: {
    title: "See the real app with your community in mind.",
    text: "We'll walk your board or team through Kaimbrya with demonstration data, focused on the parts that matter most to you.",
    primary: { label: "Book a demo", href: "/demo/" },
    secondary: { label: "See pricing", href: "/pricing/" },
  },
};
