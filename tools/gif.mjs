import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
const [, , state, time, weather, out] = process.argv;
const B = "http://127.0.0.1:7871", H = { "content-type": "application/json", origin: B };
await fetch(B + "/api/themes/active", { method: "PUT", headers: H, body: JSON.stringify({ id: "z4FKwHRd_0Dze9mZmBYXo" }) });
await fetch(B + "/api/chats/9m16JwDBxKapAjUKb29b0/game-state", { method: "PATCH", headers: H, body: JSON.stringify({ manual: true, time, weather }) });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, screen: { width: 1920, height: 1200 } });
const p = await ctx.newPage();
await p.goto(B + "/"); await p.waitForTimeout(2500);
const skip = p.getByText("Skip Tutorial"); if (await skip.count()) await skip.first().click();
await p.getByText("Harbor test").first().click(); await p.waitForTimeout(3000);
const got = p.locator("button:text-is('Got it')"); if (await got.count()) await got.first().click().catch(() => {});
await p.waitForTimeout(1500);
const dir = `shots-out/frames-${state}`; execFileSync("mkdir", ["-p", dir]);
for (let i = 0; i < 40; i++) { await p.screenshot({ path: `${dir}/${String(i).padStart(3, "0")}.png` }); await p.waitForTimeout(50); }
await b.close();
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "12", "-i", `${dir}/%03d.png`, "-vf", "scale=900:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=bayer", out]);
