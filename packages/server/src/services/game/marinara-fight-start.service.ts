// Classic Marinara at a fight's start (combat overhaul, Alyssa 2026-10-31): every party member fights
// with the class progression kept on their game card, made the first time they fight from their card and
// the temperament kept there; every opponent is read as a tier and an archetype, and the fight is kept
// within the game's encounter budget unless the story wrote it.

import {
  createMarinaraCardProgression,
  gameCardTemperament,
  marinaraFoeFighters,
  marinaraPartyFighter,
  normalizeCharacterLookupName,
  partyTemperamentFallback,
  readMarinaraCardProgression,
  type Combatant,
  type MarinaraCardProgression,
  type MarinaraFighter,
  type MarinaraFoeBrief,
  type MarinaraPartyTemperament,
} from "@marinara-engine/shared";
import { gameCardFor } from "./party-temperament.service.js";
import { marinaraCombatant } from "./marinara-director.service.js";

export interface MarinaraFightStart {
  party: Combatant[];
  enemies: Combatant[];
  fighters: MarinaraFighter[];
  /** The game's cards with new progressions written on, where any was made. */
  cards: Record<string, unknown>[] | null;
  notes: string[];
}

/** What the Engine keeps of a fight's own unit on the Classic Marinara one it becomes. */
function kept(unit: Combatant): Partial<Combatant> {
  const {
    id: _id,
    name: _n,
    side: _s,
    hp: _h,
    maxHp: _mh,
    mp: _m,
    maxMp: _mm,
    attack: _a,
    defense: _d,
    speed: _sp,
    level: _l,
    skills: _sk,
    statusEffects: _st,
    ...rest
  } = unit as Combatant & { statusEffects?: unknown };
  return rest;
}

export function marinaraFightStart(input: {
  gameId: string;
  cards: readonly Record<string, unknown>[];
  party: readonly Combatant[];
  enemies: readonly Combatant[];
  difficulty: string;
  /** A story's own fight keeps every opponent it wrote. */
  storyFight: boolean;
}): MarinaraFightStart {
  const named = input.cards.filter(
    (card): card is Record<string, unknown> & { name: string } =>
      typeof card.name === "string" && Boolean(card.name.trim()),
  );
  const made = new Map<string, MarinaraCardProgression>();
  const party: Combatant[] = [];
  const fighters: MarinaraFighter[] = [];
  for (const member of input.party) {
    const card = gameCardFor(named, member.name);
    let progression = readMarinaraCardProgression(card?.marinara);
    if (card && progression?.fallen) continue;
    if (!progression) {
      const temperament = (gameCardTemperament(card)?.initial ??
        partyTemperamentFallback(input.gameId, card?.name ?? member.name)) as MarinaraPartyTemperament;
      progression = createMarinaraCardProgression({
        gameId: input.gameId,
        card: (card ?? { name: member.name }) as Parameters<typeof createMarinaraCardProgression>[0]["card"],
        temperament,
      });
      // One with no game card (a summoned beast) fights with a progression drawn for this fight alone.
      if (card) made.set(normalizeCharacterLookupName(card.name), progression);
    }
    const fighter = marinaraPartyFighter(member.id, member.name, progression);
    fighters.push(fighter);
    party.push(marinaraCombatant(fighter, kept(member)));
  }
  const partyAverageHp = fighters.length ? fighters.reduce((sum, one) => sum + one.maxHp, 0) / fighters.length : 20;
  const foes = marinaraFoeFighters({
    foes: input.enemies as unknown as MarinaraFoeBrief[],
    partyLevels: fighters.map((one) => one.level),
    partyAverageHp,
    difficulty: input.difficulty,
    keepAll: input.storyFight,
  });
  const byId = new Map(input.enemies.map((unit) => [unit.id, unit]));
  const enemies = foes.fighters.map((fighter) => marinaraCombatant(fighter, kept(byId.get(fighter.id)!)));
  fighters.push(...foes.fighters);
  const cards = made.size
    ? input.cards.map((card) => {
        const progression =
          typeof card.name === "string" ? made.get(normalizeCharacterLookupName(card.name)) : undefined;
        return progression ? { ...card, marinara: progression } : card;
      })
    : null;
  return { party, enemies, fighters, cards, notes: foes.notes };
}
