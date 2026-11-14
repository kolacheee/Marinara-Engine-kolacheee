// node r5.mjs <themeId> <prefix> : 2x crops of the top-bar trim (Home) and the sticker area next to a message name
import { chromium } from "@playwright/test";
const B = "http://127.0.0.1:7871", H = { "content-type": "application/json", origin: B };
const [, , theme, prefix] = process.argv;
await fetch(B + "/api/themes/active", { method: "PUT", headers: H, body: JSON.stringify({ id: theme }) });
await fetch(B + "/api/chats/9m16JwDBxKapAjUKb29b0/game-state", { method: "PATCH", headers: H, body: JSON.stringify({ manual: true, time: "12:00", weather: "clear" }) });
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 }, deviceScaleFactor: 2, timezoneId: process.env.TZID || "UTC" })).newPage();
await p.goto(B + "/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
await p.getByRole("button", { name: "Home", exact: true }).first().click({ force: true }).catch(() => {}); await p.waitForTimeout(1500);
await p.screenshot({ path: `${prefix}-topbar-trim-2x.png`, clip: { x: 0, y: 0, width: 760, height: 64 } });
await p.getByText("Harbor test").first().click({ force: true }); await p.waitForTimeout(2500);
const g = p.locator("button:text-is('Got it')"); if (await g.count()) await g.first().click().catch(() => {});
for (let i = 0; i < 3; i++) { const ov = p.locator("[data-chat-help-overlay]"); if (!(await ov.count())) break; await ov.first().click({ position: { x: 20, y: 300 }, force: true }).catch(() => {}); await p.keyboard.press("Escape"); await p.waitForTimeout(700); }
await p.mouse.move(700, 600); await p.waitForTimeout(800);
const names = p.getByText("Captain Wren", { exact: false });
const n = await names.count();
for (let i = 0; i < Math.min(n, 2); i++) {
  const bb = await names.nth(i).boundingBox();
  if (bb) await p.screenshot({ path: `${prefix}-sticker-${i + 1}-2x.png`, clip: { x: Math.max(0, bb.x - 140), y: Math.max(0, bb.y - 40), width: 520, height: bb.height + 80 } });
}
const you = p.getByText("You", { exact: true }).first(); const yb = await you.boundingBox();
if (yb) await p.screenshot({ path: `${prefix}-sticker-you-2x.png`, clip: { x: Math.max(0, yb.x - 200), y: Math.max(0, yb.y - 40), width: 420, height: yb.height + 80 } });
await b.close(); console.log("ok", prefix, n);
