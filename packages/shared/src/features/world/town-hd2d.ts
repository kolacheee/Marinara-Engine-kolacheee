// ──────────────────────────────────────────────
// HD-2D towns (fork): which games open a settlement as the walkable 3D town, and the town generator's
// spec for a settlement, read from the world: its size on the kit's ladder, its prosperity, the water and
// hills round it, what it lives by, and on the real Earth the year and region. Pure: the same world
// gives the same spec, so the same town, on every visit and every computer.
//
// The town generator (the client's hd2d library) knows one culture grammar so far, the Latin European
// one, so only fantasy-family games open their settlements this way; the rest keep the 2D town.
//
// The 3D town is the look and the streets. The Engine's own town (town.ts) stays what the Game Master
// is told: its named places, hall, workplaces, homes and people are put on fitting 3D buildings by the
// client, and a walk through a door is told as a visit, as before. A building the world never named is
// told by the words the client gives it (a spot visit).
// ──────────────────────────────────────────────
import { z } from "zod";
import { worldTerrainEntries, type WorldPlace, type WorldProsperity } from "./compile.js";
import type { WorldTownChronicle } from "./chronicle.js";
import type { GameWorld } from "./game-world.js";
import { worldKitArtFamily } from "./art-family.js";

/** The families whose settlements open as HD-2D towns. */
export const WORLD_HD2D_FAMILIES: ReadonlySet<string> = new Set(["fantasy"]);

/** Whether a game's settlements open as HD-2D towns. */
export function worldTownHd2d(game: GameWorld | null | undefined): boolean {
  const family = game ? worldKitArtFamily(game.kit) : undefined;
  return !!family && WORLD_HD2D_FAMILIES.has(family);
}

/** The town generator's spec (gen2: towns of rank 0-2, cities by population). */
export interface WorldTownHd2dSpec {
  /** The settlement's own seed (the world's seed and the settlement's id). */
  seed: number;
  /** 0 village, 1 town, 2 walled town; a city has cpop instead and rank 2. */
  rank: 0 | 1 | 2;
  /** A city's people (5,000 .. 40,000); 0 for a town. */
  cpop: number;
  basis: "market" | "road" | "bridge" | "port" | "fishing" | "mining";
  /** A city's site. */
  csite: "river" | "coast" | "plain" | "lake";
  ground: "hill" | "flat";
  planted: boolean;
  /** The year the city stands in (the Dissolution and the exchange are gated by it). */
  cyear: number;
  /** Status flags a city takes from the world (bishop, port, university=0 ...). */
  cflags: string;
  /** The culture grammar's region: England, or the Low Countries. */
  region: "en" | "lc";
  /** A chief trade the town lives by, when its tags say one. */
  trade: "" | "cloth" | "tanning";
}

const hash = (text: string) => [...text].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

/** The kinds of ground round a settlement, within `reach` cells: water, hills, and how much river. */
function groundAround(game: GameWorld, place: WorldPlace, reach: number) {
  const { world } = game;
  const kinds = new Map(worldTerrainEntries(game.kit).map((entry) => [entry.id, entry.kind]));
  let water = 0;
  let hills = 0;
  let cells = 0;
  for (let y = place.at.y - reach; y <= place.at.y + reach; y++)
    for (let x = place.at.x - reach; x <= place.at.x + reach; x++) {
      if (x < 0 || y < 0 || x >= world.width || y >= world.height) continue;
      const id = world.terrain[parseInt(world.ground[y * world.width + x] ?? "0", 36)] ?? "";
      cells++;
      if (kinds.get(id) === "water" || /sea|ocean|lake|water/.test(id)) water++;
      if (/hill|mountain|highland|ridge/.test(id)) hills++;
    }
  let river = 0;
  for (const each of world.rivers ?? [])
    each.path.forEach((cell, index) => {
      const [x, y] = [cell % world.width, Math.floor(cell / world.width)];
      if (Math.max(Math.abs(x - place.at.x), Math.abs(y - place.at.y)) <= 1)
        river = Math.max(river, each.width[index] ?? 1);
    });
  const harbour = (world.resources ?? []).some(
    (each) =>
      each.kind === "harbor" && Math.max(Math.abs(each.at.x - place.at.x), Math.abs(each.at.y - place.at.y)) <= 2,
  );
  return { water: cells ? water / cells : 0, hills: cells ? hills / cells : 0, river, harbour };
}

/** The settlement's spec for the town generator, or null for a place that is not a settlement. */
export function worldTownHd2dSpec(
  game: GameWorld,
  settlementId: string,
  prosperityNow?: WorldProsperity,
): WorldTownHd2dSpec | null {
  const place = game.world.places.find((each) => each.id === settlementId);
  if (!place || place.rank === undefined) return null;
  const tags = place.tags.join(" ").toLowerCase();
  const top = Math.max(1, game.kit.sizes.length - 1);
  // Where the settlement sits on the kit's ladder, 0 (the smallest) to 1 (the biggest).
  const step = Math.min(1, Math.max(0, place.rank / top));
  const prosperity = prosperityNow ?? place.prosperity ?? "modest";
  const around = groundAround(game, place, 1);
  const coast = around.water >= 0.12 || around.harbour || /port|harbo|coast|fishing|dock/.test(tags);
  const river = around.river > 0 || /river|bridge|ford/.test(tags);
  // The ladder: hamlets and villages are villages, towns towns (walled when thriving or a fort), cities
  // ten to twenty thousand by prosperity, the capital forty thousand (twenty when struggling).
  let rank: 0 | 1 | 2 = 0;
  let cpop = 0;
  if (step >= 0.95 && top >= 3) cpop = prosperity === "struggling" ? 20000 : 40000;
  else if (step >= 0.7) cpop = prosperity === "thriving" ? 20000 : prosperity === "struggling" ? 5000 : 10000;
  else if (step >= 0.45) rank = prosperity === "thriving" || /wall|fort|castle|keep|garrison/.test(tags) ? 2 : 1;
  if (cpop) rank = 2;
  const basis: WorldTownHd2dSpec["basis"] =
    /mine|mining|ore|quarry/.test(tags) && !cpop
      ? "mining"
      : coast && rank === 0 && !cpop
        ? "fishing"
        : coast
          ? "port"
          : river
            ? "bridge"
            : /crossroad|road|waystation|toll/.test(tags)
              ? "road"
              : "market";
  const earth = game.brief.earth;
  const year = earth?.year !== undefined ? Math.min(1600, Math.max(1100, earth.year)) : 1500;
  const area = (earth?.area ?? "").toLowerCase();
  const region: WorldTownHd2dSpec["region"] =
    /netherland|holland|flanders|belgi|brabant|low countr|antwerp|bruges|ghent/.test(area) ? "lc" : "en";
  const flags = [
    /cathedral|bishop|see\b|holy city|temple city/.test(tags) || (cpop >= 20000 && hash(place.id) % 3 === 0)
      ? "bishop"
      : "",
    coast ? "port" : "",
    /universit|college|academy|scholar/.test(tags) ? "university" : "university=0",
  ].filter(Boolean);
  return {
    seed: (hash(`${game.seed}|${place.id}`) % 99991) + 1,
    rank,
    cpop,
    basis,
    csite: coast ? "coast" : river ? "river" : "plain",
    ground: around.hills >= 0.2 || /hill|mountain|highland|crag/.test(tags) ? "hill" : "flat",
    planted: /planted|new town|bastide|founded|colony/.test(tags),
    cyear: year,
    cflags: flags.join(","),
    region,
    trade: /cloth|wool|weav|dye|textile/.test(tags) ? "cloth" : /tann|leather|hide/.test(tags) ? "tanning" : "",
  };
}

// ── Where the party stands in the 3D town, kept with the game ──

/** The party's spot in a settlement's 3D town: the town map it is on and where on it. */
export const worldTownHd2dSpotSchema = z
  .object({
    settlementId: z.string().min(1).max(16),
    /** The town map (row * maps across + column), -1 the town's own start. */
    c: z.number().int().min(-1).max(4096),
    x: z.number().min(-64).max(128),
    y: z.number().min(-64).max(128),
  })
  .strict();
export type WorldTownHd2dSpot = z.infer<typeof worldTownHd2dSpotSchema>;

/** The spots kept, one a settlement (the latest few). */
export const WORLD_TOWN_HD2D_SPOTS_MAX = 24;
export function worldTownHd2dSpotsFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): WorldTownHd2dSpot[] {
  const raw = metadata?.gameTownHd2dSpots;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((each) => {
    const parsed = worldTownHd2dSpotSchema.safeParse(each);
    return parsed.success ? [parsed.data] : [];
  });
}

/** The spots with one settlement's put first (the oldest dropped past the limit). */
export function worldTownHd2dSpotsWith(spots: WorldTownHd2dSpot[], spot: WorldTownHd2dSpot): WorldTownHd2dSpot[] {
  return [spot, ...spots.filter((each) => each.settlementId !== spot.settlementId)].slice(0, WORLD_TOWN_HD2D_SPOTS_MAX);
}

// ── The town as the Game Master is told it (the 3D town's own landmarks and quarters) ──

export const worldTownHd2dBriefSchema = z
  .object({
    settlementId: z.string().min(1).max(16),
    text: z.string().min(1).max(1500),
  })
  .strict();
export type WorldTownHd2dBrief = z.infer<typeof worldTownHd2dBriefSchema>;

export function worldTownHd2dBriefFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): WorldTownHd2dBrief | null {
  const parsed = worldTownHd2dBriefSchema.safeParse(metadata?.gameTownHd2dBrief);
  return parsed.success ? parsed.data : null;
}

/** What the Game Master is told of the 3D town the party is in, once it is there. */
export function worldTownHd2dBriefText(brief: WorldTownHd2dBrief, settlementName: string): string {
  return `<town_layout>\nThe party is in ${settlementName}, walking its streets. ${brief.text}\nUse these streets, quarters and landmarks when the party moves about the town.\n</town_layout>`;
}

// ── The town as first seen, kept with the game (the chronicle draws over it, never moves its streets) ──

export const worldTownHd2dSpecSchema = z
  .object({
    seed: z.number().int().min(1).max(99991),
    rank: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    cpop: z.number().int().min(0).max(40000),
    basis: z.enum(["market", "road", "bridge", "port", "fishing", "mining"]),
    csite: z.enum(["river", "coast", "plain", "lake"]),
    ground: z.enum(["hill", "flat"]),
    planted: z.boolean(),
    cyear: z.number().int().min(1100).max(1600),
    cflags: z.string().max(200),
    region: z.enum(["en", "lc"]),
    trade: z.enum(["", "cloth", "tanning"]),
    lake: z.boolean().optional(),
  })
  .strict();

export const worldTownHd2dKeptSchema = z
  .object({ settlementId: z.string().min(1).max(16), spec: worldTownHd2dSpecSchema })
  .strict();
export type WorldTownHd2dKept = z.infer<typeof worldTownHd2dKeptSchema>;

/** The towns kept as first seen: every settlement the party has walked (a long game's worth). */
export const WORLD_TOWN_HD2D_KEPT_MAX = 400;
export function worldTownHd2dKeptFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): WorldTownHd2dKept[] {
  const raw = metadata?.gameTownHd2dKept;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((each) => {
    const parsed = worldTownHd2dKeptSchema.safeParse(each);
    return parsed.success ? [parsed.data] : [];
  });
}
/** The kept towns with one more; a town already kept stays as it was first seen. */
export function worldTownHd2dKeptWith(kept: WorldTownHd2dKept[], town: WorldTownHd2dKept): WorldTownHd2dKept[] {
  if (kept.some((each) => each.settlementId === town.settlementId)) return kept;
  return [...kept, town].slice(-WORLD_TOWN_HD2D_KEPT_MAX);
}

/** What the 3D town draws of its chronicle: shares of houses empty and plots burned, the refugees and their
 *  camp, the burial ground and memorial, how its market is doing. */
export interface WorldTownHd2dChronicle {
  empty: number;
  ruined: number;
  lost: number;
  refugees: number;
  camp: boolean;
  burialGround: boolean;
  memorial: boolean;
  prosperity: WorldProsperity;
}
export function worldTownHd2dChronicle(
  chronicle: WorldTownChronicle | null,
  prosperity: WorldProsperity,
): WorldTownHd2dChronicle {
  return {
    empty: chronicle?.empty ?? 0,
    ruined: chronicle?.ruined ?? 0,
    lost: chronicle?.lost ?? 0,
    refugees: chronicle?.refugees ?? 0,
    camp: chronicle?.camp ?? false,
    burialGround: chronicle?.burialGround ?? false,
    memorial: chronicle?.memorial ?? false,
    prosperity,
  };
}
