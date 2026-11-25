/**
 * Homes the players own (fork).
 *
 *   - The Game Master records a home with [world: owned=...]: from the start, bought, rented, given or
 *     inherited, one owner or several; sold or lost takes it away. A home needs a settlement of the world,
 *     a way the world knows, and an owner.
 *   - The homes are told to the Game Master: those in the settlement the party is in, and the rest.
 *   - A home bought, rented, sold or lost is something the party did there; a home from the start is not.
 *   - The Game Master is told how to record a home, and to start a character with one when it fits.
 */
import assert from "node:assert/strict";

import {
  WORLD_STARTER_KITS,
  applyWorldTags,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  readWorldLedger,
  worldHomeOwners,
  worldHomesWith,
  worldLedgerInstructions,
  worldPresent,
  worldWhereYouAreText,
  worldHomeAsk,
  worldHomeEverydayPrice,
  worldHomeSaid,
  worldHomeStatusOf,
  worldHomeHouseWords,
  worldHomeTag,
  worldHomesPendingFromMetadata,
  readToldLedger,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const parsed = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === "high_fantasy")!);
assert.ok(parsed.ok);
const kit = parsed.kit;
const checked = checkWorldBrief(kit, { briefVersion: 1, premise: "x" });
assert.ok(checked.ok);
const inputs = { kit, seed: 3, grounding: "expand" as const, brief: checked.brief };
const game: GameWorld = { ...inputs, world: compileGameWorld(inputs) };
const towns = game.world.places.filter((place) => place.rank !== undefined).sort((a, b) => b.rank! - a.rank!);
const [town, other] = [towns[0]!, towns[1]!];

// The Game Master's replies, answered as the Engine answers them, then read back.
const replies: string[] = [];
const say = (text: string) => {
  const answered = applyWorldTags(text, game, readWorldLedger(replies));
  replies.push(answered);
  return answered;
};
const now = () => worldPresent(game, readWorldLedger(replies));

// ── From the start: a home that fits the character ──
assert.match(
  say(
    `Mara wakes in her own bed. [world: owned="a timber house on Bell Street" place="${town.name}" owner="Mara" how="start" status="common"]`,
  ),
  /result="ok"/u,
);
assert.equal(now().homes?.length, 1);
assert.equal(now().homes![0]!.how, "start");
assert.equal(now().homes![0]!.status, "common");
assert.equal((now().done[town.id] ?? []).length, 0, "a home from the start is nothing done in play");

// ── Bought, by two; rented elsewhere ──
say(
  `[world: owned="the empty house by the well" place="${town.name}" owner="Mara and Tobin" how="bought" price="120 crowns"]`,
);
say(`[world: owned="rooms over the chandler's" place="${other.name}" owner="Tobin" how="rented" price="2"]`);
let homes = now().homes!;
assert.equal(homes.length, 3);
const bought = homes.find((home) => home.words === "the empty house by the well")!;
assert.deepEqual(bought.owners, ["Mara", "Tobin"]);
assert.equal(bought.price, 120);
assert.ok(
  (now().done[town.id] ?? []).some((line) => /Mara and Tobin bought the empty house by the well for 120 crowns/u.test(line)),
);

// ── Told to the Game Master, here and elsewhere ──
const text = worldWhereYouAreText(game, { place: town, present: now() });
assert.match(
  text,
  /Homes the party has here: Mara has lived in a timber house on Bell Street; Mara and Tobin bought the empty house by the well for 120 crowns\./u,
);
assert.match(
  text,
  new RegExp(`homes elsewhere: Tobin rents rooms over the chandler's for 2 a month in ${other.name}`, "u"),
);

// ── Given on, then sold ──
say(`[world: owned="The Empty House by the Well" place="${town.name}" owner="Wren" how="given"]`);
homes = now().homes!;
assert.deepEqual(homes.find((home) => /by the well/u.test(home.words))!.owners, ["Wren"], "given replaces the owners");
assert.equal(homes.find((home) => /by the well/u.test(home.words))!.price, 120, "the price it cost stays");
say(`[world: owned="rooms over the chandler's" place="${other.name}" how="sold"]`);
assert.equal(now().homes!.length, 2);
assert.ok((now().done[other.id] ?? []).some((line) => /Tobin sold rooms over the chandler's/u.test(line)));

// ── Refused: no place of the world, no known way, no owner ──
assert.match(say(`[world: owned="a hut" place="Nowhere at all" owner="Mara" how="bought"]`), /reason="unknown-place"/u);
assert.match(say(`[world: owned="a hut" place="${town.name}" owner="Mara" how="stole"]`), /reason="unreadable"/u);
assert.match(say(`[world: owned="a hut" place="${town.name}" how="bought"]`), /reason="unreadable"/u);
assert.equal(now().homes!.length, 2);

// ── Owners and the fold's rules on their own ──
assert.deepEqual(worldHomeOwners("Mara, Tobin & Wren"), ["Mara", "Tobin", "Wren"]);
assert.deepEqual(
  worldHomesWith([], { placeId: "p1", words: "a house", how: "bought", owners: [], day: 0 }),
  [],
  "a home needs an owner",
);

// ── The Game Master is told how, and about homes from the start ──
const told = worldLedgerInstructions(game);
assert.match(told, /\[world: owned=/u);
assert.match(told, /how="start"/u);
assert.match(told, /wealth and standing/u);

// ── For sale at the door: priced by floor, district and how the town does, in the game's money ──
const coins = [
  { name: "copper", value: 1 },
  { name: "silver", value: 10 },
  { name: "gold", value: 100 },
];
const everyday = worldHomeEverydayPrice([2, 1, 1, 10, 10, 50, 50, 100, 500, 2500, 1000]);
assert.equal(everyday, 1);
const common = worldHomeAsk({ w: 3, d: 4, st: 2, dist: "common" }, "modest", everyday);
assert.deepEqual(common, { price: 6000, rent: 60 });
assert.equal(worldHomeSaid(common.price, coins), "60 gold");
assert.equal(worldHomeSaid(825, coins), "8 gold 2 silver");
const rich = worldHomeAsk({ w: 4, d: 5, st: 3, dist: "rich" }, "thriving", everyday).price;
const poor = worldHomeAsk({ w: 2, d: 3, st: 1, dist: "cottage" }, "struggling", everyday, true).price;
assert.ok(rich > common.price * 4 && poor < common.price / 8, "a rich house costs many cottages");
assert.equal(worldHomeStatusOf("ware"), "rich");
assert.equal(worldHomeStatusOf("craft"), "common");

// ── The Engine's tag for a buy at a door: told with the next reply, the house found by its key ──
const tag = worldHomeTag({
  words: "the house on Bell Street",
  place: town.name,
  owners: ["Mara"],
  how: "bought",
  price: "60 gold",
  status: "common",
  key: "p12",
});
assert.deepEqual(worldHomesPendingFromMetadata({ gameHomesPending: [tag, "junk", 3] }), [tag]);
assert.equal(readToldLedger(tag)[0]!.house, "p12");
assert.match(say(`${tag}The keys are yours.`), /result="ok"/u);
const doorHome = now().homes!.find((home) => home.key === "p12")!;
assert.equal(doorHome.priceWords, "60 gold");
assert.match(worldWhereYouAreText(game, { place: town, present: now() }), /Mara bought the house on Bell Street for 60 gold/u);
// A second house with the same words is another house, by its key.
say(worldHomeTag({ words: "the house on Bell Street", place: town.name, owners: ["Tobin"], how: "rented", price: "6 silver", key: "p13" }));
assert.equal(now().homes!.filter((home) => home.words === "the house on Bell Street").length, 2);

// What the house is like goes to the Game Master with the buy, in its tag's note.
const described = worldHomeHouseWords({ w: 3, d: 4, st: 2, dist: "ware" }, true);
assert.equal(described, "two storeys, 3 by 4 bays, a merchants' street, left empty for a while");
const withNote = worldHomeTag({ words: "the house on Quay Row", place: town.name, owners: ["Mara"], how: "bought", price: "60 gold", key: "p14", note: described });
assert.equal(readToldLedger(withNote)[0]!.note, described);

console.log("world-homes: ok");
