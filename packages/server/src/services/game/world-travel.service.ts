// ──────────────────────────────────────────────
// Game: journeys off the map (world-travel.ts). A reply that puts the party at a place no map of the world
// has opens a new map there, kept once the reply is saved; a turn starts on the map of the place the
// replies before it left the party at, so a regenerated or swiped journey goes back as it came.
// ──────────────────────────────────────────────
import {
  gameWorldFromMetadata,
  lastGamePlace,
  worldTravel,
  type GameWorld,
  type WorldTravel,
} from "@marinara-engine/shared";
import type { DB } from "../../db/connection.js";
import { logger } from "../../lib/logger.js";
import { createChatsStorage } from "../storage/chats.storage.js";
import { loadWorldEarthData } from "./earth-data.js";
import { gameRepliesBefore } from "./game-market.service.js";

/** The map a turn starts on: the one the place the replies before it left the party at is on, kept as the
 *  map the party is on when it is another than stored. */
export async function worldMapInForce(
  db: DB,
  chatId: string,
  metadata: Record<string, unknown>,
  game: GameWorld,
  replacing: string | null,
): Promise<GameWorld> {
  if (!(metadata.gameWorld as { maps?: unknown[] } | null)?.maps?.length) return game;
  const place = lastGamePlace((await gameRepliesBefore(db, chatId, replacing)).scoped);
  const back = place?.name ? worldTravel(metadata, game, place.name) : null;
  if (!back) return game;
  const moved = gameWorldFromMetadata({ ...metadata, gameWorld: back.gameWorld });
  if (!moved) return game;
  await keepWorldTravel(db, chatId, back);
  metadata.gameWorld = back.gameWorld;
  return moved;
}

/** Where a place the reply put the party at takes it (a new map there, or back to one the world has), or
 *  null when it stays on this map. The Earth's data is read only for an Earth world. */
export async function worldTravelFor(
  metadata: Record<string, unknown>,
  game: GameWorld,
  name: string,
  beyond: string | undefined,
): Promise<WorldTravel | null> {
  try {
    return worldTravel(metadata, game, name, {
      ...(beyond ? { beyond } : {}),
      earth: game.brief.earth ? await loadWorldEarthData() : null,
    });
  } catch (error) {
    logger.warn(error, "[game] Could not open a map for a journey to %s", name);
    return null;
  }
}

/** Keeps the world's maps and the one the party is on, leaving the rest of the stored world (its hand
 *  edits) as it now is. */
export async function keepWorldTravel(db: DB, chatId: string, travel: WorldTravel): Promise<void> {
  await createChatsStorage(db).patchMetadata(chatId, (fresh) => {
    const stored = (fresh.gameWorld ?? {}) as Record<string, unknown>;
    const { maps: _maps, here: _here, ...rest } = stored;
    const next = travel.gameWorld as { maps?: unknown; here?: unknown };
    return {
      gameWorld: {
        ...rest,
        ...(next.maps !== undefined ? { maps: next.maps } : {}),
        ...(next.here !== undefined ? { here: next.here } : {}),
      },
    };
  });
}

/** The side a reply's last place tag naming a place says it lies past (`beyond="north"`), if any. */
export function placeTagBeyond(content: string, name: string): string | undefined {
  let side: string | undefined;
  for (const match of content.matchAll(/\[place:([^\]]*)\]/gi)) {
    const body = match[1] ?? "";
    const named = /\bname\s*=\s*"([^"]*)"/i.exec(body)?.[1];
    if (!named || named.trim().toLowerCase() !== name.trim().toLowerCase()) continue;
    side = /\bbeyond\s*=\s*"([^"]*)"/i.exec(body)?.[1]?.trim().toLowerCase();
  }
  return side;
}
