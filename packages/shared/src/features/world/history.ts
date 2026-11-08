// ──────────────────────────────────────────────
// A world's history (worldgen W3): the world engine run from the founding to "now", a year at a time,
// with seeded dice, using only the kinds of change the world allows. It explains the world as the
// compile laid it out: every settlement is founded and grows to the size it has now, the brief's
// groups are founded, led, allied and at odds, and, where the world has them, crime, wars and
// catastrophes leave their marks, some places lost to them. It never contradicts the present: who
// keeps each place, who leads each group and how they get on at its end is the world the game begins
// in. Severe change only follows its build-up (tension before a war, a dry spell before a famine), and
// the brief's dated events are fixed points it passes through. The same inputs give the same history.
// ──────────────────────────────────────────────
import type { WorldBriefEvent } from "../../schemas/world-brief.schema.js";
import type { WorldChangeKind } from "../../schemas/world-kit.schema.js";
import { worldStream, worldTerrainEntries, type WorldPlace } from "./compile.js";
import {
  worldBoomTown,
  worldGrowthReason,
  worldLostCause,
  worldLostSite,
  worldPlaceAssets,
  worldSiteAge,
  worldWarStake,
  worldWoeOdds,
} from "./history-land.js";
import { worldPlaceNamed } from "./edits.js";
import { worldPreEdit, type GameWorld } from "./game-world.js";
import { worldFullName } from "./people.js";
import { worldPeoples } from "./peoples.js";
import { worldFaithFits, worldFolkOf } from "./faiths.js";
import { readGmTagAttributes } from "../../utils/skill-check-tag.js";

/** How many years of history each scale of world has before "now". */
export const WORLD_HISTORY_SPAN = { site: 10, town: 25, region: 60, realm: 120, world: 200, sector: 150 } as const;
/** The fewest years a severe change must have been brewing before it can happen. */
export const WORLD_BUILD_UP = { conflict: 3, catastrophe: 2 } as const;

export interface WorldHistoryEvent {
  /** Years before "now" (0 is the present year). */
  yearsAgo: number;
  /** A kind of change, or "founding" for a place or group coming into being. */
  kind: WorldChangeKind | "founding";
  text: string;
  places: string[];
  groups: string[];
  /** Severe changes (wars, catastrophes, a place lost) and what brewed before them. */
  severe?: true;
  brewing?: true;
  /** From the brief: a fixed point the history passes through. */
  fixed?: true;
}

export interface WorldHistory {
  span: number;
  /** Oldest first. */
  events: WorldHistoryEvent[];
  /** Who keeps each settlement now (a group's name), by place id. */
  keepers: Record<string, string>;
  /** Who leads each group now, and since how many years. */
  leaders: Record<string, { name: string; sinceYearsAgo: number }>;
  /** How each pair of groups gets on now (-100 to 100), keyed "A|B" in name order. */
  relations: Record<string, number>;
  /** Places that existed and are gone: where they stood, and how long ago they fell. */
  lost: Array<{ name: string; at: { x: number; y: number }; fellYearsAgo: number }>;
}

const clamp = (value: number) => Math.max(-100, Math.min(100, value));
const pick = <T>(items: readonly T[], random: () => number): T => items[Math.floor(random() * items.length)]!;
const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
/** "a hamlet", "an outpost". */
const aWord = (word: string) => `${/^[aeiou]/i.test(word) ? "an" : "a"} ${word}`;

const PACE_DENSITY = { still: 0.25, slow: 0.5, steady: 1, quick: 1.5 } as const;

// A few compiled histories, by their inputs, as the compile keeps worlds.
const cache = new Map<string, WorldHistory>();
const CACHE_SIZE = 8;

/** The world's history, the same for the same world every time. */
export function worldHistory(game: GameWorld): WorldHistory {
  if (game.frozen) return game.frozen.history;
  const key = JSON.stringify([game.seed, game.grounding, game.kit, game.brief, game.world.generatorVersion]);
  const hit = cache.get(key);
  if (hit) return hit;
  // The past is the compiled world's: hand edits (W9c) change the world from now on, never its history,
  // so the history is the same however the world was since edited.
  const run = runHistory(game.edits ? { ...game, world: worldPreEdit(game) } : game);
  // An Earth world's past is the real one, which the Game Master knows: no invented events, rulers or lost
  // towns; who keeps each place and how the groups get on stay, as the start of play's own story.
  const history = game.brief.earth ? { ...run, events: [], leaders: {}, lost: [] } : run;
  cache.set(key, history);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value!);
  return history;
}

function runHistory({ kit, brief, world, seed }: GameWorld): WorldHistory {
  const span = WORLD_HISTORY_SPAN[kit.scale];
  const on = (kind: WorldChangeKind) => kit.change.kinds[kind].on;
  const density = PACE_DENSITY[kit.change.pace];
  const sizes = kit.sizes;
  const settlements = world.places.filter((place) => place.rank !== undefined);
  const byName = new Map(world.places.map((place) => [place.name.toLowerCase(), place]));
  const events: WorldHistoryEvent[] = [];
  const add = (event: WorldHistoryEvent) => events.push(event);

  // ── Settlements: founded, oldest the biggest, and grown to the size they have now ──
  // Generator 9: the oldest on the best sites (water, a harbour, a ford, rich soil), whatever their size
  // now, and towns that grew on ore or a pass founded late, as boom towns are; each grows on what it has.
  const water = new Set(
    world.terrain.flatMap((id, index) =>
      worldTerrainEntries(kit).find((entry) => entry.id === id)?.kind === "water" ? [index] : [],
    ),
  );
  const landed = world.generatorVersion >= 9;
  const assets = landed ? worldPlaceAssets(world, water) : new Map();
  const foundingRandom = worldStream(seed, "history", "founding");
  const founded = new Map<string, number>();
  const maxRank = Math.max(1, ...settlements.map((place) => place.rank!));
  const foundingOrder = landed
    ? (() => {
        const siteOf = new Map(settlements.map((place) => [place.id, worldSiteAge(assets.get(place.id)!)]));
        const rankOf = (values: Map<string, number>) => {
          const sorted = [...settlements].sort(
            (a, b) => values.get(a.id)! - values.get(b.id)! || a.id.localeCompare(b.id),
          );
          return new Map(sorted.map((place, index) => [place.id, index / Math.max(1, sorted.length - 1)]));
        };
        const site = rankOf(siteOf);
        const size = rankOf(new Map(settlements.map((place) => [place.id, place.rank!])));
        const age = new Map(
          settlements.map((place) => [
            place.id,
            0.6 * site.get(place.id)! +
              0.4 * size.get(place.id)! -
              (worldBoomTown(assets.get(place.id)) ? 0.5 : 0) +
              foundingRandom() * 0.15,
          ]),
        );
        return [...settlements].sort((a, b) => age.get(b.id)! - age.get(a.id)! || a.id.localeCompare(b.id));
      })()
    : [...settlements].sort((a, b) => b.rank! - a.rank! || a.id.localeCompare(b.id));
  // Generator 9: a town is mostly founded by settlers from an older town of its own people, one the way
  // between them reaches (as colonies went out along coasts and rivers), else the nearest such town.
  const linked = new Map<string, string[]>();
  for (const link of world.links) {
    linked.set(link.from, [...(linked.get(link.from) ?? []), link.to]);
    linked.set(link.to, [...(linked.get(link.to) ?? []), link.from]);
  }
  const motherOf = (place: WorldPlace, year: number) => {
    const elders = settlements.filter(
      (each) => each.culture === place.culture && (founded.get(each.id) ?? 0) >= year + 3,
    );
    const ways = elders.filter((each) => linked.get(place.id)?.includes(each.id));
    if (ways.length)
      return [...ways].sort((a, b) => founded.get(b.id)! - founded.get(a.id)! || a.id.localeCompare(b.id))[0];
    const farthest = Math.max(world.width, world.height) / 6;
    return elders
      .map((each) => ({ each, distance: Math.hypot(each.at.x - place.at.x, each.at.y - place.at.y) }))
      .filter((each) => each.distance <= farthest)
      .sort((a, b) => a.distance - b.distance || a.each.id.localeCompare(b.each.id))[0]?.each;
  };
  foundingOrder.forEach((place, position) => {
    const share = 1 - place.rank! / (maxRank + 1);
    const year = landed
      ? Math.max(
          1,
          Math.round(
            span * (1 - (position / Math.max(1, foundingOrder.length)) * 0.85) - foundingRandom() * span * 0.04,
          ),
        )
      : Math.max(1, Math.round(span - share * span * 0.8 * foundingRandom()));
    const mother = landed ? motherOf(place, year) : undefined;
    founded.set(place.id, year);
    add({
      yearsAgo: year,
      kind: "founding",
      text: `${place.name} was founded, ${aWord(sizes[0]!.label)}${mother ? `, by settlers from ${mother.name}` : ""}.`,
      places: [place.id],
      groups: [],
    });
    // One step up the ladder at a time, spread over the years since, the last a while ago; a boom town
    // grows fast, in the first third of its years.
    const boom = landed && worldBoomTown(assets.get(place.id));
    const reason = landed ? worldGrowthReason(place, assets.get(place.id)) : "";
    for (let rank = 1; rank <= place.rank!; rank++) {
      const at = boom
        ? Math.max(1, Math.round(year - (year * rank) / (3 * (place.rank! + 1)) - foundingRandom() * 2))
        : Math.max(1, Math.round(year - (year * rank) / (place.rank! + 1) - foundingRandom() * 2));
      add({
        yearsAgo: at,
        kind: on("fortunes") ? "fortunes" : "founding",
        text: `${place.name} grew into ${aWord(sizes[rank]!.label)}${rank === place.rank ? reason : ""}.`,
        places: [place.id],
        groups: [],
      });
    }
  });

  // Generator 9: where a way joins towns of two peoples, the bigger sends settlers and trade down it, and
  // its speech is heard in the smaller town's market (a few such meetings, the busiest ways first).
  if (landed && kit.cultures.length > 1) {
    const contactRandom = worldStream(seed, "history", "contact");
    const label = (id: string) => kit.cultures.find((culture) => culture.id === id)?.label ?? id;
    const folkOr = (place: WorldPlace) => worldFolkOf(world, brief, place)?.name ?? label(place.culture);
    const kind = (["everyday", "fortunes", "lives"] as const).find((each) => on(each));
    const meetings = world.links
      .map((link) => [link.from, link.to].map((id) => settlements.find((place) => place.id === id)))
      .filter((ends): ends is [WorldPlace, WorldPlace] => !!ends[0] && !!ends[1] && ends[0].culture !== ends[1].culture)
      .map((ends) => ends.sort((a, b) => b.rank! - a.rank! || a.id.localeCompare(b.id)))
      .sort((a, b) => b[0].rank! + b[1].rank! - (a[0].rank! + a[1].rank!) || a[1].id.localeCompare(b[1].id));
    const met = new Set<string>();
    for (const [big, small] of meetings) {
      if (!kind || met.has(small.id) || met.size >= 3) continue;
      met.add(small.id);
      const since = Math.min(founded.get(big.id) ?? span, founded.get(small.id) ?? span);
      add({
        yearsAgo: Math.max(1, Math.round(since * (0.3 + contactRandom() * 0.5))),
        kind,
        text: `${small.name} took in settlers from ${big.name}, ${folkOr(big)} among ${folkOr(small)}; their speech is heard in its market still.`,
        places: [small.id, big.id],
        groups: [],
      });
    }
  }

  // Generator 9: each faith takes root at its holy places, then goes on along the ways to the towns whose
  // people may keep it (as faiths went along the trade roads), a few towns each, in the years after.
  if (landed && brief.faiths.length) {
    const faithRandom = worldStream(seed, "history", "faiths");
    const kind = (["everyday", "lives", "fortunes"] as const).find((each) => on(each));
    for (const faith of brief.faiths) {
      if (!kind) break;
      const holy = faith.holy
        .map((name) => worldPlaceNamed(world.places, name))
        .filter((place): place is WorldPlace => !!place);
      // A holy place that is not a town counts from the town nearest it.
      const roots = holy.map((place) =>
        place.rank !== undefined
          ? place
          : settlements.reduce((best, each) =>
              Math.hypot(each.at.x - place.at.x, each.at.y - place.at.y) <
              Math.hypot(best.at.x - place.at.x, best.at.y - place.at.y)
                ? each
                : best,
            ),
      );
      if (!roots.length || !settlements.length) continue;
      const reached = new Map<string, number>();
      for (const [index, root] of roots.entries()) {
        const year = Math.max(2, Math.round((founded.get(root.id) ?? span) * (0.7 + faithRandom() * 0.25)));
        if (reached.has(root.id)) continue;
        reached.set(root.id, year);
        add({
          yearsAgo: year,
          kind,
          text:
            holy[index]!.id === root.id
              ? `${faith.name} first took root at ${root.name}.`
              : `${faith.name} first took root at ${root.name}, by the holy place of ${holy[index]!.name}.`,
          places: [root.id],
          groups: [],
        });
      }
      let spread = 0;
      const queue = [...reached.keys()];
      while (queue.length && spread < 3) {
        const next = queue.shift();
        const from = settlements.find((place) => place.id === next)!;
        for (const id of linked.get(from.id) ?? []) {
          const to = settlements.find((place) => place.id === id);
          if (!to || reached.has(id) || spread >= 3 || !worldFaithFits(world, brief, faith, to)) continue;
          const year = Math.min(reached.get(from.id)!, founded.get(to.id) ?? span) - 1 - Math.floor(faithRandom() * 8);
          if (year < 1) continue;
          reached.set(id, year);
          queue.push(id);
          spread++;
          add({
            yearsAgo: year,
            kind,
            text: `${faith.name} spread from ${from.name} to ${to.name}.`,
            places: [to.id, from.id],
            groups: [],
          });
        }
      }
    }
  }

  // ── Groups: founded at their seats, led, and at peace or odds with each other ──
  const groupRandom = worldStream(seed, "history", "groups");
  const groups = brief.groups.map((group) => {
    const seat = group.seat ? byName.get(group.seat.toLowerCase()) : undefined;
    const seatYear = seat ? (founded.get(seat.id) ?? span) : span;
    return { ...group, seatId: seat?.id, year: Math.max(1, Math.round(seatYear * (0.4 + 0.6 * groupRandom()))) };
  });
  for (const group of groups) {
    const seat = group.seatId ? world.places.find((place) => place.id === group.seatId) : undefined;
    add({
      yearsAgo: group.year,
      kind: "founding",
      text: `${group.name} was founded${seat ? ` at ${seat.name}` : ""}.`,
      places: seat ? [seat.id] : [],
      groups: [group.name],
    });
  }
  const relations = new Map<string, number>();
  for (const group of groups) {
    for (const other of groups) {
      if (group.name >= other.name) continue;
      const allied = group.allies.includes(other.name) || other.allies.includes(group.name);
      const rival = group.rivals.includes(other.name) || other.rivals.includes(group.name);
      relations.set(pairKey(group.name, other.name), allied ? 50 : rival ? -40 : 0);
    }
  }

  // Leaders: named in their seat's culture, one after another where the world changes its leaders.
  const leaders = new Map<string, { name: string; sinceYearsAgo: number }>();
  const leaderRandom = worldStream(seed, "history", "leaders");
  // A new head never shares a name with the head of another group, so a leader is one person.
  const leaderName = (group: (typeof groups)[number]) => {
    const seat = group.seatId ? world.places.find((place) => place.id === group.seatId) : undefined;
    const names = brief.peopleNames.find((each) => each.culture === (seat?.culture ?? kit.cultures[0]!.id));
    if (!names?.given.length) return "";
    const others = new Set([...leaders].filter(([name]) => name !== group.name).map(([, each]) => each.name));
    let name = worldFullName(names, leaderRandom);
    for (let attempt = 0; attempt < 12 && others.has(name); attempt++) name = worldFullName(names, leaderRandom);
    return others.has(name) ? "" : name;
  };
  for (const group of groups) leaders.set(group.name, { name: leaderName(group), sinceYearsAgo: group.year });

  // Keepers: each settlement is kept by the group seated nearest it, if any is seated close enough.
  const keepers = new Map<string, string>();
  const seats = groups.filter((group) => group.seatId);
  const reach = Math.max(world.width, world.height) / 4;
  for (const place of settlements) {
    let best: { name: string; distance: number } | undefined;
    for (const group of seats) {
      const seat = world.places.find((each) => each.id === group.seatId)!;
      const distance = Math.hypot(seat.at.x - place.at.x, seat.at.y - place.at.y);
      if (distance <= reach && (!best || distance < best.distance)) best = { name: group.name, distance };
    }
    if (best) keepers.set(place.id, best.name);
  }

  // Places that were and are gone: named from the brief's unused place names, founded early.
  const lost: WorldHistory["lost"] = [];
  const usedNames = new Set(world.places.map((place) => place.name.toLowerCase()));
  const spareNames = brief.placeNames
    .flatMap((group) => group.names)
    .filter((name) => !usedNames.has(name.toLowerCase()));
  const lostRandom = worldStream(seed, "history", "lost");
  const lostCount = Math.min(spareNames.length, Math.floor(settlements.length / 6));
  // Generator 9: where a lost place stood is open land a few cells out, never on a place, a road or water.
  const lostTaken = new Set(world.places.map((place) => place.at.y * world.width + place.at.x));
  const roadCells = new Set(world.links.flatMap((link) => link.path ?? []));
  const barrier = new Set(
    world.terrain.flatMap((id, index) =>
      worldTerrainEntries(kit).find((entry) => entry.id === id)?.kind === "barrier" ? [index] : [],
    ),
  );
  const lostBlocked = (cell: number) => {
    const ground = parseInt(world.ground[cell]!, 36);
    return water.has(ground) || barrier.has(ground) || roadCells.has(cell);
  };
  const lostPlaces = Array.from({ length: lostCount }, (_, index) => {
    const near = pick(settlements, lostRandom);
    const at = landed
      ? worldLostSite(world, near, lostTaken, lostBlocked, lostRandom)
      : { x: Math.min(world.width - 1, near.at.x + 1), y: near.at.y };
    lostTaken.add(at.y * world.width + at.x);
    return {
      name: spareNames[index]!,
      at,
      near,
      founded: Math.max(3, Math.round(span * (0.6 + 0.4 * lostRandom()))),
      fell: undefined as number | undefined,
    };
  });
  for (const place of lostPlaces) {
    add({
      yearsAgo: place.founded,
      kind: "founding",
      text: `${place.name} was founded near ${place.near.name}.`,
      places: [place.near.id],
      groups: [],
    });
  }

  // The brief's fixed points, by the year they happen.
  const fixedByYear = new Map<number, WorldBriefEvent[]>();
  for (const event of brief.events) {
    if (event.yearsAgo > span) {
      // Older than the history the engine runs: kept as it is, before everything it writes.
      add({
        yearsAgo: event.yearsAgo,
        kind: event.kind,
        text: event.text,
        places: event.places.map((name) => byName.get(name.toLowerCase())?.id).filter((id): id is string => !!id),
        groups: event.groups,
        fixed: true,
        ...(event.kind === "conflict" || event.kind === "catastrophe" ? { severe: true as const } : {}),
      });
      continue;
    }
    fixedByYear.set(event.yearsAgo, [...(fixedByYear.get(event.yearsAgo) ?? []), event]);
  }
  const fixedPlaces = new Set(
    brief.events.flatMap((event) => event.places.map((name) => byName.get(name.toLowerCase())?.id ?? "")),
  );

  // ── The years: the engine steps from the founding to "now" ──
  const brewing = new Map<string, number>();
  const fairs = new Set<string>();
  const spreading = new Map<number, Array<{ place: WorldPlace; from: WorldPlace }>>();
  // Dry country around a place: desert, scrub, steppe or waste beside it.
  const dryAt = (place: WorldPlace) => {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [x, y] = [place.at.x + dx, place.at.y + dy];
        if (x < 0 || y < 0 || x >= world.width || y >= world.height) continue;
        const id = world.terrain[parseInt(world.ground[y * world.width + x]!, 36)] ?? "";
        if (/desert|dune|scrub|steppe|savanna|badland|dry|waste|ash/.test(id)) return true;
      }
    return false;
  };
  const prosperity = new Map(settlements.map((place) => [place.id, 50]));
  // Generator 9: how well each group holds together (asabiya, after Ibn Khaldun and Turchin). It grows
  // where its towns face an enemy, most where that enemy is another people, and wears away in a long-safe
  // heartland; in a war the side that holds together better mostly wins. A town hemmed in by heights or
  // water whose keeper loses it stays as the winner's subjects; one with open country behind it empties.
  const cohesion = new Map(groups.map((group) => [group.name, 0.5]));
  const walled = new Set<string>();
  const softened = new Set<string>();
  const hostilePeoples = landed
    ? worldPeoples(kit, world, brief.peoples).filter((people) => people.stance === "hostile")
    : [];
  const hemmed = (place: WorldPlace) => {
    let [closed, all, wet] = [0, 0, 0];
    for (let dy = -3; dy <= 3; dy++)
      for (let dx = -3; dx <= 3; dx++) {
        const [x, y] = [place.at.x + dx, place.at.y + dy];
        all++;
        if (x < 0 || y < 0 || x >= world.width || y >= world.height) continue;
        const ground = parseInt(world.ground[y * world.width + x]!, 36);
        if (water.has(ground)) wet++;
        if (water.has(ground) || barrier.has(ground)) closed++;
      }
    return closed / all >= 0.4 ? (wet * 2 > closed ? "water" : "heights") : undefined;
  };
  const alive = (group: (typeof groups)[number], year: number) => group.year >= year;
  for (let year = span; year >= 1; year--) {
    const random = worldStream(seed, "history", "year", year);
    const existing = settlements.filter((place) => (founded.get(place.id) ?? 0) >= year);
    const living = groups.filter((group) => alive(group, year));

    for (const event of fixedByYear.get(year) ?? []) {
      add({
        yearsAgo: year,
        kind: event.kind,
        text: event.text,
        places: event.places.map((name) => byName.get(name.toLowerCase())?.id).filter((id): id is string => !!id),
        groups: event.groups,
        fixed: true,
        ...(event.kind === "conflict" || event.kind === "catastrophe" ? { severe: true as const } : {}),
      });
      // A war the lore records hands its first place to its first group.
      if (event.kind === "conflict" && event.groups[0] && event.places[0]) {
        const placeId = byName.get(event.places[0].toLowerCase())?.id;
        if (placeId) keepers.set(placeId, event.groups[0]);
      }
    }

    // Everyday life: a fair or festival first held at a place that has grown.
    if (on("everyday") && existing.length && random() < 0.04 * density) {
      // Generator 9: each place's first fair once, and at a market town where roads meet when there is one.
      const unfaired = landed ? existing.filter((each) => !fairs.has(each.id)) : existing;
      const crossroads = unfaired.filter((each) => (assets.get(each.id)?.ways ?? 0) >= 3);
      const place = landed
        ? unfaired.length
          ? pick(crossroads.length ? crossroads : unfaired, random)
          : undefined
        : pick(existing, random);
      if (place) {
        fairs.add(place.id);
        add({
          yearsAgo: year,
          kind: "everyday",
          text: `${place.name} held its first fair.`,
          places: [place.id],
          groups: [],
        });
      }
    }

    // Fortunes: places drift between good and bad years.
    // How places are doing drifts whatever kinds the world has (it is state, not an event): the kinds
    // decide only what the drift may lead to, so crime can find a place on hard times without fortunes.
    {
      for (const place of existing) {
        const next =
          prosperity.get(place.id)! + (random() - 0.5) * 12 * density + (50 - prosperity.get(place.id)!) * 0.05;
        prosperity.set(place.id, Math.max(0, Math.min(100, next)));
      }
    }

    // People's lives: the heads of two groups become friends, and their groups get on better.
    if (on("lives") && living.length >= 2 && random() < 0.05 * density) {
      const a = pick(living, random);
      const b = pick(
        living.filter((group) => group !== a),
        random,
      );
      relations.set(pairKey(a.name, b.name), clamp((relations.get(pairKey(a.name, b.name)) ?? 0) + 20));
      add({
        yearsAgo: year,
        kind: "lives",
        text: `The heads of ${a.name} and ${b.name} became close friends.`,
        places: [],
        groups: [a.name, b.name],
      });
    }

    // Leadership: an old head steps down and another takes the lead.
    if (on("leadership")) {
      for (const group of living) {
        const leader = leaders.get(group.name)!;
        if (leader.sinceYearsAgo - year >= 20 && random() < 0.08 * density) {
          const name = leaderName(group);
          leaders.set(group.name, { name, sinceYearsAgo: year });
          add({
            yearsAgo: year,
            kind: "leadership",
            text: name ? `${name} took the lead of ${group.name}.` : `${group.name} chose a new head.`,
            places: group.seatId ? [group.seatId] : [],
            groups: [group.name],
          });
        }
      }
    }

    // Rivalry: groups drift apart; a group holding more than its share draws rivals.
    // How groups get on drifts the same way, so a world with conflict but no rivalry still has wars.
    if (living.length >= 2) {
      const holdings = (name: string) => [...keepers.values()].filter((keeper) => keeper === name).length;
      for (const a of living) {
        for (const b of living) {
          if (a.name >= b.name) continue;
          const key = pairKey(a.name, b.name);
          const greedy = holdings(a.name) > settlements.length * 0.4 || holdings(b.name) > settlements.length * 0.4;
          // Groups the brief calls rivals keep pulling apart; a war resets them, and they drift again.
          const rivals = a.rivals.includes(b.name) || b.rivals.includes(a.name);
          const drift = (random() - 0.55) * 10 * density - (greedy ? 6 : 0) - (rivals ? 2.5 * density : 0);
          // Stabilising: everything drifts back toward getting along.
          relations.set(key, clamp((relations.get(key) ?? 0) * 0.97 + drift));
          if (on("rivalry") && relations.get(key)! < -30 && random() < 0.03 * density) {
            add({
              yearsAgo: year,
              kind: "rivalry",
              text: `${a.name} and ${b.name} became rivals.`,
              places: [],
              groups: [a.name, b.name],
            });
          }
        }
      }
    }

    // Crime: bandits trouble a place on hard times.
    if (on("crime") && existing.length && random() < 0.05 * density) {
      const poor = existing.filter((place) => prosperity.get(place.id)! < 40);
      if (poor.length) {
        const place = pick(poor, random);
        add({
          yearsAgo: year,
          kind: "crime",
          text: `Bandits troubled the roads around ${place.name}.`,
          places: [place.id],
          groups: [],
        });
        prosperity.set(place.id, Math.max(0, prosperity.get(place.id)! - 8));
      }
    }

    if (landed) {
      const frontierRandom = worldStream(seed, "history", "frontier", year);
      for (const group of living) {
        const kept = existing.filter((place) => keepers.get(place.id) === group.name);
        if (!kept.length) continue;
        let edge = 0;
        for (const place of kept) {
          // The nearest enemy town within reach, or a hostile people's home close by.
          const foe = existing
            .filter((other) => {
              const keeper = keepers.get(other.id);
              return (
                keeper &&
                keeper !== group.name &&
                living.some((each) => each.name === keeper) &&
                (relations.get(pairKey(group.name, keeper)) ?? 0) < -20 &&
                Math.hypot(other.at.x - place.at.x, other.at.y - place.at.y) <= reach * 0.6
              );
            })
            .sort(
              (a, b) =>
                Math.hypot(a.at.x - place.at.x, a.at.y - place.at.y) -
                  Math.hypot(b.at.x - place.at.x, b.at.y - place.at.y) || a.id.localeCompare(b.id),
            )[0];
          const beast = hostilePeoples.find(
            (people) => Math.hypot(people.home.x - place.at.x, people.home.y - place.at.y) <= 6,
          );
          if (!foe && !beast) continue;
          edge += foe && foe.culture !== place.culture ? 2 : 1;
          if (walled.has(place.id) || frontierRandom() > 0.15) continue;
          const foeName = foe ? keepers.get(foe.id)! : `the ${beast!.name}`;
          const kind = (
            beast && !foe ? (["crime", "conflict", "everyday"] as const) : (["rivalry", "conflict"] as const)
          ).find((each) => on(each));
          if (!kind) continue;
          walled.add(place.id);
          add({
            yearsAgo: year,
            kind,
            text: foe
              ? `${place.name} raised walls against ${foeName}${foe.culture !== place.culture ? `, whose people were strangers to it` : ""}.`
              : `${place.name} set a watch against ${foeName}.`,
            places: [place.id],
            groups: foe ? [group.name, foeName] : [group.name],
            ...(kind === "conflict" ? { brewing: true as const } : {}),
          });
        }
        const share = Math.min(1, edge / kept.length);
        const now = cohesion.get(group.name)!;
        const next = Math.max(0.05, Math.min(0.95, now + 0.12 * now * (1 - now) * share - 0.02 * now * (1 - share)));
        cohesion.set(group.name, next);
        // A heartland long safe grows soft: told once, until a border hardens it again.
        if (next > 0.4) softened.delete(group.name);
        if (next < 0.2 && !softened.has(group.name) && group.year - year >= 30 && on("leadership")) {
          softened.add(group.name);
          const seat = group.seatId ? settlements.find((place) => place.id === group.seatId) : undefined;
          add({
            yearsAgo: year,
            kind: "leadership",
            text: `Long safe from any border, the heads of ${group.name}${seat ? ` at ${seat.name}` : ""} fell to quarrelling among themselves.`,
            places: seat ? [seat.id] : [],
            groups: [group.name],
          });
        }
      }
    }

    // Conflict: tension that has brewed long enough becomes a war over a place one side keeps.
    if (on("conflict")) {
      for (const a of living) {
        for (const b of living) {
          if (a.name >= b.name) continue;
          const key = `war|${pairKey(a.name, b.name)}`;
          if (relations.get(pairKey(a.name, b.name))! > -60) {
            brewing.delete(key);
            continue;
          }
          if (!brewing.has(key)) {
            brewing.set(key, year);
            add({
              yearsAgo: year,
              kind: "conflict",
              text: `Tension rose between ${a.name} and ${b.name}.`,
              places: [],
              groups: [a.name, b.name],
              brewing: true,
            });
            continue;
          }
          if (brewing.get(key)! - year < WORLD_BUILD_UP.conflict || random() > 0.25 * density) continue;
          const contested = (landed ? existing : settlements).filter(
            (place) => [a.name, b.name].includes(keepers.get(place.id) ?? "") && !fixedPlaces.has(place.id),
          );
          if (!contested.length) continue;
          // Generator 9: the place worth most to fight for (a pass, ore, a harbour, a ford), mostly.
          const place = landed
            ? contested
                .map((each) => ({ each, worth: worldWarStake(each, assets.get(each.id)).value + random() * 0.8 }))
                .sort((x, y) => y.worth - x.worth || x.each.id.localeCompare(y.each.id))[0]!.each
            : pick(contested, random);
          const [holdA, holdB] = [cohesion.get(a.name)!, cohesion.get(b.name)!];
          const odds = landed ? Math.max(0.15, Math.min(0.85, holdA / (holdA + holdB))) : 0.5;
          const winner = random() < odds ? a : b;
          const loser = winner === a ? b : a;
          // Generator 9: what became of its people, by the land around it.
          const shut = landed ? hemmed(place) : undefined;
          const refuge = landed
            ? existing
                .filter((each) => each !== place && keepers.get(each.id) === loser.name)
                .sort(
                  (x, y) =>
                    Math.hypot(x.at.x - place.at.x, x.at.y - place.at.y) -
                      Math.hypot(y.at.x - place.at.x, y.at.y - place.at.y) || x.id.localeCompare(y.id),
                )[0]
            : undefined;
          const after = shut
            ? `; hemmed in by the ${shut}, its people stayed and became ${winner.name}'s subjects`
            : refuge
              ? `; many of its people fled to ${refuge.name}`
              : "";
          const held =
            landed && Math.abs(holdA - holdB) > 0.2 && cohesion.get(winner.name)! > cohesion.get(loser.name)!
              ? `, its border towns holding together better,`
              : "";
          keepers.set(place.id, winner.name);
          prosperity.set(place.id, Math.max(0, prosperity.get(place.id)! - 25));
          relations.set(pairKey(a.name, b.name), -20);
          brewing.delete(key);
          add({
            yearsAgo: year,
            kind: "conflict",
            text: landed
              ? `${winner.name} and ${loser.name} went to war ${worldWarStake(place, assets.get(place.id)).phrase}; ${winner.name}${held} took ${place.name}${after}.`
              : `${winner.name} and ${loser.name} went to war; ${winner.name} took ${place.name}.`,
            places: [place.id],
            groups: [winner.name, loser.name],
            severe: true,
          });
          // A lost place near the fighting may not survive it.
          const nearby = lostPlaces.find(
            (each) => each.fell === undefined && each.near.id === place.id && each.founded > year,
          );
          if (nearby) {
            nearby.fell = year;
            add({
              yearsAgo: year,
              kind: "conflict",
              text: `${nearby.name} was destroyed in the war.`,
              places: [place.id],
              groups: [],
              severe: true,
            });
          }
        }
      }
    }

    // Catastrophe: a dry spell or a sickness that has brewed long enough becomes a famine or a plague.
    if (on("catastrophe")) {
      // Generator 9: a plague carried on along the roads from where it struck.
      for (const { place, from } of spreading.get(year) ?? []) {
        prosperity.set(place.id, Math.max(0, prosperity.get(place.id)! - 15));
        add({
          yearsAgo: year,
          kind: "catastrophe",
          text: `The plague spread from ${from.name} to ${place.name}.`,
          places: [place.id],
          groups: [],
          severe: true,
        });
      }
      for (const [key, since] of [...brewing]) {
        if (!key.startsWith("woe|") || since - year < WORLD_BUILD_UP.catastrophe || random() > 0.5) continue;
        const [, placeId, woe] = key.split("|");
        const place = settlements.find((each) => each.id === placeId)!;
        brewing.delete(key);
        prosperity.set(place.id, Math.max(0, prosperity.get(place.id)! - 35));
        add({
          yearsAgo: year,
          kind: "catastrophe",
          text:
            woe === "drought"
              ? `Famine struck ${place.name}.`
              : woe === "flood"
                ? `The river flooded ${place.name}.`
                : `Plague struck ${place.name}; many died.`,
          places: [place.id],
          groups: [],
          severe: true,
        });
        // Generator 9: a plague goes on along the roads and sea lanes to the places linked to it.
        if (landed && woe === "sickness")
          for (const link of world.links) {
            const otherId = link.from === place.id ? link.to : link.to === place.id ? link.from : undefined;
            const other = otherId ? existing.find((each) => each.id === otherId) : undefined;
            if (!other || random() > 0.5) continue;
            const at = year - 1 - Math.floor(random() * 2);
            if (at >= 1) spreading.set(at, [...(spreading.get(at) ?? []), { place: other, from: place }]);
          }
        const nearby = lostPlaces.find(
          (each) => each.fell === undefined && each.near.id === place.id && each.founded > year,
        );
        if (nearby) {
          nearby.fell = year;
          add({
            yearsAgo: year,
            kind: "catastrophe",
            text: `${nearby.name} was abandoned after it.`,
            places: [place.id],
            groups: [],
            severe: true,
          });
        }
      }
      if (existing.length && random() < 0.008 * density) {
        let place = landed ? existing[0]! : pick(existing, random);
        let woe = random() < 0.5 ? "drought" : "sickness";
        if (landed) {
          // Generator 9: the kind of woe first, then the place most open to it.
          const odds = existing.map((each) => ({ each, odds: worldWoeOdds(each, assets.get(each.id), dryAt(each)) }));
          if (odds.some((each) => each.odds.flood > 0) && random() < 0.25) woe = "flood";
          const weights = odds.map((each) => each.odds[woe as "drought" | "sickness" | "flood"]);
          const total = weights.reduce((sum, weight) => sum + weight, 0);
          let roll = random() * total;
          place =
            odds[
              Math.max(
                0,
                weights.findIndex((weight) => (roll -= weight) < 0),
              )
            ]!.each;
        }
        const key = `woe|${place.id}|${woe}`;
        if (!brewing.has(key)) {
          brewing.set(key, year);
          add({
            yearsAgo: year,
            kind: "catastrophe",
            text:
              woe === "drought"
                ? `A dry spell settled over ${place.name}.`
                : woe === "flood"
                  ? `Heavy rains swelled the river above ${place.name}.`
                  : `A sickness appeared in ${place.name}.`,
            places: [place.id],
            groups: [],
            brewing: true,
          });
        }
      }
    }
  }

  // Lost places that nothing ended went quietly: their people moved to the place nearby.
  for (const place of lostPlaces) {
    if (place.fell !== undefined) continue;
    place.fell = Math.max(1, Math.round(place.founded * lostRandom()));
    add({
      yearsAgo: place.fell,
      kind: on("fortunes") ? "fortunes" : "founding",
      text: landed
        ? `${place.name} was abandoned: ${worldLostCause(place, world, water, place.near.name)}.`
        : `${place.name} was abandoned as its people moved to ${place.near.name}.`,
      places: [place.near.id],
      groups: [],
    });
  }
  for (const place of lostPlaces) lost.push({ name: place.name, at: place.at, fellYearsAgo: place.fell! });

  // ── Generator 9: the peoples who are not human, in the past of the places near them ──
  // Each people's deeds happen at the settlement nearest its home, after that settlement's founding; a
  // road laid past its home is remembered, and how it took that follows its temper.
  if (landed) {
    const peopleRandom = worldStream(seed, "history", "peoples");
    const kindFor = (kinds: WorldChangeKind[]) => kinds.find((kind) => on(kind));
    for (const people of worldPeoples(kit, world, brief.peoples)) {
      const near = settlements.find((place) => place.id === people.nearId);
      if (!near) continue;
      const since = founded.get(near.id) ?? span;
      const harm = people.temper === "malevolent";
      const deeds = people.deeds
        .map((deed) => ({ deed, order: peopleRandom() }))
        .sort((a, b) => a.order - b.order)
        .slice(0, 1 + (peopleRandom() < 0.5 ? 1 : 0))
        .map((each) => each.deed);
      for (const deed of deeds) {
        // A deed that cost lives or ruin is told as a catastrophe or a crime, the rest as everyday life.
        const ruin =
          /\b(lost|kill|killed|vanish|vanished|drown|drowned|dead|died|missing|burn|burned|torn|raid|sicken|sickened|wasted|ruin|ruined|failed|mad)\b/i.test(
            deed,
          );
        const kind = kindFor(ruin ? ["catastrophe", "crime", "everyday"] : ["everyday", "fortunes", "lives"]);
        if (!kind) continue;
        add({
          yearsAgo: Math.max(1, Math.round(1 + peopleRandom() * (since - 1))),
          kind,
          text: deed,
          places: [near.id],
          groups: [],
          ...(ruin && harm && kind === "catastrophe" ? { severe: true as const } : {}),
        });
      }
      const road = world.links.find((link) =>
        (link.path ?? []).some(
          (cell) =>
            Math.max(
              Math.abs((cell % world.width) - people.home.x),
              Math.abs(Math.floor(cell / world.width) - people.home.y),
            ) <= 1,
        ),
      );
      const roadKind = kindFor(["everyday", "fortunes"]);
      if (road && roadKind) {
        const ends = [road.from, road.to].map((id) => world.places.find((place) => place.id === id)!);
        const laid = Math.min(...ends.map((end) => founded.get(end.id) ?? span));
        add({
          yearsAgo: Math.max(1, Math.round(laid * (0.3 + peopleRandom() * 0.5))),
          kind: roadKind,
          text: `The way between ${ends[0]!.name} and ${ends[1]!.name} was laid past the home of the ${people.name}; ${
            harm
              ? "travellers on it have gone missing since"
              : people.temper === "kindly"
                ? "they let it pass, for a toll of offerings"
                : "they drew back from it, and do not forget"
          }.`,
          places: [near.id],
          groups: [],
        });
      }
    }
  }

  // The present: the brief's allies and rivals are how the groups get on now, whatever drifted.
  for (const group of groups) {
    for (const [others, floor] of [
      [group.allies, 40],
      [group.rivals, -40],
    ] as const) {
      for (const other of others) {
        const key = pairKey(group.name, other);
        const now = relations.get(key) ?? 0;
        if (floor > 0 ? now >= floor : now <= floor) continue;
        relations.set(key, floor);
        const kind: WorldChangeKind = floor > 0 ? "lives" : "rivalry";
        if (on(kind)) {
          add({
            yearsAgo: 1,
            kind,
            text: floor > 0 ? `${group.name} and ${other} made common cause.` : `${group.name} and ${other} fell out.`,
            places: [],
            groups: [group.name, other],
          });
        }
      }
    }
  }

  // The present: how each place is doing now is the compile's, explained by its last years.
  if (on("fortunes")) {
    for (const place of settlements) {
      if (place.prosperity === "modest") continue;
      add({
        yearsAgo: 1 + (place.id.length % 3),
        kind: "fortunes",
        text: place.prosperity === "thriving" ? `${place.name} prospered.` : `${place.name} fell on hard times.`,
        places: [place.id],
        groups: [],
      });
    }
  }

  events.sort((a, b) => b.yearsAgo - a.yearsAgo || order(a) - order(b));
  return {
    span,
    events,
    keepers: Object.fromEntries([...keepers].sort(([a], [b]) => a.localeCompare(b))),
    leaders: Object.fromEntries([...leaders].sort(([a], [b]) => a.localeCompare(b))),
    relations: Object.fromEntries(
      [...relations].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, Math.round(value)]),
    ),
    lost,
  };
}

/** Within a year: foundings first, then brewing, then what happened. */
function order(event: WorldHistoryEvent): number {
  return event.kind === "founding" ? 0 : event.brewing ? 1 : 2;
}

/** The notable past of one place, oldest first: its founding and severe or fixed changes, and the
 *  latest thing that happened to it, at most `limit`. */
export function worldPlacePast(history: WorldHistory, place: WorldPlace, limit = 4): WorldHistoryEvent[] {
  const about = history.events.filter((event) => event.places.includes(place.id) && !event.brewing);
  const notable = about.filter((event) => event.kind === "founding" || event.severe || event.fixed);
  const latest = about.at(-1);
  if (!latest || notable.includes(latest)) return notable.slice(-limit);
  return [...(limit > 1 ? notable.slice(-(limit - 1)) : []), latest];
}

/** The most notable events of the world's past, oldest first: the fixed and severe ones first, the
 *  latest of them when there are more than `limit`, then changes of leadership in the room left. */
export function worldNotablePast(history: WorldHistory, limit = 5): WorldHistoryEvent[] {
  const told = history.events.filter((event) => !event.brewing);
  const weighty = told.filter((event) => event.fixed || event.severe).slice(-limit);
  const room = limit - weighty.length;
  const leadership =
    room > 0 ? told.filter((event) => event.kind === "leadership" && !weighty.includes(event)).slice(-room) : [];
  return told.filter((event) => weighty.includes(event) || leadership.includes(event));
}

/** One past event as the Game Master reads it. */
export function worldHistoryLine(event: WorldHistoryEvent): string {
  return `${event.yearsAgo === 1 ? "A year ago" : `${event.yearsAgo} years ago`}: ${event.text}`;
}

// ── Asking for more of the past ──
// The Game Master may ask for the history of a place or group the prompt does not show:
// `[history: place="Ashby"]` or `[history: group="House Vane"]`. The Engine answers the tag in place,
// and the next turn's reminder carries what was asked for, so any model can recall the past.

// A body never holds "[", so each tag is read in one pass: "[history:" repeated without a "]" cannot
// make every start scan to the end of the reply.
const HISTORY_TAG = /\[history:([^[\]]*)\]/gi;

function historyTagValues(body: string): Map<string, string> {
  return new Map(
    readGmTagAttributes(body).map((attribute) => [
      attribute.key.trim().toLowerCase(),
      attribute.rawValue
        .trim()
        .replace(/^["']|["']$/g, "")
        .trim(),
    ]),
  );
}

/** Every history tag in a reply, answered in place: a place or group the world has is ok, any other is refused. */
export function applyWorldHistoryTags(content: string, game: GameWorld): string {
  return content.replace(HISTORY_TAG, (_whole, body: string) => {
    const values = historyTagValues(body);
    const place = values.get("place");
    const group = values.get("group");
    const found = place
      ? worldPlaceNamed(game.world.places, place)?.name
      : group
        ? game.brief.groups.find((each) => each.name.toLowerCase() === group.toLowerCase())?.name
        : undefined;
    const key = place !== undefined ? "place" : "group";
    if (!found) return `[history: ${key}="${place ?? group ?? ""}" result="refused" reason="unknown"]`;
    return `[history: ${key}="${found}" result="ok"]`;
  });
}

/** What the Game Master asked for in its last reply, answered: the past of each place and group. */
export function worldHistoryAnswerText(game: GameWorld, lastReply: string): string | undefined {
  const history = worldHistory(game);
  const lines: string[] = [];
  for (const match of lastReply.matchAll(HISTORY_TAG)) {
    const values = historyTagValues(match[1] ?? "");
    if (values.get("result") !== "ok") continue;
    const place = values.get("place");
    const group = values.get("group");
    const about = place ? game.world.places.find((each) => each.name === place) : undefined;
    const events = about
      ? worldPlacePast(history, about, 6)
      : group
        ? history.events.filter((event) => event.groups.includes(group) && !event.brewing).slice(-6)
        : [];
    if (!events.length) continue;
    lines.push(`- ${place ?? group}:`, ...events.map((event) => `  - ${worldHistoryLine(event)}`));
  }
  if (!lines.length) return undefined;
  return [`<history_asked>`, `The past you asked for:`, ...lines, `</history_asked>`].join("\n");
}
