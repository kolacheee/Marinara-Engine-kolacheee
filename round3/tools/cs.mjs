import { chromium, devices } from "@playwright/test";
const [, , out, phone] = process.argv;
const b = await chromium.launch(); const ctx = await b.newContext(phone ? { ...devices["iPhone 14"] } : { viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 } }); const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7871/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
await p.getByText("Harbor test").first().click(); await p.waitForTimeout(2500);
const g = p.locator("button:text-is('Got it')"); if (await g.count()) { await g.first().click(); await p.waitForTimeout(800); }
for (let i = 0; i < 3; i++) { const ov = p.locator("[data-chat-help-overlay]"); if (!(await ov.count())) break; await ov.first().click({ position: { x: 20, y: 300 }, force: true }).catch(() => {}); await p.keyboard.press("Escape"); await p.waitForTimeout(700); }
const btn = p.getByRole("button", { name: /Chat settings/i });
console.log("buttons", await btn.count());
await btn.first().click({ timeout: 8000 }); await p.waitForTimeout(2000);
const g2 = p.locator("button:text-is('Got it')"); if (await g2.count()) { await g2.first().click(); await p.waitForTimeout(800); }
console.log("drawer", await p.locator(".mari-drawer, [role=dialog]").count());
await p.screenshot({ path: out });
await b.close();
