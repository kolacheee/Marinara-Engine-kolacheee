import { expect, test } from "@playwright/test";
import { gameDungeonPlannedMap, sitePlanInputFor } from "@marinara-engine/shared";
import { openGame } from "./game-ruleset-fight-fixture.js";

/**
 * Building plans (owner 2026-11-14): a haunted manor is laid out as a whole house, drawn as one without a
 * tile pack; rooms the party has not been into stay dark, a found trap shows, the room the party stands in
 * is named, and the stairs lead to the level named on the button, and back.
 */
test("a haunted manor's stairs lead to its other floors and back", async ({ page, request }, testInfo) => {
  test.setTimeout(180_000);
  const created = await request.post("/api/chats", { data: { name: "Manor", mode: "game", characterIds: [] } });
  expect(created.ok()).toBeTruthy();
  const chatId = ((await created.json()) as { id: string }).id;
  const plan = sitePlanInputFor({ template: "manor", name: "Haunted Ashgrove Manor", seed: 7, wealth: 2 });
  const map = gameDungeonPlannedMap({ plan, name: "Haunted Ashgrove Manor", id: "manor-1", traps: true });
  const site = map.site!;
  const link = map.links![0]!;
  // Half the rooms seen, so the rest stay dark; one trap found.
  const seen = map.rooms.map((_, index) => index).filter((index) => index % 2 === 0);
  const traps = (map.traps ?? []).map((trap, index) => (index === 0 ? { ...trap, found: true as const } : trap));
  const meta = await request.patch(`/api/chats/${chatId}/metadata`, {
    data: {
      gameId: `manor-${chatId}`,
      gameSessionStatus: "active",
      gameIntroPresented: true,
      gameStyle: "overworld",
      gameImageAutoGenerationEnabled: false,
      enableAgents: false,
      enableTools: false,
      gameTime: { day: 2, hour: 22, minute: 0 },
      gameSetupConfig: { marinaraClasses: true, genre: "fantasy" },
      gameWorldKit: { id: "high_fantasy" },
      gameDungeonMap: {
        ...map,
        at: { x: link.x, y: link.y },
        site: { ...site, seen: { [String(site.level)]: seen } },
        ...(traps.length ? { traps } : {}),
      },
      gameDungeonView: "map",
    },
  });
  expect(meta.ok(), await meta.text()).toBeTruthy();
  await request.post(`/api/chats/${chatId}/messages`, {
    data: { role: "assistant", content: "The front door creaks shut behind you." },
  });
  await openGame(page, chatId);
  const view = page.locator('[data-component="DungeonMapView"]');
  await expect(view).toBeVisible({ timeout: 30_000 });
  await expect(view).toHaveAttribute("data-tiles", "plain");
  const here = site.levels[site.level]!.name;
  const there = site.levels[link.level]!.name;
  await expect(page.getByRole("status").filter({ hasText: here })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "in the hall" })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: testInfo.outputPath("manor-ground.png") });
  const down = link.level > site.level;
  await page.getByRole("button", { name: `Go ${down ? "down" : "up"} to ${there}` }).click();
  await expect(page.getByRole("status").filter({ hasText: there })).toBeVisible({ timeout: 15_000 });
  // The floor list: both floors, the one the party is on marked.
  await expect(page.getByRole("list", { name: "Floors visited" }).getByRole("listitem")).toHaveCount(2);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: testInfo.outputPath("manor-next.png") });
  const after = (await (await request.get(`/api/game/${chatId}/map`)).json()) as {
    map: { site: { level: number; seen: Record<string, number[]> } };
  };
  expect(after.map.site.level).toBe(link.level);
  // What the party saw on the floor it left is kept.
  expect(after.map.site.seen[String(site.level)]).toEqual(seen);
  await page.getByRole("button", { name: `Go ${down ? "up" : "down"} to ${here}` }).click();
  await expect(page.getByRole("status").filter({ hasText: here })).toBeVisible({ timeout: 15_000 });
  const back = (await (await request.get(`/api/game/${chatId}/map`)).json()) as {
    map: { at: { x: number; y: number } };
  };
  expect(back.map.at).toEqual({ x: link.x, y: link.y });
});
