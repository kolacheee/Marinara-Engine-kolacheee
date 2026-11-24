// Types for the HD-2D town index (town-index.js).
import type { WorldTown } from "@marinara-engine/shared";
export interface Hd2dTownIndex {
  city: boolean;
  maps: [number, number];
  pop: number;
  greats: Array<{ key: string; type: string; label: string; ward: number }>;
  lots: Array<{ key: string; street: string; ward: number }>;
}
export function g2specOf(spec: Record<string, unknown>): Record<string, unknown>;
export function townIndex(spec: Record<string, unknown>): Hd2dTownIndex;
export function placeWorldTown(
  index: Hd2dTownIndex,
  town: WorldTown | null | undefined,
  /** The town's chronicle: its empty and burned houses are given to no one. */
  chron?: { empty: number; ruined: number } | null,
): { byKey: Map<string, string>; byWorld: Map<string, string> };
export function townBrief(index: Hd2dTownIndex): string;
export function spotWords(
  index: Hd2dTownIndex,
  key: string,
  info?: { inn?: boolean; shop?: boolean; empty?: boolean; ward?: number; street?: string },
): string;
