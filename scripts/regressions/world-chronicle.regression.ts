/**
 * A settlement's chronicle (fork): what its past did to its people.
 *
 *   - The same world gives the same chronicle and the same fates, and every share stays in its range.
 *   - A town a war was fought over has losses, men of fighting age gone and a memorial; those who fled it
 *     lodge in the town the history says they fled to.
 *   - Some of a town's people died in its woes, never more than a third of a place's people: each successor
 *     keeps the slot (id, role, home and work) and says whom they followed and how; a spouse or child
 *     keeps the family name; names stay unique in the place.
 *   - The Game Master is told what is still felt, and each successor's story is on their sheet.
 */
import assert from "node:assert/strict";

import {
  WORLD_STARTER_KITS,
  WORLD_SUCCESSIONS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldCast,
  worldChronicleLine,
  worldHistory,
  worldPersonSheet,
  worldTownChronicle,
  worldWhereYouAreText,
  applyWorldTags,
  readWorldLedger,
  worldPresent,
  worldTown,
  worldCastNow,
  worldLedgerInstructions,
  type GameWorld,
  type WorldKit,
} from "../../packages/shared/src/index.js";

function rivalWorld(kit: WorldKit, seed: number): GameWorld {
  const kinds = kit.groupKinds.map((kind) => kind.id);
  const plain = checkWorldBrief(kit, { briefVersion: 1, premise: "x" });
  assert.ok(plain.ok);
  const layout = compileGameWorld({ kit, seed, grounding: "expand", brief: plain.brief });
  const big = layout.places.filter((place) => place.rank !== undefined).sort((a, b) => b.rank! - a.rank!);
  const checked = checkWorldBrief(kit, {
    briefVersion: 1,
    premise: "x",
    peopleNames: kit.cultures.map((culture) => ({
      culture: culture.id,
      given: ["Hal", "Marta", "Odo", "Agnes", "Wat", "Isolde", "Piers", "Joan", "Rolf", "Edith", "Hugh", "Mabel"],
      family: ["Ashby", "Thorne", "Miller", "Webb", "Fenn", "Crowe", "Hale", "Brook"],
    })),
    places: big.slice(0, 4).map((place) => ({ name: place.name, layer: place.layer })),
    groups: [0, 1, 2, 3].map((index) => ({
      name: `Group ${index}`,
      kind: kinds[index % kinds.length],
      seat: big[index % big.length]!.name,
      rivals: index ? [`Group ${index - 1}`] : [],
    })),
  });
  assert.ok(checked.ok, checked.ok ? "" : checked.issues.join("; "));
  const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief };
  return { ...inputs, world: compileGameWorld(inputs) };
}

let warTowns = 0;
let successors = 0;
let felt = 0;
const relations = new Set<string>();
for (const input of WORLD_STARTER_KITS.filter((each) =>
  ["high_fantasy", "wuxia_xianxia", "dark_fantasy"].includes(each.id),
)) {
  const parsed = parseWorldKit(input);
  assert.ok(parsed.ok);
  for (const seed of [1, 2, 3, 4, 5]) {
    const game = rivalWorld(parsed.kit, seed);
    const history = worldHistory(game);
    for (const place of game.world.places.filter((each) => each.rank !== undefined)) {
      const label = `${parsed.kit.id}/${seed} ${place.name}`;
      const chronicle = worldTownChronicle(game, place.id)!;
      assert.deepEqual(worldTownChronicle(game, place.id), chronicle, `${label}: the same chronicle`);
      for (const key of ["lost", "menLost", "empty", "ruined", "refugees"] as const)
        assert.ok(chronicle[key] >= 0 && chronicle[key] <= 0.6, `${label}: ${key} ${chronicle[key]}`);
      const war = chronicle.woes.find((each) => each.woe === "war" && each.yearsAgo <= 5);
      if (war) {
        warTowns++;
        assert.ok(
          chronicle.lost > 0 && chronicle.menLost > 0 && chronicle.memorial,
          `${label}: a recent war leaves its mark`,
        );
        const fled = /fled to (.+?)\.$/.exec(war.text);
        if (fled) {
          const refuge = game.world.places.find((each) => each.name === fled[1]);
          assert.ok(refuge, `${label}: fled to a real place`);
          assert.ok(
            worldTownChronicle(game, refuge!.id)!.arrivals.some(
              (each) => each.from === place.name && each.kind === "refugees",
            ),
            `${label}: its refugees are in ${refuge!.name}`,
          );
        }
      }
      for (const each of chronicle.arrivals)
        assert.ok(
          history.events.some((event) => event.text.includes(each.from)),
          `${label}: arrivals from a place the past names`,
        );
      const line = worldChronicleLine(chronicle);
      if (line) {
        felt++;
        assert.ok(worldWhereYouAreText(game, { place }).includes(line), `${label}: the GM is told what is still felt`);
      }
      for (const id of [
        place.id,
        ...game.world.places.filter((each) => each.parentId === place.id).map((each) => each.id),
      ]) {
        const cast = worldCast(game, id);
        assert.deepEqual(worldCast(game, id), cast, `${label}: the same people`);
        const names = cast.map((person) => person.name.toLowerCase());
        assert.equal(new Set(names).size, names.length, `${label}: names unique`);
        const followed = cast.filter((person) => person.succeeds);
        assert.ok(followed.length <= Math.max(1, Math.floor(cast.length / 3)), `${label}: at most a third followed`);
        cast.forEach((person, index) =>
          assert.equal(person.id, `${id}-${index + 1}`, `${label}: successors keep the slot`),
        );
        for (const person of followed) {
          successors++;
          const fate = person.succeeds!;
          relations.add(fate.relation);
          assert.ok(WORLD_SUCCESSIONS.includes(fate.relation));
          assert.notEqual(fate.name, person.name, `${label}: a successor is someone else`);
          assert.ok(fate.yearsAgo <= 30, `${label}: a successor came within the chronicle's reach`);
          if (fate.relation === "spouse" || fate.relation === "child")
            assert.equal(
              person.name.split(" ").at(-1),
              fate.name.split(" ").at(-1),
              `${label}: kin keep the family name`,
            );
          assert.ok(
            worldPersonSheet(game.kit, person).includes(fate.name),
            `${label}: the sheet tells whom they followed`,
          );
        }
      }
    }
  }
}
assert.ok(warTowns >= 5, `towns with a recent war: ${warTowns}`);
assert.ok(successors >= 20, `successors: ${successors}`);
assert.ok(felt >= 10, `towns where the past is felt: ${felt}`);
assert.ok(relations.size >= 4, `kinds of succession seen: ${[...relations]}`);

// A person renamed by hand is the one the owner meant: they lived.
{
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
  assert.ok(parsed.ok);
  let checked = 0;
  for (const seed of [1, 2, 3, 4, 5]) {
    const game = rivalWorld(parsed.kit, seed);
    for (const place of game.world.places) {
      const followed = worldCast(game, place.id).filter((person) => person.succeeds);
      if (!followed.length) continue;
      const slot = followed[0]!.id;
      const edited = {
        ...game,
        edits: { ...(game.edits ?? {}), people: [{ id: slot, name: "Kept Byhand" }] },
      } as GameWorld;
      const person = worldCast(edited, place.id).find((each) => each.id === slot)!;
      assert.equal(person.name, "Kept Byhand");
      assert.equal(person.succeeds, undefined, "a hand-renamed person lived");
      checked++;
      break;
    }
  }
  assert.ok(checked > 0);
}

// ── In play: deaths, successors and arrivals the Game Master records, and the woes of play ──
{
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
  assert.ok(parsed.ok);
  const game = rivalWorld(parsed.kit, 2);
  const instructions = worldLedgerInstructions(game);
  assert.match(instructions, /died="Their full name"/);
  assert.match(instructions, /arrived="refugees"/);
  const town = game.world.places.filter((each) => each.rank !== undefined).sort((a, b) => b.rank! - a.rank!)[0]!;
  const cast = worldCast(game, town.id).filter((person) => person.named && !person.succeeds);
  assert.ok(cast.length >= 3, "a town with people to lose");
  const [first, second, third] = cast;
  const replies: string[] = [];
  const say = (text: string) => {
    const answered = applyWorldTags(text, game, readWorldLedger(replies));
    replies.push(answered);
    return answered;
  };
  assert.match(say(`[world: died="Nobody Atall"]`), /result="refused"[^\]]*reason="unknown-person"/);
  assert.match(
    say(`[world: died="${first!.name.toUpperCase()}" place="${town.name}" note="killed by bandits on the road"]`),
    /result="ok"/,
  );
  // The same name again is someone else of that name, or nobody: never the dead twice.
  say(`[world: died="${first!.name}" place="${town.name}"]`);
  assert.match(
    say(`[world: died="${second!.name}" place="${town.name}" successor="Brand Newman" relation="outsider"]`),
    /result="ok"/,
  );
  assert.match(say(`[world: days="400"]`), /result="ok"/);
  assert.match(
    say(`[world: died="Brand Newman" place="${town.name}" note="of a fever"]`),
    /result="ok"/,
    "a successor from play can die too",
  );
  assert.match(say(`[world: arrived="refugees" origin="the burned hamlets" place="${town.name}"]`), /result="ok"/);
  assert.match(say(`[world: arrived="pilgrims" origin="x" place="${town.name}"]`), /unreadable/);
  assert.match(
    say(`[world: event="Plague struck ${town.name}; many died." kind="catastrophe" place="${town.name}"]`),
    /result="ok"/,
  );
  const present = worldPresent(game, readWorldLedger(replies));
  const deaths = present.deaths ?? [];
  assert.equal(new Set(deaths.map((each) => `${each.personId}|${each.day}`)).size, deaths.length);
  assert.ok(!deaths.slice(1).some((each) => each.personId === first!.id), "the dead do not die twice");
  assert.ok(deaths.length >= 3);
  const now = worldCastNow(game, town.id, present);
  const firstNow = now.find((person) => person.id === first!.id)!;
  assert.notEqual(firstNow.name, first!.name, "the dead are followed");
  assert.equal(firstNow.succeeds?.name, first!.name);
  assert.equal(firstNow.succeeds?.note, "killed by bandits on the road");
  assert.equal(firstNow.role, first!.role, "the successor takes up their work");
  const secondNow = now.find((person) => person.id === second!.id)!;
  assert.notEqual(secondNow.name, "Brand Newman", "the named successor died in turn");
  assert.equal(secondNow.succeeds?.name, "Brand Newman");
  assert.ok(
    now.some((person) => person.id === third!.id && person.name === third!.name),
    "the living stay",
  );
  assert.deepEqual(worldCastNow(game, town.id, present), now, "the same successors every time");
  const laidOut = worldTown(game, town.id, present)!;
  assert.ok(
    laidOut.people.some((person) => person.id === first!.id && person.name === firstNow.name),
    "the town has the successor",
  );
  assert.ok(!laidOut.people.some((person) => person.name === first!.name), "and not the dead");
  const where = worldWhereYouAreText(game, { place: town, present });
  assert.ok(!where.includes(`  - ${first!.name}:`), "the GM is not offered the dead");
  assert.match(where, /Still felt here:[^\n]*Plague struck/);
  assert.match(where, /refugees from the burned hamlets lodge in town/);
  assert.match(where, new RegExp(`${first!.name} died \\(killed by bandits`));
  const chronicle = worldTownChronicle(game, town.id, present)!;
  assert.ok(chronicle.lost > 0 && chronicle.burialGround, "a plague in play leaves its mark");
  assert.ok(chronicle.arrivals.some((each) => each.from === "the burned hamlets" && each.lodging > 0));
  // The past moves back as play goes on: a year of play is a year further from the history's woes.
  const later = { ...present, day: present.day + 365 * 40 };
  assert.ok(worldTownChronicle(game, town.id, later)!.lost < chronicle.lost, "the past fades as play goes on");
}

console.log(`world-chronicle regression passed (${warTowns} war towns, ${successors} successors, ${felt} towns felt)`);
