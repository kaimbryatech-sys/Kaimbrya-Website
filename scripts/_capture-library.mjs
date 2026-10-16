import { chromium } from "@playwright/test";
const S = process.argv[2], OUT = "assets/screens", APP = "http://localhost:3001";
const b = await chromium.launch();
const ctx = (user, phone) => b.newContext({ storageState: `${S}/sess-${user}.json`, viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: phone ? 3 : 2, isMobile: phone, hasTouch: phone });
const open = async (c, url) => { const p = await c.newPage(); await p.goto(APP + url, { waitUntil: "networkidle", timeout: 180000 }); await p.waitForTimeout(2500); return p; };

// 1-2. Homeowner: Finance folder, then the PDF preview
let c = await ctx("marcus.reid", false); let p = await open(c, "/dashboard/library");
await p.getByRole("button", { name: "Open Finance" }).click(); await p.waitForTimeout(3000);
await p.mouse.move(5, 895); await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/library-finance.png`, clip: { x: 300, y: 96, width: 1096, height: 560 } });
await p.getByRole("button", { name: "Preview Proposed Budget 2027.pdf" }).click(); await p.waitForTimeout(6000);
await p.getByRole("dialog").screenshot({ path: `${OUT}/library-preview.png` });
await c.close();

// 3. Admin: sharing a document with roles
c = await ctx("kevin.thompson", false); p = await open(c, "/dashboard/library");
await p.getByRole("button", { name: "Open Finance" }).click(); await p.waitForTimeout(3000);
await p.getByRole("button", { name: "Actions for Proposed Budget 2027.pdf" }).click(); await p.waitForTimeout(800);
console.log("menu:", (await p.getByRole("menuitem").allTextContents()).join(" | "));
await p.getByRole("menuitem", { name: /share/i }).first().click(); await p.waitForTimeout(2500);
await p.getByRole("dialog").screenshot({ path: `${OUT}/library-share.png` });
await c.close();

// 4-6. Homeowner on a phone
c = await ctx("marcus.reid", true); p = await open(c, "/dashboard/library");
await p.getByRole("button", { name: "Open Finance" }).first().click(); await p.waitForTimeout(3000);
await p.screenshot({ path: `${OUT}/owner-library-phone.png` });
await p.close(); p = await open(c, "/dashboard/announcements");
await p.getByText("Read more").first().click().catch(() => {}); await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/owner-budget-notice.png` });
await p.close(); p = await open(c, "/dashboard");
await p.getByRole("button", { name: /Notifications/ }).first().click(); await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}/owner-notifications.png` });
await b.close(); console.log("done");
