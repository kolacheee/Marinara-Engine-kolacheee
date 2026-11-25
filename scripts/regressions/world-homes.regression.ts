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
  (now().done[town.id] ?? []).some((line) => /Mara and Tobin bought the empty house by the well for 120/u.test(line)),
);

// ── Told to the Game Master, here and elsewhere ──
const text = worldWhereYouAreText(game, { place: town, present: now() });
assert.match(
  text,
  /Homes the party has here: Mara has lived in a timber house on Bell Street; Mara and Tobin bought the empty house by the well for 120\./u,
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

console.log("world-homes: ok");
