/**
 * Classic Marinara ammunition (Alyssa 2026-11-01): no skill. Ammunition of every damage type is
 * bought; a Marksman's bow or gun shoots the type loaded by hand, switched mid-fight among the types
 * the party owns; one the AI runs loads the best by itself. Nobody else can load it.
 */
import assert from "node:assert/strict";
import {
  combatDirectorView,
  commandCombatDirector,
  createCombatDirector,
} from "../../packages/server/src/services/game/combat-director.service.js";
import { marinaraCombatant } from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  MARINARA_ARCHETYPE_TRAITS,
  MARINARA_CLASSES,
  MARINARA_DAMAGE_TYPES,
  awardMarinaraXp,
  createMarinaraProgression,
  marinaraRandom,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  buildMarinaraEnemy,
  buildMarinaraPartyFighter,
  marinaraAmmoChoices,
  marinaraHitNumbers,
  marinaraLoadAmmo,
  marinaraOption,
} from "../../packages/shared/src/features/marinara-combat.js";
import {
  marinaraItemName,
  marinaraItemPrice,
  marinaraOwnedAmmo,
  marinaraShopCatalog,
} from "../../packages/shared/src/features/marinara-items.js";

// No skill is left: the Marksman tree keeps nothing for ammunition.
assert.ok(
  MARINARA_CLASSES.every((def) => def.skills.every((skill) => skill.id !== "ammo-pouch")),
  "Ammo Pouch is gone",
);
assert.equal(MARINARA_ARCHETYPE_TRAITS.marksman, undefined, "no Marksman trait");

// Every damage type is sold, and named in the game's own words; raw (arcane) magic has no ammunition.
for (const type of MARINARA_DAMAGE_TYPES.filter((one) => one !== "arcane"))
  assert.ok(marinaraItemPrice(`ammo-${type}`)! > 0, `${type} ammo is sold`);
assert.ok(!marinaraItemPrice("ammo-arcane"), "no arcane ammo");
const town = marinaraShopCatalog(1, { setting: "fantasy" } as never).map((ware) => ware.id);
assert.ok(town.includes("ammo-fire") && town.includes("ammo-blunt"), `a fantasy shop sells ammo: ${town.join(",")}`);
const fireArrows = marinaraItemName("ammo-fire", { setting: "fantasy" } as never);
assert.deepEqual(marinaraOwnedAmmo([fireArrows, "Hearthroot Tonic", "ammo-ice"]), ["fire", "ice"]);

function member(id: string, primary: "marksman" | "blade") {
  let progression = createMarinaraProgression({ seed: `ammo:${id}`, primary, temperament: "patient" });
  progression = awardMarinaraXp(progression, 400, marinaraRandom(`ammo:${id}:xp`)).progression;
  return buildMarinaraPartyFighter({ id, name: id, progression });
}

// The shot is the loaded type; the AI loads the best owned.
{
  const archer = member("archer", "marksman");
  const blade = member("blade", "blade");
  const foe = buildMarinaraEnemy({ id: "foe", name: "Foe", archetype: "guard", level: 5, tier: "standard" });
  foe.affinities = { fire: "weak", pierce: "resist", blunt: "resist", slash: "resist" };
  const all = [archer, blade, foe];
  const basic = marinaraOption(archer, null, all)!.effect;
  assert.deepEqual(marinaraAmmoChoices(archer), [], "no ammo owned: nothing to load");
  archer.ammoOwned = ["fire"];
  blade.ammoOwned = ["fire"];
  assert.deepEqual(marinaraAmmoChoices(blade), [], "only a Marksman loads ammunition");
  assert.ok(marinaraAmmoChoices(archer).includes("fire"));
  const plain = marinaraHitNumbers(archer, foe, basic, all);
  assert.notEqual(plain.type, "fire", "not loaded: the weapon's own type");
  assert.ok(!marinaraLoadAmmo(archer, "ice"), "can't load what the party doesn't own");
  assert.ok(marinaraLoadAmmo(archer, "fire"));
  const loaded = marinaraHitNumbers(archer, foe, basic, all);
  assert.equal(loaded.type, "fire", "loaded fire: shoots fire");
  assert.ok(loaded.damage > plain.damage, "and hits the weakness");
  // Loaded by hand stays loaded against a foe that drinks it.
  foe.affinities = { fire: "absorb" };
  assert.equal(marinaraHitNumbers(archer, foe, basic, all).type, "fire", "a hand-loaded type stays loaded");
  archer.ammoAuto = true;
  assert.notEqual(marinaraHitNumbers(archer, foe, basic, all).type, "fire", "the AI loads around an absorb");
}

// In a fight: the player switches a Marksman's ammunition by hand; one the AI runs loads its own.
{
  const lead = member("lead", "blade");
  const archer = member("archer", "marksman");
  for (const one of [lead, archer]) one.ammoOwned = ["fire", "ice"];
  lead.ammoOwned = undefined;
  const foes = [buildMarinaraEnemy({ id: "foe", name: "Foe", archetype: "blade", level: 5, tier: "standard" })];
  const s = createCombatDirector({
    id: "ammo",
    anchor: "anchor",
    party: [lead, archer].map((f) => marinaraCombatant(f)),
    enemies: foes.map((f) => marinaraCombatant(f)),
    style: "classic",
    difficulty: "normal",
    seed: 7,
    marinara: [lead, archer, ...foes],
  });
  const view = () => combatDirectorView(s).party.find((u) => u.id === "archer")!.marinara!.ammo!;
  assert.equal(view().auto, true, "a companion the AI runs loads by itself");
  commandCombatDirector(s, { type: "control", unitId: "archer", controller: "manual" });
  assert.equal(view().auto, undefined, "played by hand: loaded by hand");
  commandCombatDirector(s, { type: "loadAmmo", unitId: "archer", ammo: "ice" });
  assert.equal(view().loaded, "ice", "the player loaded ice");
  assert.ok(
    s.log.some((line) => line.kind === "marinara:ammo"),
    "the switch is logged",
  );
  assert.throws(
    () => commandCombatDirector(s, { type: "loadAmmo", unitId: "archer", ammo: "dark" }),
    /owns no such/,
    "only what the party owns",
  );
  assert.throws(
    () => commandCombatDirector(s, { type: "loadAmmo", unitId: "lead", ammo: "fire" }),
    /owns no such/,
    "a Blade loads nothing",
  );
}

console.log("game-marinara-ammo: ok");
