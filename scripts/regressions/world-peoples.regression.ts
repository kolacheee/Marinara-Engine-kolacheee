/**
 * Peoples who are not human (world generator 9).
 *
 *   - A world from generator 9 gets its peoples by setting: three in fantasy, wuxia and space opera, two
 *     in a modern-supernatural or wasteland world, none in an everyday modern, 1920s or cyberpunk one;
 *     older worlds get none. The same world gives the same peoples, byte for byte.
 *   - Each people's temper and stance agree, its lines are finished text (no template marks left), its
 *     names and its figure's are unique in the world, its home is on land, and every other people of the
 *     world is named in its relations.
 *   - The history tells their deeds at the settlement nearest them, after its founding.
 *   - The Game Master's overview lists them, and the reminder near their home gives the nearest in full.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldHistory,
  worldOverviewPromptText,
  worldPeoples,
  worldTerrainEntries,
  worldWhereYouAreText,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const EXPECTED: Record<string, number> = {
  high_fantasy: 3,
  wuxia_xianxia: 3,
  modern_day: 0,
  modern_supernatural: 2,
  the_1920s: 0,
  cyberpunk: 0,
  space_opera: 3,
  post_apocalyptic: 2,
};

function game(input: (typeof WORLD_STARTER_KITS)[number], seed: number, generatorVersion: number): GameWorld {
  const parsed = parseWorldKit(input);
  assert.ok(parsed.ok);
  const kit = parsed.kit;
  const layer = kit.layers.find((each) => each.settlements)!.id;
  const checked = checkWorldBrief(kit, {
    briefVersion: 1,
    premise: "x",
    places: ["Ashby", "Wending", "Calder"].map((name) => ({ name, layer, tags: [] })),
    groups: [],
    placeNames: [
      {
        culture: kit.cultures[0]!.id,
        names: ["Ashby", "Wending", "Calder", "Ravel", "Brennock", "Sallow", "Dunmere", "Orrin", "Tamsk", "Vell"],
      },
    ],
  });
  assert.ok(checked.ok);
  const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief, generatorVersion };
  return { ...inputs, world: compileGameWorld(inputs) };
}

const fingerprint = createHash("sha256");
let told = 0;
for (const input of WORLD_STARTER_KITS) {
  for (const seed of [101, 4242, 777]) {
    const what = `${input.id}/${seed}`;
    const old = game(input, seed, 8);
    assert.deepEqual(worldPeoples(old.kit, old.world), [], `${what}: a generator 8 world has no peoples`);
    const now = game(input, seed, 9);
    const peoples = worldPeoples(now.kit, now.world);
    assert.equal(peoples.length, EXPECTED[input.id], `${what}: how many peoples`);
    assert.deepEqual(worldPeoples(now.kit, game(input, seed, 9).world), peoples, `${what}: the same every time`);
    fingerprint.update(JSON.stringify(peoples));
    const water = new Set(
      now.world.terrain.flatMap((id, index) =>
        worldTerrainEntries(now.kit).find((entry) => entry.id === id)?.kind === "water" ? [index] : [],
      ),
    );
    const names = new Set<string>();
    for (const people of peoples) {
      const stance = {
        malevolent: ["hostile"],
        aloof: ["aloof"],
        kindly: ["friendly"],
        untrustworthy: ["friendly", "wary"],
      };
      assert.ok(stance[people.temper].includes(people.stance), `${what}: ${people.name}'s stance fits its temper`);
      const strings = (value: unknown): string[] =>
        typeof value === "string"
          ? [value]
          : value && typeof value === "object"
            ? Object.values(value).flatMap(strings)
            : [];
      for (const line of strings({ ...people, relations: [] })) {
        assert.ok(!/[{}]|^[!~^*]/.test(line), `${what}: ${people.name} is finished text: ${line}`);
      }
      assert.ok(
        people.rules.length >= 2 && people.want && people.offer && people.ward,
        `${what}: ${people.name} is whole`,
      );
      for (const name of [people.name, people.figure.name, ...(people.contact ? [people.contact.name] : [])]) {
        assert.ok(!names.has(name.toLowerCase()), `${what}: ${name} is named once`);
        names.add(name.toLowerCase());
      }
      assert.ok(!now.world.places.some((place) => place.name.toLowerCase() === people.name.toLowerCase()));
      assert.ok(
        !water.has(parseInt(now.world.ground[people.home.y * now.world.width + people.home.x]!, 36)),
        `${what}: ${people.name} live on land`,
      );
      assert.deepEqual(
        people.relations.map((each) => each.id).sort(),
        peoples
          .filter((other) => other !== people)
          .map((other) => other.id)
          .sort(),
        `${what}: ${people.name} stand somehow with each other people`,
      );
    }
    if (!peoples.length) {
      assert.ok(!worldOverviewPromptText(now).includes("Not human"), `${what}: no peoples told`);
      continue;
    }
    const history = worldHistory(now);
    const founded = new Map(
      history.events
        .filter((event) => event.kind === "founding" && /was founded, /.test(event.text))
        .map((event) => [event.places[0]!, event.yearsAgo]),
    );
    for (const people of peoples) {
      const deeds = history.events.filter((event) => people.deeds.includes(event.text));
      for (const deed of deeds) {
        assert.deepEqual(deed.places, [people.nearId], `${what}: ${people.name}'s deeds are at the place near them`);
        assert.ok(deed.yearsAgo <= (founded.get(people.nearId) ?? Infinity), `${what}: after its founding`);
      }
      told += deeds.length;
    }
    const overview = worldOverviewPromptText(now);
    assert.ok(overview.includes("Not human"), `${what}: the overview lists them`);
    for (const people of peoples) assert.ok(overview.includes(`The ${people.name}`), `${what}: ${people.name} listed`);
    const nearest = peoples[0]!;
    const reminder = worldWhereYouAreText(now, {
      place: now.world.places.find((place) => place.id === nearest.nearId)!,
    });
    assert.ok(
      peoples.some((people) => reminder.includes(`Want now: ${people.want}`)) &&
        reminder.includes(`The ${nearest.name}`),
      `${what}: the reminder near their home gives them, the nearest in full`,
    );
  }
}
assert.ok(told > 20, `peoples' deeds are told in the histories (${told})`);
assert.equal(
  fingerprint.digest("hex"),
  "051cc61c01ea495f18268fe032e3750f9e5f5a36bb2d445df7937703c1619914",
  "the committed peoples",
);
console.log("world-peoples: ok");
