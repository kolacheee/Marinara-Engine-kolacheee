import { chromium } from "@playwright/test";
const [, , value] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 } });
await p.goto("http://127.0.0.1:7871/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
for (let i = 0; i < 4; i++) { if (await p.getByRole("button", { name: /^Characters/ }).first().isVisible().catch(() => false)) break; const libs = p.locator('button:visible:has-text("Library")'); const n = await libs.count(); await libs.nth(i % 2 === 0 ? n - 1 : 0).click({ force: true }); await p.waitForTimeout(1000); }
await p.getByRole("button", { name: "Settings", exact: true }).last().click({ force: true }); await p.waitForTimeout(1200);
await p.getByRole("button", { name: /^Appearance/ }).or(p.getByRole("tab", { name: /^Appearance/ })).first().click({ force: true }); await p.waitForTimeout(1200);
const sel = p.locator("select").filter({ has: p.locator("option[value=time]") }).first();
console.log("before", await sel.inputValue()); await sel.selectOption(value); await p.waitForTimeout(1500); console.log("after", await sel.inputValue());
console.log("html data-theme", await p.evaluate(() => document.documentElement.dataset.theme + " " + document.documentElement.className.slice(0, 80)));
await b.close();
