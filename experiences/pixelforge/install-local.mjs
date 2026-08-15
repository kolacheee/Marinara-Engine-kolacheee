// Dev-only local install: copies the built package into a Marinara data dir and
// registers it in capability-packages/installed.json (with a .bak backup).
// This bypasses the catalog install path — for development only; releases ship
// through the pinned Marinara-Agents catalog. Client-only package → no server
// restart needed; reload the app tab afterwards.
//
// Usage: node install-local.mjs [--data-dir <path>]   (default: ../../packages/server/data)
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const dataDirArg = argv.includes("--data-dir") ? argv[argv.indexOf("--data-dir") + 1] : null;
const dataDir = resolve(here, dataDirArg ?? join("..", "..", "packages", "server", "data"));

const template = JSON.parse(readFileSync(join(here, "manifest.template.json"), "utf8"));
const distDir = join(here, "dist", "pixelforge", template.version);
if (!existsSync(join(distDir, "manifest.json"))) {
  console.error("dist not found — run `node build.mjs` first");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(join(distDir, "manifest.json"), "utf8"));

const pkgRoot = join(dataDir, "capability-packages");
const versionDir = join(pkgRoot, "versions", manifest.id, manifest.version);
rmSync(versionDir, { recursive: true, force: true });
mkdirSync(versionDir, { recursive: true });
copyFileSync(join(distDir, "manifest.json"), join(versionDir, "manifest.json"));
copyFileSync(join(distDir, "client.js"), join(versionDir, "client.js"));
// Every manifest-declared file must land next to the client (assets etc.).
for (const file of manifest.files ?? []) {
  if (file.path === "client.js") continue;
  const target = join(versionDir, file.path);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(distDir, file.path), target);
}

const registryPath = join(pkgRoot, "installed.json");
let registry = { schemaVersion: 1, packages: [] };
if (existsSync(registryPath)) {
  copyFileSync(registryPath, `${registryPath}.bak`);
  registry = JSON.parse(readFileSync(registryPath, "utf8"));
}
registry.packages = (registry.packages ?? []).filter((p) => p.id !== manifest.id);
registry.packages.push({
  id: manifest.id,
  version: manifest.version,
  manifest,
  installedAt: new Date().toISOString(),
  status: "active",
  error: null,
  readiness: "ready", // no server entrypoint
  readinessError: null,
  legacy: false,
});
// Atomic write (temp + rename), mirroring the engine's own writeRegistry. Note:
// if the server installs/uninstalls a package at the same moment, its own
// registry write can still clobber this one — prefer running while idle.
const tmpPath = `${registryPath}.tmp-install-local`;
writeFileSync(tmpPath, JSON.stringify(registry, null, 2));
renameSync(tmpPath, registryPath);

console.log(`installed pixelforge ${manifest.version} → ${versionDir}`);
console.log(`registry updated: ${registryPath} (backup: installed.json.bak)`);
console.log("no server restart needed (client-only) — reload the Marinara tab and open New Game → Experiences.");
console.log("tip: avoid installing/uninstalling other packages in the app at the same moment.");
