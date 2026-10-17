# Screen asset record

Every image on the site is a real capture of the Kaimbrya app. The captures come from the local test environment, which has a fictional community ("Mahoe Ridge") and fictional residents. None of the people, units or amounts are real.

- **Capture:** 15 October 2026, app `main` at commit 0632c2e3, served locally against the test database.
- **Desktop:** 1440×900 at 2×.
- **Phone:** 390×844 at 3×.
- **Crops:** made from those captures, with no other editing.

| File | App page and account | Used for | Feature checked in the app |
| --- | --- | --- | --- |
| manager-dashboard.png | `/dashboard`, admin | The convergence scene's result: one connected dashboard | Yes |
| maintenance-board.png | `/dashboard/maintenance/tasks`, admin | Hero desktop screen | Yes |
| property-register-full.png | `/dashboard/property-management`, admin | Role switcher: Manager | Yes |
| source-only/security-visitors.png | `/dashboard/visitor-management`, guard | Source for security-reviews.png only; not published, because its side panel shows "Access blocked" | Yes |
| security-reviews.png | Crop of security-visitors.png | Role switcher: Security | Yes; Scan ID button present |
| guest-pass.png | `/guest/pass/<token>`, no sign-in | Hero phone; guest access step 3 | Yes; the QR token is test-only and expires 17 Oct 2026 |
| owner-register-visitor.png | `/dashboard/visitor-management`, homeowner; form filled, not submitted | Guest access step 1 | Yes |
| guard-review.png | Guard's review dialog for a pending request | Guest access step 2 | Yes |
| owner-home.png | `/dashboard`, homeowner | Role switcher: Homeowner | Yes |
| owner-payments.png | `/dashboard/collections`, homeowner | Finance: the owner's view | Yes; proof of payment, no online card payment |
| owner-notices.png | `/dashboard/announcements`, homeowner | Communication | Yes |
| payments-overview.png | Crop of `/dashboard/collections`, admin | Finance | Yes |
| overdue-accounts.png | Crop of `/dashboard/delinquency`, admin | Finance | Yes; the page's summary header is excluded (it showed JMD 0.00 beside four overdue rows) |
| maintenance-tasks.png | Crop of `/dashboard/maintenance/tasks`, admin | Operations | Yes |
| owner-request-card.png | Crop of `/dashboard/service-requests`, homeowner | Operations | Yes |
| property-register.png | Crop of `/dashboard/property-management`, admin | Operations | Yes |
| vote-card.png | Crop of `/dashboard/vote`, admin | Community | Yes |
| ideas-board.png | Crop of `/dashboard/ideas`, admin | Community | Yes |

Guards scanning the QR pass at the gate was checked in code: `UnifiedScanner` uses `useScannerEngine`, with `BarcodeDetector` or jsQR.

## Added for the Platform and Solutions pages (15 October 2026)

| File | App page and account | Used for | Feature checked in the app |
| --- | --- | --- | --- |
| setup-wizard.png | Property Intake Console, opened from "Launch Creation Wizard" on `/dashboard/property-management`, admin; nothing submitted | Developers; Platform › Properties | Yes. Cropped to the Batch and Structural cards because on the first card the "Recommended" badge overlaps the "Standard" title, which is an app bug. The full capture is in source-only/ |
| roles-permissions.png | `/dashboard/access-control`, admin; the Security Supervisor role selected | Property managers; Platform › Administration | Yes. 181 permissions across 48 resources |
| data-export.png | `/dashboard/data-export`, admin | Property managers; Platform › Administration | Yes. Export builder with column picking |
| incidents-queue.png | Crop of `/dashboard/incident-management`, admin | Gated communities; Platform › Security | Yes |
| announcements-table.png | Crop of `/dashboard/announcements`, admin | Strata; Platform › Communication | Yes |

### Library and communication captures (16 October 2026)

Captured from a production build of app `main` (commit a95db32b) against the test database, after adding fictional Library documents, a budget announcement and two notifications for the demo homeowner (`marketing/app-demo-data/library.seed.ts`; rows listed in `out/library-manifest.json`).

| File | App page and account | Used for | Feature checked in the app |
| --- | --- | --- | --- |
| library-finance.png | Crop of `/dashboard/library`, Finance folder, homeowner | Communication, Library | Yes; a homeowner sees only folders holding documents shared with them |
| library-preview.png | Preview dialog for Proposed Budget 2027.pdf, homeowner | Library; rumour-to-facts step 3 | Yes; in-app PDF preview (pdf.js) |
| library-share.png | Share Management dialog, admin | Communication, Library | Yes; shared with the Home owner role |
| owner-budget-notice.png | `/dashboard/announcements` on a phone, homeowner | Communication hero; rumour-to-facts step 1 | Yes; pinned, Policy, High |
| owner-notifications.png | Notifications panel on a phone, homeowner | Rumour-to-facts step 2; Library | Yes; wording matches the app's announcement and Library notifications |
| ledger-reports.png | `/dashboard/finance/reports`, Admin, ledger branch build with Mahoe Ridge fixtures (`marketing/app-demo-data/ledger.seed.mjs`) | Pricing: Professional Community Ledger add-on | Yes; amounts formatted, sample data |
| ledger-trial-balance.png | `/dashboard/finance/ledger` trial balance, Admin, same fixtures | Available for ledger pages | Yes |
