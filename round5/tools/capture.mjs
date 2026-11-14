// node capture.mjs <themeId|none> <outPrefix> [states csv]
import { chromium, devices } from "@playwright/test";
const B = "http://127.0.0.1:7871", CHAT = process.env.CHAT || "9m16JwDBxKapAjUKb29b0";
const H = { "content-type": "application/json", origin: B };
const api = async (m, p, b) => { const r = await fetch(B + "/api" + p, { method: m, headers: H, body: JSON.stringify(b ?? {}) }); if (!r.ok) throw new Error(`${m} ${p} ${r.status} ${(await r.text()).slice(0, 200)}`); return r.json(); };
const [, , theme, prefix, statesCsv = "day-clear"] = process.argv;
const STATES = { "home": ["12:00", "clear"], "day-clear": ["12:00", "clear"], "night-clear": ["22:00", "clear"], "day-rain": ["13:00", "rain"], "night-rain": ["22:00", "rain"], "day-snow": ["11:00", "snow"], "day-fog": ["08:00", "fog"], "night-storm": ["23:00", "storm"] };
await api("PUT", "/themes/active", { id: theme === "none" ? null : theme });
const b = await chromium.launch();
const TZ = process.env.TZID ? { timezoneId: process.env.TZID } : {};
const views = { desktop: { viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 }, deviceScaleFactor: 1, ...TZ }, phone: { ...devices["iPhone 14"], deviceScaleFactor: 2, ...TZ } };
for (const st of statesCsv.split(",")) {
  const [time, weather] = STATES[st];
  await api("PATCH", `/chats/${CHAT}/game-state`, { manual: true, time, weather });
  for (const [vn, opts] of Object.entries(views)) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    await p.goto(B + "/"); await p.waitForTimeout(2500);
    const skip = p.getByText("Skip Tutorial"); if (await skip.count()) { await skip.first().click(); await p.waitForTimeout(500); }
    if (st === "home") { await p.screenshot({ path: `${prefix}-home-${vn}.png` }); await ctx.close(); continue; }
    await p.getByText("Harbor test").first().click(); await p.waitForTimeout(3000);
    const got = p.locator("button:text-is('Got it')"); if (await got.count()) { await got.first().click().catch(() => {}); } for (let i = 0; i < 3; i++) { const ov = p.locator("[data-chat-help-overlay]"); if (!(await ov.count())) break; await ov.first().click({ position: { x: 20, y: 300 }, force: true }).catch(() => {}); await p.keyboard.press("Escape"); await p.waitForTimeout(700); }
    await p.waitForTimeout(400); if (await p.getByText("Roleplay Help").count()) { await p.getByText("Roleplay Help").first().click().catch(() => {}); for (let i = 0; i < 3; i++) { const ov = p.locator("[data-chat-help-overlay]"); if (!(await ov.count())) break; await ov.first().click({ position: { x: 20, y: 300 }, force: true }).catch(() => {}); await p.keyboard.press("Escape"); await p.waitForTimeout(700); }
    await p.waitForTimeout(400); if (await p.getByText("Roleplay Help").count()) await p.mouse.click(700, 700); } await p.waitForTimeout(1500);
    const attrs = await p.evaluate(() => ({ w: document.documentElement.dataset.mariWeather, s: document.documentElement.dataset.mariSky }));
    await p.screenshot({ path: `${prefix}-${st}-${vn}.png` });
    console.log(st, vn, JSON.stringify(attrs));
    await ctx.close();
  }
}
await b.close();
