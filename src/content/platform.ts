import type { CompositionLayout, Shot } from "@/components/blocks";

/**
 * Platform overview copy. Every capability listed here was checked against the app's code
 * (see "Product facts" in the website specification and assets/screens/RECORD.md).
 */

export type ModuleGroup = { id: string; title: string; text: string; items: string[]; accent: string };
export type ModuleSection = { id: string; eyebrow: string; title: string; text: string; points: string[]; layout: CompositionLayout; shots: Shot[] };

export const platform = {
  meta: {
    description:
      "Kaimbrya brings community finances, guest access, security, properties, maintenance and communication into one connected platform, with the right view for every role.",
  },
  hero: {
    eyebrow: "Platform",
    title: "Everything your community runs on,",
    emphasis: "in one place.",
    lead: "Collections, guest access, security, properties, maintenance and communication share one system, with the right view for every role.",
    shots: [
      { name: "manager-dashboard", device: "desktop", alt: "The Kaimbrya home screen for a manager, with every module in the sidebar", sizes: "(min-width: 1024px) 840px, 92vw" },
      { name: "owner-home", device: "phone", alt: "The Kaimbrya home screen on a homeowner's phone", sizes: "(min-width: 640px) 250px, 240px" },
    ] satisfies Shot[],
  },
  index: {
    eyebrow: "What's inside",
    title: "Five areas, one record.",
    lead: "Each area works on its own, and they all share the same units, people and history.",
    groups: [
      { id: "finance", title: "Finance", text: "Fees, payments and arrears.", items: ["Monthly invoices", "Recorded payments", "Statement import", "Proof of payment", "Receipts and statements", "Account credits", "Overdue rules", "Payment plans"], accent: "#1f5f75" },
      { id: "guest-access", title: "Access and security", text: "The gate and the people who run it.", items: ["Guest passes", "Gate scanning", "Licence scanning", "Digital ID", "Shifts and handovers", "Incidents", "Blocklist", "Violations"], accent: "#c98a2b" },
      { id: "properties", title: "Property and service", text: "Every unit, and the work that keeps it running.", items: ["Property register", "Resident approvals", "Setup wizard", "Ownership transfers", "Service requests", "Maintenance tasks", "Recurring jobs", "Inventory"], accent: "#2f7d57" },
      { id: "community", title: "Community life", text: "Keeping residents informed and involved.", items: ["Announcements", "Events", "Votes", "Idea exchange", "Amenity bookings", "Library", "Yard sale", "Donations"], accent: "#2a7591" },
      { id: "administration", title: "Roles and records", text: "Who can do what, and a record of what was done.", items: ["Roles and permissions", "Role requests", "Sign-in history", "Change log", "Data export", "Notifications"], accent: "#15232d" },
    ] satisfies ModuleGroup[],
  },
  modules: [
    {
      id: "finance",
      eyebrow: "Finance",
      title: "Collections the board can see at any time.",
      text: "Invoices go out on their own every month. When an owner pays by bank transfer, your team records it, or imports the bank statement, and confirms the match. Balances change only once they do.",
      points: [
        "Monthly invoices created automatically, with credit applied and earlier balances carried forward",
        "Transfers recorded or imported from a bank statement CSV, with suggested matches your team confirms",
        "Owners upload proof of payment and are emailed the decision",
        "PDF receipts and statements of account",
        "Overdue rules, payment plans, formal notices and CSV export",
        "Earlier payments, credits and outstanding charges brought over when you move from paper",
      ],
      layout: "panel-over-phone",
      shots: [
        { name: "payments-overview", device: "panel", alt: "Kaimbrya Payments Center: total outstanding, pending review and overdue invoices" },
        { name: "overdue-accounts", device: "panel", alt: "Overdue accounts in Kaimbrya, with outstanding amounts and last payment dates" },
        { name: "owner-payments", device: "phone", alt: "A homeowner's Payments Center on a phone, with a Proof of Payment button", sizes: "(min-width: 640px) 180px, 240px" },
      ],
    },
    {
      id: "guest-access",
      eyebrow: "Guest access",
      title: "Visitors expected, approved and on record.",
      text: "Homeowners register visitors from their phones. Security reviews each request, and the guest gets a QR pass that works only for that visit.",
      points: [
        "Visits for one or more guests, from an afternoon to a stay of up to 30 days",
        "Guards approve or deny, with the home and visit window on one screen",
        "QR passes that expire after the visit, scanned with any phone or tablet camera",
        "Expected guests found by name and checked in by hand when needed",
        "Hosts told when their guest arrives and leaves, and when a stay runs over",
        "Licence barcodes scanned, with only a hashed, masked number stored",
      ],
      layout: "phones",
      shots: [
        { name: "owner-register-visitor", device: "phone", alt: "The Register New Visitor form on a homeowner's phone", sizes: "(min-width: 640px) 220px, 240px" },
        { name: "guest-pass", device: "phone", alt: "A guest's QR pass on a phone, marked Approved for entry", sizes: "(min-width: 640px) 220px, 240px" },
      ],
    },
    {
      id: "security",
      eyebrow: "Security operations",
      title: "Incidents, shifts and the blocklist, in one place.",
      text: "Guards and residents report what they see. Managers know what's new and what's urgent, every shift hands over properly, and residents carry a digital ID the gate can scan.",
      points: [
        "Incident reports with severity, status, photos and a timeline",
        "Clock-in at the guard's post, with location checks",
        "Shift handovers the next guard must acknowledge",
        "A shared blocklist: guards suggest, managers decide",
        "Rotating QR digital IDs for residents, scanned at the gate",
        "Violations recorded against a unit, with evidence, reminders and appeals",
      ],
      layout: "panel-over",
      shots: [
        { name: "incidents-queue", device: "panel", alt: "Kaimbrya incidents: new, urgent, on hold and open counts, and the incident list" },
        { name: "security-reviews", device: "panel", alt: "Pending visitor reviews for security, with Scan ID and Register Visitor buttons" },
      ],
    },
    {
      id: "properties",
      eyebrow: "Properties and residents",
      title: "Every unit, owner and resident in one live register.",
      text: "Know who owns each unit, who lives there and whether it's occupied. New residents choose their home when they sign up, and staff approve them.",
      points: [
        "Ownership, residency and occupancy for every unit",
        "Owners can add a co-owner, resident or property manager, with staff approval",
        "A setup wizard: one unit, a numbered range or sections, up to 1,000 units at a time",
        "Ownership transfers handled by staff, with a full history and CSV export",
      ],
      layout: "panel-over",
      shots: [
        { name: "setup-wizard", device: "panel", alt: "The Kaimbrya property setup wizard: batch ranges and developments organised in sections" },
        { name: "property-register", device: "panel", alt: "Kaimbrya property register: property, occupied, vacant and pending counts with the unit list" },
      ],
    },
    {
      id: "maintenance",
      eyebrow: "Maintenance and service",
      title: "Problems reported in seconds. Work tracked until it's done.",
      text: "Residents report problems at home or in shared areas. Your team assigns the work, plans the week and repeats regular jobs, and residents follow their request until it's fixed.",
      points: [
        "Service requests for a unit or a common area, with photos",
        "Progress updates to residents by email and in the app",
        "Tasks with priorities, assignees and planned dates",
        "A weekly plan, and recurring jobs that create themselves",
        "Insights into open, blocked and finished work",
        "Supplies tracked across storerooms, with reorder points and vendors",
      ],
      layout: "panel-over",
      shots: [
        { name: "maintenance-tasks", device: "panel", alt: "Kaimbrya maintenance tasks with counts by status and a prioritised task list" },
        { name: "owner-request-card", device: "panel", alt: "A homeowner's service request, in progress" },
      ],
    },
    {
      id: "community",
      eyebrow: "Community life",
      title: "Residents informed, involved and heard.",
      text: "Post a notice once and every resident sees it in the app. Owners vote online, suggest improvements and book shared spaces, all in the same place.",
      points: [
        "Announcements with categories, priorities and pinning, sent by email, push or in-app",
        "Events on a shared calendar, with automatic reminders",
        "Owner votes with anonymous ballots, quorum tracking, scheduled opening and automatic results",
        "An idea exchange where residents discuss and support suggestions, and good ideas can become votes",
        "Amenity bookings with opening hours, approvals, fees and deposits",
        "A document library, a yard sale for residents and donation drives",
      ],
      layout: "panel-over-phone",
      shots: [
        { name: "announcements-table", device: "panel", alt: "Kaimbrya announcements for managers: category, priority and author" },
        { name: "vote-card", device: "panel", alt: "A Kaimbrya vote on the 2027 budget, anonymous, with 50% quorum" },
        { name: "owner-notices", device: "phone", alt: "Announcements on a homeowner's phone", sizes: "(min-width: 640px) 180px, 240px" },
      ],
    },
    {
      id: "administration",
      eyebrow: "Roles and records",
      title: "The right access for everyone, and a record of what was done.",
      text: "Give managers, guards, supervisors and homeowners exactly the access their role needs. Key changes are logged, and your data exports whenever you need it.",
      points: [
        "Built-in roles plus custom roles, with permissions switched on one by one",
        "Roles granted on request and approved by an admin; nobody approves their own",
        "Every sign-in recorded, and key changes logged with who and when",
        "Exports of members, properties, the guest log, requests, incidents and violations to CSV, Excel, JSON or PDF",
        "Notifications by email, push and in-app, and an app you can install on a phone",
        "Each community runs its own Kaimbrya, so its records stay separate",
      ],
      layout: "panel-over",
      shots: [
        { name: "data-export", device: "panel", alt: "The Kaimbrya Data Export Center with members, properties, guest log, requests, incidents and violations" },
        { name: "roles-permissions", device: "panel", alt: "Kaimbrya access control: roles, and the permissions for a Security Supervisor role" },
      ],
    },
  ] satisfies ModuleSection[],
  rolesIntro: {
    eyebrow: "One system, every role",
    title: "Each person sees the part that's theirs.",
  },
  cta: {
    title: "See the whole platform with your own community in mind.",
    text: "We'll walk your board or team through the parts that matter most to you.",
  },
};
