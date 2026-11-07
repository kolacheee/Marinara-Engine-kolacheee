// ──────────────────────────────────────────────
// The Earth seed's data (worldgen): the baked Earth grid, features and fine coast
// (scripts/earth/bake-earth.py), read once when an Earth world is first asked for and kept. Natural Earth
// (public domain) and the Terrarium elevation tiles; see assets/earth/SOURCES.md.
// ──────────────────────────────────────────────
import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { gunzipSync } from "zlib";
import type { WorldEarthData } from "@marinara-engine/shared";

const EARTH_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../assets/earth");

let loading: Promise<WorldEarthData> | null = null;

export function loadWorldEarthData(): Promise<WorldEarthData> {
  loading ??= (async () => {
    const [grid, features, coast] = await Promise.all([
      readFile(resolve(EARTH_DIR, "earth-grid.bin")),
      readFile(resolve(EARTH_DIR, "earth-features.json.gz")),
      readFile(resolve(EARTH_DIR, "earth-coast.bin")),
    ]);
    return {
      grid: { width: 3600, height: 1800, planes: new Uint8Array(gunzipSync(grid)) },
      features: JSON.parse(gunzipSync(features).toString("utf8")),
      coast: { width: 18000, height: 9000, bits: new Uint8Array(gunzipSync(coast)) },
    };
  })().catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
