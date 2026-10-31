/**
 * Classic Marinara bestiary (2026-10-31): every family is whole (abilities exist, class lines are real
 * promotion chains, name bands climb), every setting has foes at every level with someone to stand in
 * front and something to be a boss, gated abilities stay off low tiers and levels, the threat table
 * covers every family, the builder only makes fights the checker accepts and that land near their
 * budget, and the checker refuses what the strict rules forbid.
 */
import assert from "node:assert/strict";
import {
  MARINARA_BESTIARY,
  MARINARA_BESTIARY_ABILITIES,
  MARINARA_BESTIARY_SETTINGS,
  MARINARA_DIFFICULTY_BUDGET,
  MARINARA_MAX_FOES,
  MARINARA_TIER_RULES,
  marinaraAbilityAllowed,
  marinaraBestiaryFor,
  marinaraBestiarySetting,
  marinaraBuildEncounter,
  marinaraCheckEncounter,
  marinaraEnemyClassAt,
  marinaraEnemyName,
  marinaraEnemySpec,
  marinaraFoeThreat,
  type MarinaraEncounterDifficulty,
} from "../../packages/shared/src/features/marinara-bestiary.js";
import { MARINARA_BESTIARY_THREAT } from "../../packages/shared/src/features/marinara-bestiary-threat.js";
import { MARINARA_CLASSES, marinaraClass, marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";
import { COMBAT_TEMPERAMENTS } from "../../packages/shared/src/features/combat-minds.js";
import { isOverusedName } from "../../packages/shared/src/features/world/overused-names.js";

const abilityIds = new Set(MARINARA_BESTIARY_ABILITIES.map((each) => each.id));
assert.equal(abilityIds.size, MARINARA_BESTIARY_ABILITIES.length, "ability ids are unique");
assert.equal(new Set(MARINARA_BESTIARY.map((f) => f.id)).size, MARINARA_BESTIARY.length, "family ids are unique");

const classLabels = new Set(MARINARA_CLASSES.map((def) => def.label.toLowerCase()));
for (const family of MARINARA_BESTIARY) {
  assert.ok(family.levels[0] >= 1 && family.levels[1] <= 30 && family.levels[0] <= family.levels[1], family.id);
  assert.ok(family.tiers.length > 0, `${family.id} has tiers`);
  assert.ok(family.temperaments.every((t) => (COMBAT_TEMPERAMENTS as readonly string[]).includes(t)), `${family.id} temperaments`);
  for (const { id } of family.abilities) assert.ok(abilityIds.has(id), `${family.id}: unknown ability ${id}`);
  // A monster has a stat basis; a humanoid a class line that is a real promotion chain.
  assert.ok(Boolean(family.classLine) !== Boolean(family.archetype), `${family.id}: class line or archetype, not both`);
  if (family.classLine) {
    const [base, advanced, master] = family.classLine.map((id) => marinaraClass(id));
    assert.ok(base && advanced && master, `${family.id}: class line ids exist`);
    assert.equal(base!.tier, "base");
    assert.equal(advanced!.from, base!.id, `${family.id}: ${advanced!.id} promotes from ${base!.id}`);
    assert.equal(master!.from, advanced!.id, `${family.id}: ${master!.id} promotes from ${advanced!.id}`);
    assert.equal(marinaraEnemyClassAt(family, 10), base!.id);
    assert.equal(marinaraEnemyClassAt(family, 11), advanced!.id);
    assert.equal(marinaraEnemyClassAt(family, 21), master!.id);
  }
  const settings = Object.entries(family.names);
  assert.ok(settings.length > 0, `${family.id} lives somewhere`);
  for (const [setting, bands] of settings) {
    assert.ok((MARINARA_BESTIARY_SETTINGS as readonly string[]).includes(setting), `${family.id}: setting ${setting}`);
    for (let i = 1; i < bands!.length; i++) assert.ok(bands![i]!.from > bands![i - 1]!.from, `${family.id} ${setting} bands climb`);
    for (const band of bands!) {
      if (!band.name) continue;
      assert.ok(!isOverusedName(band.name), `${family.id}: ${band.name} is an overused name`);
      assert.ok(!classLabels.has(band.name.toLowerCase()), `${family.id}: ${band.name} is a class's name`);
    }
  }
  // The threat table covers every tier the family has, at every sample level it lives at.
  for (const tier of family.tiers) assert.ok(MARINARA_BESTIARY_THREAT[family.id]?.[tier], `${family.id} ${tier} measured`);
}

// No band name means two different things.
const nameOwner = new Map<string, string>();
for (const family of MARINARA_BESTIARY)
  for (const bands of Object.values(family.names))
    for (const band of bands ?? []) {
      if (!band.name) continue;
      const owner = nameOwner.get(band.name);
      assert.ok(!owner || owner === family.id, `${band.name} names both ${owner} and ${family.id}`);
      nameOwner.set(band.name, family.id);
    }

// Every setting has foes at every level: at least three families, one in front, one that can be a boss from 5.
for (const setting of MARINARA_BESTIARY_SETTINGS)
  for (let level = 1; level <= 30; level++) {
    const families = marinaraBestiaryFor(setting, level);
    assert.ok(families.length >= 3, `${setting} L${level}: ${families.length} families`);
    assert.ok(families.some((f) => f.row === "front"), `${setting} L${level}: someone in front`);
    if (level >= 5) assert.ok(families.some((f) => f.tiers.includes("boss")), `${setting} L${level}: a boss`);
  }

// Settings from kits and genres.
assert.equal(marinaraBestiarySetting("cyberpunk", null), "cyberpunk");
assert.equal(marinaraBestiarySetting(null, "Sci-Fi, Cyberpunk"), "cyberpunk");
assert.equal(marinaraBestiarySetting(null, "wuxia fantasy"), "wuxia_xianxia");
assert.equal(marinaraBestiarySetting(null, "Horror"), "modern_supernatural");
assert.equal(marinaraBestiarySetting("my_own_kit", "Romance"), null);

// Gates: hard control, breath and Doom stay off low tiers and levels.
assert.equal(marinaraAbilityAllowed("dread-gaze", "standard", 20), false);
assert.equal(marinaraAbilityAllowed("dread-gaze", "elite", 7), false);
assert.equal(marinaraAbilityAllowed("dread-gaze", "elite", 8), true);
assert.equal(marinaraAbilityAllowed("doom-mark", "elite", 30), false);
assert.equal(marinaraAbilityAllowed("doom-mark", "boss", 14), false);
assert.equal(marinaraAbilityAllowed("fire-breath", "standard", 30), false);
for (const ability of MARINARA_BESTIARY_ABILITIES) {
  const status = ability.effect.status ?? ability.effect.applies?.status;
  if (status === "sleep" || status === "stun" || status === "confuse") {
    assert.ok(ability.minTier === "elite" || ability.minTier === "boss", `${ability.id}: hard control is elite-only`);
    assert.ok((ability.minLevel ?? 0) >= 8, `${ability.id}: hard control from level 8`);
    const chance = ability.effect.chance ?? ability.effect.applies?.chance ?? 1;
    assert.ok(chance <= 0.5, `${ability.id}: hard control lands half the time at most`);
    assert.ok((ability.effect.cooldown ?? 0) >= 5, `${ability.id}: hard control cooldown`);
  }
  if (ability.effect.target === "all-enemies" && ability.effect.kind === "damage")
    assert.ok((ability.effect.spread ?? 1) <= 0.6, `${ability.id}: area damage spreads`);
}

// A spec: names by band, class by level, gated abilities dropped.
const rat = marinaraEnemySpec({ familyId: "gnawer", setting: "space_opera", level: 3, tier: "minion", id: "e1" });
assert.equal(rat.name, "Hull Mite");
assert.deepEqual(rat.enemySkills, ["gnaw"]);
assert.equal(marinaraEnemySpec({ familyId: "cutpurse", setting: "the_1920s", level: 15, tier: "standard", id: "e2" }).classId, "rogue");
assert.equal(marinaraEnemyName(MARINARA_BESTIARY.find((f) => f.id === "tusker")!, "modern_day", 11), null);
assert.throws(() => marinaraEnemySpec({ familyId: "drake", setting: "modern_day", level: 10, tier: "elite", id: "e3" }));
assert.throws(() => marinaraEnemySpec({ familyId: "hound", setting: "high_fantasy", level: 4, tier: "boss", id: "e4" }));
const drake = marinaraEnemySpec({ familyId: "drake", setting: "high_fantasy", level: 10, tier: "standard", id: "e5" });
assert.ok(!drake.enemySkills!.includes("fire-breath"), "a standard drake has no breath");

// Threat: higher tiers and higher levels are worth more.
assert.ok(marinaraFoeThreat("hound", "elite", 12, 12) > marinaraFoeThreat("hound", "standard", 12, 12));
assert.ok(marinaraFoeThreat("hound", "standard", 15, 12) > marinaraFoeThreat("hound", "standard", 12, 12));

// The checker refuses what the strict rules forbid.
const party = { level: 6, size: 4 };
const check = (foes: Parameters<typeof marinaraCheckEncounter>[0]["foes"], allowed?: MarinaraEncounterDifficulty) =>
  marinaraCheckEncounter({ setting: "high_fantasy", party, foes, ...(allowed ? { allowed } : {}) }).problems;
assert.deepEqual(check([{ familyId: "hound", tier: "standard", level: 6 }]), []);
assert.ok(check([{ familyId: "hound", tier: "standard", level: 10 }]).some((p) => p.includes("levels above")));
assert.ok(check([{ familyId: "turret", tier: "standard", level: 6 }]).length > 0, "no turrets in high fantasy");
assert.ok(check([{ familyId: "shade", tier: "standard", level: 6 }]).some((p) => p.includes("front row")));
assert.ok(
  check(Array.from({ length: 7 }, () => ({ familyId: "gnawer", tier: "minion" as const, level: 6 }))).some((p) => p.includes("room")),
);
assert.ok(check([{ familyId: "drake", tier: "boss", level: 6 }, { familyId: "lout", tier: "boss", level: 6 }]).some((p) => p.includes("at most 1")));
assert.ok(
  check(
    [
      { familyId: "lout", tier: "elite", level: 9 },
      { familyId: "lout", tier: "elite", level: 9 },
      { familyId: "drake", tier: "elite", level: 9 },
    ],
    "normal",
  ).length > 0,
  "three elites three levels up are more than a Normal fight",
);

// The builder: every fight it makes passes the checker and lands between 70% and 100% of its budget
// (the room a fight has and the foes' sizes keep a few short of 85%).
let built = 0;
let underFilled = 0;
for (const setting of MARINARA_BESTIARY_SETTINGS)
  for (const level of [1, 3, 7, 12, 18, 24, 30])
    for (const difficulty of Object.keys(MARINARA_DIFFICULTY_BUDGET) as MarinaraEncounterDifficulty[])
      for (let i = 0; i < 6; i++) {
        const party4 = { level, size: 4 };
        const fight = marinaraBuildEncounter({
          setting,
          party: party4,
          difficulty,
          random: marinaraRandom(`reg:${setting}:${level}:${difficulty}:${i}`),
          boss: i % 3 === 2,
        });
        assert.ok(fight.foes.length > 0 && fight.foes.length <= MARINARA_MAX_FOES, `${setting} L${level} ${difficulty}: foes`);
        const result = marinaraCheckEncounter({ setting, party: party4, foes: fight.foes, allowed: difficulty });
        assert.deepEqual(result.problems, [], `${setting} L${level} ${difficulty}: ${result.problems.join("; ")}`);
        const budget = MARINARA_DIFFICULTY_BUDGET[difficulty] * 4;
        assert.ok(fight.threat <= budget + 1e-9, `${setting} L${level} ${difficulty}: over budget`);
        if (fight.threat < budget * 0.7) underFilled++;
        for (const foe of fight.foes)
          assert.ok(level >= MARINARA_TIER_RULES[foe.tier].minLevel, `${foe.tier} at level ${level}`);
        built++;
      }
assert.ok(underFilled / built < 0.05, `${underFilled} of ${built} fights under 70% of budget`);

console.log(`marinara bestiary: ${MARINARA_BESTIARY.length} families, ${built} built fights checked`);
