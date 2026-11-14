// ──────────────────────────────────────────────
// The model's part of a world (worldgen W1): reading the player's lore for canon places, and writing
// the brief, what else exists, in the setting kit's words. Code lays the world out from both. Canon is
// fixed: whatever the model writes, the canon places are put back exactly as they were read.
// ──────────────────────────────────────────────
import {
  WEATHER_TYPES,
  WORLD_BRIEF_LIMITS,
  WORLD_CHANGE_KINDS,
  WORLD_PEOPLE_ARCHETYPES,
  WORLD_PEOPLE_TEMPERS,
  checkWorldBrief,
  withWorldCanon as withCanon,
  worldBriefSchema,
  worldBriefDeepestLayer,
  type WorldBrief,
  type WorldBriefEvent,
  type WorldBriefPlace,
  type WorldCanonMore,
  type WorldKit,
} from "@marinara-engine/shared";

/** The kit's words the model needs, as a compact list rather than the whole kit. */
function kitWords(kit: WorldKit): string {
  const deepest = worldBriefDeepestLayer(kit);
  return [
    `Setting: ${kit.label}. ${kit.summary}`,
    `Layers, outermost first (id: word): ${kit.layers
      .slice(0, deepest + 1)
      .map((layer) => `${layer.id}: ${layer.label}${layer.settlements ? " (the settlements, which have a size)" : ""}`)
      .join("; ")}`,
    `Sizes, smallest first (id: word): ${kit.sizes.map((size) => `${size.id}: ${size.label}`).join("; ")}`,
    `Place tags (id: word): ${kit.placeTags.map((tag) => `${tag.id}: ${tag.label}`).join("; ") || "none"}`,
    `Kinds of group (id: word): ${kit.groupKinds.map((kind) => `${kind.id}: ${kind.label}`).join("; ")}`,
    `Cultures (id: word, naming): ${kit.cultures.map((culture) => `${culture.id}: ${culture.label}, ${culture.naming}`).join(" | ")}`,
  ].join("\n");
}

const TEXT_RULE = `No text may contain line breaks, square brackets or angle brackets.`;

function languageRule(language: string | undefined): string[] {
  const value = language?.trim();
  return value && value.toLowerCase() !== "english"
    ? [`- Write every name, note and the premise in ${value}. Keep keys and ids in English.`]
    : [];
}

export interface WorldBriefWritingInput {
  kit: WorldKit;
  genre: string;
  setting: string;
  tone: string;
  playerGoals?: string;
  language?: string;
  /** Places read from the player's lore, which the brief keeps exactly. */
  canon?: WorldBriefPlace[];
  /** Dated events read from the player's lore (worldgen W3), which the brief keeps exactly. */
  canonEvents?: WorldBriefEvent[];
  /** Groups, peoples, cultures and faiths read from the player's lore, which the brief keeps exactly. */
  canonMore?: WorldCanonMore;
  /** Strict: the lore's places and nothing invented beside them. */
  strict?: boolean;
  /** The Earth seed: the world is the real Earth, its map drawn from the real places the brief names. */
  earth?: { year?: number };
}

export function buildWorldBriefPrompt(input: WorldBriefWritingInput): { system: string; user: string } {
  const canon = input.canon ?? [];
  const canonEvents = input.canonEvents ?? [];
  const kindsOn = WORLD_CHANGE_KINDS.filter((kind) => input.kit.change.kinds[kind].on);
  const system = [
    `You write the brief of a role-playing game's world: what exists in it, in the words of its setting. Code lays the world out from your brief, so say what exists and what it is like, never where it lies on a map.`,
    `Return one JSON object only: {"briefVersion": 1, "premise": "...", "places": [...], "placeNames": [...], "groups": [...], "peoples": [...], "folk": [...], "faiths": [...], "peopleNames": [...], "events": [...], "environments": [...]}. No prose, no code fences.`,
    `Rules:`,
    `- "premise": the present day as the game begins, in one or two sentences: name a cause and a person or group, not a mood. At most 600 characters.`,
    `- "places": the major places, each {"name", "layer", "parent", "size", "tags", "note", "start"}. "layer" is a layer id below; "parent" is the name of another place in this list in an outer layer; "size" (settlements only) is a size id; "tags" are tag ids; "note" is one line of at most 240 characters. Mark the one place the party starts in with "start": true.`,
    input.strict
      ? `- Add no places of your own: the world is the lore's places and no more.`
      : `- Write 8 to 30 places: the outer places and the settlements that matter. The rest of the world is drawn by code.`,
    `- "placeNames": for each culture id, a list of 40 to 120 names for the places code draws, {"culture": id, "names": [...]}, in that culture's own sound as its naming note says. Names are new: not names already used in "places", not famous names from well-known fiction, and never the same few names models reach for.`,
    `- "groups": the 3 to 12 groups the present day turns on, each {"name", "kind", "seat", "note", "allies", "rivals"}: "kind" is a kind of group id below (households and shops count as well as powers); "seat" is the name of a place in "places"; "note" is what it wants, in one line; "allies" and "rivals" are names of other groups here.`,
    `- "peoples": every non-human people, race or species the setting describes (none when it describes none; humans are not one), up to ${WORLD_BRIEF_LIMITS.peoples}, each {"name", "kind", "archetype", "temper", "form", "want", "note", "home", "allies", "rivals"}: "kind" what they are in a few words; "archetype" the folklore role they fit most, one of ${WORLD_PEOPLE_ARCHETYPES.join(", ")}; "temper" how they treat humans, one of ${WORLD_PEOPLE_TEMPERS.join(", ")}; "form", "want" and "note" one line each, in the setting's own terms; "home" the name of a place in "places" they live by; "allies" and "rivals" names of other peoples here. Code adds peoples of its own only to fill out a world with fewer.`,
    `- "folk": the setting's own human cultures (nations, clans, peoples of a land), up to ${WORLD_BRIEF_LIMITS.folk}, each {"name", "note", "places"}: "note" their ways, look and tongue in one line; "places" names from "places" that are theirs (a place inside one is theirs too).`,
    `- "faiths": the setting's faiths, 1 to ${WORLD_BRIEF_LIMITS.faiths} (a world without gods still has beliefs), each {"name", "note", "holy", "followers", "groups"}: "note" what its followers believe and do, in one line; "holy" names from "places" holy to it, where it began first; "followers" names from "folk" and "peoples" who keep it; "groups" names from "groups" that serve it.`,
    `- "peopleNames": for each culture id, the names its people are given, {"culture": id, "given": [...], "family": [...], "order": "given-family" | "family-given" | "given"}: 60 to 150 given names and 40 to 150 family names (none when the culture has no family names), in that culture's own sound and order as its naming note says. Varied: no name twice, not the same few names models reach for, not famous characters' names.`,
    `- "events": up to 10 notable events of the world's past, each {"yearsAgo", "kind", "text", "places", "groups"}: "yearsAgo" a whole number of years before the present; "kind" one of ${kindsOn.join(", ")} (only these: this world has no others); "text" what happened in one line; "places" and "groups" names from "places" and "groups". The world's history is written around them.`,
    `- "environments": only places the setting or lore says are held outside nature by a curse, a power or their own strangeness (always winter, endless night, a storm that never ends); none when it says none. Each {"place", "weather", "season", "light", "note"}: "place" a name from "places", or "world" for the whole world; "weather" one of ${WEATHER_TYPES.join(", ")} when the weather is held; "season" one of spring, summer, autumn, winter when the season is held; "light" dark (always night), dusk or day when the light is held; "note" the cause in one line. Give only what is held. Ordinary climate is not one: code works out deserts and cold coasts from the map.`,
    ...(input.earth
      ? [
          `- This world is the real Earth${input.earth.year !== undefined ? ` in the year ${input.earth.year < 0 ? `${-input.earth.year} BC` : input.earth.year}` : ""}: its map is drawn from the real land around the places you name. "places" are real countries, regions and cities by their real names${input.earth.year !== undefined ? " of that year" : ""}, as the setting has them (a place the setting invents inside one is fine, its "parent" the real place it is in); "placeNames" are names for small places in the land's own languages.`,
        ]
      : []),
    `- Use only the ids listed below. ${TEXT_RULE}`,
    ...languageRule(input.language),
    `At most ${WORLD_BRIEF_LIMITS.places} places, ${WORLD_BRIEF_LIMITS.allNames} place names and ${WORLD_BRIEF_LIMITS.allPeopleNames} people's names in all.`,
  ].join("\n");
  const user = [
    kitWords(input.kit),
    ``,
    `Genre: ${input.genre}`,
    `Setting: ${input.setting}`,
    `Tone: ${input.tone}`,
    ...(input.playerGoals?.trim() ? [`Player goals: ${input.playerGoals.trim()}`] : []),
    ...(canon.length
      ? [
          ``,
          `These places come from the player's lore and are fixed. Include each exactly as given and build around them:`,
          JSON.stringify(canon),
        ]
      : []),
    ...(canonEvents.length
      ? [
          ``,
          `These events come from the player's lore and are fixed. Include each exactly as given in "events", and include the groups they name:`,
          JSON.stringify(canonEvents),
        ]
      : []),
    ...(["groups", "peoples", "folk", "faiths", "environments"] as const).flatMap((key) =>
      input.canonMore?.[key]?.length
        ? [
            ``,
            `These ${key} come from the player's lore and are fixed. Include each exactly as given in "${key}", and the places and names they refer to:`,
            JSON.stringify(input.canonMore[key]),
          ]
        : [],
    ),
  ].join("\n");
  return { system, user };
}

/** Reads what the model wrote as a brief against the kit; the version is the Engine's to set. */
export function readWrittenWorldBrief(
  kit: WorldKit,
  data: unknown,
  canon: WorldBriefPlace[] = [],
  canonEvents: WorldBriefEvent[] = [],
  canonMore: WorldCanonMore = {},
): { ok: true; brief: WorldBrief; repairs: string[] } | { ok: false; issues: string[] } {
  if (!data || typeof data !== "object" || Array.isArray(data))
    return { ok: false, issues: ["brief: Not a JSON object"] };
  return checkWorldBrief(
    kit,
    withCanon({ ...(data as Record<string, unknown>), briefVersion: 1 }, canon, canonEvents, canonMore),
  );
}

export function worldBriefRepairPrompt(issues: string[]): string {
  return [
    `That brief was refused for these reasons:`,
    ...issues.slice(0, 20).map((issue) => `- ${issue}`),
    `Return the whole corrected brief as one JSON object.`,
  ].join("\n");
}

// ── Canon from lore ──

export interface LoreEntryText {
  id: string;
  name: string;
  content: string;
}

/** Lore entries in batches of about `budget` characters, each entry whole (a long one cut to fit). */
export function loreBatches(entries: LoreEntryText[], budget = 12_000): LoreEntryText[][] {
  const batches: LoreEntryText[][] = [];
  let current: LoreEntryText[] = [];
  let size = 0;
  for (const entry of entries) {
    const text = { ...entry, content: entry.content.slice(0, budget) };
    const length = text.name.length + text.content.length;
    if (current.length > 0 && size + length > budget) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(text);
    size += length;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

export function buildWorldCanonPrompt(kit: WorldKit, batch: LoreEntryText[]): { system: string; user: string } {
  const system = [
    `You read a player's lore for a role-playing game and list every place, group, people, culture, faith and dated event it states: what the lore says exists, nothing more.`,
    `Return one JSON object only: {"places": [{"name", "layer", "parent", "size", "tags", "note", "lore"}], "events": [{"yearsAgo", "kind", "text", "places", "groups", "lore"}], "groups": [{"name", "kind", "seat", "note", "lore"}], "peoples": [{"name", "kind", "archetype", "temper", "form", "want", "note", "home", "lore"}], "folk": [{"name", "note", "places", "lore"}], "faiths": [{"name", "note", "holy", "followers", "groups", "lore"}], "environments": [{"place", "weather", "season", "light", "note", "lore"}]}. No prose, no code fences.`,
    `- Cities, towns and villages are places in the settlements layer: give each the size id the lore makes clear (a capital or great city the biggest).`,
    `- "layer" is a layer id below, the one the place fits; "parent" is the name of the place it lies in when the lore says so; "size" (settlements only) is a size id when the lore makes it clear; "tags" are tag ids the lore supports; "note" is one line of at most 240 characters in the lore's own terms; "lore" lists the ids of the entries that state the place.`,
    `- "events" are the dated events the lore states (a founding, a war, a flood, a coronation): "yearsAgo" how many years before the present, as the lore dates it; "kind" one of ${WORLD_CHANGE_KINDS.join(", ")}; "text" what happened in one line in the lore's own terms; "places" and "groups" the names it involves; "lore" the entry ids. Only events the lore dates.`,
    `- "groups" are the powers and bodies the lore names (kingdoms' rulers, houses, guilds, orders, churches and temples, gangs): "kind" a kind of group id below; "seat" the place it sits in; "note" what it wants or does.`,
    `- "peoples" are the non-human peoples, races and species the lore describes (humans are not one): "kind" what they are in a few words; "archetype" one of ${WORLD_PEOPLE_ARCHETYPES.join(", ")}; "temper" how they treat humans, one of ${WORLD_PEOPLE_TEMPERS.join(", ")}; "form", "want", "note" one line each; "home" the place they live by.`,
    `- "folk" are the human cultures the lore describes (nations, clans, the people of a land): "note" their ways, look and tongue in one line; "places" the places that are theirs.`,
    `- "faiths" are the religions, cults and beliefs the lore describes: "note" what they hold and do; "holy" places holy to them; "followers" the folk or peoples who keep them; "groups" the groups that serve them.`,
    `- "environments" are places the lore says are held outside nature by a curse, a power or their own strangeness (cursed to endless winter, never sees the sun, a storm that never ends): "place" the place's name as in "places", or "world" when the whole world is held; "weather" one of ${WEATHER_TYPES.join(", ")} when the weather is held; "season" one of spring, summer, autumn, winter when the season is held; "light" dark (always night), dusk or day when the light is held; "note" the cause in one line. Only what is held; a place's ordinary climate is not one.`,
    `- List anything only when the lore states it. Invent nothing. Leave a field out rather than guess. "lore" is always the ids of the entries that state it.`,
    `- Use only the ids listed below. ${TEXT_RULE}`,
  ].join("\n");
  const user = [
    kitWords(kit),
    ``,
    `Lore entries:`,
    ...batch.map((entry) => `[entry ${entry.id}] ${entry.name.replace(/[[\]]/g, "")}: ${entry.content}`),
  ].join("\n");
  return { system, user };
}

/**
 * Canon places from every batch, read against the kit: one place per name (a later mention adds its
 * lore entries and fills what the first left out), and lore ids only of entries that were read.
 */
export function mergeWorldCanon(
  kit: WorldKit,
  batches: unknown[],
  readIds: ReadonlySet<string>,
): { places: WorldBriefPlace[]; events: WorldBriefEvent[]; repairs: string[] } & Required<WorldCanonMore> {
  // Each list one item per name: a later mention adds its lore entries and fills what the first left out.
  const gather = (key: "places" | "groups" | "peoples" | "folk" | "faiths" | "environments", limit: number) => {
    // Held environments are one a place, by its name.
    const nameKey = key === "environments" ? "place" : "name";
    const merged = new Map<string, Record<string, unknown>>();
    for (const batch of batches) {
      const items =
        batch && typeof batch === "object" && Array.isArray((batch as Record<string, unknown>)[key])
          ? ((batch as Record<string, unknown[]>)[key] as unknown[])
          : [];
      for (const raw of items) {
        if (!raw || typeof raw !== "object" || typeof (raw as Record<string, unknown>)[nameKey] !== "string") continue;
        const item = raw as Record<string, unknown>;
        const name = String(item[nameKey]).trim().toLowerCase();
        const lore = Array.isArray(item.lore) ? item.lore.map(String).filter((id) => readIds.has(id)) : [];
        const earlier = merged.get(name);
        merged.set(name, {
          ...item,
          ...earlier,
          lore: [...new Set([...((earlier?.lore as string[] | undefined) ?? []), ...lore])].slice(0, 20),
        });
      }
    }
    return [...merged.values()].slice(0, limit);
  };
  const checked = checkWorldBrief(kit, {
    briefVersion: 1,
    premise: "canon",
    places: gather("places", WORLD_BRIEF_LIMITS.places),
    groups: gather("groups", WORLD_BRIEF_LIMITS.groups),
    peoples: gather("peoples", WORLD_BRIEF_LIMITS.peoples),
    folk: gather("folk", WORLD_BRIEF_LIMITS.folk),
    faiths: gather("faiths", WORLD_BRIEF_LIMITS.faiths),
    environments: gather("environments", WORLD_BRIEF_LIMITS.environments),
  });
  if (!checked.ok)
    return {
      places: [],
      events: [],
      groups: [],
      peoples: [],
      folk: [],
      faiths: [],
      environments: [],
      repairs: checked.issues,
    };
  // Dated events, one per text, each read on its own: an event that is not one is left out with a
  // note. Their places must be the lore's places; the groups they name are kept for the brief, which
  // is told to include them.
  const repairs = [...checked.repairs];
  const placeNames = new Set(checked.brief.places.map((place) => place.name.toLowerCase()));
  const events = new Map<string, WorldBriefEvent>();
  for (const batch of batches) {
    const raw =
      batch && typeof batch === "object" && Array.isArray((batch as { events?: unknown }).events)
        ? ((batch as { events: unknown[] }).events as unknown[])
        : [];
    for (const item of raw) {
      const parsed = worldBriefSchema.shape.events.removeDefault().element.safeParse(item);
      if (!parsed.success) {
        repairs.push("An event the lore reading wrote was not one, and was left out");
        continue;
      }
      const event = parsed.data;
      const key = event.text.toLowerCase();
      if (events.has(key)) continue;
      events.set(key, {
        ...event,
        places: event.places.filter((name) => placeNames.has(name.toLowerCase())),
        lore: (event.lore ?? []).filter((id) => readIds.has(id)),
      });
    }
  }
  return {
    places: checked.brief.places.map(({ start: _start, ...place }) => place),
    events: [...events.values()].slice(0, WORLD_BRIEF_LIMITS.events),
    groups: checked.brief.groups,
    peoples: checked.brief.peoples,
    folk: checked.brief.folk,
    faiths: checked.brief.faiths,
    environments: checked.brief.environments,
    repairs,
  };
}
