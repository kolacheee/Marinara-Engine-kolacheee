// The Earth seed's news (owner 2026-11-08): a game on the real Earth can look up the names of the real
// events up to the story's day; it is looked up, never pushed, and never shows a day after today. Other
// games never get the tool.
import assert from "node:assert/strict";
import { isChatToolResolved } from "../../packages/server/src/services/generation/tool-resolution-runtime.js";
import { loadWorldEarthNews } from "../../packages/server/src/services/game/earth-data.js";
import {
  gameHasEarthNews,
  readNewsDate,
  worldNewsAnswer,
} from "../../packages/server/src/services/game/world-news.service.js";
import { worldEarthNews } from "@marinara-engine/shared";

const data = await loadWorldEarthNews();
const names = (result: ReturnType<typeof worldNewsAnswer>) => {
  if ("error" in result) throw new Error(result.error);
  return result.items.map((item) => item.name);
};

// A party in Tokyo on 12 September 2001 hears of New York.
const tokyo: Record<string, unknown> = {
  gameWorld: { seed: 1, generatorVersion: 10, brief: { earth: { year: 2001, cities: [] } } },
};
assert.ok(gameHasEarthNews(tokyo));
assert.ok(names(worldNewsAnswer(data, tokyo, { date: "2001-09-12" })).includes("September 11 attacks"));
assert.ok(
  !names(worldNewsAnswer(data, tokyo, { date: "2001-09-10" })).includes("September 11 attacks"),
  "never a day after today",
);
const asked = names(worldNewsAnswer(data, tokyo, { date: "2001-12-31", about: "attacks" }));
assert.ok(asked.includes("September 11 attacks") && asked.includes("2001 anthrax attacks"), "looked up by words");

// Dates as the GM writes them.
assert.deepEqual(readNewsDate("2001-09-11"), { year: 2001, month: 9, day: 11 });
assert.deepEqual(readNewsDate("-0043-03-15"), { year: -42, month: 3, day: 15 });
assert.equal(readNewsDate("someday"), null);
// The Ides of March, 44 BC (year -43), with the slow-news note.
const ides = worldEarthNews(data, { year: -43, month: 3, day: 20, days: 10, about: "Caesar" });
assert.ok(ides.items.some((item) => item.name === "Death of Julius Caesar") && ides.note);
// 1066: Hastings, by its name.
assert.ok(
  worldEarthNews(data, { year: 1066, month: 10, day: 20 }).items.some((item) => item.name === "Battle of Hastings"),
);

// A drawn world has no real news, and never the tool.
const drawn = { gameWorld: { seed: 1, generatorVersion: 10, brief: {} } };
assert.ok(!gameHasEarthNews(drawn));
assert.ok("error" in worldNewsAnswer(data, drawn, { date: "2001-09-11" }));
const flags = { enableChatTools: true, activeToolIds: [] as string[] };
assert.equal(isChatToolResolved("world_news", { ...flags, autoAttachToolNames: [] }), false, "no chat's own tool");
assert.equal(isChatToolResolved("world_news", { ...flags, autoAttachToolNames: ["world_news"] }), true);

console.log("world-earth-news: ok");
