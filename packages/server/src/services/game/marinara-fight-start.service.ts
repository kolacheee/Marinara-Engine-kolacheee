// Classic Marinara at a fight's start (combat overhaul, Alyssa 2026-10-31): every party member fights
// with the class progression kept on their game card, made the first time they fight from their card and
// the temperament kept there; every opponent is read as a tier and an archetype, and the fight is kept
// within the game's encounter budget unless the story wrote it.

import {
  awardMarinaraXp,
  createMarinaraCardProgression,
  marinaraClassBlock,
  marinaraFoeXp,
  marinaraRandom,
  scaleMarinaraXp,
  MARINARA_CLASSES,
  type MarinaraBestiarySetting,
  type MarinaraEncounterDifficulty,
  type MarinaraFightGrowth,
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
import { marinaraCombatant, type MarinaraDirectorState } from "./marinara-director.service.js";

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
  /** The game's bestiary setting, for bestiary foes. */
  setting?: MarinaraBestiarySetting | null;
  /** The fight's own difficulty for bestiary foes. */
  encounter?: MarinaraEncounterDifficulty;
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
    ...(input.setting ? { setting: input.setting } : {}),
    ...(input.encounter ? { encounter: input.encounter } : {}),
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

/**
 * What a fight's end gives the party (decided 2026-11-01, for Alyssa's review): a won fight pays each
 * beaten foe's XP (its tier's), half shared evenly by everyone who fought and half by the share of
 * damage, healing and support each gave; each share is scaled by the foe's level against theirs, with
 * the catch-up for those below the party's average. A foe that surrendered or fled counts as beaten. A lost or fled fight pays nothing. Under
 * permadeath, one down when a won or fled fight ends is gone; a lost fight is left to the story.
 */
export function marinaraFightEnd(input: {
  state: MarinaraDirectorState;
  outcome: string;
  cards: readonly Record<string, unknown>[];
  seed: number;
  permadeath: boolean;
}): { growth: MarinaraFightGrowth[]; cards: Record<string, unknown>[] | null } {
  const party = input.state.fighters.filter((one) => one.side === "party");
  const foes = input.state.fighters.filter((one) => one.side !== "party");
  // Foes that left a won fight alive (surrendered, fled) were driven off: they pay as the beaten do.
  const left = (input.state.left ?? []).filter((one) => one.side !== "party");
  const named = input.cards.filter(
    (card): card is Record<string, unknown> & { name: string } =>
      typeof card.name === "string" && Boolean(card.name.trim()),
  );
  const beaten = input.outcome === "victory" ? [...foes.filter((foe) => foe.hp <= 0), ...left] : [];
  const shareOf = (id: string) => {
    const credit = input.state.credit[id];
    return credit ? credit.damage + credit.support : 0;
  };
  const total = party.reduce((sum, one) => sum + shareOf(one.id), 0);
  const average = party.length ? party.reduce((sum, one) => sum + one.level, 0) / party.length : 1;
  const growth: MarinaraFightGrowth[] = [];
  const changed = new Map<string, MarinaraCardProgression>();
  for (const fighter of party) {
    const card = gameCardFor(named, fighter.name);
    const progression = readMarinaraCardProgression(card?.marinara);
    if (!card || !progression) continue;
    const share = 0.5 / party.length + (total > 0 ? (0.5 * shareOf(fighter.id)) / total : 0.5 / party.length);
    const xp = beaten.reduce(
      (sum, foe) =>
        sum +
        scaleMarinaraXp({
          base: marinaraFoeXp(foe) * share,
          level: progression.level,
          foeLevel: foe.level,
          partyAverageLevel: average,
        }),
      0,
    );
    const fell = input.permadeath && fighter.hp <= 0 && input.outcome !== "defeat";
    if (!xp && !fell) continue;
    const awarded = xp
      ? awardMarinaraXp(progression, xp, marinaraRandom(`${input.seed}:growth:${card.name}`))
      : { progression, levelUps: [] };
    const next: MarinaraCardProgression = {
      ...progression,
      ...awarded.progression,
      ...(fell ? { fallen: true } : {}),
    };
    changed.set(normalizeCharacterLookupName(card.name), next);
    const active = next.activeClass;
    growth.push({
      name: fighter.name,
      xp,
      level: next.level,
      classId: active,
      classLevel: next.classLevels[active] ?? 1,
      levelUps: awarded.levelUps,
      ...(MARINARA_CLASSES.some(
        (def) => def.from === active && next.classLevels[def.id] === undefined && !marinaraClassBlock(next, def.id),
      )
        ? { promotionReady: true }
        : {}),
      ...(fell ? { fallen: true } : {}),
    });
  }
  const cards = changed.size
    ? input.cards.map((card) => {
        const next = typeof card.name === "string" ? changed.get(normalizeCharacterLookupName(card.name)) : undefined;
        return next ? { ...card, marinara: next } : card;
      })
    : null;
  return { growth, cards };
}
