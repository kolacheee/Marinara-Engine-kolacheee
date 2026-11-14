import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 } });
await p.goto("http://127.0.0.1:7871/"); await p.waitForTimeout(2500);
const s = p.getByText("Skip Tutorial"); if (await s.count()) await s.first().click();
const list = async (t) => console.log(t, JSON.stringify(await p.evaluate(() => [...document.querySelectorAll("button,[role=tab],a")].filter(e => e.offsetParent).map(e => (e.getAttribute("aria-label") || e.innerText || "").trim().slice(0, 30)).filter(Boolean))));
await list("home");
await p.getByText("Harbor test").first().click(); await p.waitForTimeout(2500); await list("chat");
await b.close();
