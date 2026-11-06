// ──────────────────────────────────────────────
// Game: upgrading a Legacy game to Classic classes (owner 2026-11-06)
//
// A game made without Classic classes keeps its Legacy sheets for as long as its players want. Its
// Journal offers the upgrade: every party member gets one class (the base class of a primary tree the
// player picks, guessed from their card), a secondary tree from their temperament (read from their
// Description when the card has none yet), and their Legacy level carried over as XP in that class.
// Their Legacy stats stay on the card, untouched.
// ──────────────────────────────────────────────
import {
  COMBAT_PARTY_TEMPERAMENTS,
  gameCardTemperament,
  guessMarinaraArchetype,
  marinaraLegacyLevel,
  marinaraTrees,
  normalizeCharacterLookupName,
  partyTemperamentFallback,
  readPartyTemperament,
  upgradeMarinaraLegacyCard,
  type CombatPartyTemperament,
  type MarinaraArchetype,
  type MarinaraCardClassic,
  type MarinaraPartyTemperament,
} from "@marinara-engine/shared";
import { withCardTemperament } from "./party-temperament.service.js";

export interface MarinaraLegacyUpgradeMember {
  name: string;
  primary?: MarinaraArchetype;
}

export interface MarinaraLegacyUpgraded {
  name: string;
  level: number;
  primary: MarinaraArchetype;
  secondary: MarinaraArchetype | null;
  temperament: MarinaraPartyTemperament;
  /** Where the temperament came from: kept on the card, read from the Description now, or drawn. */
  temperamentFrom: "card" | "description" | "drawn";
}

type Card = Record<string, unknown> & { name: string };

function partyCards(meta: Record<string, unknown>): Card[] {
  const cards = Array.isArray(meta.gameCharacterCards) ? (meta.gameCharacterCards as Record<string, unknown>[]) : [];
  return cards.filter((card): card is Card => typeof card.name === "string" && Boolean(card.name.trim()));
}

/** Why this game can't be upgraded, or null when it can. */
export function marinaraLegacyUpgradeBlock(meta: Record<string, unknown>): string | null {
  const setup = (meta.gameSetupConfig ?? null) as { marinaraClasses?: unknown } | null;
  if (!setup) return "This game has no setup to upgrade.";
  if (setup.marinaraClasses === true) return "This game already uses Classic classes.";
  if (meta.gameRuleset) return "A game played with a ruleset keeps its ruleset's sheets.";
  if (partyCards(meta).length === 0) return "This game has no party sheets to upgrade yet.";
  return null;
}

/** The party members whose temperament has to be read from their Description first. */
export function marinaraLegacyNeedsTemperament(meta: Record<string, unknown>): Card[] {
  return partyCards(meta).filter((card) => !gameCardTemperament(card));
}

/** The prompt that reads temperaments from the Descriptions (the same rule a new game card follows). */
export function marinaraLegacyTemperamentPrompt(
  cards: readonly Card[],
  descriptions: ReadonlyMap<string, string>,
): { system: string; user: string } {
  const list = COMBAT_PARTY_TEMPERAMENTS.join("|");
  const system = [
    `You read how each character goes about a fight, from who they are in their Description and personality, never from their class alone.`,
    `Give each one temperament, exactly one of: ${list}.`,
    `- reckless: charges in; cautious: guards themselves first; opportunistic: goes for the weak and exposed; protective: shields others; supportive: heals and helps before striking; disciplined: steady, keeps formation; cowardly: avoids danger and flees when hurt; patient: waits for the right moment; methodical: plans, picks the best option; coordinated: fights as a team.`,
    `- arrogant only for the proud who think a fight beneath them until it hurts; cruel only for the sadistic who relish suffering; honourable only for those who fight fair and spare the beaten.`,
    `- Do not mistake negated traits for positive evidence. The values are protocol enums: never translate them.`,
    `Return ONLY a JSON object mapping each name exactly as given to its temperament.`,
  ].join("\n");
  const user = cards
    .map((card) => {
      const library = descriptions.get(normalizeCharacterLookupName(card.name));
      const parts = [
        `## ${card.name}`,
        library ? `Description: ${library.slice(0, 4000)}` : null,
        typeof card.shortDescription === "string" && card.shortDescription
          ? `In this game: ${card.shortDescription}`
          : null,
        typeof card.class === "string" && card.class ? `Class: ${card.class}` : null,
        Array.isArray(card.strengths) && card.strengths.length ? `Strengths: ${card.strengths.join(", ")}` : null,
        Array.isArray(card.weaknesses) && card.weaknesses.length ? `Weaknesses: ${card.weaknesses.join(", ")}` : null,
      ];
      return parts.filter(Boolean).join("\n");
    })
    .join("\n\n");
  return { system, user };
}

/** The temperaments a model answered, by lookup name; anything it got wrong is left out. */
export function readMarinaraLegacyTemperaments(answer: unknown): Map<string, CombatPartyTemperament> {
  const out = new Map<string, CombatPartyTemperament>();
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return out;
  for (const [name, value] of Object.entries(answer as Record<string, unknown>)) {
    const temperament = readPartyTemperament(value);
    if (temperament) out.set(normalizeCharacterLookupName(name), temperament);
  }
  return out;
}

/**
 * The metadata patch that upgrades the game: every party card gets its Classic progression and a kept
 * temperament, and the game turns Classic classes on. Call it inside patchMetadata with fresh metadata.
 */
export function applyMarinaraLegacyUpgrade(
  meta: Record<string, unknown>,
  input: {
    gameId: string;
    members: readonly MarinaraLegacyUpgradeMember[];
    /** Temperaments read from Descriptions now, by lookup name. */
    read: ReadonlyMap<string, CombatPartyTemperament>;
    classic: ReadonlyMap<string, MarinaraCardClassic>;
    sessionNumber?: number | null;
    at: string;
  },
): { patch: Record<string, unknown>; upgraded: MarinaraLegacyUpgraded[] } | { refusal: string } {
  const block = marinaraLegacyUpgradeBlock(meta);
  if (block) return { refusal: block };
  const picked = new Map(input.members.map((one) => [normalizeCharacterLookupName(one.name), one.primary]));
  const upgraded: MarinaraLegacyUpgraded[] = [];
  const cards = (meta.gameCharacterCards as Record<string, unknown>[]).map((card) => {
    if (typeof card.name !== "string" || !card.name.trim()) return card;
    const key = normalizeCharacterLookupName(card.name);
    const kept = gameCardTemperament(card);
    const read = input.read.get(key);
    const temperament = (kept?.initial ??
      read ??
      partyTemperamentFallback(input.gameId, card.name)) as MarinaraPartyTemperament;
    const classic = input.classic.get(key);
    const level = marinaraLegacyLevel(card as Parameters<typeof marinaraLegacyLevel>[0], input.sessionNumber);
    const primary = picked.get(key) ?? classic?.tree ?? guessMarinaraArchetype(card);
    const progression = upgradeMarinaraLegacyCard({
      gameId: input.gameId,
      card: card as unknown as Parameters<typeof upgradeMarinaraLegacyCard>[0]["card"],
      temperament,
      level,
      primary,
      ...(classic ? { classic } : {}),
    });
    upgraded.push({
      name: card.name,
      level: progression.level,
      primary: progression.primary,
      secondary: marinaraTrees(progression.primary, temperament).secondary,
      temperament,
      temperamentFrom: kept ? "card" : read ? "description" : "drawn",
    });
    const withTemperament = kept ? card : withCardTemperament(card, temperament, null);
    return { ...withTemperament, marinara: progression };
  });
  return {
    patch: {
      gameCharacterCards: cards,
      gameSetupConfig: { ...(meta.gameSetupConfig as Record<string, unknown>), marinaraClasses: true },
      gameMarinaraLegacyUpgrade: { at: input.at, members: upgraded },
    },
    upgraded,
  };
}
