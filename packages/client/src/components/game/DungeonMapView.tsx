// A dungeon, cave or station map the Game Master opened with `[map:]`: drawn with its set's tile pack when
// the player has it, else in plain colours; a click walks the party there by the shortest way, its minutes
// on the game's clock and the walk told on the next turn; from the way out, the party leaves.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpToLine, DoorOpen, Footprints } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DUNGEON_EXIT_PROP,
  DUNGEON_SECRET_DOOR_PROP,
  dungeonRoomHas,
  dungeonWayOutId,
  dungeonSightCells,
  gameDungeonLinkAt,
  gameDungeonOnWayDown,
  gameDungeonOnWayOut,
  gameDungeonOnWayUp,
  gameDungeonSpotsAt,
  DUNGEON_SETS,
  characterFacing,
  characterFrameAt,
  dungeonAreaAt,
  dungeonFromGameDungeonMap,
  dungeonWalkable,
  worldEdgePiece,
  type CharacterFacing,
  type TilePack,
} from "@marinara-engine/shared";
import { useDungeonLeave, useDungeonMap, useDungeonStairs, useDungeonWalk } from "../../hooks/use-game";
import { useUpdateChatMetadata } from "../../hooks/use-chats";
import {
  overworldBaseResolution,
  overworldCamera,
  useOverworldAtlas,
  useTilePackLibrary,
} from "../../hooks/use-overworld-view";
import { api } from "../../lib/api-client";
import { useGameStateStore } from "../../stores/game-state.store";
import { OVERWORLD_TILE, cellNoise, paintGuard, paintParty } from "../../lib/overworld-paint";
import {
  buildingStyleOf,
  paintBuildingCourt,
  paintBuildingYard,
  paintBuildingFloor,
  buildingFloorKindOf,
  paintBuildingProp,
  paintBuildingWall,
  paintWallPost,
  paintBuildingEarth,
  paintBuildingDais,
  paintBuildingRug,
  paintBuildingGallery,
  paintBuildingWater,
  paintFoundTrap,
  paintSiteLink,
} from "../../lib/building-paint";
import {
  dungeonPaintsSet,
  paintDungeonFloor,
  paintDungeonPool,
  paintPoolRim,
  paintDungeonProp,
  paintDungeonWall,
  paintDungeonWay,
} from "../../lib/dungeon-paint";

const T = OVERWORLD_TILE;
type Point = { x: number; y: number };
const WALK_MS_PER_CELL = 70;
/** Rooms laid with a rug, and its colour. */
/** The furnishings a dais is raised under: the high seat and the altar (site-plans' slots). */
const DAIS_SEAT = 13;
/** How much of a building wall's cell is laid with the floor beside it, at its sides and at its top. */
const WALL_INSET = 5;
const WALL_INSET_TOP = 3;
const DAIS_ALTAR = 24;
const RUG_ROOMS: Readonly<Record<string, string>> = {
  "Lord's chamber": "#7a1e22",
  "Master bedroom": "#7a1e22",
  Solar: "#6a2a4a",
  "Guest bedroom": "#2a5a3a",
  "Guest chamber": "#2a5a3a",
  Parlour: "#7a3a1a",
  "Sitting room": "#2a4a6a",
  "Morning room": "#6a5a2a",
  Boudoir: "#6a2a4a",
  "Music room": "#3a2a5a",
  Library: "#3a2a5a",
  Study: "#5a3a1a",
  Nursery: "#2a5a5a",
  // The great rooms' floors, so a ballroom or a saloon is not a bare field of boards (panel 2026-11-17).
  Ballroom: "#2a3a5a",
  Saloon: "#5a2a2a",
  "Long gallery": "#3a4a2a",
  "Withdrawing room": "#4a2a4a",
  "Drawing room": "#4a2a4a",
};
const WALK_LONGEST_MS = 3000;
/** Without the set's art: the ground in plain colours. */
const PLAIN = { floor: "#4a443d", wall: "#837767", liquid: "#245a78", prop: "#c9a86a" };
const centreOf = (cell: Point): Point => ({ x: cell.x * T + T / 2, y: cell.y * T + T / 2 });

/** The set's own tile pack: the Experience's dungeon look by that id (1.357), else the player's library's
 *  pack by the set's name, else the Engine's own art for the set (the fork's built-ins). */
function useDungeonPack(set: string | undefined, looks?: readonly TilePack[]): TilePack | null | "loading" {
  const { data: library, isPending } = useTilePackLibrary();
  const look = set ? looks?.find((pack) => pack.id === set) : undefined;
  // A pack saved to the library is filed as `local/<its id>`: a pack made for a set carries the set's id.
  const entry = set && !look ? library?.packs.find((pack) => pack.id === set || pack.id === `local/${set}`) : undefined;
  const builtIn = Boolean(set && !look && !entry && library?.builtInDungeons?.includes(set));
  const { data, isPending: packPending } = useQuery({
    queryKey: ["game", "tile-packs", "dungeon", set, entry?.id ?? null, entry?.version ?? null, builtIn],
    queryFn: async () =>
      (
        await api.get<{ pack: TilePack }>(
          entry
            ? `/game-tile-packs/pack?id=${encodeURIComponent(entry.id)}`
            : `/game-tile-packs/builtin/dungeon/${encodeURIComponent(set!)}`,
        )
      ).pack,
    enabled: Boolean(entry) || builtIn,
    staleTime: Infinity,
  });
  if (look) return look;
  if (isPending || ((entry || builtIn) && packPending)) return "loading";
  return entry || builtIn ? (data ?? null) : null;
}

export function DungeonMapView({
  chatId,
  turnKey,
  canWalk,
  onLeft,
  hour,
  dungeonLooks,
  onCaught,
}: {
  chatId: string;
  turnKey: string | null;
  /** False while a turn is under way: the party stays put. */
  canWalk: boolean;
  /** The party left by the way out. */
  onLeft: () => void;
  /** The game's hour, for who stands on a hand-made map's spots. */
  hour?: number;
  /** The Experience's own looks for maps made by hand (1.357), named by a map's pack. */
  dungeonLooks?: readonly TilePack[];
  /** Foes caught the party on its walk (walking in on them): the fight starts. */
  onCaught?: () => void;
}) {
  const { t } = useTranslation();
  const { data } = useDungeonMap(chatId, turnKey, true);
  const kept = data?.map ?? null;
  const guards = useMemo(() => data?.guards ?? [], [data?.guards]);
  // Sneaking (owner 2026-11-18: the guards' sight shows only while the party sneaks), kept on the chat so
  // the Game Master knows; shown at once while the save goes through.
  const updateChatMetadata = useUpdateChatMetadata();
  const [sneakShown, setSneakShown] = useState<boolean | null>(null);
  const sneaking = sneakShown ?? !!data?.sneaking;
  const toggleSneak = useCallback(() => {
    const next = !sneaking;
    setSneakShown(next);
    updateChatMetadata.mutate({ id: chatId, gameDungeonSneak: next });
  }, [chatId, sneaking, updateChatMetadata]);
  // Each walk writes a new record (its `at` moves); the cells, and the base canvas drawn from them, follow
  // the map's layout only.
  const layoutKey = kept
    ? JSON.stringify([
        kept.set,
        kept.seed,
        kept.width,
        kept.height,
        kept.ground,
        kept.props,
        kept.rooms,
        kept.entrance,
        kept.hand ?? null,
        kept.links ?? null,
        kept.site?.level ?? null,
        kept.floor ?? null,
        kept.down ?? null,
      ])
    : null;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the layout key stands for every field the cells read
  const cells = useMemo(() => (kept ? dungeonFromGameDungeonMap(kept) : null), [layoutKey]);
  // A planned building's ways to its other levels, and a carved place's ways out, up and down.
  const links = useMemo(
    () => ({
      list: kept?.links ?? [],
      level: kept?.site?.level ?? 0,
      down: kept?.down,
      floor: kept?.floor ?? 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the layout key stands for the links and the ways
    [layoutKey],
  );
  const set = kept ? DUNGEON_SETS.find((each) => each.id === kept.set) : undefined;
  const pack = useDungeonPack(kept?.pack ?? kept?.set, dungeonLooks);
  // A pack of the set's own: "dungeon" names no family the library chooses for, so only `own` draws.
  const drawTile = useOverworldAtlas("dungeon", pack === null ? undefined : pack);
  const walkMutation = useDungeonWalk();
  const leaveMutation = useDungeonLeave();
  const stairsMutation = useDungeonStairs();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const walkingRef = useRef(false);
  const [walking, setWalking] = useState(false);
  const scale = Math.max(2, Math.min(4, Math.floor(Math.min(size.width / 360, size.height / 260))));

  // ── The map, drawn once: ground, the liquid's edges, then the props from the back row to the front ──
  const shownAt = scale * (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  const resolution = cells ? overworldBaseResolution(drawTile, cells.width * T * cells.height * T, shownAt) : 1;
  const base = useMemo(() => {
    const canvas = document.createElement("canvas");
    if (!cells || drawTile.loading) return canvas;
    canvas.width = cells.width * T * resolution;
    canvas.height = cells.height * T * resolution;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.scale(resolution, resolution);
    ctx.imageSmoothingEnabled = true;
    // A building gone bad with no pack of its own: drawn as a building, walls, hall, rooms and furniture.
    const building = buildingStyleOf(cells.set);
    const coded = !drawTile.image && (building !== null || dungeonPaintsSet(cells.set));
    // Round a planned building's floors at and above the ground lies the land it stands on; round those
    // below it, the earth it is cut in: never a black void (panel 2026-11-16).
    const siteDepth = kept?.site ? (kept.site.levels[kept.site.level]?.depth ?? -1) : null;
    const outdoors = siteDepth !== null && siteDepth >= 0;
    const buried = siteDepth !== null && siteDepth < 0;
    // A crypt's founder lies on a raised platform: three by three of stone under the tomb nearest the
    // middle of the heart (gamer panel 2026-11-17: the tomb was a lone coffin in an empty room).
    const raiseTomb = (ctx: CanvasRenderingContext2D) => {
      if (building || !kept?.roomInfo) return;
      cells.rooms.forEach((room, n) => {
        if (!kept.roomInfo?.[n]?.heart || Math.min(room.w, room.h) < 5) return;
        const mid = { x: room.x + (room.w - 1) / 2, y: room.y + (room.h - 1) / 2 };
        let tomb: { x: number; y: number } | null = null;
        for (let y = room.y + 1; y < room.y + room.h - 1; y++)
          for (let x = room.x + 1; x < room.x + room.w - 1; x++)
            if (
              cells.props[y * cells.width + x] === 0 &&
              (!tomb || Math.abs(x - mid.x) + Math.abs(y - mid.y) < Math.abs(tomb.x - mid.x) + Math.abs(tomb.y - mid.y))
            )
              tomb = { x, y };
        if (tomb) paintBuildingDais(ctx, (tomb.x - 1) * T, (tomb.y - 1) * T, 3 * T, 3 * T, "S", true);
      });
    };

    // A soft shadow on the floor along the foot of every wall, so the line of a room's walls reads at a
    // glance even where floor and wall are the same stone (panel 2026-11-17: a crypt chapel's rooms could
    // not be told apart).
    const building_ = buildingStyleOf(cells.set);
    /** Whether a building's wall cell is laid thin on one side: the cell beside it is a room's floor (not a
     *  doorway, a pool or the land), and the wall is no hidden door or other piece. */
    const wallInset = (x: number, y: number, dx: number, dy: number) => {
      const g = (u: number, v: number) =>
        u < 0 || v < 0 || u >= cells.width || v >= cells.height ? "rock" : cells.ground[v * cells.width + u];
      const prop = cells.props[y * cells.width + x];
      if (!building_ || g(x, y) !== "wall" || (prop !== -1 && prop !== DUNGEON_SECRET_DOOR_PROP)) return false;
      const [nx, ny] = [x + dx, y + dy];
      if (g(nx, ny) !== "floor") return false;
      // A doorway (walls either side of it across the way) keeps its jambs.
      return dx
        ? !(g(nx, ny - 1) === "wall" && g(nx, ny + 1) === "wall")
        : !(g(nx - 1, ny) === "wall" && g(nx + 1, ny) === "wall");
    };
    const shadeWallFeet = (ctx: CanvasRenderingContext2D) => {
      const g = (x: number, y: number) =>
        x < 0 || y < 0 || x >= cells.width || y >= cells.height ? "rock" : cells.ground[y * cells.width + x];
      const solid = (x: number, y: number) => g(x, y) === "wall";
      const depth = Math.max(3, Math.round(T * 0.22));
      for (let y = 0; y < cells.height; y++)
        for (let x = 0; x < cells.width; x++) {
          if (g(x, y) !== "floor") continue;
          const [px, py] = [x * T, y * T];
          const edge = (x0: number, y0: number, x1: number, y1: number, w: number, h: number) => {
            const grad = ctx.createLinearGradient(x0, y0, x1, y1);
            grad.addColorStop(0, "rgba(0,0,0,0.42)");
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), w, h);
          };
          // A thin wall's shadow falls from where it now stands, inside its cell.
          const left = solid(x - 1, y) && wallInset(x - 1, y, 1, 0) ? WALL_INSET : 0;
          const right = solid(x + 1, y) && wallInset(x + 1, y, -1, 0) ? WALL_INSET : 0;
          if (solid(x, y - 1)) edge(px, py, px, py + depth, T, depth);
          if (solid(x - 1, y)) edge(px - left, py, px - left + depth, py, depth, T);
          if (solid(x + 1, y)) edge(px + T + right, py, px + T + right - depth, py, depth, T);
        }
    };
    if (coded) {
      const at = (x: number, y: number) =>
        x < 0 || y < 0 || x >= cells.width || y >= cells.height ? "rock" : cells.ground[y * cells.width + x];
      // Open courts: a planned building's rooms open to the sky.
      const courts = cells.rooms.filter((_, n) => kept?.roomInfo?.[n]?.use === "open");
      const inRoom = (x: number, y: number) => cells.rooms.some((room) => dungeonRoomHas(room, x, y));
      // The hall: floor outside every room, but for a doorway into one, laid as the room's floor.
      const isHall = (x: number, y: number) =>
        at(x, y) === "floor" &&
        !inRoom(x, y) &&
        // A doorway into a room is laid as the room's floor, never a lone square of the hall's.
        !inRoom(x - 1, y) &&
        !inRoom(x + 1, y) &&
        !inRoom(x, y - 1) &&
        !inRoom(x, y + 1);
      // A planned building's front door: a path out across the land to it, a porch's two columns either side.
      const exitAt = outdoors && building ? cells.props.indexOf(DUNGEON_EXIT_PROP) : -1;
      const door = exitAt >= 0 ? { x: exitAt % cells.width, y: Math.floor(exitAt / cells.width) } : null;
      const out = door
        ? ([
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ].find(([dx, dy]) => at(door.x + dx!, door.y + dy!) === "rock") ?? null)
        : null;
      const onPath = (x: number, y: number) =>
        !!door &&
        !!out &&
        (out[0] === 0 ? x === door.x && (y - door.y) * out[1]! > 0 : y === door.y && (x - door.x) * out[0]! > 0);
      // Each room's own floor by what it is for; a house's cellars keep their flags.
      const floorKinds =
        building && !buried ? cells.rooms.map((_, n) => buildingFloorKindOf(kept?.roomInfo?.[n]?.name)) : [];
      const floorKindAt = (x: number, y: number) => {
        for (const [n, room] of cells.rooms.entries())
          if (floorKinds[n] && dungeonRoomHas(room, x, y)) return floorKinds[n]!;
        return null;
      };
      // A castle's battlements: the walls along its wall walk and its towers' tops, crenellated on the field
      // side, a low parapet looking down into the ward on the other (panel round 24: a bare ring).
      const ramparts = cells.rooms
        .map((room, n) => ({ room, name: kept?.roomInfo?.[n]?.name ?? "" }))
        .filter(({ name }) => /^(Wall walk|Corner tower|Mural tower|Gate chamber)/u.test(name))
        .map(({ room }) => room);
      const onRampart = (x: number, y: number) =>
        building === "keep" &&
        (siteDepth ?? 0) > 0 &&
        at(x, y) === "floor" &&
        ramparts.some((room) => dungeonRoomHas(room, x, y));
      const [midX, midY] = [cells.width / 2, cells.height / 2];
      const battlement = (x: number, y: number) => {
        for (const [dx, dy] of [
          [0, -1],
          [0, 1],
          [-1, 0],
          [1, 0],
        ] as const) {
          // The walk beside it, with the land beyond it or beyond one more course of a wall two thick.
          const near = onRampart(x + dx, y + dy);
          const far = at(x + dx, y + dy) === "wall" && onRampart(x + 2 * dx, y + 2 * dy);
          const land = at(x - dx, y - dy) === "rock";
          const inner = near && at(x - dx, y - dy) === "wall" && at(x - 2 * dx, y - 2 * dy) === "rock";
          if (!((near || far) && land) && !inner) continue;
          // The field side when the land lies away from the middle of the map.
          const outward = -dx * (x - midX) + -dy * (y - midY) > 0;
          const [ox, oy] = [x * T, y * T];
          // The top of the wall as dressed stone, so the rampart reads as stone walked beside, not a void.
          ctx.fillStyle = "#5d5853";
          ctx.fillRect(ox, oy, T, T);
          ctx.fillStyle = "#4a4642";
          for (let k = 0; k < T; k += 8) {
            if (dy !== 0) ctx.fillRect(ox, oy + k, T, 1);
            else ctx.fillRect(ox + k, oy, 1, T);
          }
          if (inner) return;
          const along = (k: number, len: number, depth: number, colour: string) => {
            // A strip `len` long and `depth` deep on the land side of the cell, `k` along it.
            ctx.fillStyle = colour;
            if (dy !== 0) ctx.fillRect(ox + k, dy > 0 ? oy : oy + T - depth, len, depth);
            else ctx.fillRect(dx > 0 ? ox : ox + T - depth, oy + k, depth, len);
          };
          if (outward) {
            // The parapet: merlons and crenels along the field edge, shadow at their foot.
            along(0, T, 10, "#2c2926");
            for (let k = 0; k < T; k += 8) {
              along(k, 5, 9, "#9a958c");
              along(k, 5, 2, "#c2bdb3");
              along(k + 4, 1, 9, "#6c6862");
            }
          } else {
            // A low parapet over the ward.
            along(0, T, 5, "#2c2926");
            along(0, T, 4, "#9a958c");
            along(0, T, 1, "#c2bdb3");
          }
          return;
        }
      };
      // A building's floor cell as it is laid (its court, its room's floor), so a thin wall's edge can be
      // laid with the floor beside it.
      const paintBuildingFloorCell = (x: number, y: number) => {
        const noise = cellNoise(x, y);
        if (courts.some((court) => x >= court.x && x < court.x + court.w && y >= court.y && y < court.y + court.h)) {
          // A path across the court from each opening in its walls.
          const court = courts.find(
            (each) => x >= each.x && x < each.x + each.w && y >= each.y && y < each.y + each.h,
          )!;
          const mid = { x: court.x + Math.floor(court.w / 2), y: court.y + Math.floor(court.h / 2) };
          // A castle's ward is cobbled along its edges and paths with trodden grass between (gamer panel
          // 2026-11-17: an all-stone ward read as a roofed hall); a house's or a cloister's court is a garden
          // crossed by paths.
          // A castle's ward is one open bailey of trodden earth, cobbled only down the way from the gate
          // and across it, a little grass where nobody walks (panel 2026-11-17: paved strips round grass
          // beds read as a cloister, then as a ring road).
          const paved = x === mid.x || y === mid.y;
          const edge = x === court.x || y === court.y || x === court.x + court.w - 1 || y === court.y + court.h - 1;
          if (building === "keep" && !paved)
            if (edge && cellNoise(Math.floor(x / 2), Math.floor(y / 2))(77) < 0.35)
              paintBuildingCourt(ctx, x * T, y * T, false, noise);
            else paintBuildingYard(ctx, x * T, y * T, noise);
          else paintBuildingCourt(ctx, x * T, y * T, paved, noise);
        } else
          // A house's cellars and a church's undercroft are flagged stone, not boards or marble (panel
          // round 23).
          paintBuildingFloor(
            ctx,
            buried ? "keep" : building!,
            x * T,
            y * T,
            isHall(x, y),
            noise,
            {
              up: isHall(x, y - 1),
              down: isHall(x, y + 1),
            },
            floorKindAt(x, y),
          );
      };
      for (let y = 0; y < cells.height; y++)
        for (let x = 0; x < cells.width; x++) {
          const ground = at(x, y);
          const noise = cellNoise(x, y);
          if (ground === "rock") {
            // Round a planned building's floors at and above the ground lies the land it stands on, not a
            // black void (panel 2026-11-16).
            if (outdoors) paintBuildingCourt(ctx, x * T, y * T, onPath(x, y), noise);
            else if (buried && building) paintBuildingEarth(ctx, x * T, y * T, noise);
            else if (buried) paintDungeonWall(ctx, cells.set, x * T, y * T, false, noise);
            continue;
          }
          if (ground === "wall") {
            const below = at(x, y + 1);
            const face = below === "floor" || below === "liquid";
            if (building) {
              let deep = true;
              for (let dy = -1; dy <= 1 && deep; dy++)
                for (let dx = -1; dx <= 1; dx++) {
                  const near = at(x + dx, y + dy);
                  if (near === "floor" || near === "liquid") deep = false;
                }
              paintBuildingWall(ctx, building, x * T, y * T, face, noise, deep);
              battlement(x, y);
            } else paintDungeonWall(ctx, cells.set, x * T, y * T, face, noise);
          } else if (ground === "liquid") {
            if (building) paintBuildingWater(ctx, x * T, y * T, noise);
            else paintDungeonPool(ctx, cells.set, x * T, y * T, noise);
            const dry = (dx: number, dy: number) => at(x + dx, y + dy) !== "liquid";
            paintPoolRim(ctx, x * T, y * T, { n: dry(0, -1), s: dry(0, 1), w: dry(-1, 0), e: dry(1, 0) });
          } else if (building) paintBuildingFloorCell(x, y);
          // A planned crypt's hall is set apart from its rooms; a carved place's ground is all one.
          else paintDungeonFloor(ctx, cells.set, x * T, y * T, noise, Boolean(cells.roomNames) && isHall(x, y));
        }
      // Thin walls (owner 2026-11-17, "Thin walls everywhere"): a wall's sides toward a room are laid with
      // that room's floor, so a wall between two rooms reads as a line, not a cell-wide black band; its face
      // toward the room below stays as it stands.
      const insetWallCell = (x: number, y: number) => {
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
        ] as const) {
          if (!wallInset(x, y, dx, dy)) continue;
          const depth = dy ? WALL_INSET_TOP : WALL_INSET;
          ctx.save();
          ctx.beginPath();
          if (dx < 0) ctx.rect(x * T, y * T, depth, T);
          else if (dx > 0) ctx.rect(x * T + T - depth, y * T, depth, T);
          else ctx.rect(x * T, y * T, T, depth);
          ctx.clip();
          ctx.translate(-dx * T, -dy * T);
          paintBuildingFloorCell(x + dx, y + dy);
          ctx.restore();
        }
        // A thin wall's free end: a stone post caps it.
        const walls = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].filter(([dx, dy]) => at(x + dx!, y + dy!) === "wall").length;
        if (walls <= 1 && building) {
          const l = wallInset(x, y, -1, 0) ? WALL_INSET - 1 : 0;
          const r = wallInset(x, y, 1, 0) ? WALL_INSET - 1 : 0;
          const top = wallInset(x, y, 0, -1) ? WALL_INSET_TOP - 1 : 0;
          if (l || r) paintWallPost(ctx, building, x * T + l, y * T + top, T - l - r, Math.min(T - l - r, T - top));
        }
      };
      if (building)
        for (let y = 0; y < cells.height; y++)
          for (let x = 0; x < cells.width; x++) if (at(x, y) === "wall") insetWallCell(x, y);
      shadeWallFeet(ctx);
      // A rug in the quiet rooms people live in, under their furniture (panel 2026-11-17).
      if (building)
        cells.rooms.forEach((room, n) => {
          const name = (kept?.roomInfo?.[n]?.name ?? "").replace(/\s+\d+$/u, "");
          const colour = RUG_ROOMS[name];
          if (!colour || room.w < 5 || room.h < 5) return;
          const m = Math.min(room.w, room.h) >= 9 ? 2 : 1;
          paintBuildingRug(ctx, (room.x + m) * T, (room.y + m) * T, (room.w - 2 * m) * T, (room.h - 2 * m) * T, colour);
        });
      // A dais at the high end of a hall, under its high seat or altar: two cells deep along the wall the seat
      // stands against, the room's width less a cell each end (gamer panel 2026-11-17).
      const onDais = new Set<number>();
      if (building)
        cells.rooms.forEach((room) => {
          if (Math.min(room.w, room.h) < 5) return;
          for (let y = room.y; y < room.y + room.h; y++)
            for (let x = room.x; x < room.x + room.w; x++) {
              const prop = cells.props[y * cells.width + x];
              if (prop !== DAIS_SEAT && prop !== DAIS_ALTAR) continue;
              const gaps = { N: y - room.y, S: room.y + room.h - 1 - y, W: x - room.x, E: room.x + room.w - 1 - x };
              const side = (Object.keys(gaps) as Array<keyof typeof gaps>).reduce((p, q) =>
                gaps[q] < gaps[p] ? q : p,
              );
              if (gaps[side] > 1) continue;
              const across = side === "N" || side === "S";
              if ((across ? room.w : room.h) < 5 || (across ? room.h : room.w) < 6) continue;
              const [dx, dy, dw, dh] = across
                ? [room.x + 1, side === "N" ? room.y : room.y + room.h - 2, room.w - 2, 2]
                : [side === "W" ? room.x : room.x + room.w - 2, room.y + 1, 2, room.h - 2];
              const front = ({ N: "S", S: "N", W: "E", E: "W" } as const)[side];
              paintBuildingDais(ctx, dx * T, dy * T, dw * T, dh * T, front, building !== "manor");
              onDais.add(y * cells.width + x);
              return;
            }
        });
      raiseTomb(ctx);
      // Doorways: a door standing open against one jamb wherever a room opens through a wall one cell wide,
      // so the ways between rooms read at a glance (panel round 5). Archways (wider) stay open.
      if (building)
        for (let y = 0; y < cells.height; y++)
          for (let x = 0; x < cells.width; x++) {
            if (at(x, y) !== "floor" || cells.props[y * cells.width + x] !== -1 || inRoom(x, y)) continue;
            const across =
              at(x - 1, y) === "wall" && at(x + 1, y) === "wall"
                ? "ns"
                : at(x, y - 1) === "wall" && at(x, y + 1) === "wall"
                  ? "we"
                  : null;
            if (!across) continue;
            const ends = across === "ns" ? [inRoom(x, y - 1), inRoom(x, y + 1)] : [inRoom(x - 1, y), inRoom(x + 1, y)];
            if (!ends[0] && !ends[1]) continue;
            const [px0, py0] = [x * T, y * T];
            // A cell's door is a grille of iron bars, the cell seen through it (panel 2026-11-17).
            const sides =
              across === "ns"
                ? [
                    [x, y - 1],
                    [x, y + 1],
                  ]
                : [
                    [x - 1, y],
                    [x + 1, y],
                  ];
            const barred = sides.some(([sx, sy]) => {
              const n = cells.rooms.findIndex((room) => dungeonRoomHas(room, sx!, sy!));
              return n >= 0 && /^(Cell|Oubliette)\b/u.test(kept?.roomInfo?.[n]?.name ?? "");
            });
            if (barred) {
              ctx.fillStyle = "#1a1a1e";
              if (across === "ns") ctx.fillRect(px0, py0 + Math.floor(T / 2) - 2, T, 4);
              else ctx.fillRect(px0 + Math.floor(T / 2) - 2, py0, 4, T);
              ctx.fillStyle = "#8a8c94";
              for (let k = 1; k < 5; k++) {
                const at2 = Math.round((k * T) / 5);
                if (across === "ns") ctx.fillRect(px0 + at2 - 1, py0 + Math.floor(T / 2) - 3, 2, 6);
                else ctx.fillRect(px0 + Math.floor(T / 2) - 3, py0 + at2 - 1, 6, 2);
              }
              ctx.fillStyle = "#b0b2ba";
              if (across === "ns") ctx.fillRect(px0, py0 + Math.floor(T / 2) - 1, T, 1);
              else ctx.fillRect(px0 + Math.floor(T / 2) - 1, py0, 1, T);
              continue;
            }
            ctx.fillStyle = "#1a100a";
            if (across === "ns") {
              ctx.fillRect(px0, py0, 2, T);
              ctx.fillRect(px0 + T - 2, py0, 2, T);
              ctx.fillStyle = "#6a4422";
              ctx.fillRect(px0 + 2, py0 + 1, 3, T - 2);
              ctx.fillStyle = "#8a5a30";
              ctx.fillRect(px0 + 2, py0 + 1, 1, T - 2);
              ctx.fillStyle = "#c8a040";
              ctx.fillRect(px0 + 4, py0 + Math.floor(T / 2), 1, 1);
            } else {
              ctx.fillRect(px0, py0, T, 2);
              ctx.fillRect(px0, py0 + T - 2, T, 2);
              ctx.fillStyle = "#6a4422";
              ctx.fillRect(px0 + 1, py0 + 2, T - 2, 3);
              ctx.fillStyle = "#8a5a30";
              ctx.fillRect(px0 + 1, py0 + 2, T - 2, 1);
              ctx.fillStyle = "#c8a040";
              ctx.fillRect(px0 + Math.floor(T / 2), py0 + 4, 1, 1);
            }
          }
      // A high seat stands on a dais: a raised step three wide under it (panel round 4).
      if (building)
        for (let i = 0; i < cells.props.length; i++) {
          if (cells.props[i] !== 13 || onDais.has(i)) continue;
          const [sx, sy] = [i % cells.width, Math.floor(i / cells.width)];
          for (let dx = -1; dx <= 1; dx++)
            if (at(sx + dx, sy) === "floor") {
              ctx.fillStyle = "#1a120c";
              ctx.fillRect((sx + dx) * T, sy * T, T, T);
              ctx.fillStyle = building === "manor" ? "#6a3a20" : "#6e675c";
              ctx.fillRect((sx + dx) * T, sy * T, T, T - 2);
              ctx.fillStyle = building === "manor" ? "#8a5030" : "#8a8376";
              ctx.fillRect((sx + dx) * T, sy * T, T, 1);
            }
        }
      // A gallery over the hall (owner 2026-11-18, verticality): raised boards along its wall, the rail's cells
      // boarded too, the steps down at one end, and the shadow it throws on the floor below.
      const galleryCells = new Set((kept?.gallery ?? []).map(({ x, y }) => y * cells.width + x));
      if (building && galleryCells.size) {
        const RAIL = 44;
        const isRail = (x: number, y: number) =>
          x >= 0 && y >= 0 && x < cells.width && y < cells.height && cells.props[y * cells.width + x] === RAIL;
        const raisedAt = (x: number, y: number) => galleryCells.has(y * cells.width + x) || isRail(x, y);
        const alongOf = (x: number, y: number): "x" | "y" =>
          raisedAt(x - 1, y) || raisedAt(x + 1, y) ? (raisedAt(x, y - 1) && raisedAt(x, y + 1) ? "y" : "x") : "y";
        for (let i = 0; i < cells.props.length; i++) {
          const [x, y] = [i % cells.width, Math.floor(i / cells.width)];
          if (!galleryCells.has(i) && !isRail(x, y)) continue;
          if (
            isRail(x, y) &&
            ![
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ].some(([dx, dy]) => galleryCells.has((y + dy!) * cells.width + x + dx!))
          )
            continue;
          // The steps: a gallery cell with plain floor beside it, its treads across the way down.
          const down = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].find(([dx, dy]) => at(x + dx!, y + dy!) === "floor" && !raisedAt(x + dx!, y + dy!));
          const step = galleryCells.has(i) && !!down;
          paintBuildingGallery(
            ctx,
            x * T,
            y * T,
            step ? (down![1] !== 0 ? "x" : "y") : alongOf(x, y),
            step,
            cellNoise(x, y),
          );
        }
        // Its shadow on the hall floor below the rail.
        for (let i = 0; i < cells.props.length; i++) {
          const [x, y] = [i % cells.width, Math.floor(i / cells.width)];
          if (!isRail(x, y)) continue;
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const) {
            const [nx, ny] = [x + dx, y + dy];
            if (at(nx, ny) !== "floor" || raisedAt(nx, ny)) continue;
            const [ox, oy] = [nx * T, ny * T];
            for (let k = 0; k < 7; k++) {
              ctx.fillStyle = `rgba(8, 5, 3, ${0.5 - k * 0.07})`;
              if (dx === 1) ctx.fillRect(ox + k, oy, 1, T);
              else if (dx === -1) ctx.fillRect(ox + T - 1 - k, oy, 1, T);
              else if (dy === 1) ctx.fillRect(ox, oy + k, T, 1);
              else ctx.fillRect(ox, oy + T - 1 - k, T, 1);
            }
          }
        }
      }
      const wayOut = dungeonWayOutId(DUNGEON_SETS.find((each) => each.id === cells.set));
      const way = wayOut === "ladder" ? "ladder" : wayOut === "ladder_hatch" ? "hatch" : "stairs";
      for (let y = 0; y < cells.height; y++)
        for (let x = 0; x < cells.width; x++) {
          const prop = cells.props[y * cells.width + x]!;
          if (prop < 0) continue;
          if (building && prop === DUNGEON_SECRET_DOOR_PROP) {
            // A hidden door: the wall it hides in, with only a hairline and a scuff to give it away.
            const below = at(x, y + 1);
            paintBuildingWall(ctx, building, x * T, y * T, below === "floor", cellNoise(x, y));
            // Laid as thin as the wall it hides in, so its width gives nothing away.
            insetWallCell(x, y);
            const l = wallInset(x, y, -1, 0) ? WALL_INSET : 0;
            const r = wallInset(x, y, 1, 0) ? WALL_INSET : 0;
            const top = wallInset(x, y, 0, -1) ? WALL_INSET_TOP : 0;
            ctx.fillStyle = "rgba(10, 6, 4, 0.7)";
            ctx.fillRect(x * T + l + 1, y * T + top + 2, 1, T - top - 3);
            ctx.fillRect(x * T + T - r - 2, y * T + top + 2, 1, T - top - 3);
            ctx.fillRect(x * T + l + 1, y * T + top + 2, T - l - r - 2, 1);
            // A draught has kept the cobwebs off it, and the floor in front is scraped in an arc where the
            // door swings (panel round 6: a hidden door needs a tell a careful eye can find).
            ctx.fillStyle = "rgba(230, 220, 190, 0.5)";
            ctx.fillRect(x * T + 6, y * T + 5, 1, 4);
            for (const [dx, dy] of [
              [0, 1],
              [0, -1],
              [1, 0],
              [-1, 0],
            ] as const) {
              if (at(x + dx, y + dy) !== "floor") continue;
              const [ox, oy] = [(x + dx) * T, (y + dy) * T];
              ctx.fillStyle = "rgba(225, 212, 178, 0.45)";
              for (let k = 0; k < 7; k++) {
                const a = (k / 6) * (Math.PI / 2);
                const r = T - 4;
                const px =
                  dx === 0
                    ? ox + 2 + Math.round(Math.sin(a) * r)
                    : dx > 0
                      ? ox + Math.round((1 - Math.cos(a)) * 3)
                      : ox + T - 1 - Math.round((1 - Math.cos(a)) * 3);
                const py =
                  dy === 0
                    ? oy + 2 + Math.round(Math.sin(a) * r)
                    : dy > 0
                      ? oy + Math.round((1 - Math.cos(a)) * 3)
                      : oy + T - 1 - Math.round((1 - Math.cos(a)) * 3);
                ctx.fillRect(px, py, 1, 1);
              }
            }
            continue;
          }
          if (building) {
            const same = (dx: number, dy: number) =>
              x + dx >= 0 &&
              x + dx < cells.width &&
              y + dy >= 0 &&
              y + dy < cells.height &&
              cells.props[(y + dy) * cells.width + x + dx] === prop;
            const join =
              (prop === 0 && building !== "temple") || prop === 25 || prop === 43 || prop === 44
                ? { w: same(-1, 0), e: same(1, 0), n: same(0, -1), s: same(0, 1) }
                : undefined;
            paintBuildingProp(ctx, building, prop, x * T, y * T, join);
          } else if (prop === DUNGEON_EXIT_PROP) {
            // The way: out on the first floor, up on the floors below it, and down where the floor goes on.
            const isDown = links.down?.x === x && links.down?.y === y;
            paintDungeonWay(ctx, way, isDown ? "down" : links.floor > 1 ? "up" : "out", x * T, y * T);
          } else paintDungeonProp(ctx, cells.set, prop, x * T, y * T);
        }
      // A warm pool of light round each hearth, range and brazier (casual panel 2026-11-17).
      if (building)
        for (let i = 0; i < cells.props.length; i++) {
          if (cells.props[i] !== 3 && cells.props[i] !== 19) continue;
          const [gx, gy] = [((i % cells.width) + 0.5) * T, (Math.floor(i / cells.width) + 0.5) * T];
          const glow = ctx.createRadialGradient(gx, gy, T * 0.3, gx, gy, T * 3);
          glow.addColorStop(0, "rgba(255, 176, 84, 0.26)");
          glow.addColorStop(1, "rgba(255, 176, 84, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(gx - T * 3, gy - T * 3, T * 6, T * 6);
        }
      if (door && out && building && building !== "keep")
        for (const side of [-1, 1]) {
          const cx = door.x + out[0]! + (out[0] === 0 ? 2 * side : 0);
          const cy = door.y + out[1]! + (out[1] === 0 ? 2 * side : 0);
          if (at(cx, cy) === "rock") paintBuildingProp(ctx, building, 16, cx * T, cy * T);
        }
      for (const link of links.list) paintSiteLink(ctx, link.kind, link.level > links.level, link.x * T, link.y * T);
      return canvas;
    }
    const plain = (colour: string, x: number, y: number) => {
      ctx.fillStyle = colour;
      ctx.fillRect(x, y, T, T);
    };
    // One chosen cell of a pattern tile, drawn at (x, y): the pattern is read by position, so the canvas is
    // shifted to put that cell's position under (x, y).
    const drawPatternCell = (
      target: CanvasRenderingContext2D,
      id: string,
      col: number,
      row: number,
      x: number,
      y: number,
      pick: number,
    ) => {
      target.save();
      target.translate((x - col) * T, (y - row) * T);
      const drew = drawTile(target, id, col * T, row * T, pick);
      target.restore();
      return drew;
    };
    const liquidEdges = drawTile.hasEdges("dn_liquid");
    for (let y = 0; y < cells.height; y++)
      for (let x = 0; x < cells.width; x++) {
        const ground = cells.ground[y * cells.width + x];
        const pick = cellNoise(x, y)(5);
        if (ground === "rock") {
          if (outdoors) paintBuildingCourt(ctx, x * T, y * T, false, cellNoise(x, y));
          else if (buried && !drawTile(ctx, "dn_wall", x * T, y * T, pick)) plain(PLAIN.wall, x * T, y * T);
          continue;
        }
        // A wall shows its face where a floor lies below it and its top elsewhere, when the pack has them.
        // The face is a pattern two cells tall: its lower row, so a wall one cell thick still stands on the
        // floor. The top is a 4x4 autotile keyed by which sides meet a wall (N 1, E 2, S 4, W 8), so its rim
        // runs round the wall's outline instead of boxing every cell.
        if (ground === "wall") {
          const at = (dx: number, dy: number) => {
            const [nx, ny] = [x + dx, y + dy];
            return nx >= 0 && ny >= 0 && nx < cells.width && ny < cells.height
              ? cells.ground[ny * cells.width + nx]
              : "rock";
          };
          const below = at(0, 1);
          if (below === "floor" || below === "liquid") {
            if (drawPatternCell(ctx, "dn_wall_face", x % 6, 1, x, y, pick)) continue;
          } else if (buried || cells.roomNames) {
            // Below ground a wall's top is the masonry it is cut in, like the rock round it, not a black rim
            // round every chamber (layout rebuild 2026-11-17); a planned crypt's chapel is built of the same
            // masonry, so its inner walls do not read as black slabs floating in the floor (panel 2026-11-17).
            if (drawTile(ctx, "dn_wall", x * T, y * T, pick)) continue;
          } else {
            const mask =
              (at(0, -1) === "wall" ? 1 : 0) |
              (at(1, 0) === "wall" ? 2 : 0) |
              (below === "wall" ? 4 : 0) |
              (at(-1, 0) === "wall" ? 8 : 0);
            if (drawPatternCell(ctx, "dn_wall_top", mask % 4, Math.floor(mask / 4), x, y, pick)) continue;
          }
        }
        // With the liquid's edge pieces, a pool is under-painted as floor and drawn by the pieces.
        const id = ground === "wall" ? "dn_wall" : ground === "liquid" && !liquidEdges ? "dn_liquid" : "dn_floor";
        const colour =
          ground === "wall" ? PLAIN.wall : ground === "liquid" && !liquidEdges ? PLAIN.liquid : PLAIN.floor;
        if (!drawTile(ctx, id, x * T, y * T, pick)) plain(colour, x * T, y * T);
      }
    if (liquidEdges) {
      const rows = drawTile.edgeRows("dn_liquid");
      const filled = (x: number, y: number) => cells.ground[y * cells.width + x] === "liquid";
      for (let y = 0; y <= cells.height; y++)
        for (let x = 0; x <= cells.width; x++) {
          const piece = worldEdgePiece(filled, x, y, cells.width, cells.height, rows);
          if (piece >= 0) drawTile.edge(ctx, "dn_liquid", piece, x * T, y * T, cellNoise(x, y)(71));
        }
    }
    shadeWallFeet(ctx);
    // A doorway through a wall's face (walls with their faces either side, floor in front and behind) gets
    // the pack's door, an arch two cells tall standing in the wall.
    const groundAt = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < cells.width && y < cells.height ? cells.ground[y * cells.width + x] : "rock";
    const open = (ground: string | undefined) => ground === "floor" || ground === "liquid";
    for (let y = 1; y < cells.height; y++)
      for (let x = 0; x < cells.width; x++) {
        if (groundAt(x, y) !== "floor" || !open(groundAt(x, y + 1)) || !open(groundAt(x, y - 1))) continue;
        if (groundAt(x - 1, y) !== "wall" || groundAt(x + 1, y) !== "wall") continue;
        if (!open(groundAt(x - 1, y + 1)) || !open(groundAt(x + 1, y + 1))) continue;
        drawTile(ctx, "dn_door_wall", x * T, y * T, 0);
      }
    raiseTomb(ctx);
    for (let y = 0; y < cells.height; y++)
      for (let x = 0; x < cells.width; x++) {
        const prop = cells.props[y * cells.width + x]!;
        if (prop < 0) continue;
        if (!drawTile(ctx, `dn_prop${prop}`, x * T, y * T)) {
          ctx.fillStyle = PLAIN.prop;
          if (prop === DUNGEON_EXIT_PROP) {
            ctx.fillRect(x * T + 3, y * T + 3, T - 6, T - 6);
          } else {
            ctx.beginPath();
            ctx.arc(x * T + T / 2, y * T + T / 2, T / 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    for (const link of links.list) paintSiteLink(ctx, link.kind, link.level > links.level, link.x * T, link.y * T);
    // A map made by hand has no way-out prop: where the party came in is marked as the way out.
    if (cells.drawnProps) {
      const { x, y } = cells.entrance;
      ctx.strokeStyle = PLAIN.prop;
      ctx.lineWidth = 2;
      ctx.strokeRect(x * T + 3, y * T + 3, T - 6, T - 6);
    }
    return canvas;
  }, [cells, drawTile, links, resolution, kept?.roomInfo, kept?.gallery]);
  const mapSize = cells ? { width: cells.width * T, height: cells.height * T } : { width: 0, height: 0 };

  // ── The party, and the view ──
  const partyRef = useRef<Point | null>(null);
  const facingRef = useRef<CharacterFacing>("down");
  if (!walkingRef.current) partyRef.current = kept ? centreOf(kept.at) : null;
  const camera = useCallback(
    (at: Point) => overworldCamera(at, mapSize, size, scale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapSize.width, mapSize.height, scale, size],
  );
  const resting = camera(partyRef.current ?? { x: mapSize.width / 2, y: mapSize.height / 2 });

  const standing = useMemo(
    () =>
      kept && hour !== undefined
        ? gameDungeonSpotsAt(kept, hour).flatMap((spot) =>
            spot.people[0] ? [{ at: { x: spot.x, y: spot.y }, person: spot.people[0] }] : [],
          )
        : [],
    [hour, kept],
  );
  // A planned building: rooms the party has not been into stay dark, and the traps it has found show.
  const fogged = useMemo(() => {
    if (!kept?.site) return [];
    const seen = new Set(kept.site.seen[String(kept.site.level)] ?? []);
    return kept.rooms.filter((_, index) => !seen.has(index));
  }, [kept]);
  const foundTraps = useMemo(() => (kept?.traps ?? []).filter((trap) => trap.found), [kept]);
  const draw = useCallback(
    (cam: Point, frame = 1) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || size.width === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const [width, height] = [Math.round(size.width * dpr), Math.round(size.height * dpr)];
      if (canvas.width !== width || canvas.height !== height) [canvas.width, canvas.height] = [width, height];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, width, height);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, -cam.x * dpr, -cam.y * dpr);
      ctx.imageSmoothingEnabled = drawTile.image && resolution > scale * dpr;
      ctx.drawImage(base, 0, 0, base.width / resolution, base.height / resolution);
      ctx.imageSmoothingEnabled = false;
      for (const trap of foundTraps) paintFoundTrap(ctx, trap.x * T, trap.y * T);
      const inFog = (x: number, y: number) => fogged.some((room) => dungeonRoomHas(room, x, y));
      // On a map made by hand, someone at each spot in use at the hour (map editor Phase 3).
      for (const { at, person } of standing) {
        if (drawTile.character(ctx, { person: person.id }, at.x * T, at.y * T)) continue;
        const pick = ([...person.id].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7) % 100) / 100;
        if (!drawTile(ctx, "folk", at.x * T, at.y * T - 4, pick)) paintParty(ctx, at.x * T + 1, at.y * T - 3, false);
      }
      // The holders' posts (dungeon spawns): who stands guard where, the heart's chief crowned.
      // A post of more than one shows a second figure a step behind the first.
      // The rooms of the way round are unlit, the held room's torch the light on the main way, so the bypass
      // reads as the dark way past (panel round 32: a sneak route through lit rooms reads as a decal).
      cells?.rooms.forEach((room, n) => {
        if (!kept?.roomInfo?.[n]?.quiet || inFog(room.x, room.y)) return;
        ctx.fillStyle = "rgba(6, 8, 16, 0.3)";
        for (const box of [room, ...(room.parts ?? [])]) ctx.fillRect(box.x * T, box.y * T, box.w * T, box.h * T);
      });
      // The way round the held room: a scuffed trail of pale footprints through the rooms left to nobody,
      // so the party can see there is a way past (panel round 30: the quiet way not visible on the map).
      for (const [k, { x, y }] of (kept?.quietWay ?? []).entries()) {
        if (inFog(x, y) || k % 3 === 2) continue;
        const cx = x * T + T / 2;
        const cy = y * T + T / 2;
        for (const [dx, dy] of [
          [-5, k % 2 ? -3 : 1],
          [2, k % 2 ? 1 : -3],
        ] as const) {
          // Faint, a scuff rather than a line (panel round 32: drawn bold it read as a debug overlay that
          // spoiled the route and hid the furniture).
          ctx.fillStyle = "rgba(20, 16, 12, 0.3)";
          ctx.fillRect(cx + dx - 1, cy + dy - 1, 4, 5);
          ctx.fillStyle = "rgba(236, 226, 196, 0.6)";
          ctx.fillRect(cx + dx, cy + dy, 2, 3);
        }
      }
      // What the holders can see, while the party sneaks (owner 2026-11-18, "Add verticality and sightlines";
      // hidden otherwise): a fan from each guard along its facing, fading with distance, cut off where walls
      // block it (panel round 35: per-cell washes read as a debug flood fill). Under a gallery's rail is a
      // blind strip its watchers cannot see down into. A chevron at a guard's feet shows which way it looks.
      if (sneaking && cells) {
        const railAt = (x: number, y: number) =>
          x >= 0 && y >= 0 && x < cells.width && y < cells.height && cells.props[y * cells.width + x] === 44;
        for (const guard of guards) {
          if (!guard.face || inFog(guard.x, guard.y)) continue;
          const range = guard.raised ? 10 : 6;
          const seen = dungeonSightCells(cells, guard, guard.face, range).filter(
            ({ x, y }) =>
              !inFog(x, y) &&
              !(
                guard.raised &&
                [
                  [1, 0],
                  [-1, 0],
                  [0, 1],
                  [0, -1],
                ].some(([dx, dy]) => railAt(x + dx!, y + dy!))
              ),
          );
          if (!seen.length) continue;
          const [gx, gy] = [(guard.x + 0.5) * T, (guard.y + 0.5) * T];
          const angle = Math.atan2(guard.face.y, guard.face.x);
          const spread = 0.88;
          const reach = (range + 0.5) * T;
          ctx.save();
          ctx.beginPath();
          for (const { x, y } of seen) ctx.rect(x * T, y * T, T, T);
          ctx.clip();
          const fan = () => {
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.arc(gx, gy, reach, angle - spread, angle + spread);
            ctx.closePath();
          };
          const light = ctx.createRadialGradient(gx, gy, T * 0.5, gx, gy, reach);
          light.addColorStop(0, "rgba(255, 150, 70, 0.26)");
          light.addColorStop(1, "rgba(255, 150, 70, 0.03)");
          ctx.fillStyle = light;
          fan();
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 196, 110, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          fan();
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          // Which way it looks: a small chevron just in front of the guard.
          const [cx, cy] = [gx + Math.cos(angle) * T * 0.75, gy + Math.sin(angle) * T * 0.75];
          const tip = (r: number, a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
          ctx.beginPath();
          ctx.moveTo(...tip(4, angle));
          ctx.lineTo(...tip(4, angle + 2.4));
          ctx.lineTo(...tip(1.5, angle + Math.PI));
          ctx.lineTo(...tip(4, angle - 2.4));
          ctx.closePath();
          ctx.fillStyle = "#ffcf7a";
          ctx.strokeStyle = "rgba(20, 10, 4, 0.85)";
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
        }
      }
      // A patrol's beat: a line of footfalls along the walk it keeps, a bar at each end where it turns,
      // outlined so it reads on stone and rugs alike (panel round 26: too faint).
      for (const guard of guards) {
        if (!guard.beat || inFog(guard.x, guard.y)) continue;
        const dot = (x: number, y: number, w: number, h: number) => {
          ctx.fillStyle = "rgba(16, 10, 12, 0.7)";
          ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
          ctx.fillStyle = "#e8503e";
          ctx.fillRect(x, y, w, h);
        };
        for (const [k, { x, y }] of guard.beat.entries()) {
          const cx = x * T + T / 2;
          const cy = y * T + T / 2;
          if (k === 0 || k === guard.beat.length - 1) dot(cx - 4, cy - 1, 8, 3);
          else {
            dot(cx - 5, cy + (k % 2 ? -3 : 1), 3, 3);
            dot(cx + 2, cy + (k % 2 ? 1 : -3), 3, 3);
          }
        }
      }
      // The held post on the main way keeps a light burning beside it: a standing torch and its pool.
      for (const guard of guards) {
        if (!guard.post || inFog(guard.x, guard.y)) continue;
        const [lx, ly] = [guard.x * T + T + 2, guard.y * T + 2];
        const glow = ctx.createRadialGradient(lx, ly, T * 0.2, lx, ly, T * 2.5);
        glow.addColorStop(0, "rgba(255, 186, 92, 0.35)");
        glow.addColorStop(1, "rgba(255, 186, 92, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(lx - T * 2.5, ly - T * 2.5, T * 5, T * 5);
        ctx.fillStyle = "#2a1d14";
        ctx.fillRect(lx - 1, ly - 2, 2, 12);
        ctx.fillStyle = "#ffb347";
        ctx.fillRect(lx - 2, ly - 6, 4, 4);
        ctx.fillStyle = "#fff1b0";
        ctx.fillRect(lx - 1, ly - 5, 2, 2);
      }
      for (const guard of guards) {
        if (inFog(guard.x, guard.y)) continue;
        if (guard.count > 2) paintGuard(ctx, guard.x * T - 1, guard.y * T - 8, false);
        if (guard.count > 1) paintGuard(ctx, guard.x * T + 7, guard.y * T - 5, false);
        paintGuard(ctx, guard.x * T + (guard.count > 1 ? -3 : 1), guard.y * T - 3, guard.heart);
        // Asleep, off watch (owner 2026-11-18, "Authored guard set-ups"): a drift of z's over them.
        if (guard.asleep)
          for (const [k, [zx, zy, zs]] of (
            [
              [T - 4, -10, 5],
              [T + 2, -16, 4],
              [T + 7, -21, 3],
            ] as const
          ).entries()) {
            const [ox, oy] = [guard.x * T + zx, guard.y * T + zy];
            ctx.fillStyle = "rgba(10, 12, 24, 0.85)";
            ctx.fillRect(ox - 1, oy - 1, zs + 2, zs + 2);
            ctx.fillStyle = k === 0 ? "#cfe0ff" : "#a8c0f0";
            ctx.fillRect(ox, oy, zs, 1);
            ctx.fillRect(ox, oy + zs - 1, zs, 1);
            for (let d = 1; d < zs - 1; d++) ctx.fillRect(ox + zs - 1 - d, oy + d, 1, 1);
          }
        // The guards who carry a locked room's key: a gold key over them (panel round 31: who holds it).
        if (guard.key) {
          const [kx, ky] = [guard.x * T + T - 6, guard.y * T - 10];
          ctx.fillStyle = "rgba(16, 10, 6, 0.8)";
          ctx.fillRect(kx - 1, ky - 1, 6, 6);
          ctx.fillRect(kx + 1, ky + 3, 3, 8);
          ctx.fillStyle = "#f2c14e";
          ctx.fillRect(kx, ky, 4, 4);
          ctx.fillStyle = "rgba(16, 10, 6, 0.8)";
          ctx.fillRect(kx + 1, ky + 1, 2, 2);
          ctx.fillStyle = "#f2c14e";
          ctx.fillRect(kx + 2, ky + 4, 1, 6);
          ctx.fillRect(kx + 3, ky + 7, 1, 1);
          ctx.fillRect(kx + 3, ky + 9, 1, 1);
        }
      }
      ctx.fillStyle = "rgba(5, 6, 10, 0.88)";
      for (const room of fogged)
        for (const r of [room, ...(room.parts ?? [])]) ctx.fillRect(r.x * T, r.y * T, r.w * T, r.h * T);
      const party = partyRef.current;
      if (party) {
        const drawn = drawTile.character(
          ctx,
          "party",
          Math.round(party.x) - 8,
          Math.round(party.y) - 8,
          facingRef.current,
          frame,
        );
        const [x, y] = [Math.round(party.x) - 8, Math.round(party.y) - 14];
        if (!drawn && !drawTile(ctx, "party", x, y)) paintParty(ctx, x + 1, y + 1, frame !== 1);
      }
    },
    [base, drawTile, fogged, foundTraps, guards, resolution, scale, size.height, size.width, standing, sneaking],
  );
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  const hasMap = Boolean(kept);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMap]);
  useEffect(() => {
    if (!walkingRef.current) draw(resting);
  }, [draw, resting.x, resting.y]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Walking ──
  const frameRef = useRef<number | null>(null);
  const endWalkRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      endWalkRef.current?.();
    };
  }, []);
  const walkTo = useCallback(
    async (to: Point) => {
      if (!kept || !cells || !canWalk || walkingRef.current) return;
      if (to.x === kept.at.x && to.y === kept.at.y) return;
      if (!dungeonWalkable(cells, to.x, to.y)) return;
      walkingRef.current = true;
      let result;
      try {
        result = await walkMutation.mutateAsync({ chatId, map: kept.id, x: to.x, y: to.y });
      } catch (error) {
        walkingRef.current = false;
        toast.error(error instanceof Error && error.message ? error.message : t("game.dungeon.walkFailed"));
        return;
      }
      if (!mountedRef.current) {
        walkingRef.current = false;
        return;
      }
      // A planned building's news from the walk: a lock opened by its key, a hidden trap set off.
      if (result.step?.unlocked.length)
        toast.success(t("game.dungeon.unlocked", { rooms: result.step.unlocked.join(", ") }));
      if (result.step?.trap) toast.warning(t("game.dungeon.trapSprung"));
      const points = [centreOf(kept.at), ...result.path.map(centreOf)];
      const duration = Math.min(WALK_LONGEST_MS, Math.max(300, result.path.length * WALK_MS_PER_CELL));
      setWalking(true);
      const started = performance.now();
      // The walk ends on its last frame, or by the clock when frames stall (a hidden tab, a draw that throws).
      let ended = false;
      const end = () => {
        if (ended) return;
        ended = true;
        endWalkRef.current = null;
        clearTimeout(fallback);
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        walkingRef.current = false;
        partyRef.current = centreOf(result.map.at);
        setWalking(false);
        const snapshot = useGameStateStore.getState().current;
        if (snapshot?.chatId === chatId)
          useGameStateStore.getState().setGameState({ ...snapshot, time: result.formatted });
        // Walked in on foes: they have the party, and the fight starts where it stands.
        if (result.step?.met && mountedRef.current) {
          toast.warning(t("game.dungeon.caught", { room: result.step.met.name }));
          onCaught?.();
        }
      };
      const fallback = setTimeout(end, duration + 500);
      endWalkRef.current = end;
      const frame = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        try {
          const along = progress * (points.length - 1);
          const index = Math.max(0, Math.min(points.length - 2, Math.floor(along)));
          const [a, b] = [points[index]!, points[index + 1] ?? points[index]!];
          const part = along - index;
          partyRef.current = { x: a.x + (b.x - a.x) * part, y: a.y + (b.y - a.y) * part };
          facingRef.current = characterFacing(b.x - a.x, b.y - a.y, facingRef.current);
          drawRef.current(cameraRef.current(partyRef.current), characterFrameAt(now));
        } catch {
          end();
          return;
        }
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(frame);
          return;
        }
        end();
      };
      frameRef.current = requestAnimationFrame(frame);
    },
    [canWalk, cells, chatId, kept, onCaught, t, walkMutation],
  );

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cells) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // The camera is in screen pixels of the scaled map, as the town's is.
    const x = Math.floor((event.clientX - rect.left + resting.x) / scale / T);
    const y = Math.floor((event.clientY - rect.top + resting.y) / scale / T);
    void walkTo({ x, y });
  };

  if (!kept || !cells || !set) {
    return <div className="absolute inset-0 z-0 bg-black" role="region" aria-label={t("game.dungeon.region")} />;
  }
  const onWayOut = gameDungeonOnWayOut(kept);
  // A place deeper than one floor (owner 2026-11-13: separate maps per floor): its stairs down and up.
  const floor = kept.floor ?? 1;
  // A planned building: the stairs, ladder or hole the party stands on, to which level.
  const link = gameDungeonLinkAt(kept);
  const site = kept.site;
  const linkTo = link && site ? site.levels[link.level] : undefined;
  const stairs = kept.floors
    ? gameDungeonOnWayDown(kept)
      ? floor + 1
      : gameDungeonOnWayUp(kept)
        ? floor - 1
        : null
    : null;
  const takeStairs = async () => {
    try {
      await stairsMutation.mutateAsync({ chatId, map: kept.id });
    } catch (error) {
      toast.error(error instanceof Error && error.message ? error.message : t("game.dungeon.stairsFailed"));
    }
  };
  const area = dungeonAreaAt(kept, kept.at.x, kept.at.y);
  const roomName = area ? kept.roomInfo?.[area - 1]?.name : undefined;
  // The levels the party has been on, top to bottom, the one it is on marked.
  const visited = site
    ? site.levels.flatMap((level, index) =>
        index === site.level || site.seen[String(index)] !== undefined ? [{ index, name: level.name }] : [],
      )
    : [];
  const leave = async () => {
    try {
      await leaveMutation.mutateAsync({ chatId, map: kept.id });
      onLeft();
    } catch (error) {
      toast.error(error instanceof Error && error.message ? error.message : t("game.dungeon.leaveFailed"));
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[event.key];
    if (!step) return;
    event.preventDefault();
    void walkTo({ x: kept.at.x + step[0]!, y: kept.at.y + step[1]! });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-clip bg-black"
        role="region"
        aria-label={t("game.dungeon.region")}
        data-component="DungeonMapView"
        data-tiles={drawTile.loading ? "loading" : drawTile.image ? "image" : "plain"}
        data-walking={walking ? "true" : "false"}
        data-can-walk={canWalk ? "true" : "false"}
        data-scale={scale}
        data-camera={`${Math.round(resting.x)},${Math.round(resting.y)}`}
      >
        <canvas
          ref={canvasRef}
          onClick={onCanvasClick}
          onKeyDown={onKeyDown}
          tabIndex={0}
          className="absolute inset-0 h-full w-full cursor-pointer [image-rendering:pixelated] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          aria-label={t("game.dungeon.canvas", { name: kept.name })}
        />
      </div>
      {/* Above the narration, as the town's chrome is, so the way out is never under it. */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-[25] flex flex-col items-center gap-2 px-3">
        <p className="rounded-lg bg-black/60 px-3 py-1 text-xs text-white/85" role="status">
          {kept.name}
          {kept.floors && kept.floors > 1 && <> · {t("game.dungeon.floor", { floor, floors: kept.floors })}</>}
          {site && <> · {site.levels[site.level]?.name}</>}
          {/* A map made by hand has no areas: its name alone. A planned building names its rooms. */}
          {kept.rooms.length > 0 && (
            <>
              {" · "}
              {roomName
                ? roomName
                : area
                  ? t("game.dungeon.area", { area })
                  : t(kept.roomInfo ? "game.dungeon.hall" : "game.dungeon.passage")}
            </>
          )}
          {walking && <Footprints size={12} className="ml-2 inline animate-pulse" aria-hidden="true" />}
        </p>
        {visited.length > 1 && (
          <ol
            className="flex flex-wrap justify-center gap-1 text-[10px] text-white/70"
            aria-label={t("game.dungeon.levels")}
          >
            {visited.map((level) => (
              <li
                key={level.index}
                aria-current={level.index === site!.level ? "location" : undefined}
                className={
                  level.index === site!.level
                    ? "rounded bg-white/20 px-1.5 py-0.5 font-semibold text-white"
                    : "rounded bg-black/50 px-1.5 py-0.5"
                }
              >
                {level.name}
              </li>
            ))}
          </ol>
        )}
        {link && linkTo && (
          <button
            type="button"
            onClick={() => void takeStairs()}
            disabled={!canWalk || walking || stairsMutation.isPending}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85 disabled:opacity-50"
          >
            {link.level > site!.level ? (
              <ArrowDownToLine size={13} aria-hidden="true" />
            ) : (
              <ArrowUpToLine size={13} aria-hidden="true" />
            )}
            {t(link.level > site!.level ? "game.dungeon.goDown" : "game.dungeon.goUp", { level: linkTo.name })}
          </button>
        )}
        {kept.site && guards.length > 0 && (
          <button
            type="button"
            onClick={toggleSneak}
            aria-pressed={sneaking}
            className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 ${
              sneaking
                ? "border-amber-300/70 bg-amber-900/80 hover:bg-amber-900"
                : "border-white/20 bg-black/70 hover:bg-black/85"
            }`}
          >
            <Footprints size={13} aria-hidden="true" />
            {t(sneaking ? "game.dungeon.sneaking" : "game.dungeon.sneak")}
          </button>
        )}
        {onWayOut && (
          <button
            type="button"
            onClick={() => void leave()}
            disabled={!canWalk || walking || leaveMutation.isPending}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85 disabled:opacity-50"
          >
            <DoorOpen size={13} aria-hidden="true" />
            {t("game.dungeon.leave", { way: t(`game.dungeon.wayOut.${dungeonWayOutId(set)}`) })}
          </button>
        )}
        {stairs !== null && (
          <button
            type="button"
            onClick={() => void takeStairs()}
            disabled={!canWalk || walking || stairsMutation.isPending}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85 disabled:opacity-50"
          >
            {stairs > floor ? (
              <ArrowDownToLine size={13} aria-hidden="true" />
            ) : (
              <ArrowUpToLine size={13} aria-hidden="true" />
            )}
            {t(stairs > floor ? "game.dungeon.down" : "game.dungeon.up", { floor: stairs })}
          </button>
        )}
      </div>
    </>
  );
}
