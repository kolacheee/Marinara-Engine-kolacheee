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
  dungeonLairAnchorCell,
  dungeonRoomCells,
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
      // A planned building's lair floor is dug, not built (lair panel 5, all five: the lair floors read as
      // masonry, not cut from rock): beaten earth and broken rock over the flags everywhere but the great
      // chamber, which keeps its laid floor as the creature's hall; the solid round it the dark of the deep
      // rock. Under the furniture and figures, over the tiles.
      if (kept?.lairKind && kept.lairFeature?.length && kept.roomInfo) {
        const hash = (a: number, b: number) => ((a * 73856093) ^ (b * 19349663)) >>> 0;
        const heartAt = kept.roomInfo.findIndex((info) => info?.heart);
        const hall = heartAt >= 0 ? cells.rooms[heartAt] : undefined;
        const inHall = (x: number, y: number) =>
          !!hall && [hall, ...(hall.parts ?? [])].some((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
        for (let y = 0; y < cells.height; y++)
          for (let x = 0; x < cells.width; x++) {
            const g = cells.ground[y * cells.width + x];
            const [ox, oy] = [x * T, y * T];
            if (g === "rock") {
              ctx.fillStyle = "rgba(26, 22, 18, 0.88)";
              ctx.fillRect(ox, oy, T, T);
              const h = hash(x * 3 + 1, y * 7 + 2);
              if (h % 3 === 0) {
                ctx.fillStyle = "rgba(70, 62, 52, 0.5)";
                ctx.fillRect(ox + (h % 12), oy + ((h >> 4) % 12), 3, 2);
              }
              continue;
            }
            if (g !== "floor" || inHall(x, y)) continue;
            ctx.fillStyle = "rgba(58, 46, 34, 0.6)";
            ctx.fillRect(ox, oy, T, T);
            for (let n = 0; n < 3; n++) {
              const h = hash(x * 9 + n * 5, y * 11 - n);
              ctx.fillStyle = n === 0 ? "rgba(120, 106, 86, 0.45)" : "rgba(24, 18, 12, 0.35)";
              ctx.fillRect(ox + (h % 13), oy + ((h >> 5) % 13), 2 + (n === 0 ? 1 : 0), 2);
            }
          }
      }
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
              ctx.fillStyle = "rgba(236, 224, 190, 0.55)";
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
                ctx.fillRect(px, py, 2, 2);
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
    // A doorway through a wall running down the map (floor either side, wall above and below) has no arch
    // in the pack: drawn here as a stone frame with a heavy door standing open against it (panel round 50:
    // chambers that open onto their galleries with no door read as gaps, nothing to hold).
    for (let y = 1; y < cells.height - 1; y++)
      for (let x = 1; x < cells.width - 1; x++) {
        if (groundAt(x, y) !== "floor" || groundAt(x, y - 1) !== "wall" || groundAt(x, y + 1) !== "wall") continue;
        if (!open(groundAt(x - 1, y)) || !open(groundAt(x + 1, y))) continue;
        // Only a doorway one cell deep, not a passage running between two walls.
        if (groundAt(x - 1, y - 1) === "wall" && groundAt(x - 1, y + 1) === "wall") continue;
        if (groundAt(x + 1, y - 1) === "wall" && groundAt(x + 1, y + 1) === "wall") continue;
        if (cells.props[y * cells.width + x] !== -1) continue;
        const [ox, oy] = [x * T, y * T];
        // The jambs: dressed stone at the cell's top and bottom.
        ctx.fillStyle = "#5d574f";
        ctx.fillRect(ox + 2, oy, T - 4, 3);
        ctx.fillRect(ox + 2, oy + T - 3, T - 4, 3);
        ctx.fillStyle = "#8a8277";
        ctx.fillRect(ox + 2, oy, T - 4, 1);
        ctx.fillRect(ox + 2, oy + T - 3, T - 4, 1);
        // The door, open back against the frame: oak boards edge-on with iron straps.
        ctx.fillStyle = "rgba(10, 6, 4, 0.6)";
        ctx.fillRect(ox + 2, oy + 3, 4, T - 6);
        ctx.fillStyle = "#6b4426";
        ctx.fillRect(ox + 2, oy + 3, 3, T - 6);
        ctx.fillStyle = "#3a3632";
        ctx.fillRect(ox + 2, oy + 5, 3, 1);
        ctx.fillRect(ox + 2, oy + T - 6, 3, 1);
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
  // A floor that is a small part of its map (a tower top over a castle's whole footprint) is framed on what is
  // built, three cells round it, the rest left dark, not a few rooms adrift in a field of grass (panel rounds
  // 40-43: the tower top "a dead stub" in a corner of the canvas).
  const framed = useMemo(() => {
    const whole = { x: 0, y: 0, ...mapSize };
    if (!cells || !kept?.site) return whole;
    let [x0, y0, x1, y1] = [cells.width, cells.height, -1, -1];
    for (let y = 0; y < cells.height; y++)
      for (let x = 0; x < cells.width; x++)
        if (cells.ground[y * cells.width + x] !== "rock")
          [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
    if (x1 < 0 || (x1 - x0 + 1) * (y1 - y0 + 1) > cells.width * cells.height * 0.4) return whole;
    const [fx0, fy0] = [Math.max(0, x0 - 3), Math.max(0, y0 - 3)];
    const [fx1, fy1] = [Math.min(cells.width, x1 + 4), Math.min(cells.height, y1 + 4)];
    return { x: fx0 * T, y: fy0 * T, width: (fx1 - fx0) * T, height: (fy1 - fy0) * T };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, kept?.site, mapSize.width, mapSize.height]);

  // ── The party, and the view ──
  const partyRef = useRef<Point | null>(null);
  const facingRef = useRef<CharacterFacing>("down");
  if (!walkingRef.current) partyRef.current = kept ? centreOf(kept.at) : null;
  const camera = useCallback(
    (at: Point) => {
      const cam = overworldCamera({ x: at.x - framed.x, y: at.y - framed.y }, framed, size, scale);
      return { x: cam.x + framed.x * scale, y: cam.y + framed.y * scale };
    },
    [framed, scale, size],
  );
  const resting = camera(partyRef.current ?? { x: framed.x + framed.width / 2, y: framed.y + framed.height / 2 });

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
      if (framed.width === mapSize.width && framed.height === mapSize.height)
        ctx.drawImage(base, 0, 0, base.width / resolution, base.height / resolution);
      else
        ctx.drawImage(
          base,
          framed.x * resolution,
          framed.y * resolution,
          framed.width * resolution,
          framed.height * resolution,
          framed.x,
          framed.y,
          framed.width,
          framed.height,
        );
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
      // The way round the held room: one thin dashed pale-blue path through the rooms left to nobody, so the
      // party can see there is a way past (panel round 30: not visible; round 32: bold footprints read as a
      // debug overlay; rounds 39-41: scattered scuffs read as stray dots, asked for one continuous path).
      {
        // The second, longer way round (panel round 44) is dotted, the first dashed.
        const lines = (way: Array<{ x: number; y: number }>) => {
          const runs: Array<Array<{ x: number; y: number }>> = [];
          let run: Array<{ x: number; y: number }> = [];
          for (const step of way) {
            const last = run[run.length - 1];
            if (inFog(step.x, step.y) || (last && Math.abs(last.x - step.x) + Math.abs(last.y - step.y) !== 1)) {
              if (run.length > 1) runs.push(run);
              run = inFog(step.x, step.y) ? [] : [step];
              continue;
            }
            run.push(step);
          }
          if (run.length > 1) runs.push(run);
          return runs;
        };
        // Only where it leaves the main way, fading out: a hint to scout, not the answer drawn whole (panel
        // round 47: the whole line read as a solved route and a debug trace).
        const HINT = 6;
        const ways = [
          { runs: lines(kept?.quietWay ?? []).slice(0, 1), dash: [5, 5] },
          { runs: lines(kept?.quietWayLong ?? []).slice(0, 1), dash: [1, 4] },
        ];
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (const { runs, dash: own } of ways)
          for (const [width, colour, dash] of [
            [4, "rgba(8, 10, 18, 0.35)", [] as number[]],
            [2, "rgba(170, 214, 255, 0.8)", own],
          ] as const) {
            ctx.lineWidth = width;
            ctx.strokeStyle = colour;
            ctx.setLineDash(dash);
            for (const line of runs) {
              const hint = line.slice(0, HINT + 1);
              hint.slice(1).forEach(({ x, y }, k) => {
                ctx.globalAlpha = 1 - k / HINT;
                ctx.beginPath();
                ctx.moveTo(hint[k]!.x * T + T / 2, hint[k]!.y * T + T / 2);
                ctx.lineTo(x * T + T / 2, y * T + T / 2);
                ctx.stroke();
              });
              ctx.globalAlpha = 1;
            }
          }
        ctx.restore();
      }
      // What the holders can see, while the party sneaks (owner 2026-11-18, "Add verticality and sightlines";
      // hidden otherwise): a fan from each guard along its facing, fading with distance, cut off where walls
      // block it (panel round 35: per-cell washes read as a debug flood fill). Under a gallery's rail is a
      // blind strip its watchers cannot see down into. A chevron at a guard's feet shows which way it looks.
      if (sneaking && cells) {
        const railAt = (x: number, y: number) =>
          x >= 0 && y >= 0 && x < cells.width && y < cells.height && cells.props[y * cells.width + x] === 44;
        // The blind strip under a gallery's rail, hatched, where its watchers cannot see down (panel round 37:
        // not marked).
        const raisedSet = new Set((kept?.gallery ?? []).map(({ x, y }) => y * cells.width + x));
        if (raisedSet.size)
          for (let i = 0; i < cells.props.length; i++) {
            if (cells.props[i] !== 44) continue;
            const [rx, ry] = [i % cells.width, Math.floor(i / cells.width)];
            for (const [dx, dy] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ] as const) {
              const [nx, ny] = [rx + dx, ry + dy];
              const n = ny * cells.width + nx;
              if (nx < 0 || ny < 0 || nx >= cells.width || ny >= cells.height || inFog(nx, ny)) continue;
              if (cells.ground[n] !== "floor" || raisedSet.has(n) || cells.props[n] === 44) continue;
              // Only straight down off the rail, not past its ends or over the steps (panel round 45).
              const [bx, by] = [rx - dx, ry - dy];
              if (bx < 0 || by < 0 || bx >= cells.width || by >= cells.height) continue;
              if (!raisedSet.has(by * cells.width + bx)) continue;
              // Not the foot of the steps at the rail's ends (panel round 47).
              if (
                [
                  [1, 0],
                  [-1, 0],
                  [0, 1],
                  [0, -1],
                ].some(([ex, ey]) => raisedSet.has((ny + ey!) * cells.width + nx + ex!))
              )
                continue;
              ctx.save();
              ctx.beginPath();
              ctx.rect(nx * T, ny * T, T, T);
              ctx.clip();
              ctx.fillStyle = "rgba(10, 14, 30, 0.35)";
              ctx.fillRect(nx * T, ny * T, T, T);
              ctx.strokeStyle = "rgba(170, 214, 255, 0.55)";
              ctx.lineWidth = 1;
              for (let k = -T; k < T; k += 4) {
                ctx.beginPath();
                ctx.moveTo(nx * T + k, ny * T + T);
                ctx.lineTo(nx * T + k + T, ny * T);
                ctx.stroke();
              }
              ctx.restore();
            }
          }
        for (const guard of guards) {
          if (!guard.face || inFog(guard.x, guard.y)) continue;
          const range = guard.raised ? 10 : 6;
          // Columns and piers stand in the way of sight as walls do (panel round 37).
          const pillar = buildingStyleOf(cells.set) ? 16 : 7;
          const blocks = (x: number, y: number) =>
            (x !== guard.x || y !== guard.y) && cells.props[y * cells.width + x] === pillar;
          const seen = dungeonSightCells(cells, guard, guard.face, range, blocks).filter(
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
          // A gallery's watcher in violet, to tell the long look from above apart (panel round 45: a pale gold
          // fan was lost on marble).
          const tint = guard.raised ? "196, 150, 255" : "255, 150, 70";
          light.addColorStop(0, `rgba(${tint}, 0.26)`);
          light.addColorStop(1, `rgba(${tint}, 0.03)`);
          ctx.fillStyle = light;
          fan();
          ctx.fill();
          ctx.strokeStyle = guard.raised ? "rgba(214, 186, 255, 0.95)" : "rgba(255, 196, 110, 0.75)";
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
      // Loose boards (rubble below ground) on the way round, which give a sneaking party away (owner 2026-11-18):
      // sprung planks askew, or a scatter of loose stones.
      // A floor's own light by what it is built round (panel round 52: each variant a place of its own): cold
      // green-blue water, sick yellow lime, bone-white, dust.
      const tints: Record<string, string> = {
        flooded: "rgba(40, 110, 140, 0.16)",
        plague: "rgba(150, 160, 40, 0.14)",
        bones: "rgba(220, 210, 190, 0.10)",
        fallen: "rgba(120, 90, 50, 0.14)",
        robbed: "rgba(150, 80, 30, 0.08)",
      };
      const tint = kept?.theme ? tints[kept.theme] : undefined;
      if (tint && cells) {
        ctx.fillStyle = tint;
        ctx.fillRect(0, 0, cells.width * T, cells.height * T);
      }
      // Knee-deep water down a flooded floor's galleries, waded through: a dark sheet with ripples.
      for (const [k, { x, y }] of (kept?.wade ?? []).entries()) {
        if (inFog(x, y)) continue;
        const [ox, oy] = [x * T, y * T];
        ctx.fillStyle = "rgba(24, 70, 92, 0.55)";
        ctx.fillRect(ox, oy, T, T);
        ctx.fillStyle = "rgba(150, 210, 230, 0.45)";
        const r = (k * 5 + x * 3 + y * 7) % 4;
        ctx.fillRect(ox + 2 + r, oy + 4 + (r % 2) * 6, 5, 1);
        ctx.fillRect(ox + 8 - r, oy + 10 - (r % 2) * 4, 4, 1);
      }
      // A robbers' tunnel: a rough dug way, its floor darker than the dressed galleries.
      for (const { x, y } of kept?.tunnel ?? []) {
        if (inFog(x, y)) continue;
        ctx.fillStyle = "rgba(30, 22, 14, 0.5)";
        ctx.fillRect(x * T + 1, y * T + 1, T - 2, T - 2);
      }
      // Fallen stone where a crypt's vault came down (owner 2026-11-18: varied big sites): broken blocks
      // heaped over the floor, walked over.
      for (const [k, { x, y }] of (kept?.rubble ?? []).entries()) {
        if (inFog(x, y)) continue;
        const [ox, oy] = [x * T, y * T];
        const turn = (k * 7 + x * 3 + y * 5) % 4;
        const blocks = [
          [1, 2, 6, 5],
          [8, 1, 5, 4],
          [4, 8, 7, 5],
          [11, 7, 4, 4],
          [1, 11, 4, 3],
          [9, 12, 5, 3],
        ] as const;
        for (const [n, [bx, by, bw, bh]] of blocks.entries()) {
          if ((n + turn) % 5 === 4) continue;
          const [dx, dy] = turn % 2 ? [T - bx - bw, by] : [bx, by];
          ctx.fillStyle = "rgba(10, 8, 6, 0.75)";
          ctx.fillRect(ox + dx + 1, oy + dy + 1, bw, bh);
          ctx.fillStyle = (n + turn) % 3 === 0 ? "#9c9384" : (n + turn) % 3 === 1 ? "#857c6e" : "#b0a796";
          ctx.fillRect(ox + dx, oy + dy, bw, bh);
          ctx.fillStyle = "rgba(255, 248, 230, 0.25)";
          ctx.fillRect(ox + dx, oy + dy, bw, 1);
        }
      }
      // A creature's lair (owner 2026-11-18): what its great chamber holds, drawn over the floor as one
      // mass (a heap, a pool, a crust of comb) rather than tile by tile.
      const lairKind = kept?.lairKind;
      const lairCells = kept?.lairFeature ?? [];
      const inLair = new Set(lairCells.map(({ x, y }) => `${x},${y}`));
      const hasF = (x: number, y: number) => inLair.has(`${x},${y}`);
      const hash = (a: number, b: number) => ((a * 73856093) ^ (b * 19349663)) >>> 0;
      // A planned building's lair floor is dug, not built: its walls rough rock over the dressed courses (lair
      // panel 1: ashlar walls round a dragon's cavern read as a cellar).
      if (lairKind && lairCells.length && kept?.roomInfo && cells) {
        for (let y = 0; y < cells.height; y++)
          for (let x = 0; x < cells.width; x++) {
            if (cells.ground[y * cells.width + x] !== "wall" || inFog(x, y)) continue;
            const [ox, oy] = [x * T, y * T];
            const v = hash(x + 11, y + 5);
            ctx.fillStyle = "rgba(46, 40, 34, 0.72)";
            ctx.fillRect(ox, oy, T, T);
            for (let n = 0; n < 4; n++) {
              const h = hash(x * 5 + n, y * 3 - n * 7);
              const [lx, ly, lw, lh] = [h % 9, (h >> 4) % 9, 4 + ((h >> 8) % 5), 3 + ((h >> 11) % 4)];
              ctx.fillStyle = n % 2 ? "rgba(98, 88, 74, 0.55)" : "rgba(70, 62, 52, 0.6)";
              ctx.fillRect(ox + lx, oy + ly, lw, lh);
              ctx.fillStyle = "rgba(150, 138, 118, 0.3)";
              ctx.fillRect(ox + lx, oy + ly, lw, 1);
            }
            if (v % 5 === 0) {
              ctx.fillStyle = "rgba(12, 10, 8, 0.6)";
              ctx.fillRect(ox + (v % 10), oy + 2 + (v % 7), 1, 5);
            }
          }
      }
      // The rooms off a lair's great chamber each tell one thing at a glance: a set piece in a clear 2x2 of
      // floor near the room's middle (lair panel 7 and 8, all five: the side rooms were the same crates and
      // chains everywhere).
      if (lairKind && cells && kept?.roomInfo) {
        const free = (x: number, y: number) =>
          x >= 0 &&
          y >= 0 &&
          x < cells.width &&
          y < cells.height &&
          cells.ground[y * cells.width + x] === "floor" &&
          cells.props[y * cells.width + x] === -1 &&
          !hasF(x, y);
        kept.roomInfo.forEach((info, index) => {
          if (!info || info.heart) return;
          const room = cells.rooms[index];
          if (!room) return;
          const [mx, my] = [room.x + room.w / 2 - 1, room.y + room.h / 2 - 1];
          const spot = dungeonRoomCells(room)
            .filter(
              ({ x, y }) =>
                free(x, y) &&
                free(x + 1, y) &&
                free(x, y + 1) &&
                free(x + 1, y + 1) &&
                dungeonRoomHas(room, x + 1, y + 1),
            )
            .sort(
              (p, q) => Math.hypot(p.x - mx, p.y - my) - Math.hypot(q.x - mx, q.y - my) || p.y - q.y || p.x - q.x,
            )[0];
          if (!spot || inFog(spot.x, spot.y)) return;
          const [ox, oy] = [spot.x * T, spot.y * T];
          const px = (x: number, y: number, w: number, h: number, colour: string) => {
            ctx.fillStyle = colour;
            ctx.fillRect(ox + x, oy + y, w, h);
          };
          const glow = (x: number, y: number, r: number, colour: string) => {
            const g = ctx.createRadialGradient(ox + x, oy + y, 1, ox + x, oy + y, r);
            g.addColorStop(0, colour);
            g.addColorStop(1, colour.replace(/[\d.]+\)$/, "0)"));
            ctx.fillStyle = g;
            ctx.fillRect(ox + x - r, oy + y - r, r * 2, r * 2);
          };
          const bone = (x: number, y: number, w: number) => {
            px(x, y + 1, w, 1, "#d8ccb0");
            px(x - 1, y, 2, 3, "#ece2c8");
            px(x + w - 1, y, 2, 3, "#ece2c8");
          };
          const skull = (x: number, y: number) => {
            px(x, y, 5, 4, "#ece2c8");
            px(x + 1, y + 4, 3, 1, "#d8ccb0");
            px(x + 1, y + 1, 1, 1, "#2a2018");
            px(x + 3, y + 1, 1, 1, "#2a2018");
          };
          const candle = (x: number, y: number) => {
            glow(x + 1, y, 6, "rgba(255, 190, 90, 0.35)");
            px(x, y + 1, 2, 4, "#e8dcc0");
            px(x, y - 1, 2, 2, "#ffcf5a");
          };
          const ring = (r: number, colour: string, width = 1) => {
            ctx.save();
            ctx.strokeStyle = colour;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.arc(ox + T, oy + T, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          };
          const name = info.name.replace(/ \d+$/u, "");
          if (name === "Bone midden" || name === "Gnawing cave") {
            // Picked bones heaped high, a skull on top; the den's gnawing floor dark with old blood.
            if (name === "Gnawing cave") glow(16, 18, 14, "rgba(70, 10, 10, 0.45)");
            ctx.fillStyle = "rgba(10, 8, 6, 0.45)";
            ctx.beginPath();
            ctx.ellipse(ox + 16, oy + 20, 13, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            for (let n = 0; n < 9; n++) {
              const h = hash(spot.x * 5 + n, spot.y * 3 + n * 7);
              bone(4 + (h % 20), 10 + ((h >> 4) % 13), 4 + ((h >> 8) % 4));
            }
            // A ribcage.
            for (let k = 0; k < 4; k++) px(9 + k * 3, 14, 1, 6, "#e2d6ba");
            px(8, 13, 12, 1, "#d0c4a6");
            skull(19, 8);
          } else if (name === "Smoke vent") {
            // A soot-black crack breathing heat, the floor round it scorched.
            glow(16, 16, 16, "rgba(20, 14, 10, 0.6)");
            glow(16, 16, 7, "rgba(255, 110, 30, 0.5)");
            for (const [x, y, w] of [
              [6, 13, 6],
              [11, 15, 7],
              [17, 17, 6],
              [22, 19, 4],
            ] as const) {
              px(x, y, w, 2, "#120a06");
              px(x + 1, y, w - 2, 1, "#ff8a2a");
            }
            px(13, 6, 2, 2, "rgba(120, 110, 100, 0.5)");
            px(17, 3, 3, 3, "rgba(120, 110, 100, 0.35)");
          } else if (name === "Phylactery vault") {
            // On a stone plinth, the jar that holds the lich's soul, glowing sickly green.
            glow(16, 13, 13, "rgba(120, 255, 160, 0.4)");
            px(9, 20, 14, 6, "#4a4652");
            px(9, 20, 14, 1, "#6c6878");
            px(11, 26, 10, 2, "#2c2a32");
            px(13, 9, 6, 11, "#2e6a48");
            px(14, 10, 4, 9, "#7affb0");
            px(13, 7, 6, 2, "#8a7a5a");
            px(15, 12, 1, 4, "#e8fff0");
          } else if (name === "Ward hall" || name === "Summoning circle") {
            // A circle cut into the floor and lit: violet wards, or a summoning ring red with old blood.
            const summon = name === "Summoning circle";
            const colour = summon ? "rgba(220, 40, 40, 0.75)" : "rgba(170, 120, 255, 0.75)";
            glow(16, 16, 15, summon ? "rgba(200, 30, 30, 0.25)" : "rgba(150, 100, 255, 0.22)");
            ring(13, colour, 2);
            ring(9, colour);
            ctx.save();
            ctx.strokeStyle = colour;
            ctx.beginPath();
            for (let k = 0; k <= 5; k++) {
              const a = -Math.PI / 2 + (k * 4 * Math.PI) / 5;
              const [x, y] = [ox + T + Math.cos(a) * 9, oy + T + Math.sin(a) * 9];
              if (k) ctx.lineTo(x, y);
              else ctx.moveTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
            if (summon)
              for (const [x, y] of [
                [2, 14],
                [28, 14],
                [15, 1],
                [15, 27],
              ] as const)
                candle(x, y);
          } else if (name === "Library of the dead") {
            // Torn pages and an open book on the floor by a guttering candle.
            px(8, 14, 16, 9, "#3a2a1a");
            px(9, 15, 6, 7, "#e6dcc0");
            px(17, 15, 6, 7, "#e6dcc0");
            px(15, 14, 2, 9, "#2a1c10");
            for (let k = 0; k < 3; k++) {
              px(10, 16 + k * 2, 4, 1, "#7a6a52");
              px(18, 16 + k * 2, 4, 1, "#7a6a52");
            }
            for (const [x, y] of [
              [3, 6],
              [24, 25],
              [26, 7],
            ] as const)
              px(x, y, 4, 3, "#d4c8aa");
            candle(4, 22);
          } else if (name === "Earth vault") {
            // The vampire's own grave soil, heaped in a box, a spade stood in it.
            px(5, 12, 22, 14, "#3a2416");
            px(6, 11, 20, 12, "#5a3a22");
            px(8, 9, 16, 6, "#6a4a2c");
            px(20, 2, 2, 12, "#7a5a38");
            px(18, 1, 6, 2, "#9a9aa0");
          } else if (name === "Blood larder") {
            // A stone basin brimming dark, drips on the floor round it.
            px(6, 12, 20, 12, "#55505a");
            px(7, 13, 18, 9, "#3a0810");
            px(9, 15, 8, 2, "#8a1020");
            for (const [x, y] of [
              [3, 26],
              [27, 8],
              [24, 27],
              [4, 6],
            ] as const)
              px(x, y, 2, 2, "#6a0a14");
          } else if (name === "Thralls' cell") {
            // A thrall slumped against the wall in chains, still alive.
            px(13, 3, 1, 9, "#5a5a62");
            px(19, 3, 1, 9, "#5a5a62");
            px(11, 12, 10, 12, "#7a6a5a");
            px(13, 8, 6, 5, "#d8c0a8");
            px(12, 11, 3, 2, "#9a9aa0");
            px(18, 11, 3, 2, "#9a9aa0");
            px(9, 24, 14, 3, "rgba(10, 6, 4, 0.5)");
          } else if (name === "Cult cell") {
            // Bedrolls laid in a row, all their heads toward the breach.
            for (let k = 0; k < 3; k++) {
              px(4 + k * 9, 6, 7, 20, "#5a2a22");
              px(4 + k * 9, 6, 7, 5, "#c8b490");
              px(5 + k * 9, 12, 5, 13, "#7a3a2c");
            }
            candle(14, 28);
          } else if (name === "Sacrifice pit") {
            // A dark pit, its lip stained red.
            ctx.fillStyle = "#4a0a0e";
            ctx.beginPath();
            ctx.ellipse(ox + 16, oy + 16, 13, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#050302";
            ctx.beginPath();
            ctx.ellipse(ox + 16, oy + 17, 10, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            skull(20, 4);
          } else if (name === "Sunken shrine") {
            // A drowned idol standing in its own puddle, weed hanging from it.
            glow(16, 22, 13, "rgba(40, 120, 100, 0.4)");
            px(11, 6, 10, 18, "#5a6a62");
            px(12, 7, 8, 5, "#7a8a82");
            px(13, 8, 2, 2, "#1a2420");
            px(17, 8, 2, 2, "#1a2420");
            for (const x of [11, 15, 19]) px(x, 12, 2, 10, "#2a6a3a");
          } else if (name === "Wrack cave" || name === "Drinking pool") {
            // Weed and shells thrown up by the water, or the beast's paw prints down to the pool.
            if (name === "Drinking pool")
              for (let k = 0; k < 5; k++) {
                const [x, y] = [4 + k * 5, 26 - k * 5];
                px(x, y, 3, 3, "rgba(30, 20, 14, 0.7)");
                px(x - 1, y - 2, 1, 1, "rgba(30, 20, 14, 0.7)");
                px(x + 1, y - 2, 1, 1, "rgba(30, 20, 14, 0.7)");
                px(x + 3, y - 1, 1, 1, "rgba(30, 20, 14, 0.7)");
              }
            else {
              for (let n = 0; n < 7; n++) {
                const h = hash(spot.x + n * 11, spot.y - n * 5);
                px(3 + (h % 24), 4 + ((h >> 4) % 22), 6, 2, "#2a5a32");
              }
              for (const [x, y] of [
                [8, 20],
                [20, 9],
                [24, 22],
              ] as const)
                px(x, y, 3, 2, "#e8d8c0");
            }
          } else if (name === "Egg cells" || name === "Comb gallery") {
            // A clutch of pale eggs in a waxy cup, or comb crusting the floor.
            ctx.fillStyle = "#8a5a12";
            ctx.beginPath();
            ctx.ellipse(ox + 16, oy + 18, 12, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            if (name === "Egg cells")
              for (const [x, y] of [
                [10, 13],
                [16, 11],
                [21, 14],
                [13, 18],
                [19, 19],
              ] as const) {
                glow(x + 2, y + 3, 5, "rgba(255, 245, 210, 0.35)");
                px(x, y, 5, 6, "#f0e6c4");
                px(x + 1, y, 2, 2, "#fffbe8");
              }
            else for (let k = 0; k < 6; k++) px(7 + (k % 3) * 6, 13 + Math.floor(k / 3) * 6, 5, 4, "#c8922c");
          } else if (name === "Larder of husks") {
            // Prey wrapped in resin and hung to keep.
            for (const x of [6, 14, 22]) {
              px(x, 3, 1, 4, "#c8922c");
              px(x - 2, 7, 5, 18, "#c9b48a");
              px(x - 1, 8, 3, 15, "#a8946a");
            }
          } else if (name === "Treasure cleft") {
            // Coin spilt out of the cleft's chests across its floor.
            for (let n = 0; n < 14; n++) {
              const h = hash(spot.x * 3 + n, spot.y * 7 + n * 13);
              px(2 + (h % 26), 4 + ((h >> 5) % 24), 3, 2, n % 4 ? "#e0b236" : "#fff3b8");
            }
          }
        });
      }
      // A cave lair's crawl: a squeeze through fallen rock into the great chamber, the boulders heaped either
      // side of a dark one-cell slot and spilled onto the floor beyond (lair panel 6: the crawl was unreadable).
      const crawl = kept?.lairCrawl;
      if (lairKind && crawl && cells && !inFog(crawl.x, crawl.y)) {
        const [ox, oy] = [crawl.x * T, crawl.y * T];
        ctx.fillStyle = "rgba(8, 6, 4, 0.55)";
        ctx.fillRect(ox + 3, oy + 3, T - 6, T - 6);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const [x, y] = [crawl.x + dx, crawl.y + dy];
            if (x < 0 || y < 0 || x >= cells.width || y >= cells.height || inFog(x, y)) continue;
            const ground = cells.ground[y * cells.width + x];
            const centre = dx === 0 && dy === 0;
            for (let n = 0; n < (centre ? 4 : 5); n++) {
              const h = hash(x * 13 + n * 7, y * 11 - n * 3);
              if (!centre && ground === "floor" && h % 3 !== 0) continue;
              const size = 2 + (h % 4);
              const px = x * T + 1 + ((h >> 3) % (T - size - 1));
              const py = y * T + 1 + ((h >> 7) % (T - size - 1));
              // The slot itself kept clear down its middle: rubble only at its edges.
              if (centre && px + size > ox + T * 0.3 && px < ox + T * 0.7) continue;
              ctx.fillStyle = "rgba(10, 8, 6, 0.6)";
              ctx.fillRect(px + 1, py + 1, size, size);
              ctx.fillStyle = h % 2 ? "#8a7d6a" : "#a29580";
              ctx.fillRect(px, py, size, size);
              ctx.fillStyle = "rgba(255, 245, 225, 0.3)";
              ctx.fillRect(px, py, size, 1);
            }
          }
      }
      // The great chamber's own ground: a tint over its whole floor, so it reads as the creature's place from
      // its mouth on, not a corner of the cave (lair panel 3: the hive's bowl was the one that read).
      if (lairKind && lairCells.length && cells) {
        const heartIndex = kept?.lairRoom ?? kept?.roomInfo?.findIndex((info) => info?.heart) ?? -1;
        const chamber = heartIndex >= 0 ? cells.rooms[heartIndex] : undefined;
        const tint: Record<string, string> = {
          hoard: "rgba(150, 90, 20, 0.16)",
          sanctum: "rgba(90, 50, 140, 0.14)",
          haven: "rgba(90, 20, 30, 0.14)",
          den: "rgba(70, 40, 20, 0.2)",
          breach: "rgba(140, 40, 10, 0.18)",
          drowned: "rgba(20, 70, 50, 0.16)",
          hive: "rgba(150, 100, 20, 0.16)",
        };
        if (chamber) {
          // Strongest round the creature's feature and fading out toward the chamber's edge, never a hard
          // square on open floor (lair panel 4 check: a cave's chamber is a box, and its tint read as one).
          const mx = (lairCells.reduce((s, c) => s + c.x, 0) / lairCells.length + 0.5) * T;
          const my = (lairCells.reduce((s, c) => s + c.y, 0) / lairCells.length + 0.5) * T;
          const reach = Math.max(chamber.w, chamber.h) * T * 0.55;
          const colour = tint[lairKind] ?? "rgba(0, 0, 0, 0.1)";
          const glow = ctx.createRadialGradient(mx, my, T, mx, my, reach);
          glow.addColorStop(0, colour);
          glow.addColorStop(0.35, colour);
          glow.addColorStop(1, colour.replace(/[\d.]+\)$/, "0)"));
          ctx.fillStyle = glow;
          for (const { x, y } of dungeonRoomCells(chamber))
            if (
              !inFog(x, y) &&
              cells.ground[y * cells.width + x] !== "wall" &&
              cells.ground[y * cells.width + x] !== "rock"
            )
              ctx.fillRect(x * T, y * T, T, T);
          // A breach's floor scorched round the rift, a dragon's round its heap.
          if (lairKind === "breach" || lairKind === "hoard")
            for (const { x, y } of lairCells.filter((c) => !inFog(c.x, c.y))) {
              const [cx, cy] = [(x + 0.5) * T, (y + 0.5) * T];
              const burn = ctx.createRadialGradient(cx, cy, 2, cx, cy, T * 2.2);
              burn.addColorStop(0, "rgba(20, 8, 4, 0.22)");
              burn.addColorStop(1, "rgba(20, 8, 4, 0)");
              ctx.fillStyle = burn;
              ctx.fillRect(cx - T * 2.3, cy - T * 2.3, T * 4.6, T * 4.6);
            }
        }
      }
      if (lairKind === "drowned" && lairCells.length && cells) {
        // The deep pool as water: murky green-black over each cell, never past a wall, with ripples on its face
        // and a wet lip where it meets the floor (lair panel 6: a soft gradient read as a fog stain and ran
        // over the walls).
        for (const { x, y } of lairCells) {
          const ground = cells.ground[y * cells.width + x];
          if (inFog(x, y) || ground === "wall" || ground === "rock") continue;
          const [ox, oy] = [x * T, y * T];
          ctx.fillStyle = "rgba(8, 38, 30, 0.78)";
          ctx.fillRect(ox, oy, T, T);
          const edges = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
          ] as const;
          const deep = edges.every(([dx, dy]) => hasF(x + dx, y + dy));
          if (deep) {
            ctx.fillStyle = "rgba(2, 16, 12, 0.35)";
            ctx.fillRect(ox, oy, T, T);
          }
          const h = hash(x + 3, y + 9);
          ctx.fillStyle = "rgba(150, 210, 180, 0.35)";
          ctx.fillRect(ox + 2 + (h % 6), oy + 3 + ((h >> 3) % 4), 4 + ((h >> 6) % 3), 1);
          ctx.fillRect(ox + 1 + ((h >> 9) % 7), oy + 9 + ((h >> 12) % 3), 3, 1);
          for (const [dx, dy] of edges) {
            if (hasF(x + dx, y + dy)) continue;
            ctx.fillStyle = "rgba(170, 220, 190, 0.5)";
            if (dy === -1) ctx.fillRect(ox, oy, T, 1);
            else if (dy === 1) ctx.fillRect(ox, oy + T - 1, T, 1);
            else if (dx === -1) ctx.fillRect(ox, oy, 1, T);
            else ctx.fillRect(ox + T - 1, oy, 1, T);
            ctx.fillStyle = "rgba(20, 30, 24, 0.45)";
            if (dy === -1) ctx.fillRect(ox, oy + 1, T, 2);
            else if (dy === 1) ctx.fillRect(ox, oy + T - 3, T, 2);
            else if (dx === -1) ctx.fillRect(ox + 1, oy, 2, T);
            else ctx.fillRect(ox + T - 3, oy, 2, T);
          }
        }
      }
      if (lairKind === "haven" && lairCells.length && cells) {
        // Grave mist pooled over the coffins and drifting out across the hall, pale and low, kept inside the
        // hall's own floor (lair panel 6: it spilled through the wall into the rock).
        const heartIndex = kept?.lairRoom ?? kept?.roomInfo?.findIndex((info) => info?.heart) ?? -1;
        const hall = heartIndex >= 0 ? cells.rooms[heartIndex] : undefined;
        ctx.save();
        if (hall) {
          const clip = new Path2D();
          for (const { x, y } of dungeonRoomCells(hall))
            if (cells.ground[y * cells.width + x] === "floor") clip.rect(x * T, y * T, T, T);
          ctx.clip(clip);
          // The brood's biers: each slab under a blood-red pall with a gold hem and a candle at its head, so
          // a bier reads as a bier and not as one more pier (lair panel 6: cover and coffin looked the same).
          for (const { x, y } of dungeonRoomCells(hall)) {
            if (cells.props[y * cells.width + x] !== 26 || hasF(x, y) || inFog(x, y)) continue;
            const [ox, oy] = [x * T, y * T];
            ctx.fillStyle = "rgba(8, 4, 4, 0.5)";
            ctx.fillRect(ox + 2, oy + 4, T - 3, T - 5);
            ctx.fillStyle = "#6e1420";
            ctx.fillRect(ox + 1, oy + 3, T - 3, T - 6);
            ctx.fillStyle = "#8f2230";
            ctx.fillRect(ox + 2, oy + 3, T - 5, 2);
            ctx.fillStyle = "#c9a24a";
            ctx.fillRect(ox + 1, oy + T - 4, T - 3, 1);
            ctx.fillRect(ox + 1, oy + 3, 1, T - 6);
            ctx.fillRect(ox + T - 3, oy + 3, 1, T - 6);
            // The shape under the pall.
            ctx.fillStyle = "rgba(20, 4, 8, 0.45)";
            ctx.fillRect(ox + 4, oy + 6, T - 9, 3);
            ctx.fillStyle = "#e9d8b0";
            ctx.fillRect(ox + T / 2 - 1, oy + 1, 2, 2);
            ctx.fillStyle = "rgba(255, 210, 120, 0.9)";
            ctx.fillRect(ox + T / 2 - 1, oy, 2, 1);
          }
        }
        for (const [k, { x, y }] of lairCells.entries()) {
          if (inFog(x, y)) continue;
          const [cx, cy] = [(x + 0.5 + ((k % 3) - 1) * 0.6) * T, (y + 0.8) * T];
          const mist = ctx.createRadialGradient(cx, cy, 2, cx, cy, T * 2.6);
          mist.addColorStop(0, "rgba(200, 205, 225, 0.26)");
          mist.addColorStop(1, "rgba(200, 205, 225, 0)");
          ctx.fillStyle = mist;
          ctx.fillRect(cx - T * 2.7, cy - T * 2.7, T * 5.4, T * 5.4);
        }
        ctx.restore();
      }
      if (lairKind === "sanctum" && lairCells.length >= 4) {
        // The circle the ward stones stand on, scored into the floor and faintly lit.
        const mx = lairCells.reduce((n, c) => n + c.x, 0) / lairCells.length;
        const my = lairCells.reduce((n, c) => n + c.y, 0) / lairCells.length;
        const rr = lairCells.reduce((n, c) => n + Math.hypot(c.x - mx, c.y - my), 0) / lairCells.length;
        ctx.save();
        ctx.strokeStyle = "rgba(170, 120, 255, 0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc((mx + 0.5) * T, (my + 0.5) * T, rr * T, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(220, 190, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
      if (lairKind === "breach" && lairCells.length >= 2) {
        // The rift: one jagged fissure down the middle of its cells, black with fire in it, a glow round it,
        // wide in its middle and closing at its ends (lair panel 1: a cell-wide seam; its re-render: joining
        // every cell to its neighbours drew a lattice).
        const xs = lairCells.map((c) => c.x);
        const ys = lairCells.map((c) => c.y);
        const long = Math.max(...xs) - Math.min(...xs) >= Math.max(...ys) - Math.min(...ys);
        const steps = new Map<number, number[]>();
        for (const c of lairCells) {
          const k = long ? c.x : c.y;
          steps.set(k, [...(steps.get(k) ?? []), long ? c.y : c.x]);
        }
        const line = [...steps.entries()]
          .sort((p, q) => p[0] - q[0])
          .map(([k, across], i) => {
            const mid = across.reduce((n, a) => n + a, 0) / across.length + 0.5;
            const jag = ((hash(k, i) % 7) - 3) / 10;
            return long ? ([(k + 0.5) * T, (mid + jag) * T] as const) : ([(mid + jag) * T, (k + 0.5) * T] as const);
          });
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (const [width, style] of [
          [30, "rgba(255, 80, 20, 0.14)"],
          [18, "#2a0e06"],
          [12, "#140604"],
          [5, "#ff5a14"],
          [2, "#ffd27a"],
        ] as const) {
          ctx.strokeStyle = style;
          // Each stretch narrows toward the rift's ends.
          for (let i = 1; i < line.length; i++) {
            const t = Math.min(i, line.length - i) / Math.max(1, line.length / 2);
            ctx.lineWidth = width * (0.45 + 0.55 * Math.min(1, t * 1.6));
            ctx.beginPath();
            ctx.moveTo(...line[i - 1]!);
            ctx.lineTo(...line[i]!);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
      // A heap, a nest or a crust drawn as one rounded mound (lair panel 1 and its re-render: cell squares read
      // as a slab): overlapping discs, a dark rim, the body, then lighter where the mass is deepest. Stray cells
      // at its fringe would stand as lone bumps, so a cell needs `least` neighbours in it to be part of it.
      const shownLair = lairCells.filter(({ x, y }) => !inFog(x, y));
      const depth = (x: number, y: number) =>
        [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
          [1, 1],
          [-1, -1],
          [1, -1],
          [-1, 1],
        ].filter(([dx, dy]) => hasF(x + dx!, y + dy!)).length;
      // Where a mound may lie: open floor round it, never over a wall, a chest or a coffin (lair panel 2: the
      // hoard drew over its keep's chests and north wall).
      const lairArea = new Path2D();
      if (cells && shownLair.length) {
        const [ax0, ax1] = [Math.min(...shownLair.map((c) => c.x)) - 1, Math.max(...shownLair.map((c) => c.x)) + 1];
        const [ay0, ay1] = [Math.min(...shownLair.map((c) => c.y)) - 1, Math.max(...shownLair.map((c) => c.y)) + 1];
        for (let y = Math.max(0, ay0); y <= Math.min(cells.height - 1, ay1); y++)
          for (let x = Math.max(0, ax0); x <= Math.min(cells.width - 1, ax1); x++) {
            const ground = cells.ground[y * cells.width + x];
            if (hasF(x, y) || (ground !== "wall" && ground !== "rock" && cells.props[y * cells.width + x]! < 0))
              lairArea.rect(x * T, y * T, T, T);
          }
      }
      const mound = (least: number, shades: readonly [string, string, string, string, string]): Path2D => {
        const body = shownLair.filter(({ x, y }) => depth(x, y) >= least);
        const disc = (r: number, dx: number, dy: number, only: number, jitter: boolean) => {
          const path = new Path2D();
          for (const { x, y } of body) {
            if (depth(x, y) < only) continue;
            const j = jitter ? (hash(x, y) % 4) / 25 : 0;
            const [cx, cy] = [(x + 0.5) * T + dx, (y + 0.5) * T + dy];
            path.moveTo(cx + (r + j) * T, cy);
            path.arc(cx, cy, (r + j) * T, 0, Math.PI * 2);
          }
          return path;
        };
        ctx.save();
        ctx.clip(lairArea);
        for (const [r, fill, only, dx, dy, jitter] of [
          [0.8, "rgba(8, 5, 2, 0.55)", 0, 1, 3, true],
          [0.76, shades[0], 0, 0, 0, true],
          [0.68, shades[1], 0, 0, 0, true],
          [0.74, shades[2], 5, 0, -1, false],
          [0.7, shades[3], 7, 0, -2, false],
          [0.62, shades[4], 8, -1, -3, false],
        ] as const) {
          ctx.fillStyle = fill;
          ctx.fill(disc(r, dx, dy, only, jitter));
        }
        ctx.restore();
        // The whole mound's outline, for a texture clipped to it.
        return disc(0.68, 0, 0, 0, true);
      };
      if (lairKind === "hoard" && shownLair.length) mound(3, ["#5e3f0c", "#a27418", "#bf8f26", "#d3a836", "#e2bc4c"]);
      if (lairKind === "den" && shownLair.length)
        // The nest: a matted heap of hide, straw and old bone where the beast sleeps.
        mound(4, ["#3a2c20", "#5c4632", "#6e563c", "#7c6448", "#8a7356"]);
      if (lairKind === "hive" && shownLair.length) {
        // The comb: a waxy crust over the walls, its six-sided cells pressed into it on one grid so they run on
        // unbroken, a few capped pale with brood.
        const comb = mound(2, ["#4e3008", "#8a5a12", "#a46e18", "#b98222", "#c8922c"]);
        ctx.save();
        ctx.clip(lairArea);
        ctx.clip(comb);
        const hx = T * 0.26;
        const hh = hx * Math.sqrt(3);
        const [x0, x1] = [Math.min(...shownLair.map((c) => c.x)) - 1, Math.max(...shownLair.map((c) => c.x)) + 2];
        const [y0, y1] = [Math.min(...shownLair.map((c) => c.y)) - 1, Math.max(...shownLair.map((c) => c.y)) + 2];
        ctx.lineWidth = 1;
        for (let col = Math.floor((x0 * T) / (hx * 1.5)); col * hx * 1.5 < x1 * T; col++)
          for (let row = Math.floor((y0 * T) / hh); row * hh < y1 * T; row++) {
            const cx = col * hx * 1.5;
            const cy = row * hh + (col % 2 ? hh / 2 : 0);
            ctx.beginPath();
            for (let k = 0; k < 6; k++) {
              const ang = (Math.PI / 3) * k;
              const [px, py] = [cx + Math.cos(ang) * (hx - 0.6), cy + Math.sin(ang) * (hx - 0.6)];
              if (k) ctx.lineTo(px, py);
              else ctx.moveTo(px, py);
            }
            ctx.closePath();
            const h = hash(col + 7, row + 3);
            if (h % 9 === 0) {
              ctx.fillStyle = "#ecdcaa";
              ctx.fill();
            } else if (h % 4 === 0) {
              ctx.fillStyle = "rgba(60, 30, 4, 0.45)";
              ctx.fill();
            }
            ctx.strokeStyle = "rgba(58, 32, 4, 0.75)";
            ctx.stroke();
          }
        ctx.restore();
      }
      for (const { x, y } of lairCells) {
        if (inFog(x, y) || !lairKind) continue;
        const [ox, oy] = [x * T, y * T];
        const v = hash(x, y);
        if (lairKind === "hoard") {
          // One heap of coin: rimmed where it meets the floor, brighter at its crown, coins glinting over it.
          const crown = hasF(x - 1, y) && hasF(x + 1, y) && hasF(x, y - 1) && hasF(x, y + 1);
          // Coins as coins: little rimmed discs lying every way, a few on edge, so the heap reads as money and
          // not a lump (lair panel 7: "gum-drops").
          for (let n = 0; n < 7; n++) {
            const h = hash(x * 7 + n, y * 13 - n);
            const cx = 2 + (h % (T - 6));
            const cy = 2 + ((h >> 5) % (T - 5));
            if ((h >> 9) % 4 === 0) {
              ctx.fillStyle = "#6a4608";
              ctx.fillRect(ox + cx, oy + cy, 1, 3);
              ctx.fillStyle = "#f6d46a";
              ctx.fillRect(ox + cx + 1, oy + cy, 1, 3);
              continue;
            }
            ctx.fillStyle = "#6a4608";
            ctx.fillRect(ox + cx, oy + cy + 1, 4, 2);
            ctx.fillStyle = (h >> 11) % 2 ? "#f2c94a" : "#e0b236";
            ctx.fillRect(ox + cx, oy + cy, 4, 2);
            ctx.fillStyle = "#fff3b8";
            ctx.fillRect(ox + cx + 1, oy + cy, 1, 1);
          }
          if (v % 4 === 1) {
            // A loose gem.
            const [gx, gy] = [3 + (v % 9), 4 + ((v >> 4) % 8)];
            ctx.fillStyle = v % 3 === 0 ? "#2f5fd0" : v % 3 === 1 ? "#c8283a" : "#2a9a5a";
            ctx.fillRect(ox + gx, oy + gy, 3, 3);
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillRect(ox + gx, oy + gy, 1, 1);
          }
          if (crown && v % 3 === 0) {
            // A cup standing up out of the coin.
            ctx.fillStyle = "#e8d9a0";
            ctx.fillRect(ox + 6, oy + 4, 5, 3);
            ctx.fillRect(ox + 8, oy + 7, 1, 3);
            ctx.fillRect(ox + 6, oy + 10, 5, 1);
          }
        } else if (lairKind === "sanctum") {
          // A ward stone: a dark standing stone with a burning violet rune, its light pooled round it.
          const glow = ctx.createRadialGradient(ox + T / 2, oy + T / 2, 1, ox + T / 2, oy + T / 2, T);
          glow.addColorStop(0, "rgba(170, 110, 255, 0.35)");
          glow.addColorStop(1, "rgba(170, 110, 255, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(ox - T / 2, oy - T / 2, T * 2, T * 2);
          ctx.fillStyle = "rgba(8, 6, 12, 0.7)";
          ctx.fillRect(ox + 5, oy + 5, 7, 10);
          ctx.fillStyle = "#3d3a46";
          ctx.fillRect(ox + 4, oy + 3, 7, 11);
          ctx.fillStyle = "#5a566c";
          ctx.fillRect(ox + 4, oy + 3, 7, 2);
          ctx.fillRect(ox + 5, oy + 2, 5, 1);
          ctx.fillStyle = "#d9b8ff";
          ctx.fillRect(ox + 7, oy + 6, 1, 5);
          ctx.fillRect(ox + 6, oy + 8, 3, 1);
        } else if (lairKind === "haven") {
          // A coffin: broad at the shoulders, dark wood, brass at its lid; grave earth spilled by it.
          ctx.fillStyle = "rgba(10, 4, 4, 0.7)";
          ctx.fillRect(ox + 4, oy + 2, 10, 14);
          const rows = [
            [5, 3],
            [3, 7],
            [3, 7],
            [3, 7],
            [4, 5],
            [4, 5],
            [4, 5],
            [5, 3],
          ] as const;
          rows.forEach(([lx, w], i) => {
            ctx.fillStyle = "#2e1612";
            ctx.fillRect(ox + lx, oy + 1 + i * 2, w + 3, 2);
            ctx.fillStyle = "#5a2c22";
            ctx.fillRect(ox + lx + 1, oy + 1 + i * 2, w + 1, 2);
          });
          ctx.fillStyle = "#c9a052";
          ctx.fillRect(ox + 7, oy + 4, 2, 7);
          ctx.fillRect(ox + 5, oy + 6, 6, 1);
          ctx.fillStyle = "rgba(70, 48, 28, 0.75)";
          ctx.fillRect(ox + 1, oy + 13, 3, 2);
          ctx.fillRect(ox + 12, oy + 14, 3, 1);
          // A candle stand at its head, lit.
          const side = v % 2 ? T - 3 : 1;
          ctx.fillStyle = "#2a2420";
          ctx.fillRect(ox + side, oy + 4, 2, 7);
          ctx.fillStyle = "#e8e0c8";
          ctx.fillRect(ox + side, oy + 2, 2, 2);
          ctx.fillStyle = "#ffcf5a";
          ctx.fillRect(ox + side, oy, 2, 2);
        } else if (lairKind === "den") {
          // Gnawed bones: one or two lying askew (a knuckle at each end), a skull now and then.
          const bone = (x0: number, y0: number, dx: number, dy: number, len: number) => {
            const [ex, ey] = [x0 + dx * len, y0 + dy * len];
            const [px, py] = dy === 0 ? [0, 1] : dx === 0 ? [1, 0] : [1, 0];
            const knobs = [
              [x0 - px, y0 - py],
              [x0 + px, y0 + py],
              [ex - px, ey - py],
              [ex + px, ey + py],
            ];
            ctx.fillStyle = "rgba(10, 8, 6, 0.6)";
            for (let i = 0; i <= len; i++) ctx.fillRect(ox + x0 + dx * i + 1, oy + y0 + dy * i + 1, 2, 2);
            for (const [kx, ky] of knobs) ctx.fillRect(ox + kx! + 1, oy + ky! + 1, 2, 2);
            ctx.fillStyle = "#d8ccb0";
            for (let i = 0; i <= len; i++) ctx.fillRect(ox + x0 + dx * i, oy + y0 + dy * i, 2, 2);
            ctx.fillStyle = "#ece2c8";
            for (const [kx, ky] of knobs) ctx.fillRect(ox + kx!, oy + ky!, 2, 2);
          };
          const turn = v % 4;
          bone(3, 4 + (turn % 3) * 2, 1, turn === 1 ? 1 : turn === 2 ? -1 : 0, 7);
          if (v % 3 === 0) bone(5 + (turn % 2) * 4, 3, 0, 1, 6);
          if (v % 5 === 0) {
            ctx.fillStyle = "rgba(10, 8, 6, 0.6)";
            ctx.fillRect(ox + 10, oy + 9, 5, 5);
            ctx.fillStyle = "#ece2c8";
            ctx.fillRect(ox + 9, oy + 8, 5, 4);
            ctx.fillRect(ox + 10, oy + 12, 3, 1);
            ctx.fillStyle = "#2a2218";
            ctx.fillRect(ox + 10, oy + 9, 1, 1);
            ctx.fillRect(ox + 12, oy + 9, 1, 1);
          }
        } else if (lairKind === "drowned") {
          // Deep water: darker than the wading water, its surface still, a pale glint now and then.
          if (v % 3 === 0) {
            ctx.fillStyle = "rgba(140, 200, 220, 0.3)";
            ctx.fillRect(ox + 3 + (v % 6), oy + 6 + (v % 5), 5, 1);
          }
        }
      }
      // The lair's breakable thing, drawn as its own piece among the feature so the party can see what to
      // strike (lair panel 4, all five: "show it in the scene" had nothing on the map to point at).
      const anchor = lairKind ? dungeonLairAnchorCell(lairKind, lairCells) : undefined;
      if (lairKind && anchor && !inFog(anchor.x, anchor.y)) {
        const [ox, oy] = [anchor.x * T, anchor.y * T];
        const [cx, cy] = [ox + T / 2, oy + T / 2];
        const accent: Record<string, string> = {
          hoard: "255, 120, 30",
          sanctum: "255, 60, 70",
          haven: "255, 200, 90",
          den: "230, 200, 140",
          breach: "255, 110, 40",
          drowned: "120, 220, 200",
          hive: "250, 240, 200",
        };
        const halo = ctx.createRadialGradient(cx, cy, 2, cx, cy, T * 1.4);
        halo.addColorStop(0, `rgba(${accent[lairKind]}, 0.45)`);
        halo.addColorStop(1, `rgba(${accent[lairKind]}, 0)`);
        ctx.fillStyle = halo;
        // Only over open ground: never through a wall into the rock (lair panel 6: the coffin's glow leaked).
        if (cells) {
          ctx.save();
          const clip = new Path2D();
          const [ax, ay] = [Math.floor(cx / T), Math.floor(cy / T)];
          for (let dy = -2; dy <= 2; dy++)
            for (let dx = -2; dx <= 2; dx++) {
              const [gx, gy] = [ax + dx, ay + dy];
              if (gx < 0 || gy < 0 || gx >= cells.width || gy >= cells.height) continue;
              const g = cells.ground[gy * cells.width + gx];
              if (g !== "wall" && g !== "rock") clip.rect(gx * T, gy * T, T, T);
            }
          ctx.clip(clip);
          ctx.fillRect(cx - T * 1.5, cy - T * 1.5, T * 3, T * 3);
          ctx.restore();
        } else ctx.fillRect(cx - T * 1.5, cy - T * 1.5, T * 3, T * 3);
        // One mark for every lair's breakable thing, the same in each lair: a ring of four corner brackets in
        // its accent, so the party learns "this can be struck" once (lair panel 7: the sluice read as a barrel,
        // the vent as a slit).
        {
          const [bx, by, b] = [ox - 2, oy - 2, T + 4];
          const arm = 4;
          ctx.fillStyle = "rgba(10, 6, 4, 0.7)";
          for (const [px, py, w, h] of [
            [bx + 1, by + 1, arm, 1],
            [bx + 1, by + 1, 1, arm],
            [bx + b - arm + 1, by + 1, arm, 1],
            [bx + b, by + 1, 1, arm],
            [bx + 1, by + b, arm, 1],
            [bx + 1, by + b - arm + 1, 1, arm],
            [bx + b - arm + 1, by + b, arm, 1],
            [bx + b, by + b - arm + 1, 1, arm],
          ] as const)
            ctx.fillRect(px, py, w, h);
          ctx.fillStyle = `rgba(${accent[lairKind]}, 0.95)`;
          for (const [px, py, w, h] of [
            [bx, by, arm, 1],
            [bx, by, 1, arm],
            [bx + b - arm, by, arm, 1],
            [bx + b - 1, by, 1, arm],
            [bx, by + b - 1, arm, 1],
            [bx, by + b - arm, 1, arm],
            [bx + b - arm, by + b - 1, arm, 1],
            [bx + b - 1, by + b - arm, 1, arm],
          ] as const)
            ctx.fillRect(px, py, w, h);
        }
        const px = (x: number, y: number, w: number, h: number, colour: string) => {
          ctx.fillStyle = colour;
          ctx.fillRect(ox + x, oy + y, w, h);
        };
        if (lairKind === "hoard") {
          // A fire vent: a black split in the rock, molten at its heart.
          px(3, 6, 11, 5, "rgba(10, 4, 2, 0.85)");
          px(2, 7, 13, 3, "rgba(10, 4, 2, 0.85)");
          px(5, 8, 7, 1, "#ff8a1c");
          px(7, 7, 3, 3, "#ffb347");
          px(8, 8, 1, 1, "#fff0b0");
        } else if (lairKind === "sanctum") {
          // The ward stone that holds the ring: taller, its rune burning red.
          px(4, 3, 9, 13, "rgba(8, 6, 12, 0.75)");
          px(3, 1, 9, 13, "#2c2934");
          px(3, 1, 9, 2, "#4a4658");
          px(7, 4, 1, 7, "#ff5a64");
          px(5, 6, 5, 1, "#ff5a64");
          px(6, 9, 3, 1, "#ff9aa0");
        } else if (lairKind === "haven") {
          // The master's coffin: the same coffin, banded in gold.
          px(3, 0, 1, T, "#d9b25a");
          px(T - 4, 0, 1, T, "#d9b25a");
          px(4, 0, T - 8, 1, "#f0d27a");
          px(4, T - 1, T - 8, 1, "#d9b25a");
        } else if (lairKind === "den") {
          // A timber prop under a cracked roof: a stout upright braced both ways under its head beam, the
          // roof's crack drawn above it and stone already fallen at its foot (lair panel 5: a small T read as
          // a torch).
          px(9, 2, 4, 14, "rgba(10, 6, 4, 0.7)");
          px(7, 1, 4, 14, "#7a5530");
          px(8, 1, 1, 14, "#a07648");
          px(0, 0, T, 3, "#5e3f22");
          px(0, 0, T, 1, "#8a6238");
          for (let k = 0; k < 4; k++) {
            px(3 + k, 3 + k, 1, 1, "#6a4a28");
            px(T - 4 - k, 3 + k, 1, 1, "#6a4a28");
          }
          px(1, 12, 4, 3, "#8e8574");
          px(12, 13, 3, 3, "#a49a88");
          px(4, 15, 2, 1, "#b0a796");
          ctx.strokeStyle = "rgba(14, 10, 8, 0.85)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ox - 6, oy - 2);
          ctx.lineTo(ox + 2, oy - 5);
          ctx.lineTo(ox + 9, oy - 1);
          ctx.lineTo(ox + 15, oy - 6);
          ctx.lineTo(ox + 22, oy - 3);
          ctx.stroke();
        } else if (lairKind === "breach") {
          // The rift anchor: a black obelisk, its runes lit by the rift.
          // Pale stone against the dark rift, so it reads (lair panel 5 check: a black stone vanished on it).
          px(6, 2, 7, 14, "rgba(10, 4, 2, 0.7)");
          px(5, 1, 7, 14, "#6e6266");
          px(5, 1, 2, 14, "#8e8286");
          px(6, 0, 5, 1, "#a09498");
          px(8, 3, 1, 2, "#ffdd66");
          px(7, 7, 3, 1, "#ff7a2a");
          px(8, 10, 1, 2, "#ff7a2a");
          px(3, 14, 11, 2, "#4a4044");
        } else if (lairKind === "drowned") {
          // The sluice gate: planks in an iron frame, its wheel on top.
          px(2, 4, 13, 11, "rgba(4, 10, 8, 0.7)");
          px(2, 4, 12, 10, "#5a4630");
          for (const y of [6, 9, 12]) px(2, y, 12, 1, "#3a2c1c");
          px(1, 4, 1, 10, "#4c5258");
          px(14, 4, 1, 10, "#4c5258");
          px(6, 0, 5, 1, "#7a828a");
          px(6, 3, 5, 1, "#7a828a");
          px(5, 1, 1, 2, "#7a828a");
          px(11, 1, 1, 2, "#7a828a");
          px(8, 1, 1, 3, "#9aa2aa");
          // Water spilling white through the gate's foot, so it reads as a gate and not a crate (lair panel 5).
          px(3, 14, 10, 2, "rgba(200, 235, 240, 0.7)");
          px(5, 16, 7, 1, "rgba(200, 235, 240, 0.45)");
        } else if (lairKind === "hive") {
          // The egg cluster: pale eggs heaped in the comb, each catching the light at its crown.
          for (const [ex, ey] of [
            [2, 6],
            [7, 3],
            [10, 8],
            [5, 10],
          ] as const) {
            px(ex + 1, ey + 1, 5, 6, "rgba(30, 20, 6, 0.6)");
            px(ex, ey, 5, 6, "#e8dfc0");
            px(ex + 1, ey - 1, 3, 1, "#e8dfc0");
            px(ex + 1, ey + 1, 2, 2, "#fffbe8");
          }
        }
      }
      const stony = kept?.site?.template === "crypt" || (kept?.site?.levels[kept.site.level]?.depth ?? 0) < 0;
      for (const [k, { x, y }] of (kept?.creaks ?? []).entries()) {
        if (inFog(x, y)) continue;
        const [ox, oy] = [x * T, y * T];
        if (stony)
          for (const [dx, dy, w] of [
            [3, 4, 3],
            [9, 3, 2],
            [6, 9, 3],
            [11, 11, 2],
            [2, 12, 2],
          ] as const) {
            ctx.fillStyle = "rgba(12, 10, 8, 0.7)";
            ctx.fillRect(ox + dx, oy + dy + 1, w + 1, w);
            ctx.fillStyle = k % 2 ? "#a49a88" : "#8e8574";
            ctx.fillRect(ox + dx, oy + dy, w, w - 1);
          }
        else
          for (const [dy, tilt] of [
            [3, k % 2 ? 1 : -1],
            [9, k % 2 ? -1 : 1],
          ] as const) {
            ctx.fillStyle = "rgba(12, 8, 4, 0.75)";
            ctx.fillRect(ox + 1, oy + dy - 1, T - 2, 5);
            ctx.fillStyle = "#b07c46";
            for (let px = 1; px < T - 1; px++)
              ctx.fillRect(ox + px, oy + dy + Math.round(((px - T / 2) * tilt) / 8), 1, 3);
            ctx.fillStyle = "#e0b070";
            ctx.fillRect(ox + 3, oy + dy + Math.round(((3 - T / 2) * tilt) / 8), 1, 1);
            ctx.fillRect(ox + T - 4, oy + dy + Math.round(((T - 4 - T / 2) * tilt) / 8), 1, 1);
          }
      }
      // A patrol's beat: the path its feet have worn, a trail of scuffed footprints along the walk it keeps,
      // in the floor itself (lair panel 3 and 4, building panels: red chevrons and bars read as a debug overlay).
      for (const guard of guards) {
        if (!guard.beat || inFog(guard.x, guard.y)) continue;
        for (const [k, { x, y }] of guard.beat.entries()) {
          if (inFog(x, y)) continue;
          const [a, b] = [guard.beat[Math.max(0, k - 1)]!, guard.beat[Math.min(guard.beat.length - 1, k + 1)]!];
          const angle = Math.atan2(b.y - a.y, b.x - a.x);
          const [cx, cy] = [x * T + T / 2, y * T + T / 2];
          // Two steps a cell, left then right of the line it walks.
          for (const [along, side] of [
            [-T / 4, 1],
            [T / 4, -1],
          ] as const) {
            const fx = cx + Math.cos(angle) * along + Math.cos(angle + Math.PI / 2) * side * 2.5;
            const fy = cy + Math.sin(angle) * along + Math.sin(angle + Math.PI / 2) * side * 2.5;
            ctx.save();
            ctx.translate(fx, fy);
            ctx.rotate(angle);
            ctx.fillStyle = "rgba(20, 12, 8, 0.42)";
            ctx.beginPath();
            ctx.ellipse(0, 0, 2.6, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-3.2, 0, 1.2, 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
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
          const [kx, ky] = [guard.x * T + (guard.asleep ? -8 : T - 6), guard.y * T - 10];
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
    [
      base,
      drawTile,
      fogged,
      framed,
      mapSize.width,
      mapSize.height,
      foundTraps,
      guards,
      resolution,
      scale,
      size.height,
      size.width,
      standing,
      sneaking,
    ],
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
