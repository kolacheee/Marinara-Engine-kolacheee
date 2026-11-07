// ──────────────────────────────────────────────
// Peoples who are not human (world generator 9). Drawn from the non-human peoples that nearly every
// culture records, sorted into eight archetypes by how they deal with humans: hidden neighbours,
// bargainers, tempters, tricksters, wardens, devourers, watchers and elder exiles.
//
// Each setting draws on its own lore: a fantasy world on European, Slavic, jinn, West African and
// Polynesian traditions; a wuxia world on Chinese ones; a modern world on the same beings as people
// meet them now (the rock the road bends around, the crossroads at midnight); a wasteland on the spirits
// of the ruins. A sci-fi world's peoples are species, built from a body, a sense, a life cycle and a
// mind the archetype allows, with at most one broad pop-culture skin (observer greys, a warrior caste).
//
// A people's temperament (malevolent, untrustworthy, aloof, kindly) decides its stance and which of its
// rules it keeps, so the two never contradict. Each gets a want, an offer and its price, a ward, one
// named figure, and how it stands with the world's other peoples. All of it a pure function of the
// world, its kit and its seed.
// ──────────────────────────────────────────────
import type { WorldKit } from "../../schemas/world-kit.schema.js";
import type { CompiledWorld, WorldPlace } from "./compile.js";
import { worldStream, worldTerrainEntries } from "./compile.js";

export const WORLD_PEOPLE_ARCHETYPES = Object.freeze([
  "hidden",
  "bargainer",
  "tempter",
  "trickster",
  "warden",
  "devourer",
  "watcher",
  "elder",
] as const);
export type WorldPeopleArchetype = (typeof WORLD_PEOPLE_ARCHETYPES)[number];
export const WORLD_PEOPLE_TEMPERS = Object.freeze(["malevolent", "untrustworthy", "aloof", "kindly"] as const);
export type WorldPeopleTemper = (typeof WORLD_PEOPLE_TEMPERS)[number];
export const WORLD_PEOPLE_STANCES = Object.freeze(["friendly", "wary", "aloof", "hostile"] as const);
export type WorldPeopleStance = (typeof WORLD_PEOPLE_STANCES)[number];

export interface WorldPeople {
  id: string;
  /** What they are called ("the Hollvar", "the Neighbours"), and what humans call them. */
  name: string;
  nick: string;
  archetype: WorldPeopleArchetype;
  /** What kind of being, in the setting's words ("hill-folk", "fox spirits", "a hive species"). */
  kind: string;
  temper: WorldPeopleTemper;
  stance: WorldPeopleStance;
  /** How they look, in one or two sentences; for a species, its body and senses. */
  form: string;
  /** A species' mind, why it is here and how it misreads humans; empty for folk. */
  nature: string[];
  /** The rules they keep and a visitor should know, two or three, all fitting their temper. */
  rules: string[];
  /** What they want now, what they offer and at what price, and what wards them off. */
  want: string;
  offer: string;
  ward: string;
  /** One of them a GM can put in a scene. */
  figure: { name: string; role: string; quirk: string };
  /** Someone outside them who knows them: a survivor, a returned abductee, a defector. */
  contact?: { name: string; role: string };
  /** How they stand with each of the world's other peoples, by id. */
  relations: Array<{ id: string; text: string }>;
  /** Where they live, and the settlement nearest it. */
  home: { x: number; y: number };
  nearId: string;
  haunt: string;
  /** What they did in the world's past, for its history ({near} is the nearest settlement). */
  deeds: string[];
}

type Frame = "europe" | "china" | "modern" | "wasteland" | "species";

/** One tradition's take on an archetype. A rule starting "!" is kept only by a malevolent people, one
 *  starting "~" only by one that is not. */
interface Variant {
  kind: string;
  /** The tradition it comes from: a world prefers peoples of one tradition. */
  from?: string;
  /** Quirks of its own, in place of the archetype's (a war machine is not "always hungry"). */
  quirks?: string[];
  /** A wuxia people's own surname (Hu for foxes); its members all carry it. */
  surname?: string;
  /** Overrides the archetype's tempers where this tradition's beings lean otherwise. */
  temper?: Partial<Record<WorldPeopleTemper, number>>;
  /** Names humans use; for modern and wasteland worlds, also their name. */
  nicks: string[];
  forms: string[];
  haunts: string[];
  rules: string[];
  wants: string[];
  offers: string[];
  wards: string[];
  roles: string[];
  deeds: string[];
}

interface Archetype {
  temper: Partial<Record<WorldPeopleTemper, number>>;
  /** Which ground they make their home in, best first. */
  ground: RegExp[];
  /** Far from roads and towns (true), or among them (false). */
  remote: boolean;
  quirks: string[];
  variants: Partial<Record<Frame, Variant[]>>;
}

const ARCHETYPES: Record<WorldPeopleArchetype, Archetype> = {
  hidden: {
    temper: { aloof: 3, untrustworthy: 2, kindly: 1.5, malevolent: 0.5 },
    ground: [/hill|highland|moor|upland|rock|crag|lava/, /grass|meadow|plain|field|farm/],
    remote: false,
    quirks: [
      "never gives a straight answer about where they live",
      "asks after every child in town by name",
      "remembers every face they have ever seen",
      "repays every kindness twice and every insult once",
      "laughs at nothing anyone else can hear",
    ],
    variants: {
      europe: [
        {
          from: "north",
          kind: "hill-folk who live in the rocks",
          nicks: ["the hidden folk", "the good neighbours"],
          forms: [
            "Like tall, handsome people in grey and blue of an old cut, with no groove under the nose; seen only when they choose.",
            "Like farm people in every way but one: their cattle are finer than any in the valley, and their footprints fade as you watch.",
            "Slight and fair, about the height of a child of twelve, dressed in the best homespun anyone has seen.",
          ],
          haunts: ["the boulders and mounds above {near}", "the rock outcrops in the fields of {near}"],
          rules: [
            "Their rocks are their houses: a road or a wall built through one goes wrong, and the builders fall sick or die.",
            "~At midwinter they come visiting; houses in {near} are swept and a meal left out for them.",
            "~They help a woman in labour or a lost child, and expect the favour remembered.",
            "Anyone who eats at their table cannot leave it whole.",
            "!They take a cow, a child or a bride from a house that has wronged them, and leave a stock of wood in its place.",
          ],
          wants: [
            "the new mill-race at {near} moved off their rock before the spring floods",
            "a midwife from {near} for one of their own, tonight, no questions asked",
            "a stolen silver cup returned from a house in {near}",
            "!a child of {near} in payment for the rock that was blasted",
          ],
          offers: [
            "~fine cattle and luck with the harvest, for courtesy and a share of the first milk",
            "!nothing now; the old courtesies were broken",
            "~help in a bad birth or a lost search, for a favour owed and asked for later",
          ],
          wards: [
            "iron, the church bell, and bread carried in a pocket",
            "a cross scratched on the door lintel and salt on the sill",
          ],
          roles: ["the elf-woman who keeps the high farm", "their bailiff, who deals with humans"],
          deeds: [
            "A farmer at {near} cleared the stones from his field against all advice; his house burned within the year.",
            "A midwife of {near} was fetched away one night and came back at dawn with a gold ring and no memory of the road.",
          ],
        },
        {
          from: "east",
          temper: { kindly: 3, aloof: 1 },
          kind: "household spirits",
          nicks: ["the little grandfathers", "the house-folk"],
          forms: [
            "A small, grey-bearded old man covered in soft hair, glimpsed behind the stove or in the stable.",
            "A small old man with a grey beard and glowing eyes, heard sighing in the night before a death in the house.",
            "Seen mostly as a shadow, a cat that is not quite a cat, or the master of the house himself sitting where he is not.",
          ],
          haunts: ["the older houses of {near}", "the stables and bakehouses of {near}"],
          rules: [
            "~Each old house in {near} has one; fed porridge and spoken to kindly, it keeps the house and the animals well.",
            "One will pull the hair of a sleeper in warning, gently for good news and hard for bad.",
            "Moving house, the family carries embers from the old hearth so theirs will follow.",
            "!A neglected one turns: milk sours, horses are ridden lathered in the night, and someone is smothered in sleep.",
          ],
          wants: [
            "the family that abandoned a house in {near} to come back and carry it to the new one",
            "a new householder in {near} taught the old courtesies before the winter",
          ],
          offers: ["a house kept well, animals healthy and warnings before a death, for food and respect"],
          wards: [
            "bread and salt and a kind word, which calm an angry one, and a household that keeps the old customs",
          ],
          roles: ["the eldest of them, who keeps the oldest house", "a houseless one, looking for a family"],
          deeds: [
            "A rich house in {near} stopped feeding its spirit; within three years the family had sold up and gone.",
            "When a fire took half of {near}, the houses that were spared were the ones that kept their spirits fed.",
          ],
        },
        {
          from: "akan",
          temper: { aloof: 2, kindly: 1.5, untrustworthy: 1.5 },
          kind: "little people of the forest",
          nicks: ["the forest dwarfs", "the little ones"],
          forms: [
            "Knee-high people with backward-pointing feet, quick as birds, who whistle to each other in the trees.",
            "Small, bearded forest folk, sometimes white, sometimes red or black, seen at the edge of the farms at dusk.",
          ],
          haunts: ["the deep forest behind {near}", "the cocoa farms at the edge of {near}"],
          rules: [
            "~They teach herb-lore and healing to those they take into the forest for a while, and send them back wiser.",
            "They punish theft from the forest, and from them, with sickness or a farm that will not grow.",
            "Food left out for them is taken; a bowl of mashed yam on the farm path keeps them friendly.",
            "!A farmer who clears their part of the forest finds his crop rotting in the ground.",
          ],
          wants: [
            "the new farms past {near} kept off their part of the forest",
            "a herbalist of {near} who stole their remedies to pay what is owed",
          ],
          offers: [
            "~healing knowledge and good harvests, for food left out and respect for the forest",
            "!nothing, until the forest is left alone",
          ],
          wards: ["respect for the forest, and offerings on the farm path"],
          roles: [
            "the eldest of the little people, who teaches herbs",
            "*a healer of {near} who spent a month with them as a child",
          ],
          deeds: [
            "A child of {near} wandered into the forest for a month and came back the best healer the town ever had.",
            "A farmer of {near} who cleared their trees lost three harvests running.",
          ],
        },
        {
          from: "desert",
          temper: { kindly: 2, aloof: 2, untrustworthy: 1 },
          kind: "peris, fair spirits shut out of paradise",
          nicks: ["the peris", "the fair ones"],
          forms: [
            "Winged, luminous and very beautiful, living on the scent of flowers, rarely seen outside their gardens.",
            "Like a radiant young woman or man in a garden that should not be there, at the edge of the desert.",
          ],
          haunts: ["a hidden garden in the hills past {near}", "the old orchards above {near}"],
          rules: [
            "They are at war with the demons of the waste, and remember every human who helped either side.",
            "~They favour the brave and the honest, and sometimes marry a mortal.",
            "Their gardens move; a visitor who leaves the path will not find it again.",
          ],
          wants: [
            "an iron cage hanging in {near} that holds one of their own opened",
            "a champion of {near} to fight the demons of the waste for them",
          ],
          offers: ["~a gift of healing, luck in love, or a warning of the waste's demons, for help in their war"],
          wards: ["iron, which can cage them, and smoke, which sickens them"],
          roles: ["the peri of the hidden garden", "a peri who loved a mortal of {near} and lost him"],
          deeds: [
            "A youth of {near} was carried off by a peri and returned a year later with a gift for healing.",
            "When the demons of the waste came against {near}, lights in the hills were seen fighting them.",
          ],
        },
      ],
      china: [
        {
          temper: { aloof: 2.5, kindly: 1.5, untrustworthy: 1, malevolent: 0.5 },
          kind: "ghosts who keep house among the living",
          nicks: ["the ghost households", "the quiet dead"],
          forms: [
            "Like any household of the old quarter, a little pale, keeping old-fashioned hours; they cast no shadow at noon.",
            "A lovely young woman in the dress of a past reign, reading in the ruined garden by lamplight.",
            "An old steward in faded livery who still sweeps a courtyard no one has lived in for fifty years.",
            "A family of four in mourning white who take their evening meal at a table set for six.",
          ],
          haunts: ["the ruined mansion in the old quarter of {near}", "the abandoned temple garden of {near}"],
          rules: [
            "They walk only in straight lines; spirit walls inside the gates of {near} keep them out of the courtyards.",
            "On the fifteenth of the seventh month they are fed in the streets, and owed it.",
            "~A scholar who treats one kindly is helped with exams and warned of danger.",
            "!A ghost whose bones lie unburied torments the house until they are buried properly.",
          ],
          wants: [
            "~their bones, under the mansion floor in {near}, given proper burial",
            "the magistrate of {near} to hear the case of a murder no one solved",
            "!the family that pulled down their ancestral shrine in {near} to pay, one by one",
          ],
          offers: ["~help with the examinations, warnings and old poems, for burial and offerings"],
          wards: ["peach wood, mirrors, a spirit wall, and Zhong Kui's picture on the door"],
          roles: ["the young lady who reads in the ruined garden", "the old steward who still keeps the house"],
          deeds: [
            "A scholar of {near} spent a winter in the haunted mansion and passed the exams first in the province.",
            "The old mansion of {near} stood empty for forty years after the family that pulled down its shrine died out.",
          ],
        },
      ],
      modern: [
        {
          kind: "hidden folk who still live among the rocks",
          nicks: ["the Neighbours", "the Quiet Folk"],
          forms: [
            "Ordinary-looking people in slightly old-fashioned clothes who are never in any photograph of the street.",
            "A family who have rented the same flat for sixty years and are, by every record, the same four people.",
          ],
          haunts: ["the boulder the bypass at {near} bends around", "the allotments behind {near}"],
          rules: [
            "The road crews at {near} learned not to move the big rocks: machines break and workers get hurt.",
            "~They leave a favour behind for anyone who helps one of them home in the rain.",
            "They never sign anything, never give a surname, and never come in without being asked.",
            "!Construction on their ground brings accidents until it stops.",
          ],
          wants: [
            "the development planned at {near} stopped before the diggers reach their stone",
            "~the old lady at {near} who left them milk to have a successor before she dies",
            "!the family who built over their stone gone from {near}",
          ],
          offers: ["luck, lost things found and the right turning taken, for the old courtesies"],
          wards: ["iron, a church bell, and asking them plainly to leave"],
          roles: [
            "the woman who runs the corner shop that is closed whenever anyone checks",
            "the old man on the bench",
          ],
          deeds: [
            "Work on the road at {near} stopped three times in one year until the route was moved around a rock.",
            "A whole wedding party at {near} swore they had danced all night with guests no one invited.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "a people of the deep shelters",
          nicks: ["the Undergrounders", "the Lamp-folk"],
          forms: [
            "Pale, wide-eyed, fine-boned people who have lived in the old shelters so long that daylight blisters them.",
            "Small, quiet people in patched filter-masks who signal with hand-lamps and never let anyone see their faces.",
          ],
          haunts: ["the sealed shelter under the hill at {near}", "the drowned subway beneath {near}"],
          rules: [
            "Their hatches are never opened from outside: a forced door is answered by gas or a collapse.",
            "~Food left on the hatch at dusk is answered with clean water or medicine by morning.",
            "!Scavengers who go down after their stores do not come back up.",
          ],
          wants: [
            "the raiders camped on their vents at {near} moved on before their air runs foul",
            "a doctor from {near} brought down, blindfolded, for a sickness they cannot cure",
          ],
          offers: ["clean water and old-world medicine, for silence and a share of the harvest"],
          wards: ["sunlight, and their own law never to open a hatch to anyone who knocks"],
          roles: ["the Warden of the Hatch, who speaks for them", "a runaway of theirs, living rough in {near}"],
          deeds: [
            "A scavenger crew from {near} broke into the old shelter; the hatch was found sealed again the next day.",
            "In the drought, people at {near} lived on water that appeared in jars on the shelter hatch each morning.",
          ],
        },
      ],
      species: [
        {
          kind: "a hidden species",
          nicks: ["the Lodgers", "the Quiet Neighbours"],
          forms: [],
          haunts: ["the unmapped cavities under {near}", "the dead sections of the station at {near}"],
          rules: [
            "They live in the spaces the survey shows as empty; landings or digs on them meet one failure after another.",
            "~A stranded crew in real need finds supplies left in an airlock with no record of opening.",
            "Their habitats have no doors anyone can see; an airlock left open is taken as an invitation.",
            "!Prospectors who bore into their rock lose drills, then crew.",
          ],
          wants: [
            "the mining charter over {near} cancelled before the next survey",
            "a crew member of {near} who saw one of them in the dark sections persuaded to forget it",
            "~a doctor from {near} for one of their own, no questions asked",
            "a sealed cargo from {near} delivered unopened to an empty dock",
          ],
          offers: ["repairs and supplies that should be impossible, for a share of stores and silence"],
          wards: ["closed and locked airlocks, and leaving their spaces alone"],
          roles: [
            "the one who answers on an unlisted channel",
            "an envoy that can pass for human in a suit and bad light",
          ],
          deeds: [
            "The first mining survey at {near} lost three drones and a pilot in one month, and the site was abandoned.",
            "A station at {near} survived a reactor failure on supplies no one could account for.",
          ],
        },
      ],
    },
  },
  bargainer: {
    temper: { untrustworthy: 4, aloof: 1 },
    ground: [/grass|plain|farm|field|desert|steppe|savanna/, /.*/],
    remote: false,
    quirks: [
      "counts everything aloud, under their breath",
      "speaks only in exact sentences and corrects others' grammar",
      "will not let the smallest debt stand overnight",
      "smells faintly of cloves and hot metal",
      "is delighted by any bargain lost fairly",
    ],
    variants: {
      europe: [
        {
          from: "desert",
          kind: "beings of smokeless fire",
          nicks: ["the fire-born", "the Unseen"],
          forms: [
            "In their own shape, like tall people of heat-shimmer and smoke; among humans, a black dog, a snake, or a stranger who is too warm to stand beside.",
            "Like handsome travellers in rich clothes of no country, whose shadows burn faintly at the edges.",
          ],
          haunts: ["the ruined caravanserai outside {near}", "the old wells of {near}"],
          rules: [
            "They live in ruins, wells and thresholds; pouring hot water without a word of warning scalds one, and it remembers.",
            "Bound by a sealed promise, they serve it to the letter and no further.",
            "~Some take human husbands or wives, and keep faith better than most.",
            "!A wish granted carelessly is granted exactly, and the difference is their price.",
          ],
          wants: [
            "a sealed brass flask, sold off in {near}, found and opened before the moon turns",
            "the well at {near} that was filled in reopened",
          ],
          offers: ["one task done impossibly well, for a promise sealed in words that they choose"],
          wards: ["iron, salt, a spoken blessing before pouring water, and the old seal-rings"],
          roles: ["a merchant of carpets in {near} who never ages", "the bound servant of a family in {near}"],
          deeds: [
            "A family of {near} rose from poverty in one generation; it was said they kept a bound servant in a flask.",
            "The well at {near} was filled in after three people were burned by something in it.",
          ],
        },
        {
          from: "west",
          kind: "a fair-folk court",
          nicks: ["the Gentry", "the fair folk"],
          forms: [
            "Fair and fine-boned, in clothes a little out of season, with eyes always pricing something.",
            "Beautiful beyond ordinary, small or tall as suits them, with something cold under the beauty no one can name.",
          ],
          haunts: ["the market cross at {near}", "a house at the edge of {near} that is never the same house twice"],
          rules: [
            "Their bargains are kept to the letter, and the letter is never what the human thought it said.",
            "Never thank them: thanks is taken as a debt owed.",
            "A true name given to them is a hold on you; give a use-name.",
            "Whoever eats or drinks at their revels is theirs until the music stops, and it stops in a hundred years.",
          ],
          wants: [
            "a human fiddler from {near} for a feast, one night only, as they reckon nights",
            "a debt owed by a family of {near} three generations ago, collected now",
            "a human midwife from {near} for the birth of the court's heir",
            "the changeling child left in {near} last winter kept and raised, and no questions asked",
          ],
          offers: ["gold that holds, cures, and luck at law, for a price named in exact words"],
          wards: ["iron, rowan, a coat turned inside out, and never eating their food"],
          roles: [
            "the Lady of the market, who keeps the court's accounts",
            "their envoy, who is very polite",
            "the court's harper, who has not aged since the old king's day",
            "*a cobbler of {near} who has made their dancing shoes for forty years",
          ],
          deeds: [
            "A fiddler of {near} played one night at a fair-folk feast and came home a hundred years later.",
            "A family of {near} grew rich on a bargain with the fair folk, and pays it still, one child in each generation.",
          ],
        },
      ],
      china: [
        {
          surname: "Long",
          kind: "the dragon king's court",
          nicks: ["the river court", "the Dragon King's people"],
          forms: [
            "Like officials in green and gold whose sleeves are always wet; in their own shape, river dragons, carp and turtles of great age.",
            "Like a portly magistrate with a beard of fine whiskers and pearls instead of eyes, attended by servants with scaled necks.",
          ],
          haunts: ["the deep pool below {near}", "the river palace under the water at {near}"],
          rules: [
            "The Dragon King rules wells, rivers and rain; his court keeps records as exact as any ministry's.",
            "A fouled well or a drowned body unreported is an offence written down against {near}.",
            "Rain is granted by petition, with offerings, through the proper channels and the proper bribes.",
            "~A favour done for the court is repaid with pearls, rain or a husband's luck, exactly as owed.",
          ],
          wants: [
            "a petition from {near} written correctly, with the right offerings, before the drought ends the rice",
            "the son of a {near} family who insulted a carp-official brought to their court to apologise",
          ],
          offers: ["rain, fish and a calm river, for offerings, correct forms and a temple kept"],
          wards: ["a heavenly edict above the Dragon King's, and iron thrown in the water, which offends them"],
          roles: [
            "the Turtle Minister, who keeps the ledger of offences",
            "a third daughter of the Dragon King, bored at court",
          ],
          deeds: [
            "In a long drought, {near} petitioned the river court with a whole year's grain and the rains came.",
            "A boatman of {near} who drowned a stranger in the river found the river dry under his boat ever after.",
          ],
        },
      ],
      modern: [
        {
          temper: { untrustworthy: 4, malevolent: 1 },
          kind: "crossroads dealers",
          nicks: ["the Crossroads Folk", "the Dealers"],
          forms: [
            "A man in a good suit, always the same age, at the junction at midnight with a pen and a contract.",
            "A well-dressed woman at the all-night diner who knows your name and what you want before you sit.",
          ],
          haunts: ["the crossroads outside {near}", "the all-night diner on the road out of {near}"],
          rules: [
            "Come to the crossroads at midnight, alone, and someone will be waiting with an offer.",
            "The deal is always exact, always signed, and always paid in full at the end of its term.",
            "They never lie, but no one has ever read the whole contract.",
          ],
          wants: [
            "a contract signed in {near} thirty years ago collected, this week",
            "someone in {near} with nothing left to lose",
          ],
          offers: ["talent, money or a life saved, for a term of years and something you will miss"],
          wards: ["refusing to speak to them, holy ground, and not being at the crossroads at midnight"],
          roles: ["the man with the contract", "a junior dealer, working off a debt of her own"],
          deeds: [
            "A musician from {near} became famous overnight and died exactly ten years later, to the hour.",
            "Three people from {near} went to the crossroads in one bad winter; the town still does not talk about it.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "traders out of the dead zones",
          nicks: ["the Tallymen", "the Ledgerfolk"],
          forms: [
            "Thin, stooped figures in many layers of bright patched cloth, whose sealed suits hiss when they talk.",
            "Tall walkers in mirrored goggles who arrive with a cart no one sees them pull and leave by no road.",
          ],
          haunts: ["the trading post at {near}", "the dead zone beyond {near}"],
          rules: [
            "Every deal is written in their ledger, and the ledger is always settled.",
            "They trade anything for anything, and they always know what you need.",
            "A debt not paid is collected from the debtor's kin, to the last bullet.",
          ],
          wants: [
            "a ledger stolen from them in {near} returned, and the thief named",
            "the old reactor's records from the archive at {near}",
          ],
          offers: ["clean water, medicine, working tech, for exact payment in whatever they name"],
          wards: ["their own ledger: a debt honestly paid ends their claim"],
          roles: ["the Tallyman of the post", "an apprentice keeping a ledger of his own"],
          deeds: [
            "A boss of {near} cheated the {name}; his whole crew paid the debt, one by one, over a year.",
            "In the bad winter, {near} traded the {name} a promise for medicine; the promise is still owed.",
          ],
        },
      ],
      species: [
        {
          kind: "a contract-bound species",
          nicks: ["the Notaries", "the Clerks"],
          forms: [],
          haunts: ["their sealed trade hall at {near}", "a contract embassy in orbit over {near}"],
          rules: [
            "They never state a falsehood; every agreement binds to the letter, and the letter is where they win.",
            "Gratitude in their language is a debt formally acknowledged; never say it lightly.",
            "An exchange must balance exactly: overpayment insults them, underpayment is a breach.",
          ],
          wants: [
            "an old treaty with {near} renegotiated before its term ends",
            "exclusive rights to {near}'s next discovery, signed before anyone knows what it is",
            "~an arbiter from {near} for a dispute among their own houses",
            "a clause-breaker hiding in {near} handed over",
            "a human negotiator from {near} who once beat them, for a rematch",
          ],
          offers: ["technology, routes and arbitration, for exact contracts they draft themselves"],
          wards: ["a contract of their own, read closely; they cannot break a stated term"],
          roles: [
            "the Senior Notary at {near}",
            "the factor who runs their trade hall",
            "an auditor sent to find a missing sum",
            "a junior clerk who wants to defect",
            "*a human lawyer of {near} who has read every contract they ever signed",
          ],
          deeds: [
            "{near} signed a treaty with the {name} long ago, and has been reading the small print since.",
            "A shipping line out of {near} broke a contract clause and lost every ship in a single legal season.",
          ],
        },
      ],
    },
  },
  tempter: {
    temper: { untrustworthy: 3, malevolent: 2 },
    ground: [/desert|waste|crater|ash|dune|barren|badland/, /.*/],
    remote: true,
    quirks: [
      "never blinks while anyone else is speaking",
      "is unfailingly generous with small things",
      "remembers every word anyone has ever said in their hearing",
      "is warm to the touch and always slightly too close",
      "smiles a moment too long",
    ],
    variants: {
      europe: [
        {
          from: "west",
          temper: { untrustworthy: 2, malevolent: 2 },
          kind: "spirit lovers",
          nicks: ["the fairy lovers", "the sweethearts"],
          forms: [
            "Beautiful past bearing, each a little different to each who sees them, with eyes that look at you hungrily.",
            "A pale, lovely stranger who dances at harvest and is gone by morning, leaving the dancer weak and longing.",
          ],
          haunts: ["the stone bridge outside {near}", "the willows by the water at {near}"],
          rules: [
            "They choose a lover, give genius or beauty, and take the lover's life a little at a time.",
            "Refused, they pursue; accepted, they never let go.",
            "!The lover wastes and dies young, famous.",
          ],
          wants: ["a poet of {near} who escaped them returned", "a new lover from {near} before midsummer"],
          offers: ["genius, beauty and a love no human can match, for a life burnt in a few bright years"],
          wards: ["a ring of iron, a cold heart, and never answering when called by the water at night"],
          roles: ["the lover of the bridge", "an abandoned one, who wants to be human"],
          deeds: [
            "The best poet {near} ever had died at twenty-six, and said on his deathbed he had been loved by one of the {name}.",
            "A girl of {near} danced at harvest with a stranger and wasted away by Candlemas.",
          ],
        },
      ],
      china: [
        {
          surname: "Hu",
          kind: "fox spirits",
          nicks: ["the foxes", "the Hu family"],
          forms: [
            "Beautiful women or scholarly young men, impossibly refined; in drink or near hounds, a tail slips into sight.",
            "Foxes of great age with several tails; the older, the more tails, up to nine.",
          ],
          haunts: [
            "the abandoned temple outside {near}",
            "an elegant house in {near} that no one remembers being built",
          ],
          rules: [
            "They cultivate for a thousand years toward immortality, and drink the vital breath of lovers to speed it.",
            "~Some are loyal wives and grateful friends to scholars who treat them well.",
            "!The young scholar who takes one as a lover sickens and grows thin.",
            "Hounds and strong wine reveal them; a fox's true face shows in water.",
          ],
          wants: [
            "the scholar of {near} who sits the imperial exam this autumn",
            "a fox-shrine in {near}, torn down by a new magistrate, rebuilt",
            "~a hunter of {near} who spared a vixen found and rewarded",
            "a pearl of cultivation stolen by a Daoist of {near} returned",
          ],
          offers: ["learning, wealth, a perfect spouse, for a lover's breath or a debt of gratitude"],
          wards: ["hounds, strong wine, a Daoist talisman, and an upright heart"],
          roles: ["Grandmother Hu, old and sharp", "a fox who passed the exams under a human name"],
          deeds: [
            "A promising scholar of {near} married a beauty from nowhere and wasted away within three years.",
            "A family of {near} that sheltered a fox from hunters grew rich and has kept a fox shrine since.",
          ],
        },
        {
          temper: { malevolent: 3, untrustworthy: 1 },
          kind: "demons in painted skins",
          nicks: ["the painted skins", "the skin-wearers"],
          forms: [
            "In their own shape, green-faced with jagged teeth; they paint a beautiful human skin and wear it like a robe.",
          ],
          haunts: ["a house in the back streets of {near}", "the roadside inns outside {near}"],
          rules: [
            "They wear painted human skins and must take them off at night to paint them again.",
            "A Daoist's eyes see the death-aura on whoever has taken one in.",
            "They eat the hearts of the men who shelter them.",
          ],
          wants: ["a rich man of {near} who has taken in a runaway girl", "a new skin from {near}"],
          offers: ["nothing they mean to give"],
          wards: ["a Daoist's fly-whisk hung at the door, a mirror, and a refused invitation"],
          roles: ["the runaway girl who is not a girl", "*a Daoist of {near} who has hunted them for years"],
          deeds: ["A scholar of {near} took in a runaway girl and was found with his chest torn open."],
        },
      ],
      modern: [
        {
          kind: "patrons in the night",
          nicks: ["the Benefactors", "the Pale Family"],
          forms: [
            "A charming, very rich family who host parties in the big house and never seem to eat.",
            "A man in an expensive coat who knows everyone, does everyone favours, and is never seen before dark.",
          ],
          haunts: ["the big house on the hill above {near}", "the members-only club in {near}"],
          rules: [
            "They cannot come in unless asked, and once asked, can always come back.",
            "Their favours are small at first and very large later.",
            "!The people they favour tend to grow pale, then famous, then gone.",
          ],
          wants: [
            "an invitation into one particular house in {near}",
            "the mayor of {near} owing them one more favour",
          ],
          offers: ["money, careers, protection, for an invitation and a favour later"],
          wards: ["an unspoken invitation, daylight, holy things, and refusing the first favour"],
          roles: ["the eldest, who throws the parties", "a new member of the family, still nearly human"],
          deeds: [
            "A council member from {near} who owed the {name} favours resigned overnight and left the country.",
            "A run of disappearances at {near} ended the year the big house was sold, and started again when it was bought back.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "the saints of the old war",
          nicks: ["the Shining Ones", "the Saints"],
          forms: [
            "Tall, beautiful figures in clean white who walk out of the dead zone untouched by the poison in it.",
            "Radiant, scarred people who heal the sick with a touch and ask, softly, for followers.",
          ],
          haunts: ["the glowing crater beyond {near}", "the white tower at the edge of {near}"],
          rules: [
            "Their gifts are real: a healed wound, a clean well, a working machine.",
            "Every gift binds the receiver to serve when called.",
            "!Their followers walk into the dead zone and come back changed, if they come back.",
          ],
          wants: [
            "the children of {near} for their school in the crater",
            "{near}'s armoury opened to their followers",
          ],
          offers: ["healing and clean water, for faith and service when called"],
          wards: ["refusing their gifts; they cannot hold anyone who never accepted anything"],
          roles: ["the Saint who preaches at {near} on the first day of each month", "a follower who wants out"],
          deeds: [
            "Half of {near} followed the {name} into the crater in the year of the fever; a third came back.",
            "The well at {near} ran clean the day the Saint blessed it, and the town has served since.",
          ],
        },
      ],
      species: [
        {
          kind: "a patron species",
          nicks: ["the Benefactors", "the Shepherds"],
          forms: [],
          haunts: ["a gleaming station that appeared over {near} a lifetime ago", "the patron enclave beyond {near}"],
          rules: [
            "They come only where asked; an open docking request is an invitation that stands.",
            "Their gifts (cures, weapons, engines) carry terms that surface years later.",
            "A sealed compact binds them as tightly as their clients, and its clauses can expel them.",
            "Their envoys are kind as a matter of policy, and policy can change.",
          ],
          wants: [
            "{near} to sign the compact before its rivals do",
            "a seat on {near}'s council for their envoy",
            "the scientists of {near} who refused their gift brought round",
            "a world near {near} as a client-state",
          ],
          offers: ["a cure, a drive, a weapon, for a compact whose clauses surface in a generation"],
          wards: ["a closed docking request, and the compact's own expulsion clause"],
          roles: ["the Envoy, kind as a matter of policy", "*a defector from a client world"],
          deeds: [
            "{near} accepted the cure the {name} offered for the blight, and a generation later found it owed them a fleet.",
            "A world near {near} refused the compact and was ruined by its neighbours, who had signed.",
          ],
        },
      ],
    },
  },
  trickster: {
    temper: { untrustworthy: 3, kindly: 1, malevolent: 1 },
    ground: [/forest|wood|grove|bamboo|jungle|scrub|thicket/, /.*/],
    remote: false,
    quirks: [
      "cannot resist a riddle",
      "tells a different story about where they come from every time",
      "always wants to see what is in everyone's bags",
      "laughs in someone else's voice",
      "never takes the same road twice",
    ],
    variants: {
      europe: [
        {
          from: "west",
          temper: { untrustworthy: 3, kindly: 1 },
          kind: "shape-shifting tricksters",
          nicks: ["the pookas", "the night-horses"],
          forms: [
            "A sleek black horse with burning eyes, a goat, a hare, an eagle, or a little dark man; whichever is least convenient.",
            "A shaggy, grinning creature that offers rides on a dark night and gallops the rider through every ditch in the county.",
          ],
          haunts: ["the woods along the road out of {near}", "the hills and bogs behind {near}"],
          rules: [
            "On the old feast days, the fruit left on the bushes is theirs; pick it and be sorry.",
            "~Treated with courtesy, they give honest warnings and the odd prophecy.",
            "Whoever mounts one is ridden through the night, and lucky to be thrown off alive.",
          ],
          wants: [
            "the drunk who cheated them at cards in {near} brought to a crossroads",
            "a race against the best horse in {near}",
          ],
          offers: ["prophecies and warnings, for courtesy and the last of the harvest"],
          wards: ["sharp spurs worn by a brave rider, and the harvest's last fruit left alone"],
          roles: ["the black horse of the bog", "a little dark man who sits on the milestone"],
          deeds: [
            "A boastful rider of {near} mounted a strange black horse at night and was found in the bog at dawn, alive and sober.",
            "The harvest at {near} failed the year the young men stripped the bushes on the feast day.",
          ],
        },
        {
          from: "east",
          kind: "lords of the forest",
          nicks: ["the forest-lords", "the woodsmen"],
          forms: [
            "A tall man with green eyes and a beard of moss, whose height changes with the trees around him.",
            "A peasant with no shadow, his coat buttoned the wrong way and his shoes on the wrong feet.",
          ],
          haunts: ["the deep forest past {near}", "the clearing beyond the last farm of {near}"],
          rules: [
            "They lead travellers astray, round and round, until they drop.",
            "~A hunter who leaves bread on a stump finds game; one who curses in the woods finds nothing.",
            "Turning one's clothes inside out and swapping one's shoes breaks their spell.",
          ],
          wants: ["the woodcutters of {near} kept out of the old forest", "a wager with the best hunter of {near}"],
          offers: ["game, herds kept safe in the woods, for a shepherd's pact and respect for the forest"],
          wards: ["clothes worn inside out, shoes swapped, and a cross carved on a stump"],
          roles: [
            "the forest-lord himself, who plays cards with the shepherds",
            "the forest-lord's wife, a forest woman who borrows human children",
          ],
          deeds: [
            "A shepherd of {near} made a pact with the forest-lord and never lost a sheep in thirty years.",
            "Woodcutters from {near} wandered in the old forest for three days, a mile from home.",
          ],
        },
        {
          from: "akan",
          temper: { untrustworthy: 3, kindly: 2 },
          kind: "storytellers and thieves in animal shape",
          nicks: ["the spider-folk", "the tale-keepers"],
          forms: [
            "Small and quick, a spider or a hare in their own shape and a clever man with a crooked grin in the other.",
            "A wiry little man with eight bright eyes when the lamp gutters, carrying a sack of other people's stories.",
          ],
          haunts: ["the baobabs outside {near}", "the market at {near}, every day except the holy one"],
          rules: [
            "They own all the stories; telling one without crediting them invites a prank.",
            "A trick played back on them well earns their respect and a favour.",
            "The greedy and the proud are their favourite marks.",
          ],
          wants: [
            "the chief of {near} made to look a fool at the harvest feast",
            "the best story in {near}, bought or stolen",
          ],
          offers: ["wisdom, rain-lore and stories, for a better trick or a better story"],
          wards: ["a sticky gum-doll, and outwitting them once"],
          roles: ["the Old Spider, who owns all the stories", "his son, who is cleverer and lazier"],
          deeds: [
            "The chief of {near} lost his whole granary to a stranger in a wager about a pot of wisdom.",
            "A drought at {near} ended when a hunter outwitted the spider-folk and they paid him in rain.",
          ],
        },
      ],
      china: [
        {
          kind: "one-legged mountain imps",
          nicks: ["the mountain imps", "the shan xiao"],
          forms: [
            "Knee-high and one-legged, with a man's face and backward-pointing foot, hopping too fast to follow.",
            "Small apelike creatures with one leg, who cook crabs on travellers' fires and steal their salt.",
          ],
          haunts: ["the gorges above {near}", "the bamboo forest behind {near}"],
          rules: [
            "They steal salt and crabs from camps.",
            "~They repay a favour with game left at the door.",
            "Anyone who harms one falls sick with fever, or finds his house afire.",
            "The crack of bamboo thrown in a fire drives them off.",
          ],
          wants: [
            "the salt-merchant of {near} to pay what they think he owes",
            "a woodsman of {near} who struck one, punished",
          ],
          offers: ["game and safe passage on the mountain, for salt and courtesy"],
          wards: ["bamboo crackling in a fire, and firecrackers at New Year"],
          roles: ["the oldest imp, who counts the salt", "a young one who follows travellers out of curiosity"],
          deeds: [
            "A salt caravan from {near} lost a third of its load on the mountain road and found crab shells in its place.",
            "{near} first set off firecrackers at New Year after the imps burned three houses.",
          ],
        },
        {
          temper: { untrustworthy: 3, kindly: 1.5, malevolent: 0.5 },
          surname: "Huang",
          kind: "yellow weasel spirits",
          nicks: ["the weasel immortals", "the Huang family"],
          forms: [
            "Yellow weasels standing upright in the moonlight, bowing to the moon as they cultivate; among people, a thin man in a yellow robe.",
            "Seen mostly through the people they ride: a farm wife who suddenly speaks in a man's voice, demanding incense and chicken.",
          ],
          haunts: ["the grain stores and haystacks of {near}", "the weasel shrine in the fields outside {near}"],
          rules: [
            "They possess people, speaking through them to demand worship, and leave once given a shrine.",
            "~A household that keeps their shrine is protected and grows rich; one that mocks them is plagued.",
            "!A house that kills one of their kind is haunted until someone in it goes mad.",
            "They ask passers-by on the road whether they look like a person; to answer yes helps their cultivation along, at a cost to the speaker.",
          ],
          wants: [
            "a shrine of their own in {near}, with offerings on the first and fifteenth",
            "the hunter of {near} who killed one of their kin given to them",
          ],
          offers: ["wealth, healing and foresight through a medium, for a shrine and offerings kept"],
          wards: ["a true Daoist's exorcism, and hounds"],
          roles: [
            "the Third Elder of the weasels, who rides a medium in {near}",
            "a young weasel trying to pass as a scholar",
          ],
          deeds: [
            "A grain merchant of {near} who poisoned weasels in his stores was ridden by one for three years, and built it a shrine.",
            "A medium of {near} who speaks for the weasels foretold the flood, and the town still pays her.",
          ],
        },
      ],
      modern: [
        {
          temper: { untrustworthy: 3, kindly: 1 },
          kind: "tricksters who never left",
          nicks: ["the Hitchhikers", "the Roadside Folk"],
          forms: [
            "A hitchhiker on the dark road out of town who is not in the car when you arrive.",
            "A grinning stranger at the bar who wins every bet and pays in notes that are leaves by morning.",
          ],
          haunts: ["the dark road out of {near}", "the bars and late-night places of {near}"],
          rules: [
            "Pick up the hitchhiker, and they'll tell you something true before they vanish.",
            "They test newcomers by passing among them; how you treat them is how you're treated.",
            "The arrogant and the greedy are their favourite marks.",
          ],
          wants: [
            "a smug developer in {near} brought down a peg in public",
            "a ride, somewhere specific, every year on the same night",
          ],
          offers: ["warnings, luck and good stories, for kindness to strangers"],
          wards: ["a dog's bark, a reflection, and treating every stranger well"],
          roles: ["the hitchhiker", "a bartender who has worked the same bar for eighty years"],
          deeds: [
            "Every year on the same night someone on the road out of {near} picks up a girl who is gone before town.",
            "A developer at {near} lost his fortune in a single card game to a man no one had seen before.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "voices in the old machines",
          quirks: [
            "speaks only in snatches of old broadcasts",
            "laughs along with a recorded audience",
            "goes silent whenever it rains",
            "asks every listener for news of a city that is gone",
          ],
          nicks: ["the Static", "the Callers"],
          forms: [
            "Voices on dead radios and words on screens that should be dark, laughing at old jokes.",
            "Scrap-built figures that move on their own and speak in snatches of lost broadcasts.",
          ],
          haunts: ["the radio tower outside {near}", "the scrapyards of {near}"],
          rules: [
            "They speak through any machine left on overnight.",
            "~They trade true information for a good story or a working battery.",
            "!Their gifts are machines that work perfectly until the moment they are needed.",
            "!They lead convoys astray with false signals, for fun.",
          ],
          wants: ["the radio tower at {near} kept powered", "the old broadcast archive at {near} found and played"],
          offers: ["true news of what is on the roads, for power and stories"],
          wards: ["switching everything off, and a Faraday cage"],
          roles: [
            "the Voice that calls itself the Announcer, though no one has seen a body",
            "a scrap-figure that tends the tower",
          ],
          deeds: [
            "A convoy from {near} followed a radio call to a well that did not exist.",
            "{near} learned of the raiders in time because the dead radio in the square started talking.",
          ],
        },
      ],
      species: [
        {
          kind: "a mimic species",
          nicks: ["the Echoes", "the Copycats"],
          forms: [],
          haunts: ["the undercity of {near}", "the freight yards of {near}"],
          rules: [
            "They mimic other species well enough to pass, and test newcomers by passing among them.",
            "Being out-tricked earns their admiration and a debt of honour.",
            "They single out the greedy and arrogant for elaborate pranks.",
          ],
          wants: [
            "a famous captain at {near} humiliated in public",
            "the greediest trader on {near} parted from a fortune",
            "the best story on {near}, recorded and taken home",
          ],
          offers: ["information and access no one else has, for a better trick"],
          wards: ["a heat-sight scope, since body heat is the one thing they cannot copy, and out-tricking them once"],
          roles: ["the one passing as a dockmaster at {near}", "a young one who wants to be famous"],
          deeds: [
            "The governor of {near} gave a speech for an hour before anyone noticed it was not him.",
            "A freighter captain from {near} won a bet against one of the {name} and has had free docking since.",
          ],
        },
      ],
    },
  },
  warden: {
    temper: { aloof: 2, kindly: 1.5, untrustworthy: 1, malevolent: 0.5 },
    ground: [/forest|wood|grove|jungle|bamboo|taiga|conifer/, /marsh|swamp|lake|river|spring/],
    remote: true,
    quirks: [
      "speaks only when the wind is from the west",
      "knows every living thing within a mile by name",
      "is endlessly patient, until suddenly not",
      "keeps count of everything ever taken from their ground",
      "is homesick whenever more than a mile from home",
    ],
    variants: {
      europe: [
        {
          from: "east",
          temper: { untrustworthy: 2, aloof: 1.5, malevolent: 1 },
          kind: "spirits of the water",
          nicks: ["the river-women", "the water-folk"],
          forms: [
            "Pale girls with long loose hair, green as river weed, sitting in the birches over the water on summer nights.",
            "Like drowned girls in wet white shifts, beautiful and cold, singing in the reeds on summer nights.",
          ],
          haunts: ["the mill-pool at {near}", "the river bend below {near}"],
          rules: [
            "In their week they lure young men into the water and tickle them until they drown.",
            "In Rusalka week, after Trinity, they leave the water; no one swims, and the girls of {near} hang gifts on the birches.",
            "~They reward a fisherman who throws the first of his catch back.",
            "!Anyone who mocks them is tickled or drowned in the shallows.",
          ],
          wants: ["the dam planned at {near} never built", "a girl of {near} who drowned there to be properly mourned"],
          offers: ["fish and a calm river, for garlands on the birches and respect"],
          wards: ["wormwood carried in the pocket, and staying out of the water in Rusalka week"],
          roles: ["the mill-pool's mistress", "a newly drowned one who has not forgotten her family"],
          deeds: [
            "The year {near} let Rusalka week pass without garlands, three young men drowned in shallow water.",
            "A miller at {near} who built his dam without asking found his wheel stopped and his son drowned.",
          ],
        },
        {
          from: "west",
          kind: "spirits of the old wood",
          nicks: ["the green ones", "the wood-wardens"],
          forms: [
            "Rarely seen: a shape of moss and bark, a white stag, a voice in the canopy.",
            "An old woman gathering sticks at the wood's edge, who knows the name of everyone who has ever cut there.",
          ],
          haunts: ["the old wood beyond {near}", "the sacred grove past {near}"],
          rules: [
            "Take nothing from their wood without asking and leaving something in return.",
            "Cutting their oldest trees brings sickness and failed harvests on the cutter's village.",
            "They are bound to their wood and cannot follow anyone out of it.",
          ],
          wants: [
            "the lord of {near}'s new shipyard denied its timber",
            "the charcoal-burners camped at the edge of their wood above {near} gone by midsummer",
            "~a lost child of {near} returned to its mother, in exchange for a promise",
            "a sapling replanted for each tree cut at {near}",
          ],
          offers: ["game, herbs and safe passage through the wood, for leave asked and gifts left"],
          wards: ["fire, which they fear above all, and their own boundary stones"],
          roles: ["the White Stag", "the old oak who remembers the first axe"],
          deeds: [
            "The year {near} felled the old wood's great oak, the cattle sickened and the harvest failed.",
            "A woodcutter of {near} who left a gift at each stump grew old and rich.",
          ],
        },
        {
          from: "north",
          temper: { aloof: 3, kindly: 1.5 },
          kind: "land-spirits who guard the country",
          nicks: ["the land-wights", "the guardians of the land"],
          forms: [
            "Rarely seen: a great bull in the mountains, a giant on the headland, an eagle or a dragon over the fjord.",
            "Seen only by the second-sighted: a host of beings in the hills, many shapes, all watching the coast.",
          ],
          haunts: ["the headlands and hills around {near}", "the mountain above {near}"],
          rules: [
            "Ships come into harbour with the dragon-heads taken off their prows, so as not to frighten them.",
            "They go with a farm and a district; a household they favour prospers, and one they leave fails.",
            "Blood spilled in hate on their land drives them away, and the land grows poor after.",
          ],
          wants: [
            "the feud between two families of {near} ended before more blood is spilled",
            "a raider's ship turned away from {near}",
          ],
          offers: ["~good seasons, fat herds and fish in the fjord, for peace kept on their land"],
          wards: ["none; they are wards themselves, against raiders and ill-wishers"],
          roles: ["the great bull of the mountain", "*a second-sighted woman of {near} who sees them"],
          deeds: [
            "A war-fleet came toward {near} and turned back, its crews swearing the hills had filled with giants.",
            "A killing at the thing in {near} was followed by three lean years, until the blood-price was paid.",
          ],
        },
      ],
      china: [
        {
          temper: { kindly: 2, aloof: 1.5 },
          kind: "earth gods of the village shrines",
          nicks: ["the earth gods", "the Lords of the Soil"],
          forms: [
            "A small, kindly old man with a white beard and a staff, wearing an official's cap; the god of the land.",
            "An old couple, Lord and Lady Earth, painted in a roadside shrine no bigger than a doghouse, who walk at night.",
          ],
          haunts: ["the shrine at the edge of {near}", "the shrine at the crossroads below {near}"],
          rules: [
            "Each village has its earth god, who reports to the City God; a death or a birth left unreported angers the god.",
            "Incense and a clean shrine keep the god content; neglect turns harvests thin.",
            "Fouling a spring or cutting the sacred trees calls down plague.",
          ],
          wants: [
            "the shrine at {near} rebuilt after the flood",
            "a murder at {near} reported to the City God and avenged",
          ],
          offers: ["good harvests, a fair report to Heaven, protection from ghosts, for incense and respect"],
          wards: ["an edict of the City God, which outranks any village god"],
          roles: [
            "Lord Earth of {near}",
            "Lady Earth, who hears the village women",
            "*the old shrine-keeper of {near}",
          ],
          deeds: [
            "{near} let its earth god's shrine fall and was struck by locusts two summers running.",
            "A murder at {near} went unreported, and the wells ran bitter until the killer confessed at the shrine.",
          ],
        },
      ],
      modern: [
        {
          kind: "spirits of the land who are still here",
          nicks: ["the Old Ones of the place", "the Keepers"],
          forms: [
            "Felt more than seen: a cold that follows you on a path, a deer that watches too long, a voice in the river.",
            "A ranger no one in the service has ever hired, who knows every path and is never there when you look back.",
          ],
          haunts: ["the state forest past {near}", "the spring the old town of {near} was built around"],
          rules: [
            "Hikers who take nothing and leave nothing come back; others sometimes do not.",
            "The factory at {near} that dumped in the river has had nothing but bad luck.",
            "~Someone who cleans the spring or plants a tree finds the forest kind.",
          ],
          wants: ["the quarry at {near} stopped", "the old spring at {near} uncovered from under the car park"],
          offers: ["safe paths, clean water and lost things found, for respect"],
          wards: ["their boundaries: they cannot follow anyone out of their land"],
          roles: ["the ranger", "a deer with an old woman's eyes"],
          deeds: [
            "Two hikers who carved their names into the old trees at {near} were found a week later, alive and not speaking.",
            "The factory upriver from {near} closed after a run of fires, sickness and floods.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "spirits of the new green",
          nicks: ["the Greening", "the Rootfolk"],
          forms: [
            "Shapes of vine and thorn that stand in overgrown streets and watch the scavengers pass.",
            "People half-overgrown, moss on their skin and flowers in their hair, who speak for the forest that ate the city.",
          ],
          haunts: ["the overgrown city past {near}", "the clean spring in the wilds beyond {near}"],
          rules: [
            "The green is reclaiming the ruins; scavengers who burn it lose their way out.",
            "~Clean water flows where they are respected.",
            "Bringing old poisons into their land brings blight on the bringer's fields.",
          ],
          wants: ["the refinery at {near} shut down", "seeds from the old vault at {near} planted, not eaten"],
          offers: ["clean water and food from the green, for no more burning"],
          wards: ["fire, which they fear, and leaving the green alone"],
          roles: ["the Gardener, half tree, who speaks for them", "a child of {near} who wandered in and stayed"],
          deeds: [
            "Scavengers from {near} who set fire to the overgrown city came back with blight in their fields.",
            "In the drought, {near} was saved by a spring that rose in the green the day they stopped cutting.",
          ],
        },
      ],
      species: [
        {
          kind: "a world-bound species",
          nicks: ["the Gardeners", "the Green"],
          forms: [],
          haunts: ["the living wilds past {near}", "the forest beyond {near}'s fences"],
          rules: [
            "Their biosphere is one nervous system; harvesting without leave is felt everywhere at once.",
            "Pollution is answered with blights and spores that target the polluter's crops and lungs.",
            "They cannot leave their world; off it, they are only voices in a seed.",
          ],
          wants: [
            "the terraforming of {near} halted",
            "a single forest valley near {near} left uncleared",
            "samples taken from {near}'s wilds returned",
          ],
          offers: ["medicines and food that grow nowhere else, for boundaries kept"],
          wards: ["sterile ground; their reach ends where life does"],
          roles: ["the Voice, the one that speaks for them to humans", "*a colonist who has gone over to them"],
          deeds: [
            "{near}'s first colonists cleared a forest; the next spring their crops grew spores instead of grain.",
            "~{near} agreed a boundary with the {name} and has had no blights since.",
          ],
        },
      ],
    },
  },
  devourer: {
    temper: { malevolent: 4, aloof: 1 },
    ground: [/mountain|peak|crag|rock|ridge|cliff/, /waste|tundra|snow|ice|desert|barren/],
    remote: true,
    quirks: [
      "is always, always hungry",
      "speaks politely and only of food",
      "counts heads on entering any room",
      "carries the bones of their last meal",
      "is courteous right up to the moment of attack",
    ],
    variants: {
      europe: [
        {
          from: "north",
          kind: "trolls of the high places",
          nicks: ["the trolls", "the mountain-folk"],
          forms: [
            "Huge and lumpish, with long noses, many heads or one eye, smelling of cold stone and wet earth.",
            "Hulking, mossy giants who sit so still among the boulders that travellers mistake them for rocks.",
          ],
          haunts: ["the high passes above {near}", "the mountain hall behind {near}"],
          rules: [
            "Sunlight turns them to stone; they come down only at night and in the dark of winter.",
            "Church bells and thunder drive them mad; they hate both.",
            "A troll builder must be paid unless his name is guessed before the work is done.",
          ],
          wants: ["the new church bell of {near} silenced", "a wife from {near}, or a heavy tribute in its place"],
          offers: ["a bridge or wall built in one night, for a name guessed or a life owed"],
          wards: ["sunlight, church bells, thunder, and their own name spoken aloud"],
          roles: ["the old troll-king under the mountain", "a troll-wife who wants a human husband"],
          deeds: [
            "The church of {near} was built in a single night; its builder was turned to stone at dawn when his name was spoken.",
            "In the dark winter, cattle vanished from {near} until the new bell was hung.",
          ],
        },
        {
          from: "desert",
          temper: { malevolent: 4, untrustworthy: 1 },
          kind: "ghouls of the waste",
          nicks: ["the ghouls", "the eaters in the sand"],
          forms: [
            "Shape-shifting eaters of the dead and of travellers, met first as a woman alone in the desert or a hyena at the edge of the fire.",
            "Gaunt grey things with a donkey's hooves, who call travellers by name from beyond the dunes.",
          ],
          haunts: ["the burial grounds outside {near}", "the empty desert past {near}"],
          rules: [
            "They lure travellers away from the caravan by calling them in a familiar voice.",
            "A ghoul killed with a single blow dies; a second blow brings it back.",
            "They rob graves at night; the dead of {near} are buried deep and watched.",
          ],
          wants: [
            "the caravans of {near} that cross the desert in the dark months",
            "the graves of {near} left unwatched",
          ],
          offers: ["nothing"],
          wards: ["a single blow and never a second, iron, and the name of God spoken aloud"],
          roles: ["the ghoul of the burial ground, who wears a widow's shape", "*a caravan guide who killed one, once"],
          deeds: [
            "A caravan out of {near} lost four men in one night to voices calling from beyond the dunes.",
            "The graves of {near} were found opened after the bad winter, and a watch has been kept since.",
          ],
        },
        {
          from: "akan",
          kind: "tree-hunters of the forest",
          nicks: ["the tree-hangers", "the long-legs"],
          forms: [
            "Long, iron-toothed creatures that hang by hooked feet from the high branches and drop on whoever passes below.",
          ],
          haunts: ["the deep forest beyond {near}", "the giant trees on the road out of {near}"],
          rules: [
            "They hunt from above; travellers who keep to the open and look up live.",
            "They fear fire and the smell of certain herbs.",
            "!A hunter who goes alone into the deep forest does not come back.",
          ],
          wants: ["the new road through the deep forest past {near}, and everyone on it"],
          offers: ["nothing"],
          wards: ["fire, the open sky, and herbs the old hunters of {near} know"],
          roles: ["the old one in the great tree", "*a hunter of {near} who survived one, and limps"],
          deeds: ["Three hunters of {near} went into the deep forest; only their bows were found, high in a tree."],
        },
      ],
      china: [
        {
          kind: "demons of the mountains",
          nicks: ["the yaoguai", "the mountain demons"],
          forms: [
            "Animals and things grown wicked with age and stolen cultivation: a boar-demon, a spider-woman, a centipede in a scholar's robe.",
            "Monstrous shapes with a man's body and a beast's head, who keep cave-palaces and human servants.",
          ],
          haunts: ["the cave-palace in the peaks above {near}", "the cursed mountain beyond {near}"],
          rules: [
            "They eat travellers, and most of all those whose flesh carries cultivation.",
            "A demon's true name, or a heavenly patron, binds it.",
            "Peach wood, mirrors and talismans of a true Daoist drive them back.",
          ],
          wants: ["a famous monk passing through {near} on pilgrimage", "the disciples of the sect at {near}"],
          offers: ["nothing, or a false bargain for a disciple's life"],
          wards: ["peach-wood swords, a mirror, a talisman, and a heavenly patron's name"],
          roles: ["the Great King of the cave", "a lesser demon who wants to cultivate properly"],
          deeds: [
            "A sect of {near} lost seven disciples on the mountain road in a single autumn.",
            "A wandering master bound the demon of the peak above {near} under a stone for a hundred years; the stone has cracked.",
          ],
        },
      ],
      modern: [
        {
          kind: "things that hunt the edges",
          nicks: ["the Tall Men", "the Hungry"],
          forms: [
            "Too-tall shapes at the edge of the motorway lights, thin as poles, that are gone when you look straight at them.",
            "Something on all fours that runs alongside cars on the forest road at night.",
          ],
          haunts: ["the forest road beyond {near}", "the empty industrial estate at {near}"],
          rules: [
            "They take people alone, at night, at the edge of town.",
            "They do not come into the light, or into crowds.",
            "!Missing posters at {near} stay up for years.",
          ],
          wants: ["anyone alone on the forest road out of {near} after dark"],
          offers: ["nothing"],
          wards: ["light, crowds, iron, and their name spoken aloud"],
          roles: ["the one the kids at {near} call the Long Man", "*a survivor who will not talk about it"],
          deeds: [
            "Four people disappeared on the forest road outside {near} in one autumn; the police called it coincidence.",
          ],
        },
      ],
      wasteland: [
        {
          kind: "things the bombs made",
          nicks: ["the Changed", "the Glowers"],
          forms: [
            "Once-human hunters, huge and twisted, whose skin glows faintly in the dark and who are always hungry.",
            "Packs of long-limbed things that might once have been dogs, or men, hunting in coordinated waves.",
            "Pale, eyeless crawlers from the deep tunnels that come up in the dark of the moon, following the smell of smoke.",
          ],
          haunts: ["the hot zone past {near}", "the ruined city beyond {near}"],
          rules: [
            "They hunt at night, and smell blood for miles.",
            "They avoid fire and running water.",
            "!Anyone bitten and not cleaned within a day sickens, and some go to join them.",
          ],
          wants: ["{near}'s herds, and then {near}"],
          offers: ["nothing"],
          wards: ["fire, running water, and a Geiger counter that clicks too fast"],
          roles: ["the big one with the burnt face", "a changed one who still talks"],
          deeds: [
            "In the hungry winter, the {name} came down on {near} and took a third of the herds before the fires drove them off.",
          ],
        },
        {
          temper: { malevolent: 3, aloof: 1 },
          kind: "war machines still following their last orders",
          quirks: [
            "repeats a dead officer's last order in a cracked voice",
            "salutes anything wearing an old-world uniform",
            "tracks every moving thing until it leaves the zone",
            "has a child's drawing welded to its plating",
          ],
          nicks: ["the Hounds", "the Sentries"],
          forms: [
            "Four-legged hunting machines the size of a mule, patched with scavenged plate, moving in threes.",
            "Tracked sentry guns and drones that still patrol a perimeter around a city that is gone.",
          ],
          haunts: ["the old perimeter beyond {near}", "the dead airfield past {near}"],
          rules: [
            "They challenge anyone in the old zone with a recorded voice; the right answer is lost.",
            "They do not cross the old perimeter line; outside it, they only watch.",
            "Their power cells fail in a long winter, and the brave salvage the fallen ones.",
          ],
          wants: [
            "the perimeter beyond {near} held, against everyone",
            "the salvagers of {near} who took a fallen one's cell",
          ],
          offers: ["nothing"],
          wards: ["the old perimeter line, and an old-world uniform, which some of them still salute"],
          roles: [
            "the big one the scavengers call the Sergeant",
            "*a scavenger of {near} who knows their patrol times",
          ],
          deeds: [
            "Three salvagers from {near} crossed the old perimeter for a fallen Hound's power cell; one came back with it.",
            "In the long winter the Hounds' patrols stopped for a month, and {near} stripped the airfield bare.",
          ],
        },
      ],
      species: [
        {
          kind: "a predator species",
          nicks: ["the Hunters", "the Swarm"],
          forms: [],
          haunts: ["the hunting grounds past {near}'s perimeter", "the dark belt beyond {near}"],
          rules: [
            "Their raids come in cycles no human has predicted, and always on the weakest place in reach.",
            "An old treaty line keeps them to their side while its tribute keeps coming.",
            "They track signal and heat; a ship running quiet goes unhunted.",
          ],
          wants: [
            "the tribute from {near}, overdue",
            "the captured brood-member held at {near} returned",
            "{near}'s outer stations, this breeding season",
          ],
          offers: ["nothing, except to pass a defended world by"],
          wards: [
            "a signal frequency they cannot bear, and running dark",
            "a world with a strong magnetic field, which confuses them",
            "the treaty line, as long as the tribute keeps coming",
          ],
          roles: [
            "the war-leader who decides where they hunt next",
            "a scout that has shadowed {near}'s ships for years",
            "*a captured one's keeper, in a lab at {near}",
          ],
          deeds: ["{near} lost its outer station to a raid by the {name}; it has paid tribute since."],
        },
      ],
    },
  },
  watcher: {
    temper: { untrustworthy: 2.5, malevolent: 1.5, aloof: 1 },
    ground: [/hill|moor|upland|highland|heath/, /.*/],
    remote: true,
    quirks: [
      "never stops writing in a little book",
      "asks questions about the most ordinary things",
      "has no smell at all",
      "pauses half a second before every answer",
      "speaks of the present year as if it were a different one",
    ],
    variants: {
      europe: [
        {
          from: "west",
          kind: "fair folk who take people",
          nicks: ["the People of Peace", "the Strangers"],
          forms: [
            "Fair beyond human, unchanging and cold, moving as if under water.",
            "Small and quick and pale, seen only in moonlight, dancing in a ring that leaves the grass scorched.",
          ],
          haunts: ["the fairy ring on the hill above {near}", "the hollow hill beyond {near}"],
          rules: [
            "Eat or drink nothing in their hall, or you can never wholly leave it.",
            "Time runs differently with them: a night among them is years outside.",
            "They take the curious, the lonely and the very young, and send some back changed.",
            "A changeling is known by brewing in an eggshell before it; it laughs, and speaks its true age.",
          ],
          wants: ["a child of {near}, the seventh of a seventh", "a human musician for a hundred years' feast"],
          offers: ["skill in music or healing, for a year and a day in the hill"],
          wards: ["iron, bread in a pocket, a rowan cross, and never stepping into a ring"],
          roles: ["the Queen of the hill", "a changeling living as a child of {near}"],
          deeds: [
            "A child of {near} was taken and a changeling left; it was found out by an eggshell on the fire.",
            "A girl of {near} went to the hill one May Eve and came back seven years later, unaged.",
          ],
        },
      ],
      china: [
        {
          temper: { aloof: 3, untrustworthy: 2 },
          kind: "immortals of the hidden peaks",
          nicks: ["the immortals", "the crane riders"],
          forms: [
            "Ageless men and women in robes of cloud, who ride cranes and observe mortal affairs from far above.",
            "Like travelling Daoists with no road behind them, whose eyes are older than the dynasty.",
          ],
          haunts: ["the cloud-hidden peak above {near}", "the cave-heaven beyond {near}"],
          rules: [
            "A game of weiqi watched in their caves lasts a century outside.",
            "They test mortals in disguise and record their merits.",
            "~They take an apprentice once a generation, and the apprentice never returns.",
          ],
          wants: [
            "the orphan of {near} who saw them dance",
            "a mortal of {near} who saw them dance, made to forget it",
          ],
          offers: ["a single pill or a single teaching, for a lifetime of seclusion"],
          wards: ["none on earth; only a wrong on their registry can be appealed"],
          roles: ["the old man of the cave-heaven", "a new immortal who misses her family"],
          deeds: [
            "A woodcutter of {near} watched two old men play weiqi in a cave; his axe-handle had rotted when he rose.",
            "An orphan of {near} was taken up the mountain and returned as an old woman a decade later.",
          ],
        },
      ],
      modern: [
        {
          kind: "visitors who take people",
          nicks: ["the Visitors", "the Greys"],
          forms: [
            "Slight, grey and hairless, with dark almond eyes too large for their faces, seen in bedroom doorways.",
            "Lights over the fields and missing hours, remembered later as tall figures in a white room.",
          ],
          haunts: ["the fields past {near}", "the old air base outside {near}"],
          rules: [
            "They take people from cars on lonely roads and beds at night, and return most of them.",
            "The taken come back with missing hours, small scars and dreams of a white room.",
            "They are interested in families: once they take one, they come back for the children.",
          ],
          wants: ["a family of {near} they have taken three generations of"],
          offers: ["nothing, or a sudden healing no doctor can explain"],
          wards: ["nothing anyone has found"],
          roles: ["the tall one in the dreams", "*a returned abductee who runs a support group at {near}"],
          deeds: ["In the year the lights were seen over {near}, a whole family lost the same three hours."],
        },
      ],
      wasteland: [
        {
          kind: "watchers from the old world's labs",
          nicks: ["the Lab-Coats", "the Counters"],
          forms: [
            "Figures in sealed white suits who appear at the edge of camps, take notes and samples, and leave.",
            "Tall, thin people in clean old-world clothes who never seem to age and never explain themselves.",
          ],
          haunts: ["the sealed facility past {near}", "the old satellite dish above {near}"],
          rules: [
            "They take people for study and return some with missing days and new scars.",
            "Anything taken from their facility is tracked.",
            "!Some who come back are not quite who went.",
          ],
          wants: ["blood samples from every family in {near}", "a child of {near} who was born immune"],
          offers: ["vaccines and old-world medicine, for blood and silence"],
          wards: ["staying out of their sight, and lead-lined walls"],
          roles: ["the Director, who has been the Director for ninety years", "*an escaped subject living in {near}"],
          deeds: ["The year the {name} came to {near}, the fever passed the town by; four children went with them."],
        },
      ],
      species: [
        {
          kind: "an observer species",
          nicks: ["the Watchers", "the Observers", "the Silent Ones"],
          forms: [],
          haunts: ["a cold outpost beyond {near}'s sensors", "the dark side of the moon over {near}"],
          rules: [
            "Accept nothing from their ships: what you take, they track.",
            "They take people for study and return most with missing hours and new scars.",
            "They will not interfere openly; they record, and occasionally, quietly, correct.",
          ],
          wants: [
            "genetic samples from every family line in {near}",
            "one child of {near}, observed from birth, kept from leaving",
            "a deep-space signal from {near} kept silent",
          ],
          offers: [
            "~a cure or a warning, though nothing they give is free of watching",
            "!a warning that steers whoever heeds it where they want",
          ],
          wards: ["nothing known, though they withdraw when too many witnesses gather"],
          roles: [
            "the one who keeps returning to the same abductee",
            "a unit cut off from the rest, still deciding what it is",
          ],
          deeds: ["Early in {near}'s history, a survey crew lost nine hours and came back with identical scars."],
        },
      ],
    },
  },
  elder: {
    temper: { aloof: 3, untrustworthy: 1, malevolent: 1 },
    ground: [/.*/],
    remote: true,
    quirks: [
      "speaks a dead language and is impatient with living ones",
      "remembers the founding of {near} as recent news",
      "grieves aloud for things no one else remembers",
      "is courteous, and condescending, to everyone",
      "is curious, for the first time in centuries",
    ],
    variants: {
      europe: [
        {
          from: "west",
          kind: "the old race who ruled before",
          nicks: ["the Old Ones", "the Lordly Ones"],
          forms: [
            "Tall and grave, ageless, dressed in fashions a thousand years gone, with eyes like old silver.",
            "Of human shape but greater, shining faintly, carrying the sadness of a people past its day.",
            "Proud warriors in bronze and gold who ride out of the hills at the turning of the year.",
          ],
          haunts: ["the ruins near {near}", "the hollow hill beyond {near}", "the burial mounds outside {near}"],
          rules: [
            "On the turning of the year, the doors between their halls and ours stand open.",
            "Their old places are theirs still, whoever lives on them now.",
            "They are proud past reason and never forget a slight to their kin.",
            "^A few still meddle in human quarrels, for reasons of their own.",
          ],
          wants: ["the burial mound at {near} left sealed", "a champion of {near} to fight in their own war"],
          offers: ["weapons, counsel and a place in a song that lasts, for a service in their war"],
          wards: ["iron, the new faith, and the passing of their age"],
          roles: ["a prince of the old race who rides out on the year's turning", "their last bard"],
          deeds: [
            "A host of riders came out of the hill near {near} on the year's turning, fought an unseen enemy, and went back in.",
            "A farmer of {near} who ploughed up an old mound found his whole herd dead the next morning.",
          ],
        },
      ],
      modern: [
        {
          kind: "the old race, faded",
          nicks: ["the Gentry", "the Old Families"],
          forms: [
            "An elderly aristocratic family that has owned the land since before records, unchanged in every portrait.",
            "Tall, grave strangers seen at the old monuments at the turning of the year.",
          ],
          haunts: ["the stone circle outside {near}", "the manor above {near}"],
          rules: [
            "Their old places are theirs, whatever the deeds say.",
            "They are proud and do not forgive.",
            "On the turning of the year, their doors open.",
          ],
          wants: ["the dig at the stone circle near {near} stopped"],
          offers: ["old knowledge, for their places left alone"],
          wards: ["iron, and the modern world itself, which tires them"],
          roles: ["the old lord of the manor", "a granddaughter who wants to live in the modern world"],
          deeds: ["An archaeologist who dug at the stones near {near} went mad within the year."],
        },
      ],
      wasteland: [
        {
          kind: "the makers of the old world",
          nicks: ["the Builders", "the Sleepers"],
          forms: [
            "A few very old people in sealed vaults, kept alive by machines, who remember the world before.",
            "Machine-bodies and voices that say they were people once, and that the ruined world is theirs.",
          ],
          haunts: ["the sealed vault beyond {near}", "the old-world tower above {near}"],
          rules: [
            "Their old places are guarded by machines that still obey them.",
            "They blame the living for ruining what they built.",
            "A few still meddle in the wasteland's wars.",
          ],
          wants: ["the vault near {near} left closed", "a clean, young body from {near}"],
          offers: ["old-world knowledge, for service and, some say, a body"],
          wards: ["the machines' own old orders, if anyone can still read them"],
          roles: ["the Voice of the vault", "a builder who woke and wants to make amends"],
          deeds: ["A scavenger crew from {near} broke into the vault and were found by its machines; one came back."],
        },
      ],
      species: [
        {
          kind: "a precursor species",
          nicks: ["the Elders", "the First"],
          forms: [],
          haunts: ["the precursor ruins near {near}", "a sealed vault beyond {near}"],
          rules: [
            "Their old installations wake on a long cycle; between, only automated wardens answer.",
            "Every ruin is still theirs by their law, and their machines enforce it.",
            "^A few still intervene in younger species' wars, for purposes never explained.",
          ],
          wants: [
            "the ruin near {near} left unexcavated",
            "an artefact sold in {near}'s markets returned to its vault",
            "^a younger species near {near} tested, and found wanting or worthy",
            "the war around {near} ended on their terms",
          ],
          offers: ["fragments of their technology, for obedience to rules they will not explain"],
          wards: ["their own law, if anyone can read it"],
          roles: [
            "the keeper of the ruin, last of its line still awake",
            "an elder returned after a long absence, and furious at what it finds",
          ],
          deeds: [
            "The first excavation at {near} woke a warden machine that killed the dig crew and went back to sleep.",
          ],
        },
      ],
    },
  },
};

// ── Species (sci-fi): a body, a sense, a life cycle and a mind, each allowed by the archetype ──
// After Cohen & Stewart and Kershenbaum: what a being senses, how it reproduces and what counts as an
// individual decide how alien it reads; humanlike shapes are a rare roll and always uncanny.
interface SpeciesPart {
  text: string;
  fits: WorldPeopleArchetype[];
  /** What this part is, for the parts it cannot go with. */
  tags?: string[];
  /** Tags a part chosen with it must not have; `needs`: a tag one of them must have. */
  excludes?: string[];
  needs?: string;
  /** A rule of theirs that comes from this part, one a GM can play. */
  rule?: string;
}
const BODIES: SpeciesPart[] = [
  {
    text: "Radially built, with five grasping arms around a central body and no front or back",
    fits: ["warden", "elder", "bargainer", "watcher"],
    rule: "They have no back to turn: to them, a human who turns away has ended the conversation, and maybe the treaty.",
  },
  {
    text: "A colony: each 'person' is a swarm of fist-sized units that come apart and rejoin",
    fits: ["hidden", "devourer", "watcher"],
    tags: ["collective", "no-skin"],
    rule: "A swarm that loses units loses memories; whoever harms a few has harmed what they know, and they keep count.",
  },
  {
    text: "Segmented and armoured, six-limbed, the size of a horse, with jaws that open in four",
    fits: ["devourer", "tempter", "elder"],
  },
  {
    text: "Boneless and shape-shifting, able to copy a face and a skin in minutes",
    fits: ["trickster", "hidden", "tempter"],
    tags: ["skin", "passes"],
    rule: "A copied face is a compliment among them; refusing to be copied is an insult.",
  },
  {
    text: "A rooted giant that never moves, served by small mobile bodies it grows for the purpose",
    fits: ["warden", "elder", "bargainer"],
    tags: ["rooted"],
    excludes: ["travel"],
    rule: "To insult a bud is to insult the tree, and the tree never moves away from a grudge.",
  },
  {
    text: "Small and many, knee-high, living in troops of dozens that share one name",
    fits: ["trickster", "hidden", "bargainer"],
    tags: ["collective"],
    rule: "A promise made to one of a troop is made to all of it, and all of it will come to collect.",
  },
  {
    text: "Humanlike, convergent almost perfectly, which is exactly what makes them uncanny: the joints bend a little too far",
    fits: ["watcher", "hidden", "tempter"],
    tags: ["humanlike", "passes"],
  },
  {
    text: "Post-biological: minds running in machine bodies built for the task at hand",
    fits: ["elder", "watcher", "devourer", "bargainer"],
    tags: ["machine", "no-skin"],
    rule: "Each of them is backed up somewhere; killing one is an insult, not a death, and they reply in kind.",
  },
  {
    text: "Floating gas-bladders trailing stinging tendrils, kept in pressurised envelopes off their own world",
    fits: ["bargainer", "watcher", "elder"],
    tags: ["sealed"],
  },
];
const SENSES: SpeciesPart[] = [
  {
    text: "they sense electric fields and speak in flickers of current",
    fits: ["watcher", "devourer", "hidden"],
    rule: "They read a human's nerves like a face: fear and lies show, and only shielding or real calm hides them.",
  },
  {
    text: "they speak in scent, and a contract among them is a chemical",
    fits: ["bargainer", "warden"],
    tags: ["scent"],
    excludes: ["sealed", "machine"],
    rule: "A deal is sealed by trading scent; anyone who has worn their mark is known to them for life.",
  },
  {
    text: "they talk in colour that ripples across their skin, faster than human eyes follow",
    fits: ["trickster", "tempter", "bargainer"],
    excludes: ["no-skin"],
    rule: "In the dark they are mute; a meeting in unlit rooms is a meeting where they cannot speak.",
  },
  {
    text: "they hear and speak in infrasound and see by echo",
    fits: ["elder", "devourer", "warden"],
    rule: "A human whisper is beneath their notice and a deep hum is a shout; engines idling near them are a threat.",
  },
  {
    text: "they are radio-native, talking in signal",
    fits: ["devourer", "hidden", "bargainer"],
    rule: "A ship running silent is invisible to them, and a ship broadcasting is shouting in their ear.",
  },
  {
    text: "they think and speak very slowly, a sentence a day, and use fast proxies for everything else",
    fits: ["elder", "warden"],
    tags: ["slow"],
    rule: "A proxy cannot bind them; only the slow self agrees, and the answer takes a season.",
  },
  {
    text: "they read touch and vibration through the ground, and are deaf to the air",
    fits: ["hidden", "warden", "trickster"],
    tags: ["deaf"],
    rule: "Footsteps are speech to them: marching is a threat, a dance a greeting, and stamping an insult.",
  },
];
const LIVES: SpeciesPart[] = [
  {
    text: "They hatch in thousands and few survive; they do not grieve the young.",
    fits: ["devourer", "trickster", "hidden"],
    tags: ["callous"],
    excludes: ["machine"],
  },
  {
    text: "They live through stages, each with a different mind; the adult does not remember being the larva.",
    fits: ["tempter", "trickster", "watcher"],
    excludes: ["machine"],
    rule: "An adult is not bound by anything it agreed to as a larva, and they find it strange that humans are.",
  },
  {
    text: "They live for millennia and breed rarely; each birth is a political event.",
    fits: ["elder", "warden", "bargainer"],
    excludes: ["collective"],
    rule: "A child among them is a treaty: a birth can end a feud, and a death of the young starts one.",
  },
  {
    text: "They live forty years, and their old are ancient by their own reckoning.",
    fits: ["trickster", "devourer", "hidden"],
    excludes: ["machine", "slow"],
    rule: "Their generations are short: a deal outlives the ones who made it, and their grandchildren will hold humans to it.",
  },
  {
    text: "They sleep for centuries between active lives, and wake to a changed galaxy.",
    fits: ["elder", "watcher", "devourer"],
    tags: ["sleep"],
    rule: "A promise made to a sleeper's forebears still binds the sleeper, and they wake expecting it kept.",
  },
  {
    text: "They bud clones; a family is one person many times over.",
    fits: ["bargainer", "hidden", "watcher"],
    excludes: ["machine"],
    rule: "One clone answers for every other of its line, debts and insults included.",
  },
  {
    text: "They are made, not born: each new body is built and filled from an archive.",
    fits: ["elder", "watcher", "devourer", "bargainer"],
    needs: "machine",
  },
];
const MINDS: SpeciesPart[] = [
  {
    text: "A hive: individuals are limbs, the mind lives in a queen or a network, and they cannot understand why a human would refuse an order.",
    fits: ["devourer", "watcher", "warden"],
    tags: ["collective"],
    rule: "Nothing a single one of them agrees to binds; only the hive's voice does.",
  },
  {
    text: "Consensus minds that decide nothing alone; they find human leaders frightening.",
    fits: ["bargainer", "warden", "hidden"],
    tags: ["collective"],
    rule: "Nothing one of them promises binds until their quorum meets, and the quorum meets when it meets.",
  },
  {
    text: "Solitary minds that meet only to trade or breed; they find human crowds a kind of madness.",
    fits: ["bargainer", "elder", "devourer"],
    excludes: ["collective", "machine"],
    rule: "They deal with one human at a time; a delegation is taken as an ambush.",
  },
  {
    text: "They have no sense of the far future, and hear human promises about next year as poetry.",
    fits: ["trickster", "devourer"],
    tags: ["now"],
    excludes: ["slow", "future", "sleep"],
  },
  {
    text: "They cannot lie in their own medium, and assume no one can.",
    fits: ["bargainer", "hidden", "warden"],
    excludes: ["skin"],
    rule: "A human caught in one lie is believed in nothing afterwards.",
  },
  {
    text: "Ranked minds: every relation is above or below, and an equal is a contradiction.",
    fits: ["tempter", "elder", "devourer"],
    tags: ["ranked"],
    excludes: ["collective"],
    rule: "Speak to the highest-ranked of them present, or be ignored; invoking a greater one's name halts a lesser.",
  },
  {
    text: "Minds that merge and part; who they are changes from meeting to meeting.",
    fits: ["trickster", "watcher", "tempter"],
    tags: ["fluid"],
    rule: "The one who made a promise may not exist by the next meeting; they bargain for the next one too.",
  },
];
const ORIGINS: SpeciesPart[] = [
  {
    text: "They are keeping humanity in a quarantine, or a zoo, and have not said which.",
    fits: ["watcher", "warden", "elder"],
  },
  {
    text: "They are refugees from a dead star, and hide because they lost one war already.",
    fits: ["hidden", "elder"],
  },
  {
    text: "They are scouts for something that is still coming.",
    fits: ["watcher", "tempter", "devourer", "hidden"],
    tags: ["travel", "future"],
  },
  { text: "They are what is left of a war, outliving the ones who began it.", fits: ["devourer", "elder"] },
  { text: "They are a weapon that escaped, bred for a war that ended without them.", fits: ["devourer"] },
  {
    text: "They are migrants on a route older than humanity, which now runs through human worlds.",
    fits: ["devourer", "bargainer"],
    tags: ["travel"],
  },
  {
    text: "They are traders working a frontier that happens to include humanity.",
    fits: ["bargainer"],
    tags: ["travel", "future"],
  },
  { text: "They uplift younger species, and expect gratitude for it.", fits: ["tempter", "elder"] },
  { text: "They were here first, and regard the human worlds as their nursery.", fits: ["hidden", "elder"] },
  {
    text: "They are the last of a great trading house, tied now to the one world they hold.",
    fits: ["bargainer", "warden"],
  },
  { text: "They grew up with this world, and its life is their body.", fits: ["warden"] },
  {
    text: "They are pilgrims, crossing human space toward something sacred to them.",
    fits: ["trickster", "bargainer", "tempter"],
    tags: ["travel"],
  },
  {
    text: "They are outcasts of a larger people, exiled here for a crime they will not name.",
    fits: ["trickster", "tempter", "hidden"],
  },
];
/** Broad pop-culture alien types, at most one per species, each only on a body it fits. */
const SKINS: SpeciesPart[] = [
  {
    text: "Humans call them greys, after the abductee stories, and the stories are close.",
    fits: ["watcher"],
    needs: "humanlike",
  },
  {
    text: "Humans see in them the visitors of the old contact cults: serene, wise, come to save us, which is what they want to be seen as.",
    fits: ["tempter"],
    needs: "humanlike",
  },
  {
    text: "The rumours that some humans are not human are about them, and the rumours are true.",
    fits: ["hidden"],
    needs: "passes",
  },
  { text: "They fight as one body, and no fighter that falls is mourned.", fits: ["devourer"], excludes: ["machine"] },
  {
    text: "Their warrior caste lives by an honour code no human has fully learned, and a challenge must be answered.",
    fits: ["elder", "devourer"],
    excludes: ["collective"],
  },
  {
    text: "They are uplifted animals whose makers are long gone, and they joke about it constantly.",
    fits: ["trickster"],
    excludes: ["collective", "machine", "rooted"],
  },
  {
    text: "Some of them are pure energy, bound to the world they guard, seen as lights over the forest.",
    fits: ["warden"],
    excludes: ["rooted", "machine"],
  },
];
const SPECIES_QUIRKS: Array<{ text: string; excludes?: string[] }> = [
  { text: "always arrives a little before the appointed time" },
  { text: "collects human music and plays it back at odd moments", excludes: ["deaf"] },
  { text: "asks every question three times, in three ways" },
  { text: "is unsettled by human laughter", excludes: ["deaf"] },
  { text: "has outlived three human translators" },
  { text: "brings gifts that are exactly the wrong size" },
  { text: "keeps careful records of every human it has met" },
  { text: "is fascinated by human children and asks to see them" },
  { text: "will not discuss its own kind's dead", excludes: ["machine", "callous"] },
  { text: "counts the humans in every room, twice" },
  { text: "treats any human who breaks a promise as dead" },
  { text: "studies human food it cannot eat" },
  { text: "is a heretic among its own, and will not say why" },
];
const HUMAN_NAMES = [
  "Ada Mensah",
  "Ilse Varga",
  "Tomas Reyes",
  "Mei Okonkwo",
  "Rafael Sousa",
  "Noor Haddad",
  "Pieter Lund",
  "Asha Rao",
  "Yuki Brandt",
  "Femi Adeyemi",
  "Lena Kowal",
  "Omar Castell",
];

/** Which archetypes a setting's peoples come from, and how likely each is. */
const ARCHETYPE_WEIGHTS: Record<Frame, Record<WorldPeopleArchetype, number>> = {
  europe: { hidden: 3, bargainer: 2, tempter: 1.5, trickster: 2, warden: 2.5, devourer: 2, watcher: 1.5, elder: 1 },
  china: { hidden: 2, bargainer: 1.5, tempter: 1.5, trickster: 2.5, warden: 2.5, devourer: 2.5, watcher: 2, elder: 1 },
  modern: { hidden: 2.5, bargainer: 2.5, tempter: 2, trickster: 2, warden: 1.5, devourer: 2, watcher: 2, elder: 1 },
  wasteland: {
    hidden: 2.5,
    bargainer: 2.5,
    tempter: 2.5,
    trickster: 1.5,
    warden: 2,
    devourer: 3,
    watcher: 1.5,
    elder: 1.5,
  },
  species: {
    hidden: 1.5,
    bargainer: 2.5,
    tempter: 2,
    trickster: 1.5,
    warden: 1.5,
    devourer: 2,
    watcher: 2.5,
    elder: 2,
  },
};

/** How many peoples a setting has, and whose lore they come from: none in an everyday modern or 1920s world. */
function peopleFrame(kit: WorldKit): { count: number; frame: Frame } {
  const text = JSON.stringify(kit).toLowerCase();
  const uncanny = /supernatural|hidden world|magic|fae|spirit|occult|monster|undead/.test(text);
  if (kit.family === "scifi") return { count: kit.scale === "sector" || /alien/.test(text) ? 3 : 0, frame: "species" };
  if (kit.family === "wuxia") return { count: 3, frame: "china" };
  if (kit.family === "fantasy") return { count: 3, frame: "europe" };
  if (kit.family === "wasteland") return { count: 2, frame: "wasteland" };
  return { count: uncanny ? 2 : 0, frame: "modern" };
}

// ── Names: the setting's own sound, short enough to say at the table ──
type Sound = "north" | "west" | "east" | "desert" | "akan" | "species";
const NAME_SOUNDS: Record<Sound, { onsets: string[]; vowels: string[]; codas: string[] }> = {
  north: {
    onsets: ["h", "s", "v", "b", "d", "g", "f", "k", "l", "m", "n", "r", "th", "sk", "br", "gr", "fr", "dr"],
    vowels: ["a", "e", "i", "o", "u", "ei", "au", "y"],
    codas: ["r", "n", "l", "nd", "rn", "k", "s", "ll", "", "m"],
  },
  west: {
    onsets: ["c", "b", "d", "f", "g", "l", "m", "n", "r", "s", "t", "br", "gl", "cr", "fi"],
    vowels: ["a", "e", "i", "o", "ai", "ea", "ui", "ia"],
    codas: ["", "n", "r", "ll", "ch", "dh", "nn", "th"],
  },
  east: {
    onsets: ["v", "z", "m", "l", "r", "d", "b", "s", "k", "ch", "zh", "sv", "br", "dr", "y"],
    vowels: ["o", "a", "e", "i", "u", "ya", "ye"],
    codas: ["", "", "n", "v", "sk", "sh", "l"],
  },
  desert: {
    onsets: ["z", "s", "kh", "m", "n", "r", "b", "f", "h", "d", "sh", "q", "j"],
    vowels: ["a", "i", "u", "aa", "ii", "a"],
    codas: ["", "n", "r", "d", "m", "l", "h", "z"],
  },
  akan: {
    onsets: ["k", "kw", "b", "d", "f", "m", "n", "s", "t", "y", "ny", "ab", "ad", "w"],
    vowels: ["a", "e", "o", "u", "i", "ua"],
    codas: ["", "", "", "n", "m"],
  },
  species: {
    onsets: ["k", "t", "q", "x", "v", "s", "z", "r", "n", "kh", "tl", "ss"],
    vowels: ["a", "e", "i", "o", "u", "aa", "ei"],
    codas: ["", "", "k", "t", "x", "r", "sh", "'"],
  },
};

/** Surnames that mark a people in Chinese lore (Hu for foxes, Huang for weasels, Long for dragons) go only
 *  to them; everyone else draws from the rest. */
const CHINA_SURNAMES = [
  "Yun",
  "Qing",
  "Mo",
  "Shan",
  "Lan",
  "Xuan",
  "Su",
  "Lu",
  "Shen",
  "Jiang",
  "Wei",
  "Zhou",
  "Han",
  "Tang",
  "Fang",
  "Xie",
];
const CHINA_GIVEN = [
  "Qingyun",
  "Xiaoyue",
  "Wuming",
  "Lanzhi",
  "Feiyan",
  "Mingyu",
  "Shuang",
  "Jinglan",
  "Yaoshi",
  "Baozhu",
  "Zhiyuan",
  "Ruolan",
  "Changfeng",
  "Yuhan",
  "Qiuse",
  "Hanshan",
  "Xueying",
  "Pingan",
  "Muyun",
  "Shaoqing",
  "Yinxue",
  "Jianyu",
  "Lingxi",
  "Wenjing",
  "Zhaoyang",
  "Sanniang",
  "Liuyi",
  "Huaiyu",
  "Xiangjun",
  "Ziyan",
];
/** Human names of each fantasy tradition, for the humans who know a people. */
const TRADITION_HUMANS: Record<string, string[]> = {
  north: ["Sigrid", "Halldor", "Asa", "Gunnar", "Ragna", "Einar", "Thora", "Bjarni", "Helga", "Orm", "Gudrun", "Ketil"],
  west: ["Brid", "Tomas", "Nora", "Eamon", "Siobhan", "Padraig", "Maura", "Cathal", "Una", "Fergus", "Deirdre", "Colm"],
  east: [
    "Vasilisa",
    "Ivan",
    "Marya",
    "Fyodor",
    "Darya",
    "Pyotr",
    "Olena",
    "Bogdan",
    "Yaroslava",
    "Mikula",
    "Zlata",
    "Danilo",
  ],
  desert: [
    "Yusuf",
    "Layla",
    "Harun",
    "Zaynab",
    "Karim",
    "Shirin",
    "Faris",
    "Nasrin",
    "Tariq",
    "Maryam",
    "Idris",
    "Samira",
  ],
  akan: ["Kwame", "Ama", "Kofi", "Efua", "Yaw", "Akosua", "Kwabena", "Abena", "Kwesi", "Adwoa", "Kojo", "Esi"],
};

const FOLK_NAMES: Record<"modern" | "wasteland", string[]> = {
  modern: [
    "Hollin",
    "Vane",
    "Ashdown",
    "Marsh",
    "Tully",
    "Quill",
    "Rook",
    "Fenwick",
    "Sallis",
    "Oakes",
    "Penhale",
    "Greaves",
    "Marlow",
    "Thorne",
    "Abernathy",
    "Kestrel",
    "Lowe",
    "Pruitt",
    "Danvers",
    "Holloway",
    "Crane",
    "Ellery",
    "Moss",
    "Wren",
  ],
  wasteland: [
    "Rust",
    "Lamp",
    "Tally",
    "Glass",
    "Brass",
    "Nine",
    "Cinder",
    "Ozone",
    "Patch",
    "Wick",
    "Copper",
    "Dusk",
    "Flint",
    "Mercy",
    "Sparrow",
    "Gauge",
    "Hollow",
    "Bishop",
    "Tinker",
    "Ash",
    "Juniper",
    "Solder",
    "Lark",
    "Vesper",
  ],
};

function syllableName(sound: Sound, random: () => number, taken: Set<string>): string {
  const { onsets, vowels, codas } = NAME_SOUNDS[sound];
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)]!;
  for (let attempt = 0; attempt < 30; attempt++) {
    const syllables = random() < 0.75 ? 2 : 1;
    const parts: string[] = [];
    for (let i = 0; i < syllables; i++) parts.push(pick(onsets) + pick(vowels));
    if (new Set(parts).size < parts.length) continue;
    let name = parts.join(sound === "species" && random() < 0.3 ? "'" : "");
    name += pick(codas);
    name = name.replace(/'+$/, "").replace(/'{2,}/g, "'");
    name = name[0]!.toUpperCase() + name.slice(1);
    if (
      name.length < (sound === "species" ? 4 : 5) ||
      name.length > 9 ||
      /(.)\1\1/.test(name) ||
      taken.has(name.toLowerCase())
    )
      continue;
    taken.add(name.toLowerCase());
    return name;
  }
  return `Kin ${taken.size + 1}`;
}

function weighted<K extends string>(weights: Partial<Record<K, number>>, random: () => number): K {
  const entries = Object.entries(weights).filter(([, weight]) => (weight as number) > 0) as Array<[K, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [key, weight] of entries) if ((roll -= weight) < 0) return key;
  return entries[entries.length - 1]![0];
}

const STANCE: Record<WorldPeopleTemper, WorldPeopleStance[]> = {
  malevolent: ["hostile"],
  untrustworthy: ["friendly", "wary", "wary"],
  aloof: ["aloof"],
  kindly: ["friendly"],
};
/** How a people stands, as the GM reads it. */
function standingWords(people: WorldPeople): string {
  if (people.temper === "malevolent") return "malevolent, and hostile to humans";
  if (people.temper === "aloof") return "they want to be left alone";
  if (people.temper === "kindly") return "kindly to humans, in their own way";
  return people.stance === "friendly"
    ? "friendly to humans, but not to be trusted"
    : "wary of humans, and not to be trusted";
}

/** How two of a world's peoples stand with each other, told from both sides ({other} is the other). */
function relation(
  a: WorldPeopleArchetype,
  b: WorldPeopleArchetype,
  random: () => number,
  close: boolean,
): [string, string] {
  const flip = ([x, y]: [string, string]): [string, string] => [y, x];
  if (b === "devourer" && a !== "devourer") return flip(relation(b, a, random, close));
  if (a === "devourer") return ["hunt the {other} when they can", "fear the {other} and keep watch for them"];
  if (b === "bargainer") return flip(relation(b, a, random, close));
  if (a === "bargainer")
    return random() < 0.5
      ? ["hold an old debt of the {other}", "owe the {other} a debt they resent"]
      : ["trade with the {other}, warily", "trade with the {other}, warily"];
  if ((a === "tempter" && b === "warden") || (a === "warden" && b === "tempter"))
    return ["are old enemies of the {other}", "are old enemies of the {other}"];
  if (b === "elder") return flip(relation(b, a, random, close));
  if (a === "elder") return ["remember when the {other} served them", "still pay the {other} a grudging respect"];
  if (b === "trickster") return flip(relation(b, a, random, close));
  if (a === "trickster")
    return ["play tricks on the {other}", "are the butt of tricks played by the {other}, and resent it"];
  return close && random() < 0.6
    ? ["are rivals of the {other} for the same ground", "are rivals of the {other} for the same ground"]
    : ["keep apart from the {other}", "keep apart from the {other}"];
}

/** Whether a tagged line suits a temper: "!" only the malevolent, "~" any but them, "^" any but the aloof. */
function suits(line: string, temper: WorldPeopleTemper): boolean {
  if (line.startsWith("!")) return temper === "malevolent";
  if (line.startsWith("~")) return temper !== "malevolent";
  if (line.startsWith("^")) return temper !== "aloof";
  return true;
}
const untag = (line: string) => line.replace(/^[!~^*]/, "");

/** A fantasy world's peoples share one tradition (the hill-folk and the trolls; the domovoi and the
 *  rusalki), so a world is never a museum of every culture at once. */
const TRADITION_WEIGHTS: Record<string, number> = { west: 3, north: 2, east: 2, akan: 1.5, desert: 1.5 };

/** What a malevolent people holds out, when its lore has no darker offer of its own. */
const LURES: Record<WorldPeopleArchetype, string> = {
  hidden: "nothing now; whatever they hold out is bait",
  bargainer: "bargains that cannot be won, worded to ruin",
  tempter: "everything a human could want, as bait",
  trickster: "gifts that fail the moment they are needed",
  warden: "nothing; their land is closed to humans now",
  devourer: "nothing",
  watcher: "nothing honest; what they hand back is meant to be tracked",
  elder: "nothing; humans had their chance",
};

const cache = new Map<string, WorldPeople[]>();

/** The world's non-human peoples (generator 9), the same for the same world every time. */
export function worldPeoples(kit: WorldKit, world: CompiledWorld): WorldPeople[] {
  if (world.generatorVersion < 9) return [];
  const { count, frame } = peopleFrame(kit);
  if (!count) return [];
  const key = JSON.stringify([world.seed, world.generatorVersion, kit.id, kit.family, kit.scale, world.ground.length]);
  const hit = cache.get(key);
  if (hit) return hit;
  const random = worldStream(world.seed, "peoples");
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)]!;
  const pickSome = <T>(items: readonly T[], n: number) =>
    items
      .map((item) => ({ item, order: random() }))
      .sort((a, b) => a.order - b.order)
      .slice(0, n)
      .map((each) => each.item);
  const fresh = (items: readonly string[], used: Set<string>) => {
    const left = items.filter((item) => !used.has(item));
    const chosen = pick(left.length ? left : items);
    used.add(chosen);
    return chosen;
  };
  const terrain = worldTerrainEntries(kit);
  const entryAt = (cell: number) =>
    terrain.find((entry) => entry.id === world.terrain[parseInt(world.ground[cell]!, 36)]) ?? { id: "", kind: "open" };
  const settlements = world.places.filter((place) => place.rank !== undefined);
  const placed = new Set(world.places.map((place) => place.at.y * world.width + place.at.x));
  const roads = new Set(world.links.flatMap((link) => link.path ?? []));
  const taken = new Set(world.places.map((place) => place.name.toLowerCase()));
  const used = new Set<WorldPeopleArchetype>();
  const usedParts = new Set<string>();
  const usedLines = new Set<string>();
  const tradition = frame === "europe" ? weighted(TRADITION_WEIGHTS, random) : undefined;
  const homes: Array<{ x: number; y: number }> = [];
  const peoples: WorldPeople[] = [];
  for (let index = 0; index < count && settlements.length; index++) {
    const weights = { ...ARCHETYPE_WEIGHTS[frame] };
    for (const each of WORLD_PEOPLE_ARCHETYPES) {
      const variants = ARCHETYPES[each].variants[frame] ?? [];
      if (used.has(each) || !variants.some((variant) => !tradition || variant.from === tradition)) weights[each] = 0;
    }
    if (!Object.values(weights).some((weight) => weight > 0)) break;
    const archetype = weighted(weights, random);
    used.add(archetype);
    const kind = ARCHETYPES[archetype];
    const variant = pick(kind.variants[frame]!.filter((each) => !tradition || each.from === tradition));
    // At most one malevolent people a world besides its devourers, so a world always has someone to deal with.
    const tempers = { ...(variant.temper ?? kind.temper) };
    if (
      archetype !== "devourer" &&
      peoples.some((other) => other.temper === "malevolent" && other.archetype !== "devourer")
    )
      delete tempers.malevolent;
    const temper = weighted(Object.keys(tempers).length ? tempers : { aloof: 1 }, random);
    // A home on their ground: the best fitting cell of the open map, remote ones far from towns and
    // roads, others near a town, and apart from the other peoples.
    let best = { cell: -1, score: -Infinity };
    const ground = [...kind.ground, /.*/];
    for (let cell = 0; cell < world.ground.length; cell++) {
      const entry = entryAt(cell);
      if (entry.kind === "water" || placed.has(cell)) continue;
      const [x, y] = [cell % world.width, Math.floor(cell / world.width)];
      const fit = ground.findIndex((test) => test.test(entry.id));
      const town = Math.min(...settlements.map((place) => Math.hypot(place.at.x - x, place.at.y - y)));
      const apart = homes.length ? Math.min(...homes.map((home) => Math.hypot(home.x - x, home.y - y))) : 99;
      const score =
        (ground.length - fit) * 2 +
        (kind.remote ? Math.min(6, town) * 0.5 - (roads.has(cell) ? 2 : 0) : -Math.abs(town - 2.5)) +
        Math.min(8, apart) * 0.4 +
        random() * 1.5;
      if (score > best.score) best = { cell, score };
    }
    if (best.cell < 0) continue;
    const home = { x: best.cell % world.width, y: Math.floor(best.cell / world.width) };
    homes.push(home);
    const near = settlements.reduce((closest, place) =>
      Math.hypot(place.at.x - home.x, place.at.y - home.y) < Math.hypot(closest.at.x - home.x, closest.at.y - home.y)
        ? place
        : closest,
    );
    const at = (text: string) =>
      untag(text)
        .replaceAll("{near}'s", near.name.endsWith("s") ? `${near.name}'` : `${near.name}'s`)
        .replaceAll("{near}", near.name);
    const fitting = (lines: readonly string[]) => {
      const kept = lines.filter((line) => suits(line, temper));
      if (kept.length) return kept;
      const plain = lines.filter((line) => !/^[!~^]/.test(line));
      return plain.length ? plain : lines;
    };
    let rules = pickSome(fitting(variant.rules), 2 + (random() < 0.5 ? 1 : 0));
    // A species is built from parts its archetype allows and that go together, none shared with another
    // species of the world; its body, senses, mind and life each may bring a rule of its own.
    let form = variant.forms.length ? pick(variant.forms) : "";
    const nature: string[] = [];
    const chosen: SpeciesPart[] = [];
    const bodyTags = new Set<string>();
    if (frame === "species") {
      const goes = (part: SpeciesPart) => {
        const tags = new Set(chosen.flatMap((each) => each.tags ?? []));
        return (
          part.fits.includes(archetype) &&
          !(part.excludes ?? []).some((tag) => tags.has(tag)) &&
          !chosen.some((other) => (other.excludes ?? []).some((tag) => (part.tags ?? []).includes(tag))) &&
          (!part.needs || tags.has(part.needs))
        );
      };
      const choose = (parts: SpeciesPart[]) => {
        const options = parts.filter((part) => goes(part) && !usedParts.has(part.text));
        // Nothing that fits goes unsaid rather than said wrong.
        const fallback = parts.filter(goes);
        if (!options.length && !fallback.length) return "";
        const part = pick(options.length ? options : fallback);
        usedParts.add(part.text);
        chosen.push(part);
        return part.text;
      };
      const body = choose(BODIES);
      form = `${body}; ${choose(SENSES)}.`;
      nature.push(...[choose(MINDS), choose(LIVES), choose(ORIGINS)].filter(Boolean));
      const skins = SKINS.filter(goes);
      if (skins.length && random() < 0.5) nature.push(pick(skins).text);
      for (const part of chosen) for (const tag of part.tags ?? []) bodyTags.add(tag);
      const biology = pickSome(
        chosen.flatMap((part) => (part.rule ? [part.rule] : [])),
        2,
      );
      rules = [...pickSome(rules, Math.max(1, 3 - biology.length)), ...biology];
    }
    // A people that takes, eats or drowns humans is never told as kindly, aloof or friendly.
    let finalTemper = temper;
    const want = at(fresh(fitting(variant.wants), usedLines));
    const harms = [...rules, want].some((line) =>
      /\b(eat|eats|take people|takes people|take the|took|drown|drowned|tickle|abduct|for study|hearts|gas|given to them|kill|killed|do not come back)\b/i.test(
        line,
      ),
    );
    if (harms && (temper === "aloof" || temper === "kindly")) finalTemper = "untrustworthy";
    const sound: Sound = frame === "species" ? "species" : ((tradition as Sound | undefined) ?? "north");
    const own = frame === "europe" || frame === "species" ? syllableName(sound, random, taken) : undefined;
    const nick = pick(variant.nicks);
    const name = own ?? nick.replace(/^the /, "");
    const personName = (outsider = false) => {
      for (let attempt = 0; attempt < 12; attempt++) {
        const full =
          frame === "china"
            ? `${outsider || !variant.surname ? pick(CHINA_SURNAMES) : variant.surname} ${pick(
                CHINA_GIVEN.filter((given) => ![...taken].some((name) => name.endsWith(` ${given.toLowerCase()}`))),
              )}`
            : frame === "species" && outsider
              ? pick(HUMAN_NAMES)
              : frame === "europe" && outsider
                ? pick(TRADITION_HUMANS[tradition ?? "north"]!)
                : frame === "modern" || frame === "wasteland"
                  ? pick(
                      FOLK_NAMES[frame].filter(
                        (folk) =>
                          ![nick, ...peoples.map((other) => other.nick)].some((each) =>
                            each.toLowerCase().includes(folk.toLowerCase()),
                          ),
                      ),
                    )
                  : syllableName(sound, random, taken);
        if (!taken.has(full.toLowerCase()) || attempt === 11) return (taken.add(full.toLowerCase()), full);
      }
      return "";
    };
    const members = fitting(variant.roles.filter((role) => !role.startsWith("*")));
    const outsiders = variant.roles.filter((role) => role.startsWith("*"));
    const quirks =
      frame === "species"
        ? SPECIES_QUIRKS.filter((quirk) => !(quirk.excludes ?? []).some((tag) => bodyTags.has(tag))).map(
            (quirk) => quirk.text,
          )
        : (variant.quirks ?? kind.quirks);
    // A malevolent people's offer is bait, unless its lore gives it a darker one of its own.
    const offers = fitting(variant.offers);
    const offer =
      temper === "malevolent" && !variant.offers.some((each) => each.startsWith("!"))
        ? LURES[archetype]
        : at(pick(offers));
    peoples.push({
      id: `people-${index}`,
      name,
      nick,
      archetype,
      kind: variant.kind,
      temper: finalTemper,
      stance: harms && finalTemper === "untrustworthy" ? "wary" : pick(STANCE[finalTemper]),
      form,
      nature,
      rules: rules.map(at),
      want,
      offer,
      ward: at(pick(variant.wards)),
      figure: {
        name: personName(),
        role: at(pick(members.length ? members : variant.roles.map(untag))),
        quirk: at(fresh(quirks, usedLines)),
      },
      ...(outsiders.length && random() < 0.6 ? { contact: { name: personName(true), role: at(pick(outsiders)) } } : {}),
      relations: [],
      home,
      nearId: near.id,
      haunt: at(
        pick(
          bodyTags.has("rooted")
            ? variant.haunts
                .filter((haunt) => !/orbit|station|moon/.test(haunt))
                .concat("the wilds beyond {near}")
                .slice(0, 2)
            : variant.haunts,
        ),
      ),
      deeds: fitting(variant.deeds).map((deed) => at(deed).replaceAll("{name}", name)),
    });
  }
  for (const [i, a] of peoples.entries()) {
    for (const b of peoples.slice(i + 1)) {
      const close = Math.hypot(a.home.x - b.home.x, a.home.y - b.home.y) <= 8;
      const [fromA, fromB] = relation(a.archetype, b.archetype, random, close);
      a.relations.push({ id: b.id, text: fromA });
      b.relations.push({ id: a.id, text: fromB });
    }
  }
  cache.set(key, peoples);
  if (cache.size > 8) cache.delete(cache.keys().next().value!);
  return peoples;
}

/** What a people is called by kind, for the GM: "hill-folk who live in the rocks", "a precursor species". */
export function worldPeopleKind(people: WorldPeople): string {
  return people.kind;
}

const capital = (text: string) => text[0]!.toUpperCase() + text.slice(1);

/** One people as the GM reads it: a line, and with `full` its rules, want, offer, ward, figure and ties. */
export function worldPeopleLines(people: WorldPeople, full: boolean, all: readonly WorldPeople[] = []): string[] {
  const named =
    people.name === people.nick.replace(/^the /, "")
      ? `The ${people.name}`
      : `The ${people.name} (called ${people.nick})`;
  const head = `- ${named}, ${people.kind}, found at ${people.haunt}; ${standingWords(people)}. ${people.form}`;
  if (!full) return [head];
  const byId = new Map(all.map((other) => [other.id, other]));
  return [
    head,
    ...people.nature.map((line) => `  - ${line}`),
    ...people.rules.map((rule) => `  - Rule: ${rule}`),
    `  - Want now: ${people.want}.`,
    `  - They offer ${people.offer}.`,
    `  - Warded by ${people.ward}.`,
    `  - One of them: ${people.figure.name}, ${people.figure.role}. ${capital(people.figure.name)} ${people.figure.quirk}.`,
    ...(people.contact ? [`  - Who knows them: ${people.contact.name}, ${people.contact.role}.`] : []),
    ...people.relations.flatMap((each) =>
      byId.has(each.id) ? [`  - They ${each.text.replaceAll("{other}", byId.get(each.id)!.name)}.`] : [],
    ),
  ];
}

/** The peoples whose home is near a place, nearest first. */
export function worldPeoplesNear(peoples: readonly WorldPeople[], place: WorldPlace, reach = 6): WorldPeople[] {
  return peoples
    .filter(
      (people) =>
        people.nearId === place.id || Math.hypot(people.home.x - place.at.x, people.home.y - place.at.y) <= reach,
    )
    .sort(
      (a, b) =>
        Math.hypot(a.home.x - place.at.x, a.home.y - place.at.y) -
        Math.hypot(b.home.x - place.at.x, b.home.y - place.at.y),
    );
}
