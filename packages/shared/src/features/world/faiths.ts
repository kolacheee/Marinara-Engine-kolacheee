// ──────────────────────────────────────────────
// The setting's own human cultures and faiths (worldgen W1, generator 9): who the people of each place
// are, and what they believe. Most come from the player's lore. A place is a culture's when the brief
// names it or a place it lies in; a faith is kept where its followers live and is holy where the brief
// says, and it spreads along the ways from there in the world's history.
// ──────────────────────────────────────────────
import type { WorldBrief, WorldBriefFaith, WorldBriefFolk } from "../../schemas/world-brief.schema.js";
import type { CompiledWorld, WorldPlace } from "./compile.js";
import { worldPlaceNamed } from "./edits.js";

/** A place and every place it lies in, innermost first. */
function chainOf(world: CompiledWorld, place: WorldPlace): WorldPlace[] {
  const byId = new Map(world.places.map((each) => [each.id, each]));
  const chain: WorldPlace[] = [];
  for (let at: WorldPlace | undefined = place; at && chain.length < 12; at = byId.get(at.parentId ?? ""))
    chain.push(at);
  return chain;
}

const named = (world: CompiledWorld, names: readonly string[]) =>
  new Set(names.map((name) => worldPlaceNamed(world.places, name)?.id).filter((id): id is string => !!id));

/** The culture a place's people are: the brief's culture naming it or the nearest place it lies in. */
export function worldFolkOf(world: CompiledWorld, brief: WorldBrief, place: WorldPlace): WorldBriefFolk | undefined {
  for (const at of chainOf(world, place)) {
    const folk = brief.folk.find((each) => named(world, each.places).has(at.id));
    if (folk) return folk;
  }
  return undefined;
}

/** The faiths holy at a place (or a place it lies in), and the ones its people keep. */
export function worldFaithsAt(
  world: CompiledWorld,
  brief: WorldBrief,
  place: WorldPlace,
): { holy: WorldBriefFaith[]; kept: WorldBriefFaith[] } {
  const chain = new Set(chainOf(world, place).map((each) => each.id));
  const holy = brief.faiths.filter((faith) => [...named(world, faith.holy)].some((id) => chain.has(id)));
  const folk = worldFolkOf(world, brief, place);
  const kept = folk
    ? brief.faiths.filter((faith) => faith.followers.some((name) => name.toLowerCase() === folk.name.toLowerCase()))
    : [];
  return { holy, kept };
}

/** Whether a faith may be kept at a place: its people follow it, or follow none the brief names. */
export function worldFaithFits(world: CompiledWorld, brief: WorldBrief, faith: WorldBriefFaith, place: WorldPlace) {
  const folk = worldFolkOf(world, brief, place);
  if (!folk) return true;
  const theirs = brief.faiths.filter((each) =>
    each.followers.some((name) => name.toLowerCase() === folk.name.toLowerCase()),
  );
  return !theirs.length || theirs.includes(faith);
}

/** The cultures and faiths, for the Game Master's overview. */
export function worldFolkAndFaithLines(world: CompiledWorld, brief: WorldBrief): string[] {
  const where = (names: readonly string[]) =>
    names.map((name) => worldPlaceNamed(world.places, name)?.name ?? name).join(", ");
  const folk = brief.folk.map(
    (each) =>
      `  - ${each.name}${each.note ? `: ${each.note.replace(/\.$/, "")}.` : "."}${
        each.places.length ? ` Theirs: ${where(each.places)}.` : ""
      }`,
  );
  const faiths = brief.faiths.map(
    (faith) =>
      `  - ${faith.name}${faith.note ? `: ${faith.note.replace(/\.$/, "")}.` : "."}${
        faith.holy.length ? ` Holy at ${where(faith.holy)}.` : ""
      }${faith.followers.length ? ` Kept by ${faith.followers.join(", ")}.` : ""}${
        faith.groups.length ? ` Served by ${faith.groups.join(", ")}.` : ""
      }`,
  );
  return [
    ...(folk.length ? [`- Peoples of the land:`, ...folk] : []),
    ...(faiths.length ? [`- Faiths:`, ...faiths] : []),
  ];
}
