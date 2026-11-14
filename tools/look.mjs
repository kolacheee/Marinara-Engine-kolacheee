import { chromium } from "@playwright/test";
const [,, url = "http://127.0.0.1:7871/", out = "shots-out/look.png", w = "1440", h = "900"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await p.goto(url); await p.waitForTimeout(4000);
await p.screenshot({ path: out });
console.log(await p.evaluate(() => document.body.innerText.slice(0, 600)));
await b.close();
