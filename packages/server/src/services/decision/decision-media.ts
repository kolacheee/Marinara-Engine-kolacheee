/**
 * Pictures and clips from the chat, for decision models that can read them.
 *
 * A decision state is text that any decision backend may receive, including a hosted
 * one. Media ride beside it under a symbol rather than inside it: `JSON.stringify`
 * drops symbol keys, so a backend that cannot read media, or a remote connection, never
 * sees them, and nothing is loaded until a backend that reads them asks. Only Marinara's
 * own decision models on loopback ever do.
 *
 * Each reference loads lazily: a gate whose model reads text pays nothing for the
 * pictures in the chat, and one that reads them loads only the newest few.
 */
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import type { DecisionInputKind, DecisionRuntimeKind } from "@marinara-engine/shared";
import { logger } from "../../lib/logger.js";
import { DATA_DIR } from "../../utils/data-dir.js";
import { assertInsideDir } from "../../utils/security.js";
import { getSharp } from "../../utils/sharp.js";
import { parseExtra, type PromptAttachment } from "../generation/prompt-attachments.js";

export type DecisionMediaKind = Exclude<DecisionInputKind, "text">;

export interface DecisionMediaRef {
  kind: DecisionMediaKind;
  /** The media as a data URL, or null when it is gone or cannot be read. */
  load: () => Promise<string | null>;
}

const DECISION_MEDIA = Symbol.for("marinara.decision.media");

/**
 * How much media one request carries, newest first. A picture is scaled so its longer
 * side is at most `imageEdge`: on Liquid d1 a full 1280 px picture cost 5,400 tokens and
 * 170 s on a 4-core processor, the same picture at 512 px 550 tokens and 17 s, with the
 * same answers. One clip, because Valen reads a clip as several pictures.
 */
export const DECISION_MEDIA_LIMITS = {
  images: 3,
  videos: 1,
  imageEdge: 512,
  /** Valen's SDK refuses an inline clip over 64 MiB; scene clips are a few megabytes. */
  videoBytes: 48 * 1024 * 1024,
  /** Pictures above this are not decoded at all. */
  imageBytes: 24 * 1024 * 1024,
} as const;

/** Attach media references to a state, kept by spreads and dropped by JSON. */
export function attachDecisionMedia<T extends object>(state: T, refs: DecisionMediaRef[]): T {
  if (refs.length > 0) Object.defineProperty(state, DECISION_MEDIA, { value: refs, enumerable: true });
  return state;
}

export function decisionMediaOf(state: unknown): DecisionMediaRef[] {
  if (!state || typeof state !== "object") return [];
  const refs = (state as Record<symbol, unknown>)[DECISION_MEDIA];
  return Array.isArray(refs) ? (refs as DecisionMediaRef[]) : [];
}

const SCENE_VIDEOS_DIR = join(DATA_DIR, "game-scene-videos");
const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

async function readAsDataUrl(path: string, mime: string, limit: number): Promise<string | null> {
  try {
    if ((await stat(path)).size > limit) return null;
    return `data:${mime};base64,${(await readFile(path)).toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * The media a chat message carries, as references: pictures the user attached, pictures
 * saved to the chat's gallery (selfies and illustrations), and generated clips.
 */
export function decisionMediaForMessage(
  message: { extra?: unknown },
  context: { chatId: string; galleryImagePath: (galleryId: string) => Promise<string | null> },
): DecisionMediaRef[] {
  const raw = parseExtra(message.extra).attachments;
  if (!Array.isArray(raw)) return [];
  const refs: DecisionMediaRef[] = [];
  for (const attachment of raw as PromptAttachment[]) {
    if (!attachment || typeof attachment !== "object") continue;
    const type = typeof attachment.type === "string" ? attachment.type : "";
    if (type.startsWith("image/") && typeof attachment.data === "string" && attachment.data.startsWith("data:image/")) {
      const data = attachment.data;
      refs.push({ kind: "image", load: async () => data });
    } else if (type === "image" && attachment.galleryId) {
      const galleryId = attachment.galleryId;
      refs.push({
        kind: "image",
        load: async () => {
          const path = await context.galleryImagePath(galleryId);
          const mime = path ? IMAGE_MIME[extname(path).slice(1).toLowerCase()] : undefined;
          return path && mime ? readAsDataUrl(path, mime, DECISION_MEDIA_LIMITS.imageBytes) : null;
        },
      });
    } else if (type === "video" && typeof attachment.filename === "string") {
      const filename = attachment.filename;
      refs.push({
        kind: "video",
        load: async () => {
          if (!/^[A-Za-z0-9_-]+\.mp4$/u.test(filename)) return null;
          try {
            const path = assertInsideDir(SCENE_VIDEOS_DIR, join(SCENE_VIDEOS_DIR, context.chatId, filename));
            return readAsDataUrl(path, "video/mp4", DECISION_MEDIA_LIMITS.videoBytes);
          } catch {
            return null;
          }
        },
      });
    }
  }
  return refs;
}

/** A picture scaled down to the decision limit, as a JPEG data URL; null when it cannot be read. */
async function scaleImage(dataUrl: string): Promise<string | null> {
  const comma = dataUrl.indexOf(",");
  if (comma < 0 || !dataUrl.slice(0, comma).endsWith(";base64")) return null;
  const sharp = await getSharp();
  if (!sharp) return null;
  try {
    const input = Buffer.from(dataUrl.slice(comma + 1), "base64");
    if (input.byteLength > DECISION_MEDIA_LIMITS.imageBytes) return null;
    const edge = DECISION_MEDIA_LIMITS.imageEdge;
    const output = await sharp(input, { animated: false })
      .rotate()
      .resize(edge, edge, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85 })
      .toBuffer();
    return `data:image/jpeg;base64,${output.toString("base64")}`;
  } catch {
    return null;
  }
}

export interface LoadedDecisionMedia {
  images: string[];
  videos: string[];
}

/**
 * Load the newest media a model reads, within the limits, oldest first in the result so
 * they keep the chat's order. Anything that fails to load is left out; a gate never
 * fails because a picture went missing.
 */
export async function loadDecisionMedia(
  state: unknown,
  accepts: readonly DecisionInputKind[] | undefined,
): Promise<LoadedDecisionMedia> {
  const refs = decisionMediaOf(state);
  const wantImages = accepts?.includes("image") ?? false;
  const wantVideos = accepts?.includes("video") ?? false;
  const images: string[] = [];
  const videos: string[] = [];
  if (refs.length === 0 || (!wantImages && !wantVideos)) return { images, videos };
  for (const ref of [...refs].reverse()) {
    if (ref.kind === "image" && wantImages && images.length < DECISION_MEDIA_LIMITS.images) {
      const raw = await ref.load().catch(() => null);
      const scaled = raw ? await scaleImage(raw) : null;
      if (scaled) images.unshift(scaled);
    } else if (ref.kind === "video" && wantVideos && videos.length < DECISION_MEDIA_LIMITS.videos) {
      const clip = await ref.load().catch(() => null);
      if (clip) videos.unshift(clip);
    }
    if (
      (!wantImages || images.length >= DECISION_MEDIA_LIMITS.images) &&
      (!wantVideos || videos.length >= DECISION_MEDIA_LIMITS.videos)
    )
      break;
  }
  if (refs.length > 0 && images.length + videos.length === 0)
    logger.debug("[decision] The chat's media could not be read for the decision model");
  return { images, videos };
}

/**
 * The request a runtime wants for a state with media.
 *
 * - llama.cpp's native decision server (Liquid d1): the state as it is, pictures in a
 *   top-level `images` list.
 * - Winnow: pictures in its `winnow.images` extension.
 * - Valen (both forms): the state as one user message whose parts are the state's JSON
 *   text, then each picture and clip, the chat-message state Valen's API documents.
 */
export function decisionRequestWithMedia(
  runtime: DecisionRuntimeKind | undefined,
  state: unknown,
  media: LoadedDecisionMedia,
): { state: unknown; extraBody?: Record<string, unknown> } {
  if (media.images.length === 0 && media.videos.length === 0) return { state };
  if (runtime === "valen_gguf" || runtime === "valen_onnx") {
    return {
      state: {
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: typeof state === "string" ? state : JSON.stringify(state) },
              ...media.images.map((url) => ({ type: "image_url", image_url: { url } })),
              ...media.videos.map((url) => ({ type: "video_url", video_url: { url } })),
            ],
          },
        ],
      },
    };
  }
  if (runtime === "winnow_cuda") return { state, extraBody: { winnow: { images: media.images } } };
  if (runtime === "llama_systemone") return { state, extraBody: { images: media.images } };
  return { state };
}

/**
 * Room to leave in a model's input for the media a request may carry, so a long scene
 * plus its pictures never runs past the model's limit (which is an error, not a cut).
 * Per picture at 512 px: about 550 tokens on Liquid d1 and 180 on Valen, measured
 * 2026-11-18; Winnow's is not measured, so it gets d1's. A Valen clip read 460.
 */
export function decisionMediaTokenReserve(
  runtime: DecisionRuntimeKind | undefined,
  inputs: readonly DecisionInputKind[] | undefined,
): number {
  const valen = runtime === "valen_gguf" || runtime === "valen_onnx";
  const image = inputs?.includes("image") ? (valen ? 250 : 650) * DECISION_MEDIA_LIMITS.images : 0;
  const video = inputs?.includes("video") ? 700 * DECISION_MEDIA_LIMITS.videos : 0;
  return image + video;
}
