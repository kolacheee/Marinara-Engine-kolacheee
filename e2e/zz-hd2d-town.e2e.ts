// HD-2D towns (fork): a fantasy game's settlement opens as the walkable 3D town; walking through a door is
// a town visit; the party's spot and the town's layout for the Game Master are kept with the game.
// Needs WebGL (headless Chromium with SwiftShader works). Shots go to the test's output folder.
import { expect, test } from "@playwright/test";
import { WORLD_GENERATOR_VERSION, WORLD_STARTER_KITS, parseWorldKit } from "@marinara-engine/shared";
import { openGame } from "./game-ruleset-fight-fixture.js";

const SIZE = process.env.HD2D_SIZE ?? "town";

test(`HD-2D ${SIZE} opens from the overworld`, async ({ page, request }, testInfo) => {
  test.setTimeout(600_000);
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === "high_fantasy")!);
  if (!parsed.ok) throw new Error("kit");
  const kit = parsed.kit;
  const brief = {
    briefVersion: 1 as const,
    premise: "Quarrels over the succession.",
    places: [
      { name: "Aldmark", layer: "realm", tags: [] },
      { name: "The Fenlands", layer: "province", parent: "Aldmark", tags: [] },
      {
        name: "Hollin",
        layer: "settlement",
        parent: "The Fenlands",
        size: SIZE,
        tags: ["market"],
        start: true as const,
      },
      { name: "Thornmere", layer: "settlement", parent: "The Fenlands", size: "village", tags: [] },
      { name: "The Gilded Goose", layer: "place", parent: "Hollin", tags: ["inn", "tavern"] },
    ],
    placeNames: [
      { culture: kit.cultures[0]!.id, names: ["Ashby", "Wending", "Calder", "Ravel", "Brennock", "Sallow"] },
    ],
    groups: [],
    peopleNames: [],
    events: [],
  };
  const created = await request.post("/api/chats", { data: { name: "HD-2D town", mode: "game", characterIds: [] } });
  const chatId = ((await created.json()) as { id: string }).id;
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (/\/town\/(visit|home)/u.test(response.url())) console.log("api", response.status(), response.url());
  });
  try {
    await request.patch(`/api/chats/${chatId}/metadata`, {
      data: {
        gameId: `hd2d-${chatId}`,
        gameSessionStatus: "active",
        gameIntroPresented: true,
        gameImageAutoGenerationEnabled: false,
        enableAgents: false,
        enableTools: false,
        gameWorldKit: kit,
        gameWorld: { seed: 20261124, generatorVersion: WORLD_GENERATOR_VERSION, grounding: "expand", brief },
        gameTime: { day: 100, hour: 11, minute: 0 },
      },
    });
    await request.post(`/api/chats/${chatId}/messages`, {
      data: { role: "assistant", content: 'The gates of Hollin. [place: name="Hollin" result="ok"]' },
    });
    await openGame(page, chatId);
    await expect(page.getByRole("region", { name: "Overworld", exact: true })).toBeVisible({ timeout: 40_000 });
    if (SIZE === "city") {
      // A city near the party is made ahead on the overworld and kept in the browser.
      const t0 = Date.now();
      await expect
        .poll(
          () =>
            page.evaluate(
              () =>
                new Promise<number>((resolve) => {
                  const open = indexedDB.open("hd2d-cities", 1);
                  open.onupgradeneeded = () => open.result.createObjectStore("c");
                  open.onsuccess = () => {
                    try {
                      const count = open.result.transaction("c").objectStore("c").count();
                      count.onsuccess = () => resolve(count.result);
                      count.onerror = () => resolve(0);
                    } catch {
                      resolve(0);
                    }
                  };
                  open.onerror = () => resolve(0);
                }),
            ),
          { timeout: 120_000 },
        )
        .toBeGreaterThan(0);
      console.log("city made ahead in", Date.now() - t0, "ms");
    }
    const entering = Date.now();
    await page.getByRole("button", { name: /: the party is here$/u }).click();
    await page.getByRole("button", { name: /^Enter /u }).click();
    await expect(page.getByTestId("hd2d-town")).toBeVisible();
    await page.waitForFunction(() => (window as unknown as { __hd2d?: { world?: unknown } }).__hd2d?.world, null, {
      timeout: 400_000,
    });
    console.log("town up", Date.now() - entering, "ms after entering");
    await page.waitForTimeout(6000);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-arrive.png`) });
    // The weather is drawn over the town and changes without a rebuild.
    await page.evaluate(() => (window as unknown as { __hd2d: { setWeather(w: string): void } }).__hd2d.setWeather("storm"));
    await page.waitForTimeout(3000);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-storm.png`) });
    await page.evaluate(() => (window as unknown as { __hd2d: { setWeather(w: string): void } }).__hd2d.setWeather("clear"));
    // The layout for the Game Master is kept once the town is up.
    await expect
      .poll(
        async () => {
          const chat = (await (await request.get(`/api/chats/${chatId}`)).json()) as { metadata: unknown };
          const meta = typeof chat.metadata === "string" ? JSON.parse(chat.metadata) : chat.metadata;
          return (meta as { gameTownHd2dBrief?: { text?: string } }).gameTownHd2dBrief?.text ?? "";
        },
        { timeout: 60_000 },
      )
      .toMatch(/people/u);
    // The town's plan is kept as first seen, and its chronicle comes with it.
    const keptTown = (
      (await (await request.get(`/api/game/${chatId}/town`)).json()) as {
        town: { hd2d?: { kept: boolean; spec: { seed: number }; chron: { prosperity: string } } | null } | null;
      }
    ).town?.hd2d;
    expect(keptTown?.kept).toBe(true);
    expect(keptTown?.chron.prosperity).toMatch(/thriving|modest|struggling/u);
    // Walk through the nearest door: a visit, told on the next turn.
    const entered = await page.evaluate(() => {
      const api = (
        window as unknown as {
          __hd2d: { __in: { doorNear: (d: number) => unknown; enterHouse: (h: unknown) => unknown } };
        }
      ).__hd2d;
      const door = api.__in.doorNear(40);
      if (!door) return false;
      api.__in.enterHouse(door);
      return true;
    });
    expect(entered).toBe(true);
    await page.waitForTimeout(4000);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-inside.png`) });
    await expect
      .poll(
        async () =>
          ((await (await request.get(`/api/game/${chatId}/town`)).json()) as { town: { visit: unknown } | null }).town
            ?.visit ?? null,
        {
          timeout: 20_000,
        },
      )
      .not.toBeNull();
    const town = ((await (await request.get(`/api/game/${chatId}/town`)).json()) as { town: { visit: unknown } }).town;
    console.log("visit", JSON.stringify(town.visit));
    // The world's inn stands on a 3D building: walking into it is a visit to the world's own place.
    await page.evaluate(() =>
      (window as unknown as { __hd2d: { __in: { leaveHouse: () => void } } }).__hd2d.__in.leaveHouse(),
    );
    await page.waitForTimeout(1500);
    const inn = await page.evaluate(() => {
      const w = window as unknown as {
        __hd2dPlacing?: { byKey: Array<[string, string]> };
        __hd2d: {
          world: {
            P: { BENTRY: Array<{ bid: number; door: number[] }>; HOUSES: Array<{ plot?: number; door?: number[] }> };
          };
          __in: { enterHouse: (h: unknown) => unknown };
        };
      };
      const P = w.__hd2d.world.P;
      for (const [key, id] of w.__hd2dPlacing?.byKey ?? []) {
        const door = key.startsWith("b")
          ? P.BENTRY.find((e) => "b" + e.bid === key)
          : P.HOUSES.find((h) => h.door && "p" + h.plot === key);
        if (door && id) {
          w.__hd2d.__in.enterHouse(door);
          return { key, id };
        }
      }
      return null;
    });
    console.log("world building entered", JSON.stringify(inn));
    expect(inn).not.toBeNull();
    await expect
      .poll(
        async () =>
          (
            (await (await request.get(`/api/game/${chatId}/town`)).json()) as {
              town: { visit: { to: string } | null } | null;
            }
          ).town?.visit?.to ?? null,
        { timeout: 20_000 },
      )
      .toBe(inn!.id);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-world-place.png`) });
    // Homes (fork): an empty house's door offers it for sale, priced in the game's money; buying it takes
    // the coins and keeps the home's tag for the next reply.
    await page.evaluate(() => (window as unknown as { __hd2d: { __in: { leaveHouse: () => void } } }).__hd2d.__in.leaveHouse());
    await page.waitForTimeout(1500);
    await request.patch(`/api/chats/${chatId}/metadata`, {
      data: { gameInventory: [{ id: "purse-gold", name: "gold", item: "coin:gold", quantity: 400 }] },
    });
    const sale = await page.evaluate(() => {
      const w = window as unknown as {
        __hd2d: {
          world: { P: { HOUSES: Array<{ plot?: number; door?: number[]; empty?: boolean; W?: number; gen2?: unknown }> } };
          __in: { enterHouse: (h: unknown) => unknown };
        };
      };
      const houses = w.__hd2d.world.P.HOUSES.filter((h) => h.door && h.plot != null && h.W && !h.gen2);
      const house = houses.find((h) => h.empty) ?? houses[0];
      if (!house) return null;
      // A town whose past left no house empty: one is made empty for the check.
      house.empty = true;
      w.__hd2d.__in.enterHouse(house);
      return "p" + house.plot;
    });
    expect(sale).not.toBeNull();
    const card = page.locator('[data-component="Hd2dTownView.ForSale"]');
    await expect(card).toBeVisible({ timeout: 20_000 });
    await expect(card.getByRole("button", { name: "Buy" })).toBeEnabled({ timeout: 20_000 });
    console.log("for sale", await card.innerText());
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-for-sale.png`) });
    await page.evaluate(() => {
      (window as unknown as { __hd2dPlacing?: unknown }).__hd2dPlacing = undefined;
    });
    await card.getByRole("button", { name: "Buy" }).click();
    await expect(card).toBeHidden({ timeout: 20_000 });
    const homeMeta = (await (await request.get(`/api/chats/${chatId}`)).json()) as { metadata: unknown };
    const afterBuy = (typeof homeMeta.metadata === "string" ? JSON.parse(homeMeta.metadata) : homeMeta.metadata) as {
      gameHomesPending?: string[];
      gameInventory?: Array<{ item?: string; quantity: number }>;
    };
    console.log("bought", JSON.stringify(afterBuy.gameHomesPending), JSON.stringify(afterBuy.gameInventory));
    expect(afterBuy.gameHomesPending?.[0]).toContain(`house="${sale}"`);
    const goldLeft = (afterBuy.gameInventory ?? [])
      .filter((stack) => stack.item === "coin:gold")
      .reduce((sum, stack) => sum + stack.quantity, 0);
    expect(goldLeft).toBeLessThan(400);
    const homesNow = (
      (await (await request.get(`/api/game/${chatId}/town`)).json()) as { town: { homes?: Array<{ key?: string }> } }
    ).town.homes;
    expect(homesNow?.some((home) => home.key === sale)).toBe(true);
    const allHomes = ((await (await request.get(`/api/game/${chatId}/homes`)).json()) as {
      homes: Array<{ key?: string; place: string }>;
    }).homes;
    expect(allHomes.find((home) => home.key === sale)?.place).toBe("Hollin");
    // The house is the party's now: the town is drawn again with it lived in, and its door opens the Home
    // card, where what is left stays.
    await expect
      .poll(
        () =>
          page.evaluate(
            (key) =>
              (
                window as unknown as {
                  __hd2d?: { world?: { P: { HOUSES: Array<{ plot?: number; owned?: boolean }> } } };
                }
              ).__hd2d?.world?.P.HOUSES.some((h) => "p" + h.plot === key && h.owned) ?? false,
            sale,
          ),
        { timeout: 400_000 },
      )
      .toBe(true);
    // The town drawn again is placed before its doors are walked through.
    await page.waitForFunction(() => !!(window as unknown as { __hd2dPlacing?: unknown }).__hd2dPlacing, null, {
      timeout: 400_000,
    });
    await page.waitForTimeout(1000);
    await page.evaluate((key) => {
      const w = window as unknown as {
        __hd2d: { world: { P: { HOUSES: Array<{ plot?: number }> } }; __in: { enterHouse: (h: unknown) => unknown } };
      };
      w.__hd2d.__in.enterHouse(w.__hd2d.world.P.HOUSES.find((h) => "p" + h.plot === key));
    }, sale);
    const homeCard = page.locator('[data-component="Hd2dTownView.Home"]');
    await expect(homeCard).toBeVisible({ timeout: 20_000 });
    await homeCard.getByRole("button", { name: "Leave" }).first().click();
    await expect(homeCard.getByRole("button", { name: "Take" })).toBeVisible({ timeout: 20_000 });
    console.log("home", await homeCard.innerText());
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-home.png`) });
    // Outside again: the house lived in, its sign by the door.
    await page.evaluate(() => (window as unknown as { __hd2d: { __in: { leaveHouse: () => void } } }).__hd2d.__in.leaveHouse());
    await page.waitForTimeout(2500);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-home-outside.png`) });
    await expect
      .poll(
        async () =>
          ((await (await request.get(`/api/game/${chatId}/town`)).json()) as { town: { visit: { label?: string } | null } })
            .town.visit?.label ?? "",
        { timeout: 20_000 },
      )
      .toContain("home, the house on");
    // Sold again from its Home card: the Engine pays (the asking price less a fifth), what was kept there
    // comes back, and the sale waits for the next reply.
    await page.evaluate((key) => {
      const w = window as unknown as {
        __hd2d: { world: { P: { HOUSES: Array<{ plot?: number }> } }; __in: { enterHouse: (h: unknown) => unknown } };
      };
      w.__hd2d.__in.enterHouse(w.__hd2d.world.P.HOUSES.find((h) => "p" + h.plot === key));
    }, sale);
    await expect(homeCard.getByRole("button", { name: "Sell" })).toBeVisible({ timeout: 20_000 });
    await homeCard.getByRole("button", { name: "Sell" }).click();
    await expect(homeCard).toBeHidden({ timeout: 20_000 });
    const soldMeta = (await (await request.get(`/api/chats/${chatId}`)).json()) as { metadata: unknown };
    const afterSale = (typeof soldMeta.metadata === "string" ? JSON.parse(soldMeta.metadata) : soldMeta.metadata) as {
      gameHomesPending?: string[];
      gameInventory?: Array<{ item?: string; quantity: number }>;
    };
    console.log("sold", JSON.stringify(afterSale.gameHomesPending), JSON.stringify(afterSale.gameInventory));
    expect(afterSale.gameHomesPending?.at(-1)).toContain('how="sold"');
    const goldAfterSale = (afterSale.gameInventory ?? [])
      .filter((stack) => stack.item === "coin:gold")
      .reduce((sum, stack) => sum + stack.quantity, 0);
    expect(goldAfterSale).toBeGreaterThan(377);
    // The party's spot is kept, and a reload opens the town where it stood.
    const meta = async () => {
      const chat = (await (await request.get(`/api/chats/${chatId}`)).json()) as { metadata: unknown };
      return (typeof chat.metadata === "string" ? JSON.parse(chat.metadata) : chat.metadata) as {
        gameTownHd2dSpots?: Array<{ c: number; x: number; y: number }>;
      };
    };
    await expect
      .poll(async () => (await meta()).gameTownHd2dSpots?.length ?? 0, { timeout: 20_000 })
      .toBeGreaterThan(0);
    const kept = (await meta()).gameTownHd2dSpots![0]!;
    await page.reload();
    await page.waitForFunction(() => (window as unknown as { __hd2d?: { world?: unknown } }).__hd2d?.world, null, {
      timeout: 400_000,
    });
    const back = await page.evaluate(() =>
      (window as unknown as { __hd2d: { position: () => { tcell: number; x: number; y: number } } }).__hd2d.position(),
    );
    console.log("kept", JSON.stringify(kept), "back", JSON.stringify(back));
    expect(Math.hypot(back.x - kept.x, back.y - kept.y)).toBeLessThan(2);
    await page.waitForTimeout(4000);
    await page.screenshot({ path: testInfo.outputPath(`hd2d-${SIZE}-reload.png`) });
    expect(errors).toEqual([]);
  } finally {
    await request.delete(`/api/chats/${chatId}`).catch(() => undefined);
  }
});
