const B = process.argv[2] || "http://127.0.0.1:7871";
const H = { "content-type": "application/json", origin: B };
const api = async (m, p, b) => { const r = await fetch(B + "/api" + p, { method: m, headers: H, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); if (!r.ok) throw new Error(`${m} ${p} ${r.status} ${t.slice(0, 300)}`); try { return JSON.parse(t); } catch { return t; } };
const chars = await api("GET", "/characters");
let c = (chars.characters ?? chars).find?.((x) => (x.data?.name ?? x.name) === "Captain Wren");
if (!c) c = await api("POST", "/characters", { data: { name: "Captain Wren", description: "A harbor captain.", personality: "", scenario: "", first_mes: "The tide's turning. You coming aboard or not?", mes_example: "", creator_notes: "", system_prompt: "", post_history_instructions: "", tags: [], creator: "test", character_version: "1.0", alternate_greetings: [], extensions: {} } });
const chats = await api("GET", "/chats");
let chat = (chats.chats ?? chats).find?.((x) => x.name === "Harbor test");
if (!chat) {
  chat = await api("POST", "/chats", { name: "Harbor test", mode: "roleplay", characterIds: [c.id] });
  const lines = [["assistant", "*Lanterns sway along the pier as Wren coils a rope.* The tide's turning. You coming aboard or not?"], ["user", "I hand her the sealed letter. \"Only if we leave before the harbor master wakes.\""], ["assistant", "*She breaks the seal, reads, and grins.* Then we leave now. Mind the gangplank, it's slick."]];
  for (const [role, content] of lines) await api("POST", `/chats/${chat.id}/messages`, { chatId: chat.id, role, content, characterId: role === "assistant" ? c.id : null });
}
console.log(JSON.stringify({ chat: chat.id, character: c.id }));
