import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { WORLD_GENERATOR_VERSION, WORLD_STARTER_KITS, compileGameWorld, parseWorldKit } from "@marinara-engine/shared";
import { openGame } from "./game-ruleset-fight-fixture.js";

/**
 * Region spawns on the overworld: an MRPG game's Danger view shades the land by its level band and shows each
 * settlement's band; a settlement's band set from its card is kept in the world's edits and shown at once,
 * and taken back to the map's.
 */

/** A local model that answers every turn the same, and keeps every prompt it was sent. */
async function fakeModel(reply: string): Promise<{ server: Server; baseUrl: string; prompts: string[] }> {
  const prompts: string[] = [];
  const server = createServer(async (incoming, response) => {
    let body = "";
    for await (const chunk of incoming) body += chunk;
    if (incoming.method !== "POST") {
      response.writeHead(404).end();
      return;
    }
    prompts.push(body);
    response.writeHead(200, { "content-type": "text/event-stream", connection: "close" });
    const write = (delta: unknown, finishReason: string | null = null) =>
      response.write(`data: ${JSON.stringify({ choices: [{ index: 0, delta, finish_reason: finishReason }] })}\n\n`);
    write({ content: reply });
    write({}, "stop");
    response.end("data: [DONE]\n\n");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("The model fixture did not bind");
  return { server, baseUrl: `http://127.0.0.1:${address.port}/v1`, prompts };
}

const parsedKit = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === "high_fantasy")!);
if (!parsedKit.ok) throw new Error("The high fantasy kit does not read");
const kit = parsedKit.kit;
const brief = {
  briefVersion: 1 as const,
  premise: "The old king is dying and the river provinces quarrel over the succession.",
  places: [
    { name: "Aldmark", layer: "realm", tags: [] },
    { name: "The Fenlands", layer: "province", parent: "Aldmark", tags: [] },
    { name: "Hollin", layer: "settlement", parent: "The Fenlands", size: "village", tags: [], start: true as const },
    { name: "Thornmere", layer: "settlement", parent: "The Fenlands", size: "city", tags: ["port"] },
  ],
  placeNames: [{ culture: kit.cultures[0]!.id, names: ["Ashby", "Wending", "Calder", "Ravel", "Brennock", "Sallow"] }],
  groups: [],
  peopleNames: [] as Array<{ culture: string; given: string[]; family: string[]; order: "given-family" }>,
  events: [],
};
const gameWorld = { seed: 20261002, generatorVersion: WORLD_GENERATOR_VERSION, grounding: "expand" as const, brief };
const world = compileGameWorld({ kit, seed: gameWorld.seed, grounding: "expand", brief });
const thornmere = world.places.find((place) => place.name === "Thornmere")!;

async function metadataOf(request: APIRequestContext, chatId: string) {
  const row = await (await request.get(`/api/chats/${chatId}`)).json();
  return (typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata) as Record<string, any>;
}

test("the Danger view shows each settlement's band, and a band set on a card is kept", async ({
  page,
  request,
}, testInfo) => {
  test.setTimeout(120_000);
  const model = await fakeModel("Mist lies on the reeds.");
  let connectionId = "";
  let chatId = "";
  try {
    const connection = await request.post("/api/connections", {
      data: {
        name: "Local bands fixture",
        provider: "custom",
        baseUrl: model.baseUrl,
        apiKey: "synthetic-test-key",
        model: "bands-fixture",
        maxContext: 32768,
        treatAsLocalEndpoint: true,
      },
    });
    expect(connection.ok()).toBeTruthy();
    connectionId = (await connection.json()).id;
    const created = await request.post("/api/chats", {
      data: { name: "Bands", mode: "game", characterIds: [], connectionId },
    });
    expect(created.ok()).toBeTruthy();
    chatId = ((await created.json()) as { id: string }).id;
    const meta = await request.patch(`/api/chats/${chatId}/metadata`, {
      data: {
        gameId: `bands-${chatId}`,
        gameSessionStatus: "active",
        gameIntroPresented: true,
        gameImageAutoGenerationEnabled: false,
        enableAgents: false,
        enableTools: false,
        gameSetupConfig: { marinaraClasses: true, genre: "fantasy", difficulty: "normal" },
        gameWorldKit: kit,
        gameWorld,
        gameTime: { day: 1, hour: 12, minute: 0 },
      },
    });
    expect(meta.ok(), await meta.text()).toBeTruthy();
    expect(
      (
        await request.post(`/api/chats/${chatId}/messages`, {
          data: { role: "assistant", content: "Mist lies on the reeds around Hollin." },
        })
      ).ok(),
    ).toBeTruthy();
    await openGame(page, chatId);
    const overworld = page.getByRole("region", { name: "Overworld", exact: true });
    await expect(overworld).toBeVisible({ timeout: 40_000 });

    // The view is off until asked for; on, the start's land shows 1 to 4.
    const danger = page.locator('[data-component="WorldOverworld.Danger"]');
    await expect(danger).toBeVisible({ timeout: 20_000 });
    await danger.click();
    await expect(danger).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^Hollin, .*: the party is here$/u }).click();
    const band = page.locator('[data-component="WorldOverworld.Band"]');
    await expect(band).toContainText("Foes here: level 1 to 4");
    await expect(band).toContainText("Set by the map");
    await page.screenshot({ path: testInfo.outputPath("danger-view.png") });

    // A band set on Thornmere's card is kept in the world's edits and shown.
    // Thornmere may lie off the view: it is picked from the places list.
    await page.getByRole("button", { name: "Places", exact: true }).click();
    await page
      .getByRole("list", { name: "Places" })
      .getByRole("button", { name: /^Thornmere/u })
      .click();
    await expect(band).toContainText("Foes here: level");
    await expect(page.locator('[data-component="WorldOverworld.Band"]').locator("..")).toContainText("Thornmere");
    const inputs = band.locator('input[type="number"]');
    await inputs.nth(0).fill("12");
    await inputs.nth(1).fill("15");
    await band.getByRole("button", { name: "Save band" }).click();
    await expect(band).toContainText("Foes here: level 12 to 15", { timeout: 20_000 });
    await expect(band).toContainText("Set by you");
    const saved = await metadataOf(request, chatId);
    expect(saved.gameWorld.edits.bands).toEqual([{ place: thornmere.id, low: 12, high: 15 }]);
    await page.screenshot({ path: testInfo.outputPath("band-saved.png") });

    // Taken back to the map's.
    await band.getByRole("button", { name: /^Use the map/u }).click();
    await expect(band).toContainText("Set by the map", { timeout: 20_000 });
    expect((await metadataOf(request, chatId)).gameWorld.edits?.bands ?? []).toEqual([]);
  } finally {
    model.server.close();
    if (chatId) await request.delete(`/api/chats/${chatId}`);
    if (connectionId) await request.delete(`/api/connections/${connectionId}`);
  }
});
