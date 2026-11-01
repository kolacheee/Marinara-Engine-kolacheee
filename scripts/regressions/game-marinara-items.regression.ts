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
import { WORLD_STARTER_KITS } from "../../packages/shared/src/features/world/starter-kits.js";
import {
  MARINARA_ACCESSORIES,
  MARINARA_ARMOUR_FAMILIES,
  MARINARA_CONSUMABLES,
  MARINARA_FAMILY_DROPS,
  MARINARA_ITEM_SETTINGS,
  MARINARA_KIT_SETTINGS,
  MARINARA_STANDARD_GEAR,
  MARINARA_TIERS,
  MARINARA_UNIQUES,
  MARINARA_WEAPON_FAMILIES,
  marinaraAllItemIds,
  marinaraCanEquip,
  marinaraConsumable,
  marinaraFamilyDrops,
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

// The kit map is the Engine's own: every starter kit, mapped to the art family it declares (the
// bestiary keys enemies by these kit ids, so loot for any kit lands in the right setting).
assert.deepEqual(Object.fromEntries(WORLD_STARTER_KITS.map((kit) => [kit.id, kit.family])), {
  ...MARINARA_KIT_SETTINGS,
});
for (const kit of WORLD_STARTER_KITS) assert.equal(marinaraItemPlace(kit.id).kit, kit.id);

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

// Signature drops: every bestiary family's list resolves at every tier, in every place it fits, with
// its first entry a consumable (its common drop); an excluded item drops out (no grave dust in modern_day),
// and nothing is above the foe's tier.
for (const [family, entries] of Object.entries(MARINARA_FAMILY_DROPS)) {
  assert.ok(marinaraConsumable(entries[0]!.replace(/-\*$/, "-1")), `${family} common drop is a consumable`);
  for (const tier of MARINARA_TIERS) {
    const drops = marinaraFamilyDrops(family, tier, { setting: "fantasy" });
    if (tier === 6) assert.equal(drops.length, entries.length, `${family} T6 resolves all: ${drops.join(", ")}`);
    assert.ok(drops.length >= 1, `${family} T${tier} drops something`);
    for (const id of drops) assert.ok(marinaraItem(id)!.tier <= tier, `${family} T${tier} drops ${id} in tier`);
  }
}
assert.deepEqual(marinaraFamilyDrops("shade", 3, marinaraItemPlace("modern_day")), ["charm-resistance-2"]);
assert.deepEqual(marinaraFamilyDrops("adept", 6, { setting: null }), ["mp-2", "staff-t6", "robes-t6", "charm-magic-3"]);
{
  const loot = marinaraRollLoot({
    tier: 2,
    foes: Array.from({ length: 40 }, () => ({ rank: "boss" as const, family: "stinger" })),
    place: { setting: "wuxia" },
    seed: "stingers",
  });
  assert.ok(loot.items.includes("venom-vial"), "stingers drop their venom");
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

// ── In a game (marinara-loot.ts) ──
{
  const { buildMarinaraEnemy, marinaraGameItemPlace, marinaraVictoryLoot } =
    await import("../../packages/shared/src/index.js");
  // A game's place: its starter kit, else its genre; nothing known is neutral.
  assert.deepEqual(marinaraGameItemPlace({ gameWorldKit: WORLD_STARTER_KITS.find((kit) => kit.id === "cyberpunk") }), {
    setting: "scifi",
    kit: "cyberpunk",
  });
  assert.deepEqual(marinaraGameItemPlace({ gameSetupConfig: { genre: "Wuxia" } }).setting, "wuxia");
  assert.deepEqual(marinaraGameItemPlace({}), { setting: null });

  const foe = (id: string, tier: "standard" | "boss", familyId?: string) => ({
    ...buildMarinaraEnemy({ id, name: id, archetype: "blade", level: 12, tier }),
    hp: 0,
    ...(familyId ? { familyId } : {}),
  });
  const ally = {
    ...buildMarinaraEnemy({ id: "p", name: "Ally", archetype: "guard", level: 12, tier: "standard" }),
    side: "party" as const,
  };
  const coins = [
    { item: "money:copper", name: "copper", value: 1 },
    { item: "money:silver", name: "silver", value: 10 },
    { item: "money:gold", name: "gold", value: 100 },
  ];
  const input = {
    fighters: [ally, foe("a", "boss", "sellsword"), foe("b", "standard", "hound")],
    place: { setting: "fantasy" as const, kit: "high_fantasy" },
    seed: "fight-1",
    coins,
  };
  const won = marinaraVictoryLoot(input);
  assert.deepEqual(marinaraVictoryLoot(input), won, "seeded");
  assert.ok(won.gold > 0 && won.items.length >= 1, "a boss drops gear and gold");
  // Gold in the game's coins, largest first, adding up to the marks in copper.
  const paid = won.lines
    .filter((line) => line.item)
    .reduce((sum, line) => sum + line.count * coins.find((c) => c.item === line.item)!.value, 0);
  assert.ok(Math.abs(paid - won.gold * 10) < 100, `coins add up (${paid} vs ${won.gold * 10})`);
  // Items are named in the setting.
  for (const line of won.lines.filter((line) => !line.item)) assert.ok(!/-t\d$/.test(line.name), line.name);
  // A fight nobody was beaten in drops nothing; a game with no money gets "Coins".
  assert.deepEqual(marinaraVictoryLoot({ ...input, fighters: [ally, { ...foe("c", "standard"), hp: 5 }] }).lines, []);
  const plain = marinaraVictoryLoot({ ...input, coins: undefined, place: { setting: null } });
  assert.ok(plain.lines.some((line) => line.name === "Coins"));
}
console.log("game-marinara-items (in a game) passed");

// ── Steal (marinara-combat.ts, kept by marinara-loot.ts) ──
{
  const {
    buildMarinaraEnemy,
    marinaraStealChance,
    marinaraUsable,
    marinaraVictoryLoot,
    performMarinaraOption,
    marinaraRandom,
  } = await import("../../packages/shared/src/index.js");
  const thief = {
    ...buildMarinaraEnemy({ id: "t", name: "Thief", archetype: "scout", level: 12, tier: "standard" }),
    side: "party" as const,
    skills: [{ id: "steal", label: "Steal", kind: "active" as const, cost: 1, resource: "stamina" as const }],
  };
  const mark = {
    ...buildMarinaraEnemy({ id: "m", name: "Mark", archetype: "blade", level: 12, tier: "standard" }),
    familyId: "sellsword",
  };
  const boss = { ...mark, id: "b", tier: "boss" as const };
  const all = [thief, mark];
  const steal = marinaraUsable(thief).find((option) => option.id === "steal");
  assert.ok(steal, "Steal is something a Scout can do in a fight");
  // Odds: bosses are harder, Light Fingers helps, always between 10% and 95%.
  const base = marinaraStealChance(thief, mark, all);
  assert.ok(base >= 10 && base <= 95);
  assert.ok(marinaraStealChance(thief, boss, [thief, boss]) < base, "a boss is harder to rob");
  const lucky = { ...thief, gear: { power: 0, spellPower: 0, stealChance: 0.25 } };
  assert.ok(marinaraStealChance(lucky, mark, [lucky, mark]) > base || base === 95, "Light Fingers helps");
  // A foe is robbed once; a second try finds nothing.
  let robbed = false;
  for (let i = 0; i < 20 && !robbed; i++) {
    const ctx = { random: marinaraRandom(`steal-${i}`), events: [] as Array<{ kind: string; status?: string }> };
    performMarinaraOption(thief, steal!, [mark], all, ctx as never);
    robbed = mark.stolenBy === "t";
    if (robbed) assert.ok(ctx.events.some((event) => event.kind === "steal"));
  }
  assert.ok(robbed, "a Steal lands within 20 tries");
  const again = { random: () => 0, events: [] as Array<{ kind: string; status?: string }> };
  performMarinaraOption(thief, steal!, [mark], all, again as never);
  assert.ok(
    again.events.some((event) => event.kind === "steal" && event.status === "empty"),
    "nothing left to take",
  );
  // What was stolen is kept even when the foe still stands (the party fled), and on top of a win's loot.
  const kept = marinaraVictoryLoot({ fighters: all, place: { setting: "fantasy" }, seed: "s" });
  assert.equal(kept.items.length + (kept.gold > 0 ? 1 : 0), 1, "one thing from the one robbed foe");
  assert.deepEqual(marinaraVictoryLoot({ fighters: all, place: { setting: "fantasy" }, seed: "s" }), kept, "seeded");
  const plain = marinaraVictoryLoot({
    fighters: [thief, { ...mark, stolenBy: undefined }],
    place: { setting: "fantasy" },
    seed: "s",
  });
  assert.deepEqual(plain.lines, [], "nothing robbed, nobody beaten, nothing kept");
}
console.log("game-marinara-items (steal) passed");

// ── Equipping from the bag ──
{
  const { marinaraOwnedGear, marinaraEquipRefusal, marinaraEquipmentForClass } =
    await import("../../packages/shared/src/index.js");
  const fantasy = { setting: "fantasy" as const };
  // Every gear name is unique in every place, so a bag stack reads back as one item.
  for (const place of [{ setting: null }, ...MARINARA_ITEM_SETTINGS.map((setting) => ({ setting }))]) {
    const seen = new Map<string, string>();
    for (const id of ids) {
      if (marinaraItem(id)!.kind === "consumable" || !marinaraItemInPlace(id, place)) continue;
      const name = marinaraItemName(id, place).toLowerCase();
      assert.ok(!seen.has(name), `${id} and ${seen.get(name)} share "${name}" in ${place.setting}`);
      seen.set(name, id);
    }
  }
  const owned = marinaraOwnedGear(
    [
      { name: "Bluesteel Broadsword", quantity: 1 },
      { name: "bluesteel broadsword", quantity: 1 },
      { name: "Hammered Mail Hauberk", quantity: 1 },
      { name: "Ox Charm", quantity: 1 },
      { name: "Hearthroot Tonic", quantity: 3 },
      { name: "Rope", quantity: 1 },
    ],
    fantasy,
  );
  assert.deepEqual(
    owned.map((gear) => [gear.id, gear.count, gear.slot]),
    [
      ["longblade-t3", 2, "weapon"],
      ["mail-t2", 1, "armor"],
      ["charm-strength-1", 1, "accessory"],
    ],
  );
  const ok = { weapon: "longblade-t3", armor: "mail-t2", accessories: ["charm-strength-1"] };
  assert.equal(marinaraEquipRefusal({ classId: "blade", equipment: ok, owned, others: [] }), null);
  assert.match(marinaraEquipRefusal({ classId: "channeler", equipment: ok, owned, others: [] })!, /can't be used/);
  assert.match(
    marinaraEquipRefusal({ classId: "blade", equipment: { armor: "mail-t2" }, owned, others: [{ armor: "mail-t2" }] })!,
    /only 1/,
  );
  assert.equal(
    marinaraEquipRefusal({
      classId: "blade",
      equipment: { weapon: "longblade-t3" },
      owned,
      others: [{ weapon: "longblade-t3" }],
    }),
    null,
    "two swords in the bag, two wearers",
  );
  assert.match(
    marinaraEquipRefusal({ classId: "blade", equipment: { weapon: "bow-t1" }, owned, others: [] })!,
    /can't/,
  );
  assert.match(
    marinaraEquipRefusal({ classId: "herald", equipment: { weapon: "spear-t4" }, owned, others: [] })!,
    /doesn't have/,
  );
  // A Blade turned Channeler takes the sword and mail off and keeps the charm.
  assert.deepEqual(marinaraEquipmentForClass("channeler", ok), { accessories: ["charm-strength-1"] });
}
console.log("game-marinara-items (equipping) passed");
