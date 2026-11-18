/**
 * The decision models Marinara can install and run itself.
 *
 * Open-Jev is the first downloadable decision model, not the only one there will ever
 * be, so this is a catalog rather than an Open-Jev feature: adding a model later is an
 * entry here plus, at most, one new runtime kind. Nothing outside the runtime adapter
 * for a kind should name a specific model.
 *
 * Every size and limit below was measured on real hardware rather than derived from a
 * parameter count. The comments say where each number came from, because a preflight
 * that turns a guess into a verdict is worse than no preflight.
 */
import type { DecisionCalibration } from "./decision.js";

/**
 * Which installer and launcher run an entry. A new kind is a real new runtime.
 *
 * - `open_jev_torch`: Open-Jev's own Python server. Linux with an NVIDIA card only.
 * - `llama_letters`: a plain GGUF on the llama.cpp server Marinara already uses for its
 *   built-in chat model. The model answers with an option letter and Marinara reads the
 *   letters' probabilities itself (JevK5's published readout). Runs wherever that
 *   server does: Windows, macOS, Linux, Android, on a graphics card or the CPU.
 * - `llama_systemone`: a GGUF that declares itself a decision model, served by a newer
 *   llama.cpp that answers `/v1/systemone` natively. Its own pinned server build, so
 *   the chat model's server is not changed under it.
 * - `valen_gguf`: Valen's own llama.cpp build. Its published build is Linux x64 CPU only.
 * - `winnow_cuda`: Winnow's own llama.cpp build. Its published build is Linux with an
 *   NVIDIA RTX 50-series card and the CUDA 13 libraries.
 */
export const DECISION_RUNTIME_KINDS = [
  "open_jev_torch",
  "llama_letters",
  "llama_systemone",
  "valen_gguf",
  "winnow_cuda",
] as const;
export type DecisionRuntimeKind = (typeof DECISION_RUNTIME_KINDS)[number];

/** Runtimes that load one GGUF file and need `modelFile`. */
export function isGgufDecisionRuntime(runtime: DecisionRuntimeKind): boolean {
  return runtime !== "open_jev_torch";
}

/**
 * Which memory a model is weighed against before it installs and loads.
 *
 * `nvidia`: graphics memory on an NVIDIA card (Open-Jev, Winnow). `cpu`: system memory
 * (Valen's CPU build). `llama`: the graphics card when Marinara's llama.cpp runtime uses
 * one, otherwise system memory.
 */
export type DecisionMemoryKind = "nvidia" | "cpu" | "llama";

/** One OS and processor a runtime has a build for. */
export interface DecisionPlatform {
  os: NodeJS.Platform;
  arch: string;
  /** `nvidia` means the runtime cannot start without an NVIDIA card. */
  gpuVendor: "nvidia" | "any";
  minDriver?: string;
}

/**
 * Artifact types a published checkpoint can declare, mapped to the runtime that can
 * load it.
 *
 * This is what makes a pasted repository safe to consider: Open-Jev's checkpoints ship
 * a `release-manifest.json` naming their `artifact_type`, their base model and its
 * pinned revision, so compatibility is read rather than assumed. A type that is not in
 * this table has no runtime here and is refused by name.
 */
export const DECISION_ARTIFACT_RUNTIMES: Record<string, DecisionRuntimeKind> = {
  qwen_lora_adapter_plus_scalar_decision_head: "open_jev_torch",
};

/**
 * The runtime that can load this artifact type, or null.
 *
 * Deliberately not a bare index. `DECISION_ARTIFACT_RUNTIMES["constructor"]` returns
 * a function from `Object.prototype`, and every member of it is truthy, so a manifest
 * declaring `"constructor"` or `"toString"` would otherwise pass the one check that
 * decides whether a pasted repository is installable at all.
 */
export function runtimeForArtifactType(artifactType: string): DecisionRuntimeKind | null {
  return Object.hasOwn(DECISION_ARTIFACT_RUNTIMES, artifactType) ? DECISION_ARTIFACT_RUNTIMES[artifactType]! : null;
}

/** The same guard for the runtime table, for exactly the same reason. */
export function decisionRuntimeDefaults(
  runtime: string,
): (typeof DECISION_RUNTIME_DEFAULTS)[DecisionRuntimeKind] | null {
  return Object.hasOwn(DECISION_RUNTIME_DEFAULTS, runtime)
    ? DECISION_RUNTIME_DEFAULTS[runtime as DecisionRuntimeKind]
    : null;
}

/**
 * Is this a HuggingFace repository id and nothing else?
 *
 * Load bearing rather than cosmetic. A pasted id is interpolated into hub URLs, and a
 * segment of dots survives a naive character-class check while collapsing the path:
 * `../name` resolves `…/api/models/../name/tree/x` to `…/api/name/tree/x`, which is a
 * different endpoint than the one this code believes it is calling.
 */
export function isSafeRepoId(value: string): boolean {
  const segments = value.split("/");
  if (segments.length !== 2) return false;
  return segments.every(
    (segment) => /^[A-Za-z0-9._-]+$/u.test(segment) && /[A-Za-z0-9]/u.test(segment) && !/^\.+$/u.test(segment),
  );
}

/**
 * Is this a git ref this code is willing to put in a URL?
 *
 * Either an exact commit or a plain branch or tag name. No dot-only segments, no
 * leading dash, nothing that needs escaping.
 */
export function isSafeGitRef(value: string): boolean {
  if (/^[0-9a-f]{40}$/u.test(value)) return true;
  if (value.length > 100 || value.startsWith("-")) return false;
  return value.split("/").every((segment) => /^[A-Za-z0-9._-]+$/u.test(segment) && !/^\.+$/u.test(segment));
}

/** A relative `.gguf` path with no empty, `.` or `..` segment. */
export function isSafeModelFilePath(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) return false;
  if (!value.toLowerCase().endsWith(".gguf") || value.startsWith("/") || value.includes("\\")) return false;
  return value.split("/").every((segment) => /^[A-Za-z0-9._-]+$/u.test(segment) && !/^\.+$/u.test(segment));
}

/** One downloadable artifact, pinned so an install is reproducible. */
export interface DecisionModelArtifact {
  repoId: string;
  /** An exact commit. Never a branch: a moving pin is not a pin. */
  revision: string;
  /** Subset of the repository to fetch, when the whole thing is not needed. */
  paths?: string[];
}

export interface SidecarDecisionModelInfo {
  id: string;
  label: string;
  description: string;
  runtime: DecisionRuntimeKind;
  /** The checkpoint, then the base weights it names. Both pinned. */
  artifacts: DecisionModelArtifact[];
  downloadSizeBytes: number;
  diskBytes: number;
  /** Peak device memory observed while serving, at `maxLengthTokens`. */
  vramBytes: number;
  maxLengthTokens: number;
  /** Sequences per forward pass. Higher answers a group faster and costs memory. */
  batchSize: number;
  platforms: DecisionPlatform[];
  /**
   * Lowest CUDA compute capability the runtime's wheels contain kernels for, for a
   * runtime that needs an NVIDIA card.
   *
   * Not decoration: the pinned PyTorch build ships `sm_75` and up, so Pascal and older
   * cannot run this however much memory they have. Without this the preflight would
   * pass a GTX 1080 Ti, spend ten gigabytes, and fail at load.
   */
  minComputeCapability?: string;
  /**
   * The only compute capabilities a runtime has kernels for, when it was built for
   * exactly those (Winnow's build is `sm_120` only). Checked before the download.
   */
  onlyComputeCapabilities?: string[];
  /** Which memory `vramBytes` is weighed against. Open-Jev entries leave it out (NVIDIA). */
  memory?: DecisionMemoryKind;
  /** The GGUF to load, as a path inside the first artifact. For every runtime but Open-Jev. */
  modelFile?: string;
  /**
   * For `llama_letters`: the temperatures the model's authors fitted for this file. The
   * first scales the letter log-probabilities; the second sharpens the combined answer
   * when a question has more than 16 options and is read in several passes.
   */
  letterReadout?: { temperature: number; knockoutTemperature: number };
  /** Plain words for the languages it was trained and checked on, for the picker. */
  languages?: string;
  /** Shared libraries the runtime needs installed on the machine (Winnow's CUDA 13). */
  requiredLibraries?: string[];
  /** Processor features the runtime's build was compiled for (Valen's AVX2 build). */
  requiredCpuFlags?: string[];
  /** Where this model answers, which is not where a general chat model answers. */
  calibration: DecisionCalibration;
  /**
   * Measured extra time per question beyond the first. The prefix cache stays off, so
   * every question, and every Choice option, re-reads the whole scene: the cost grows
   * with the number of questions and with the scene's length. Each entry says what
   * scene length it was measured on. The request budget grows by this much per
   * question, so a group of questions is not cut off by a budget sized for one. Only
   * curated entries carry one; a pasted model keeps the flat sidecar budget.
   */
  perQuestionMs?: number;
  licenses: string[];
  /** Drives the "not developed by Marinara" wording before anything downloads. */
  thirdParty: true;
}

/** Every OS and processor Marinara's llama.cpp runtimes have a build for. */
const LLAMA_PLATFORMS: DecisionPlatform[] = [
  { os: "win32", arch: "x64", gpuVendor: "any" },
  { os: "win32", arch: "arm64", gpuVendor: "any" },
  { os: "darwin", arch: "arm64", gpuVendor: "any" },
  { os: "darwin", arch: "x64", gpuVendor: "any" },
  { os: "linux", arch: "x64", gpuVendor: "any" },
  { os: "linux", arch: "arm64", gpuVendor: "any" },
  { os: "android", arch: "arm64", gpuVendor: "any" },
];

/**
 * Peak memory of the running server, measured on 2026-11-18 (Linux, CPU, the context
 * in each entry, after a 20-question run). On a graphics card the weights move there
 * and the figure is close.
 */
const LLAMA_LETTERS_MEMORY = {
  jevk5_4b: 3_600_000_000,
  jevk5_2b: 2_900_000_000,
  d1_3b: 2_400_000_000,
  valen_4b: 5_000_000_000,
};

/**
 * Curated entries, shipped with releases. Each one is a reviewed, pinned change.
 *
 * A model reached by pasting its repository is handled separately and is not listed
 * here: it is checked against `DECISION_ARTIFACT_RUNTIMES` at the moment it is pasted.
 */
export const SIDECAR_DECISION_MODELS: SidecarDecisionModelInfo[] = [
  {
    id: "jevk5-4b",
    label: "JevK5 4B",
    description:
      "An open Jev alternative that runs on almost any computer: NVIDIA, AMD, Intel or Apple graphics, or the processor alone. Uses the same llama.cpp server as Marinara's built-in chat model. English only.",
    runtime: "llama_letters",
    artifacts: [
      {
        repoId: "alibiserikbay/JevK5-GGUF",
        revision: "ec67b0bfce5119a8b11a2cdb430bb43e3fa3e82a",
        paths: ["jevk5-4b-v0.3-Q4_K_M.gguf"],
      },
    ],
    modelFile: "jevk5-4b-v0.3-Q4_K_M.gguf",
    // From the Hub's file listing at the pinned revision; the digest is checked on download.
    downloadSizeBytes: 2_708_804_000,
    // The weights only: the llama.cpp runtime is the one the built-in chat model uses.
    diskBytes: 2_710_000_000,
    vramBytes: LLAMA_LETTERS_MEMORY.jevk5_4b,
    memory: "llama",
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: LLAMA_PLATFORMS,
    // Measured on 20 roleplay turns through this readout (2026-11-18, CPU, Q4_K_M): yes
    // answered 0.50 to 0.89, no 0.015 to 0.26. 0.3 separates every one of them; 0.5 would
    // have missed one yes. The authors' own temperatures for this file are below.
    calibration: { defaultThreshold: 0.3, questionShape: "text" },
    letterReadout: { temperature: 1.22, knockoutTemperature: 0.93 },
    languages: "English",
    licenses: ["Apache-2.0 (weights)"],
    thirdParty: true,
  },
  {
    id: "liquid-d1-3b",
    label: "Liquid d1 3B",
    description:
      "Liquid AI's decision model, trained for 16 languages including Japanese, Chinese, Korean, German, Spanish and Russian. Runs on almost any computer. Free for people and for companies under $10 million a year in revenue.",
    runtime: "llama_systemone",
    artifacts: [
      {
        repoId: "LiquidAI/d1-3B-GGUF",
        revision: "bb1e436ea78eb96a3f1acb6da865f70c2fbeb563",
        paths: ["d1-3B-Q4_K_M.gguf", "LICENSE"],
      },
    ],
    modelFile: "d1-3B-Q4_K_M.gguf",
    downloadSizeBytes: 1_674_467_246,
    // The weights plus its own llama.cpp server build (about 100 MB unpacked).
    diskBytes: 1_800_000_000,
    vramBytes: LLAMA_LETTERS_MEMORY.d1_3b,
    memory: "llama",
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: LLAMA_PLATFORMS,
    // Measured on the same 20 turns in English, Spanish, Japanese, German, Chinese,
    // French, Korean and Russian (2026-11-18, CPU, Q4_K_M): yes 0.66 to 0.99, no 0.011 to
    // 0.063. All 20 correct at any threshold from 0.07 to 0.65.
    calibration: { defaultThreshold: 0.3, questionShape: "text" },
    languages: "16 languages",
    licenses: ["LFM Open License 1.0 (free under $10M yearly revenue)"],
    thirdParty: true,
  },
  {
    id: "jevk5-2b",
    label: "JevK5 2B",
    description:
      "The smaller JevK5: faster on a processor or a small graphics card, a little less accurate. Same server as the built-in chat model. English only.",
    runtime: "llama_letters",
    artifacts: [
      {
        repoId: "alibiserikbay/JevK5-GGUF",
        revision: "ec67b0bfce5119a8b11a2cdb430bb43e3fa3e82a",
        paths: ["jevk5-2b-v0.2-Q8_0.gguf"],
      },
    ],
    modelFile: "jevk5-2b-v0.2-Q8_0.gguf",
    downloadSizeBytes: 2_012_012_000,
    diskBytes: 2_015_000_000,
    vramBytes: LLAMA_LETTERS_MEMORY.jevk5_2b,
    memory: "llama",
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: LLAMA_PLATFORMS,
    calibration: { defaultThreshold: 0.3, questionShape: "text" },
    // The authors' values for the 2B file (v0.2 recipe).
    letterReadout: { temperature: 1.42, knockoutTemperature: 0.77 },
    languages: "English",
    licenses: ["Apache-2.0 (weights)"],
    thirdParty: true,
  },
  {
    id: "valen-decision-1.5-4b",
    label: "Valen-Decision 1.5 4B",
    description:
      "A decision model that can also read images and video. Marinara sends it text for now. Its published runtime is for Linux on a 64-bit Intel or AMD processor, and it runs on the processor, not the graphics card.",
    runtime: "valen_gguf",
    artifacts: [
      {
        repoId: "Valen-Team/Valen-Decision-1.5-4B-GGUF",
        revision: "9fea2c28ee96682c9e516f847003e3e5e3590dad",
        paths: ["Valen-Decision-1.5-4B-Q8_0.gguf"],
      },
    ],
    modelFile: "Valen-Decision-1.5-4B-Q8_0.gguf",
    downloadSizeBytes: 4_514_520_928,
    // The weights plus Valen's runtime (32 MB download).
    diskBytes: 4_650_000_000,
    vramBytes: LLAMA_LETTERS_MEMORY.valen_4b,
    memory: "cpu",
    // The context its authors launch it with; the whole request is read in one batch.
    maxLengthTokens: 4096,
    batchSize: 1,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "any" }],
    requiredCpuFlags: ["avx2", "fma", "f16c", "bmi2"],
    // Measured on the same 20 turns as the others, state sent as text (2026-11-18, CPU,
    // Q8_0): yes 0.66 to 0.99, no 0 to 0.036, about 6.5 seconds a question on 4 cores.
    calibration: { defaultThreshold: 0.3, questionShape: "text" },
    languages: "8 languages checked (English, Spanish, Japanese, German, Chinese, French, Korean, Russian)",
    licenses: ["Apache-2.0 (weights and runtime)"],
    thirdParty: true,
  },
  {
    id: "winnow-e4b",
    label: "Winnow E4B",
    description:
      "A Gemma 4 decision model that scored 80.5% on JevBench's public set. Its published runtime only runs on Linux with an NVIDIA RTX 50-series card and the CUDA 13 libraries installed, and needs about 10 GB of graphics memory.",
    runtime: "winnow_cuda",
    artifacts: [
      {
        repoId: "EldanRing/Winnow-E4B",
        revision: "17871fd27a880b3f8dad94841774db70e59fca47",
        paths: ["gguf/Winnow-E4B-Q8_0.gguf", "LICENSE", "NOTICE"],
      },
    ],
    modelFile: "gguf/Winnow-E4B-Q8_0.gguf",
    downloadSizeBytes: 8_005_449_713,
    // The weights plus Winnow's runtime (57 MB download).
    diskBytes: 8_200_000_000,
    // The authors measured 8.56 GiB on an RTX 5070 Ti for 8K text decisions.
    vramBytes: 9_200_000_000,
    memory: "nvidia",
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "nvidia", minDriver: "580" }],
    // The published build has kernels for sm_120 (RTX 50 series) only.
    onlyComputeCapabilities: ["12.0"],
    requiredLibraries: ["libcudart.so.13", "libcublas.so.13", "libnccl.so.2"],
    // Not measured here: no RTX 50-series card was available. The protocol's own default.
    calibration: { defaultThreshold: 0.5, questionShape: "text" },
    languages: "Not stated by its authors",
    licenses: ["Apache-2.0 (weights, Gemma 4 terms)"],
    thirdParty: true,
  },
  {
    id: "open-jev-2b",
    label: "Open-Jev 2B",
    description:
      "An independent research model that answers yes/no questions without writing a reply. Faster and a little smaller than a general local model, but less accurate on roleplay.",
    runtime: "open_jev_torch",
    artifacts: [
      { repoId: "ZefanCai/Open-Jev-2B", revision: "0c7aa498b1627be8da4acf34c863ff0ee0a92785", paths: ["package/"] },
      { repoId: "Qwen/Qwen3.5-2B", revision: "15852e8c16360a2fea060d615a32b45270f8a8fc" },
    ],
    // 12 MB checkpoint plus 4,548,221,488 bytes of base weights, both measured from
    // the pinned revisions and verified by sha256 after download.
    downloadSizeBytes: 4_560_000_000,
    // Weights on disk plus the runtime's own Python environment, which measured 5.4 GB.
    diskBytes: 10_000_000_000,
    // Measured at 4576 MiB peak while serving at max-length 4096.
    vramBytes: 4_798_283_776,
    maxLengthTokens: 4096,
    // Not 1: `candidate_batches` treats this as a per-forward-pass sequence limit, so
    // 1 serialises every question in a group instead of answering them together.
    batchSize: 8,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "nvidia", minDriver: "580" }],
    minComputeCapability: "7.5",
    // Measured, not assumed. On eight roleplay turns this model answered yes between
    // 0.15 and 0.59 and no between 0.009 and 0.026, so the documented 0.5 would skip
    // every relevant turn. Any threshold from roughly 0.03 to 0.15 classified all
    // eight correctly; 0.1 sits in the middle of that band.
    calibration: { defaultThreshold: 0.1, questionShape: "task_object" },
    // Measured through the engine on the longest chat it sends: 24 statements took
    // 5.9 s and 32 took 7.9 s, and a Choice option costs the same as a statement. With
    // the flat 4 s budget both got no answers at all, so every statement read as no.
    // A scene at the model's own full length (3,479 tokens) costs 0.33 s a statement,
    // hence 350 rather than the 250 an English chat needs.
    perQuestionMs: 350,
    // Read from the LICENSE file at each pinned revision. Qwen3.5-2B is Apache-2.0 there.
    licenses: ["MIT (source)", "Apache-2.0 (adapter)", "Apache-2.0 (base weights)"],
    thirdParty: true,
  },
  {
    id: "open-jev-9b",
    label: "Open-Jev 9B",
    description:
      "The larger Open-Jev: more accurate than 2B in our tests, but it needs about 22 GB of GPU memory, so on a 24 GB card nothing else fits beside it, and it takes about a second per question.",
    runtime: "open_jev_torch",
    artifacts: [
      { repoId: "ZefanCai/Open-Jev-9B", revision: "47e966881e489511c0c7f5633a9e1960a676a551", paths: ["package/"] },
      { repoId: "Qwen/Qwen3.5-9B", revision: "c202236235762e1c871ad0ccb60c8ee5ba337b9a" },
    ],
    // 25,588,410 bytes of checkpoint plus 19,329,393,661 bytes of base weights, from
    // the pinned revisions.
    downloadSizeBytes: 19_354_982_071,
    // Measured after a real install on 2026-09-23: weights plus the runtime
    // environment, with uv's cache already pruned (25,274,581,531 bytes).
    diskBytes: 25_300_000_000,
    // Measured at 22,492 MiB peak serving a full batch of eight near max-length 4096.
    vramBytes: 23_584_571_392,
    maxLengthTokens: 4096,
    batchSize: 8,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "nvidia", minDriver: "580" }],
    minComputeCapability: "7.5",
    // Measured, like 2B. On the eight roleplay turns (object-shaped question) it
    // answered yes between 0.135 and 0.79 and no at 0.019 or below, and it scored 31
    // of 32 recommended-statement turns at 0.1. Any threshold from about 0.02 to 0.13
    // separates the roleplay set; 0.1 matches 2B's operating point.
    calibration: { defaultThreshold: 0.1, questionShape: "task_object" },
    // About 1.0 s for one question on a short scene, 3.35 s for four and 6.6 s for
    // eight: the prefix cache stays off, so each question re-reads the scene.
    perQuestionMs: 800,
    licenses: ["MIT (source)", "Apache-2.0 (adapter)", "Apache-2.0 (base weights)"],
    thirdParty: true,
  },
];

/**
 * What a runtime kind imposes on anything it loads.
 *
 * A pasted checkpoint declares which runtime can load it but not what that runtime
 * costs, so these come from the runtime rather than from the repository. A model's
 * own manifest is not allowed to claim a lower driver floor or a wider GPU range than
 * the wheels actually support.
 */
export const DECISION_RUNTIME_DEFAULTS: Record<
  DecisionRuntimeKind,
  Pick<
    SidecarDecisionModelInfo,
    | "maxLengthTokens"
    | "batchSize"
    | "platforms"
    | "minComputeCapability"
    | "onlyComputeCapabilities"
    | "calibration"
    | "memory"
    | "requiredCpuFlags"
    | "requiredLibraries"
  >
> = {
  open_jev_torch: {
    maxLengthTokens: 4096,
    batchSize: 8,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "nvidia", minDriver: "580" }],
    minComputeCapability: "7.5",
    calibration: { defaultThreshold: 0.1, questionShape: "task_object" },
    memory: "nvidia",
  },
  llama_letters: {
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: LLAMA_PLATFORMS,
    calibration: { defaultThreshold: 0.5, questionShape: "text" },
    memory: "llama",
  },
  // A pasted native decision GGUF has not been measured here, so it keeps the
  // protocol's own 0.5 until the user tunes it on their agents.
  llama_systemone: {
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: LLAMA_PLATFORMS,
    calibration: { defaultThreshold: 0.5, questionShape: "text" },
    memory: "llama",
  },
  valen_gguf: {
    maxLengthTokens: 4096,
    batchSize: 1,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "any" }],
    requiredCpuFlags: ["avx2", "fma", "f16c", "bmi2"],
    calibration: { defaultThreshold: 0.5, questionShape: "text" },
    memory: "cpu",
  },
  winnow_cuda: {
    maxLengthTokens: 8192,
    batchSize: 1,
    platforms: [{ os: "linux", arch: "x64", gpuVendor: "nvidia", minDriver: "580" }],
    onlyComputeCapabilities: ["12.0"],
    requiredLibraries: ["libcudart.so.13", "libcublas.so.13", "libnccl.so.2"],
    calibration: { defaultThreshold: 0.5, questionShape: "text" },
    memory: "nvidia",
  },
};

/** Runtimes a pasted repository can be installed with. The others are curated-only. */
export const PASTEABLE_DECISION_RUNTIMES: readonly DecisionRuntimeKind[] = [
  "open_jev_torch",
  "llama_systemone",
  "valen_gguf",
];

/** The shape of a checkpoint's own release manifest, as far as this engine reads it. */
export interface DecisionReleaseManifest {
  artifact_type?: unknown;
  base_model?: unknown;
  base_revision?: unknown;
  base_weights_included?: unknown;
}

export type DecisionManifestRefusal =
  | "unreadable_manifest"
  | "unknown_artifact_type"
  | "missing_base_model"
  | "unpinned_base_revision"
  | "base_weights_included";

/**
 * Judge a pasted checkpoint by what it declares about itself.
 *
 * This is the whole safety gate for a bring-your-own model: compatibility is read from
 * the repository's own manifest and matched against a runtime this engine ships,
 * rather than assumed from a name. Anything it cannot vouch for is refused by reason,
 * never installed hopefully.
 */
export function readDecisionManifest(
  manifest: DecisionReleaseManifest | null,
): { runtime: DecisionRuntimeKind; baseModel: string; baseRevision: string } | { refusal: DecisionManifestRefusal } {
  if (!manifest || typeof manifest !== "object") return { refusal: "unreadable_manifest" };
  const declared = typeof manifest.artifact_type === "string" ? manifest.artifact_type : "";
  const runtime = runtimeForArtifactType(declared);
  if (!runtime) return { refusal: "unknown_artifact_type" };
  const baseModel = typeof manifest.base_model === "string" ? manifest.base_model.trim() : "";
  // The manifest is third-party text and this id goes into a URL, so it gets the same
  // check a pasted one does rather than a looser shape test.
  if (!isSafeRepoId(baseModel)) return { refusal: "missing_base_model" };
  const baseRevision = typeof manifest.base_revision === "string" ? manifest.base_revision.trim() : "";
  // A branch name would let the weights change under a pinned adapter.
  if (!/^[0-9a-f]{40}$/u.test(baseRevision)) return { refusal: "unpinned_base_revision" };
  // A package that ships its own base weights is a different install shape: this
  // downloader fetches the checkpoint and then the base model the manifest names, so
  // it would pull weights the package already contains.
  if (manifest.base_weights_included === true) return { refusal: "base_weights_included" };
  return { runtime, baseModel, baseRevision };
}

export function findDecisionModel(id: string | null | undefined): SidecarDecisionModelInfo | null {
  return SIDECAR_DECISION_MODELS.find((model) => model.id === id) ?? null;
}

/**
 * What the user has decided about the managed decision sidecar.
 *
 * `enabled` is deliberately separate from "installed": the panel is collapsed behind
 * an explicit toggle with a warning, and turning it off stops the process while
 * keeping the download. The consent fields record what was shown at the moment the
 * user agreed, so a support report can tell an informed choice from a surprise.
 */
export interface DecisionSidecarSettings {
  enabled: boolean;
  /** The catalog entry that is installed, or null. */
  modelId: string | null;
  /**
   * A model installed by pasting its repository, which by definition is not in the
   * curated list. Stored whole so an install survives a restart without re-reading a
   * third party's manifest to find out what is on disk.
   */
  customModel: SidecarDecisionModelInfo | null;
  /** Start with Marinara, or on the first gate that needs it. */
  startPolicy: "on_demand" | "with_marinara";
  confirmedAt: string | null;
  /** The preflight verdict displayed when the user confirmed. */
  confirmedVerdict: string | null;
  /**
   * The CUDA device the decision sidecar runs on, by `nvidia-smi` index, or null for
   * the default. Separate from the llama.cpp slots' device, which is a Vulkan index
   * and names a different card on a machine with an integrated GPU.
   */
  cudaDevice: number | null;
}

export const DECISION_SIDECAR_SETTINGS_KEY = "decision-sidecar";

export const DECISION_SIDECAR_DEFAULT_SETTINGS: DecisionSidecarSettings = {
  enabled: false,
  modelId: null,
  customModel: null,
  startPolicy: "on_demand",
  confirmedAt: null,
  confirmedVerdict: null,
  cudaDevice: null,
};

/** A plausible CUDA device index. Whether that card exists is the preflight's call. */
export function isCudaDeviceIndex(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 64;
}

/** Accept a stored custom entry only if its runtime and floors still make sense. */
export function sanitizeCustomDecisionModel(value: unknown): SidecarDecisionModelInfo | null {
  if (!value || typeof value !== "object") return null;
  const model = value as SidecarDecisionModelInfo;
  const defaults = decisionRuntimeDefaults(model.runtime);
  if (!defaults) return null;
  // Only a runtime a pasted repository can actually reach. A hand-edited record naming
  // a curated-only runtime would otherwise borrow that runtime's launcher for files
  // nobody reviewed.
  if (!PASTEABLE_DECISION_RUNTIMES.includes(model.runtime)) return null;
  if (!Array.isArray(model.artifacts) || model.artifacts.length === 0) return null;
  // The GGUF path is joined onto the download folder, so it is held to the same shape
  // as a file the downloader would write: relative, no dot segments, a .gguf name.
  if (isGgufDecisionRuntime(model.runtime) && !isSafeModelFilePath(model.modelFile)) return null;
  // Each element is checked for shape before any field is read. A null element used
  // to throw, and the settings parser's catch then reset the whole record, losing
  // `enabled`, the start policy and the consent record over one bad entry.
  const artifactOk = (artifact: unknown): boolean => {
    if (!artifact || typeof artifact !== "object") return false;
    const entry = artifact as Partial<DecisionModelArtifact>;
    if (typeof entry.revision !== "string" || !/^[0-9a-f]{40}$/u.test(entry.revision)) return false;
    if (typeof entry.repoId !== "string" || !isSafeRepoId(entry.repoId)) return false;
    // The downloader calls `startsWith` on every prefix.
    return (
      entry.paths === undefined ||
      (Array.isArray(entry.paths) && entry.paths.every((prefix) => typeof prefix === "string"))
    );
  };
  if (!model.artifacts.every(artifactOk)) return null;
  // Both reach the installer dialog as text.
  if (!Array.isArray(model.licenses) || !model.licenses.every((license) => typeof license === "string")) return null;
  if (typeof model.description !== "string") return null;
  // An entry with no name or a nonsense size would reach the panel and the preflight,
  // where it would render blank and be judged against zero bytes.
  if (typeof model.id !== "string" || !model.id.trim()) return null;
  if (typeof model.label !== "string" || !model.label.trim()) return null;
  const positive = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value > 0;
  if (!positive(model.vramBytes) || !positive(model.diskBytes) || !positive(model.downloadSizeBytes)) return null;
  // The runtime's own constraints always win over whatever was stored, and a measured
  // per-question cost belongs to curated entries only: a stored value could otherwise
  // stretch every request's budget.
  const { perQuestionMs: _unmeasured, letterReadout: _curatedOnly, ...rest } = model;
  return { ...rest, ...defaults };
}

export function parseDecisionSidecarSettings(raw: string | null | undefined): DecisionSidecarSettings {
  if (!raw) return { ...DECISION_SIDECAR_DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw) as Partial<DecisionSidecarSettings>;
    return {
      enabled: parsed.enabled === true,
      modelId: typeof parsed.modelId === "string" && findDecisionModel(parsed.modelId) ? parsed.modelId : null,
      // Re-validated on read: a hand-edited entry must not be able to describe a
      // runtime this engine does not ship or claim a weaker hardware floor.
      customModel: sanitizeCustomDecisionModel(parsed.customModel),
      startPolicy: parsed.startPolicy === "with_marinara" ? "with_marinara" : "on_demand",
      confirmedAt: typeof parsed.confirmedAt === "string" ? parsed.confirmedAt : null,
      confirmedVerdict: typeof parsed.confirmedVerdict === "string" ? parsed.confirmedVerdict : null,
      cudaDevice: isCudaDeviceIndex(parsed.cudaDevice) ? parsed.cudaDevice : null,
    };
  } catch {
    // A hand-edited or truncated value must not enable a download.
    return { ...DECISION_SIDECAR_DEFAULT_SETTINGS };
  }
}
