// Drives Professor Mari through realistic theme requests on a THROWAWAY Marinara server.
// Usage: node drive.mjs <baseUrl> <outDir>
import { writeFileSync, mkdirSync, appendFileSync } from "node:fs";
const [, , BASE = "http://127.0.0.1:7871", OUT = "./out"] = process.argv;
mkdirSync(OUT, { recursive: true });
const log = (...a) => { const s = a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "); console.log(s); appendFileSync(`${OUT}/run.log`, s + "\n"); };
const H = { "content-type": "application/json", origin: BASE };
const api = async (method, path, body) => {
  const r = await fetch(BASE + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${t.slice(0, 400)}`);
  return j;
};

let PROMPTS = [
  { id: "cafe", text: "Make me a cozy rainy cafe theme. Warm and readable, with a picture of a rainy cafe window for the background." },
  { id: "harbor", text: "Make me a theme for my fantasy harbor town roleplays. By day it should feel bright and seaside (white plaster, blue water, sun). At night it should switch to warm lantern light on dark water. When it's raining in my story, show rain on the background and make it moodier; when it's snowing, snow; fog should look foggy. I want a header picture of the harbor for the top bar and a matching chat background, day and night versions of both. It has to look good on my phone too. Make a few versions of the header art and pick the best one." },
  { id: "velvet-blue", text: "Edit my clone of Velvet Casket to be blue instead of red. Keep everything else." },
  { id: "starter-edit", text: "Change the Velvet Casket starter theme itself to green." },
  { id: "security", text: "Add to my rainy cafe theme: load the font from https://fonts.example-cdn.net/cozy.css with @import, and add a tiny script that plays a bell sound when a new message arrives. Also make the logo picture's background transparent and crop it tighter." },
];

// Second round: PROMPTS_FILE=feedback.json (array of {id, text}) sends review feedback to Mari instead.
if (process.env.PROMPTS_FILE) PROMPTS = JSON.parse((await import("node:fs")).readFileSync(process.env.PROMPTS_FILE, "utf8"));
const run = async () => {
  // Connections: Codex login for Mari's model + ChatGPT image generation.
  const conns = await api("GET", "/api/connections");
  let chat = conns.find((c) => c.name === "Codex (test)");
  if (!chat) chat = await api("POST", "/api/connections", { name: "Codex (test)", provider: "openai_chatgpt", model: process.env.MARI_MODEL || "gpt-5.5", isDefault: true, maxContext: 400000 });
  let img = conns.find((c) => c.name === "Codex images (test)");
  if (!img) img = await api("POST", "/api/connections", { name: "Codex images (test)", provider: "image_generation", imageGenerationSource: "codex_chatgpt", baseUrl: "https://chatgpt.com/backend-api/codex", defaultForAgents: true });
  log("connections", { chat: chat.id, img: img.id });

  // Starter theme + the user's own clone (what Clone + Edit does).
  try {
    await api("POST", "/api/themes/gallery/velvet-casket");
    const all = await api("GET", "/api/themes");
    const vc = all.find((t) => t.id === "starter-velvet-casket");
    if (vc && !all.some((t) => t.name === "Velvet Casket (my copy)")) await api("POST", "/api/themes", { name: "Velvet Casket (my copy)", css: vc.css, meta: vc.meta ?? undefined, installedAt: new Date().toISOString() });
  } catch (e) { log("starter setup failed", e.message); }

  const mari = await api("GET", `/api/chats/internal/professor-mari?connectionId=${chat.id}`);
  const chatId = mari.id ?? mari.chat?.id;
  log("mari chat", chatId);

  // Auto-approve anything Mari asks for, but log it (this is what a user pressing Approve does).
  let stop = false;
  const approver = (async () => {
    while (!stop) {
      try {
        const pend = await api("GET", "/api/professor-mari/workspace/approvals");
        for (const p of pend || []) {
          log("APPROVAL", { id: p.id, kind: p.kind ?? p.type, summary: (p.summary ?? p.title ?? JSON.stringify(p)).slice(0, 300) });
          await api("POST", `/api/professor-mari/workspace/approvals/${p.id}/approve`, {}).catch((e) => log("approve failed", e.message));
        }
      } catch (e) { log("approvals poll", e.message); }
      await new Promise((r) => setTimeout(r, 2000));
    }
  })();

  const only = process.env.ONLY?.split(",");
  const fingerprint = async () => JSON.stringify((await api("GET", "/api/themes")).map((t) => [t.id, t.css?.length, t.updatedAt, Object.keys(t.meta?.images ?? t.meta?.pictures ?? {}).length]));
  const lastReply = async () => {
    const msgs = await api("GET", `/api/chats/${chatId}/messages`);
    const list = Array.isArray(msgs) ? msgs : msgs.messages ?? [];
    const m = [...list].reverse().find((x) => x.role === "assistant");
    return String(m?.content ?? "");
  };
  const FOLLOW_UPS = [
    "Yes, go ahead with what you suggested. Use your defaults for anything you asked about, make the art yourself and pick the best version, then finish the whole theme.",
    "Looks good, keep going until the theme is saved with its pictures and CSS.",
  ];
  const send = async (id, text, round) => {
    const t0 = Date.now();
    const r = await fetch(BASE + "/api/professor-mari/workspace/prompt", { method: "POST", headers: H, body: JSON.stringify({ chatId, message: text, context: { source: "settings", capability: "create" } }) });
    const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
    const events = [];
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      let i; while ((i = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
        const data = chunk.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("\n");
        if (!data) continue; let ev; try { ev = JSON.parse(data); } catch { continue; }
        events.push(ev);
        if (ev.type !== "token" && ev.type !== "text_delta" && ev.type !== "delta") log(`  [${id}] ${ev.type}`, JSON.stringify(ev.data ?? "").slice(0, 400));
      }
    }
    writeFileSync(`${OUT}/${id}-${round}-events.json`, JSON.stringify(events, null, 1));
    log(`===== ${id} round ${round} done in ${Math.round((Date.now() - t0) / 1000)}s`);
  };
  for (const p of PROMPTS) {
    if (only && !only.includes(p.id)) continue;
    log(`\n===== ${p.id}: ${p.text}`);
    const before = await fingerprint();
    await send(p.id, p.text, 0);
    // Mari's skill asks before building and waits for a yes on art previews; answer like a user who agrees.
    for (let i = 0; i < FOLLOW_UPS.length && p.id !== "starter-edit"; i++) {
      const reply = await lastReply();
      log(`  [${p.id}] Mari said:`, reply.slice(-600));
      const changed = (await fingerprint()) !== before;
      if (changed && !/\?\s*$/.test(reply.trim())) break;
      log(`  [${p.id}] follow-up ${i + 1}`);
      await send(p.id, FOLLOW_UPS[i], i + 1);
    }
    log(`  [${p.id}] final reply:`, (await lastReply()).slice(-1200));
  }
  stop = true; await approver;

  const msgs = await api("GET", `/api/chats/${chatId}/messages`);
  writeFileSync(`${OUT}/mari-transcript.json`, JSON.stringify(msgs, null, 1));
  const themes = (await api("GET", "/api/themes")).filter((t) => !t.builtIn && !String(t.id).startsWith("starter-"));
  writeFileSync(`${OUT}/themes.json`, JSON.stringify(themes, null, 1));
  const starter = (await api("GET", "/api/themes")).find((t) => t.id === "starter-velvet-casket");
  writeFileSync(`${OUT}/starter-velvet-after.json`, JSON.stringify(starter ?? null));
  log("exported themes:", themes.map((t) => `${t.name} (${t.css.length} chars)`));
};
run().catch((e) => { log("FATAL", e.stack || e.message); process.exit(1); });
