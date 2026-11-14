// node r4.mjs <themeId> <prefix> : library-characters (desktop) + 2x toolbar crop + chat composer crop
import { chromium } from "@playwright/test";
const B = "http://127.0.0.1:7871", H = { "content-type": "application/json", origin: B };
const [, , theme, prefix, time = "12:00"] = process.argv;
await fetch(B + "/api/themes/active", { method: "PUT", headers: H, body: JSON.stringify({ id: theme }) });
await fetch(B + "/api/chats/9m16JwDBxKapAjUKb29b0/game-state", { method: "PATCH", headers: H, body: JSON.stringify({ manual: true, time, weather: "clear" }) });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 }, deviceScaleFactor: 2, timezoneId: process.env.TZID || "UTC" });
const p = await ctx.newPage();
await p.goto(B + "/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
for (let i = 0; i < 4; i++) { if (await p.getByRole("button", { name: /^Characters/ }).first().isVisible().catch(() => false)) break; const libs = p.locator('button:visible:has-text("Library")'); const n = await libs.count(); await libs.nth(i % 2 === 0 ? n - 1 : 0).click({ force: true }); await p.waitForTimeout(1000); }
await p.getByRole("button", { name: /^Characters/ }).first().click({ force: true }); await p.waitForTimeout(1800);
await p.screenshot({ path: `${prefix}-library-characters-desktop.png`, scale: "css" });
const search = p.locator('input[placeholder*="Search characters" i]').first();
const sb = await search.boundingBox();
if (sb) await p.screenshot({ path: `${prefix}-toolbar-2x.png`, clip: { x: Math.max(0, sb.x - 16), y: sb.y - 14, width: Math.min(1440 - sb.x + 16, 900), height: sb.height + 28 } });
else console.log("no search box");
// composer
await p.goto(B + "/"); await p.waitForTimeout(2500); { const s2 = p.getByText("Skip Tutorial"); if (await s2.count()) await s2.first().click(); } await p.getByRole("button", { name: "Home", exact: true }).first().click({ force: true }).catch(() => {}); await p.waitForTimeout(1500);
await p.getByText("Harbor test").first().click({ force: true }); await p.waitForTimeout(2500);
const g = p.locator("button:text-is('Got it')"); if (await g.count()) await g.first().click().catch(() => {});
for (let i = 0; i < 3; i++) { const ov = p.locator("[data-chat-help-overlay]"); if (!(await ov.count())) break; await ov.first().click({ position: { x: 20, y: 300 }, force: true }).catch(() => {}); await p.keyboard.press("Escape"); await p.waitForTimeout(700); }
await p.mouse.move(700, 450); await p.waitForTimeout(800);
const comp = p.locator('[data-mari-part="composer"]').first();
const cb = await comp.boundingBox();
if (cb) await p.screenshot({ path: `${prefix}-composer-2x.png`, clip: { x: cb.x - 12, y: cb.y - 12, width: cb.width + 24, height: cb.height + 24 } });
else console.log("no composer");
await b.close(); console.log("ok", prefix);
