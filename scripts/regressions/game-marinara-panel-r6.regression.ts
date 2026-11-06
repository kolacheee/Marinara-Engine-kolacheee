/**
 * Sonnet panel round 6 (2026-11-06): a hand-played Revive can aim at a fallen ally on a Tactical board;
 * a Marksman's Mark Prey reaches as far as its bow; a bonus-action skill offered on the extra action a
 * bonus gave says it takes that action; a tamed companion says what it lends as the fight starts; and a
 * dragon, which runs rather than yields, doesn't run while mostly whole.
 */
import assert from "node:assert/strict";
import {
  commandCombatDirector,
  createCombatDirector,
  type CombatDirectorState,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraCombatSkills,
  marinaraCombatant,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import { MARINARA_CLASSES } from "../../packages/shared/src/features/marinara-classes.js";
import {
  buildMarinaraEnemy,
  marinaraOption,
  performMarinaraOption,
  type MarinaraEvent,
  type MarinaraFighter,
} from "../../packages/shared/src/features/marinara-combat.js";
import { validateTacticalUnitAction } from "../../packages/shared/src/features/tactical-combat/engine.js";
import type { TacticalUnit } from "../../packages/shared/src/features/tactical-combat/types.js";

const skill = (id: string) => {
  for (const def of MARINARA_CLASSES) {
    const found = def.skills.find((one) => one.id === id);
    if (found) return { ...found };
  }
  throw new Error(`no skill ${id}`);
};
const unit = (id: string, side: "party" | "enemy", archetype: string, skills: string[] = []) => {
  const fighter = buildMarinaraEnemy({ id, name: id, level: 20, tier: "standard", archetype: archetype as never });
  fighter.side = side;
  fighter.skills = [...fighter.skills, ...skills.map(skill)];
  fighter.mp = fighter.maxMp = 999;
  fighter.stamina = fighter.maxStamina = 999;
  return fighter;
};
const board = (fighters: MarinaraFighter[], seed = 1): CombatDirectorState =>
  createCombatDirector({
    id: `r6-${seed}`,
    anchor: "anchor",
    party: fighters.filter((f) => f.side === "party").map((f) => marinaraCombatant(f)),
    enemies: fighters.filter((f) => f.side === "enemy").map((f) => marinaraCombatant(f)),
    style: "tactical",
    difficulty: "normal",
    seed,
    battlefield: { size: "small" } as never,
    marinara: fighters,
  });
const tile = (s: CombatDirectorState, id: string) => s.tactical!.units.find((one) => one.id === id) as TacticalUnit;
/** Puts `id` on a free tile `gap` steps from `from`, in a straight line. */
const place = (s: CombatDirectorState, from: string, id: string, gap: number) => {
  const at = tile(s, from);
  const moving = tile(s, id);
  const taken = (x: number, y: number) => s.tactical!.units.some((one) => one.id !== id && one.x === x && one.y === y);
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const x = at.x + dx! * gap,
      y = at.y + dy! * gap;
    if (x < 0 || y < 0 || x >= s.tactical!.grid.width || y >= s.tactical!.grid.height || taken(x, y)) continue;
    if (s.tactical!.grid.tiles[y]?.[x]?.terrain === "wall") continue;
    moving.x = x;
    moving.y = y;
    return;
  }
  throw new Error("no free tile");
};

// Revive by hand on a Tactical board: the fallen ally is a legal target within support range.
{
  const mender = unit("M", "party", "mender", ["revive"]);
  const ally = unit("A", "party", "blade");
  const foe = unit("F", "enemy", "guard");
  const s = board([mender, ally, foe]);
  const fallen = s.marinara!.fighters.find((one) => one.id === "A")!;
  fallen.hp = 0;
  tile(s, "A").hp = 0;
  place(s, "M", "A", 1);
  s.actorId = "M";
  s.stage = "action";
  const name = tile(s, "M").skills!.find((one) => one.id === "revive")!.name;
  commandCombatDirector(s, {
    type: "tactical",
    action: { type: "skill", unitId: "M", skillName: name, targetId: "A" },
  });
  assert.ok(fallen.hp > 0, "the fallen ally is back up");
}

// Mark Prey reaches 3 tiles, as far as a Marksman's bow; help for a friend stays at 2.
{
  const hunter = unit("H", "party", "marksman", ["mark-prey"]);
  const foe = unit("F", "enemy", "guard");
  const s = board([hunter, foe], 2);
  const reach = tile(s, "H").attackRange.max;
  assert.ok(reach >= 3, `a Marksman's bow reaches 3+ (${reach})`);
  place(s, "H", "F", 3);
  const name = tile(s, "H").skills!.find((one) => one.id === "mark-prey")!.name;
  const problem = validateTacticalUnitAction(s.tactical!, tile(s, "H"), {
    type: "skill",
    unitId: "H",
    skillName: name,
    targetId: "F",
  });
  assert.equal(problem, undefined, problem?.error);
}

// On the extra action a bonus gave, a bonus-action skill says it takes that action.
{
  const hunter = unit("H", "party", "marksman", ["mark-prey"]);
  const foe = unit("F", "enemy", "guard");
  const fresh = marinaraCombatSkills(hunter, [hunter, foe]).find((one) => one.id === "mark-prey")!;
  assert.equal(fresh.takesAction, undefined);
  hunter.commanded = true;
  const spent = marinaraCombatSkills(hunter, [hunter, foe]).find((one) => one.id === "mark-prey")!;
  assert.equal(spent.takesAction, true);
}

// A companion says what it lends as the fight starts.
{
  const keeper = unit("K", "party", "marksman", ["bond"]);
  keeper.companion = { name: "Ridge Hulk", stat: "hp", lends: 0.15, bond: 0.075 };
  const foe = unit("F", "enemy", "guard");
  const s = board([keeper, foe], 3);
  assert.ok(
    s.log.some((one) => one.text === "K's Ridge Hulk lends +15% HP (Bond: the rest of the party +8%)."),
    s.log.map((one) => one.text).join("\n"),
  );
}

// A cleanse says what it cleared.
{
  const mender = unit("M", "party", "mender", ["purify"]);
  const ally = unit("A", "party", "blade");
  ally.statuses.push({ status: "slow", turns: 2 });
  const events: MarinaraEvent[] = [];
  performMarinaraOption(mender, marinaraOption(mender, "purify", [mender, ally])!, [ally], [mender, ally], {
    random: () => 0.5,
    events,
  });
  assert.deepEqual(events.find((one) => one.kind === "cleanse")?.notes, ["slow"]);
}

console.log("game-marinara-panel-r6: ok");
