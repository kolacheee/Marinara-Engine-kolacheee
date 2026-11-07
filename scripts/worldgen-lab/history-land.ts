/**
 * History lab: how well a world's history follows its land. Not a regression; run with
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/history-land.ts [version...] [--sample]
 *   siteAge   rank correlation of a settlement's founding age with its site (water, harbour, ford, soil)
 *   sizeAge   the same with its size now
 *   reasons   share of grown towns whose growth names what they grew on
 *   lostCause share of quietly lost places whose end names a cause
 *   warStake  share of wars that name what they were fought for
 *   woes, spread, floods  disasters per world, plagues carried on along roads, river floods
 */
import {
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldHistory,
  worldPlaceAssets,
  worldSiteAge,
  worldTerrainEntries,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const args = process.argv.slice(2);
const sample = args.includes("--sample");
const versions = args.filter((a) => !a.startsWith("--")).map(Number);
const spearman = (xs: number[], ys: number[]) => {
  const rank = (v: number[]) => {
    const order = v.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
    const r = new Array<number>(v.length);
    order.forEach(([, i], k) => (r[i] = k));
    return r;
  };
  const [a, b] = [rank(xs), rank(ys)];
  const n = xs.length;
  const mean = (n - 1) / 2;
  let [num, da, db] = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    num += (a[i]! - mean) * (b[i]! - mean);
    da += (a[i]! - mean) ** 2;
    db += (b[i]! - mean) ** 2;
  }
  return num / Math.sqrt(da * db || 1);
};
for (const version of versions) {
  const sums: Record<string, number[]> = {};
  for (const input of WORLD_STARTER_KITS) {
    const parsed = parseWorldKit(input);
    if (!parsed.ok || parsed.kit.scale === "sector") continue;
    for (const scale of ["region", "realm"] as const) {
      for (const seed of [11, 4242, 777, 20261002, 31]) {
        const kit = { ...parsed.kit, scale };
        const checked = checkWorldBrief(kit, {
          briefVersion: 1,
          premise: "x",
          places: ["Ashby", "Wending", "Calder"].map((name) => ({
            name,
            layer: kit.layers.find((layer) => layer.settlements)!.id,
            tags: [],
          })),
          groups: [
            { name: "House Ash", kind: kit.groupKinds[0]!.id, seat: "Ashby", rivals: ["House Wend"] },
            { name: "House Wend", kind: kit.groupKinds[0]!.id, seat: "Wending", rivals: ["House Cald"] },
            { name: "House Cald", kind: kit.groupKinds[0]!.id, seat: "Calder", rivals: ["House Ash"] },
          ],
          placeNames: [
            {
              culture: kit.cultures[0]!.id,
              names: [
                "Ashby",
                "Wending",
                "Calder",
                "Ravel",
                "Brennock",
                "Sallow",
                "Dunmere",
                "Orrin",
                "Tamsk",
                "Vell",
                "Corrow",
                "Haddon",
              ],
            },
          ],
        });
        if (!checked.ok) throw new Error("brief");
        const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief, generatorVersion: version };
        const game: GameWorld = { ...inputs, world: compileGameWorld(inputs) };
        const history = worldHistory(game);
        const water = new Set(
          game.world.terrain.flatMap((id, i) =>
            worldTerrainEntries(kit).find((e) => e.id === id)?.kind === "water" ? [i] : [],
          ),
        );
        const assets = worldPlaceAssets(game.world, water);
        const towns = game.world.places.filter((p) => p.rank !== undefined);
        const age = towns.map(
          (p) =>
            history.events.find((e) => e.kind === "founding" && e.places[0] === p.id && /was founded,/.test(e.text))
              ?.yearsAgo ?? 0,
        );
        (sums.siteAge ??= []).push(
          spearman(
            towns.map((p) => worldSiteAge(assets.get(p.id)!)),
            age,
          ),
        );
        (sums.sizeAge ??= []).push(
          spearman(
            towns.map((p) => p.rank!),
            age,
          ),
        );
        const grew = history.events.filter((e) => / grew into /.test(e.text));
        const last = grew.filter((e) => / (on|when|as) /.test(e.text.split(" grew into ")[1] ?? ""));
        if (grew.length) (sums.reasons ??= []).push(last.length / towns.filter((p) => p.rank! > 0).length);
        const quiet = history.events.filter((e) => / was abandoned/.test(e.text));
        if (quiet.length)
          (sums.lostCause ??= []).push(
            quiet.filter((e) => /mine|harbour|flooded|road passed/.test(e.text)).length / quiet.length,
          );
        const wars = history.events.filter((e) => / went to war/.test(e.text));
        if (wars.length) (sums.warStake ??= []).push(wars.filter((e) => / for /.test(e.text)).length / wars.length);
        const woes = history.events.filter((e) => e.kind === "catastrophe" && e.severe);
        (sums.woes ??= []).push(woes.length);
        (sums.spread ??= []).push(woes.filter((e) => /spread from/.test(e.text)).length);
        (sums.floods ??= []).push(woes.filter((e) => /flooded/.test(e.text)).length);
        if (sample && seed === 4242 && scale === "realm" && kit.id === "high_fantasy") {
          console.log(
            history.events
              .filter((e) => e.severe)
              .map((e) => `${e.yearsAgo}: ${e.text}`)
              .join("\n"),
          );
          console.log(`--- ${kit.id} ${scale} ${seed} v${version}`);
          for (const e of history.events.filter((e) => !e.brewing).slice(0, 40))
            console.log(`${e.yearsAgo}: ${e.text}`);
        }
      }
    }
  }
  const mean = (xs: number[] = []) => (xs.length ? (xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(3) : "-");
  console.log(
    `generator ${version}: ` +
      Object.entries(sums)
        .map(([k, v]) => `${k} ${mean(v)}`)
        .join("  "),
  );
}
