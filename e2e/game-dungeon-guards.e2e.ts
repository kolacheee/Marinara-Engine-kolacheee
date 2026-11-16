import { expect, test } from "@playwright/test";
import {
  dungeonFromGameDungeonMap,
  dungeonWalkable,
  gameDungeonMapFromDungeon,
  gameDungeonSiteMap,
  generateDungeonMap,
} from "@marinara-engine/shared";
import { openGame } from "./game-ruleset-fight-fixture.js";

/**
 * Dungeon spawns on screen (owner 2026-11-13): in a Classic game, the holders' guard posts stand on the
 * dungeon map as figures in red, the heart's chief crowned; the squatters stay hidden.
 */
test("a crypt's holders stand guard on its map", async ({ page, request }, testInfo) => {
  test.setTimeout(180_000);
  const created = await request.post("/api/chats", { data: { name: "Barrow", mode: "game", characterIds: [] } });
  expect(created.ok()).toBeTruthy();
  const chatId = ((await created.json()) as { id: string }).id;
  const map = gameDungeonMapFromDungeon(generateDungeonMap("dungeon_crypt", 9, "medium"), "Grey Barrow", "map-1");
  const meta = await request.patch(`/api/chats/${chatId}/metadata`, {
    data: {
      gameId: `barrow-${chatId}`,
      gameSessionStatus: "active",
      gameIntroPresented: true,
      gameStyle: "overworld",
      gameImageAutoGenerationEnabled: false,
      enableAgents: false,
      enableTools: false,
      gameTime: { day: 2, hour: 9, minute: 0 },
      gameSetupConfig: { marinaraClasses: true, genre: "fantasy" },
      gameWorldKit: { id: "high_fantasy" },
      gameDungeonMap: map,
      gameDungeonView: "map",
      gameDungeonSites: { "name:grey barrow": { band: { low: 6, high: 10 }, cleared: {} } },
    },
  });
  expect(meta.ok(), await meta.text()).toBeTruthy();
  await request.post(`/api/chats/${chatId}/messages`, {
    data: { role: "assistant", content: "The barrow door stands open." },
  });
  const answer = await (await request.get(`/api/game/${chatId}/map`)).json();
  expect(answer.guards.length).toBeGreaterThan(0);
  expect(answer.guards.some((guard: { heart: boolean }) => guard.heart)).toBeTruthy();
  // The party stands near the heart, so its chief is on screen.
  const heart = answer.guards.find((guard: { heart: boolean }) => guard.heart) as { x: number; y: number };
  const cells = dungeonFromGameDungeonMap(map);
  const near = [-2, 2, -3, 3, -1, 1]
    .flatMap((dx) => [-1, 0, 1].map((dy) => ({ x: heart.x + dx, y: heart.y + dy })))
    .find((at) => dungeonWalkable(cells, at.x, at.y))!;
  expect(near).toBeTruthy();
  await request.patch(`/api/chats/${chatId}/metadata`, { data: { gameDungeonMap: { ...map, at: near } } });
  await openGame(page, chatId);
  const view = page.locator('[data-component="DungeonMapView"]');
  await expect(view).toBeVisible({ timeout: 30_000 });
  await expect(view).toHaveAttribute("data-tiles", /plain|image/);
  await page.waitForTimeout(1500);
  await view.screenshot({ path: testInfo.outputPath("dungeon-guards.png") });
});

/** Floors (owner 2026-11-13: separate maps per floor): from the way down the party goes to the next floor,
 *  and from that floor's way in back up. */
// A crypt is a planned building now (its levels are joined by its own stairs), so floors are a sewer's.
test("a sewer's way down leads to its next floor and back", async ({ page, request }, testInfo) => {
  test.setTimeout(180_000);
  const created = await request.post("/api/chats", { data: { name: "Sewer", mode: "game", characterIds: [] } });
  const chatId = ((await created.json()) as { id: string }).id;
  let map = gameDungeonSiteMap({ setId: "dungeon_sewer", name: "Grey Drains", siteSeed: 9, id: "floor-1" });
  for (let seed = 10; !map.down && seed < 200; seed++)
    map = gameDungeonSiteMap({ setId: "dungeon_sewer", name: "Grey Drains", siteSeed: seed, id: "floor-1" });
  expect(map.down, "some sewer has a way down").toBeTruthy();
  const meta = await request.patch(`/api/chats/${chatId}/metadata`, {
    data: {
      gameId: `sewer-${chatId}`,
      gameSessionStatus: "active",
      gameIntroPresented: true,
      gameStyle: "overworld",
      gameImageAutoGenerationEnabled: false,
      enableAgents: false,
      enableTools: false,
      gameSetupConfig: { marinaraClasses: true, genre: "fantasy" },
      gameWorldKit: { id: "high_fantasy" },
      gameDungeonMap: { ...map, at: map.down },
      gameDungeonView: "map",
    },
  });
  expect(meta.ok(), await meta.text()).toBeTruthy();
  await request.post(`/api/chats/${chatId}/messages`, { data: { role: "assistant", content: "Steps lead down." } });
  await openGame(page, chatId);
  const view = page.locator('[data-component="DungeonMapView"]');
  await expect(view).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("status").filter({ hasText: `floor 1 of ${map.floors}` })).toBeVisible();
  await page.getByRole("button", { name: "Go down to floor 2" }).click();
  await expect(page.getByRole("status").filter({ hasText: `floor 2 of ${map.floors}` })).toBeVisible({
    timeout: 15_000,
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: testInfo.outputPath("dungeon-floor-2.png") });
  await page.getByRole("button", { name: "Go up to floor 1" }).click();
  await expect(page.getByRole("status").filter({ hasText: `floor 1 of ${map.floors}` })).toBeVisible({
    timeout: 15_000,
  });
  const back = await (await request.get(`/api/game/${chatId}/map`)).json();
  expect(back.map.at).toEqual(map.down);
});

/** Caught (owner 2026-11-16: enemies catching up with the party start combat): a walk into a held room
 *  stops on its first step inside, and says who caught the party. */
test("a walk into the holders' room stops where they catch the party", async ({ request }) => {
  test.setTimeout(120_000);
  const created = await request.post("/api/chats", { data: { name: "Barrow", mode: "game", characterIds: [] } });
  const chatId = ((await created.json()) as { id: string }).id;
  const map = gameDungeonMapFromDungeon(generateDungeonMap("dungeon_crypt", 9, "medium"), "Grey Barrow", "map-1");
  await request.patch(`/api/chats/${chatId}/metadata`, {
    data: {
      gameId: `barrow-${chatId}`,
      gameSessionStatus: "active",
      gameIntroPresented: true,
      gameStyle: "overworld",
      gameTime: { day: 2, hour: 9, minute: 0 },
      gameSetupConfig: { marinaraClasses: true, genre: "fantasy" },
      gameWorldKit: { id: "high_fantasy" },
      gameDungeonMap: map,
      gameDungeonView: "map",
      gameDungeonSites: { "name:grey barrow": { band: { low: 6, high: 10 }, cleared: {} } },
    },
  });
  await request.post(`/api/chats/${chatId}/messages`, { data: { role: "assistant", content: "The door is open." } });
  const answer = await (await request.get(`/api/game/${chatId}/map`)).json();
  const heart = answer.guards.find((guard: { heart: boolean }) => guard.heart) as { x: number; y: number };
  const walked = await request.post(`/api/game/${chatId}/map/walk`, { data: { map: "map-1", x: heart.x, y: heart.y } });
  expect(walked.ok(), await walked.text()).toBeTruthy();
  const result = (await walked.json()) as {
    map: { at: { x: number; y: number } };
    step: { met?: { area: number; name: string } };
  };
  expect(result.step.met).toBeTruthy();
  const room = map.rooms[result.step.met!.area - 1]!;
  const at = result.map.at;
  expect(at.x >= room.x && at.x < room.x + room.w && at.y >= room.y && at.y < room.y + room.h).toBeTruthy();
});
