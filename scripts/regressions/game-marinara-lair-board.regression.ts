/**
 * Board-changing lair actions (owner 2026-11-20): in a Classic Marinara fight on a Tactical board in a
 * creature's lair, a blow on the whole party is marked on the board a round ahead and lands only on whoever
 * still stands on its marks; falling stone leaves ruins, the drowned hall's water spreads, the haven's mist
 * walls sight round its maker and the hive's resin walls in the one it seals, each for a round. Nothing is
 * ever put under a fighter, and every mark on the board is one the lair still means.
 */
import assert from "node:assert/strict";
import {
  commandCombatDirector,
  createCombatDirector,
  marinaraBoardTurn,
  type CombatDirectorState,
} from "../../packages/server/src/services/game/combat-director.service.js";
import { marinaraCombatant } from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  awardMarinaraXp,
  createMarinaraProgression,
  marinaraRandom,
  type MarinaraArchetype,
  type MarinaraPartyTemperament,
} from "../../packages/shared/src/features/marinara-classes.js";
import { buildMarinaraPartyFighter } from "../../packages/shared/src/features/marinara-combat.js";
import { marinaraEnemySpec } from "../../packages/shared/src/features/marinara-bestiary.js";
import { buildMarinaraEnemy } from "../../packages/shared/src/features/marinara-combat.js";
import { DUNGEON_LAIR_BOARD, DUNGEON_LAIRS, type DungeonLairKind } from "../../packages/shared/src/features/world/lairs.js";
import { TERRAIN_DATA, type TacticalUnit } from "../../packages/shared/src/features/tactical-combat/types.js";
import { marinaraEnemyFamily } from "../../packages/shared/src/features/marinara-bestiary.js";

function hero(id: string, primary: MarinaraArchetype, temperament: MarinaraPartyTemperament, level: number) {
  let progression = createMarinaraProgression({ seed: `lb:${id}`, primary, temperament });
  if (level > 1)
    progression = awardMarinaraXp(progression, (level - 1) * 100, marinaraRandom(`lb:${id}:xp`)).progression;
  return buildMarinaraPartyFighter({ id, name: id, progression });
}

function fight(kind: DungeonLairKind, seed: number): CombatDirectorState {
  const level = 12;
  const party = [
    hero("ana", "blade", "reckless", level),
    hero("bo", "guard", "protective", level),
    hero("cy", "marksman", "patient", level),
    hero("di", "mender", "supportive", level),
  ];
  const familyId = DUNGEON_LAIRS[kind].makers.find((id) => {
    const f = marinaraEnemyFamily(id);
    return f && f.tiers.includes("boss") && f.levels[0] <= level && f.levels[1] >= level;
  })!;
  const maker = buildMarinaraEnemy(
    marinaraEnemySpec({ familyId, tier: "boss", level, setting: "high_fantasy", id: "maker" }),
  );
  return createCombatDirector({
    id: `lb${kind}${seed}`,
    anchor: "anchor",
    party: party.map((f) => marinaraCombatant(f)),
    enemies: [marinaraCombatant(maker)],
    style: "tactical",
    environment: DUNGEON_LAIR_BOARD[kind],
    difficulty: "normal",
    seed,
    battlefield: { size: "medium" } as never,
    marinara: [...party, maker],
    marinaraLair: { kind, makerId: "maker" },
  });
}

const seen: Record<string, number> = {};
for (const kind of ["hoard", "drowned", "haven", "hive"] as const)
  for (const seed of [1, 2, 3]) {
    const s = fight(kind, seed);
    for (let step = 0; step < 4000 && !s.outcome; step++) {
      const t = s.tactical!;
      const lair = s.marinara!.lair!;
      // Every strike mark is one the lair still means, and every mark it means is drawn.
      const drawn = [...(t.grid.strikes ?? [])];
      assert.deepEqual(drawn.sort(), [...(lair.marked ?? [])].sort(), `${kind} ${seed}: strike marks drawn as meant`);
      // Mist and resin come with their walls; nobody stands in ground the lair closed or flooded.
      for (const [key, mark] of Object.entries(t.grid.marks ?? {}))
        assert.ok(t.grid.walls?.[key], `${kind} ${seed}: ${mark} at ${key} has its wall`);
      for (const u of t.units.filter((one) => one.hp > 0)) {
        assert.ok(!TERRAIN_DATA[t.grid.tiles[u.y]![u.x]!].impassable, `${kind} ${seed}: ${u.id} on open ground`);
        assert.ok(((t.grid.walls?.[`${u.x},${u.y}`] ?? 0) & 1) === 0, `${kind} ${seed}: ${u.id} not walled over`);
      }
      if (s.mercy) commandCombatDirector(s, { type: "mercy", choice: "spare" });
      else if (s.stage === "action" && s.actorId) {
        const unit = t.units.find((u) => u.id === s.actorId) as TacticalUnit;
        commandCombatDirector(s, { type: "tactical", action: marinaraBoardTurn(s, unit) as never }, "ai");
      } else if (s.window) commandCombatDirector(s, { type: "fallback" }, "fallback");
      else if (s.stage === "select") {
        const next = t.units.find((u) => u.side === "party" && u.hp > 0 && !u.hasActed);
        commandCombatDirector(s, next ? { type: "begin", unitId: next.id } : { type: "continue" });
      } else commandCombatDirector(s, { type: "continue" });
    }
    assert.ok(s.outcome, `${kind} ${seed}: the fight ends`);
    for (const entry of s.log)
      for (const [tag, pattern] of [
        ["marked", /ground glows/],
        ["rubble", /^Fallen stone/],
        ["flood", /water spreads/],
        ["mist", /^Mist closes/],
        ["resin", /^Resin hardens/],
      ] as const)
        if (pattern.test(entry.text)) seen[`${kind}:${tag}`] = (seen[`${kind}:${tag}`] ?? 0) + 1;
    // The maker down, the lair is still and its marks and walls are gone.
    if (s.outcome === "victory") {
      assert.ok(
        !Object.keys(s.tactical!.grid.marks ?? {}).length && !s.tactical!.grid.strikes?.length,
        `${kind} ${seed}: a still lair leaves no marks`,
      );
    }
  }
for (const want of ["hoard:marked", "hoard:rubble", "drowned:marked", "haven:mist", "hive:resin"])
  assert.ok(seen[want], `seen ${want} (${JSON.stringify(seen)})`);
console.log("lair board ok", JSON.stringify(seen));
