// ──────────────────────────────────────────────
// A settlement's chronicle (fork, towns that remember their history): what its past did to its people
// and what is still felt. Wars, plagues, famines, floods, fires and the places lost nearby leave losses,
// empty houses, burned plots and people come from elsewhere, each fading as the years pass and faster in
// a thriving town. The named people of the town lived through it: some died, and someone took up their
// work and their house (a spouse or a grown child, a journeyman, an outsider, or whoever their group put
// in), so the town's people as the world gives them are the living, and each successor remembers whom
// they followed.
//
// Pure: the same world gives the same chronicle. The history it reads is the compiled world's (an Earth
// world has none of its own, so nothing is felt until play adds it).
// ──────────────────────────────────────────────
import { worldStream, type WorldPlace, type WorldProsperity } from "./compile.js";
import type { GameWorld } from "./game-world.js";
import { worldHistory, type WorldHistoryEvent } from "./history.js";

/** The kinds of woe a chronicle tells apart. */
export const WORLD_WOES = Object.freeze(["war", "plague", "famine", "flood", "fire", "harm", "lost"] as const);
export type WorldWoe = (typeof WORLD_WOES)[number];

/** How far back the past is still felt: in full to here, fading to nothing by twice it. */
export const WORLD_CHRONICLE_FULL = 30;
export const WORLD_CHRONICLE_REACH = 60;

export interface WorldChronicleWoe {
  woe: WorldWoe;
  yearsAgo: number;
  text: string;
  /** How much of it is still remembered now, 1 (in full) to 0. */
  felt: number;
}

export interface WorldChronicleArrival {
  /** The place they came from, by name (a lost place has no id any more). */
  from: string;
  yearsAgo: number;
  /** Fled from a war or a lost place, or came as settlers. */
  kind: "refugees" | "settlers";
  /** Their share of the town's people now, still lodging rather than settled. */
  lodging: number;
}

export interface WorldTownChronicle {
  settlementId: string;
  woes: WorldChronicleWoe[];
  /** The share of the town's people lost and not yet made up (0 .. 0.5). */
  lost: number;
  /** The share of the men of fighting age lost to war and not yet grown back (0 .. 0.6). */
  menLost: number;
  /** The share of houses standing empty now. */
  empty: number;
  /** The share of plots burned or ruined and not yet rebuilt. */
  ruined: number;
  arrivals: WorldChronicleArrival[];
  /** The share of the town's people lodging as refugees now (lodgers, and a camp when it is more than
   *  the town takes in). */
  refugees: number;
  /** Refugees past what the town can lodge camp by a gate. */
  camp: boolean;
  /** A burial ground of the latest plague, a memorial of the latest war. */
  burialGround: boolean;
  memorial: boolean;
}

/** How a person came to stand where the one before them stood. */
export const WORLD_SUCCESSIONS = Object.freeze(["spouse", "child", "journeyman", "outsider", "appointed"] as const);
export type WorldSuccession = (typeof WORLD_SUCCESSIONS)[number];

export interface WorldPersonFate {
  /** The one who died. */
  name: string;
  yearsAgo: number;
  woe: WorldWoe;
  /** "in the war Redmark and Vell fought over Ashford", "of the plague" ... */
  cause: string;
  relation: WorldSuccession;
  /** Who put an outsider or an appointed successor in. */
  by?: string;
}

/** The woe an event of the past is, read from what it says happened; none for the rest. */
export function worldEventWoe(
  event: Pick<WorldHistoryEvent, "kind" | "text" | "severe" | "fixed" | "brewing">,
): WorldWoe | undefined {
  if (event.brewing) return undefined;
  if (!event.severe && !event.fixed) return undefined;
  const text = event.text.toLowerCase();
  if (/\b(destroyed|abandoned)\b/.test(text)) return "lost";
  if (/plague|pestilence|sickness|epidemic|\bpox\b|fever/.test(text)) return "plague";
  if (/famine|starv/.test(text)) return "famine";
  if (/flood/.test(text)) return "flood";
  if (/\bfire\b|burn/.test(text)) return "fire";
  if (/\bwar\b|battle|siege|sack|invad|conquer|took /.test(text)) return "war";
  return event.kind === "catastrophe" || event.kind === "crime" || event.kind === "conflict" ? "harm" : undefined;
}

/** How much of a woe is still felt, by how long ago it was. */
export function worldChronicleFelt(yearsAgo: number): number {
  if (yearsAgo <= WORLD_CHRONICLE_FULL) return 1;
  return Math.max(0, (WORLD_CHRONICLE_REACH - yearsAgo) / (WORLD_CHRONICLE_REACH - WORLD_CHRONICLE_FULL));
}

/** The share of the people each woe takes, and of the plots it burns or ruins. */
const LOSS: Record<WorldWoe, { people: number; men: number; ruin: number }> = {
  war: { people: 0.1, men: 0.3, ruin: 0.06 },
  plague: { people: 0.22, men: 0, ruin: 0 },
  famine: { people: 0.08, men: 0, ruin: 0 },
  flood: { people: 0.03, men: 0, ruin: 0.04 },
  fire: { people: 0.02, men: 0, ruin: 0.08 },
  harm: { people: 0.03, men: 0, ruin: 0.02 },
  lost: { people: 0, men: 0, ruin: 0 },
};
/** Years until a town's people are made up again, and its burned plots rebuilt, by how it is doing. */
const REFILL: Record<WorldProsperity, number> = { thriving: 10, modest: 16, struggling: 26 };
const REBUILD: Record<WorldProsperity, number> = { thriving: 5, modest: 9, struggling: 30 };
/** Years refugees lodge before they settle in (or move on). */
const LODGE_YEARS = 5;

const fade = (yearsAgo: number, years: number) => Math.max(0, 1 - yearsAgo / years);

/** The events that befell a settlement (or happened just beside it), oldest first. */
function eventsAt(game: GameWorld, settlement: WorldPlace): WorldHistoryEvent[] {
  return worldHistory(game).events.filter((event) => event.places.includes(settlement.id));
}

/** What was done to a place in a war: its words for the GM's line. */
function causeOf(woe: WorldWoe, event: WorldHistoryEvent): string {
  if (woe === "war") {
    const match = /^(.+?) and (.+?) went to war/.exec(event.text);
    return match ? `in the war between ${match[1]} and ${match[2]}` : "in the fighting";
  }
  return woe === "plague"
    ? "of the plague"
    : woe === "famine"
      ? "in the famine"
      : woe === "flood"
        ? "in the flood"
        : woe === "fire"
          ? "in the fire"
          : "in the troubles";
}

/** A settlement's chronicle; null for a place that is not a settlement. */
export function worldTownChronicle(
  game: GameWorld,
  settlementId: string,
  prosperityNow?: WorldProsperity,
): WorldTownChronicle | null {
  const settlement = game.world.places.find((place) => place.id === settlementId);
  if (!settlement || settlement.rank === undefined) return null;
  const prosperity = prosperityNow ?? settlement.prosperity ?? "modest";
  const woes: WorldChronicleWoe[] = [];
  let lost = 0;
  let menLost = 0;
  let ruined = 0;
  for (const event of eventsAt(game, settlement)) {
    const woe = worldEventWoe(event);
    if (!woe) continue;
    const felt = worldChronicleFelt(event.yearsAgo);
    if (felt <= 0) continue;
    woes.push({ woe, yearsAgo: event.yearsAgo, text: event.text, felt });
    // A plague carried on from elsewhere takes fewer than where it broke out.
    const scale = woe === "plague" && /spread from/.test(event.text) ? 0.6 : 1;
    lost += LOSS[woe].people * scale * fade(event.yearsAgo, REFILL[prosperity]);
    menLost += LOSS[woe].men * fade(event.yearsAgo, 20);
    ruined += LOSS[woe].ruin * fade(event.yearsAgo, REBUILD[prosperity]);
  }
  // People come from elsewhere: those who fled a war to here, and those of the places lost nearby.
  const arrivals: WorldChronicleArrival[] = [];
  const nameLower = settlement.name.toLowerCase();
  for (const event of worldHistory(game).events) {
    const woe = worldEventWoe(event);
    const fled = /went to war.*took (.+?);.*fled to (.+?)\.$/.exec(event.text);
    if (woe === "war" && fled && fled[2]!.toLowerCase() === nameLower) {
      arrivals.push({
        from: fled[1]!,
        yearsAgo: event.yearsAgo,
        kind: "refugees",
        lodging: 0.08 * fade(event.yearsAgo, LODGE_YEARS),
      });
      continue;
    }
    if (!event.places.includes(settlement.id)) continue;
    const gone = /^(.+?) was (?:destroyed in the war|abandoned after it)\.$/.exec(event.text);
    if (gone) {
      arrivals.push({
        from: gone[1]!,
        yearsAgo: event.yearsAgo,
        kind: "refugees",
        lodging: 0.05 * fade(event.yearsAgo, LODGE_YEARS),
      });
      continue;
    }
    const moved = /^(.+?) was abandoned(?: as its people moved|:)/.exec(event.text);
    if (moved && event.yearsAgo <= WORLD_CHRONICLE_FULL)
      arrivals.push({ from: moved[1]!, yearsAgo: event.yearsAgo, kind: "settlers", lodging: 0 });
  }
  arrivals.sort((a, b) => a.yearsAgo - b.yearsAgo || a.from.localeCompare(b.from));
  const refugees = Math.min(
    0.2,
    arrivals.reduce((sum, each) => sum + each.lodging, 0),
  );
  lost = Math.min(0.5, lost);
  // Lodgers fill some of the empty houses.
  const empty = Math.max(0, Math.min(0.4, lost * 0.8 - refugees * 0.5));
  const latest = (woe: WorldWoe) => woes.filter((each) => each.woe === woe).at(-1);
  return {
    settlementId,
    woes,
    lost: round(lost),
    menLost: round(Math.min(0.6, menLost)),
    empty: round(empty),
    ruined: round(Math.min(0.3, ruined)),
    arrivals,
    refugees: round(refugees),
    camp: refugees > 0.04,
    burialGround: (latest("plague")?.yearsAgo ?? Infinity) <= WORLD_CHRONICLE_FULL,
    memorial: (latest("war")?.yearsAgo ?? Infinity) <= WORLD_CHRONICLE_FULL,
  };
}

const round = (value: number) => Math.round(value * 1000) / 1000;

const SHARE_WORDS: Array<[number, string]> = [
  [0.3, "nearly a third"],
  [0.2, "about one in five"],
  [0.12, "about one in eight"],
  [0.06, "a few"],
  [0.02, "one or two in fifty"],
];
const share = (value: number) => SHARE_WORDS.find(([at]) => value >= at)?.[1];
const ago = (years: number) => (years <= 1 ? "last year" : `${years} years ago`);

/** What is still felt in a settlement, in a line for the Game Master; none when nothing is. */
export function worldChronicleLine(chronicle: WorldTownChronicle): string | undefined {
  const parts: string[] = [];
  const recent = chronicle.woes.filter((each) => each.woe !== "lost" && each.felt >= 1).slice(-2);
  if (recent.length)
    parts.push(
      recent
        .map(
          (each) =>
            `${each.text.replace(/\.$/, "").replace(/; many of its people fled to .*$/, "")} (${ago(each.yearsAgo)})`,
        )
        .join("; "),
    );
  const empty = share(chronicle.empty);
  if (empty) parts.push(`${empty} of its houses stand empty`);
  const men = share(chronicle.menLost);
  if (men && chronicle.menLost >= 0.06)
    parts.push(`${men} of its men of fighting age died in the fighting, and widows keep many households`);
  const ruined = share(chronicle.ruined);
  if (ruined) parts.push(`${ruined} of its plots are burned or ruined and not yet rebuilt`);
  const fled = chronicle.arrivals.filter((each) => each.lodging > 0.005);
  if (fled.length)
    parts.push(
      `refugees from ${fled.map((each) => each.from).join(" and ")} lodge in town${chronicle.camp ? ", more camp by a gate" : ""}`,
    );
  const settled = chronicle.arrivals.filter((each) => each.lodging <= 0.005).slice(0, 2);
  if (settled.length)
    parts.push(`families from ${settled.map((each) => each.from).join(" and ")} have settled here since`);
  if (chronicle.burialGround) parts.push("a burial ground of the plague dead lies outside the walls");
  if (chronicle.memorial) parts.push("a memorial to the war dead stands by the church");
  return parts.length ? `Still felt here: ${parts.join("; ")}.` : undefined;
}

// ── The named people's fates ──

const LEADER =
  /reeve|mayor|elder|priest|captain|lord|lady|head|chief|abbot|abbess|headman|steward|magistrate|sheriff|bailiff|warden|marshal|governor|prior|bishop/i;
const FIGHTER = /guard|soldier|smith|hunter|watch|knight|militia|sergeant|archer|mercenar|sword|warrior|ranger/i;
/** The chance a person of each age died in each woe (rough, from the ages the kit draws). */
const DEATH: Record<WorldWoe, Record<string, number>> = {
  war: { young: 0.22, "in their prime": 0.26, "middle-aged": 0.12, old: 0.04 },
  plague: { young: 0.1, "in their prime": 0.09, "middle-aged": 0.16, old: 0.3 },
  famine: { young: 0.05, "in their prime": 0.04, "middle-aged": 0.06, old: 0.12 },
  flood: { young: 0.02, "in their prime": 0.02, "middle-aged": 0.02, old: 0.03 },
  fire: { young: 0.02, "in their prime": 0.02, "middle-aged": 0.02, old: 0.03 },
  harm: { young: 0.03, "in their prime": 0.03, "middle-aged": 0.03, old: 0.03 },
  lost: { young: 0, "in their prime": 0, "middle-aged": 0, old: 0 },
};
/** How many years back a person can have taken over: a successor who came long ago is just the person. */
const FATE_REACH = WORLD_CHRONICLE_FULL;

/**
 * Who of a settlement's people died in its past and how their successor came: by person index, the same
 * for the same world. At most a third of a place's people (never its only one) are successors, so the
 * town still has its long-standing folk.
 */
export function worldCastFates(
  game: GameWorld,
  placeId: string,
  people: ReadonlyArray<{ age: string; role: string; group?: string }>,
): Map<number, WorldPersonFate> {
  const fates = new Map<number, WorldPersonFate>();
  if (game.frozen || !people.length) return fates;
  const byId = new Map(game.world.places.map((place) => [place.id, place]));
  const place = byId.get(placeId);
  const settlement = place?.rank !== undefined ? place : place?.parentId ? byId.get(place.parentId) : undefined;
  if (!settlement || settlement.rank === undefined) return fates;
  const woes = eventsAt(game, settlement)
    .map((event) => ({ event, woe: worldEventWoe(event) }))
    .filter((each): each is { event: WorldHistoryEvent; woe: WorldWoe } => !!each.woe && each.woe !== "lost")
    .filter((each) => each.event.yearsAgo <= FATE_REACH)
    // The latest first: a person dies in the latest woe that takes them.
    .sort((a, b) => a.event.yearsAgo - b.event.yearsAgo);
  if (!woes.length) return fates;
  const random = worldStream(game.seed, "fates", placeId);
  const most = Math.max(people.length > 1 ? 1 : 0, Math.floor(people.length / 3));
  const linked = game.world.links
    .filter((link) => link.from === settlement.id || link.to === settlement.id)
    .map((link) => byId.get(link.from === settlement.id ? link.to : link.from)?.name)
    .filter((name): name is string => !!name)
    .sort();
  people.forEach((person, index) => {
    const rolls = woes.map(() => random());
    const relationRoll = random();
    const fromRoll = random();
    if (fates.size >= most) return;
    const age = person.age in DEATH.war ? person.age : "in their prime";
    const found = woes.findIndex(({ woe }, at) => {
      const odds = DEATH[woe][age]! * (woe === "war" && FIGHTER.test(person.role) ? 1.6 : 1);
      return rolls[at]! < odds;
    });
    if (found < 0) return;
    const { event, woe } = woes[found]!;
    let relation: WorldSuccession;
    let by: string | undefined;
    if (LEADER.test(person.role)) {
      relation = "appointed";
      by = person.group ?? "the town";
    } else if (relationRoll < (age === "young" ? 0.5 : 0.4)) relation = "spouse";
    else if (relationRoll < 0.7 && age !== "young") relation = "child";
    else if (relationRoll < 0.9) relation = "journeyman";
    else {
      relation = "outsider";
      by = linked.length ? linked[Math.floor(fromRoll * linked.length)] : undefined;
    }
    fates.set(index, {
      name: "",
      yearsAgo: event.yearsAgo,
      woe,
      cause: causeOf(woe, event),
      relation,
      ...(by ? { by } : {}),
    });
  });
  return fates;
}

const OLDER: Record<string, string> = {
  young: "in their prime",
  "in their prime": "middle-aged",
  "middle-aged": "old",
  old: "old",
};
const YOUNGER: Record<string, string> = {
  old: "middle-aged",
  "middle-aged": "in their prime",
  "in their prime": "young",
  young: "young",
};

/** The successor's age, from the age the one who died would be now and how they are kin. */
export function worldSuccessorAge(
  age: string,
  relation: WorldSuccession,
  yearsAgo: number,
  ages: readonly string[],
): string {
  const known = ages.includes(age) && age in OLDER;
  if (!known) return age;
  // The one who died would have aged since; a spouse ages with them, a child is a step younger.
  const aged = yearsAgo >= 15 ? OLDER[age]! : age;
  if (relation === "spouse") return aged;
  if (relation === "child") return YOUNGER[aged]!;
  if (relation === "journeyman") return yearsAgo >= 12 ? "in their prime" : "young";
  return aged === "old" ? "middle-aged" : "in their prime";
}

/** How a successor is told: "took over from Hal Ashby, their late spouse, who died in the war ... 3 years ago". */
export function worldFateText(fate: WorldPersonFate): string {
  const kin =
    fate.relation === "spouse"
      ? "their late spouse"
      : fate.relation === "child"
        ? "their late parent"
        : fate.relation === "journeyman"
          ? "their late master"
          : undefined;
  const put =
    fate.relation === "outsider"
      ? `came${fate.by ? ` from ${fate.by}` : " from elsewhere"} to take over from ${fate.name}`
      : fate.relation === "appointed"
        ? `was put in by ${fate.by ?? "the town"} after ${fate.name}`
        : `took over from ${fate.name}, ${kin}`;
  return `${put}, who died ${fate.cause} ${ago(fate.yearsAgo)}`;
}
