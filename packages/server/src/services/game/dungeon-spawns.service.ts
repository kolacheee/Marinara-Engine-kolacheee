// Dungeon spawns in a game (location spawns, 2026-11-13): the site of the map the party is on, its areas'
// foes now, and what the game keeps of it (its band, set the first time the party went in, and what the
// party cleared). Only Classic Marinara games without a ruleset have them: the rosters are bestiary foes.

import {
  dungeonAreaFoesNow,
  dungeonFromGameDungeonMap,
  dungeonWalkable,
  dungeonRoomCells,
  dungeonRoomHas,
  dungeonAreaNumberAt,
  dungeonAreas,
  dungeonRosterWords,
  dungeonSiteBand,
  dungeonSiteLairState,
  dungeonSiteFate,
  dungeonSiteFor,
  dungeonSiteOrigin,
  gameDungeonMapFromMetadata,
  gameDungeonSiteKey,
  gameDungeonSitesFromMetadata,
  gameDungeonSitesWith,
  dungeonSiteAfterWin,
  marinaraBestiarySetting,
  normalizeGameDifficulty,
  readMarinaraCardProgression,
  worldHistory,
  worldPlaceByName,
  worldRegionBand,
  worldWithStoryBands,
  worldSiteAnchor,
  worldCellHabitats,
  type DungeonSiteFate,
  type SiteTerrain,
  type DungeonArea,
  type DungeonSite,
  type GameDungeonMap,
  type GameDungeonSiteState,
  type GameWorld,
  type MarinaraBestiarySetting,
  type MarinaraEncounterFoe,
} from "@marinara-engine/shared";
import type { DB } from "../../db/connection.js";
import { gameRepliesBefore } from "./game-market.service.js";
import { loadRulesetRegistry, resolveGameRuleset } from "./ruleset-registry.service.js";

export interface DungeonSiteHere {
  key: string;
  map: GameDungeonMap;
  setting: MarinaraBestiarySetting;
  site: DungeonSite;
  areas: DungeonArea[];
  state: GameDungeonSiteState;
  /** Whether `state` is new and not yet kept on the game. */
  fresh: boolean;
}

/** The setting whose bestiary a game's dungeons draw from, or null for a game they have none in (no
 *  Classic classes, or a ruleset of its own). */
export function dungeonSpawnSetting(
  meta: Record<string, unknown>,
  setup: Record<string, unknown> | null | undefined,
): MarinaraBestiarySetting | null {
  if (setup?.marinaraClasses !== true || meta.gameRuleset) return null;
  const kit = meta.gameWorldKit as { id?: unknown } | undefined;
  return marinaraBestiarySetting(
    typeof kit?.id === "string" ? kit.id : null,
    typeof setup.genre === "string" ? setup.genre : null,
  );
}

/** The game's day, for cleared areas. */
export function gameDay(meta: Record<string, unknown>): number {
  const day = (meta.gameTime as { day?: unknown } | undefined)?.day;
  return typeof day === "number" && Number.isFinite(day) ? Math.floor(day) : 1;
}

/** The party's average Classic level, or undefined with nobody on a Classic card. */
export function gamePartyLevel(meta: Record<string, unknown>): number | undefined {
  const levels = (Array.isArray(meta.gameCharacterCards) ? meta.gameCharacterCards : []).flatMap(
    (card: Record<string, unknown>) => {
      const progression = readMarinaraCardProgression(card.marinara);
      return progression && !progression.fallen ? [progression.level] : [];
    },
  );
  return levels.length ? levels.reduce((sum: number, one: number) => sum + one, 0) / levels.length : undefined;
}

/**
 * A new site's state: its band from the land where it lies (the region's band, the game's difficulty
 * shifting it) (the site's own place, else where the party
 * stands on the overworld, else where the game began) and how it fell. Set once and kept: the band never
 * moves after.
 */
export function newDungeonSiteState(
  world: GameWorld | null,
  map: GameDungeonMap,
  partyPlace: string | undefined,
  partyLevel: number | undefined,
  difficulty?: string,
  /** The Game Master's replies so far: their `[danger:]` tags set the bands the story changed. */
  replies: readonly string[] = [],
): GameDungeonSiteState {
  const origin = dungeonSiteOrigin(map.set, map.name);
  const place =
    (map.place ? world?.world.places.find((each) => each.id === map.place) : undefined) ??
    (world ? worldPlaceByName(world.world, map.name) : undefined);
  const at =
    place?.at ??
    (world ? worldPlaceByName(world.world, partyPlace)?.at : undefined) ??
    (world ? world.world.places.find((each) => each.id === world.world.startId)?.at : undefined);
  // With no world to read, the land is where the party first found the place.
  const region =
    world && at
      ? worldRegionBand(worldWithStoryBands(world, replies), at, difficulty)
      : { low: Math.max(1, Math.round(partyLevel ?? 1)), high: Math.max(1, Math.round(partyLevel ?? 1)) + 3 };
  const anchor = world && place ? worldSiteAnchor(world, place) : undefined;
  const fate = world ? dungeonSiteFate(worldHistory(world), map.name, anchor?.id) : undefined;
  // A planned building's floors are its levels' distance from the one it is entered on.
  const floors = map.site
    ? Math.max(
        ...map.site.levels.map(
          (_, i) =>
            1 +
            Math.abs(
              i -
                Math.max(
                  0,
                  map.site!.levels.findIndex((l) => l.depth === 0),
                ),
            ),
        ),
      )
    : (map.floors ?? 1);
  const band = dungeonSiteBand(origin, region, floors);
  // A creature's lair is drawn from the site's seed, the same one its floors were laid out from.
  return {
    band,
    ...(fate ? { fate } : {}),
    cleared: {},
    ...dungeonSiteLairState(origin, map.siteSeed ?? map.seed, band),
  };
}

/** The Game Master's replies for the band of a site the party has not been in before (the story's
 *  `[danger:]` changes count, as the region's own spawns read them); none once its band is kept. */
export async function dungeonSiteReplies(db: DB, chatId: string, meta: Record<string, unknown>): Promise<string[]> {
  const map = gameDungeonMapFromMetadata(meta);
  if (!map || gameDungeonSitesFromMetadata(meta)[gameDungeonSiteKey(map)]) return [];
  return (await gameRepliesBefore(db, chatId)).all;
}

/** The site of the map the party is on, with its areas and state; null when there is none to have foes. */
export function dungeonSiteHere(input: {
  meta: Record<string, unknown>;
  setup: Record<string, unknown> | null | undefined;
  world: GameWorld | null;
  partyPlace?: string;
  /** The Game Master's replies so far, for a site's first band (see `dungeonSiteReplies`). */
  replies?: readonly string[];
}): DungeonSiteHere | null {
  const map = gameDungeonMapFromMetadata(input.meta);
  if (!map || map.hand || !map.rooms.length) return null;
  const setting = dungeonSpawnSetting(input.meta, input.setup);
  if (!setting) return null;
  const key = gameDungeonSiteKey(map);
  const kept = gameDungeonSitesFromMetadata(input.meta)[key];
  const difficulty =
    typeof input.setup?.difficulty === "string" ? normalizeGameDifficulty(input.setup.difficulty) : undefined;
  const state =
    kept ??
    newDungeonSiteState(input.world, map, input.partyPlace, gamePartyLevel(input.meta), difficulty, input.replies);
  const site = dungeonSiteFor({
    setId: map.set,
    name: map.name,
    setting,
    band: state.band,
    ...(state.fate ? { fate: state.fate } : {}),
    seed: map.siteSeed ?? map.seed,
    ...(map.site?.undead ? { undead: true } : {}),
    ...(state.lair && !state.lairCold ? { lair: state.lair } : {}),
  });
  if (!site) return null;
  return { key, map, setting, site, areas: dungeonAreas(map, site, setting), state, fresh: !kept };
}

/** The foes in the area the party stands in now, and which area it is; none in a passage. */
export function dungeonFoesHere(
  here: DungeonSiteHere,
  today: number,
): { area: DungeonArea; foes: MarinaraEncounterFoe[] } | null {
  const number = dungeonAreaNumberAt(here.map, here.map.at);
  const area = here.areas.find((each) => each.area === number);
  if (!area) return null;
  const foes = dungeonAreaFoesNow(area, here.site, here.setting, here.state, today);
  return foes.length ? { area, foes } : null;
}

/** The first step of a walk that enters a room where foes are now (guards at their posts, squatters
 *  walked in on), leaving the room the walk set out from aside; with the room's name, for the news. */
export function dungeonCatchOnPath(
  here: DungeonSiteHere,
  map: GameDungeonMap,
  path: ReadonlyArray<{ x: number; y: number }>,
  today: number,
): { step: number; area: number; name: string } | null {
  const from = dungeonAreaNumberAt(map, map.at);
  for (const [step, at] of path.entries()) {
    const number = dungeonAreaNumberAt(map, at);
    if (!number || number === from) continue;
    const area = here.areas.find((each) => each.area === number);
    if (!area || !dungeonAreaFoesNow(area, here.site, here.setting, here.state, today).length) continue;
    return { step, area: number, name: map.roomInfo?.[number - 1]?.name ?? map.name };
  }
  return null;
}

/** The fight setup's instruction for a fight in a held area: these foes and no others. */
export function dungeonFightPromptText(here: DungeonSiteHere, foes: readonly MarinaraEncounterFoe[]): string {
  return `This fight is in ${here.map.name}, and the place decides who is fighting: ${dungeonRosterWords(foes, here.setting)}. The enemies are exactly these, each with its family id, tier and level as listed; add none, drop none, and write them as the story sees them.`;
}

/** A fight in a dungeon area, kept on the game from its start to its end: which site and area it was. */
export interface GameDungeonFight {
  key: string;
  area: number;
}

export function gameDungeonFightFromMetadata(meta: Record<string, unknown>): GameDungeonFight | null {
  const raw = meta.gameDungeonFight as Partial<GameDungeonFight> | null | undefined;
  return raw && typeof raw.key === "string" && typeof raw.area === "number" ? { key: raw.key, area: raw.area } : null;
}

/**
 * What a dungeon fight's end changes on the game: won, its area is cleared (and a heart's leader dead, its
 * holders displaced when they scatter); any end forgets the fight. Empty when no dungeon fight was on.
 */
export function dungeonFightEndPatch(
  meta: Record<string, unknown>,
  outcome: string | undefined,
): Record<string, unknown> {
  const fight = gameDungeonFightFromMetadata(meta);
  if (!fight) return {};
  const patch: Record<string, unknown> = { gameDungeonFight: null };
  if (outcome !== "victory") return patch;
  const here = dungeonSiteHere({
    meta,
    setup: meta.gameSetupConfig as Record<string, unknown> | undefined,
    world: null,
  });
  if (!here || here.key !== fight.key || here.fresh) return patch;
  const area = here.areas.find((each) => each.area === fight.area);
  if (!area) return patch;
  patch.gameDungeonSites = gameDungeonSitesWith(
    gameDungeonSitesFromMetadata(meta),
    here.key,
    dungeonSiteAfterWin(here.state, here.site, area, gameDay(meta)),
  );
  return patch;
}

/** A post of the holders on the map, for the party to see: where it is, how many stand there, and
 *  whether it is the heart. */
export interface DungeonGuardMark {
  x: number;
  y: number;
  area: number;
  count: number;
  heart: boolean;
  /** The room the holders keep across the main way: a light is kept burning by it. */
  post?: boolean;
  /** A patrol's beat: the walk it keeps, end to end; the figure stands somewhere along it. */
  beat?: Array<{ x: number; y: number }>;
  /** These guards carry the key to a locked room on the floor (panel round 31: who holds the key). */
  key?: boolean;
  /** Which way the guards look (owner 2026-11-18, sightlines): a step, as {x: 0, y: 1} for south. */
  face?: { x: number; y: number };
  /** They stand on a gallery over the room. */
  raised?: boolean;
  /** They are asleep, off watch: no sight to show. */
  asleep?: boolean;
}

/** The step from one cell toward another, kept to one axis unless it is plainly diagonal. */
function stepToward(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number } {
  const [dx, dy] = [to.x - from.x, to.y - from.y];
  if (!dx && !dy) return { x: 0, y: 1 };
  if (Math.abs(dx) > 2 * Math.abs(dy)) return { x: Math.sign(dx), y: 0 };
  if (Math.abs(dy) > 2 * Math.abs(dx)) return { x: 0, y: Math.sign(dy) };
  return { x: Math.sign(dx), y: Math.sign(dy) };
}

/** The holders' posts as the party sees them on the map (owner 2026-11-13): every guard post and the heart
 *  while the holders still hold them. Squatters are never shown. */
export function dungeonGuardMarks(here: DungeonSiteHere, today: number): DungeonGuardMark[] {
  const holders = new Set([here.site.holder, ...(here.site.leader ? [here.site.leader] : [])]);
  const cells = dungeonFromGameDungeonMap(here.map);
  return here.areas.flatMap((area): DungeonGuardMark[] => {
    if (area.role !== "guard" && area.role !== "heart") return [];
    const foes = dungeonAreaFoesNow(area, here.site, here.setting, here.state, today).filter((foe) =>
      holders.has(foe.familyId),
    );
    if (!foes.length) return [];
    const room = here.map.rooms[area.area - 1]!;
    const key = here.map.locks?.some((lock) => lock.key === area.area - 1) ? { key: true } : {};
    // A patrol walks its walk's middle line end to end; where it is now goes by the day and the walk.
    if (area.patrol) {
      const long = room.w >= room.h;
      // Along the middle of a narrow walk; in a wide room, close along a wall, off the rug in its middle
      // (panel round 29: beats crossing a gallery's rug), on whichever line runs clearest.
      const across = long ? room.h : room.w;
      const at0 = long ? room.y : room.x;
      const tries = across >= 5 ? [at0 + 1, at0 + across - 2] : [at0 + Math.floor(across / 2)];
      const lineOn = (k: number) =>
        dungeonRoomCells(room)
          .filter(({ x, y }) => dungeonWalkable(cells, x, y) && (long ? y : x) === k)
          .sort((p, q) => (long ? p.x - q.x : p.y - q.y));
      // The line that runs past the most cover (panel round 38: beats through the open middle of a ward gave
      // nothing to time against or hide behind), then the longest.
      const cover = (line: Array<{ x: number; y: number }>) =>
        line.filter(({ x, y }) =>
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].some(([dx, dy]) => {
            const [nx, ny] = [x + dx!, y + dy!];
            return (
              nx >= 0 && ny >= 0 && nx < cells.width && ny < cells.height && cells.props[ny * cells.width + nx]! >= 0
            );
          }),
        ).length;
      const pool = long ? [room.y + 1, room.y + room.h - 2, ...tries] : [room.x + 1, room.x + room.w - 2, ...tries];
      const line =
        [...new Set(pool)]
          .map(lineOn)
          .filter((each) => each.length >= 3)
          .sort((p, q) => q.length + 2 * cover(q) - (p.length + 2 * cover(p)))[0] ?? tries.map(lineOn)[0]!;
      if (line.length >= 3) {
        const step = (today * 7 + area.area * 3) % (2 * line.length - 2);
        const at = line[step < line.length ? step : 2 * line.length - 2 - step]!;
        const ahead = step < line.length - 1 ? 1 : -1;
        const face = long ? { x: ahead, y: 0 } : { x: 0, y: ahead };
        return [{ ...at, area: area.area, count: foes.length, heart: false, beat: line, face, ...key }];
      }
    }
    // The room's middle, or the walkable cell nearest it; a cell clear of props (an urn, a lamp, the stairs)
    // first, so the figure never stands in one, and never the cell above it, where its head would be.
    // The chief keeps the middle of the heart.
    const inRoom = (x: number, y: number) => dungeonRoomHas(room, x, y);
    const doors: Array<{ x: number; y: number }> = [];
    if (here.map.roomInfo)
      for (const { x, y } of dungeonRoomCells(room))
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const)
          if (!inRoom(x + dx, y + dy) && dungeonWalkable(cells, x + dx, y + dy)) doors.push({ x, y });
    // Round 3 of the panel (2026-11-17): not at the door the party comes in by. Guards hold the way on: the
    // stairs where the room has them, else the room's door farthest in, else the middle of a room with one door.
    const way = here.map.entrance;
    const fromWay = (p: { x: number; y: number }) => Math.abs(p.x - way.x) + Math.abs(p.y - way.y);
    const stair = here.map.roomInfo ? here.map.links?.find((link) => inRoom(link.x, link.y)) : undefined;
    const sorted = doors.sort((p, q) => fromWay(q) - fromWay(p));
    const farDoor =
      sorted.length && fromWay(sorted[0]!) - fromWay(sorted[sorted.length - 1]!) > 2 ? sorted[0] : undefined;
    const centre = { x: room.x + Math.floor(room.w / 2), y: room.y + Math.floor(room.h / 2) };
    // Round 9 of the panel: a planned building's guards watch the far door from a step inside it, never
    // standing in the doorway or on the stairs (a way up or down is not always a fight).
    // A room with one way in is held at that door, from a step inside it (panel round 26: guards at the
    // back wall read as standing in a corner, not at the door the way forces you through).
    const held = farDoor ?? (area.role !== "heart" ? sorted[0] : undefined);
    const watch = held
      ? { x: held.x + Math.sign(centre.x - held.x), y: held.y + Math.sign(centre.y - held.y) }
      : undefined;
    // The chief stands between the door and what the heart keeps, not on the tomb or the dais itself (panel
    // round 31: guards parked on the founder's tomb).
    const door = sorted[sorted.length - 1];
    const guarding =
      area.role === "heart" && door
        ? { x: Math.round((door.x + centre.x) / 2), y: Math.round((door.y + centre.y) / 2) }
        : undefined;
    const middle = here.map.roomInfo ? (watch ?? guarding ?? centre) : (stair ?? farDoor ?? centre);
    const onLink = (x: number, y: number) => !!here.map.links?.some((link) => link.x === x && link.y === y);
    const clear = (x: number, y: number) =>
      cells.props[y * cells.width + x] === -1 &&
      (y === 0 || cells.props[(y - 1) * cells.width + x] === -1) &&
      !onLink(x, y) &&
      !onLink(x, y + 1);
    let at = middle;
    let best = Infinity;
    for (const { x, y } of dungeonRoomCells(room)) {
      {
        if (!dungeonWalkable(cells, x, y)) continue;
        const away = Math.abs(x - middle.x) + Math.abs(y - middle.y) + (clear(x, y) ? 0 : 100);
        if (away < best) [at, best] = [{ x, y }, away];
      }
    }
    const post = !!here.map.roomInfo?.[area.area - 1]?.post;
    // Where the room has a gallery, its holders stand up on it over the floor, looking out across the room.
    const raised = (here.map.gallery ?? []).filter(
      ({ x, y }) => inRoom(x, y) && dungeonWalkable(cells, x, y) && !onLink(x, y),
    );
    if (raised.length && area.gallery) {
      const mid = raised[Math.floor(raised.length / 2)]!;
      const face = stepToward(mid, centre);
      return [
        {
          ...mid,
          area: area.area,
          count: foes.length,
          heart: false,
          face,
          raised: true,
          ...(post ? { post } : {}),
          ...key,
        },
      ];
    }
    // The chief looks to the door; a door's holders look back across the room, the way the party comes.
    // Panel round 39: a sight cone aimed at a blank wall reads as a mistake, so a holder with another door
    // in the room watches that door, the one the party comes in by.
    const entry = door && held && Math.abs(door.x - held.x) + Math.abs(door.y - held.y) > 2 ? door : undefined;
    const face =
      area.role === "heart" && door
        ? stepToward(at, door)
        : entry
          ? stepToward(at, entry)
          : held && (at.x !== centre.x || at.y !== centre.y)
            ? stepToward(at, centre)
            : held
              ? stepToward(held, at)
              : stepToward(at, door ?? centre);
    return [
      {
        ...at,
        area: area.area,
        count: foes.length,
        heart: area.role === "heart",
        ...(area.asleep ? { asleep: true } : { face }),
        ...(post ? { post } : {}),
        ...key,
      },
    ];
  });
}

/** Skills by which a ruleset finds traps (owner 2026-11-14: traps only where the rules can find them;
 *  SRD has them, MRPG does not). */
const TRAP_SKILL =
  /\b(perception|investigation|investigate|search|searching|notice|spot|spotting|awareness|alertness|detect\w*|traps?)\b/iu;

/** The labels of the game's ruleset skills that find traps; none for a game without a ruleset (MRPG,
 *  Legacy) or one whose rules have no such skill. */
export async function gameTrapSkills(meta: Record<string, unknown>): Promise<string[]> {
  if (meta.gameRuleset == null) return [];
  const pinned = resolveGameRuleset(meta, await loadRulesetRegistry());
  if (pinned.status !== "ok") return [];
  const skills = pinned.definition.sheet?.skills ?? [];
  return skills
    .filter((skill) => TRAP_SKILL.test(skill.label) || TRAP_SKILL.test(skill.id))
    .map((skill) => skill.label);
}

/** What the world says of a building about to be laid out to a plan: how history left it, the land under
 *  it, and whether the game's rules can find traps in it. */
export async function dungeonPlanContext(input: {
  world: GameWorld | null;
  meta: Record<string, unknown>;
  name: string;
  placeId?: string;
}): Promise<{ fate?: DungeonSiteFate; terrain?: SiteTerrain; traps?: boolean }> {
  const { world } = input;
  const place =
    (input.placeId ? world?.world.places.find((each) => each.id === input.placeId) : undefined) ??
    (world ? worldPlaceByName(world.world, input.name) : undefined);
  const anchor = world && place ? worldSiteAnchor(world, place) : undefined;
  const fate = world ? dungeonSiteFate(worldHistory(world), input.name, anchor?.id) : undefined;
  const habitats = world && place ? worldCellHabitats(world, place.at) : [];
  const terrain: SiteTerrain | undefined = habitats.includes("mountain")
    ? "hill"
    : habitats.includes("coast")
      ? "coast"
      : habitats.includes("swamp")
        ? "wet"
        : habitats.includes("urban")
          ? "city"
          : undefined;
  const traps = (await gameTrapSkills(input.meta)).length > 0;
  return { ...(fate ? { fate } : {}), ...(terrain ? { terrain } : {}), ...(traps ? { traps } : {}) };
}
