// Pixelforge build: concatenate src/*.js (filename order) into one self-contained
// ES module, syntax-check it, and emit dist/pixelforge/<version>/ with a complete
// manifest (files[] hashes + builtAgainst) ready for local install or packaging.
// No dependencies — plain node.
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildArt } from "./build-art.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");

const template = JSON.parse(readFileSync(join(here, "manifest.template.json"), "utf8"));

const srcDir = join(here, "src");
const parts = readdirSync(srcDir)
  .filter((f) => f.endsWith(".js"))
  .sort();
if (parts.length === 0) throw new Error("no src files");

const banner = `// Pixelforge ${template.version} — Marinara Engine game-surface Experience (single-file client bundle)\n// Built from experiences/pixelforge/src (${parts.length} modules). Do not edit; edit src/ and rebuild.\n`;
const body = parts.map((f) => `// ===== ${f} =====\n${readFileSync(join(srcDir, f), "utf8")}`).join("\n");
const bundle = `${banner}(() => {\n"use strict";\n${body}\n})();\n`;

// Syntax check before emitting anything.
const tmp = join(here, ".bundle-check.mjs");
writeFileSync(tmp, bundle);
try {
  execSync(`node --check "${tmp}"`, { stdio: "inherit" });
} finally {
  rmSync(tmp, { force: true });
}

// builtAgainst: the engine tree this was built in.
const enginePkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
let engineCommit = "0".repeat(40);
try {
  engineCommit = execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();
} catch {
  console.warn("git rev-parse failed; using a zero commit hash");
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const clientBuf = Buffer.from(bundle, "utf8");

// Tier-1 authored art (deterministic PNGs + atlas/sprite metadata), shipped as
// package assets via contributions.assets (Capability API 1.10, engine #5091).
const art = buildArt();

const outDir = join(here, "dist", "pixelforge", template.version);
rmSync(join(here, "dist"), { recursive: true, force: true });
mkdirSync(join(outDir, "sprites"), { recursive: true });
writeFileSync(join(outDir, "client.js"), clientBuf);
const files = [{ path: "client.js", sha256: sha256(clientBuf), bytes: clientBuf.length }];
for (const assetPath of art.files) {
  const source = join(art.dir, assetPath);
  const data = readFileSync(source);
  copyFileSync(source, join(outDir, assetPath));
  files.push({ path: assetPath, sha256: sha256(data), bytes: data.length });
}

const manifest = {
  ...template,
  // contributions.assets requires capabilityApi ≥ 1.10 (schema gate).
  capabilityApi: { major: 1, minor: 10 },
  builtAgainst: { engineVersion: enginePkg.version, engineCommit },
  contributions: {
    ...template.contributions,
    assets: { paths: art.files },
  },
  files,
};
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

const totalAssetBytes = files.slice(1).reduce((a, f) => a + f.bytes, 0);
console.log(`built pixelforge ${template.version}`);
console.log(`  client.js  ${clientBuf.length} bytes  sha256 ${files[0].sha256.slice(0, 12)}…`);
console.log(`  assets     ${art.files.length} files, ${totalAssetBytes} bytes`);
console.log(`  builtAgainst ${enginePkg.version} @ ${engineCommit.slice(0, 9)}`);
console.log(`  out: ${outDir}`);
