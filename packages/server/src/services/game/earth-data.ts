// ──────────────────────────────────────────────
// The Earth seed's data (worldgen): the baked Earth grid, features and fine coast
// (scripts/earth/bake-earth.py) and the dated past (scripts/earth/bake-earth-history.py), read once when an
// Earth world is first asked for and kept. Natural Earth (public domain), the Terrarium elevation tiles,
// Reba, Reitsma and Seto's cities and Seshat's Cliopatria (CC BY 4.0); see assets/earth/SOURCES.md.
// ──────────────────────────────────────────────
import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { gunzipSync, inflateSync } from "zlib";
import type { WorldEarthData } from "@marinara-engine/shared";

const EARTH_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../assets/earth");

let loading: Promise<WorldEarthData> | null = null;

export function loadWorldEarthData(): Promise<WorldEarthData> {
  loading ??= (async () => {
    const [grid, features, coast, history, polities] = await Promise.all([
      readFile(resolve(EARTH_DIR, "earth-grid.bin")),
      readFile(resolve(EARTH_DIR, "earth-features.json.gz")),
      readFile(resolve(EARTH_DIR, "earth-coast.bin")),
      readFile(resolve(EARTH_DIR, "earth-history.json.gz")),
      readFile(resolve(EARTH_DIR, "earth-polities.bin")),
    ]);
    // The realms: a gzip JSON header behind its length, then each realm's land mask (zlib), inflated
    // only when a point is asked of it.
    const length = polities.readUInt32LE(0);
    const header = JSON.parse(gunzipSync(polities.subarray(4, 4 + length)).toString("utf8"));
    return {
      grid: { width: 3600, height: 1800, planes: new Uint8Array(gunzipSync(grid)) },
      features: JSON.parse(gunzipSync(features).toString("utf8")),
      coast: { width: 18000, height: 9000, bits: new Uint8Array(gunzipSync(coast)) },
      history: {
        ...JSON.parse(gunzipSync(history).toString("utf8")),
        polities: {
          ...header,
          masks: new Uint8Array(polities.subarray(4 + length)),
          inflate: (bytes: Uint8Array) => new Uint8Array(inflateSync(bytes)),
        },
      },
    };
  })().catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
