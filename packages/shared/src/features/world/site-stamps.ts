/**
 * Set-piece rooms laid out by hand: each a small plan of where things stand in a room of its kind, drawn
 * with its back wall (away from the door) along the top row. A plan stretches to the room by repeating its
 * marked rows and columns, so one drawing serves rooms of many sizes; it is turned to face the room's door and
 * sometimes mirrored. The generator stamps one where the room is big enough for it and furnishes the rest by
 * its rules as before (owner's call 2026-11-17 after the panels said the rooms read as generated).
 */

/** One hand-drawn plan. */
export interface SiteStamp {
  /** Rows from the back wall to the front, one character a cell (see SITE_STAMP_LEGEND). */
  rows: readonly string[];
  /** The columns [from, to) repeated, in turn, to widen the plan to the room. */
  rx: readonly [number, number];
  /** The rows [from, to) repeated, in turn, to deepen it. */
  ry: readonly [number, number];
  /** The widest and deepest room it is drawn for (the plan looks thin past it). */
  max?: readonly [number, number];
  /** Widened both sides alike: the columns [from, to) on the left, their mirror on the right, so the middle
   * (a tomb, an altar) stays in the middle of the room however wide it is. */
  mirror?: true;
}

/**
 * What each character stands for, as the prop slot of a building's set: 0-7 the set's own (in a house
 * table, bed, shelves, hearth, chest; in a crypt sarcophagus, skeleton, torch, chest, ..., pillar), the
 * letters its dressing.
 */
export const SITE_STAMP_LEGEND: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "7": 7,
  T: 0,
  B: 1,
  S: 2,
  F: 3,
  C: 4,
  b: 8,
  c: 9,
  W: 10,
  D: 11,
  u: 12,
  H: 13,
  A: 14,
  Z: 15,
  O: 16,
  R: 17,
  p: 18,
  K: 19,
  w: 20,
  f: 21,
  m: 22,
  L: 23,
  X: 24,
  P: 25,
  M: 26,
  s: 27,
  h: 28,
  k: 29,
  y: 30,
  v: 31,
  n: 32,
  N: 33,
  j: 34,
  e: 38,
  a: 40,
  d: 41,
  g: 42,
};

/** Pieces a room has one of, never repeated by stretching its plan. */
const SITE_STAMP_ONE_OFF = new Set(["H", "F", "X", "L", "A", "K", "f", "w", "u", "D"]);

const st = (
  rows: readonly string[],
  rx: [number, number],
  ry: [number, number],
  max?: [number, number],
  mirror?: true,
): SiteStamp => ({
  rows,
  rx,
  ry,
  ...(max ? { max } : {}),
  ...(mirror ? { mirror } : {}),
});

const GREAT_HALL: SiteStamp[] = [
  // The high table across the dais end, two long boards down the hall with benches either side.
  st(["Z.sHs.Z", ".TTTTT.", ".......", "sTs.sTs", "sTs.sTs", ".......", "b.....c"], [3, 4], [3, 5]),
  // Boards along the side walls, the open hearth in the middle of the floor.
  st(["Z.sHs.Z", ".TTTTT.", ".......", "Ts...sT", "Ts.F.sT", "Ts...sT", ".......", "b..g..c"], [2, 5], [3, 4]),
  // A small hall: one board down the middle.
  st([".sHs.", ".TTT.", ".....", ".sTs.", ".sTs.", ".....", "b...c"], [0, 1], [3, 5], [6, 14]),
];

const PLANS: Record<string, SiteStamp[]> = {
  "Great hall": GREAT_HALL,
  // One table, its chairs round it, the sideboard on the back wall and the hearth.
  "Dining room": [
    st(["Z.WFW.Z", ".......", "..sss..", ".sTTTs.", "..sss..", "......."], [0, 1], [1, 2], [11, 8]),
    st(["W.F.W", ".....", ".sss.", "sTTTs", ".sss.", "....."], [2, 3], [5, 6], [9, 7]),
  ],
  // Tables down both long walls, the reader's lectern at the head.
  Refectory: [st(["..L..", ".....", "Ts.sT", "Ts.sT", ".....", "b...c"], [2, 3], [2, 4])],
  "Servants' hall": [
    st(["b.F.c", ".....", "Ts.sT", "Ts.sT", ".....", "....."], [2, 3], [2, 4]),
    st(["..F..", ".sss.", ".TTT.", ".sss.", ".....", "b...g"], [0, 1], [1, 4]),
  ],
  // The range on the back wall, a work table in the middle, stores in the corners.
  Kitchen: [
    st(["j.KK.b", "......", "..TT..", ".s..s.", "......", "c...gb"], [2, 4], [4, 5]),
    st(["bjK.F", ".....", ".TT..", ".....", "c..gb"], [3, 4], [1, 2]),
  ],
  Bakehouse: [st(["KK.Fj", ".....", ".TT..", ".....", "c...b"], [3, 4], [3, 4])],
  // A bed against the back wall, a chest either side, wardrobe, desk or tub, hearth.
  Bedroom: [
    st(["CBC.W", ".....", ".....", "D..F."], [3, 4], [1, 3], [8, 7]),
    st(["W.CBC", ".....", "u....", "....s"], [1, 2], [1, 2], [8, 7]),
  ],
  "Master bedroom": [st(["WCBC.F", "......", "......", "u...Ds", "......"], [4, 5], [1, 3], [10, 8])],
  // The library: shelves round the walls, a reading table and a lectern.
  Library: [
    st(["SSSSS", "S...S", "S.D.S", "S...S", "S.L.."], [2, 3], [1, 2]),
    st(["SS.SS", ".....", ".TsT.", ".....", "SS.SS"], [2, 3], [1, 2], [9, 9]),
  ],
  Study: [st(["S.S.S", ".....", ".sD..", ".....", "C...W"], [3, 4], [1, 2], [7, 6])],
  // A chapel: the altar against the back wall, a step clear before it, benches facing it.
  Chapel: [
    st(["Z.X.Z", ".....", "P...P", "P...P", "....."], [2, 3], [2, 4]),
    st(["..X..", ".L...", ".....", "PP.PP", "....."], [2, 3], [3, 4]),
  ],
  // Barracks: beds along both long walls, a chest at the foot of each, the rack and table at the back.
  Barracks: [
    st(["R.T.R", "..s..", "BC.CB", "BC.CB", ".....", "b...k"], [2, 3], [2, 4]),
    st(["R.F.R", ".....", "p...p", "p.T.p", "p...p", "....."], [2, 3], [2, 5]),
  ],
  // A guardroom: the table and stools in the middle, racks on the back wall, a brazier.
  Guardroom: [
    st(["R.F.R", ".....", ".sTs.", ".....", "C...k"], [2, 3], [1, 2], [8, 7]),
    st(["RR.CC", ".....", "..T..", ".s.s.", "....."], [2, 3], [1, 2], [8, 7]),
  ],
  Armoury: [st(["RRRRR", ".....", "R.d.R", ".....", "C...C"], [2, 3], [1, 2])],
  // The smithy: forge and anvil, the woodpile and the quench bucket.
  Smithy: [st(["gF.Rb", ".....", ".Ak..", ".....", "c..yy"], [2, 3], [1, 2])],
  // Stables: stalls along the back wall, hay, a cart or a woodpile near the door.
  Stables: [st(["mmmmm", ".....", "y.y.y", ".....", "k...a"], [1, 2], [1, 2])],
  // The torture chamber: chains on the back wall, the brazier, the table with its tools.
  "Torture chamber": [st(["h.h.h", ".....", ".T.F.", ".....", "k...n"], [2, 3], [1, 2], [8, 7])],
  "Interrogation room": [st(["h.F.h", ".....", ".sTs.", ".....", "k..n."], [2, 3], [1, 2], [8, 7])],
  // A cell: straw, a pallet, the bucket, the chains.
  Cell: [st(["hp", "..", "yk"], [0, 1], [1, 2], [4, 4]), st(["h.p", "...", "y.k"], [1, 2], [1, 2], [4, 4])],
  // Cellars: wine racks in rows with an aisle, barrels at the end.
  "Wine cellar": [st(["vvvvv", ".....", "v.v.v", "v.v.v", ".....", "b...b"], [3, 4], [2, 4])],
  // Stores: stacks with an aisle down the middle, so a store is gone through, not heaped.
  Storeroom: [
    st(["cc.bb", "c...b", ".....", "jj.cc"], [2, 3], [1, 3]),
    st(["SSSSS", ".....", "cc.bb", ".....", "....."], [2, 3], [3, 4]),
  ],
  Pantry: [st(["jjjj", "j..j", "....", "b..c"], [1, 3], [1, 3])],
  Treasury: [st(["CCC", ".C.", "...", "Z.Z"], [1, 2], [2, 3], [7, 6])],
  // Scriptorium: desks in rows facing the back wall, the shelves of books along it.
  Scriptorium: [st(["SS.SS", ".....", "D.D.D", ".....", "D.D.D", "....."], [3, 5], [2, 4])],
  // The chapter house: benches round its walls, the lectern in the middle.
  "Chapter house": [st(["PPPPP", "P...P", "P.L.P", "P...P", "....."], [2, 3], [2, 3])],
  Infirmary: [st(["B.B.B", ".....", "..T..", ".....", "B.B.B", "....."], [1, 2], [2, 3])],
  // A ballroom: statues and columns round its edge, its floor clear for dancing.
  Ballroom: [st(["Z.O.Z", ".....", "O...O", ".....", "Z...Z"], [1, 2], [1, 2])],
  "Entrance hall": [st(["Z.Z", "...", "..."], [1, 2], [1, 3]), st(["Z.C.Z", ".....", "....."], [1, 2], [1, 3])],
  // A crypt's burial hall: piers in rows, the dead between them, torches at the head.
  "Burial hall": [
    // Widened by the empty bays either side, not by more rows of the dead (panel round 33: a hall stretched
    // to some fifty tombs in a grid).
    st(["2.0.2", ".....", "7.0.7", ".....", "7.0.7", "....."], [1, 2], [2, 4], undefined, true),
    st(["2...2", ".7.7.", ".0.0.", ".7.7.", "....."], [2, 3], [1, 4]),
  ],
  // The founder's tomb: the one tomb in the middle of a ring of piers, its grave goods against the back wall
  // behind it, a robber dead at its foot, and an aisle of piers and torches up to it from the door; widened
  // both sides alike so the tomb stays in the middle (panel round 29: the tomb pushed into a corner, the
  // room bare).
  "Founder's tomb": [
    st(["2..3.3..2", ".7.....7.", "....0....", ".7.1...7.", ".2.....2.", ".7.....7."], [2, 3], [4, 6], undefined, true),
    st(["2.....2", ".7...7.", "...0...", ".......", ".7...7."], [2, 3], [3, 5], undefined, true),
  ],
  // An ossuary: skulls in the walls, bones heaped in the corners.
  Ossuary: [st(["NNNNN", "N...N", "n...n", "....."], [2, 3], [1, 3])],
  // A chapel below ground: the altar and its torches, a skeleton at prayer.
  "Mortuary chapel": [st(["2.X.2", ".....", "7...7", ".....", "7...7", "....."], [2, 3], [2, 4])],
};

/** Rooms laid out like another's plan. */
const LIKE: Record<string, string> = {
  "Guest bedroom": "Bedroom",
  "Guest chamber": "Bedroom",
  Bedchamber: "Bedroom",
  "Lady's chamber": "Master bedroom",
  "Lord's chamber": "Master bedroom",
  "Book room": "Library",
  "Writing room": "Study",
  "Steward's office": "Study",
  "Estate office": "Study",
  "Lady chapel": "Chapel",
  "Side chapel": "Chapel",
  Oratory: "Chapel",
  "Chantry chapel": "Chapel",
  "Officers' quarters": "Barracks",
  "Guard room": "Guardroom",
  "Guard post": "Guardroom",
  Gatehouse: "Guardroom",
  "Gaoler's room": "Guardroom",
  "Watch room": "Guardroom",
  "Gun room": "Armoury",
  "Wine vault": "Wine cellar",
  "Beer cellar": "Wine cellar",
  "Store room": "Storeroom",
  Storehouse: "Storeroom",
  "Store vault": "Storeroom",
  Larder: "Pantry",
  "Butler's pantry": "Pantry",
  Strongroom: "Treasury",
  "Secret strongroom": "Treasury",
  Vault: "Treasury",
  "Wall tombs": "Burial hall",
  Catacomb: "Burial hall",
  "Family crypt": "Burial hall",
  "Burial vault": "Burial hall",
  Charnel: "Ossuary",
  "Bone pit": "Ossuary",
  "Crypt chapel": "Mortuary chapel",
};

/** The hand-drawn plans for a room by name (numbered copies share their room's), none where there is none. */
export function siteStampsFor(base: string): readonly SiteStamp[] {
  return PLANS[base] ?? PLANS[LIKE[base] ?? ""] ?? [];
}

/** A plan stretched to `across` by `deep` cells: its rows and columns repeated in turn; null if it won't go. */
export function siteStampStretch(stamp: SiteStamp, across: number, deep: number): string[] | null {
  const [w0, h0] = [stamp.rows[0]!.length, stamp.rows.length];
  if (across < w0 || deep < h0) return null;
  if (stamp.max && (across > stamp.max[0] || deep > stamp.max[1])) return null;
  // Which source index each output index takes, and whether it is a repeat.
  const grow = (length: number, want: number, [from, to]: readonly [number, number]) => {
    const out: Array<[number, boolean]> = [];
    for (let k = 0; k < to; k++) out.push([k, false]);
    for (let k = 0; out.length + (length - to) < want; k++) out.push([from + (k % (to - from)), true]);
    for (let k = to; k < length; k++) out.push([k, false]);
    return out;
  };
  const mirrored = (want: number, [from, to]: readonly [number, number]) => {
    const extra = want - w0;
    const left = Math.floor(extra / 2);
    const out: Array<[number, boolean]> = [];
    for (let k = 0; k < to; k++) out.push([k, false]);
    for (let k = 0; k < left; k++) out.push([from + (k % (to - from)), true]);
    for (let k = to; k < w0 - to; k++) out.push([k, false]);
    for (let k = 0; k < extra - left; k++) out.push([w0 - to + (k % (to - from)), true]);
    for (let k = w0 - to; k < w0; k++) out.push([k, false]);
    return out;
  };
  const cols = stamp.mirror && stamp.rx[1] * 2 <= w0 ? mirrored(across, stamp.rx) : grow(w0, across, stamp.rx);
  const rows = grow(h0, deep, stamp.ry);
  // A one-off piece (the high seat, the hearth, the altar) is never repeated by the stretch.
  return rows.map(([r, rr]) =>
    cols
      .map(([c, cr]) => {
        const ch = stamp.rows[r]![c]!;
        return (rr || cr) && SITE_STAMP_ONE_OFF.has(ch) ? "." : ch;
      })
      .join(""),
  );
}
