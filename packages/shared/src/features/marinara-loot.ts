// ──────────────────────────────────────────────
// Game: what a won Classic Marinara fight drops (marinara-items.ts tables, in a game)
//
// The bridge between the item tables and a running game: which setting a game's items come from (its
// kit, else its genre), and the loot of a won fight from the foes the party beat, as named stacks for
// the inventory and gold in the setting's own coin. Pure: the server adds what this returns.
// ──────────────────────────────────────────────

import type { MarinaraFighter } from "./marinara-combat.js";
import { marinaraBestiarySetting, marinaraEnemyFamily } from "./marinara-bestiary.js";
import {
  MARINARA_ITEM_SETTINGS,
  marinaraGearBonus,
  marinaraItemName,
  marinaraItemPlace,
  marinaraPriceInCoin,
  marinaraRollLoot,
  marinaraTierForLevel,
  type MarinaraEquipment,
  type MarinaraFoeRank,
  type MarinaraItemPlace,
  type MarinaraItemSetting,
} from "./marinara-items.js";
import { gameWorldKitFromMetadata } from "../schemas/world-kit.schema.js";
import { worldKitArtFamily } from "./world/art-family.js";

/** Where a game's items come from: its starter kit, else its own kit's art family, else its genre. */
export function marinaraGameItemPlace(metadata: Record<string, unknown> | null | undefined): MarinaraItemPlace {
  const kit = gameWorldKitFromMetadata(metadata);
  if (kit) {
    const byId = marinaraItemPlace(kit.id);
    if (byId.setting) return byId;
    const family = worldKitArtFamily(kit);
    if (family && (MARINARA_ITEM_SETTINGS as readonly string[]).includes(family))
      return { setting: family as MarinaraItemSetting };
  }
  const setup = (metadata?.gameSetupConfig ?? undefined) as { genre?: unknown } | undefined;
  const genre = typeof setup?.genre === "string" ? setup.genre : null;
  return marinaraItemPlace(marinaraBestiarySetting(null, genre));
}

/** A coin of the game's money: its inventory item, its name for one, and its worth in the smallest coin. */
export interface MarinaraLootCoin {
  item: string;
  name: string;
  value: number;
}

/** One line the inventory adds: a named stack, or coins of the game's money by their item. */
export interface MarinaraLootLine {
  name: string;
  count: number;
  item?: string;
}

/**
 * What a won fight drops: each beaten foe (down, not fled) rolls by its rank, its bestiary family and
 * its own level's tier; gold comes in the game's coins (largest first) when it has money, else as
 * "Coins". `equipment` is the party's, for the best gold charm. Seeded, so a step saved twice drops the
 * same thing.
 */
export function marinaraVictoryLoot(input: {
  fighters: readonly MarinaraFighter[];
  place: MarinaraItemPlace;
  seed: string;
  coins?: readonly MarinaraLootCoin[];
  equipment?: ReadonlyArray<MarinaraEquipment | null | undefined>;
}): { lines: MarinaraLootLine[]; gold: number; items: string[] } {
  const party = input.fighters.filter((fighter) => fighter.side === "party");
  const beaten = input.fighters.filter((fighter) => fighter.side === "enemy" && fighter.hp <= 0 && !fighter.dummy);
  if (!beaten.length) return { lines: [], gold: 0, items: [] };
  const partyLevel = party.length
    ? party.reduce((sum, fighter) => sum + fighter.level, 0) / party.length
    : beaten.reduce((sum, fighter) => sum + fighter.level, 0) / beaten.length;
  const goldPct = Math.max(0, ...(input.equipment ?? []).map((gear) => marinaraGearBonus(gear).effects.goldPct ?? 0));
  const loot = marinaraRollLoot({
    tier: marinaraTierForLevel(partyLevel),
    foes: beaten.map((fighter) => {
      const family = fighter.familyId ? marinaraEnemyFamily(fighter.familyId) : undefined;
      return {
        rank: (fighter.tier ?? "standard") as MarinaraFoeRank,
        tier: marinaraTierForLevel(fighter.level),
        ...(fighter.familyId ? { family: fighter.familyId } : {}),
        // A beast, spirit or machine carries no purse; a foe the bestiary doesn't know is taken as a person.
        ...(family && family.kind !== "humanoid" ? { carriesCoin: false } : {}),
      };
    }),
    place: input.place,
    seed: input.seed,
    goldPct,
  });
  const counts = new Map<string, number>();
  for (const id of loot.items) {
    const name = marinaraItemName(id, input.place);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const lines: MarinaraLootLine[] = [...counts].map(([name, count]) => ({ name, count }));
  let left = marinaraPriceInCoin(loot.gold, input.place);
  const coins = [...(input.coins ?? [])].sort((a, b) => b.value - a.value);
  if (coins.length) {
    for (const coin of coins) {
      const count = Math.floor(left / coin.value);
      if (count > 0) lines.push({ name: coin.name, item: coin.item, count });
      left -= count * coin.value;
    }
  } else if (left > 0) lines.push({ name: "Coins", count: left });
  return { lines, gold: loot.gold, items: loot.items };
}
