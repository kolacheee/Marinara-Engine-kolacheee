// node extras.mjs <themeId> <outPrefix>   : home, library-characters, chat-settings, settings-appearance (desktop + phone for home/chat-settings)
import { chromium, devices } from "@playwright/test";
const B = "http://127.0.0.1:7871", H = { "content-type": "application/json", origin: B };
const [, , theme, prefix, time = "12:00"] = process.argv;
await fetch(B + "/api/themes/active", { method: "PUT", headers: H, body: JSON.stringify({ id: theme }) });
await fetch(B + "/api/chats/9m16JwDBxKapAjUKb29b0/game-state", { method: "PATCH", headers: H, body: JSON.stringify({ manual: true, time, weather: "clear" }) });
const b = await chromium.launch();
const open = async (opts) => { const ctx = await b.newContext(opts); const p = await ctx.newPage(); await p.goto(B + "/"); await p.waitForTimeout(2500); const s = p.getByText("Skip Tutorial"); if (await s.count()) { await s.first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(400); } return [ctx, p]; };
const dismiss = async (p) => { const g = p.locator("button:text-is('Got it')"); if (await g.count()) await g.first().click({ force: true, timeout: 8000 }).catch(() => {}); await p.waitForTimeout(800); };
const openLibrary = async (p) => {
  for (let i = 0; i < 4; i++) {
    if (await p.getByRole("button", { name: /^Characters/ }).first().isVisible().catch(() => false)) return;
    const libs = p.locator('button:visible:has-text("Library")');
    const n = await libs.count();
    await libs.nth(i % 2 === 0 ? n - 1 : 0).click({ force: true, timeout: 8000 }); await p.waitForTimeout(1000);
  }
};
const desk = { viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 } };
const shots = {
  home: async (p) => {},
  "library-characters": async (p) => { await openLibrary(p); await p.getByRole("button", { name: /^Characters/ }).first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(1500); },
  "chat-settings": async (p) => { await p.getByText("Harbor test").first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(2500); await dismiss(p); await p.locator('button:has-text("Chat settings")').first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(1500); await dismiss(p); },
  "settings-appearance": async (p) => { await openLibrary(p); await p.getByRole("button", { name: "Settings", exact: true }).last().click({ force: true, timeout: 8000 }); await p.waitForTimeout(1200); const ap = p.getByRole("button", { name: /^Appearance/ }).or(p.getByRole("tab", { name: /^Appearance/ })); await ap.first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(1500); },
};
for (const [name, fn] of Object.entries(shots)) {
  const [ctx, p] = await open(desk);
  try { await fn(p); await p.screenshot({ path: `${prefix}-${name}-desktop.png` }); console.log("ok", name); } catch (e) { console.log("FAIL", name, e.message.split("\n")[0]); await p.screenshot({ path: `${prefix}-${name}-desktop-FAILED.png` }); }
  await ctx.close();
}
for (const name of ["home", "chat-settings"]) {
  const [ctx, p] = await open({ ...devices["iPhone 14"] });
  try { if (name === "chat-settings") { await p.getByText("Harbor test").first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(2500); await dismiss(p); await p.locator('button[aria-label*="Chat settings" i], button:has-text("Chat settings")').first().click({ force: true, timeout: 8000 }); await p.waitForTimeout(1500); await dismiss(p); } await p.screenshot({ path: `${prefix}-${name}-phone.png` }); console.log("ok phone", name); } catch (e) { console.log("FAIL phone", name, e.message.split("\n")[0]); }
  await ctx.close();
}
await b.close();
