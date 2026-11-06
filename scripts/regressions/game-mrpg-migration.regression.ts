/**
 * The owner's calls on moving Legacy players to MRPG classes (2026-11-06):
 * 1. An upgraded card's class names its MRPG class; its Legacy class and abilities move to a note, and a
 *    session's end can't rename the class.
 * 2. A check outside battle in an MRPG game reads the MRPG stats.
 * 3. A late joiner comes in at the level the Game Master gives, with growths and stats it set off the norm.
 * 4. The upgrade offers the nearest MRPG piece for each Legacy weapon and armour.
 */
import assert from "node:assert/strict";
import {
  applyMarinaraLegacyUpgrade,
  marinaraLegacyGearOffers,
  MARINARA_LEGACY_NOTE,
} from "../../packages/server/src/services/game/marinara-legacy-upgrade.service.js";
import { applyGeneratedGameCharacterCards } from "../../packages/server/src/routes/game.routes.js";
import { mrpgCheckModifier, mrpgStatForSkill } from "../../packages/server/src/services/game/skill-check.service.js";
import { resolveSkillCheckWithContext } from "../../packages/server/src/services/game/skill-check-resolution.service.js";
import {
  createMarinaraCardProgression,
  createMarinaraJoinerProgression,
  marinaraClass,
  marinaraLegacyGearFor,
  parseGmTags,
  readMarinaraCardProgression,
  readMarinaraStatAmounts,
  type GameInventoryStack,
} from "../../packages/shared/src/index.js";

const legacy = () => ({
  gameSetupConfig: { genre: "fantasy" },
  gameCharacterCards: [
    {
      name: "Kara",
      class: "Knight",
      abilities: ["Shield Bash", "Rally"],
      strengths: ["Brave"],
      temperament: "protective",
      temperamentInitial: "protective",
    },
    {
      name: "Ossian",
      class: "Wizard",
      abilities: ["Fireball"],
      temperament: "methodical",
      temperamentInitial: "methodical",
    },
  ],
});
const stacks: GameInventoryStack[] = [
  { id: "s1", name: "Grandfather's Chain Mail", quantity: 1 },
  { id: "s2", name: "Oak Staff", quantity: 1, holder: "Ossian" },
  { id: "s3", name: "Healing Potion", quantity: 3, holder: "Ossian" },
  { id: "s4", name: "Rusty Dagger", quantity: 1, holder: "Ossian" },
];

// 4. Gear offers: weapons and armour only, at the upgrade's tier, the player's bag being the player card's.
const offers = marinaraLegacyGearOffers(legacy(), stacks, "Kara");
assert.deepEqual(
  offers.map((offer) => [offer.stackId, offer.holder, offer.id]),
  [
    ["s1", "Kara", "mail-t2"],
    ["s2", "Ossian", "staff-t2"],
    ["s4", "Ossian", "knife-t2"],
  ],
);
assert.equal(marinaraLegacyGearFor("Hide Armor", 1, { setting: "fantasy" } as never)?.id, "leathers-t1");
assert.equal(marinaraLegacyGearFor("Rope", 1, { setting: "fantasy" } as never), undefined);

const done = applyMarinaraLegacyUpgrade(legacy(), {
  gameId: "g-mig",
  members: [
    { name: "Kara", primary: "guard" },
    { name: "Ossian", primary: "channeler" },
  ],
  read: new Map(),
  classic: new Map(),
  at: "2026-11-06T15:00:00Z",
  gear: { stacks, playerCard: "Kara", accepted: ["s1", "s2"] },
});
assert.ok("patch" in done);
const cards = done.patch.gameCharacterCards as Array<Record<string, any>>;
const kara = cards.find((card) => card.name === "Kara")!;
const ossian = cards.find((card) => card.name === "Ossian")!;

// 1. Class text: the MRPG class, the Legacy class and abilities in a note, the rest kept.
assert.equal(kara.class, marinaraClass(readMarinaraCardProgression(kara.marinara)!.activeClass)!.label);
assert.deepEqual(kara.abilities, []);
assert.deepEqual(kara.strengths, ["Brave"]);
assert.equal(kara.extra[MARINARA_LEGACY_NOTE], "Legacy class: Knight. Legacy abilities: Shield Bash; Rally.");
const concluded = applyGeneratedGameCharacterCards(cards, [
  { name: "Kara", class: "Paladin", abilities: ["Smite"] },
]).cards;
assert.equal(concluded.find((card) => card.name === "Kara")!.class, kara.class);

// 4. The accepted gear became MRPG pieces keeping their Legacy names, and is worn where the class can.
const after = (done as { stacks?: GameInventoryStack[] }).stacks!;
assert.equal(after.find((stack) => stack.id === "s1")!.nickname, "Grandfather's Chain Mail");
assert.equal(after.find((stack) => stack.id === "s1")!.name, "Hammered Mail Hauberk");
assert.equal(after.find((stack) => stack.id === "s4")!.name, "Rusty Dagger", "a declined offer is left alone");
assert.equal(readMarinaraCardProgression(kara.marinara)!.equipment?.armor, "mail-t2");
assert.equal(readMarinaraCardProgression(ossian.marinara)!.equipment?.weapon, "staff-t2");

// 2. Checks: the stat a skill leans on, and what it adds.
assert.equal(mrpgStatForSkill("Stealth"), "speed");
assert.equal(mrpgStatForSkill("Persuasion check"), "luck");
assert.equal(mrpgStatForSkill("Lockpicking"), "skill");
assert.deepEqual([1, 7, 11, 20, 30].map(mrpgCheckModifier), [-1, 0, 1, 4, 6]);
const stats = { hp: 30, strength: 4, magic: 2, skill: 8, speed: 20, defense: 6, resistance: 3, luck: 9 };
const rolled = resolveSkillCheckWithContext(
  { skills: null, attributes: { dex: 20 }, sheetAttributes: { dex: 20 }, mrpgStats: stats },
  { skill: "Stealth", dc: 12 },
  () => 10,
);
assert.equal(rolled.modifier, 4, "Speed 20 counts, not the Legacy Dexterity");

// 3. Joiners: the level given, growths moving their hidden aptitudes, stats on top of the body.
const card = { name: "Donnel" };
const plain = createMarinaraCardProgression({ gameId: "g-mig", card, temperament: "cautious" });
const joined = createMarinaraJoinerProgression({
  gameId: "g-mig",
  card,
  temperament: "cautious",
  terms: { level: 3, growths: { strength: 40, speed: 99 }, stats: { luck: 5 } },
});
assert.equal(joined.level, 3);
assert.equal(joined.aptitudes.strength, plain.aptitudes.strength + 40);
assert.equal(joined.aptitudes.speed, plain.aptitudes.speed + 50, "growths are capped at +50");
const reread = readMarinaraCardProgression(joined)!;
assert.deepEqual(reread.statBonus, { luck: 5 });
const bare = readMarinaraCardProgression({ ...joined, statBonus: undefined })!;
assert.equal(reread.stats.luck, bare.stats.luck + 5, "the stat bonus survives the body being recomputed");
assert.equal(createMarinaraJoinerProgression({ gameId: "g-mig", card, temperament: "cautious" }).level, 1);
assert.deepEqual(readMarinaraStatAmounts("Strength+30, spd 20; luck-5, charm+9"), {
  strength: 30,
  speed: 20,
  luck: -5,
});

// 3. The tag: level, growths and stats ride on a party_change add.
const tags = parseGmTags('[party_change: character="Donnel" change="add" level="2" growths="strength+40"]');
assert.deepEqual(tags.partyChanges[0], { characterName: "Donnel", change: "add", level: 2, growths: "strength+40" });
const bareTag = parseGmTags("[party_change: character=Donnel change=add level=4]");
assert.equal(bareTag.partyChanges[0]!.characterName, "Donnel");
assert.equal(bareTag.partyChanges[0]!.level, 4);

console.log("game-mrpg-migration: ok");
