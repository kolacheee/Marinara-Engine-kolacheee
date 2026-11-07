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
 *   - A bigger world draws more: a realm five where a region has three, a world eight.
 *   - The brief's own peoples come first, as written (name, kind, temper, form, want, home, allies and
 *     rivals); the world draws more only to make up its number, of other kinds. A brief with more than
 *     that keeps them all, and a world that draws none still has the brief's.
 *   - The Game Master brings a people in with `[world: fact="people"]`: refused for a name the world has
 *     or a place it does not; once in, the reminder by their home gives them with a past of their own,
 *     and the world's own peoples are unchanged.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  WORLD_STARTER_KITS,
  applyWorldTags,
  readWorldLedger,
  worldPresent,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldHistory,
  worldOverviewPromptText,
  worldPeoples,
  worldPeoplesNear,
  worldTerrainEntries,
  worldWhereYouAreText,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const EXPECTED: Record<string, number> = {
  high_fantasy: 5,
  wuxia_xianxia: 5,
  modern_day: 0,
  modern_supernatural: 2,
  the_1920s: 0,
  cyberpunk: 0,
  space_opera: 6,
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
    const by = now.world.places.find((place) => place.id === peoples[0]!.nearId)!;
    const nearest = worldPeoplesNear(peoples, by)[0]!;
    const reminder = worldWhereYouAreText(now, { place: by });
    assert.ok(
      peoples.some((people) => reminder.includes(`Want now: ${people.want}`)) &&
        reminder.includes(`The ${nearest.name}`),
      `${what}: the reminder near their home gives them, the nearest in full`,
    );
  }
}
// ── Bigger worlds, the brief's own peoples, and the ones the story brings in ──
{
  const fantasy = WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!;
  const sized = (scale: "realm" | "world") => {
    const base = game(fantasy, 4242, 9);
    const kit = { ...base.kit, scale };
    const inputs = { ...base, kit };
    return { ...inputs, world: compileGameWorld(inputs) };
  };
  assert.equal(worldPeoples(sized("realm").kit, sized("realm").world).length, 5, "a realm has five");
  assert.ok(worldPeoples(sized("world").kit, sized("world").world).length >= 6, "a world has more still");

  const base = game(fantasy, 4242, 9);
  const layer = base.kit.layers.find((each) => each.settlements)!.id;
  const species = [
    {
      name: "Vael",
      kind: "hill-folk under the barrows",
      temper: "aloof",
      home: "Calder",
      form: "Small and grey-cloaked.",
    },
    {
      name: "Orrish",
      kind: "river-dwellers who drown the careless",
      temper: "malevolent",
      want: "the miller's daughter",
    },
    { name: "Thane-wights", kind: "dead kings who keep the old roads", rivals: ["Vael"] },
    { name: "Glimmerkin", kind: "lights in the marsh that trick travellers" },
    { name: "Stonewives", kind: "old giantesses who trade riddles for passage", allies: ["Vael"] },
    { name: "Hask", kind: "ash-hounds that hunt by smoke" },
    { name: "Morrow Folk", kind: "a kindly folk who mend what is left out", temper: "kindly" },
    { name: "Seers of Ul", kind: "watchers who record every birth" },
    { name: "Fen Mothers", kind: "marsh hags who tempt the lonely" },
    { name: "Elderkin", kind: "an ancient race older than the hills", home: "Nowhere" },
  ];
  const checked = checkWorldBrief(base.kit, {
    ...base.brief,
    places: ["Ashby", "Wending", "Calder"].map((name) => ({ name, layer, tags: [] })),
    peoples: species,
  });
  assert.ok(checked.ok);
  assert.ok(
    checked.repairs.some((repair) => /Elderkin: "Nowhere"/.test(repair)),
    "an unknown home is repaired",
  );
  const written = { ...base, brief: checked.brief, world: compileGameWorld({ ...base, brief: checked.brief }) };
  const peoples = worldPeoples(written.kit, written.world, written.brief.peoples);
  assert.deepEqual(
    peoples.map((people) => people.name),
    species.map((each) => each.name),
    "ten written peoples are the world's, as written, and none drawn",
  );
  const vael = peoples[0]!;
  assert.equal(vael.kind, "hill-folk under the barrows");
  assert.equal(vael.temper, "aloof");
  assert.equal(vael.form, "Small and grey-cloaked.");
  assert.equal(peoples[1]!.want, "the miller's daughter");
  assert.equal(peoples[1]!.stance, "hostile");
  assert.equal(peoples[6]!.temper, "kindly", "a written temper is kept");
  assert.equal(peoples[5]!.archetype, "devourer", "a hunting people is told as devourers");
  const calder = written.world.places.find((place) => place.name === "Calder")!;
  assert.ok(Math.hypot(vael.home.x - calder.at.x, vael.home.y - calder.at.y) <= 3, "the Vael live by Calder");
  const tie = (a: number, b: number) => peoples[a]!.relations.find((each) => each.id === peoples[b]!.id)!.text;
  assert.equal(tie(2, 0), "are old enemies of the {other}");
  assert.equal(tie(0, 4), "are allied with the {other}");
  assert.ok(worldOverviewPromptText(written).includes("The Fen Mothers"), "the overview lists the brief's peoples");

  const one = checkWorldBrief(base.kit, { ...base.brief, peoples: [species[3]] });
  assert.ok(one.ok);
  const filled = worldPeoples(base.kit, base.world, one.brief.peoples);
  assert.equal(filled.length, 5, "one written people and four drawn make up a realm's five");
  assert.equal(filled[0]!.name, "Glimmerkin");
  assert.equal(new Set(filled.map((people) => people.archetype)).size, 5, "the drawn ones are of other kinds");
  const plain = game(
    WORLD_STARTER_KITS.find((each) => each.id === "modern_day")!,
    101,
    9,
  );
  assert.equal(
    worldPeoples(plain.kit, plain.world, one.brief.peoples).length,
    1,
    "a world that draws none keeps the brief's",
  );

  // In play: the Game Master brings one in.
  const own = worldPeoples(base.kit, base.world);
  const town = base.world.places.find((place) => place.rank !== undefined)!;
  const said = applyWorldTags(
    `[world: fact="people" name="Sallowmen" kind="pale folk of the salt caves" in="${town.name}" temper="untrustworthy"]` +
      ` [world: fact="people" name="${own[0]!.name}" kind="x" in="${town.name}"]` +
      ` [world: fact="people" name="Nobody" kind="x" in="Atlantis"]`,
    base,
    [],
  );
  assert.match(said, /name="Sallowmen"[^\]]*result="ok"/);
  assert.match(said, /result="refused" reason="exists"/);
  assert.match(said, /result="refused" reason="unknown-place"/);
  const present = worldPresent(base, readWorldLedger([said]));
  assert.equal(present.peoples?.[0]?.home, town.name);
  const reminder = worldWhereYouAreText(base, { place: town, present });
  assert.ok(reminder.includes("The Sallowmen"), "the reminder by their home gives them");
  assert.ok(/Sallowmen[\s\S]*Their past: /.test(reminder), "with a past of their own");
  assert.deepEqual(worldPeoples(base.kit, base.world), own, "the world's own peoples are unchanged");
}

assert.ok(told > 20, `peoples' deeds are told in the histories (${told})`);
assert.equal(
  fingerprint.digest("hex"),
  "06a234c39e07db8c725177a3c8b4c638b0d70eb0276c6ac0e83706a9ea05cbed",
  "the committed peoples",
);
console.log("world-peoples: ok");
