// ──────────────────────────────────────────────
// History on the land (world generator 9): what each settlement has going for it, read off the rivers,
// resources and roads the world compile laid (generators 7 and 8), so its history can follow from them.
// People settle the best sites first (a river mouth, a harbour, a ford, a fertile valley), towns grow on
// what passes through them, and places fail for a reason: a harbour silts, a mine runs out, the road moves.
// ──────────────────────────────────────────────
import type { CompiledWorld, WorldPlace } from "./compile.js";
import type { WorldResourceKind } from "./land.js";

/** What a settlement has going for it. */
export interface WorldPlaceAssets {
  /** The sea or a lake beside it. */
  coast: boolean;
  /** The biggest river beside it (0 none, 1 a stream to 5 a great river). */
  river: number;
  /** The resources within two cells (fords where its roads cross a river among them). */
  resources: WorldResourceKind[];
  /** How many ways lead out of it, and how many of its road cells other roads share (a trunk road). */
  ways: number;
  trunk: number;
}

const near = (a: { x: number; y: number }, b: { x: number; y: number }, reach: number) =>
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) <= reach;

/** Every settlement's assets, by place id. `water` says which ground indexes are water. */
export function worldPlaceAssets(world: CompiledWorld, water: ReadonlySet<number>): Map<string, WorldPlaceAssets> {
  const { width, height } = world;
  const riverWidth = new Map<number, number>();
  for (const river of world.rivers ?? [])
    river.path.forEach((cell, index) =>
      riverWidth.set(cell, Math.max(riverWidth.get(cell) ?? 0, river.width[index] ?? 1)),
    );
  const roadUse = new Map<number, number>();
  for (const link of world.links) for (const cell of link.path ?? []) roadUse.set(cell, (roadUse.get(cell) ?? 0) + 1);
  const out = new Map<string, WorldPlaceAssets>();
  for (const place of world.places) {
    if (place.rank === undefined) continue;
    let coast = false;
    let river = 0;
    let trunk = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [x, y] = [place.at.x + dx, place.at.y + dy];
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const cell = y * width + x;
        if (water.has(parseInt(world.ground[cell]!, 36))) coast = true;
        else river = Math.max(river, riverWidth.get(cell) ?? 0);
        if ((roadUse.get(cell) ?? 0) >= 2) trunk++;
      }
    out.set(place.id, {
      coast,
      river,
      resources: [
        ...new Set((world.resources ?? []).filter((each) => near(each.at, place.at, 2)).map((each) => each.kind)),
      ],
      ways: world.links.filter((link) => link.from === place.id || link.to === place.id).length,
      trunk,
    });
  }
  return out;
}

/** How good a settlement's site is to settle first: water to drink and trade on, a harbour, a ford, rich
 *  soil, fish. Ore and passes are found later and draw later towns (a boom), so they count for little. */
export function worldSiteAge(assets: WorldPlaceAssets): number {
  const has = (kind: WorldResourceKind) => assets.resources.includes(kind);
  return (
    (assets.coast ? 1.2 : 0) +
    Math.min(3, assets.river) * 0.45 +
    (has("harbor") ? 1 : 0) +
    (has("fertile") ? 0.9 : 0) +
    (has("ford") ? 0.5 : 0) +
    (has("fish") ? 0.4 : 0) +
    (has("salt") ? 0.4 : 0) +
    (has("falls") ? 0.2 : 0)
  );
}

/** What a settlement grew on, in words that end "grew into a town ...": its strongest asset. */
export function worldGrowthReason(place: WorldPlace, assets: WorldPlaceAssets | undefined): string {
  if (!assets) return "";
  const has = (kind: WorldResourceKind) => assets.resources.includes(kind);
  if (has("harbor") && assets.coast) return " on the trade through its harbour";
  if (has("ore")) return " when ore was found in the hills";
  if (assets.trunk >= 3 || assets.ways >= 4) return " as the roads through it grew busy";
  if (has("pass")) return " on the traffic over the pass";
  if (has("salt")) return " on the salt trade";
  if (has("ford")) return " as its crossing of the river grew busy";
  if (assets.river >= 3) return " on the boats along its river";
  if (has("falls")) return " on its mills at the falls";
  if (has("fertile")) return " on the harvests of its river fields";
  if (has("fish")) return " on its fishing";
  if (has("timber")) return " on its timber";
  return place.rank !== undefined && assets.coast ? " on its trade by water" : "";
}

/** Whether a settlement is a boom town: founded late for what it found (ore, a pass), not for its site. */
export function worldBoomTown(assets: WorldPlaceAssets | undefined): boolean {
  return Boolean(assets && (assets.resources.includes("ore") || assets.resources.includes("pass")) && !assets.coast);
}

/** Why a lost place was abandoned when no war or disaster ended it, by where it stood. */
export function worldLostCause(
  lost: { at: { x: number; y: number } },
  world: CompiledWorld,
  water: ReadonlySet<number>,
  nearName: string,
): string {
  const { width } = world;
  const around = (test: (cell: number) => boolean) => {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [x, y] = [lost.at.x + dx, lost.at.y + dy];
        if (x < 0 || y < 0 || x >= width || y >= world.height) continue;
        if (test(y * width + x)) return true;
      }
    return false;
  };
  const resources = (world.resources ?? []).filter((each) => near(each.at, lost.at, 2)).map((each) => each.kind);
  if (resources.includes("ore")) return `its mine ran out and its people moved to ${nearName}`;
  if (around((cell) => water.has(parseInt(world.ground[cell]!, 36))))
    return `its harbour silted up and its trade went to ${nearName}`;
  const riverCells = new Set((world.rivers ?? []).flatMap((river) => river.path));
  if (around((cell) => riverCells.has(cell)))
    return `the river flooded it once too often, and its people moved to ${nearName}`;
  const roadCells = new Set(world.links.flatMap((link) => link.path ?? []));
  if (!around((cell) => roadCells.has(cell))) return `the road passed it by, and its people moved to ${nearName}`;
  return `its people moved to ${nearName}`;
}

/** Where a lost place stood (generator 9): a cell of open land two or three cells from the settlement it
 *  was near, not on another place, a road or the water, picked by the stream. */
export function worldLostSite(
  world: CompiledWorld,
  near: WorldPlace,
  taken: ReadonlySet<number>,
  blocked: (cell: number) => boolean,
  random: () => number,
): { x: number; y: number } {
  const { width, height } = world;
  const options: number[] = [];
  for (let dy = -3; dy <= 3; dy++)
    for (let dx = -3; dx <= 3; dx++) {
      const ring = Math.max(Math.abs(dx), Math.abs(dy));
      const [x, y] = [near.at.x + dx, near.at.y + dy];
      if (ring < 2 || x < 1 || y < 1 || x >= width - 1 || y >= height - 1) continue;
      const cell = y * width + x;
      if (!taken.has(cell) && !blocked(cell)) options.push(cell);
    }
  if (!options.length) return { x: Math.min(width - 1, near.at.x + 1), y: near.at.y };
  const cell = options[Math.floor(random() * options.length)]!;
  return { x: cell % width, y: Math.floor(cell / width) };
}

/** What a war over a settlement is fought for, and how much it is worth fighting for: a pass, ore, a
 *  harbour, a ford, salt, rich land, the roads through it. */
export function worldWarStake(
  place: WorldPlace,
  assets: WorldPlaceAssets | undefined,
): { value: number; phrase: string } {
  if (!assets) return { value: 0, phrase: `over ${place.name}` };
  const has = (kind: WorldResourceKind) => assets.resources.includes(kind);
  const stakes: Array<[boolean, number, string]> = [
    [has("pass"), 2, `for the pass at ${place.name}`],
    [has("ore"), 1.8, `for the mines of ${place.name}`],
    [has("harbor") && assets.coast, 1.7, `for ${place.name} and its harbour`],
    [has("ford"), 1.4, `for the river crossing at ${place.name}`],
    [has("salt"), 1.3, `for the salt of ${place.name}`],
    [has("fertile"), 1.1, `for the rich river land around ${place.name}`],
    [assets.ways >= 4 || assets.trunk >= 3, 1, `for ${place.name}, where the roads meet`],
  ];
  const best = stakes.find(([on]) => on);
  return best
    ? { value: best[1] + (place.rank ?? 0) * 0.3, phrase: best[2] }
    : { value: (place.rank ?? 0) * 0.3, phrase: `over ${place.name}` };
}

/** How likely a settlement is to suffer each kind of disaster, by where it is: a dry spell where the land
 *  is dry and no river runs, sickness where people and trade crowd in (ports, crossroads, the bigger
 *  towns), a flood on a big river. */
export function worldWoeOdds(
  place: WorldPlace,
  assets: WorldPlaceAssets | undefined,
  dryGround: boolean,
): { drought: number; sickness: number; flood: number } {
  if (!assets) return { drought: 1, sickness: 1, flood: 0 };
  return {
    drought: (dryGround ? 3 : 1) * (assets.river >= 2 ? 0.3 : 1) * (assets.coast ? 0.7 : 1),
    sickness: 1 + (assets.coast ? 1 : 0) + (assets.ways >= 3 ? 1 : 0) + (place.rank ?? 0) * 0.5,
    flood: assets.river >= 3 ? assets.river - 1.5 : 0,
  };
}
