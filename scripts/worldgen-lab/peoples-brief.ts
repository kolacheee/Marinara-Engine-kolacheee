/**
 * Lab: a fantasy brief with peoples of its own, and one the Game Master brings in. Prints what the GM is told.
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/peoples-brief.ts
 */
import {
  WORLD_STARTER_KITS,
  applyWorldTags,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  readWorldLedger,
  worldPeopleLines,
  worldPeoples,
  worldPresent,
  worldWhereYouAreText,
} from "../../packages/shared/src/index.js";

const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
if (!parsed.ok) throw new Error("kit");
const kit = parsed.kit;
const layer = kit.layers.find((each) => each.settlements)!.id;
const checked = checkWorldBrief(kit, {
  briefVersion: 1,
  premise: "x",
  places: ["Ashby", "Wending", "Calder"].map((name) => ({ name, layer, tags: [] })),
  placeNames: [
    { culture: kit.cultures[0]!.id, names: ["Ravel", "Brennock", "Sallow", "Dunmere", "Orrin", "Tamsk", "Vell"] },
  ],
  peoples: [
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
    { name: "Stonewives", kind: "old giantesses who trade riddles for passage", allies: ["Vael"] },
  ],
});
if (!checked.ok) throw new Error(checked.issues.join("; "));
const inputs = { kit, seed: 4242, grounding: "expand" as const, brief: checked.brief };
const game = { ...inputs, world: compileGameWorld(inputs) };
const peoples = worldPeoples(kit, game.world, checked.brief.peoples);
for (const people of peoples) console.log(worldPeopleLines(people, true, peoples).join("\n"), "\n");
const town = game.world.places.find((place) => place.rank !== undefined)!;
const said = applyWorldTags(
  `[world: fact="people" name="Sallowmen" kind="pale folk of the salt caves" in="${town.name}" temper="untrustworthy"]`,
  game,
  [],
);
console.log(said);
const present = worldPresent(game, readWorldLedger([said]));
console.log(worldWhereYouAreText(game, { place: town, present }));
