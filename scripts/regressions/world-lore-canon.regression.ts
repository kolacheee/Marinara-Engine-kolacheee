/**
 * What the player's lore makes of a world (worldgen W1, generator 9).
 *
 *   - The lore reading asks for cities with their size, and for groups, non-human peoples, human
 *     cultures ("folk") and faiths besides places and events; what every batch read is merged one per
 *     name, its lore entries joined, and anything naming a place, people, culture or group the lore does
 *     not have is repaired.
 *   - The brief keeps all of it exactly and first, whatever the model wrote under the same names.
 *   - A lore city is compiled at the size the lore gives it, and its history grows it there.
 *   - A faith takes root at its holy town and spreads along the ways, only to towns whose people may keep
 *     it; the Game Master's overview lists cultures and faiths, and the reminder in a town says whose
 *     people live there and what is holy to it.
 */
import assert from "node:assert/strict";

import {
  WORLD_STARTER_KITS,
  compileGameWorld,
  parseWorldKit,
  worldHistory,
  worldOverviewPromptText,
  worldWhereYouAreText,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const { buildWorldCanonPrompt, buildWorldBriefPrompt, mergeWorldCanon, readWrittenWorldBrief } =
  await import("../../packages/server/src/services/game/world-brief-writer.js");

const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
assert.ok(parsed.ok);
const kit = parsed.kit;
const kind = kit.groupKinds[0]!.id;

// ── The reading ──
const prompt = buildWorldCanonPrompt(kit, [{ id: "a", name: "n", content: "c" }]).system;
for (const asked of ['"peoples"', '"folk"', '"faiths"', '"groups"', "the size id the lore makes clear"])
  assert.ok(prompt.includes(asked), `the lore reading asks for ${asked}`);

const merged = mergeWorldCanon(
  kit,
  [
    {
      places: [
        { name: "Thornmere", layer: "settlement", size: "capital", lore: ["a"] },
        { name: "Wending", layer: "settlement", size: "town", lore: ["a"] },
        { name: "Calder", layer: "settlement", lore: ["b"] },
        { name: "Ashby", layer: "settlement", lore: ["b"] },
      ],
      groups: [{ name: "The Ember Church", kind, seat: "Thornmere", lore: ["a"] }],
      peoples: [{ name: "Vael", kind: "hill-folk under the barrows", home: "Calder", lore: ["b"] }],
      folk: [
        { name: "Marrish", note: "Fen-folk who speak in riddles", places: ["Thornmere", "Atlantis"], lore: ["a"] },
      ],
      faiths: [
        {
          name: "The Ember Faith",
          note: "They keep a fire that must never go out",
          holy: ["Thornmere"],
          followers: ["Marrish", "Nobody"],
          groups: ["The Ember Church"],
          lore: ["a", "made-up"],
        },
      ],
    },
    {
      places: [],
      folk: [
        { name: "marrish", note: "later mention", places: ["Wending"], lore: ["b"] },
        { name: "Carrow", note: "Hill herders", places: ["Calder", "Ashby"], lore: ["b"] },
      ],
      faiths: [{ name: "The Stone Saints", holy: ["Calder"], followers: ["Carrow"], lore: ["b"] }],
    },
  ],
  new Set(["a", "b"]),
);
assert.equal(merged.places.find((place) => place.name === "Thornmere")?.size, "capital", "a city keeps its size");
assert.equal(merged.groups[0]?.name, "The Ember Church");
assert.equal(merged.peoples[0]?.name, "Vael");
assert.deepEqual(
  merged.folk.map((each) => [each.name, each.note, each.places, each.lore]),
  [
    ["Marrish", "Fen-folk who speak in riddles", ["Thornmere"], ["a", "b"]],
    ["Carrow", "Hill herders", ["Calder", "Ashby"], ["b"]],
  ],
  "one culture per name, the first mention kept and the lore joined",
);
assert.deepEqual(merged.faiths[0]?.followers, ["Marrish"], "a follower the lore lacks is left out");
assert.deepEqual(merged.faiths[0]?.lore, ["a"], "only entries that were read");
assert.ok(merged.repairs.some((repair) => /Marrish: a place/.test(repair)));

// ── The brief keeps it ──
const more = { groups: merged.groups, peoples: merged.peoples, folk: merged.folk, faiths: merged.faiths };
const brief = buildWorldBriefPrompt({
  kit,
  genre: "x",
  setting: "y",
  tone: "z",
  canon: merged.places,
  canonMore: more,
});
assert.ok(brief.user.includes("These faiths come from the player's lore and are fixed"));
assert.ok(brief.system.includes('"faiths"') && brief.system.includes('"folk"'));
const read = readWrittenWorldBrief(
  kit,
  {
    premise: "x",
    places: [{ name: "Brennock", layer: "settlement" }],
    folk: [{ name: "Marrish", note: "the model's own idea", places: ["Brennock"] }],
    faiths: [{ name: "The Sky Father", holy: ["Brennock"] }],
    placeNames: [{ culture: kit.cultures[0]!.id, names: ["Ravel", "Sallow", "Dunmere", "Orrin", "Tamsk", "Vell"] }],
  },
  merged.places,
  [],
  more,
);
assert.ok(read.ok);
assert.equal(read.brief.folk[0]!.note, "Fen-folk who speak in riddles", "the lore's culture, not the model's");
assert.deepEqual(
  read.brief.faiths.map((faith) => faith.name),
  ["The Ember Faith", "The Stone Saints", "The Sky Father"],
  "the lore's faiths first, the model's after",
);
assert.equal(read.brief.groups[0]!.name, "The Ember Church");
assert.equal(read.brief.peoples[0]!.name, "Vael");

// ── The world ──
let rooted = 0;
let spread = 0;
for (const seed of [7, 4242, 31]) {
  const inputs = { kit, seed, grounding: "expand" as const, brief: read.brief };
  const game: GameWorld = { ...inputs, world: compileGameWorld(inputs) };
  const thornmere = game.world.places.find((place) => place.name === "Thornmere")!;
  assert.equal(thornmere.size, "capital", "the lore's city is compiled at its size");
  const history = worldHistory(game);
  assert.ok(
    history.events.some(
      (event) => event.text === "Thornmere grew into a capital." || /^Thornmere grew into a capital/.test(event.text),
    ),
    "its history grows it there",
  );
  const root = history.events.find((event) => event.text.startsWith("The Ember Faith first took root at Thornmere"));
  if (root) rooted++;
  for (const event of history.events.filter((each) => /^The Ember Faith spread from /.test(each.text))) {
    spread++;
    const [, to] = /spread from (.+) to (.+)\.$/.exec(event.text)!.slice(1);
    const town = game.world.places.find((place) => place.name === to)!;
    // The Carrow keep the Stone Saints: the Ember Faith never reaches their towns.
    assert.ok(!["Calder", "Ashby"].includes(town.name), `${event.text}: not among the Carrow`);
    assert.ok(root && event.yearsAgo < root.yearsAgo, `${event.text}: after it took root`);
  }
  const overview = worldOverviewPromptText(game);
  assert.ok(
    overview.includes("- Peoples of the land:") && overview.includes("Marrish: Fen-folk who speak in riddles."),
  );
  assert.ok(overview.includes("- Faiths:") && overview.includes("Holy at Thornmere."));
  const here = worldWhereYouAreText(game, { place: thornmere });
  assert.ok(here.includes("- Its people: Marrish, Fen-folk who speak in riddles."), here);
  assert.ok(here.includes("- Holy to The Ember Faith: They keep a fire that must never go out."), here);
  const calder = game.world.places.find((place) => place.name === "Calder")!;
  assert.ok(worldWhereYouAreText(game, { place: calder }).includes("- Holy to The Stone Saints."));
}
assert.equal(rooted, 3, "the faith takes root at its holy city in every world");
assert.ok(spread > 0, "and spreads along the ways");
console.log("world-lore-canon: ok");
