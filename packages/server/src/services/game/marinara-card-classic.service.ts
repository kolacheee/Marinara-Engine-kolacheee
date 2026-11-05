// ──────────────────────────────────────────────
// Game: the Classic picks on the party's library cards (owner's pick 2026-11-05)
//
// A character card's Game Mode section holds the starting tree and the stats they are strong and weak
// in (extensions.classic); a persona keeps the same in personaStats.classic. A new Classic progression
// reads them by name, so a game card written before the picks still gets them.
// ──────────────────────────────────────────────
import {
  normalizeCharacterLookupName,
  readMarinaraCardClassic,
  type MarinaraCardClassic,
} from "@marinara-engine/shared";
import type { DB } from "../../db/connection.js";
import { createCharactersStorage } from "../storage/characters.storage.js";

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/** The party's Classic card picks by lookup name: the chat's characters and its persona. */
export async function marinaraCardClassicByName(
  db: DB,
  chat: { characterIds?: unknown; personaId?: string | null } | null | undefined,
  extraPersonaId?: string | null,
): Promise<Map<string, MarinaraCardClassic>> {
  const out = new Map<string, MarinaraCardClassic>();
  if (!chat) return out;
  const storage = createCharactersStorage(db);
  const ids = parseJson(chat.characterIds);
  const characterIds = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
  for (const row of await storage.getByIds(characterIds)) {
    const data = parseJson(row.data) as { name?: unknown; extensions?: { classic?: unknown } } | undefined;
    const classic = readMarinaraCardClassic(data?.extensions?.classic);
    if (classic && typeof data?.name === "string") out.set(normalizeCharacterLookupName(data.name), classic);
  }
  const personaId = chat.personaId || extraPersonaId;
  if (personaId) {
    const persona = await storage.getPersona(personaId);
    const stats = parseJson(persona?.personaStats) as { classic?: unknown } | undefined;
    const classic = readMarinaraCardClassic(stats?.classic);
    if (classic && persona?.name) out.set(normalizeCharacterLookupName(persona.name), classic);
  }
  return out;
}
