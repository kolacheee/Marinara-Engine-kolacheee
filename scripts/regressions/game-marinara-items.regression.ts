/**
 * Classic Marinara items and gear (2026-10-31): every weapon family fits the damage types its
 * archetypes may carry, every class can equip its tree's standard gear, gear stays inside the class
 * lab's power budget, every item has a name in every setting it belongs to, setting limits hold,
 * prices double by tier, and loot, steal and shop rolls are seeded, in place and in tier.
 */
import assert from "node:assert/strict";
import {
  MARINARA_ARCHETYPE_WEAPONS,
  MARINARA_ARCHETYPES,
  MARINARA_CLASSES,
  MARINARA_WEAPON_COATINGS,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  MARINARA_ACCESSORIES,
  MARINARA_ARMOUR_FAMILIES,
  MARINARA_CONSUMABLES,
  MARINARA_ITEM_SETTINGS,
  MARINARA_KIT_SETTINGS,
  MARINARA_STANDARD_GEAR,
  MARINARA_TIERS,
  MARINARA_UNIQUES,
  MARINARA_WEAPON_FAMILIES,
  marinaraAllItemIds,
  marinaraCanEquip,
  marinaraGearBonus,
  marinaraItem,
  marinaraItemInPlace,
  marinaraItemName,
  marinaraItemPlace,
  marinaraItemPrice,
  marinaraPriceInCoin,
  marinaraRollLoot,
  marinaraRollSteal,
  marinaraShopStock,
  marinaraStandardEquipment,
  marinaraTierForLevel,
  type MarinaraTier,
} from "../../packages/shared/src/features/marinara-items.js";

// Tiers: five levels each.
assert.deepEqual([1, 5, 6, 10, 11, 25, 26, 30, 99].map(marinaraTierForLevel), [1, 1, 2, 2, 3, 5, 6, 6, 6]);

// Ids are unique and all resolve.
const ids = marinaraAllItemIds();
assert.equal(new Set(ids).size, ids.length, "item ids are unique");
for (const id of ids) assert.ok(marinaraItem(id), `${id} resolves`);
assert.equal(marinaraItem("longblade-t7"), undefined);
assert.equal(marinaraItem("nonsense"), undefined);

// Weapon families only carry types their archetypes may equip; every archetype has a weapon and armour.
for (const family of MARINARA_WEAPON_FAMILIES)
  for (const archetype of family.archetypes)
    assert.ok(MARINARA_ARCHETYPE_WEAPONS[archetype].includes(family.type), `${archetype} can carry ${family.id}`);
for (const archetype of MARINARA_ARCHETYPES) {
  assert.ok(
    MARINARA_WEAPON_FAMILIES.some((family) => family.archetypes.includes(archetype)),
    `${archetype} weapon`,
  );
  assert.ok(
    MARINARA_ARMOUR_FAMILIES.some((family) => family.archetypes.includes(archetype)),
    `${archetype} armour`,
  );
}

// Every class can equip its tree's standard gear at every tier.
for (const def of MARINARA_CLASSES)
  for (const tier of MARINARA_TIERS) {
    const gear = marinaraStandardEquipment(def.archetype, tier);
    assert.ok(marinaraCanEquip(def.id, gear.weapon!, "weapon"), `${def.id} wields ${gear.weapon}`);
    assert.ok(marinaraCanEquip(def.id, gear.armor!, "armor"), `${def.id} wears ${gear.armor}`);
  }
// Classes cannot reach outside their tree's families or slots; Weaponmaster takes any melee weapon.
assert.equal(marinaraCanEquip("blade", "bow-t1", "weapon"), false);
assert.equal(marinaraCanEquip("channeler", "plate-t1", "armor"), false);
assert.equal(marinaraCanEquip("blade", "longblade-t1", "armor"), false);
assert.equal(marinaraCanEquip("blade", "shield-1", "accessory"), false);
assert.equal(marinaraCanEquip("guard", "shield-1", "accessory"), true);
assert.equal(marinaraCanEquip("weaponmaster", "maul-t3", "weapon"), true);
assert.equal(marinaraCanEquip("weaponmaster", "staff-t3", "weapon"), false);

// Budget: the standard gear's power is about the tier (the lab's level × 0.2 at the tier's top level).
for (const archetype of MARINARA_ARCHETYPES)
  for (const tier of MARINARA_TIERS) {
    const bonus = marinaraGearBonus(marinaraStandardEquipment(archetype, tier), { strength: 30 });
    const caster = MARINARA_STANDARD_GEAR[archetype].weapon === "staff";
    // A light standard (the Scout's rapier) trades a point of it for hit and crit.
    const power = caster ? bonus.spellPower : bonus.power;
    assert.ok(power >= tier - 1 && power <= tier, `${archetype} T${tier} power ${power}`);
    const guard = (bonus.stats.defense ?? 0) + (bonus.stats.resistance ?? 0);
    assert.ok(guard >= tier - 1 && guard <= tier * 1.5 + 1, `${archetype} T${tier} armour ${guard}`);
  }

// Gear bonus: weapon type and weight, accessories cap at two, affinities and immunities merge.
{
  const weak = marinaraGearBonus({ weapon: "maul-t2", armor: "plate-t2" }, { strength: 4 });
  assert.equal(weak.weaponType, "blunt");
  assert.ok((weak.stats.speed ?? 0) < 0, "heavy gear slows a weak arm");
  const strong = marinaraGearBonus({ weapon: "maul-t2", armor: "plate-t2" }, { strength: 40 });
  assert.equal(strong.stats.speed, undefined, "a strong arm carries it");
  const worn = marinaraGearBonus({
    accessories: ["ward-fire", "guard-sleep", "charm-strength-3"],
  });
  assert.deepEqual(worn.affinities, { fire: "resist" });
  assert.deepEqual(worn.immune, ["sleep"]);
  assert.equal(worn.stats.strength, undefined, "a third accessory is ignored");
  const plate = marinaraGearBonus({ armor: "stillwater-plate" });
  assert.equal(plate.affinities?.ice, "resist");
  assert.equal(marinaraGearBonus({ weapon: "bow-t1" }).ranged, true);
}

// Names: every item has a non-empty name in every setting it belongs to.
const places = [
  { setting: null },
  ...MARINARA_ITEM_SETTINGS.map((setting) => ({ setting })),
  ...Object.keys(MARINARA_KIT_SETTINGS).map((kit) => marinaraItemPlace(kit)),
];
for (const place of places)
  for (const id of ids) {
    if (!marinaraItemInPlace(id, place)) continue;
    const name = marinaraItemName(id, place);
    assert.ok(name && name !== id && !name.includes("undefined"), `${id} named in ${JSON.stringify(place)}: ${name}`);
  }
assert.equal(marinaraItemName("longblade-t3", { setting: "fantasy" }), "Bluesteel Broadsword");
assert.equal(marinaraItemName("bow-t1", { setting: "jazz_age" }), "Pawnshop Revolver");

// Setting limits: uniques only where named (never neutral); modern_day has no holy water.
for (const unique of MARINARA_UNIQUES) {
  assert.equal(marinaraItemInPlace(unique.id, { setting: null }), false, `${unique.id} not neutral`);
  for (const setting of unique.settings ?? []) assert.ok(unique.names[setting], `${unique.id} named in ${setting}`);
}
assert.equal(marinaraItemInPlace("holy-water", marinaraItemPlace("modern_day")), false);
assert.equal(marinaraItemInPlace("holy-water", marinaraItemPlace("modern_supernatural")), true);
assert.equal(marinaraItemInPlace("moonwake", marinaraItemPlace("cyberpunk")), false);
assert.equal(marinaraItemInPlace("moonwake", marinaraItemPlace("wuxia_xianxia")), true);
assert.deepEqual(marinaraItemPlace("Western"), { setting: null });

// Every coating in the class rules is an item.
for (const coating of MARINARA_WEAPON_COATINGS) assert.ok(marinaraItem(coating.id)?.consumable, coating.id);

// Prices double by tier; uniques, boons and found things are never sold.
for (const family of MARINARA_WEAPON_FAMILIES)
  for (const tier of [2, 3, 4, 5, 6] as MarinaraTier[])
    assert.ok(
      Math.abs(marinaraItemPrice(`${family.id}-t${tier}`)! / marinaraItemPrice(`${family.id}-t${tier - 1}`)! - 2) <
        0.05,
      `${family.id} doubles`,
    );
for (const unique of MARINARA_UNIQUES) assert.equal(marinaraItemPrice(unique.id), null);
for (const def of [...MARINARA_CONSUMABLES, ...MARINARA_ACCESSORIES])
  if (def.found) assert.equal(marinaraItemPrice(def.id), null, `${def.id} not sold`);
assert.equal(marinaraPriceInCoin(60, { setting: "fantasy" }), 600);

// Loot: seeded, in place, never above tier + 1; a boss always drops gear.
for (const tier of MARINARA_TIERS)
  for (const place of places) {
    const input = {
      tier,
      foes: [{ rank: "boss" as const }, { rank: "elite" as const }, { rank: "standard" as const }],
      place,
      seed: `t${tier}:${JSON.stringify(place)}`,
    };
    const loot = marinaraRollLoot(input);
    assert.deepEqual(marinaraRollLoot(input), loot, "loot is seeded");
    assert.ok(loot.gold > 0);
    assert.ok(loot.items.length >= 1, "the boss drops gear");
    for (const id of loot.items) {
      assert.ok(marinaraItemInPlace(id, place), `${id} belongs in ${JSON.stringify(place)}`);
      assert.ok(marinaraItem(id)!.tier <= Math.min(6, tier + 1), `${id} in tier ${tier}`);
    }
  }
{
  let gold = 0;
  for (let index = 0; index < 200; index++)
    gold += marinaraRollLoot({
      tier: 1,
      foes: [{ rank: "standard" }],
      place: { setting: null },
      seed: `g${index}`,
    }).gold;
  assert.ok(gold / 200 > 9 && gold / 200 < 15, `T1 standard foe drops about 12 marks (${gold / 200})`);
}
for (let index = 0; index < 50; index++) {
  const stolen = marinaraRollSteal({ tier: 3, rank: "elite", place: { setting: "wuxia" }, seed: `s${index}` });
  if ("item" in stolen) assert.ok(marinaraItemInPlace(stolen.item, { setting: "wuxia" }));
  else assert.ok(stolen.gold > 0);
}

// Shops: never T6 gear, uniques or found things; a hamlet trails a tier; stock is seeded.
for (const tier of MARINARA_TIERS)
  for (const size of ["small", "town", "city"] as const) {
    const input = { tier, size, place: marinaraItemPlace("high_fantasy"), seed: `${tier}${size}` };
    const stock = marinaraShopStock(input);
    assert.deepEqual(marinaraShopStock(input), stock);
    for (const id of stock) {
      const item = marinaraItem(id)!;
      assert.ok(marinaraItemPrice(id) !== null, `${id} has a price`);
      assert.ok(item.tier <= tier, `${id} within tier ${tier}`);
      if (item.kind === "weapon" || item.kind === "armour") {
        assert.ok(item.tier <= 5, "no T6 gear for sale");
        if (size === "small") assert.ok(item.tier <= Math.max(1, tier - 1), "a hamlet trails a tier");
      }
    }
  }

console.log("game-marinara-items regression passed");
