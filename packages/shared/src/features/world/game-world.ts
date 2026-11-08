// ──────────────────────────────────────────────
// A game's world (worldgen W1): what a game stores (the seed, the generator version, the grounding and
// the brief, beside the setting kit) and what the Game Master is told of it. The world is made from those
// inputs once and kept as its snapshot (W11, snapshot.ts), which every read after that uses; a world with
// no snapshot (one made before W11, on a development build) is compiled from them on every read.
// ──────────────────────────────────────────────
import { z } from "zod";
import { gameWorldKitFromMetadata, type WorldKit } from "../../schemas/world-kit.schema.js";
import { checkWorldBrief, worldBriefSchema, type WorldBrief } from "../../schemas/world-brief.schema.js";
import {
  WORLD_GENERATOR_VERSION,
  compileWorld,
  worldGeneratorReads,
  type CompiledWorld,
  type WorldPlace,
} from "./compile.js";
import { worldBeyondText } from "./beyond.js";
import { applyWorldEdits, checkWorldEdits, worldEditsSchema, worldPlaceNamed, type WorldEdits } from "./edits.js";
import { worldEditsFightable } from "./battlefield-maps.js";
import { WORLD_RESOURCE_WORDS } from "./land.js";
import { worldCast, worldCastSize, worldPersonSheet } from "./people.js";
import { worldHistory, worldHistoryLine, worldNotablePast, worldPlacePast } from "./history.js";
import { worldFaithsAt, worldFolkAndFaithLines, worldFolkOf } from "./faiths.js";
import { worldAddedPeoples, worldPeopleLines, worldPeoples, worldPeoplesNear } from "./peoples.js";
import {
  worldAddedPlace,
  worldBrewingNear,
  worldChangesLines,
  worldLedgerInstructions,
  worldNewsHere,
  worldStandingWord,
  type WorldPresent,
} from "./ledger.js";

/** How many people not yet met the Game Master is shown at once. */
const WHERE_YOU_ARE_PEOPLE = 5;

export const WORLD_GROUNDINGS = Object.freeze(["expand", "strict"] as const);

/** Another map of a game's world (owner 2026-11-08: "how does it handle cases where the user travels long
 *  distance, let's say takes a flight from Tokyo to New York City"): made when the party first goes there,
 *  at the same scale, and kept, so going back finds it as it was. `name` is the place it was made for. */
export const worldMapSchema = z
  .object({
    id: z.string().regex(/^map-\d{1,3}$/),
    name: z.string().min(1).max(80),
    seed: z.number().int().min(0).max(0xffffffff),
    brief: worldBriefSchema,
  })
  .strict();
export type WorldMapEntry = z.infer<typeof worldMapSchema>;
export const WORLD_GAME_MAPS_MAX = 12;

/** What a game stores as `gameWorld`: the inputs of its compile. */
export const gameWorldSchema = z
  .object({
    seed: z.number().int().min(0).max(0xffffffff),
    generatorVersion: z.number().int().min(1),
    grounding: z.enum(WORLD_GROUNDINGS).default("expand"),
    brief: worldBriefSchema,
    /** The hand edits kept with it (W9c), applied after the compile. */
    edits: worldEditsSchema.optional(),
    /** The world's other maps, where the party has gone past the first (worldMapSchema). */
    maps: z.array(worldMapSchema).max(WORLD_GAME_MAPS_MAX).optional(),
    /** The map the party is on: one of `maps`, else the first. */
    here: z.string().max(16).optional(),
  })
  .strict();
export type GameWorldInput = z.input<typeof gameWorldSchema>;

export interface GameWorld {
  kit: WorldKit;
  seed: number;
  grounding: (typeof WORLD_GROUNDINGS)[number];
  brief: WorldBrief;
  /** The hand edits kept with it (W9c); `world` already has them applied. */
  edits?: WorldEdits;
  world: CompiledWorld;
  /** The world as compiled, before the edits: the one its history and its weeks of play were made on. */
  compiled?: CompiledWorld;
  /** The generator version its recipe was made by: a world is made again as that version made it. The
   *  latest when left out. */
  generatorVersion?: number;
  /** The snapshot this world was read from (W11): its people, history and towns are the snapshot's, never
   *  made again. */
  frozen?: import("./snapshot.js").WorldSnapshot;
  /** Which of the world's other maps this is (gameWorldSchema `maps`); the first map when left out. */
  mapId?: string;
}

/** The world as compiled, before its edits: the snapshot's, or compiled now. */
export function worldPreEdit(game: GameWorld): CompiledWorld {
  return game.compiled ?? compileGameWorld({ ...game, edits: undefined });
}

// A few compiled worlds, by their inputs: a turn reads the world more than once, and the inputs never
// change in play.
const cache = new Map<string, CompiledWorld>();
const CACHE_SIZE = 8;

const cached = (key: string, make: () => CompiledWorld) => {
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit);
    return hit;
  }
  const world = make();
  cache.set(key, world);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value!);
  return world;
};

/** Compiles a world from its stored inputs and applies its edit layer, or reuses the same inputs' last
 *  compile. The compile is kept apart from the edits, so editing a world never compiles it again. */
export function compileGameWorld(input: Omit<GameWorld, "world">): CompiledWorld {
  // The recipe's own version, or the snapshot's for a world read from one.
  const version = input.generatorVersion ?? input.frozen?.generatorVersion ?? WORLD_GENERATOR_VERSION;
  const key = JSON.stringify([input.seed, input.grounding, input.kit, input.brief, version]);
  const compiled = cached(key, () =>
    compileWorld({
      seed: input.seed,
      kit: input.kit,
      brief: input.brief,
      strict: input.grounding === "strict",
      generatorVersion: version,
    }),
  );
  if (!input.edits) return compiled;
  return cached(JSON.stringify([key, input.edits]), () => applyWorldEdits(input.kit, compiled, input.edits));
}

/** The game's world, or null when it has none, or none this Engine can read. A world made by another
 *  generator version is never reshaped by this one, so it reads as no world rather than a different one. */
export function gameWorldFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
  /** The map to read: the one the party is on (`here`) when left out; "home" for the first. */
  mapId?: string,
): GameWorld | null {
  if (!metadata || metadata.gameWorld == null) return null;
  const kit = gameWorldKitFromMetadata(metadata);
  if (!kit) return null;
  const parsed = gameWorldSchema.safeParse(metadata.gameWorld);
  if (!parsed.success || !worldGeneratorReads(parsed.data.generatorVersion)) return null;
  // Another of the world's maps: made from its own brief and seed, with no hand edits (those are the
  // first map's).
  const away = parsed.data.maps?.find((map) => map.id === (mapId ?? parsed.data.here));
  if (away && mapId !== "home") {
    const checked = checkWorldBrief(kit, away.brief);
    if (!checked.ok) return null;
    const inputs = {
      kit,
      seed: away.seed,
      grounding: parsed.data.grounding,
      brief: checked.brief,
      generatorVersion: parsed.data.generatorVersion,
    };
    const world = compileGameWorld(inputs);
    return { ...inputs, world, compiled: world, mapId: away.id };
  }
  const checked = checkWorldBrief(kit, parsed.data.brief);
  if (!checked.ok) return null;
  const inputs = {
    kit,
    seed: parsed.data.seed,
    grounding: parsed.data.grounding,
    brief: checked.brief,
    generatorVersion: parsed.data.generatorVersion,
  };
  // A layer that does not fit its world (one written around the editor's check) is not applied at all,
  // so what the editor's route refuses never reaches a reader by another route.
  const edits = parsed.data.edits && worldEditsFightable(parsed.data.edits).edits;
  const full = edits && worldEditIssues(inputs, edits).length === 0 ? { ...inputs, edits } : inputs;
  return { ...full, world: compileGameWorld(full), compiled: compileGameWorld(inputs) };
}

/** The other map of the world the party is on, by its id, or undefined when it is on the first. */
export function gameWorldMapHere(metadata: Record<string, unknown> | null | undefined): string | undefined {
  const stored = metadata?.gameWorld as { here?: unknown; maps?: Array<{ id?: unknown }> } | null | undefined;
  const here = typeof stored?.here === "string" ? stored.here : undefined;
  return here && Array.isArray(stored?.maps) && stored.maps.some((map) => map?.id === here) ? here : undefined;
}

/** Why an edit layer (W9c) does not fit a world, or nothing: checked against the world as compiled.
 *  Drawn people are checked by their place's cast size, since they are drawn rather than stored. */
export function worldEditIssues(inputs: Omit<GameWorld, "world" | "edits">, edits: WorldEdits): string[] {
  // Against the world as compiled, never as already edited (a game read back carries its stored layer).
  const compiled = compileGameWorld({ ...inputs, edits: undefined });
  const byId = new Map(compiled.places.map((place) => [place.id, place]));
  return checkWorldEdits(inputs.kit, compiled, edits, (place) => {
    const settlement = place.rank !== undefined ? place : place.parentId ? byId.get(place.parentId) : undefined;
    return settlement?.rank !== undefined ? worldCastSize(place, settlement) : 0;
  });
}

/** The world's place by the name the Game Master used, ignoring case and spacing, or by a name it went
 *  by before a hand edit renamed it. */
export function worldPlaceByName(world: CompiledWorld, name: string | undefined): WorldPlace | undefined {
  return worldPlaceNamed(world.places, name);
}

/**
 * A place tag's name, read against the world: undefined when the world does not list it, else the
 * world's own name for it and its size. A place inside a settlement has its settlement's size, and a
 * place above the settlements (a province, a system) has none, as the road and the wilds have none.
 * The size is the kit's, or, given the ladder a ruleset's market declares, the place on that ladder at
 * the same height, so a world's capital is the market's biggest place. A place the story added (worldgen
 * W4) is read as a place inside the world place it was added in.
 */
export function worldPlaceForTag(
  game: GameWorld,
  name: string,
  ladder?: ReadonlyArray<{ id: string }>,
  present?: WorldPresent,
): { name: string; size?: string } | undefined {
  const { kit, world } = game;
  const listed = worldPlaceByName(world, name);
  const added = listed || !present ? undefined : worldAddedPlace(game, present, name);
  const place = listed ?? added?.within;
  if (!place) return undefined;
  const named = added?.place.name ?? place.name;
  // The settlement it is in: itself, or the nearest place up that is one (none above the settlements).
  let settlement: WorldPlace | undefined = place;
  while (settlement && settlement.rank === undefined) {
    const up: string | null = settlement.parentId;
    settlement = up ? world.places.find((each) => each.id === up) : undefined;
  }
  if (!settlement) return { name: named };
  if (!ladder) return { name: named, size: settlement.size };
  const top = Math.max(1, kit.sizes.length - 1);
  // Rounded down, so only the world's own top places reach the market's biggest.
  const at = Math.floor((settlement.rank! * (ladder.length - 1)) / top);
  return { name: named, size: ladder[Math.min(ladder.length - 1, Math.max(0, at))]!.id };
}

/** The place in force (worldgen W7): where the game's map has the party, when the map's location is
 *  one of the world's places (an atlas made from the world), else the last place the replies named. Its
 *  size is read as an answered place tag reads it, on the market's ladder when there is one. */
export function worldPlaceInForce(
  game: GameWorld | null | undefined,
  named: { name?: string; size?: string } | null,
  mapLocationId: string | null | undefined,
  ladder?: ReadonlyArray<{ id: string }>,
): { name?: string; size?: string } | null {
  const onMap = game && mapLocationId ? game.world.places.find((place) => place.id === mapLocationId) : undefined;
  return onMap ? (worldPlaceForTag(game!, onMap.name, ladder) ?? { name: onMap.name }) : named;
}

/** A size word (id or label, any case) on the kit's own ladder, for a world without a market. */
export function worldKitSize(kit: WorldKit, word: string): { id: string } | undefined {
  const key = word.trim().toLowerCase();
  return kit.sizes.find((size) => size.id === key || size.label.toLowerCase() === key);
}

// ── What the Game Master is told ──

const labelOf = (entries: ReadonlyArray<{ id: string; label: string }>, id: string | undefined) =>
  entries.find((entry) => entry.id === id)?.label ?? id ?? "";
const plural = (word: string) => (/s$/i.test(word) ? word : `${word}s`);
/** The kit's word for a day, for several days. */
export const worldDayPlural = plural;

/** How long ago, in the kit's own word for a day. */
export function worldDaysAgo(kit: WorldKit, count: number): string {
  if (count <= 0) return "Today";
  return `${count} ${count === 1 ? kit.calendar.day : plural(kit.calendar.day)} ago`;
}

/** How long a trip takes, in the kit's own word for a day. */
export function worldTripDays(kit: WorldKit, count: number): string {
  const day = kit.calendar.day;
  if (count < 0.1) return `well under a ${day}`;
  if (count < 1) return `about ${Math.round(count * 10) / 10} of a ${day}`;
  const rounded = Math.round(count * 2) / 2;
  return `about ${rounded} ${rounded === 1 ? day : plural(day)}`;
}

function describe(kit: WorldKit, place: WorldPlace, present?: WorldPresent): string {
  // A place renamed by hand says what it was called, so earlier narration still reads.
  const once = place.aliases?.length ? `, once called ${place.aliases.join(", ")}` : "";
  const layer = labelOf(kit.layers, place.layer);
  if (place.size === undefined) return `${place.name} (${layer}${once})`;
  const state = present?.ruined.includes(place.id) ? "in ruins" : (present?.prosperity[place.id] ?? place.prosperity);
  return `${place.name} (${labelOf(kit.sizes, place.size)}, ${state}${once})`;
}

/** The fixed part, for the cached system prompt: the premise, the outer places, the biggest settlements. */
export function worldOverviewPromptText(game: GameWorld): string {
  const { kit, brief, world } = game;
  const history = worldHistory(game);
  const settlementsDepth = kit.layers.findIndex((layer) => layer.settlements);
  const outer = world.places.filter((place) => place.depth < settlementsDepth && place.depth <= 1);
  const biggest = world.places
    .filter((place) => place.depth === settlementsDepth)
    .sort((a, b) => b.rank! - a.rank! || a.id.localeCompare(b.id))
    .slice(0, 6);
  const lines = [
    `<world_places>`,
    `This world was made before play; its places are real and keep their names.`,
    ...(brief.earth
      ? [
          `- This is the real Earth, around ${brief.earth.area || "the starting place"}${
            brief.earth.year !== undefined
              ? `, in the year ${brief.earth.year < 0 ? `${-brief.earth.year} BC` : brief.earth.year}`
              : ", in the present day"
          }: its countries, cities, rivers and land are the real ones, and its past is the real past.`,
        ]
      : []),
    `- Now: ${brief.premise}`,
    ...(outer.length ? [`- ${outer.map((place) => describe(kit, place)).join("; ")}.`] : []),
    `- Biggest places: ${biggest.map((place) => describe(kit, place)).join("; ")}.`,
    // Another of the world's maps (a journey off the first): the first is still there to go back to.
    ...(game.mapId
      ? [
          `- The party has travelled off the world's first map to this one; the places of the first map are still there, and a place tag naming one of them takes the party back.`,
        ]
      : []),
    // The land past the map's edges, so the world does not end there.
    ...[worldBeyondText(game)].filter(Boolean),
    ...brief.groups
      .slice(0, 8)
      .map((group) =>
        [
          `- ${group.name} (${labelOf(kit.groupKinds, group.kind)}${group.seat ? `, at ${worldPlaceNamed(world.places, group.seat)?.name ?? group.seat}` : ""}${
            history.leaders[group.name]?.name ? `, led by ${history.leaders[group.name]!.name}` : ""
          })`,
          group.note ? `: ${group.note}` : ".",
          group.allies.length ? ` Allies: ${group.allies.join(", ")}.` : "",
          group.rivals.length ? ` Rivals: ${group.rivals.join(", ")}.` : "",
        ].join(""),
      ),
    ...(() => {
      // An Earth world has none: its past is the real one, which the Game Master knows (worldHistory).
      const past = worldNotablePast(history);
      return past.length ? [`- The past:`, ...past.map((event) => `  - ${worldHistoryLine(event)}`)] : [];
    })(),
    // The setting's own cultures and faiths, mostly from the player's lore.
    ...worldFolkAndFaithLines(world, brief),
    ...(() => {
      // Generator 9: the peoples who are not human, one line each; their rules come with the places near them.
      const peoples = worldPeoples(kit, world, brief.peoples);
      return peoples.length
        ? [`- Not human:`, ...peoples.flatMap((people) => worldPeopleLines(people, false).map((line) => `  ${line}`))]
        : [];
    })(),
    `To recall the past of a place or group not shown here, write [history: place="Name"] or [history: group="Name"]; the answer comes with your next turn.`,
    worldLedgerInstructions(game),
    `Use these places and names. When the party goes somewhere, say where with [place: name="..."], using a name from this world when it is one; a place this world does not list (a farmhouse, a camp, a ship) gets a name of its own.`,
    `</world_places>`,
  ];
  return lines.join("\n");
}

/** The river and the resources by a settlement (generator 7), for the GM: what it lives by. */
export function worldLandLines(world: GameWorld["world"], place: WorldPlace): string[] {
  if (!world.rivers && !world.resources) return [];
  const lines: string[] = [];
  const near = (x: number, y: number, reach: number) =>
    Math.max(Math.abs(x - place.at.x), Math.abs(y - place.at.y)) <= reach;
  let river = 0;
  for (const each of world.rivers ?? [])
    each.path.forEach((cell, index) => {
      if (near(cell % world.width, Math.floor(cell / world.width), 1)) river = Math.max(river, each.width[index] ?? 1);
    });
  if (river) lines.push(`- ${river >= 5 ? "On a great river" : river >= 3 ? "On a river" : "Beside a stream"}.`);
  const kinds = [
    ...new Set((world.resources ?? []).filter((each) => near(each.at.x, each.at.y, 2)).map((each) => each.kind)),
  ];
  if (kinds.length) lines.push(`- Nearby: ${kinds.map((kind) => WORLD_RESOURCE_WORDS[kind]).join(", ")}.`);
  return lines;
}

/** The changing part, for the per-turn reminder: where the party is, and where it can go from there,
 *  as the story has left the world (`present`, worldgen W4). */
export function worldWhereYouAreText(
  game: GameWorld,
  at: { place?: WorldPlace; name?: string; met?: ReadonlySet<string>; present?: WorldPresent },
): string {
  const { kit, world, brief } = game;
  const present = at.present;
  const byId = new Map(world.places.map((place) => [place.id, place]));
  // A place the story added is told as a place inside the world place it was added in.
  const added = !at.place && at.name && present ? worldAddedPlace(game, present, at.name) : undefined;
  const place = at.place ?? added?.within;
  const lines = [`<where_you_are>`];
  const changes = present ? worldChangesLines(game, present) : [];
  if (!place) {
    lines.push(`The party is at ${at.name ?? "an unnamed place"}, which this world does not list.`, ...changes);
    lines.push(`</where_you_are>`);
    return lines.join("\n");
  }
  const chain: WorldPlace[] = [];
  for (
    let up = place.parentId ? byId.get(place.parentId) : undefined;
    up;
    up = up.parentId ? byId.get(up.parentId) : undefined
  ) {
    chain.push(up);
  }
  const around = added ? [place, ...chain] : chain;
  lines.push(
    `The party is in ${added ? added.place.name : describe(kit, place, present)}${
      around.length ? `, in ${around.map((each) => describe(kit, each, present)).join(", ")}` : ""
    }.`,
  );
  if (place.tags.length) lines.push(`- Known for: ${place.tags.map((tag) => labelOf(kit.placeTags, tag)).join(", ")}.`);
  if (place.note) lines.push(`- ${place.note}`);
  lines.push(
    ...worldLandLines(
      world,
      place.rank !== undefined ? place : (chain.find((each) => each.rank !== undefined) ?? place),
    ),
  );
  // Whose people live here, and what they believe.
  const folk = worldFolkOf(world, brief, place);
  if (folk) lines.push(`- Its people: ${folk.name}${folk.note ? `, ${folk.note.replace(/\.$/, "")}` : ""}.`);
  const faiths = worldFaithsAt(world, brief, place);
  for (const faith of faiths.holy)
    lines.push(`- Holy to ${faith.name}${faith.note ? `: ${faith.note.replace(/\.$/, "")}` : ""}.`);
  const kept = faiths.kept.filter((faith) => !faiths.holy.includes(faith));
  if (kept.length) lines.push(`- They keep ${kept.map((faith) => faith.name).join(" and ")}.`);
  // Who keeps it now, and its past (worldgen W3), told for the settlement it is in.
  const history = worldHistory(game);
  const home = place.rank !== undefined ? place : chain.find((each) => each.rank !== undefined);
  if (home) {
    const keeper = (present ?? history).keepers[home.id];
    const leader = keeper ? (present ?? history).leaders[keeper]?.name : undefined;
    const standing = keeper !== undefined ? present?.standing[keeper] : undefined;
    if (keeper) {
      lines.push(
        `- Kept by ${keeper}${leader ? `, led by ${leader}` : ""}${
          standing !== undefined ? `; the party is ${worldStandingWord(standing)} with them` : ""
        }.`,
      );
    }
    // Generator 9: the peoples who live nearby, the nearest in full.
    // The ones the story brought in are among them, with their own past.
    const peoples = [
      ...worldPeoples(kit, world, brief.peoples),
      ...worldAddedPeoples(
        kit,
        world,
        brief.peoples,
        (present?.peoples ?? []).map((people) => ({ ...people, allies: [], rivals: [] })),
      ),
    ];
    worldPeoplesNear(peoples, home)
      .slice(0, 2)
      .forEach((people, index) => lines.push(...worldPeopleLines(people, index === 0, peoples)));
    const past = worldPlacePast(history, home, 4);
    if (past.length) lines.push(`- Its past: ${past.map(worldHistoryLine).join(" ")}`);
    // What the party has done here, latest last.
    const done = [home.id, ...(place.id !== home.id ? [place.id] : []), ...(added ? [added.place.id] : [])].flatMap(
      (id) => present?.done[id] ?? [],
    );
    if (done.length) lines.push(`- Since play began: ${done.slice(-3).join(" ")}`);
  }
  // Where it goes from here: the settlement's links (or its town's, for a place inside one).
  const settlement = place.size !== undefined ? place : chain.find((each) => each.size !== undefined);
  const inside = [
    ...world.places.filter((each) => each.parentId === (settlement ?? place).id),
    ...(present?.places ?? []).filter((each) => each.parentId === (settlement ?? place).id),
  ];
  if (inside.length) lines.push(`- Inside it: ${inside.map((each) => each.name).join(", ")}.`);
  if (settlement) {
    const routes = world.links
      .filter((link) => link.from === settlement.id || link.to === settlement.id)
      .map((link) => ({ other: byId.get(link.from === settlement.id ? link.to : link.from)!, link }))
      .sort((a, b) => a.link.days - b.link.days);
    if (routes.length) {
      lines.push(
        `- From here: ${routes
          .map(
            ({ other, link }) =>
              `${describe(kit, other, present)}, ${worldTripDays(kit, link.days)} by ${labelOf(kit.travel, link.way)}`,
          )
          .join("; ")}.`,
      );
    }
  }
  // The living world (worldgen W5): the news that has reached here, and what is brewing near it.
  if (present) {
    const news = worldNewsHere(game, present, home?.id);
    if (news.length) {
      lines.push(
        `- Word that has reached here, newest first:`,
        ...news.map(
          ({ news: each, ago, rumour }) => `  - ${worldDaysAgo(kit, ago)}${rumour ? ", a rumour" : ""}: ${each.text}`,
        ),
      );
    }
    for (const { pending, weeks, ripe, here, heard } of worldBrewingNear(game, present, home?.id)) {
      const [a, b] = pending.groups;
      if (here && ripe && !pending.held) {
        lines.push(
          `- About to happen here [${pending.id}]: ${a} and ${b} are close to fighting over it. Play it out in the scene, and record how it ends.`,
        );
        continue;
      }
      lines.push(
        `- Brewing [${pending.id}]: tension between ${a} and ${b}, for ${weeks} ${weeks === 1 ? "week" : "weeks"}${
          pending.held ? ", held" : ripe ? "; it could come to blows any week" : ""
        }${heard ? "" : " (the party has not heard of it)"}.`,
      );
    }
  }
  // The people here not met yet (worldgen W2), so someone new in the scene is one of them, not a name
  // the model reaches for.
  const unmet = worldCast(game, place.id)
    .filter((person) => person.named && !at.met?.has(person.id))
    .slice(0, WHERE_YOU_ARE_PEOPLE);
  if (unmet.length) {
    lines.push(
      `- People here the party has not met. When someone new comes into the scene, make it one of them, by their full name:`,
      ...unmet.map((person) => `  - ${person.name}: ${worldPersonSheet(kit, person)}`),
    );
  }
  lines.push(...changes, `</where_you_are>`);
  return lines.join("\n");
}
