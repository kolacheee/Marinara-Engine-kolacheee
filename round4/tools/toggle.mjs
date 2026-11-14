import { chromium } from "@playwright/test";
const B = "http://127.0.0.1:7871", H = { "content-type": "application/json", origin: B };
const [, , theme, out] = process.argv;
await fetch(B + "/api/themes/active", { method: "PUT", headers: H, body: JSON.stringify({ id: theme }) });
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 }, deviceScaleFactor: 2, timezoneId: "UTC" })).newPage();
await p.goto(B + "/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
for (let i = 0; i < 4; i++) { if (await p.getByRole("button", { name: /^Characters/ }).first().isVisible().catch(() => false)) break; const libs = p.locator('button:visible:has-text("Library")'); const n = await libs.count(); await libs.nth(i % 2 === 0 ? n - 1 : 0).click({ force: true }); await p.waitForTimeout(1000); }
await p.getByRole("button", { name: /^Characters/ }).first().click({ force: true }); await p.waitForTimeout(1800);
const sort = p.locator("select:visible").filter({ hasText: "A to Z" }).first();
const sb = await sort.boundingBox();
if (!sb) { console.log("no sort"); } else await p.screenshot({ path: out, clip: { x: sb.x - 8, y: sb.y - 10, width: Math.min(1440 - sb.x + 8, 260), height: sb.height + 20 } });
await b.close(); console.log("ok", out);
