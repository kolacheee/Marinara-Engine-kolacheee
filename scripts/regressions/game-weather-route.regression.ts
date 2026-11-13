/**
 * POST /game/weather/update reads the weather from the world where the party is (world-weather.service).
 *
 *   - An Earth game in Cairo: the climate is hot desert, the season the place's own, and a scene asking
 *     for snow in summer gets the nearest weather that fits; the Game Master's note says what cannot be.
 *   - A weather that was set holds for a while, then the sky takes over.
 *   - A game with no map reads the place's name: snow asked for in a desert at noon in summer is refused.
 *   - The weather follows the clock without random rerolls: two reads at the same time agree.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

import Fastify from "../../packages/server/node_modules/fastify/fastify.js";
import {
  WORLD_GENERATOR_VERSION,
  WORLD_STARTER_KITS,
  parseWorldKit,
  sampleWorldEarth,
  withWorldEarth,
  worldBriefSchema,
  type WorldEarthData,
} from "../../packages/shared/src/index.js";
import { gameRoutes } from "../../packages/server/src/routes/game.routes.js";
import { createChatsStorage } from "../../packages/server/src/services/storage/chats.storage.js";

const dir = new URL("../../packages/server/src/assets/earth/", import.meta.url);
const data: WorldEarthData = {
  grid: { width: 3600, height: 1800, planes: new Uint8Array(gunzipSync(readFileSync(new URL("earth-grid.bin", dir)))) },
  features: JSON.parse(gunzipSync(readFileSync(new URL("earth-features.json.gz", dir))).toString("utf8")),
  coast: {
    width: 18000,
    height: 9000,
    bits: new Uint8Array(gunzipSync(readFileSync(new URL("earth-coast.bin", dir)))),
  },
};
const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
assert.ok(parsed.ok);
const kit = parsed.kit;
const settlement = kit.layers.find((layer) => layer.settlements)!.id;

const { getDB, closeDB } = await import("../../packages/server/src/db/connection.js");
const db = await getDB();
const chats = createChatsStorage(db);
const app = Fastify();
app.decorate("db", db);
await app.register(gameRoutes, { prefix: "/api/game" });
const made: string[] = [];

type Weather = {
  type: string;
  temperature: number;
  climate?: { zone: string; seasonLabel: string };
  note?: string;
  forced?: { type: string; asked: string; until: number };
};
const update = async (chatId: string, payload: Record<string, unknown>) => {
  const response = await app.inject({
    method: "POST",
    url: "/api/game/weather/update",
    payload: { chatId, ...payload },
  });
  assert.equal(response.statusCode, 200, response.body);
  return JSON.parse(response.body) as { changed: boolean; weather: Weather };
};
const meta = async (chatId: string) => JSON.parse((await chats.getById(chatId))!.metadata) as Record<string, unknown>;

try {
  // ── An Earth game in Cairo, midsummer noon ──
  {
    const brief = withWorldEarth(
      worldBriefSchema.parse({
        briefVersion: 1,
        premise: "A caravan season.",
        places: [{ name: "Cairo", layer: settlement, start: true }],
      }),
      sampleWorldEarth(data, { lon: 31.2, lat: 30.0, scale: kit.scale }),
    );
    const chat = await chats.create({ name: "Weather", mode: "game", characterIds: [] });
    made.push(chat.id);
    await chats.patchMetadata(chat.id, {
      gameWorldKit: kit,
      gameWorld: { seed: 5, generatorVersion: WORLD_GENERATOR_VERSION, grounding: "expand", brief },
      gameTime: { day: 135, hour: 13, minute: 0 },
    });
    const natural = await update(chat.id, { action: "explore" });
    assert.equal(natural.weather.climate?.zone, "hot_desert", JSON.stringify(natural.weather));
    assert.equal(natural.weather.climate?.seasonLabel, "summer");
    assert.ok(natural.weather.temperature >= 25, `a desert summer noon is hot: ${natural.weather.temperature}`);
    assert.match(natural.weather.note ?? "", /Not possible here now: .*snow/);
    assert.deepEqual((await update(chat.id, { action: "explore" })).weather.type, natural.weather.type, "no reroll");

    const snow = await update(chat.id, { action: "set", type: "snow" });
    assert.notEqual(snow.weather.type, "snow", "no snow in Cairo in summer");
    assert.equal(snow.weather.forced?.asked, "snow");
    const stored = (await meta(chat.id)).gameWeather as Weather;
    assert.equal(stored.type, snow.weather.type, "kept on the chat");

    const storm = await update(chat.id, { action: "set", type: "storm" });
    assert.equal(storm.weather.type, "storm", "a rare desert storm can be set");
    assert.equal((await update(chat.id, { action: "explore" })).weather.type, "storm", "and holds a while");
    await chats.patchMetadata(chat.id, { gameTime: { day: 136, hour: 13, minute: 0 } });
    const later = await update(chat.id, { action: "explore" });
    assert.equal(later.weather.forced, undefined, "a day on, the sky has taken over");
  }

  // ── A game with no map ──
  {
    const chat = await chats.create({ name: "Weather, no map", mode: "game", characterIds: [] });
    made.push(chat.id);
    await chats.patchMetadata(chat.id, { gameTime: { day: 135, hour: 13, minute: 0 } });
    const snow = await update(chat.id, { action: "set", type: "snow", location: "The Desert of Bones" });
    assert.notEqual(snow.weather.type, "snow");
    assert.equal(snow.weather.climate?.zone, "hot_desert");
    const winter = await chats.patchMetadata(chat.id, { gameTime: { day: 300, hour: 8, minute: 0 } });
    assert.ok(winter);
    const mountain = await update(chat.id, { action: "set", type: "snow", location: "Mountain pass" });
    assert.equal(mountain.weather.type, "snow", "a mountain pass in winter can snow");
  }
  console.log("Game weather route regression passed.");
} finally {
  for (const id of made) await chats.remove(id).catch(() => {});
  await app.close();
  await closeDB();
}
