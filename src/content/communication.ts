import type { CompositionLayout, Shot } from "@/components/blocks";
import type { GuestStep } from "@/content/site";

/**
 * Communication & Transparency and Library pages. Every capability here was checked in the
 * app's code (October 2026). Deliberately NOT claimed, because the app doesn't do them:
 * version history, read acknowledgements, document expiry or approval, public share links,
 * linking an announcement to a Library file, scheduled or targeted announcements, event RSVPs.
 */

const shot = {
  notice: { name: "owner-budget-notice", device: "phone", alt: "A pinned Policy announcement on a homeowner's phone: Proposed 2027 budget, no change to monthly fees", sizes: "(min-width: 640px) 220px, 240px" },
  notifications: { name: "owner-notifications", device: "phone", alt: "A homeowner's notifications: the budget announcement and New resources shared in Library", sizes: "(min-width: 640px) 220px, 240px" },
  finance: { name: "library-finance", device: "panel", alt: "The Kaimbrya Library, Finance folder: Approved Budget 2026, Financial Report Q3 2026 and Proposed Budget 2027" },
  preview: { name: "library-preview", device: "panel", alt: "The Proposed Budget 2027 PDF opened in the Library's preview, with Download and Open in new tab" },
  share: { name: "library-share", device: "panel", alt: "Share Management for Proposed Budget 2027: shared with the Home owner role" },
  announcements: { name: "announcements-table", device: "panel", alt: "Kaimbrya announcements for managers: category, priority and author" },
  ownerNotices: { name: "owner-notices", device: "phone", alt: "Announcements on a homeowner's phone", sizes: "(min-width: 640px) 180px, 240px" },
  vote: { name: "vote-card", device: "panel", alt: "A Kaimbrya vote on the 2027 budget, anonymous, with 50% quorum" },
  ideas: { name: "ideas-board", device: "panel", alt: "The Kaimbrya idea exchange, with residents' suggestions and their support" },
} satisfies Record<string, Shot>;

export type Pillar = { title: string; tag: string; text: string; href: string; accent: string };
export type Row = { id?: string; eyebrow: string; title: string; text: string; points: string[]; layout: CompositionLayout; shots: Shot[]; link?: { label: string; href: string } };

export const communication = {
  meta: {
    title: "Communication and transparency",
    description: "Official announcements, a community document library, events, votes and an idea exchange: one trusted source of information for your community.",
  },
  hero: {
    eyebrow: "Communication and transparency",
    title: "One community.",
    emphasis: "One trusted source of information.",
    lead: "Bring homeowners, boards and managers together with official notices, the community's documents in one place, and open, structured ways to take part in decisions.",
    shots: [shot.finance, shot.notice],
  },
  pillars: {
    eyebrow: "Four connected parts",
    title: "Informed, involved and on the same page.",
    items: [
      { title: "Announcements", tag: "Keep everyone informed", text: "Official notices from the board and management: security updates, water interruptions, reminders and community news, pinned when they matter most.", href: "#announcements", accent: "#1f5f75" },
      { title: "Library", tag: "The community's source of truth", text: "Bylaws, rules, AGM minutes, approved budgets, financial reports and forms, shared with the people who should see them.", href: "/library/", accent: "#2f7d57" },
      { title: "Events", tag: "Bring the community together", text: "AGMs, community meetings and social gatherings on a shared calendar, with automatic reminders.", href: "#participation", accent: "#946114" },
      { title: "Votes and ideas", tag: "Encourage participation", text: "Residents suggest and support ideas, and owners vote online with anonymous ballots and a quorum, within your governance rules.", href: "#participation", accent: "#2a7591" },
    ] satisfies Pillar[],
  },
  story: {
    eyebrow: "From rumour to facts",
    title: "When the group chat says fees are going up",
    lead: "A message in a residents' WhatsApp group claims maintenance fees will rise next year. Instead of guessing, a homeowner checks Kaimbrya: the board's official announcement, and the budget itself in the Library.",
    note: "Kaimbrya doesn't police private conversations. It gives everyone the same official facts to check them against.",
    steps: [
      { id: "announce", label: "Official announcement", title: "The board posts the facts", text: "A pinned, high-priority notice explains the proposed budget and says where the papers are.", screen: "owner-budget-notice", device: "phone", alt: shot.notice.alt },
      { id: "notify", label: "Homeowner notification", title: "Every homeowner hears it from the source", text: "The notice arrives in the app, and by push or email if the board chooses, alongside an alert that new documents are in the Library.", screen: "owner-notifications", device: "phone", alt: shot.notifications.alt },
      { id: "document", label: "Supporting document", title: "The budget is one tap away", text: "The proposed budget opens right in the Library, next to this year's approved budget and the latest financial report.", screen: "library-preview", device: "panel", alt: shot.preview.alt },
      { id: "informed", label: "Informed community", title: "Owners decide with the facts", text: "With the papers in hand, owners vote on the budget online, with anonymous ballots and a quorum.", screen: "vote-card", device: "panel", alt: shot.vote.alt },
    ] satisfies GuestStep[],
  },
  rows: [
    {
      id: "announcements",
      eyebrow: "Announcements",
      title: "Official notices, not forwarded screenshots.",
      text: "Administrators post notices with a category and a priority. Important ones stay pinned at the top, and every resident sees the same words in the app.",
      points: [
        "Categories such as General, Maintenance, Events, Emergency and Policy",
        "Priorities from low to emergency, and pinning for what matters most",
        "Sent in the app, and by push or email when the author chooses",
        "An expiry date so out-of-date notices disappear on their own",
      ],
      layout: "panel-phone",
      shots: [shot.announcements, shot.ownerNotices],
    },
    {
      id: "library",
      eyebrow: "Library",
      title: "The documents everyone asks for, in one place.",
      text: "Bylaws, minutes, budgets and forms live in organised folders. Homeowners open them whenever they need to, instead of asking the office again or scrolling through old messages.",
      points: [
        "Folders and keywords for bylaws, minutes, budgets, reports and forms",
        "PDFs and images preview right in the app; every file can be downloaded",
        "Each document is shared with the roles or people who should see it",
        "Residents can be told by app, push or email when new documents are added",
      ],
      layout: "panel-over",
      shots: [shot.finance, shot.share],
      link: { label: "Explore the Library", href: "/library/" },
    },
    {
      id: "participation",
      eyebrow: "Events, votes and ideas",
      title: "More than a noticeboard: a place to take part.",
      text: "Meetings and gatherings sit on a shared calendar with reminders. Residents suggest improvements and support each other's ideas, and the best ones can go to a vote.",
      points: [
        "Events on a shared calendar, with automatic reminders",
        "An idea exchange with comments, support and a clear status for every suggestion",
        "Ideas the board selects can become a vote",
        "Online votes with anonymous ballots, quorum tracking, scheduled opening and automatic results",
      ],
      layout: "panel-over",
      shots: [shot.ideas, shot.vote],
    },
  ] satisfies Row[],
  faq: [
    { q: "Does Kaimbrya replace our WhatsApp group?", a: "No. Residents can keep chatting wherever they like. Kaimbrya is where official notices and community documents live, so there's always one place to check what the board actually said." },
    { q: "Who can post announcements?", a: "Administrators. Residents read announcements in the app, and receive them by push or email when the author chooses those channels." },
    { q: "Can every resident see every document?", a: "Only what's shared with them. Each Library document is shared with roles, such as homeowners, or with specific people. Only administrators add, change or remove documents." },
    { q: "Do online votes replace our general meetings?", a: "No. Votes support your process; they don't replace the meetings or procedures your bylaws require. Owners can vote online with anonymous ballots, and results are calculated automatically once the vote closes." },
  ],
  cta: {
    title: "Give your community one trusted source of information.",
    text: "We'll show your board how notices, documents and votes work together for your community.",
  },
};

export const library = {
  meta: {
    title: "Document library",
    description: "Bylaws, AGM minutes, budgets, financial reports and forms in one organised, permission-controlled library that homeowners can open any time.",
  },
  hero: {
    eyebrow: "Document library",
    title: "The community's records,",
    emphasis: "always within reach.",
    lead: "Keep bylaws, minutes, budgets and forms in one organised library. Homeowners open what's shared with them, any time, instead of asking the office again.",
    shots: [shot.finance],
  },
  contents: {
    eyebrow: "What goes in it",
    title: "Everything a resident might need to look up.",
    items: [
      { title: "Bylaws, rules and policies", text: "The governing documents and community guidelines." },
      { title: "AGM notices and minutes", text: "Agendas before the meeting, minutes after it." },
      { title: "Budgets and financial reports", text: "Approved budgets and the treasurer's reports, once published." },
      { title: "Forms", text: "Renovation requests, pet registration, vehicle passes." },
      { title: "Maintenance schedules and reports", text: "Planned work and inspection results." },
      { title: "Board circulars", text: "Board-approved notices and official records." },
    ],
  },
  rows: [
    {
      eyebrow: "Organised",
      title: "Folders that match how your community works.",
      text: "Administrators create folders, colour-code them and add keywords. Residents browse a folder or search by name or keyword, filter by type and sort the list.",
      points: [
        "Nested folders with colours and icons",
        "Up to ten keywords on each document",
        "Search, type filters and sorting within a folder",
        "PDF, Word, Excel, JPG and PNG files; documents up to 25 MB",
      ],
      layout: "single",
      shots: [shot.finance],
    },
    {
      eyebrow: "Open and download",
      title: "Read it in the app, or keep a copy.",
      text: "PDFs and images open in a preview inside Kaimbrya, on a phone or a computer. Any document can be downloaded.",
      points: [
        "In-app preview for PDFs and images",
        "Word and Excel files download to open in their own apps",
        "Every file is checked against the reader's access before it's served",
      ],
      layout: "single",
      shots: [shot.preview],
    },
    {
      eyebrow: "Access",
      title: "Each document reaches the right people.",
      text: "When a document is added, the administrator chooses who can see it: whole roles, like homeowners, or specific people. Residents only ever see what's shared with them.",
      points: [
        "Share with roles, with specific people, or both",
        "Change who has access at any time",
        "Only administrators add, rename, move or delete documents",
        "Board-only papers stay with the board",
      ],
      layout: "portrait",
      shots: [shot.share],
    },
    {
      eyebrow: "Tell residents",
      title: "New papers don't go unnoticed.",
      text: "When documents are uploaded, the administrator can let the people they're shared with know, in the app, by push notification or by email.",
      points: [
        "An optional notification step when uploading",
        "Choose who to tell and how",
        "Pair it with an announcement explaining what's new",
      ],
      layout: "phones",
      shots: [shot.notifications, shot.notice],
    },
  ] satisfies Row[],
  faq: [
    { q: "Who can add documents?", a: "Administrators. Homeowners and other residents can open and download what's shared with them, but can't add, change or delete documents." },
    { q: "Can we keep some documents for the board only?", a: "Yes. Each document is shared with the roles or people you choose, so board papers can stay with the board while budgets and minutes go to every owner." },
    { q: "Which file types can we upload?", a: "PDF, Word, Excel, JPG and PNG. Documents can be up to 25 MB and images up to 5 MB. PDFs and images preview in the app; Word and Excel files download." },
    { q: "Will residents know when something new is added?", a: "If you choose. The upload includes an optional step to notify the people a document is shared with, in the app, by push or by email." },
  ],
  cta: {
    title: "Put your community's records in one trusted place.",
    text: "We'll show your board how the Library works with your own documents and roles.",
  },
};
