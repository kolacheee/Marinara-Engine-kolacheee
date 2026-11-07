// ──────────────────────────────────────────────
// Game: the overworld (worldgen W8)
// The game's world drawn as a pixel overworld: its ground, ways and settlements, and the party, which
// walks from settlement to settlement along the world's ways. It runs on the game's clock as Pixelforge's
// world does: while it is in front and the game waits on the player, a game minute passes every five real
// seconds, and a walk passes its days. The next turn tells the Game Master where the party walked.
// ──────────────────────────────────────────────
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { DoorOpen, Footprints, MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  WORLD_EDGE_PIECE_BY_MASK,
  worldGroundCells,
  worldRoadCells,
  worldPathCells,
  worldEdgePiece,
  worldJoinedPieces,
  WORLD_DECOR_LOOKS,
  WORLD_TREELINE_LOOKS,
  worldTreelineTrees,
  worldRangePeaks,
  worldRangeRidges,
  worldRoadBridgePiece,
  worldEdgeMask,
  WORLD_FRINGE_ORDER,
  WORLD_SQUARE_LOOKS,
  worldGroundLooks,
  worldSites,
  worldTrip,
  type GameWorld,
  characterFacing,
  characterFrameAt,
  type CharacterFacing,
  type TilePack,
  type WorldPlace,
  worldSeason,
  worldSeasonCells,
  type WorldSeason,
} from "@marinara-engine/shared";
import { useDungeonEnter, useOverworld, useOverworldWalk } from "../../hooks/use-game";
import {
  overworldCamera,
  overworldBaseResolution,
  useOverworldAtlas,
  useOverworldClock,
  type OverworldClockHandle,
} from "../../hooks/use-overworld-view";
import { useGameStateStore } from "../../stores/game-state.store";
import {
  OVERWORLD_TILE,
  cellNoise,
  overworldDarkness,
  paintGround,
  paintParty,
  paintSettlement,
  paintSite,
  paintShore,
  paintWay,
  paintRivers,
} from "../../lib/overworld-paint";
import { cn } from "../../lib/utils";
import { GAME_SECTION_CLASS } from "../../lib/chat-widget-colors";

/** How much larger an image pack's settlement marker is drawn, by the place's tier (hamlet to city). */
const MARKER_GROWTH = [1.25, 1.75, 2.25, 3] as const;

/** Beyond the world's edge: the ground its border has most of (the sea around an island, open space), and
 *  whether that is water. */
function worldBeyond(game: Parameters<typeof worldGroundLooks>[0], world: Parameters<typeof worldGroundCells>[0]) {
  const looks = worldGroundLooks(game);
  const cells = worldGroundCells(world);
  const count = new Map<number, number>();
  for (let y = 0; y < world.height; y++)
    for (let x = 0; x < world.width; x++) {
      // The whole border: the top and bottom rows and the first and last columns.
      if (y > 0 && y < world.height - 1 && x > 0 && x < world.width - 1) continue;
      const cell = cells[y * world.width + x]!;
      count.set(cell, (count.get(cell) ?? 0) + 1);
    }
  const cell = [...count].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? 0;
  const wet = (game.kit.terrain?.find((entry) => entry.id === world.terrain[cell])?.kind ?? "open") === "water";
  return { look: looks[cell] ?? looks[0]!, wet };
}

/** What the game screen can ask of the overworld: send the real time it has passed so far. */
export type WorldOverworldHandle = OverworldClockHandle;

interface WorldOverworldProps {
  chatId: string;
  game: GameWorld;
  /** Changes after each turn, so where the party is is read again. */
  turnKey: string | null;
  /** The game's clock, as the chat has it. */
  time: { day: number; hour: number; minute: number } | null;
  /** The clock runs: the overworld is in front and the game waits on the player. */
  clockRunning: boolean;
  canWalk: boolean;
  /** The setting's art family, whose tiles the overworld is drawn with when it has them. */
  family?: string;
  /** The game's own tiles (an Experience's map pack), drawn before the setting family's. */
  tilePack?: TilePack | null | "loading";
  /** Opens the town the party is in (worldgen W8b). */
  onEnterTown?: () => void;
  handleRef?: MutableRefObject<WorldOverworldHandle | null>;
}

type Point = { x: number; y: number };

/** Cells a second the party walks on screen, and the shortest and longest a walk is shown for. */
const WALK_CELLS_PER_SECOND = 6;
const WALK_SHORTEST_MS = 1200;
const WALK_LONGEST_MS = 6000;
/** Pixels a press moves before it is a drag of the map rather than a click. */
const DRAG_PIXELS = 6;

const settlementTier = (place: WorldPlace, top: number) =>
  Math.min(3, Math.floor(((place.rank ?? 0) * 3) / Math.max(1, top)));
const centre = (place: WorldPlace): Point => ({
  x: place.at.x * OVERWORLD_TILE + OVERWORLD_TILE / 2,
  y: place.at.y * OVERWORLD_TILE + OVERWORLD_TILE / 2,
});

export function WorldOverworld({
  chatId,
  game,
  turnKey,
  time,
  clockRunning,
  canWalk,
  family,
  tilePack,
  onEnterTown,
  handleRef,
}: WorldOverworldProps) {
  const { t } = useTranslation();
  const { data: overworld } = useOverworld(chatId, turnKey, true);
  const walkMutation = useOverworldWalk();
  const enterMutation = useDungeonEnter();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const walkChipRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [placesOpen, setPlacesOpen] = useState(false);
  /** Where the view looks, in world pixels; none: at the party. */
  const [lookAt, setLookAt] = useState<Point | null>(null);
  const [walking, setWalking] = useState(false);
  const walkingRef = useRef(false);

  const { world, kit } = game;
  const byId = useMemo(() => new Map(world.places.map((place) => [place.id, place])), [world]);
  const top = Math.max(1, kit.sizes.length - 1);
  const here = overworld?.here ?? null;
  const ruined = useMemo(() => new Set(overworld?.ruined ?? []), [overworld?.ruined]);
  const scale = Math.max(2, Math.min(4, Math.floor(Math.min(size.width / 400, size.height / 260))));
  // The world's sites (a cave, a mine, a ruin out in the world), gone to and into as settlements are.
  // A hidden site is not drawn or listed until the Game Master reveals it; a sealed one is, but closed.
  const hiddenKey = (overworld?.hidden ?? []).join(",");
  const siteIds = useMemo(() => {
    const hidden = new Set(hiddenKey ? hiddenKey.split(",") : []);
    return new Set(
      worldSites(game)
        .map((place) => place.id)
        .filter((id) => !hidden.has(id)),
    );
  }, [game, hiddenKey]);
  const sealed = (id: string) => overworld?.locked?.[id] === "sealed";
  const sealedKey = Object.keys(overworld?.locked ?? {})
    .sort()
    .join(",");
  // Settlements and sites nearest the party first, by the days the way takes; those no way reaches last.
  const settlements = useMemo(() => {
    const days = (place: WorldPlace) =>
      place.id === here ? -1 : here ? (worldTrip(game, here, place.id)?.days ?? Infinity) : 0;
    return world.places
      .filter((place) => place.rank !== undefined || siteIds.has(place.id))
      .map((place) => ({ place, days: days(place) }))
      .sort((a, b) => a.days - b.days || a.place.name.localeCompare(b.place.name));
  }, [game, here, siteIds, world]);

  // ── The clock (Pixelforge's): a game minute every five real seconds while the overworld waits ──
  const { pendingMinutes, flush } = useOverworldClock(chatId, clockRunning, () => walkingRef.current, handleRef);

  const clockMinutes = time ? (time.day * 24 + time.hour) * 60 + time.minute + pendingMinutes : null;
  const darkness = clockMinutes === null ? 0 : overworldDarkness(Math.floor(clockMinutes / 60) % 24, clockMinutes % 60);
  const lit = darkness > 0.25;

  // ── The family's tiles: drawn plain until (and unless) they load ──
  // Drawn in the season of the game's day (seasonal tiles, where the pack has them).
  const drawTile = useOverworldAtlas(family, tilePack, time ? worldSeason(time.day) : undefined);
  // The places the story holds at a season of their own (1.351): each cell drawn in its nearest place's.
  const seasonsKey = JSON.stringify(overworld?.seasons ?? {});
  const heldCells = useMemo(
    () => worldSeasonCells(game, JSON.parse(seasonsKey) as Record<string, WorldSeason>),
    [game, seasonsKey],
  );

  // ── What is drawn once: the ground and its ways, then the settlements ──
  // In world units (16 a cell) at `resolution` canvas pixels a unit (an image pack's detail, as far as
  // the two canvases' size allows).
  const worldSize = { width: world.width * OVERWORLD_TILE, height: world.height * OVERWORLD_TILE };
  const resolution = overworldBaseResolution(
    drawTile,
    2 * worldSize.width * worldSize.height,
    scale * (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1),
  );
  const { canvas: ground, trees } = useMemo(() => {
    const canvas = document.createElement("canvas");
    if (drawTile.loading)
      return { canvas, trees: [] as Array<{ x: number; y: number; id: string; pick: number; w: number; h: number }> };
    canvas.width = world.width * OVERWORLD_TILE * resolution;
    canvas.height = world.height * OVERWORLD_TILE * resolution;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return { canvas, trees: [] as Array<{ x: number; y: number; id: string; pick: number; w: number; h: number }> };
    ctx.scale(resolution, resolution);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const looks = worldGroundLooks(game);
    const cells = worldGroundCells(world);
    const water = world.terrain.map(
      (id) => (game.kit.terrain?.find((entry) => entry.id === id)?.kind ?? "open") === "water",
    );
    const wet = (x: number, y: number) =>
      x < 0 || y < 0 || x >= world.width || y >= world.height ? true : water[cells[y * world.width + x]!]!;
    const { width, height } = world;
    // Where the sea lies beyond the map's edge, the land along the border gives way to it unevenly (a
    // coast, not the map's straight edge): border cells up to two deep, by a smooth noise along the edge,
    // are drawn as water, never a place, a way or the cells beside them.
    const wetCell: boolean[] = Array.from(cells, (cell) => water[cell]!);
    if (worldBeyond(game, world).wet && drawTile.hasEdges("water")) {
      const kept = new Set<number>();
      const keep = (x: number, y: number) => {
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (x + dx >= 0 && y + dy >= 0 && x + dx < width && y + dy < height) kept.add((y + dy) * width + x + dx);
      };
      for (const place of world.places) keep(place.at.x, place.at.y);
      // The ways as the road pass below lays them.
      const joined = drawTile.hasPiece("road_joined", 0);
      for (const link of world.links) {
        const [from, to] = [byId.get(link.from), byId.get(link.to)];
        if (!from || !to) continue;
        const skip = (x: number, y: number) => wet(x, y);
        const cellsOn = link.path
          ? worldPathCells(link.path, width, skip, joined)
          : worldRoadCells(from.at, to.at, skip, joined);
        for (const { x, y } of cellsOn) keep(x, y);
      }
      // Depth along an edge: smooth noise over runs of about five cells, 0 to 2 cells deep.
      const depth = (edge: number, at: number) => {
        const [i, f] = [Math.floor(at / 5), (at % 5) / 5];
        const [a, b] = [cellNoise(i, edge)(83), cellNoise(i + 1, edge)(83)];
        const t = f * f * (3 - 2 * f);
        return Math.floor((a + (b - a) * t) * 3);
      };
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const at = y * width + x;
          if (wetCell[at] || kept.has(at)) continue;
          if (y < depth(0, x) || height - 1 - y < depth(1, x) || x < depth(2, y) || width - 1 - x < depth(3, y))
            wetCell[at] = true;
        }
    }
    /** What follows is drawn in the season the story holds the cell at (x, y) in, or the day's. */
    const inSeason = (x: number, y: number) => {
      if (!heldCells) return;
      const at = Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x));
      drawTile.setCellSeason(heldCells[at] ?? undefined);
    };
    // With water edge tiles, a water cell is under-painted with the land most of its neighbours are, and
    // the water itself is drawn by the edge pieces (so a rounded shore shows land under it).
    const waterEdges = drawTile.hasEdges("water");
    const landUnder = (x: number, y: number) => {
      const count = new Map<number, number>();
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const [nx, ny] = [x + dx, y + dy];
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const cell = cells[ny * width + nx]!;
          if (!water[cell]) count.set(cell, (count.get(cell) ?? 0) + 1);
        }
      return [...count].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];
    };
    // The look each cell is drawn with (a water cell under its edge pieces: the land under it).
    const drawnLook: string[] = new Array(width * height);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const own = cells[y * width + x]!;
        drawnLook[y * width + x] = looks[waterEdges && wetCell[y * width + x] ? (landUnder(x, y) ?? own) : own]!;
      }
    // A wooded look with trees and a fringe: its own ground only on cells wholly among it, its edge cells
    // painted with the ground beside them, and its trees (after) standing where its fringe would curve, so
    // no forest floor shows past the trees at its edge.
    const treeLooks = new Set<string>(
      WORLD_TREELINE_LOOKS.filter((look) => drawTile.hasPiece(`treeline_${look}`, 0) && drawTile.hasFringe(look)),
    );
    // Looks whose trees hide their ground's edge, so the edge is drawn as the ground beside them. A range's
    // peaks stand apart, so its rock keeps its own fringe and the peaks stand on it.
    const coveredLooks = new Set<string>([...treeLooks].filter((look) => look !== "mountains"));
    const lookAt = (x: number, y: number) =>
      drawnLook[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]!;
    // A cell in the middle of its look, with no water beside it: water keeps the look of the land under
    // it, and trees stand back from the shore, so a wood's floor beside water would show bare.
    const wetAt = (x: number, y: number) =>
      wetCell[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]!;
    const inner = (x: number, y: number) => {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          if (lookAt(x + dx, y + dy) !== lookAt(x, y) || wetAt(x + dx, y + dy)) return false;
      return true;
    };
    // Fields and built-up ground keep to their own cells: a wood beside one stands on open ground (grass).
    const square = new Set<string>(WORLD_SQUARE_LOOKS);
    const besideLook = (x: number, y: number) => {
      const count = new Map<string, number>();
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const other = lookAt(x + dx, y + dy);
          // Water's own look (a lake with no land beside it) is never the ground under a wood's edge.
          if (wetAt(x + dx, y + dy) && drawTile.hasEdges("water")) continue;
          if (other !== lookAt(x, y) && !square.has(other) && !propLooks.has(other))
            count.set(other, (count.get(other) ?? 0) + 1);
        }
      return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "grass";
    };
    // Looks drawn as props over the ground beside them (the owner, 2026-11-07: craters "as like, a prop
    // that goes on top of another tile like flowers are, and the color changes to match the color
    // underneath"): the pack's crater scars are shading only, laid over open ground.
    const propLooks = new Set<string>(drawTile.hasPiece("crater_props", 0) ? ["craters"] : []);
    const openGround = (look: string) =>
      !square.has(look) && !propLooks.has(look) && !coveredLooks.has(look) && look !== "mountains";
    // The open ground most of the map has, for a prop look with none near it.
    const commonOpen = (() => {
      const count = new Map<string, number>();
      drawnLook.forEach((look, at) => {
        if (!wetCell[at] && openGround(look)) count.set(look, (count.get(look) ?? 0) + 1);
      });
      return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "grass";
    })();
    /** The open ground nearest the cell at (x, y), most of it within the nearest ring that has any. */
    const groundNear = (x: number, y: number) => {
      for (let r = 1; r <= 4; r++) {
        const count = new Map<string, number>();
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || wetAt(x + dx, y + dy)) continue;
            const other = lookAt(x + dx, y + dy);
            if (openGround(other)) count.set(other, (count.get(other) ?? 0) + 1);
          }
        const best = [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
        if (best) return best;
      }
      return commonOpen;
    };
    const groundOf = (x: number, y: number, drawn: string) => {
      const noise = cellNoise(x, y);
      inSeason(x, y);
      if (!drawTile(ctx, drawn, x * OVERWORLD_TILE, y * OVERWORLD_TILE, noise(99))) {
        paintGround(ctx, drawn as (typeof looks)[number], x * OVERWORLD_TILE, y * OVERWORLD_TILE, noise);
      }
    };
    // A wood's floor under its trees: the pack's own where it has one, else its ground in shade (the owner,
    // 2026-11-07: the old texture "looks a bit weird underneath the trees").
    const floorOf = (x: number, y: number, look: string) => {
      inSeason(x, y);
      if (drawTile(ctx, `floor_${look}`, x * OVERWORLD_TILE, y * OVERWORLD_TILE, cellNoise(x, y)(99))) return;
      groundOf(x, y, look);
      ctx.fillStyle = "rgba(10, 22, 14, 0.55)";
      ctx.fillRect(x * OVERWORLD_TILE, y * OVERWORLD_TILE, OVERWORLD_TILE, OVERWORLD_TILE);
    };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const own = cells[y * width + x]!;
        const look = drawnLook[y * width + x]!;
        const drawn = propLooks.has(look)
          ? groundNear(x, y)
          : coveredLooks.has(look) && !inner(x, y)
            ? besideLook(x, y)
            : look;
        if (coveredLooks.has(drawn) && drawn === look) floorOf(x, y, look);
        else groundOf(x, y, drawn);
        if (water[own] && !waterEdges) {
          paintShore(ctx, x * OVERWORLD_TILE, y * OVERWORLD_TILE, {
            n: !wet(x, y - 1),
            s: !wet(x, y + 1),
            w: !wet(x - 1, y),
            e: !wet(x + 1, y),
          });
        }
      }
    }
    // Fringes: where the pack has one for a look, the look spills past its cells onto the ground beside it,
    // taller ground drawn last so it overhangs.
    for (const look of WORLD_FRINGE_ORDER) {
      if (
        !drawTile.hasFringe(look) ||
        !drawnLook.includes(look) ||
        coveredLooks.has(look) ||
        square.has(look) ||
        propLooks.has(look)
      )
        continue;
      const isLook = (x: number, y: number) => drawnLook[y * width + x] === look;
      // Laid out as an edge tile is: with slanted corners and curved runs where the fringe has them.
      const fringeRows = drawTile.fringeRows(look);
      for (let y = 0; y <= height; y++)
        for (let x = 0; x <= width; x++) {
          const mask = worldEdgeMask(isLook, x, y, width, height);
          if (mask === 0 || mask === 15) continue;
          inSeason(x, y);
          drawTile.fringe(
            ctx,
            look,
            worldEdgePiece(isLook, x, y, width, height, fringeRows),
            x * OVERWORLD_TILE,
            y * OVERWORLD_TILE,
            (cx, cy) => cellNoise(cx, cy)(99),
            cellNoise(x, y)(79),
          );
        }
    }
    // Square looks drawn again over whatever fringe spilled onto them, so their edges stay the cell lines.
    if (WORLD_FRINGE_ORDER.some((look) => drawTile.hasFringe(look)))
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const look = drawnLook[y * width + x]!;
          if (!square.has(look) || wetCell[y * width + x]) continue;
          groundOf(x, y, look);
        }
    /** A dual-grid pass: every corner of the map whose four cells are partly or wholly the terrain. */
    // `beyondWet`: the sea beyond the map's edge counts as water, so land on the border gets its shore
    // instead of a straight cut where the map ends (worked on the map with a ring of water around it).
    const edgePass = (terrain: "water" | "road", filled: (x: number, y: number) => boolean, beyondWet = false) => {
      const rows = drawTile.edgeRows(terrain);
      const ringed = (x: number, y: number) =>
        x < 1 || y < 1 || x > width || y > height ? true : filled(x - 1, y - 1);
      for (let y = 0; y <= height; y++)
        for (let x = 0; x <= width; x++) {
          const piece = beyondWet
            ? worldEdgePiece(ringed, x + 1, y + 1, width + 2, height + 2, rows)
            : worldEdgePiece(filled, x, y, width, height, rows);
          if (piece < 0) continue;
          inSeason(x, y);
          drawTile.edge(
            ctx,
            terrain,
            piece,
            x * OVERWORLD_TILE,
            y * OVERWORLD_TILE,
            cellNoise(x, y)(terrain === "water" ? 71 : 73),
          );
        }
    };
    if (waterEdges) edgePass("water", (x, y) => wetCell[y * width + x]!, worldBeyond(game, world).wet);
    // Rivers (world generator 7), over the ground and its shores and under the roads: each from its source
    // to the shore it runs into (a little past it, under the water's edge), the river it joins, or past
    // the map's edge.
    const riverCells = new Set<number>();
    // Each stretch of each river as drawn (in cells, with its half width), kept by the cell it starts in.
    const riverStretches = new Map<number, Array<readonly [number, number, number, number, number]>>();
    /** Whether a point (in cells) stands on a river as drawn, or within a third of a cell of its bank. */
    const byRiver = (px: number, py: number) => {
      const [cx, cy] = [Math.floor(px), Math.floor(py)];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          for (const [ax, ay, bx, by, half] of riverStretches.get((cy + dy) * width + cx + dx) ?? []) {
            const [vx, vy] = [bx - ax, by - ay];
            const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy || 1)));
            if (Math.hypot(px - (ax + vx * t), py - (ay + vy * t)) < half + 0.3) return true;
          }
      return false;
    };
    if (world.rivers?.length) {
      const centre = (cell: number) => ({
        x: (cell % width) * OVERWORLD_TILE + OVERWORLD_TILE / 2,
        y: Math.floor(cell / width) * OVERWORLD_TILE + OVERWORLD_TILE / 2,
      });
      const courses = world.rivers.map((river) => {
        const points = river.path.map((cell, index) => ({ ...centre(cell), size: river.width[index] ?? 1 }));
        // A river never runs ruler-straight: each bend point between the ends is set off its line a little,
        // across the river's way, by its own cell's noise (the same world always winds the same way).
        for (let i = 1; i < points.length - 1; i++) {
          const [a, b] = [centre(river.path[i - 1]!), centre(river.path[i + 1]!)];
          const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          // A slow swing along the river (bends a few cells long) and a little wobble of each cell's own.
          const phase = cellNoise(river.path[0]! % width, Math.floor(river.path[0]! / width))(97) * Math.PI * 2;
          const shift =
            Math.sin(i * 0.8 + phase) * 0.45 +
            (cellNoise(river.path[i]! % width, Math.floor(river.path[i]! / width))(91) - 0.5) * 0.4;
          points[i]!.x += (-(b.y - a.y) / length) * shift * OVERWORLD_TILE;
          points[i]!.y += ((b.x - a.x) / length) * shift * OVERWORLD_TILE;
        }
        const last = river.path[river.path.length - 1]!;
        if (points.length >= 2 && wetCell[last]) {
          const [a, b] = [points[points.length - 2]!, points[points.length - 1]!];
          points[points.length - 1] = { ...b, x: a.x + (b.x - a.x) * 0.7, y: a.y + (b.y - a.y) * 0.7 };
        } else if (points.length >= 2) {
          const [lx, ly] = [last % width, Math.floor(last / width)];
          if (lx === 0 || ly === 0 || lx === width - 1 || ly === height - 1) {
            const [a, b] = [points[points.length - 2]!, points[points.length - 1]!];
            points.push({ ...b, x: b.x + (b.x - a.x), y: b.y + (b.y - a.y) });
          }
        }
        for (const cell of river.path) if (!wetCell[cell]) riverCells.add(cell);
        return { points, mouth: wetCell[last] === true };
      });
      // The rivers in the colour the sea is drawn in: a water cell with water all round it, sampled.
      let waterColour = "#4a7fb5";
      let waterPattern: CanvasPattern | null = null;
      try {
        const deep = [...wetCell.keys()].find((cell) => {
          const [x, y] = [cell % width, Math.floor(cell / width)];
          if (x < 1 || y < 1 || x >= width - 1 || y >= height - 1) return false;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) if (!wetCell[(y + dy) * width + x + dx]) return false;
          return true;
        });
        if (deep !== undefined) {
          const [x, y] = [deep % width, Math.floor(deep / width)];
          const size = Math.max(1, Math.round(OVERWORLD_TILE * resolution));
          const data = ctx.getImageData(x * size, y * size, size, size).data;
          let [r, g, b, n] = [0, 0, 0, 0];
          for (let i = 0; i < data.length; i += 4) {
            r += data[i]!;
            g += data[i + 1]!;
            b += data[i + 2]!;
            n++;
          }
          if (n) waterColour = `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
          // The sea's own ripples, so a river reads as the same water, not a painted line.
          const tile = document.createElement("canvas");
          [tile.width, tile.height] = [size, size];
          tile.getContext("2d")?.putImageData(ctx.getImageData(x * size, y * size, size, size), 0, 0);
          waterPattern = ctx.createPattern(tile, "repeat");
          waterPattern?.setTransform(new DOMMatrix().scale(1 / resolution));
        }
      } catch {
        // A canvas the browser will not read back keeps the plain blue.
      }
      for (const drawn of paintRivers(ctx, courses, waterColour, waterPattern))
        for (let i = 1; i < drawn.length; i++) {
          const [a, b] = [drawn[i - 1]!, drawn[i]!];
          const stretch = [
            a.x / OVERWORLD_TILE,
            a.y / OVERWORLD_TILE,
            b.x / OVERWORLD_TILE,
            b.y / OVERWORLD_TILE,
            Math.max(a.w, b.w) / 2 / OVERWORLD_TILE,
          ] as const;
          const cell = Math.floor(stretch[1]) * width + Math.floor(stretch[0]);
          riverStretches.set(cell, [...(riverStretches.get(cell) ?? []), stretch]);
        }
    }
    // Ways over open ground: as road cells with joined road pieces (laid corner to corner) or road edge
    // tiles, else drawn as lines.
    const roadJoined = drawTile.hasPiece("road_joined", 0);
    const roadEdges = roadJoined || drawTile.hasEdges("road");
    const roads = new Set<number>();
    for (const link of world.links) {
      const from = byId.get(link.from);
      const to = byId.get(link.to);
      if (!from || !to) continue;
      const crosses = kit.travel.find((way) => way.id === link.way)?.crosses ?? "open";
      if (roadEdges && crosses === "open") {
        // Through the settlements too (the owner, 2026-11-07: "paths should go through and under
        // settlements"): the marker stands over the road's end.
        const skip = (x: number, y: number) => wet(x, y);
        // A way laid along the land (generator 8) runs over its own cells; an older one, straight.
        const cellsOn = link.path
          ? worldPathCells(link.path, width, skip, roadJoined)
          : worldRoadCells(from.at, to.at, skip, roadJoined);
        for (const { x, y } of cellsOn) roads.add(y * width + x);
        continue;
      }
      if (link.path) {
        for (let i = 1; i < link.path.length; i++) {
          const [a, b] = [link.path[i - 1]!, link.path[i]!];
          paintWay(
            ctx,
            { x: a % width, y: Math.floor(a / width) },
            { x: b % width, y: Math.floor(b / width) },
            crosses,
          );
        }
        continue;
      }
      paintWay(ctx, from.at, to.at, crosses);
    }
    if (roads.size && roadJoined) {
      // Flat on the ground, each road cell's pieces by its road neighbours; pieces that spill past their
      // cells (the diagonal ones) after the rest.
      const isRoad = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && roads.has(y * width + x);
      const spilling: Array<() => void> = [];
      for (const at of roads) {
        const [x, y] = [at % width, Math.floor(at / width)];
        const pick = cellNoise(x, y)(73);
        const has = (piece: number) => drawTile.hasPiece("road_joined", piece, pick);
        const pieces = worldJoinedPieces(isRoad, x, y, has);
        const drawPieces = () => {
          inSeason(x, y);
          for (const piece of pieces)
            drawTile.piece(ctx, "road_joined", piece, x * OVERWORLD_TILE, y * OVERWORLD_TILE, pick);
        };
        if (pieces.some((piece) => piece >= 20)) spilling.push(drawPieces);
        else drawPieces();
      }
      for (const drawPieces of spilling) drawPieces();
    } else if (roads.size) edgePass("road", (x, y) => roads.has(y * width + x));
    // Bridges where a road crosses a river (the owner, 2026-11-07: "bridges that go over water instead of
    // path"), over the road's own piece on that cell.
    if (roads.size && drawTile.hasPiece("road_bridge", 0)) {
      const isRoad = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && roads.has(y * width + x);
      for (const at of roads) {
        if (!riverCells.has(at)) continue;
        const [x, y] = [at % width, Math.floor(at / width)];
        // The river's run through the cell, for a road that only turns there.
        const along = (dx: number, dy: number) => riverCells.has((y + dy) * width + x + dx);
        const across = along(0, -1) || along(0, 1) ? "ns" : along(-1, 0) || along(1, 0) ? "ew" : undefined;
        const piece = worldRoadBridgePiece(isRoad, x, y, across);
        const pick = cellNoise(x, y)(73);
        if (!drawTile.hasPiece("road_bridge", piece, pick)) continue;
        inSeason(x, y);
        drawTile.piece(ctx, "road_bridge", piece, x * OVERWORLD_TILE, y * OVERWORLD_TILE, pick);
      }
    }
    drawTile.setCellSeason(undefined);
    // The trees on wooded looks that have them, with the markers: on the look's floor as drawn through its
    // fringe (so they follow its curved edge), never on a road or a place.
    const placed = new Set(world.places.map((place) => place.at.y * width + place.at.x));
    const trees: Array<{ x: number; y: number; id: string; pick: number; w: number; h: number }> = [];
    for (const look of treeLooks) {
      if (!drawnLook.includes(look)) continue;
      const isLook = (x: number, y: number) => drawnLook[y * width + x] === look;
      const fringeRows = drawTile.fringeRows(look);
      const onFloor = (px: number, py: number) => {
        const [cx, cy] = [Math.floor(px), Math.floor(py)];
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) return false;
        if (roads.has(cy * width + cx) || placed.has(cy * width + cx) || byRiver(px, py)) return false;
        if (square.has(drawnLook[cy * width + cx]!)) return false;
        // Never in the water (a water cell is drawn over the land under it, which may be the wood's),
        // nor so near it that the trunk stands past the shore.
        for (const [dx, dy] of [
          [0, 0],
          [-0.3, 0],
          [0.3, 0],
          [0, -0.3],
          [0, 0.3],
        ] as const) {
          const [wx, wy] = [Math.floor(px + dx), Math.floor(py + dy)];
          if (wx >= 0 && wy >= 0 && wx < width && wy < height && wetCell[wy * width + wx]) return false;
        }
        if (isLook(cx, cy) && inner(cx, cy)) return true;
        // The corner whose fringe piece the point lies in.
        const [kx, ky] = [Math.round(px), Math.round(py)];
        const mask = worldEdgeMask(isLook, kx, ky, width, height);
        if (mask === 15) return true;
        if (mask === 0) return false;
        const piece = worldEdgePiece(isLook, kx, ky, width, height, fringeRows);
        return drawTile.fringeCovers(look, piece, cellNoise(kx, ky)(79), px - kx + 0.5, py - ky + 0.5);
      };
      const ridged = look === "mountains" && drawTile.hasPiece("mountain_ridges", 0);
      const pined = look === "mountains" && drawTile.hasPiece("mountain_pines", 0);
      const [ranges, peaks, pines]: Array<typeof trees> = [[], [], []];
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          // The look's cells and those its fringe reaches onto.
          let near = false;
          for (let dy = -1; dy <= 1 && !near; dy++)
            for (let dx = -1; dx <= 1 && !near; dx++)
              near = x + dx >= 0 && y + dy >= 0 && x + dx < width && y + dy < height && isLook(x + dx, y + dy);
          if (!near) continue;
          if (look !== "mountains") {
            for (const tree of worldTreelineTrees(onFloor, x, y))
              trees.push({ ...tree, id: `treeline_${look}`, w: 1, h: 1 });
            continue;
          }
          // A range (the owner, 2026-11-07: peaks alone read as "a bunch of randomly placed tall rocks"):
          // chains of peaks standing in overlapping rows where the pack has them, single peaks where no chain
          // fits, and pines on the foothills where the range meets other ground.
          if (ridged)
            for (const ridge of worldRangeRidges(onFloor, x, y))
              ranges.push({ ...ridge, id: "mountain_ridges", w: 3, h: 2 });
          for (const peak of worldRangePeaks(onFloor, x, y))
            peaks.push({ ...peak, id: "treeline_mountains", w: 2, h: 2 });
          if (pined && isLook(x, y) && !inner(x, y))
            for (const pine of worldTreelineTrees(onFloor, x, y))
              if (cellNoise(Math.floor(pine.x * 4), Math.floor(pine.y * 4))(57) < 0.45)
                pines.push({ ...pine, id: "mountain_pines", w: 1, h: 1 });
        }
      if (look === "mountains") {
        trees.push(...ranges);
        // A peak only where no chain stands already.
        for (const peak of peaks)
          if (!ranges.some((ridge) => Math.abs(ridge.x - peak.x) < 1.7 && Math.abs(ridge.y - peak.y) < 0.75))
            trees.push(peak);
        trees.push(...pines);
      }
    }
    // Small things on open ground (a flower clump, a rock, a bush): about one cell in five wholly inside
    // its look, never on or beside a road or a place, so nothing is cut by another ground's edge.
    const nearWay = (x: number, y: number) => {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const at = (y + dy) * width + (x + dx);
          if (roads.has(at) || placed.has(at) || riverCells.has(at)) return true;
        }
      return false;
    };
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const look = drawnLook[y * width + x]!;
        if (!(WORLD_DECOR_LOOKS as readonly string[]).includes(look)) continue;
        const noise = cellNoise(x, y);
        if (noise(61) >= 0.2 || !inner(x, y) || nearWay(x, y)) continue;
        inSeason(x, y);
        drawTile(ctx, `decor_${look}`, x * OVERWORLD_TILE, y * OVERWORLD_TILE, noise(67));
      }
    // Crater scars over their ground: about two cells in three, a large one (two cells by two, spilling onto
    // its neighbours) only where the field goes on all round.
    if (propLooks.has("craters"))
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          if (drawnLook[y * width + x] !== "craters" || wetCell[y * width + x]) continue;
          const noise = cellNoise(x, y);
          if (noise(63) >= 0.65) continue;
          const large = (x + 2 * y) % 3 === 0 && inner(x, y);
          const piece = large ? 4 + Math.floor(noise(64) * 4) : Math.floor(noise(65) * 4);
          inSeason(x, y);
          drawTile.piece(ctx, "crater_props", piece, x * OVERWORLD_TILE, y * OVERWORLD_TILE, noise(66));
        }
    drawTile.setCellSeason(undefined);
    return { canvas, trees };
  }, [byId, drawTile, game, heldCells, kit.travel, resolution, world]);
  const markers = useMemo(() => {
    const canvas = document.createElement("canvas");
    if (drawTile.loading) return canvas;
    canvas.width = world.width * OVERWORLD_TILE * resolution;
    canvas.height = world.height * OVERWORLD_TILE * resolution;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.scale(resolution, resolution);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const drawPlace = (place: (typeof settlements)[number]["place"]) => {
      const [x, y] = [place.at.x * OVERWORLD_TILE, place.at.y * OVERWORLD_TILE];
      // After dark, a warm glow of lit windows under each place still standing.
      if (lit && !ruined.has(place.id)) {
        const glow = ctx.createRadialGradient(x + 8, y + 9, 1, x + 8, y + 9, 13);
        glow.addColorStop(0, "rgba(255, 196, 90, 0.55)");
        glow.addColorStop(1, "rgba(255, 196, 90, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - 6, y - 5, 28, 28);
      }
      if (siteIds.has(place.id)) {
        // A pack's site marker, one of its variants by the place (one per kind of site), else a cave mouth.
        const pick = ([...place.id].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7) % 100) / 100;
        // A sealed site is drawn faded: on the map, but not to be gone to yet.
        ctx.globalAlpha = sealedKey.split(",").includes(place.id) ? 0.45 : 1;
        if (!drawTile(ctx, "site", x, y, pick)) paintSite(ctx, place.at.x, place.at.y);
        ctx.globalAlpha = 1;
        return;
      }
      const tier = settlementTier(place, top);
      // An image pack's marker grows with the place (a city near three times a hamlet's size), standing on its cell's
      // bottom, centred across it, so a city reads as one from afar.
      // A marker drawn at its own size (several cells, the sprite inside at its size on the map: the built-in
      // art) is drawn as it is; a one-cell marker is scaled up to it.
      const id = ruined.has(place.id) ? "ruin" : `marker${tier}`;
      const grow = drawTile.image && !drawTile.sprite(id) ? (MARKER_GROWTH[tier] ?? 1) : 1;
      const box =
        grow > 1
          ? {
              at: [x - ((grow - 1) * OVERWORLD_TILE) / 2, y - (grow - 1) * OVERWORLD_TILE] as const,
              size: { w: grow * OVERWORLD_TILE, h: grow * OVERWORLD_TILE },
            }
          : null;
      if (!(box ? drawTile(ctx, id, box.at[0], box.at[1], 0, box.size) : drawTile(ctx, id, x, y))) {
        paintSettlement(ctx, place.at.x, place.at.y, tier, ruined.has(place.id), lit);
      }
    };
    // Back to front by where each stands: trees (trunk at the bottom) and the places among them.
    const standing: Array<{ base: number; draw: () => void }> = trees.map((tree) => ({
      base: tree.y,
      draw: () =>
        // Each stands on its foot, centred across it (a wood's tree one cell, a range's peak two by two, a
        // chain of peaks three by two); the piece is drawn centred on the cell given.
        drawTile.piece(
          ctx,
          tree.id,
          tree.pick,
          tree.x * OVERWORLD_TILE - OVERWORLD_TILE / 2,
          tree.y * OVERWORLD_TILE - (tree.h * OVERWORLD_TILE * 46) / 48 + ((tree.h - 1) * OVERWORLD_TILE) / 2,
        ),
    }));
    for (const { place } of settlements) standing.push({ base: place.at.y + 1, draw: () => drawPlace(place) });
    standing.sort((a, b) => a.base - b.base);
    for (const each of standing) each.draw();
    return canvas;
  }, [drawTile, lit, resolution, ruined, sealedKey, settlements, siteIds, top, trees, world.height, world.width]);

  // Beyond the world's edge, the ground its edge has most of (the sea around an island, open space).
  const beyond = useMemo(() => {
    const { look, wet: wetLook } = worldBeyond(game, world);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = OVERWORLD_TILE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    // Water beyond the edge, with water edge tiles, is their middle piece, as the water inside the map is.
    if (wetLook && drawTile.edge(ctx, "water", WORLD_EDGE_PIECE_BY_MASK[15]!, OVERWORLD_TILE / 2, OVERWORLD_TILE / 2))
      return canvas;
    if (!drawTile(ctx, look, 0, 0)) paintGround(ctx, look, 0, 0, cellNoise(0, 0));
    return canvas;
  }, [drawTile, game, world]);

  // ── The view: where it looks, kept inside the world ──
  const homeAt = here ? byId.get(here) : undefined;
  const partyRef = useRef<Point | null>(null);
  if (!walkingRef.current) partyRef.current = homeAt ? centre(homeAt) : null;
  /** Which way the party faces: the way it last walked. */
  const facingRef = useRef<CharacterFacing>("down");
  const camera = useCallback(
    (at: Point) => overworldCamera(at, worldSize, size, scale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [worldSize.width, worldSize.height, scale, size],
  );
  const restingCamera = camera(lookAt ?? partyRef.current ?? { x: worldSize.width / 2, y: worldSize.height / 2 });
  const [cameraX, cameraY] = [restingCamera.x, restingCamera.y];

  const draw = useCallback(
    (cam: Point, frame = 1) => {
      const step = frame !== 1;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || size.width === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(size.width * dpr);
      const height = Math.round(size.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, width, height);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, -cam.x * dpr, -cam.y * dpr);
      const pattern = ctx.createPattern(beyond, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(
          Math.floor(cam.x / scale / OVERWORLD_TILE - 1) * OVERWORLD_TILE,
          Math.floor(cam.y / scale / OVERWORLD_TILE - 1) * OVERWORLD_TILE,
          size.width / scale + OVERWORLD_TILE * 3,
          size.height / scale + OVERWORLD_TILE * 3,
        );
        // Dimmed past the map's edge, so where the map ends reads as its border, not a seam in the land.
        ctx.fillStyle = "rgba(5, 6, 10, 0.45)";
        ctx.beginPath();
        ctx.rect(
          Math.floor(cam.x / scale / OVERWORLD_TILE - 1) * OVERWORLD_TILE,
          Math.floor(cam.y / scale / OVERWORLD_TILE - 1) * OVERWORLD_TILE,
          size.width / scale + OVERWORLD_TILE * 3,
          size.height / scale + OVERWORLD_TILE * 3,
        );
        ctx.rect(0, 0, worldSize.width, worldSize.height);
        ctx.fill("evenodd");
      }
      // Smooth only where the base is shown smaller than it was drawn (an image pack's art).
      ctx.imageSmoothingEnabled = drawTile.image && resolution > scale * dpr;
      ctx.drawImage(ground, 0, 0, ground.width / resolution, ground.height / resolution);
      ctx.drawImage(markers, 0, 0, markers.width / resolution, markers.height / resolution);
      ctx.imageSmoothingEnabled = false;
      const party = partyRef.current;
      if (party) {
        const [x, y] = [Math.round(party.x) - 8, Math.round(party.y) - 14 - (step ? 1 : 0)];
        const drawn = drawTile.character(
          ctx,
          "party",
          Math.round(party.x) - 8,
          Math.round(party.y) - 8,
          facingRef.current,
          frame,
        );
        if (!drawn && !drawTile(ctx, "party", x, y)) paintParty(ctx, x + 1, y + 1, step);
      }
      if (darkness > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = `rgba(40, 52, 120, ${Math.min(0.85, darkness * 1.5)})`;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }
      if (layerRef.current) layerRef.current.style.transform = `translate(${-cam.x}px, ${-cam.y}px)`;
    },
    [
      beyond,
      darkness,
      drawTile,
      ground,
      markers,
      resolution,
      scale,
      size.height,
      size.width,
      worldSize.height,
      worldSize.width,
    ],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!walkingRef.current) draw({ x: cameraX, y: cameraY });
  }, [cameraX, cameraY, draw, here]);
  // When the party is somewhere new, the view goes with it.
  useEffect(() => setLookAt(null), [here]);

  // The walk's frames draw with the latest view (the screen may turn mid-walk) and stop with the overworld.
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const cameraOfRef = useRef(camera);
  cameraOfRef.current = camera;
  const frameRef = useRef<number | null>(null);
  const arrivalRef = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      arrivalRef.current?.();
    },
    [],
  );

  /** Shows a settlement: chosen, and in view. */
  const choose = useCallback(
    (id: string | null) => {
      setSelected(id);
      const place = id ? byId.get(id) : undefined;
      if (place) setLookAt(centre(place));
    },
    [byId],
  );

  // ── Dragging the map to look around ──
  const dragRef = useRef<{ x: number; y: number; from: Point; moved: boolean } | null>(null);
  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (walkingRef.current) return;
    const from = lookAt ?? partyRef.current ?? { x: worldSize.width / 2, y: worldSize.height / 2 };
    dragRef.current = { x: event.clientX, y: event.clientY, from, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_PIXELS) return;
    drag.moved = true;
    setLookAt({ x: drag.from.x - dx / scale, y: drag.from.y - dy / scale });
  };
  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    // A press that did not drag is a click on the open map: the card closes.
    if (drag && !drag.moved) setSelected(null);
  };

  // ── Walking ──
  const route = useMemo(
    () => (here && selected && selected !== here ? worldTrip(game, here, selected) : null),
    [game, here, selected],
  );
  const startWalk = useCallback(
    async (to: string) => {
      if (!canWalk || walkingRef.current) return;
      // Under way from the first click, so a second one while the clock is sent starts nothing.
      walkingRef.current = true;
      await flush();
      let result;
      try {
        result = await walkMutation.mutateAsync({ chatId, to });
      } catch (error) {
        walkingRef.current = false;
        toast.error(error instanceof Error && error.message ? error.message : t("game.overworld.walkFailed"));
        return;
      }
      // Along each leg's road where it is laid along the land (generator 8), else straight between places.
      const points: Array<{ x: number; y: number }> = [];
      result.route.path.forEach((id, index) => {
        const place = byId.get(id);
        if (!place) return;
        const before = index > 0 ? result.route.path[index - 1] : undefined;
        const link = before
          ? world.links.find(
              (each) => (each.from === before && each.to === id) || (each.from === id && each.to === before),
            )
          : undefined;
        if (link?.path) {
          const cells = link.from === id ? [...link.path].reverse() : link.path;
          for (const cell of cells.slice(1, -1))
            points.push({
              x: (cell % world.width) * OVERWORLD_TILE + OVERWORLD_TILE / 2,
              y: Math.floor(cell / world.width) * OVERWORLD_TILE + OVERWORLD_TILE / 2,
            });
        }
        points.push(centre(place));
      });
      const lengths = points
        .slice(1)
        .map((point, index) => Math.hypot(point.x - points[index]!.x, point.y - points[index]!.y));
      const total = lengths.reduce((sum, length) => sum + length, 0);
      const duration = Math.min(
        WALK_LONGEST_MS,
        Math.max(WALK_SHORTEST_MS, (total / OVERWORLD_TILE / WALK_CELLS_PER_SECOND) * 1000),
      );
      const fromDay = time?.day ?? 1;
      const fromMinutes = time ? time.hour * 60 + time.minute : 8 * 60;
      walkingRef.current = true;
      setWalking(true);
      setSelected(null);
      setLookAt(null);
      const started = performance.now();
      // The clock as the walk left it, shown once the party arrives (or the overworld closes first).
      arrivalRef.current = () => {
        arrivalRef.current = null;
        const snapshot = useGameStateStore.getState().current;
        if (snapshot?.chatId === chatId) {
          useGameStateStore.getState().setGameState({ ...snapshot, time: result.formatted });
        }
      };
      const frame = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        let along = progress * total;
        let at = points[0]!;
        for (let index = 0; index < lengths.length; index++) {
          const length = lengths[index]!;
          if (along <= length || index === lengths.length - 1) {
            const share = length === 0 ? 1 : Math.min(1, along / length);
            const [a, b] = [points[index]!, points[index + 1]!];
            at = { x: a.x + (b.x - a.x) * share, y: a.y + (b.y - a.y) * share };
            // Facing the way the leg goes, by its larger axis.
            facingRef.current = characterFacing(b.x - a.x, b.y - a.y, facingRef.current);
            break;
          }
          along -= length;
        }
        partyRef.current = at;
        if (walkChipRef.current) {
          const day = fromDay + Math.floor((fromMinutes + result.route.days * 24 * 60 * progress) / (24 * 60));
          walkChipRef.current.textContent = t("game.overworld.walking", { day });
        }
        drawRef.current(cameraOfRef.current(at), characterFrameAt(now));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(frame);
          return;
        }
        frameRef.current = null;
        walkingRef.current = false;
        setWalking(false);
        arrivalRef.current?.();
      };
      frameRef.current = requestAnimationFrame(frame);
    },
    [byId, canWalk, chatId, flush, t, time, walkMutation, world],
  );

  const tripText = (days: number) =>
    days < 1
      ? t("game.overworld.tripHours", { count: Math.max(1, Math.round(days * 24)) })
      : t("game.overworld.tripDays", { count: Math.round(days * 2) / 2 });
  const sizeLabel = (place: WorldPlace) =>
    kit.sizes.find((entry) => entry.id === place.size)?.label ?? place.size ?? "";
  const placeWords = (place: WorldPlace) =>
    siteIds.has(place.id)
      ? t("game.overworld.siteWords")
      : [sizeLabel(place), ...(ruined.has(place.id) ? [t("game.overworld.ruined")] : [])].join(", ");
  const walkedTo = overworld?.walk ? byId.get(overworld.walk.to) : undefined;
  const chosen = selected ? byId.get(selected) : undefined;
  const cell = OVERWORLD_TILE * scale;
  // The card beside its settlement, kept on screen: below it when the settlement is near the top.
  const cardAt = chosen
    ? (() => {
        const x =
          Math.min(Math.max(chosen.at.x * cell + cell / 2 - restingCamera.x, 120), size.width - 120) + restingCamera.x;
        const below = chosen.at.y * cell - restingCamera.y < 180;
        return { left: x, top: below ? chosen.at.y * cell + cell + 18 : chosen.at.y * cell - 6, below };
      })()
    : null;

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-clip bg-black"
        role="region"
        aria-label={t("game.overworld.region")}
        data-component="WorldOverworld"
        data-tiles={drawTile.loading ? "loading" : drawTile.image ? "image" : "drawn"}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none [image-rendering:pixelated]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragRef.current = null)}
        />
        <div
          ref={layerRef}
          className="absolute left-0 top-0"
          style={{ transform: `translate(${-restingCamera.x}px, ${-restingCamera.y}px)` }}
        >
          {settlements.map(({ place }) => {
            const isHere = place.id === here && !walking;
            const tier = siteIds.has(place.id) ? 0 : settlementTier(place, top);
            const words = placeWords(place);
            return (
              <div
                key={place.id}
                className="absolute"
                style={{ left: place.at.x * cell, top: place.at.y * cell, width: cell, height: cell }}
              >
                <button
                  type="button"
                  onClick={() => choose(selected === place.id ? null : place.id)}
                  onFocus={() => setLookAt(centre(place))}
                  className={cn(
                    // The hit area reaches past the cell, so a small village is easy to tap on a phone.
                    "absolute inset-0 rounded-sm outline-none transition-shadow before:absolute before:-inset-2 before:content-[''] hover:ring-2 hover:ring-white/60 focus-visible:ring-2 focus-visible:ring-white",
                    selected === place.id && "ring-2 ring-[var(--primary)]",
                  )}
                  aria-label={
                    isHere
                      ? t("game.overworld.settlementHere", { name: place.name, size: words })
                      : t("game.overworld.settlement", { name: place.name, size: words })
                  }
                  aria-pressed={selected === place.id}
                />
                {(tier >= 2 || isHere || selected === place.id) && (
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap rounded px-1 text-[0.625rem] font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]",
                      isHere && "bg-black/45",
                    )}
                    aria-hidden="true"
                  >
                    {place.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Above the narration: the card, the places and what the walk is doing. Clicks pass between them. */}
      <div className="pointer-events-none absolute inset-0 z-[25] overflow-clip" data-component="WorldOverworld.Chrome">
        {chosen && cardAt && (
          <div
            data-game-section="world-card"
            className={cn(
              GAME_SECTION_CLASS,
              "pointer-events-auto absolute z-10 w-56 -translate-x-1/2 rounded-xl border border-white/15 bg-black/80 p-3 text-xs text-white/85 shadow-xl backdrop-blur-md",
              !cardAt.below && "-translate-y-full",
            )}
            style={{ left: cardAt.left - restingCamera.x, top: cardAt.top - restingCamera.y }}
            data-component="WorldOverworld.Card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{chosen.name}</div>
                <div className="text-white/55">{placeWords(chosen)}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded p-0.5 text-white/50 hover:text-white"
                aria-label={t("game.overworld.close")}
              >
                <X size={12} />
              </button>
            </div>
            {chosen.id === here ? (
              <>
                <div className="mt-2 text-white/60">{t("game.overworld.here")}</div>
                {siteIds.has(chosen.id) ? (
                  <button
                    type="button"
                    disabled={!canWalk || walking || enterMutation.isPending}
                    onClick={() =>
                      enterMutation.mutate(
                        { chatId, place: chosen.id },
                        {
                          onSuccess: () => setSelected(null),
                          onError: (error) =>
                            toast.error(
                              error instanceof Error && error.message ? error.message : t("game.overworld.enterFailed"),
                            ),
                        },
                      )
                    }
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <DoorOpen size={13} />
                    {t("game.overworld.enter", { name: chosen.name })}
                  </button>
                ) : (
                  onEnterTown && (
                    <button
                      type="button"
                      disabled={walking}
                      onClick={onEnterTown}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      <DoorOpen size={13} />
                      {t("game.overworld.enter", { name: chosen.name })}
                    </button>
                  )
                )}
              </>
            ) : sealed(chosen.id) ? (
              <div className="mt-2 text-white/60">{t("game.overworld.sealed")}</div>
            ) : route ? (
              <>
                <div className="mt-2">{tripText(route.days)}</div>
                <div className="text-white/55">
                  {t("game.overworld.tripBy", {
                    ways: [
                      ...new Set(
                        route.legs.map((leg) => kit.travel.find((way) => way.id === leg.way)?.label ?? leg.way),
                      ),
                    ].join(", "),
                  })}
                </div>
                <button
                  type="button"
                  disabled={!canWalk || walking || walkMutation.isPending}
                  onClick={() => void startWalk(chosen.id)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Footprints size={13} />
                  {t("game.overworld.walk")}
                </button>
              </>
            ) : (
              <div className="mt-2 text-white/60">{t("game.overworld.noWay")}</div>
            )}
          </div>
        )}

        {/* The places, nearest first: the same choice as the map, by keyboard or for a place off screen. */}
        <div className="pointer-events-auto absolute right-3 top-14 z-10 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={() => setPlacesOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/65 px-3 py-1.5 text-xs font-semibold text-white/85 shadow-lg backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
            aria-expanded={placesOpen}
          >
            <MapPin size={13} />
            {t("game.overworld.places")}
          </button>
          {placesOpen && (
            <ul
              className="max-h-[45vh] w-60 overflow-y-auto rounded-xl border border-white/15 bg-black/80 p-1 text-xs text-white/85 shadow-xl backdrop-blur-md"
              aria-label={t("game.overworld.places")}
            >
              {settlements.map(({ place, days }) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => {
                      choose(place.id);
                      setPlacesOpen(false);
                    }}
                    className="flex w-full items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10"
                  >
                    <span className="min-w-0 truncate font-medium text-white">{place.name}</span>
                    <span className="shrink-0 text-[0.625rem] text-white/50">
                      {place.id === here ? t("game.overworld.youAreHere") : Number.isFinite(days) ? tripText(days) : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {walking && (
          <div className="pointer-events-none absolute left-1/2 top-16 max-sm:top-28 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <span ref={walkChipRef} />
          </div>
        )}
        {!walking && walkedTo && (
          <div
            className="pointer-events-none absolute left-1/2 top-16 max-sm:top-28 z-10 max-w-[60%] -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-center text-xs text-white/85 shadow-lg"
            role="status"
          >
            {t("game.overworld.walked", { name: walkedTo.name })}
          </div>
        )}
      </div>
    </>
  );
}
