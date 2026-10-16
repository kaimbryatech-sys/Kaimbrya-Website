import type { Faq } from "@/components/blocks";

/**
 * Copy for the launch journey, readiness check, board presentation kit and resources pages.
 * Every product claim here is taken from src/content/platform.ts. House rules: no card or online
 * payments (bank transfer plus uploaded proof, and staff confirm every match), no automatic payment
 * reminders, one ballot per eligible owner, one community per Kaimbrya, no durations, and the
 * rollout sentence word for word.
 */

/** The confirmed rollout wording. Use exactly as written. */
export const rolloutSentence = "Kaimbrya is currently being rolled out to a Jamaican residential community comprising more than 190 homes.";

export type Link = { label: string; href: string };

// ── Launch journey (shared by /launch/ and /board-kit/) ─────────────────────
export type JourneyStep = {
  id: string;
  label: string;
  title: string;
  /** One or two sentences, used in the printable board kit. */
  summary: string;
  text: string;
  who: string;
  ready: string[];
  links: Link[];
};

export const journey: JourneyStep[] = [
  {
    id: "consultation",
    label: "Consultation",
    title: "A conversation about your community",
    summary: "We learn how your community runs today, then show your board or team Kaimbrya with demonstration data.",
    text: "We start by listening: how fees are collected, how the gate works, how notices go out and how decisions are made. Then we walk your board or team through Kaimbrya with demonstration data, focused on what matters to you.",
    who: "Your board, committee or management team, with Kaimbrya",
    ready: ["Roughly how many homes you have", "What's working today, and what isn't"],
    links: [{ label: "Take the readiness check", href: "/readiness/" }],
  },
  {
    id: "proposal",
    label: "Proposal",
    title: "A personalized proposal",
    summary: "What's included, your price and the terms, set out in writing. Prices are confirmed in the proposal and a signed agreement.",
    text: "We set out what's included, your price and the terms in a personalized proposal. Prices on this website are indicative; yours is confirmed in the proposal and a signed agreement.",
    who: "Your board or decision-makers",
    ready: ["Property classes, if your development has them", "Who will sign for the community"],
    links: [{ label: "Estimate your price", href: "/pricing/" }],
  },
  {
    id: "setup",
    label: "Community setup",
    title: "Setting up your community",
    summary: "Units go into the property register with the setup wizard, and roles are set up for the board, office, guards and homeowners.",
    text: "Your units go into the property register with the setup wizard: one unit, a numbered range or a development in sections, up to 1,000 units at a time. Roles come next, so the board, the office, the guards and homeowners each see the part that's theirs. Earlier payments, credits and outstanding charges can be brought over from your records.",
    who: "Your office or manager, with Kaimbrya",
    ready: ["Your list of units, sections or phases", "Each unit's current balance or credit"],
    links: [{ label: "About the setup wizard", href: "/platform/#properties" }, { label: "About roles", href: "/platform/#administration" }],
  },
  {
    id: "domain",
    label: "Community domain",
    title: "Your community's domain, set up free",
    summary: "We connect a domain you own, or help you choose and buy a new one. Setup is free; a new domain costs only the registrar's price to buy and renew.",
    text: "Connect a domain you already own, or get help choosing and buying a new one. Setup is free either way. If you need a new domain, you pay only the registrar's price to buy it and to renew it, and we confirm that price with you before anything is bought. The domain belongs to your community.",
    who: "Whoever looks after your community's web address",
    ready: ["Your domain name, if you already have one", "A few name ideas, if you need a new one"],
    links: [{ label: "About community domains", href: "/pricing/#domain" }],
  },
  {
    id: "invitations",
    label: "Resident invitations",
    title: "Inviting residents",
    summary: "Residents hear how to join, sign up, choose their home, and are approved by your staff.",
    text: "When the register and roles are ready, you let residents know how to join, through a notice, a letter or the channels you already use. Each resident signs up, chooses their home and is approved by your staff. Owners can then add a co-owner, resident or property manager, again with staff approval.",
    who: "Your office, and every household",
    ready: ["Up-to-date owner and resident contacts", "A short welcome message from the board"],
    links: [{ label: "Share the homeowner's guide", href: "/resources/#homeowner-guide" }],
  },
  {
    id: "training",
    label: "Training",
    title: "Training for the board, office and guards",
    summary: "Each group learns the part they'll use: collections, payment confirmations, notices and votes for the board and office; visitor reviews, passes and handovers for guards.",
    text: "Each group learns the part of Kaimbrya they'll use. The board and office work through collections, confirming payment matches, notices and votes. Guards practise reviewing visitor requests, scanning guest passes, logging incidents and handing over between shifts.",
    who: "Board members, office staff, guards and supervisors",
    ready: ["Who needs which role", "Guard posts and shift patterns"],
    links: [{ label: "See each role's view", href: "/platform/#roles" }],
  },
  {
    id: "launch",
    label: "Launch and support",
    title: "Launch, and support afterwards",
    summary: "Monthly invoices start, guests get passes at the gate and official notices move into the app. We stay in touch to help your team settle in.",
    text: "Monthly invoices start going out, homeowners register their guests, and official notices move into the app. After launch, we stay in touch to answer questions and help your team settle in.",
    who: "Everyone in the community",
    ready: ["A launch notice for residents", "A named contact for residents' questions"],
    links: [{ label: "Contact our team", href: "/contact/" }],
  },
];

/** What to gather before setup (launch page and the moving-over guide). */
export const gatherList: Array<{ title: string; text: string }> = [
  { title: "Your unit list", text: "Unit numbers, sections or phases, and which homes are occupied." },
  { title: "Owners and residents", text: "Names and contact details, so each person is approved for the right home." },
  { title: "Current balances", text: "What each unit owes or holds in credit, and recent payments." },
  { title: "How owners pay", text: "The bank account owners transfer to, and who checks payments today." },
  { title: "Governing documents", text: "Bylaws, recent minutes and the approved budget, ready for the Library." },
  { title: "How the gate works", text: "Guard posts, shift patterns and your rules for visitors." },
];

export const launch = {
  meta: {
    title: "Your journey to launch",
    description: "Every step from your first conversation with Kaimbrya to launch day: consultation, proposal, community setup, free domain setup, resident invitations, training and support.",
  },
  hero: {
    eyebrow: "Your journey to launch",
    title: "From first conversation",
    emphasis: "to launch day.",
    lead: "Here's every step between your first call with us and the day your community goes live, and what your board, office and guards do along the way.",
  },
  journeyIntro: {
    eyebrow: "Seven steps",
    title: "The journey, step by step.",
    lead: "Every community moves at its own pace. The steps happen in this order, and we plan the timing with you before you commit.",
  },
  rollout: {
    eyebrow: "Rolling out now",
    title: "Kaimbrya in a real community.",
    milestonesTitle: "The milestones every rollout passes",
    milestones: [
      "Units and owners are in the property register",
      "Board, office and security roles are assigned",
      "Residents sign up, choose their homes and are approved",
      "Guards review visitor requests and scan guest passes at the gate",
      "Official notices and documents reach residents in the app",
      "Monthly invoices go out, and the office confirms each payment",
    ],
  },
  gather: {
    eyebrow: "Before you start",
    title: "What to gather.",
    lead: "None of it needs to be perfect. A rough list is enough to start the conversation.",
  },
  faq: [
    { q: "How long does it take to launch?", a: "It depends on your community: how many homes you have, how your records are kept today and how quickly residents sign up. We plan the steps and their timing with you before you commit, so you know what happens when." },
    { q: "Can we bring our existing records?", a: "Yes. Units go into the register with the setup wizard, and earlier payments, credits and outstanding charges can be brought over, so each owner's account starts from the right place." },
    { q: "Will owners be able to pay online or by card?", a: "No. Owners keep paying by bank transfer and upload proof of payment in the app. Your team confirms every match before a balance changes, and the owner is emailed the decision." },
    { q: "Do residents need to download anything?", a: "Residents use the phones they already carry, and Kaimbrya can be installed on a phone like an app. There's nothing to install at the gate: guards scan guest passes with a phone or tablet camera." },
    { q: "What does setting up our domain cost?", a: "Nothing. Domain setup is free, whether you connect a domain you already own or need help buying a new one. If you need a new domain, you pay only the registrar's price to buy it and renew it, and we confirm that price with you first." },
    { q: "Who needs training?", a: "The people who run the community day to day: board members and office staff for collections, notices and votes, and guards and supervisors for the gate. Homeowners can follow our homeowner's guide." },
    { q: "We manage several communities. How does that work?", a: "Each community runs its own Kaimbrya, with its own records and its own subscription, so each one goes through setup separately. There's no combined view across communities today." },
  ] satisfies Faq[],
};

// ── Readiness check ──────────────────────────────────────────────────────────
export type ModuleId = "finance" | "guest-access" | "security" | "properties" | "maintenance" | "community" | "administration";

/** Anchors on /platform/ (the module rows in src/content/platform.ts). */
export const moduleInfo: Record<ModuleId, { title: string; href: string; text: string; accent: string }> = {
  finance: { title: "Finance and collections", href: "/platform/#finance", text: "Monthly invoices, recorded bank transfers your team confirms, receipts and overdue rules.", accent: "#1f5f75" },
  "guest-access": { title: "Guest access", href: "/platform/#guest-access", text: "Visitors registered by homeowners, reviewed by security and admitted with a QR pass.", accent: "#c98a2b" },
  security: { title: "Security operations", href: "/platform/#security", text: "Incident reports, shift handovers, a shared blocklist and resident digital IDs.", accent: "#8a5a12" },
  properties: { title: "Properties and residents", href: "/platform/#properties", text: "One register of units, owners and residents, built with the setup wizard.", accent: "#2f7d57" },
  maintenance: { title: "Maintenance and service", href: "/platform/#maintenance", text: "Service requests with photos, tasks, a weekly plan and recurring jobs.", accent: "#2f7d57" },
  community: { title: "Community life", href: "/platform/#community", text: "Announcements, events, votes, the idea exchange and a document library.", accent: "#2a7591" },
  administration: { title: "Roles and records", href: "/platform/#administration", text: "Roles and permissions, sign-in history, a change log and data exports.", accent: "#15232d" },
};

export const moduleOrder: ModuleId[] = ["finance", "guest-access", "security", "properties", "maintenance", "community", "administration"];

export type Reason = { module: ModuleId; text: string };
export type ChoiceOption = { value: string; label: string; adds: Reason[]; note?: string };
export type ChoiceQuestion = { id: string; kind: "choice"; topic: string; title: string; help?: string; options: ChoiceOption[] };
export type HomesQuestion = { id: "homes"; kind: "homes"; topic: string; title: string; help: string };
export type Question = ChoiceQuestion | HomesQuestion;

export const readiness = {
  meta: {
    title: "Community readiness check",
    description: "Seven short questions about how your community runs today. See which parts of Kaimbrya fit, with an indicative price. Nothing you enter is sent or saved.",
  },
  hero: {
    eyebrow: "Community readiness check",
    title: "Find where Kaimbrya",
    emphasis: "would help first.",
    lead: "Answer seven short questions about how your community runs today. You'll see the parts of Kaimbrya that fit, and an indicative price. Your answers stay in your browser: nothing is sent or saved.",
  },
  /** Recommended for every community: the register and roles everything else is built on. */
  always: [
    { module: "properties", text: "Everything starts from one register of units, owners and residents." },
    { module: "administration", text: "Each person gets only the access their role needs, and key changes are logged." },
  ] satisfies Reason[],
  questions: [
    {
      id: "type",
      kind: "choice",
      topic: "Your community",
      title: "What best describes your community?",
      options: [
        {
          value: "gated", label: "A gated subdivision or gated community",
          adds: [
            { module: "guest-access", text: "Guest passes and guard review give the gate one record of every visit." },
            { module: "security", text: "Guards log incidents, hand over between shifts and share a blocklist." },
          ],
        },
        {
          value: "strata", label: "A strata corporation or homeowners' association",
          adds: [
            { module: "finance", text: "The board can see collections, overdue accounts and each unit's balance at any time." },
            { module: "community", text: "Notices, the document library and owner votes support the committee's work." },
          ],
        },
        {
          value: "developer", label: "A residential development, before or around handover",
          adds: [
            { module: "properties", text: "The setup wizard adds a whole development in sections, up to 1,000 units at a time, and owners claim their homes with staff approval." },
            { module: "administration", text: "Roles are granted on request and approved by an admin, with key changes on record, which helps when the board takes over." },
          ],
        },
        {
          value: "managed", label: "A property management company looking after communities",
          adds: [
            { module: "administration", text: "Built-in and custom roles give each staff member the access their job needs." },
            { module: "maintenance", text: "Tasks, a weekly plan and recurring jobs keep your team's work moving." },
          ],
          note: "Each community runs its own Kaimbrya, with its own records and its own subscription. There's no combined view across communities today.",
        },
      ],
    },
    {
      id: "homes",
      kind: "homes",
      topic: "Number of homes",
      title: "About how many homes are in the community?",
      help: "An approximate number is fine. If you manage several communities, enter the homes in the one you'd start with.",
    },
    {
      id: "fees",
      kind: "choice",
      topic: "Fee collection",
      title: "How are maintenance fees collected today?",
      options: [
        { value: "transfer", label: "Owners pay by bank transfer, and someone checks the statement by hand", adds: [{ module: "finance", text: "Transfers are recorded or imported from a bank statement CSV, with suggested matches your team confirms." }] },
        {
          value: "mixed", label: "A mix of bank transfers, cheques and cash",
          adds: [{ module: "finance", text: "Owners who pay by transfer upload proof from their phones, and your team confirms each payment before a balance changes." }],
          note: "Kaimbrya doesn't take card or online payments. It's built around bank transfers, so we'll talk through how cheques and cash fit your process.",
        },
        { value: "handled", label: "A management company or accountant handles it", adds: [{ module: "finance", text: "Whoever handles collections works from one record of invoices, payments and overdue accounts, and owners get PDF receipts and statements." }] },
        { value: "none", label: "We don't collect fees yet", adds: [{ module: "finance", text: "When you're ready to collect fees, monthly invoices are created automatically for every unit." }] },
      ],
    },
    {
      id: "gate",
      kind: "choice",
      topic: "The gate",
      title: "How are visitors let in at the gate?",
      options: [
        {
          value: "logbook", label: "A guard writes names in a logbook",
          adds: [
            { module: "guest-access", text: "Guest passes and guard review replace the paper logbook, and the guest log can be exported." },
            { module: "security", text: "Guards clock in at their post and hand over properly between shifts." },
          ],
        },
        {
          value: "call", label: "The guard calls the house to check",
          adds: [
            { module: "guest-access", text: "Homeowners register visitors ahead of time, so the guard has the home, the guest and the visit window on one screen." },
            { module: "security", text: "Guards log incidents with photos, and managers see what's new and what's urgent." },
          ],
        },
        { value: "system", label: "We already use a visitor system", adds: [{ module: "guest-access", text: "Kaimbrya's guest passes share one record with your units and residents. We can compare it with your current system in a demo." }] },
        { value: "none", label: "There's no gate or security team", adds: [] },
      ],
    },
    {
      id: "notices",
      kind: "choice",
      topic: "Notices",
      title: "How do notices reach residents today?",
      options: [
        { value: "whatsapp", label: "WhatsApp groups", adds: [{ module: "community", text: "Official notices live in the app, pinned and prioritised, instead of getting buried in a group chat." }] },
        { value: "email", label: "Email", adds: [{ module: "community", text: "Announcements go out by email, push or in-app from one place, and every resident sees the same words." }] },
        { value: "paper", label: "Printed notices or a notice board", adds: [{ module: "community", text: "Notices reach residents' phones, and bylaws, minutes and budgets sit in the document library." }] },
        { value: "mix", label: "A mix of all of these", adds: [{ module: "community", text: "One place for every official notice, sent by email, push or in-app." }] },
      ],
    },
    {
      id: "repairs",
      kind: "choice",
      topic: "Repairs",
      title: "How do residents report repairs and problems?",
      options: [
        { value: "calls", label: "They call or message someone on the board or in the office", adds: [{ module: "maintenance", text: "Residents report problems with photos and follow them until they're fixed, instead of calling around." }] },
        { value: "whatsapp", label: "In a WhatsApp group", adds: [{ module: "maintenance", text: "Requests move out of chat into a tracked list with priorities, assignees and planned dates." }] },
        { value: "paper", label: "On paper, or in a book at the office", adds: [{ module: "maintenance", text: "Requests arrive with photos, and residents get progress updates by email and in the app." }] },
        { value: "system", label: "We already track them in a system", adds: [{ module: "maintenance", text: "Service requests share one record with your units and residents, and recurring jobs create themselves." }] },
      ],
    },
    {
      id: "decisions",
      kind: "choice",
      topic: "Decisions",
      title: "How does the board make decisions with owners?",
      options: [
        { value: "meetings", label: "At general meetings, such as the AGM", adds: [{ module: "community", text: "Owners who can't attend can vote online with anonymous ballots and quorum tracking, alongside the meetings your governing documents require." }] },
        { value: "informal", label: "Informally, with group-chat polls or a show of hands", adds: [{ module: "community", text: "Votes with anonymous ballots, quorum tracking and automatic results give a clearer record than a chat poll." }] },
        { value: "developer", label: "The developer or management company decides for now", adds: [{ module: "community", text: "When a board forms, owner votes and the idea exchange are ready for it." }] },
        { value: "unsure", label: "We're not sure yet", adds: [] },
      ],
    },
  ] satisfies Question[],
  privacy: "Your answers stay in this browser tab. Nothing is sent or saved.",
  votesNote: "Online votes support the meetings and votes your governing documents require. They don't replace them, and each eligible owner gets one ballot.",
};

// ── Board presentation kit ───────────────────────────────────────────────────
export const boardKit = {
  meta: {
    title: "Board presentation kit",
    description: "A printable overview of Kaimbrya to share with your HOA, strata committee or board: what it is, what it solves, pricing, rollout steps, free domain setup and what the board decides.",
  },
  hero: {
    eyebrow: "Board presentation kit",
    title: "Make the case",
    emphasis: "to your board.",
    lead: "Championing Kaimbrya in your community? This kit gives your HOA, strata committee or board the essentials, one page per section. Print it, save it as a PDF or share the link.",
  },
  what: {
    title: "What Kaimbrya is",
    lead: "Kaimbrya is one connected platform for community finances, guest access, security, properties, maintenance and communication, made in Jamaica for the way Jamaican communities work.",
    facts: [
      "The board, the office, the guards and every homeowner each see the part that's theirs.",
      "Homeowners and guards use the phones they already carry. There's nothing to install at the gate.",
      "Owners keep paying by bank transfer and upload proof of payment. There are no card or online payments, and your team confirms every payment match.",
      "Each community runs its own Kaimbrya, so its records stay separate.",
      "Key changes are logged, and your data exports to CSV, Excel, JSON or PDF whenever you need it.",
    ],
  },
  problems: {
    title: "The problems it solves",
    lead: "Most communities run on goodwill, spreadsheets and group chats. Kaimbrya puts the everyday work in one shared record.",
    rows: [
      { today: "Fees tracked in a spreadsheet on someone's laptop", with: "Monthly invoices created automatically, and collections the board can see at any time" },
      { today: "Bank statements checked by hand", with: "Transfers recorded or imported from a bank statement CSV, with suggested matches staff confirm" },
      { today: "A paper logbook at the gate", with: "Visitors registered by homeowners, reviewed by guards and admitted with a QR pass" },
      { today: "Notices buried in WhatsApp groups", with: "Official notices in the app, pinned and prioritised, with documents in the library" },
      { today: "Repair requests lost in messages", with: "Service requests with photos, tracked until they're done" },
      { today: "Votes only the room can cast", with: "Owner votes with anonymous ballots and quorum tracking, alongside your meetings" },
      { today: "Records that leave with a volunteer", with: "One register and a change log that stay with the community" },
    ],
  },
  modulesTitle: "What's inside",
  pricing: {
    title: "What it costs",
    examples: [50, 190, 500],
  },
  rolloutTitle: "How it would roll out",
  domain: {
    title: "Your community's own domain",
    lead: "Kaimbrya can give your community its own web address. Setting it up is free.",
    points: [
      "Already have a domain? We help you connect it, free.",
      "Need a new one? We help you choose, buy and set it up at no additional charge.",
      "You pay only the registrar's price to buy a new domain and renew it each year. We confirm that price before anything is bought.",
      "The domain belongs to your community.",
    ],
  },
  decisions: {
    title: "What the board decides",
    lead: "Bringing Kaimbrya in is a board decision. These are the questions to settle together.",
    items: [
      { title: "Whether to see a demonstration", text: "and who should attend: the board, the office, a security lead." },
      { title: "Where to start", text: "collections, the gate, notices, repairs or votes, and in what order." },
      { title: "Who runs it day to day", text: "board members, office staff or a management company, and which role each person gets." },
      { title: "How owners pay", text: "the bank account owners transfer to, and who confirms payment matches." },
      { title: "Your domain", text: "connect one you already own, or buy a new one at the registrar's price." },
      { title: "How to tell residents", text: "the welcome message, and who answers residents' questions." },
      { title: "The proposal and agreement", text: "who reviews the proposal, and who signs for the community." },
    ],
    note: "Decisions your governing documents reserve for owners still follow your usual process.",
  },
  next: {
    title: "Next steps",
    steps: [
      { title: "Book a demo for the board", text: "We'll walk your board through the parts that matter most to you.", href: "/demo/" },
      { title: "Take the readiness check", text: "Seven questions that show where Kaimbrya would help first.", href: "/readiness/" },
      { title: "Request a quote", text: "Get a personalized proposal for your community.", href: "/pricing/#quote" },
      { title: "Read the launch journey", text: "Every step from first conversation to launch day.", href: "/launch/" },
    ],
  },
};

// ── Resources ────────────────────────────────────────────────────────────────
export type GuideBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: Array<{ title: string; text: string }> }
  | { kind: "note"; title: string; text: string }
  | { kind: "gather" };

export type Guide = { id: string; eyebrow: string; title: string; summary: string; blocks: GuideBlock[]; related: Link[] };

export const resources = {
  meta: {
    title: "Resources",
    description: "Short guides for Jamaican communities: strata and gated subdivisions, getting started as a homeowner, running a fair community vote, and moving off spreadsheets and WhatsApp groups.",
  },
  hero: {
    eyebrow: "Resources",
    title: "Guides for boards",
    emphasis: "and homeowners.",
    lead: "Short, practical reading for the people who run Jamaican communities and the people who live in them.",
  },
  guides: [
    {
      id: "strata-and-gated",
      eyebrow: "For boards · General information",
      title: "Gated subdivisions and strata in Jamaica: what's different",
      summary: "Two common ways residential communities are organised, and why the difference matters when you set fees, hold votes or sign contracts.",
      blocks: [
        { kind: "note", title: "General information, not legal advice", text: "Your community's own documents and the law decide how it must be run. For advice on your situation, speak to an attorney-at-law or another qualified professional." },
        { kind: "h", text: "Strata corporations" },
        { kind: "p", text: "Many apartment buildings, townhouse complexes and some housing developments in Jamaica are strata schemes, registered under the Registration (Strata Titles) Act. Each owner holds title to their own strata lot, and the common property, such as shared driveways, gardens and amenities, belongs to the owners together." },
        { kind: "p", text: "When the strata plan is registered, a strata corporation comes into being, and its members are the owners of the lots. The corporation looks after the common property, collects contributions from owners (often called maintenance fees) and follows its bylaws. An executive committee chosen by the owners usually handles day-to-day decisions." },
        { kind: "h", text: "Gated subdivisions" },
        { kind: "p", text: "Many gated communities are subdivisions instead: each owner holds a separate title to their lot, and there's no strata plan. Shared roads, gates, security and amenities are often run by a company, such as one formed by the developer or by residents, or by a citizens' or residents' association." },
        { kind: "p", text: "In a subdivision, fees and rules come from whichever documents apply to the community, for example covenants on the titles, a company's articles, or a membership agreement. Whether every owner must pay, and what can be done about arrears, depends on those documents." },
        { kind: "h", text: "Why the difference matters" },
        { kind: "list", items: [
          "Who is entitled to vote, and how votes are counted",
          "How fees are set, and what can be done about arrears",
          "Who can sign contracts for the community, for security, maintenance or software",
          "How owners must be told about meetings and decisions",
        ] },
        { kind: "p", text: "If you're unsure which model applies, or what your documents allow, take professional advice before you change how fees are collected or decisions are made." },
        { kind: "h", text: "How Kaimbrya fits either model" },
        { kind: "p", text: "Kaimbrya doesn't change your legal structure. It gives either kind of community the same tools: a register of units and owners, monthly invoices, bank transfers your team records and confirms, notices, votes and a document library. Your rules decide how you use them. For example, Kaimbrya gives one ballot to each eligible owner, so check how that fits your bylaws before you rely on an online vote for a formal decision." },
      ],
      related: [{ label: "For strata corporations and HOAs", href: "/solutions/strata-and-hoas/" }, { label: "For gated communities", href: "/solutions/gated-communities/" }],
    },
    {
      id: "homeowner-guide",
      eyebrow: "For homeowners",
      title: "A homeowner's guide to getting started with Kaimbrya",
      summary: "Six things to know as you get started, from registering your home to voting.",
      blocks: [
        { kind: "steps", items: [
          { title: "Register and choose your home", text: "Sign up using the details your community shares, then choose your unit. Staff at your community approve your request. If you share the home, you can add a co-owner, resident or property manager, and staff approve them too. You can install Kaimbrya on your phone like an app." },
          { title: "Pay by bank transfer and upload your proof", text: "Your invoice appears in the app each month. Pay by bank transfer as usual, to the account your community gives you, then upload your proof of payment from your phone. The office checks it against the bank record and confirms it, and you're emailed the decision. Once it's confirmed, your balance updates and you can download a PDF receipt." },
          { title: "Register your guests", text: "Enter your guest's name, phone number, purpose and arrival window, for a short visit or a stay of up to 30 days. Security reviews the request, and your guest gets a QR pass that works only for that visit. You're told when your guest arrives and leaves." },
          { title: "Report a repair", text: "Report a problem at your home or in a shared area, and add photos. Follow its progress in the app, with updates by email and in the app until it's fixed." },
          { title: "Read notices and documents", text: "Announcements appear in the app, with important ones pinned at the top. Bylaws, minutes and budgets the board shares sit in the Library, ready to open or download." },
          { title: "Vote and share ideas", text: "When the board opens a vote, each eligible owner casts one anonymous ballot. You can also suggest improvements and support other residents' ideas." },
        ] },
        { kind: "note", title: "Kaimbrya doesn't take card or online payments", text: "You always pay by bank transfer, and your community's office confirms each payment. If you can't see your home or an invoice, contact the office: they manage access and confirm payments." },
      ],
      related: [{ label: "How guest access works", href: "/platform/#guest-access" }, { label: "How payments are recorded", href: "/platform/#finance" }],
    },
    {
      id: "fair-vote",
      eyebrow: "For boards",
      title: "Running a fair community vote",
      summary: "Five steps to a vote owners can trust, whether it's on the budget, a project or a rule change.",
      blocks: [
        { kind: "p", text: "Online votes help owners take part when they can't get to a meeting. They support the meetings and votes your governing documents require; they don't replace them." },
        { kind: "steps", items: [
          { title: "Start with your rules", text: "Check your bylaws or governing documents: who is entitled to vote, what quorum is needed, how much notice owners must get, and whether the decision has to be made at a general meeting. Kaimbrya gives one ballot to each eligible owner. If your rules count votes per lot or by unit entitlement, make sure an online vote fits before you rely on it." },
          { title: "Share the facts first", text: "Post an announcement that explains what's being decided and why. Put the supporting papers, such as the budget or a contractor's quote, in the Library, so every owner reads the same thing." },
          { title: "Ask one clear question", text: "Decide one thing per vote, word it neutrally, and offer options that don't overlap. Say when the vote opens and when it closes." },
          { title: "Schedule it and let it run", text: "Votes can be scheduled to open later, so owners have time to read the papers. Ballots are anonymous, and quorum tracking shows whether enough owners have taken part. Keep the vote open long enough for owners who travel or work shifts." },
          { title: "Publish the result", text: "Results are calculated automatically when the vote closes. Share the outcome in an announcement, and keep the record with your minutes in the Library." },
        ] },
        { kind: "note", title: "From ideas to votes", text: "Residents can suggest improvements in the idea exchange and support each other's ideas. Ideas the board selects can become a vote." },
      ],
      related: [{ label: "Votes and the idea exchange", href: "/communication/" }, { label: "Community life on the platform", href: "/platform/#community" }],
    },
    {
      id: "moving-over",
      eyebrow: "For boards and managers",
      title: "Moving from spreadsheets and WhatsApp groups",
      summary: "You don't have to switch everything at once, and you don't have to close your WhatsApp group. Here's one way to make the move.",
      blocks: [
        { kind: "steps", items: [
          { title: "Build your register", text: "Start with a clean list of units and owners. The setup wizard adds one unit, a numbered range or a development in sections, up to 1,000 units at a time." },
          { title: "Bring your balances across", text: "Earlier payments, credits and outstanding charges can be brought over, so each owner's account starts from the right place. Reconcile your spreadsheet first, so old errors don't come with it." },
          { title: "Keep WhatsApp for chat", text: "Residents can keep chatting wherever they like. Post official notices in Kaimbrya and point people there, so there's one place to check what the board actually said." },
          { title: "Retire the logbook", text: "Homeowners register guests, security reviews each request, and the guest shows a QR pass at the gate, so every visit is on record and the guest log can be exported." },
          { title: "Move repairs out of chat", text: "Residents report problems with photos, your team assigns and plans the work, and everyone can see progress until it's done." },
          { title: "Keep your data portable", text: "Members, properties, the guest log, requests, incidents and violations export to CSV, Excel, JSON or PDF whenever the board needs them." },
        ] },
        { kind: "h", text: "What to gather before you start" },
        { kind: "gather" },
      ],
      related: [{ label: "Your journey to launch", href: "/launch/" }, { label: "Roles and records", href: "/platform/#administration" }],
    },
  ] satisfies Guide[],
};
