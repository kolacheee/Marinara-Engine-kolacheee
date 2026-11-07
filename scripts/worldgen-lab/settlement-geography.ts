/**
 * Settlement geography lab: measures how realistic a compiled world's settlement placement is, so a
 * generator change can be shown to help (or not). Not a regression; run with
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/settlement-geography.ts [version...]
 * Metrics (higher is more realistic unless noted):
 *   waterside   settlements with water within 1 cell (real towns cluster on coasts, lakes and rivers)
 *   poorGround  settlements on marsh, desert, snow, waste (lower is better)
 *   bigWater    waterside share among the two top ranks (the biggest towns should hold the best sites)
 *   smallWater  waterside share among the bottom rank
 *   tagMiss     situation tags that do not fit the ground: a port with no water, a mine with no hills (lower)
 *   R           Clark-Evans nearest-neighbour ratio over all settlements (1 random, >1 regular like central places)
 *   Rtop        the same over the top two ranks only
 *   barrierWay  links whose straight line crosses mountains (lower)
 *   wetside     settlements with water or a river within 1 cell (generator 7 rivers count)
 *   resource    settlements with a resource (generator 7) within 2 cells
 *   riverEnd    rivers that end in water, another river or the map's edge (must be 1)
 *   riverCells  share of the land that is river
 *   detour      a road's length over its straight line (generator 8 lays them along the land; ~1.1-1.4 real)
 *   roadPeak    share of road cells on mountains (lower: roads go round or through passes)
 *   trunk       share of road cells that two or more roads share (roads joining into trunks)
 *   crossings   river crossings per road
 */
import {
  WORLD_STARTER_KITS,
  compileWorld,
  parseWorldKit,
  type CompiledWorld,
  type WorldKit,
} from "../../packages/shared/src/index.js";

const kits = WORLD_STARTER_KITS.map((input) => {
  const parsed = parseWorldKit(input);
  if (!parsed.ok) throw new Error("kit");
  return parsed.kit;
});

const POOR = /marsh|swamp|bog|\bfen|wetland|desert|dune|snow|tundra|\bice\b|toxic|waste|blight|dead|crater/;
const FOREST = /forest|wood|grove|bamboo|jungle|taiga|conifer/;
const HILLY = /hill|highland|moor|upland|mountain|asteroid/;
const FERTILE = /grass|plain|prairie|farm|field|padd|rice|meadow|steppe|suburb/;
const TAG_NEEDS: Array<[RegExp, (n: Need) => boolean]> = [
  [/^(port|harbor|dockyard|beach)$/, (n) => n.water1],
  [/^(river_port|ferry)$/, (n) => n.water1 || n.river1],
  [/^(mine|sacred_mountain|border_pass|mining)$/, (n) => n.barrier2 || n.hilly2],
  [/^(forest_edge|bamboo_forest|woods_at_the_edge_of_town)$/, (n) => n.forest1],
  [/^(farmland|farm|agriculture)$/, (n) => n.fertile1],
];
interface Need {
  water1: boolean;
  river1: boolean;
  barrier2: boolean;
  hilly2: boolean;
  forest1: boolean;
  fertile1: boolean;
}

function measure(world: CompiledWorld, kit: WorldKit) {
  const terrain = kit.terrain ?? [];
  const kinds = Array.from(world.ground, (c) => parseInt(c, 36));
  const { width, height } = world;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? -1 : kinds[y * width + x]!);
  const near = (x: number, y: number, r: number, test: (t: { id: string; kind: string }) => boolean) => {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const k = at(x + dx, y + dy);
        if (k >= 0 && test(terrain[k]!)) return true;
      }
    return false;
  };
  const depth = kit.layers.findIndex((l) => l.settlements);
  const settlements = world.places.filter((p) => p.depth === depth && p.rank !== undefined);
  const hasWater = terrain.some((t) => t.kind === "water");
  const water1 = (p: (typeof settlements)[number]) => near(p.at.x, p.at.y, 1, (t) => t.kind === "water");
  const maxRank = Math.max(...settlements.map((s) => s.rank!));
  const big = settlements.filter((s) => s.rank! >= maxRank - 1);
  const small = settlements.filter((s) => s.rank === 0);
  const riverCells = new Set((world.rivers ?? []).flatMap((r) => r.path));
  const riverNear = (p: (typeof settlements)[number]) => {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) if (riverCells.has((p.at.y + dy) * width + p.at.x + dx)) return true;
    return false;
  };
  let tags = 0;
  let miss = 0;
  for (const p of settlements) {
    const need: Need = {
      water1: water1(p),
      river1: riverNear(p),
      barrier2: near(p.at.x, p.at.y, 2, (t) => t.kind === "barrier"),
      hilly2: near(p.at.x, p.at.y, 2, (t) => HILLY.test(t.id)),
      forest1: near(p.at.x, p.at.y, 1, (t) => FOREST.test(t.id)),
      // Workable ground: fields, or open ground that is neither wood nor waste.
      fertile1: near(
        p.at.x,
        p.at.y,
        1,
        (t) => FERTILE.test(t.id) || (t.kind === "open" && !FOREST.test(t.id) && !POOR.test(t.id)),
      ),
    };
    for (const tag of p.tags) {
      const rule = TAG_NEEDS.find(([words]) => words.test(tag));
      if (!rule) continue;
      tags++;
      if (!rule[1](need)) miss++;
    }
  }
  const openCells = kinds.filter((k) => terrain[k]?.kind === "open").length || width * height;
  const clark = (group: typeof settlements) => {
    if (group.length < 3) return NaN;
    const nn = group.map((a) =>
      Math.min(...group.filter((b) => b !== a).map((b) => Math.hypot(a.at.x - b.at.x, a.at.y - b.at.y))),
    );
    const mean = nn.reduce((s, d) => s + d, 0) / nn.length;
    return mean / (0.5 * Math.sqrt(openCells / group.length));
  };
  const byId = new Map(world.places.map((p) => [p.id, p]));
  let barrierWays = 0;
  for (const link of world.links) {
    const a = byId.get(link.from)!;
    const b = byId.get(link.to)!;
    const steps = Math.max(1, Math.ceil(Math.hypot(a.at.x - b.at.x, a.at.y - b.at.y)));
    for (let s = 0; s <= steps; s++) {
      const k = at(
        Math.round(a.at.x + ((b.at.x - a.at.x) * s) / steps),
        Math.round(a.at.y + ((b.at.y - a.at.y) * s) / steps),
      );
      if (terrain[k]?.kind === "barrier") {
        barrierWays++;
        break;
      }
    }
  }
  const share = (group: typeof settlements, test: (p: (typeof settlements)[number]) => boolean) =>
    group.length ? group.filter(test).length / group.length : NaN;
  const resourceNear = (p: (typeof settlements)[number]) =>
    (world.resources ?? []).some(
      (r) => r.kind !== "ford" && Math.max(Math.abs(r.at.x - p.at.x), Math.abs(r.at.y - p.at.y)) <= 2,
    );
  const rivers = world.rivers ?? [];
  const ends = rivers.filter((r) => {
    const last = r.path[r.path.length - 1]!;
    const [x, y] = [last % width, Math.floor(last / width)];
    return (
      terrain[kinds[last]!]?.kind === "water" ||
      x === 0 ||
      y === 0 ||
      x === width - 1 ||
      y === height - 1 ||
      rivers.some((o) => o !== r && o.path.slice(0, -1).includes(last))
    );
  }).length;
  const landCells = kinds.filter((k) => terrain[k]?.kind !== "water").length;
  const routed = world.links.filter((link) => link.path);
  const roadUse = new Map<number, number>();
  for (const link of routed) for (const cell of link.path!) roadUse.set(cell, (roadUse.get(cell) ?? 0) + 1);
  const detours = routed.map((link) => {
    const a = byId.get(link.from)!;
    const b = byId.get(link.to)!;
    let length = 0;
    for (let i = 1; i < link.path!.length; i++) {
      const [p, q] = [link.path![i - 1]!, link.path![i]!];
      length += p % width !== q % width && Math.floor(p / width) !== Math.floor(q / width) ? Math.SQRT2 : 1;
    }
    return length / Math.max(1, Math.hypot(a.at.x - b.at.x, a.at.y - b.at.y));
  });
  const crossings = routed.map((link) => {
    let n = 0;
    let on = false;
    for (const cell of link.path!) {
      const river = riverCells.has(cell) && terrain[kinds[cell]!]?.kind !== "water";
      if (river && !on) n++;
      on = river;
    }
    return n;
  });
  return {
    detour: routed.length ? detours.reduce((s, d) => s + d, 0) / detours.length : NaN,
    roadPeak: roadUse.size
      ? [...roadUse.keys()].filter((c) => terrain[kinds[c]!]?.kind === "barrier").length / roadUse.size
      : NaN,
    trunk: roadUse.size ? [...roadUse.values()].filter((n) => n >= 2).length / roadUse.size : NaN,
    crossings: routed.length ? crossings.reduce((s, d) => s + d, 0) / routed.length : NaN,
    wetside: share(settlements, (p) => water1(p) || riverNear(p)),
    resource: world.resources ? share(settlements, resourceNear) : NaN,
    riverEnd: rivers.length ? ends / rivers.length : NaN,
    riverCells: world.rivers
      ? [...riverCells].filter((c) => terrain[kinds[c]!]?.kind !== "water").length / landCells
      : NaN,
    waterside: hasWater ? share(settlements, water1) : NaN,
    poorGround: share(settlements, (p) => POOR.test(terrain[at(p.at.x, p.at.y)]?.id ?? "")),
    bigWater: hasWater ? share(big, water1) : NaN,
    smallWater: hasWater ? share(small, water1) : NaN,
    tagMiss: tags ? miss / tags : NaN,
    R: clark(settlements),
    Rtop: clark(big),
    barrierWay: world.links.length ? barrierWays / world.links.length : NaN,
  };
}

const versions = process.argv.slice(2).map(Number);
if (!versions.length) versions.push(3);
const SCALES = ["region", "realm", "world"] as const;
const SEEDS = Array.from({ length: 20 }, (_, i) => 1000 + i * 7919);
for (const version of versions) {
  const sums: Record<string, number[]> = {};
  const perKit: Record<string, Record<string, number[]>> = {};
  for (const kit of kits) {
    for (const scale of SCALES) {
      for (const seed of SEEDS) {
        const scaled = { ...kit, scale };
        const m = measure(compileWorld({ seed, kit: scaled, generatorVersion: version }), scaled);
        for (const [key, value] of Object.entries(m)) {
          if (Number.isNaN(value)) continue;
          (sums[key] ??= []).push(value);
          ((perKit[kit.id] ??= {})[key] ??= []).push(value);
        }
      }
    }
  }
  const mean = (xs: number[] = []) => (xs.length ? (xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(3) : "  -  ");
  const keys = Object.keys(sums);
  console.log(`\ngenerator ${version}  (${kits.length} kits x ${SCALES.length} scales x ${SEEDS.length} seeds)`);
  console.log(["kit".padEnd(22), ...keys.map((k) => k.padStart(10))].join(""));
  for (const [id, values] of Object.entries(perKit))
    console.log([id.padEnd(22), ...keys.map((k) => mean(values[k]).padStart(10))].join(""));
  console.log(["ALL".padEnd(22), ...keys.map((k) => mean(sums[k]).padStart(10))].join(""));
}
