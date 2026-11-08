// The Earth seed's news (owner 2026-11-08): a game on the real Earth can look up the real news up to the
// story's day, the world's and its country's own; it is looked up, never pushed, and never shows a day after
// today. Other games never get the tool.
import assert from "node:assert/strict";
import {
  isChatToolResolved,
  resolveGenerationTools,
} from "../../packages/server/src/services/generation/tool-resolution-runtime.js";
import { loadWorldEarthNews } from "../../packages/server/src/services/game/earth-data.js";
import {
  gameHasEarthNews,
  readNewsDate,
  worldNewsAnswer,
} from "../../packages/server/src/services/game/world-news.service.js";
import { worldEarthNews } from "@marinara-engine/shared";

const data = await loadWorldEarthNews();

// A party in Tokyo on 11 September 2001 (and on the 12th) hears of New York.
const tokyo: Record<string, unknown> = {
  gameWorld: {
    seed: 1,
    generatorVersion: 10,
    brief: { earth: { year: 2001, cities: [{ name: "Tokyo", country: "Japan", pop: 35_000_000 }] } },
  },
};
assert.ok(gameHasEarthNews(tokyo));
const day = worldNewsAnswer(data, tokyo, { date: "2001-09-11" });
assert.ok(!("error" in day));
if ("error" in day) throw new Error(day.error);
assert.equal(day.country, "Japan", "the party's own country by default");
assert.ok(
  day.items.some((item) => item.scope === "world" && /September 11 attacks/.test(item.text)),
  "the attacks are the day's news",
);
const before = worldNewsAnswer(data, tokyo, { date: "2001-09-10" });
if ("error" in before) throw new Error(before.error);
assert.ok(!before.items.some((item) => /September 11 attacks/.test(item.text)), "never a day after today");
const asked = worldNewsAnswer(data, tokyo, { date: "2001-12-01", about: "World Trade Center" });
if ("error" in asked) throw new Error(asked.error);
assert.ok(asked.items.length > 0, "looked up by words, months later");
assert.ok(asked.items.every((item) => /world trade center/i.test(item.text + (item.where ?? ""))));
// Another country's own news only when asked for.
const us = worldNewsAnswer(data, tokyo, { date: "2001-09-11", country: "USA" });
if ("error" in us) throw new Error(us.error);
assert.equal(us.country, "United States of America");
assert.ok(us.items.some((item) => item.scope === "country"));
assert.ok(!day.items.some((item) => item.scope === "country" && /Brazilians/.test(item.text)));

// Dates as the GM writes them.
assert.deepEqual(readNewsDate("2001-09-11"), { year: 2001, month: 9, day: 11 });
assert.deepEqual(readNewsDate("-0043-03-15"), { year: -42, month: 3, day: 15 });
assert.equal(readNewsDate("someday"), null);
// The Ides of March, 44 BC.
const ides = worldEarthNews(data, { year: -43, month: 3, day: 20, days: 10, about: "Caesar" });
assert.ok(ides.items.length > 0 && ides.note, "Caesar's death, with the slow-news note");

// A drawn world has no real news, and never the tool.
const drawn = { gameWorld: { seed: 1, generatorVersion: 10, brief: {} } };
assert.ok(!gameHasEarthNews(drawn));
assert.ok("error" in worldNewsAnswer(data, drawn, { date: "2001-09-11" }));
const flags = { enableChatTools: true, activeToolIds: [] as string[] };
assert.equal(isChatToolResolved("world_news", { ...flags, autoAttachToolNames: [] }), false, "no chat's own tool");
assert.equal(isChatToolResolved("world_news", { ...flags, autoAttachToolNames: ["world_news"] }), true);

console.log("world-earth-news: ok");
