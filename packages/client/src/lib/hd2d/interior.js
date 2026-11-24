// @ts-nocheck
// Interior planner, stage 1: homes. Reads one house shell from the town (window.__HOUSES entry + household)
// and returns its floors: rooms, walls, doors, windows, stair, furniture, checks.
// Local grid: x along the front (0..Wi-1, left to right seen from the street), y into the house (0 = street row).
// One exterior cell = one timber bay of 3 interior cells (+1 for the walls): Wi = 3W+1, Di = 3D+1.

export const rngOf = (seed) => { let a = seed * 2654435761 >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

// ---------- rooms ----------
export const ROOM = {
  hall: { name: 'Hall', light: 1, min: [3, 3] },
  shop: { name: 'Shop', light: 1, min: [3, 3] },
  workshop: { name: 'Workshop', light: 1, min: [3, 3] },
  passage: { name: 'Passage', light: 0, min: [1, 2] },
  buttery: { name: 'Buttery', light: 0, min: [2, 2] },
  pantry: { name: 'Pantry', light: 0, min: [2, 2] },
  service: { name: 'Service room', light: 0, min: [2, 2] },
  parlour: { name: 'Parlour', light: 1, min: [3, 3] },
  chamber: { name: 'Chamber', light: 1, min: [3, 3] },
  great: { name: 'Great chamber', light: 1, min: [3, 3] },
  counting: { name: 'Counting house', light: 1, min: [2, 2] },
  garret: { name: 'Garret', light: 0, min: [3, 3] },
  loft: { name: 'Loft', light: 0, min: [3, 3] },
  cellar: { name: 'Cellar', light: 0, min: [3, 3] },
  yard: { name: 'Yard', light: 0, min: [1, 1] },
  kitchen: { name: 'Kitchen', light: 1, min: [3, 3] },
  goods: { name: 'Goods room', light: 1, min: [3, 3] },
  closet: { name: 'Closet', light: 0, min: [2, 2] },
  lobby: { name: 'Lobby', light: 0, min: [1, 1] },
  bakehouse: { name: 'Bakehouse', light: 0, min: [2, 3] },
  guest: { name: 'Guest chamber', light: 1, min: [3, 3] },
  office: { name: "Innkeeper's office", light: 1, min: [2, 2] },
  tower: { name: 'Tower', light: 0, min: [3, 3] }, nave: { name: 'Nave', light: 1, min: [3, 3] }, chancel: { name: 'Chancel', light: 1, min: [3, 3] },
  ringing: { name: 'Ringing chamber', light: 1, min: [3, 3] }, belfry: { name: 'Bell chamber', light: 0, min: [3, 3] },
};

// ---------- props: w along the wall, h out from the wall; sleeps = people per bed ----------
export const PROP = {
  hearth: { w: 2, h: 1, block: 1, label: 'Hearth' }, brazier: { w: 1, h: 1, block: 1, label: 'Brazier' }, stack: { w: 1, h: 1, block: 1, label: 'Chimney' },
  fireplace: { w: 2, h: 1, block: 1, label: 'Fireplace' },
  greatbed: { w: 2, h: 2, block: 1, sleeps: 2, tall: 1, label: 'Curtained bed' }, bed: { w: 1, h: 2, block: 1, sleeps: 2, label: 'Bed' },
  lastbench: { w: 2, h: 1, block: 1, label: "Shoemaker's bench" }, cuttingtable: { w: 2, h: 1, block: 1, label: 'Cutting table' }, grindstone: { w: 1, h: 1, block: 1, label: 'Grindstone' },
  dipframe: { w: 2, h: 1, block: 1, label: 'Candle frame' }, workbench: { w: 2, h: 1, block: 1, label: 'Workbench' }, staves: { w: 1, h: 1, block: 1, label: 'Staves and hoops' }, clothshelf: { w: 2, h: 1, block: 1, tall: 1, label: 'Cloth shelves' },
  kingbed: { w: 2, h: 2, block: 1, sleeps: 2, label: 'Great bedstead' }, bunk: { w: 1, h: 2, block: 1, sleeps: 2, tall: 1, label: 'Bunk bed' },
  pallet: { w: 1, h: 2, block: 1, sleeps: 1, low: 1, label: 'Pallet' },
  chest: { w: 1, h: 1, block: 1, low: 1, label: 'Chest' }, table: { w: 2, h: 1, block: 1, label: 'Trestle table' }, longtable: { w: 3, h: 1, block: 1, label: 'Table' },
  settle: { w: 2, h: 1, block: 1, label: 'Settle' }, cupboard: { w: 1, h: 1, block: 1, tall: 1, label: 'Cupboard' }, shelf: { w: 1, h: 1, block: 1, tall: 1, label: 'Shelves' },
  counter: { w: 3, h: 1, block: 1, label: 'Counter' }, bench: { w: 2, h: 1, block: 1, label: 'Workbench' }, barrel: { w: 1, h: 1, block: 1, label: 'Barrel' },
  desk: { w: 1, h: 1, block: 1, label: 'Counting board' }, wheel: { w: 1, h: 1, block: 1, label: 'Spinning wheel' }, closestool: { w: 1, h: 1, block: 1, low: 1, label: 'Close-stool' },
  stool: { w: 1, h: 1, block: 1, low: 1, label: 'Stool' }, chair: { w: 1, h: 1, block: 1, label: 'Chair' }, woodpile: { w: 1, h: 1, block: 1, low: 1, label: 'Firewood' },
  basket: { w: 1, h: 1, block: 1, low: 1, label: 'Basket' }, bucket: { w: 1, h: 1, block: 1, low: 1, label: 'Bucket' }, tub: { w: 1, h: 1, block: 1, low: 1, label: 'Tub' },
  sack: { w: 1, h: 1, block: 1, low: 1, label: 'Sacks' }, crate: { w: 1, h: 1, block: 1, label: 'Crate' }, coffer: { w: 1, h: 1, block: 1, low: 1, label: 'Coffer' },
  candlestand: { w: 1, h: 1, block: 1, label: 'Candle stand' }, form: { w: 2, h: 1, block: 1, low: 1, label: 'Form (bench)' },
  sideboard: { w: 2, h: 1, block: 1, label: 'Sideboard' }, trap: { w: 1, h: 1, block: 1, low: 1, label: 'Cellar hatch' }, privy: { w: 1, h: 1, block: 1, tall: 1, label: 'Privy' }, well: { w: 1, h: 1, block: 1, label: 'Well' },
  coop: { w: 1, h: 1, block: 1, low: 1, label: 'Hen coop' }, sty: { w: 2, h: 2, block: 1, low: 1, label: 'Pigsty' }, garden: { w: 2, h: 2, block: 1, low: 1, label: 'Kitchen garden' },
  cart: { w: 2, h: 1, block: 1, label: 'Handcart' }, timber: { w: 2, h: 1, block: 1, low: 1, label: 'Timber stack' }, choppingblock: { w: 1, h: 1, block: 1, low: 1, label: 'Chopping block' },
  forge: { w: 2, h: 2, block: 1, label: 'Forge' }, oven: { w: 2, h: 2, block: 1, label: 'Bread oven' }, anvil: { w: 1, h: 1, block: 1, low: 1, label: 'Anvil' }, washtub: { w: 1, h: 1, block: 1, low: 1, label: 'Wash tub' }, stillage: { w: 2, h: 1, block: 1, low: 1, label: 'Casks on a stillage' }, cradle: { w: 1, h: 1, block: 1, low: 1, label: 'Cradle' }, washstand: { w: 1, h: 1, block: 1, label: 'Basin and ewer' },
  hoodhearth: { w: 2, h: 1, block: 1, label: 'Hearth under a smoke hood' }, trough: { w: 2, h: 1, block: 1, low: 1, label: 'Kneading trough' }, dresser: { w: 2, h: 1, block: 1, tall: 1, label: 'Pot shelves' },
  loom: { w: 2, h: 2, block: 1, label: 'Loom' }, mortar: { w: 1, h: 1, block: 1, label: 'Mortar on its block' }, hatch: { w: 2, h: 1, block: 1, label: 'Tap hatch' }, lathe: { w: 2, h: 1, block: 1, label: 'Pole lathe' }, bale: { w: 1, h: 1, block: 1, low: 1, label: 'Cloth bales' }, scales: { w: 1, h: 1, block: 1, label: 'Beam scales' },
  vat: { w: 1, h: 1, block: 1, label: 'Dye vat' }, hoist: { w: 1, h: 1, block: 1, tall: 1, label: 'Hoist wheel' },
  millstones: { w: 2, h: 2, block: 1, label: 'Millstones on the hurst' }, pitwheel: { w: 2, h: 1, block: 1, label: 'Pit wheel' }, fullingstocks: { w: 2, h: 2, block: 1, label: 'Fulling stocks' }, bin: { w: 2, h: 1, block: 1, label: 'Meal bin' },
  portslot: { w: 2, h: 1, block: 1, low: 1, label: 'Portcullis slot' }, windlass: { w: 2, h: 1, block: 1, label: 'Portcullis windlass' }, murder: { w: 2, h: 1, block: 0, low: 1, label: 'Murder holes' },
  furnace: { w: 3, h: 3, block: 1, tall: 1, label: 'Smelting furnace' }, bellows: { w: 2, h: 2, block: 1, label: 'Great bellows' }, moulds: { w: 2, h: 1, block: 1, low: 1, label: 'Ingot moulds' },
  slag: { w: 1, h: 1, block: 1, low: 1, label: 'Slag' }, oreheap: { w: 2, h: 2, block: 1, low: 1, label: 'Ore heap' }, charcoal: { w: 2, h: 2, block: 1, low: 1, label: 'Charcoal heap' }, ironrack: { w: 2, h: 1, block: 1, tall: 1, label: 'Iron bar rack' }, rack: { w: 2, h: 1, block: 1, tall: 1, label: 'Drying poles' },
  pier: { w: 1, h: 1, block: 1, tall: 1, label: 'Arcade pier' }, pew: { w: 1, h: 3, block: 1, low: 1, label: 'Oak bench' }, screen: { w: 1, h: 1, block: 1, tall: 1, label: 'Rood screen' },
  rood: { w: 1, h: 2, block: 0, label: 'Rood loft' }, parclose: { w: 1, h: 1, block: 1, label: 'Parclose screen' }, highaltar: { w: 1, h: 3, block: 1, label: 'High altar' }, altar: { w: 1, h: 2, block: 1, label: 'Chapel altar' },
  footpace: { w: 1, h: 5, block: 0, low: 1, label: 'Altar step' }, tomb: { w: 2, h: 1, block: 1, low: 1, label: 'Tomb chest' }, sedilia: { w: 2, h: 1, block: 1, label: 'Sedilia' }, stall: { w: 3, h: 1, block: 1, label: 'Quire stalls' },
  lectern: { w: 1, h: 1, block: 1, label: 'Eagle lectern' }, pulpit: { w: 1, h: 1, block: 1, tall: 1, label: 'Pulpit' }, font: { w: 2, h: 2, block: 1, label: 'Font' }, wallpaint: { w: 3, h: 1, block: 0, label: 'Wall painting of St Christopher' },
  image: { w: 1, h: 1, block: 1, tall: 1, label: 'Saint on a bracket' },
  post: { w: 1, h: 1, block: 1, tall: 1, label: 'Oak post' }, hallscreen: { w: 1, h: 1, block: 1, tall: 1, label: 'Hall screen' }, dais: { w: 3, h: 3, block: 0, low: 1, label: 'Dais' },
  hightable: { w: 4, h: 1, block: 1, label: 'High table' }, chairstate: { w: 1, h: 1, block: 1, label: 'Chair of state' }, hanging: { w: 3, h: 1, block: 0, label: 'Painted hanging' },
  townchest: { w: 2, h: 1, block: 1, low: 1, label: 'Town chest' }, armsrack: { w: 2, h: 1, block: 1, tall: 1, label: 'Rack of bills and pikes' }, stocks: { w: 2, h: 1, block: 1, low: 1, label: 'Stocks' },
  bar: { w: 3, h: 1, block: 1, label: 'Bar of the court' }, tron: { w: 2, h: 1, block: 1, tall: 1, label: 'Town beam' }, bellropes: { w: 3, h: 2, block: 0, label: 'Bell ropes' }, bellframe: { w: 5, h: 4, block: 1, tall: 1, label: 'Bells in their frame' },
};
// non-blocking companions drawn with a parent (stools and forms tucked at tables, a truckle bed under the great bed)
const COMP = { table: ['form'], longtable: ['form', 'chair'], greatbed: ['truckle'], kingbed: ['truckle'], desk: ['stool'], bench: ['stool'], hearth: ['pot', 'pothanger', 'andirons', 'spit'], hoodhearth: ['pot', 'pothanger'] };

const TIERS = ['poor', 'artisan', 'merchant', 'patrician'];
// dressing: smaller things from the inventories, added along the walls until a room reads lived-in (about one piece per 4.5 cells)
const DRESS = {
  hall: { poor: ['woodpile', 'bucket', 'stool', 'basket', 'chest'], artisan: ['woodpile', 'form', 'stool', 'chest', 'bucket', 'basket'], merchant: ['woodpile', 'form', 'chair', 'chest', 'candlestand', 'stool'], patrician: ['woodpile', 'chair', 'form', 'candlestand', 'chest', 'chair'] },
  shop: { _: ['crate', 'basket', 'barrel', 'sack', 'shelf', 'stool'] }, workshop: { _: ['crate', 'basket', 'shelf', 'tub', 'stool', 'woodpile'] },
  parlour: { _: ['chair', 'chest', 'stool', 'candlestand', 'coffer'] }, great: { _: ['chair', 'coffer', 'stool', 'candlestand', 'chest'] },
  chamber: { poor: ['basket', 'stool', 'chest'], artisan: ['stool', 'basket', 'coffer', 'chest'], _: ['stool', 'coffer', 'chair', 'basket', 'chest'] },
  counting: { _: ['shelf', 'coffer', 'stool'] }, buttery: { _: ['barrel', 'tub', 'shelf', 'barrel', 'bucket'] }, pantry: { _: ['shelf', 'basket', 'sack', 'crate', 'tub'] },
  service: { _: ['tub', 'bucket', 'woodpile', 'barrel', 'sack', 'basket'] }, garret: { _: ['sack', 'crate', 'chest', 'basket', 'sack'] }, loft: { _: ['sack', 'basket', 'crate'] }, passage: { _: [] },
  kitchen: { _: ['woodpile', 'bucket', 'barrel', 'basket', 'stool', 'shelf'] }, goods: { _: ['bale', 'crate', 'sack', 'bale', 'barrel', 'chest'] }, closet: { _: ['chest', 'shelf', 'coffer'] },
};
// trades: an artisan house works one trade, which fits out its front room, its yard and its cellar
export const TRADE = {
  // tool: the trade's own work place (must fit); extra: its other gear, where there is room
  shoemaker: { room: 'shop', tool: 'lastbench', extra: ['shelf'] }, tailor: { room: 'shop', tool: 'cuttingtable', extra: ['rack'] }, cutler: { room: 'shop', tool: 'grindstone', extra: ['bench'] }, chandler: { room: 'shop', tool: 'dipframe', extra: ['tub'] },
  turner: { room: 'shop', tool: 'lathe', extra: ['timber'] }, baker: { room: 'shop', tool: 'trough', yard: 'baker', extra: ['sack'] }, weaver: { room: 'workshop', tool: 'loom', extra: ['wheel'] },
  cooper: { room: 'workshop', tool: 'workbench', yard: 'cooper', extra: ['staves'] }, carpenter: { room: 'workshop', tool: 'workbench', yard: 'carpenter', extra: ['timber'] }, smith: { room: 'workshop', tool: 'forge' }, dyer: { room: 'workshop', tool: 'vat', yard: 'dyer' },
  // merchant lines: beam scales in every shop, then the line's own kit; the cellar holds the same goods
  mercer: { room: 'shop', kit: ['clothshelf', 'table', 'bale'], cellar: ['bale', 'crate', 'bale', 'chest'] }, draper: { room: 'shop', kit: ['clothshelf', 'table', 'bale'], cellar: ['bale', 'bale', 'crate', 'bale'] },
  grocer: { room: 'shop', kit: ['sack', 'sack', 'crate'], cellar: ['sack', 'sack', 'barrel', 'crate', 'sack'] }, vintner: { room: 'shop', kit: ['stillage'], cellar: ['stillage', 'stillage', 'barrel'] },
  ironmonger: { room: 'shop', kit: ['ironrack', 'crate'], cellar: ['crate', 'crate', 'ironrack', 'barrel'] },
  // the apothecary: drug jars on shelves round the walls and a great mortar on its block; stock kept dry, never in the cellar
  apothecary: { room: 'shop', kit: ['mortar', 'shelf', 'shelf'], cellar: ['barrel', 'crate'] },
  // drink and lodging: the inn's wine and ale in the cellar; an alehouse brews and keeps its barrels in the buttery
  inn: { cellar: ['stillage', 'stillage', 'barrel', 'stillage', 'barrel', 'barrel'] }, alehouse: { cellar: ['barrel', 'barrel', 'stillage'] },
};
const ART_TRADES = ['shoemaker', 'tailor', 'cutler', 'chandler', 'turner', 'baker', 'weaver', 'cooper', 'carpenter', 'smith', 'dyer'], MER_TRADES = ['mercer', 'draper', 'grocer', 'vintner', 'ironmonger', 'apothecary'];
export function tierOf(H) {
  if (H.inn) return 'merchant';   // an innholder lived like a merchant; the inn's own programme decides its rooms
  const d = H.dist;
  if (d === 'poor' || d === 'cottage' || d === 'miner') return 'poor';
  if (d === 'craft') return 'artisan';
  if (d === 'rich') return H.W * H.D >= 6 && H.st >= 2 ? 'patrician' : 'merchant';
  if (d === 'ware') return 'merchant';
  return H.shop && (H.street === 'main' || H.street === 'square' || H.street === 'quay') ? 'merchant' : 'artisan';
}

// ---------- who lives here ----------
function household(H, tier, hh, r) {
  const base = 2 + Math.floor(r() * 3) + Math.floor(r() * 3), bays = H.W * H.D * Math.max(1, H.st), lo = tier === 'patrician' ? 7 : tier === 'merchant' ? 4 : 2;
  const size = hh ? hh.size : Math.max(lo, Math.min(Math.max(lo, Math.min(tier === 'patrician' ? 11 : 9, 2 + bays)), base + (tier === 'patrician' ? 4 : tier === 'merchant' ? 1 : 0))), kids = hh ? hh.kids : Math.max(0, Math.floor((size - 2) * .6));
  const adults = size - kids, P = [];
  if (adults >= 2) P.push({ role: 'master' }, { role: 'mistress' }); else P.push({ role: 'master' });
  for (let i = 0; i < kids; i++) P.push({ role: 'child' });
  for (let i = P.length; i < size; i++) P.push({ role: tier === 'poor' ? 'kin' : tier === 'artisan' && (H.shop || H.dist === 'craft') ? 'apprentice' : tier === 'artisan' ? 'kin' : H.shop && size >= 4 && i === P.length && !P.some((q) => q.role === 'apprentice') ? 'apprentice' : 'servant' });
  return P;
}

// ---------- programmes: bands front to back, each split across the width ----------
// d: [min,max] depth; cols: rooms left to right ({t, w:[min,max]}); a col with door:1 must contain the street door
// returns a list of programmes: the first is the usual one, the rest are variants the scorer may pick (e.g. when the chimney stands at the back)
function programme(tier, f, ctx) {
  const { Wi, Di, st, front: workT } = ctx, top = f === st - 1, works = !!workT;
  if (ctx.loft && f === 1) return [[{ d: [Di, Di], cols: [{ t: 'loft' }] }]];
  const R = (t, w) => ({ t, w });
  // an inn (the converted-house kind, no courtyard): the common hall at the street door, the innkeeper's office beside it, the buttery with its tap hatch,
  // the kitchen behind; upstairs guest chambers either side of a landing, never one through another; the innholder's chamber on the first floor, the staff's garret at the top
  if (ctx.inn) {
    const D1 = { t: 'hall', w: [4, Wi], door: 1 };
    if (f === 0) {
      if (Di >= 7) { const back = { d: [3, Di - 4], cols: Wi >= 7 ? [R('kitchen', [3, Wi - 2]), R('buttery', [2, 3])] : [R('kitchen')] };
        return [[{ d: [4, Di - 3], cols: Wi >= 7 ? [{ ...D1, w: [4, Wi - 2] }, R('office', [2, 3])] : [D1] }, back], [{ d: [4, Di - 3], cols: Wi >= 7 ? [R('office', [2, 3]), { ...D1, w: [4, Wi - 2] }] : [D1] }, back], [{ d: [4, Di - 3], cols: [D1] }, back]]; }
      return Wi >= 7 ? [[{ d: [Di, Di], cols: [{ ...D1, w: [4, Wi - 2] }, R('buttery', [2, 3])] }], [{ d: [Di, Di], cols: [R('buttery', [2, 3]), { ...D1, w: [4, Wi - 2] }] }]] : [[{ d: [Di, Di], cols: [D1] }]];
    }
    const top = f === st - 1 && st >= 3, gw = [3, Math.max(3, Wi - 4)], L = { t: 'lobby', w: [1, 2] };
    const row = (a, b) => Wi >= 7 ? [R(a, gw), L, R(b, gw)] : [R(a)];
    const pairs = f === 1 ? [['great', 'guest'], ['guest', 'great']] : top ? [['guest', 'garret'], ['garret', 'guest']] : [['guest', 'guest']];
    const out = [];
    for (const [a, b] of pairs) { out.push([{ d: [Di, Di], cols: row(a, b) }]); if (Di >= 7) out.push([{ d: [3, Di - 3], cols: row(a, 'guest') }, { d: [3, Di - 3], cols: row('guest', b) }]);
      // or a gallery-like landing across the back, the stair rising along it, and the chambers side by side along the street, each opening onto it
      if (Di >= 6 && Wi >= 7) { const three = Wi >= 10 ? [R(a, [3, 4]), R('guest', [3, 4]), R(b, [3, 4])] : [R(a, [3, 4]), R(b, [3, 4])]; out.push([{ d: [3, Di - 2], cols: three }, { d: [2, 3], cols: [{ t: 'lobby' }] }]); } }
    return out;
  }
  // an alehouse: the drinking room is the house's hall, the buttery (barrels and brewing tubs) behind or beside it; no bar counter
  if (ctx.ale && f === 0) {
    const H1 = { t: 'hall', w: [4, Wi], door: 1 };
    // a one-storey alehouse keeps an inner chamber behind for the family (and a lodger), beside the buttery; nobody sleeps among the drinkers
    if (st === 1 && Di >= 7) return [[{ d: [4, Di - 3], cols: [H1] }, { d: [3, Di - 4], cols: Wi >= 7 ? [R('buttery', [2, 3]), R('chamber', [3, Wi - 2])] : [R('chamber')] }], ...(Wi >= 7 ? [[{ d: [4, Di - 3], cols: [H1] }, { d: [3, Di - 4], cols: [R('chamber', [3, Wi - 2]), R('buttery', [2, 3])] }]] : [])];
    if (st === 1) return Wi >= 7 ? [[{ d: [Di, Di], cols: [{ ...H1, w: [4, Wi - 3] }, R('chamber', [3, 3])] }], [{ d: [Di, Di], cols: [R('chamber', [3, 3]), { ...H1, w: [4, Wi - 3] }] }]] : [[{ d: [Di, Di], cols: [H1] }]];
    if (Di >= 7) return [[{ d: [4, Di - 3], cols: [H1] }, { d: [3, Di - 4], cols: [R('buttery')] }]];
    return Wi >= 7 ? [[{ d: [Di, Di], cols: [{ ...H1, w: [4, Wi - 2] }, R('buttery', [2, 3])] }], [{ d: [Di, Di], cols: [R('buttery', [2, 3]), { ...H1, w: [4, Wi - 2] }] }]] : [[{ d: [Di, Di], cols: [H1] }]];
  }
  const withPass = (cols) => { if (ctx.pass) cols.splice(ctx.passSide === 'l' ? 0 : cols.length, 0, { t: 'passage', w: [ctx.passW, ctx.passW], door: 1 }); return cols; };
  // upper floors: a 3-bay-wide single room is split at a bay line; a two-band floor may run either way round (the heated room is the best one)
  const chambers = (t = 'chamber') => Wi >= 10 ? [R(t, [3, Wi - 3]), R('chamber', [3, Wi - 3])] : [R(t)];
  const flip = (prog) => prog.length === 2 ? [prog, [prog[1], prog[0]]] : [prog];
  if (tier === 'poor') {
    if (f === 0) return [Di >= 7 && st === 1 ? [{ d: [4, Di], cols: [R('hall')] }, { d: [3, 4], cols: [R('chamber')] }] : [{ d: [Di, Di], cols: [R('hall')] }]];
    return [[{ d: [Di, Di], cols: [R('chamber')] }]];
  }
  if (tier === 'artisan') {
    if (f === 0) {
      if (Di <= 4) return [works && Wi >= 7 ? [{ d: [Di, Di], cols: [R(workT, [3, Wi - 3]), R('hall', [3, Wi - 3])] }] : [{ d: [Di, Di], cols: [R('hall')] }]];
      const b = [];
      if (works) b.push({ d: [3, 4], cols: [R(workT)] });
      b.push({ d: [3, 6], cols: [R('hall')] });
      if (Di >= 10) b.push({ d: [2, 4], cols: Wi >= 7 ? [R('buttery', [2, Wi - 2]), R('service', [2, Wi - 2])] : [R('service')] });
      return [b];
    }
    if (top && st >= 3) return [[{ d: [Di, Di], cols: [R('garret')] }]];
    return Di >= 7 ? flip([{ d: [3, Di - 3], cols: [R('chamber')] }, { d: [3, Di - 3], cols: [R('chamber')] }]) : [[{ d: [Di, Di], cols: chambers() }]];
  }
  const rear = (pat) => pat ? (Wi >= 10 ? [R('kitchen', [3, 4]), R('buttery', [2, 3]), R('parlour', [3, Wi - 5])] : Wi >= 7 ? [R('kitchen', [3, Wi - 3]), R('parlour', [3, Wi - 3])] : [R('kitchen')])
    : (Wi >= 7 ? [R('kitchen', [3, Wi - 2]), R('buttery', [2, Wi - 3])] : [R('kitchen')]);
  // a merchant's warehouse on the quay: goods and the counting house at the water, the family's hall and great chamber above, the top floor a goods loft under the hoist
  if (ctx.ware && tier === 'merchant') {
    if (f === 0) return Di >= 7 ? [[{ d: [3, Di - 3], cols: withPass([R('goods')]) }, { d: [3, Di - 3], cols: Wi >= 7 ? [R('goods', [3, Wi - 2]), R('counting', [2, 3])] : [R('goods')] }]]
      : Wi >= 7 ? [[{ d: [Di, Di], cols: [R('goods', [3, Wi - 2]), R('counting', [2, 3])] }], [{ d: [Di, Di], cols: [R('counting', [2, 3]), R('goods', [3, Wi - 2])] }]] : [[{ d: [Di, Di], cols: [R('goods')] }]];
    if (top && st >= 3) return [[{ d: [Di, Di], cols: [R('goods')] }]];
    if (f === 1) return Di >= 7 ? flip([{ d: [3, Di - 3], cols: [R('hall')] }, { d: [3, Di - 3], cols: [R('great')] }]) : Wi >= 7 ? [[{ d: [Di, Di], cols: [R('hall', [3, Wi - 3]), R('great', [3, Wi - 3])] }]] : [[{ d: [Di, Di], cols: [R('hall')] }]];
    return Di >= 7 ? flip([{ d: [3, Di - 3], cols: [R('chamber')] }, { d: [3, Di - 3], cols: [R('chamber')] }]) : [[{ d: [Di, Di], cols: chambers() }]];
  }
  if (tier === 'merchant') {
    const hallUp = Di < 7;   // a shallow house puts the hall over the shop (the later London way)
    if (f === 0) {
      const fr0 = ctx.shop ? 'shop' : 'hall';
      // a shallow house: the front room and, beside it, the hall (behind a shop) or a service room; a passage beside the door when there is one
      const oth = ctx.shop ? 'hall' : 'service';
      const RF = (t, w) => ctx.shop ? { t, w, door: 2 } : R(t, w);   // a walk-in shop: the street door opens into the shop itself
      if (hallUp) return Wi >= 7 && !ctx.pass ? [[{ d: [Di, Di], cols: [RF(fr0, [3, Wi - 3]), R(oth, [3, Wi - 3])] }], [{ d: [Di, Di], cols: [R(oth, [3, Wi - 3]), RF(fr0, [3, Wi - 3])] }]]
        : Wi >= 7 ? [[{ d: [Di, Di], cols: withPass(ctx.passSide === 'l' ? [RF(fr0, [3, Wi]), R(oth, [3, Wi])] : [R(oth, [3, Wi]), RF(fr0, [3, Wi])]) }], [{ d: [Di, Di], cols: [RF(fr0, [3, Wi - 3]), R(oth, [3, Wi - 3])] }], [{ d: [Di, Di], cols: [R(oth, [3, Wi - 3]), RF(fr0, [3, Wi - 3])] }], [{ d: [Di, Di], cols: withPass([RF(fr0)]) }]] : [[{ d: [Di, Di], cols: withPass([RF(fr0)]) }]];
      const tail = Di >= 10 ? [{ d: [2, 4], cols: rear(false) }] : [];
      if (ctx.shop) return [[{ d: [3, 4], cols: withPass([R('shop')]) }, { d: [3, 6], cols: [R('hall')] }, ...tail]];
      // no shop: a hall at the street and the parlour behind; or, when the chimney stands at the back, a goods room at the street and the hall behind it
      return [[{ d: [3, 6], cols: withPass([R('hall')]) }, { d: [3, 6], cols: [R('parlour')] }, ...tail], [{ d: [3, 4], cols: withPass([R('goods')]) }, { d: [3, 6], cols: [R('hall')] }, ...tail]];
    }
    if (f === 1) {
      const front = hallUp && ctx.shop ? 'hall' : ctx.shop ? 'parlour' : 'chamber';
      if (Di < 7) return [[{ d: [Di, Di], cols: hallUp && ctx.shop ? [R('hall')] : Wi >= 7 ? [R('great', [3, Wi - 2]), R('counting', [2, 3])] : [R('great')] }]];
      // every merchant keeps a counting house: beside the front room, or across a narrow house at the front
      // a one-bay house keeps the room over the street for the great chamber; the counting house goes behind it
      if (Wi < 7) return Di >= 10 ? [[{ d: [3, 5], cols: [R('great')] }, { d: [2, 3], cols: [R('counting')] }, { d: [3, 5], cols: [R('chamber')] }], [{ d: [3, 5], cols: [R('great')] }, { d: [3, 5], cols: [R('chamber')] }, { d: [2, 3], cols: [R('counting')] }], [{ d: [2, 3], cols: [R('counting')] }, { d: [3, 5], cols: [R('great')] }, { d: [3, 5], cols: [R('chamber')] }]]
        : [[{ d: [3, 5], cols: [R('great')] }, { d: [2, 3], cols: [R('counting')] }], [{ d: [2, 3], cols: [R('counting')] }, { d: [3, 5], cols: [R('great')] }]];
      return flip([{ d: [3, Di - 3], cols: [R(front, [3, Wi - 2]), R('counting', [2, 3])] }, { d: [3, Di - 3], cols: [R('great')] }]);
    }
    if (top && st >= 3) return [[{ d: [Di, Di], cols: [R('garret')] }]];
    return Di >= 7 ? flip([{ d: [3, Di - 3], cols: [R('chamber')] }, { d: [3, Di - 3], cols: [R('chamber')] }]) : [[{ d: [Di, Di], cols: chambers(hallUp && f === 2 ? 'great' : 'chamber') }]];
  }
  // patrician: entrance passage beside a hall that runs along the street, kitchen, buttery and parlour behind
  if (f === 0) {
    const tail = (need) => Di >= need ? [{ d: [3, Di - 4], cols: rear(true) }] : [];
    if (ctx.shop) return [[{ d: [3, 4], cols: withPass([R('shop')]) }, { d: [4, 6], cols: Di < 10 && Wi >= 7 ? [R('hall', [4, Wi - 3]), R('kitchen', [3, 4])] : [R('hall')] }, ...tail(10)]];
    return [[{ d: [4, 6], cols: withPass([R('hall')]) }, ...tail(7)], ...(Di >= 10 ? [[{ d: [3, 4], cols: withPass([R('goods')]) }, { d: [3, 5], cols: [R('hall')] }, ...tail(10)]] : [])];
  }
  if (f === 1) return Di >= 7 ? flip([{ d: [4, Di - 3], cols: Wi >= 7 ? [R('great', [4, Wi - 2]), R('counting', [2, 3])] : [R('great')] }, { d: [3, Di - 4], cols: chambers() }]) : [[{ d: [Di, Di], cols: Wi >= 7 ? [R('great', [3, Wi - 2]), R('counting', [2, 3])] : [R('great')] }]];
  if (top && st >= 3) return [[{ d: [Di, Di], cols: [R('garret')] }]];
  return Di >= 7 ? flip([{ d: [3, Di - 3], cols: chambers() }, { d: [3, Di - 3], cols: [R('chamber')] }]) : [[{ d: [Di, Di], cols: chambers() }]];
}

// every way to cut n into parts within [min,max] ranges (sum exactly n)
function splits(n, ranges) {
  const out = [], cur = [];
  const go = (i, left) => { if (i === ranges.length - 1) { const [a, b] = ranges[i]; if (left >= a && left <= b) out.push([...cur, left]); return; }
    const [a, b] = ranges[i]; for (let v = a; v <= Math.min(b, left); v++) { cur.push(v); go(i + 1, left - v); cur.pop(); } };
  go(0, n); return out;
}

// ---------- edges ----------
// vertical edge 'v,x,y' sits between cells (x-1,y) and (x,y); horizontal 'h,x,y' between (x,y-1) and (x,y)
const ek = (o, x, y) => o + ',' + x + ',' + y;
export function edgeBetween(a, b) { const [ax, ay] = a, [bx, by] = b; return ax !== bx ? ek('v', Math.max(ax, bx), ay) : ek('h', ax, Math.max(ay, by)); }

// ---------- main ----------
// cellar steps from the street: decided before (and independent of) the full plan, so the town can draw the flap in the pavement
// without planning every house. Returns null or { sx: interior column of the steps, a: position along the front (outside units), ext }
export function cellarSteps(H, opt = {}) {
  const tier = opt.tier || tierOf(H); if (!tier) return null;
  const W = H.W, D = H.D, Wi = 3 * W + 1, Di = 3 * D + 1, seed = (opt.seed || 1) * 131 + H.id * 7919 + 17;
  const X = (a) => Math.max(0, Math.min(Wi - 1, Math.floor(a * Wi / W))), doorX = X(H.doorA ?? W / 2), craft = H.dist === 'craft';
  const shopX = H.shop && H.shopA ? [X(H.shopA[0]), Math.min(Wi - 1, Math.ceil(H.shopA[1] * Wi / W) - 1)] : null;
  const rc = rngOf(seed + 5), chance = H.inn ? 1 : { poor: 0, artisan: H.shop || craft ? .4 : .2, merchant: .7, patrician: .85 }[tier];
  if (H.baseFloor > 0 || !(rc() < chance) || Di < 4) return { cellar: false, rc };
  const street = (tier === 'merchant' || tier === 'patrician') && rc() < .6;
  const ext = tier === 'patrician' ? Di : tier === 'merchant' ? Math.min(Di, Math.max(4, Math.round(Di * .6))) : Math.min(Di, 4);
  if (!street) return { cellar: true, street: false, ext, rc };
  const mid = shopX ? (shopX[0] + shopX[1]) / 2 : Wi / 2, sx = [...Array(Wi).keys()].filter((x) => x !== doorX).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))[0];
  return { cellar: true, street: true, ext, sx, a: (sx + .5) * W / Wi, rc };
}

export function planInterior(H, opt = {}) {
  const tier = opt.tier || tierOf(H); if (!tier) return null;
  const W = H.W, D = H.D, Wi = 3 * W + 1, Di = 3 * D + 1, st0 = Math.max(1, H.st), seed = (opt.seed || 1) * 131 + H.id * 7919 + 17;
  // a one-storey cottage sleeps its overflow in a loft under the roof, reached by a ladder
  const P = household(H, tier, opt.hh, rngOf(seed + 1));
  // an inn's staff: tapster, cook, chamberlain and a maid at least (the ostler sleeps over the stable)
  if (H.inn) { const P2 = P.filter((q) => q.role !== 'kin'); P.length = 0; P.push(...P2); while (P.filter((q) => q.role === 'servant').length < 4) P.push({ role: 'servant' }); }
  // a one-storey house sleeps its overflow in a loft under the roof (small cottages, or any one-storey house too full for its floor)
  const loft = st0 === 1 && P.length >= 3 && (opt.forceLoft || Wi * Di <= 28 || P.length * 9 >= Wi * Di), st = loft ? 2 : st0;
  const r = rngOf(seed), X = (a) => Math.max(0, Math.min(Wi - 1, Math.floor(a * Wi / W))), Y = (d) => Math.max(0, Math.min(Di - 1, Math.floor(d * Di / D)));
  const out = H.out || { l: true, r: true, b: true };
  const doorX = X(H.doorA ?? W / 2), craft = H.dist === 'craft';
  const shopX = H.shop && H.shopA ? [X(H.shopA[0]), Math.min(Wi - 1, Math.ceil(H.shopA[1] * Wi / W) - 1)] : null;
  // passage beside the street door when the door sits near a side (merchant and patrician)
  let pass = false, passSide = 'l', passW = 1;
  if ((tier === 'merchant' || tier === 'patrician') && Wi >= 7) {
    const dl = doorX, dr = Wi - 1 - doorX; if (Math.min(dl, dr) <= 1) { pass = true; passSide = dl <= dr ? 'l' : 'r'; passW = Math.min(dl, dr) + 1; }
    if (shopX && doorX >= shopX[0] && doorX <= shopX[1]) pass = false;   // the door is the shop's own door
  }
  // the trade: artisans with a shop or in the craft quarter work one; merchants with a shop sell one line of goods
  const rt = rngOf(seed + 3), trade = H.inn ? 'inn' : H.ale ? 'alehouse' : opt.trade || (tier === 'artisan' && (H.shop || craft) ? ART_TRADES[Math.floor(rt() * ART_TRADES.length)] : (tier === 'merchant' || tier === 'patrician') && H.shop ? MER_TRADES[Math.floor(rt() * MER_TRADES.length)] : null);
  const workT = tier === 'artisan' ? (trade ? TRADE[trade].room || null : null) : H.shop ? 'shop' : null;
  const ctx = { Wi, Di, st, shop: !!H.shop, craft, pass, passSide, passW, loft, front: workT, inn: !!H.inn, ale: !!H.ale, ware: H.dist === 'ware' && !H.shop && !H.inn && !H.ale && tierOf(H) === 'merchant' };
  // chimney: the stack stands on a side wall (or, on a gable house, toward the back), the hearth below it
  let chim = null;
  if (H.chim) { const [ca, cd] = H.chim, side = ca < W / 2 ? 0 : Wi - 1, cy = Math.max(1, Math.min(Di - 2, Y(cd))); chim = { x: side, y: cy, cells: [[side, cy], [side, cy + 1 < Di ? cy + 1 : cy - 1]], alt: [[side, cy - 1], [side, cy]] }; chim.all = [...chim.cells, chim.alt[0]]; }
  if (pass && chim && (passSide === 'l') === (chim.x === 0) && (Di < 7 || chim.cells[0][1] <= 4)) { pass = false; ctx.pass = false; }   // the stack would stand in the passage
  // windows per floor: the town's pattern scaled to bays; back and side windows only where open air lies behind
  const winsOf = (f) => {
    if (loft && f === 1) return [];
    const w = [], add = (side, i, kind = 'win') => { if (!w.some((q) => q.side === side && q.i === i)) w.push({ side, i, kind }); };
    if (f === 0) {
      if (shopX) for (let x = shopX[0]; x <= shopX[1]; x++) if (x !== doorX) add('f', x, 'shopfront');
      if (!H.shop && !H.inn) { const da = H.doorA ?? W / 2; const wa = da < W / 2 ? da + 1 : da - 1; if (W >= 2 && wa > .3 && wa < W - .3) add('f', X(wa)); if (W >= 3) add('f', X(da < W / 2 ? W - .5 : .5)); if (W < 2) add('f', X(.87)); }
    } else { const n = Math.max(1, Math.round(W / .95)); for (let k = 0; k < n; k++) add('f', X((k + .5) * W / n)); }
    if (f === 0) return w.filter((q) => !(q.side === 'f' && q.i === doorX));   // the town draws back and side windows on upper storeys only
    if (out.b) { const n = Math.max(1, Math.max(1, Math.round(W / .95)) - 1); for (let k = 0; k < n; k++) add('b', X((k + .5) * W / n)); }
    for (const sd of ['l', 'r']) if (out[sd] && D >= 2) for (const dp of D >= 3 ? [D * .3, D * .72] : [D / 2]) add(sd, Y(dp));
    return w.filter((q) => !(chim && (q.side === 'l' || q.side === 'r') && (q.side === 'l' ? 0 : Wi - 1) === chim.x && chim.all.some((c) => c[1] === q.i)) && !(f === 0 && q.side === 'f' && q.i === doorX));
  };
  // a poor house holding a second family is split by floor: the lodgers have the upper chamber, with their own fire, board and bed
  const lodgers = tier === 'poor' && st >= 2 && !loft && P.filter((p) => p.role === 'kin').length >= 2;

  // ---------- stair core candidates (same cells on every floor) ----------
  const stairKind = st === 1 ? null : tier === 'poor' || loft ? 'ladder' : tier === 'artisan' || Wi < 7 || Di < 7 ? 'winder' : 'flight';   // narrow or shallow houses wind up in a corner
  const cores = [];
  if (stairKind) {
    if (stairKind !== 'flight') { for (let y = 1; y < Di; y++) for (const x of [0, Wi - 1]) cores.push({ cells: [[x, y]], kind: stairKind });
      for (let x = 1; x < Wi - 1; x++) cores.push({ cells: [[x, Di - 1]], kind: stairKind }); }
    else { const two = st >= 3;
      // 3+ storeys: either a switchback in two columns, or one column of stacked flights, each flight hung directly over the one below
      // (same direction on every floor; the floor above keeps its boards over the foot of the flight below and opens over the rest)
      for (const stacked of two ? [true, false] : [false]) {
      for (const x of [0, Wi - 1]) for (let y = 1; y + 2 < Di; y++) { const xs = two && !stacked ? [x, x === 0 ? 1 : Wi - 2] : [x];
        cores.push({ kind: 'flight', stacked, axis: 'y', cols: xs, y0: y, cells: xs.flatMap((cx) => [[cx, y], [cx, y + 1], [cx, y + 2]]) }); }
      for (const y of [Di - 1]) for (let x = 0; x + 2 < Wi; x++) { const ys = two && !stacked ? [y, y - 1] : [y];
        cores.push({ kind: 'flight', stacked, axis: 'x', cols: ys, x0: x, cells: ys.flatMap((cy) => [[x, cy], [x + 1, cy], [x + 2, cy]]) }); } }
      // a single flight (two floors) may climb either way: the other way round is a second candidate
      if (!two) for (const c of cores.slice()) if (c.kind === 'flight' && !c.stacked) cores.push({ ...c, rev: true }); }
  }
  // rank cores: off the front row, away from the door, not in the chimney, near the hearth for small houses
  const coreOk = (c) => c.cells.every(([x, y]) => y >= 1 && !(chim && chim.all.some((q) => q[0] === x && q[1] === y)) && !(Math.abs(x - doorX) <= 1 && y <= 1));
  const coreScore = (c) => { let s = 0; const [cx, cy] = c.cells[0]; if (chim && stairKind !== 'flight') s += Math.abs(cx - chim.x) + Math.abs(cy - chim.cells[0][1]) * .8; if (pass && stairKind === 'flight') s += Math.abs(cx - (passSide === 'l' ? 0 : Wi - 1)) * 1.5;
    s += Math.abs(cy - Math.min(Di - 1, 4)) * .3; if (c.kind === 'flight' && c.axis === 'y' && !c.stacked && c.cols.length < 2 && !c.rev) s += .8;   /* climbing toward the camera shows risers, not treads */ s += r() * .4; return s; };
  const coreList = stairKind ? cores.filter(coreOk).map((c) => [coreScore(c), c]).sort((a, b) => a[0] - b[0]).map((q) => q[1]).slice(0, st >= 3 && stairKind === 'flight' ? 28 : 14) : [null];

  // ---------- per floor: stair parts (flight, well, entry/exit cells) ----------
  const stairParts = (core, f) => {
    if (!core) return { block: [], well: [], need: [] };
    if (core.kind !== 'flight') {   // ladder / winder: the same cell carries on up; the top floor has the railed well
      const [c] = core.cells, nb = [[c[0] + 1, c[1]], [c[0] - 1, c[1]], [c[0], c[1] - 1], [c[0], c[1] + 1]].filter(([x, y]) => x >= 0 && y >= 0 && x < Wi && y < Di);
      return { block: f < st - 1 ? [c] : [], well: f > 0 && f === st - 1 ? [c] : [], wellUp: f > 0, nbs: nb, need: [], one: true };
    }
    // switchback: even floors climb in column A, odd floors in column B; the floor above shows the flight below as a railed well
    if (core.stacked) {   // one column: every floor climbs the same way, each flight hung over the one below
      // along a side wall the flight climbs from the front up toward the back, so the camera looks onto its treads, not up at its risers
      const c = core.cells, foot = core.axis === 'y' ? [c[0][0], core.y0 - 1] : [core.x0 + 3, c[0][1]], head = core.axis === 'y' ? [c[0][0], core.y0 + 3] : [core.x0 - 1, c[0][1]];
      const lowCell = core.axis === 'y' ? [c[0][0], core.y0] : [core.x0 + 2, c[0][1]], upper = c.filter((q) => !(q[0] === lowCell[0] && q[1] === lowCell[1]));
      const climb = f < st - 1, need = []; if (climb) need.push(foot); if (f > 0) need.push(head);
      return { block: climb ? c : [], well: f > 0 ? upper : [], need, stacked: true, climb: climb ? { cells: c, low: foot, high: head } : null, wellCells: f > 0 ? upper : [] }; }
    const A = 0, B = core.cols.length > 1 ? 1 : 0, colOf = (k) => core.axis === 'y' ? core.cells.filter((c) => c[0] === core.cols[k]) : core.cells.filter((c) => c[1] === core.cols[k]);
    const climbCol = f < st - 1 ? (f % 2 === 0 ? A : B) : -1, wellCol = f > 0 ? ((f - 1) % 2 === 0 ? A : B) : -1;
    // ends: along y the A flight climbs from the back end (low) to the front end (high); B the other way
    const lowEnd = (k) => { const c = colOf(k); const up = (k === A) !== !!core.rev; return core.axis === 'y' ? (up ? [c[0][0], core.y0 + 3] : [c[0][0], core.y0 - 1]) : (up ? [core.x0 + 3, c[0][1]] : [core.x0 - 1, c[0][1]]); };
    const highEnd = (k) => { const c = colOf(k); const up = (k === A) !== !!core.rev; return core.axis === 'y' ? (up ? [c[0][0], core.y0 - 1] : [c[0][0], core.y0 + 3]) : (up ? [core.x0 - 1, c[0][1]] : [core.x0 + 3, c[0][1]]); };
    const need = []; if (climbCol >= 0) need.push(lowEnd(climbCol)); if (wellCol >= 0) need.push(highEnd(wellCol));
    const block = climbCol >= 0 ? colOf(climbCol) : [], well = wellCol >= 0 && wellCol !== climbCol ? colOf(wellCol) : wellCol >= 0 ? [] : [];
    // one-column cores on 3+ floors cannot work; caller filters by need cells being inside
    return { block, well, need, climb: climbCol >= 0 ? { cells: colOf(climbCol), low: lowEnd(climbCol), high: highEnd(climbCol) } : null, wellCells: wellCol >= 0 ? colOf(wellCol) : [] };
  };

  // ---------- build one floor from a band/col choice ----------
  const buildRooms = (prog, ds, ws) => { const rooms = []; let y = 0;
    prog.forEach((b, bi) => { let x = 0; b.cols.forEach((c, ci) => { rooms.push({ id: rooms.length, t: c.t, x0: x, y0: y, x1: x + ws[bi][ci] - 1, y1: y + ds[bi] - 1, door: c.door === 2 ? 2 : !!c.door }); x += ws[bi][ci]; }); y += ds[bi]; });
    // a counting house in a deep band keeps 4 rows at the lit end; the rest is a closet
    for (const q of rooms.slice()) if (q.t === 'counting' && q.y1 - q.y0 + 1 >= 6) { const back = q.y1 === Di - 1 && q.y0 > 0;
      const cl = { id: rooms.length, t: 'closet', x0: q.x0, x1: q.x1, y0: back ? q.y0 : q.y0 + 4, y1: back ? q.y1 - 4 : q.y1 };
      if (back) q.y0 = q.y1 - 3; else q.y1 = q.y0 + 3; rooms.push(cl); }
    return rooms; };

  // the yard behind (from the town grid): its depth is known before planning, so the ground floor keeps a back door free
  const yardDepth = (() => { if (!opt.grid || H.x === undefined || H.baseFloor > 0) return 0; const G = opt.grid, at = (x, y) => (y >= 0 && y < G.length && x >= 0 && x < G[0].length) ? G[y][x] : '?';
    const cols = H.f === 'S' || H.f === 'N' ? [...Array(H.w).keys()].map((i) => H.x + i) : [...Array(H.d).keys()].map((i) => H.y + i), step = { S: [0, -1], N: [0, 1], E: [-1, 0], W: [1, 0] }[H.f];
    const depths = cols.map((c) => { let x = H.f === 'S' || H.f === 'N' ? c : H.f === 'E' ? H.x - 1 : H.x + H.w, y = H.f === 'S' ? H.y - 1 : H.f === 'N' ? H.y + H.d : c, run = 0;
      while (run < 8 && at(x, y) === 'y') { run++; x += step[0]; y += step[1]; } return at(x, y) === 'l' ? Math.floor(run / 2) : run; });
    return Math.min(4, Math.min(...depths)); })();
  const bayY = new Set([...Array(D).keys()].slice(1).map((k) => Math.floor(k * Di / D))), bayX = new Set([...Array(W).keys()].slice(1).map((k) => Math.floor(k * Wi / W)));
  const floors = [], fails = [];
  let best = null, chimFix = null, flue2 = null;   // the hearth cells chosen on the ground floor (every floor above uses the same), and a kitchen's own flue
  for (const core of coreList) {
    if (core && core.kind === 'flight' && st >= 3 && core.cols.length < 2 && !core.stacked) continue;
    // the ground floor fixes the chimney cells for every floor above, so a few ground floors with different hearth cells are tried
    for (const g of planFloor(0, core, true) || []) {
    const plan = { core, floors: [g], score: g.score }; let ok = true; chimFix = g.chimPair || null; flue2 = g.flue2 || null;
    for (let f = 1; f < st && ok; f++) {
      const res = planFloor(f, core); if (!res) { ok = false; break; } plan.floors.push(res); plan.score += res.score;
    }
    plan.chimFix = chimFix; plan.flue2 = flue2;
    if (ok && (!best || plan.score < best.score)) best = plan;
    if (ok) break; }
    if (best && best.score < 2) break;
  }
  if (!best) return { H, tier, Wi, Di, st, P, floors: [], checks: { ok: false, fails: ['no valid plan'] } };

  function planFloor(f, core, many) {
    const sp = stairParts(core, f), progs = [];
    // each programme also runs mirrored where a band holds a counting house or kitchen beside another room (either side of the house)
    // better houses: each upper-floor programme with a great chamber also runs with a small lobby band beside it, for the stair to land in
    const progs0 = programme(tier, f, ctx); if (f > 0 && Di >= 7 && !ctx.inn && (tier === 'merchant' || tier === 'patrician')) for (const prog of progs0.slice()) { const gi = prog.findIndex((b) => b.cols.some((c) => c.t === 'great')); if (gi < 0) continue;
      const g = prog[gi], gd = [Math.max(3, g.d[0] - 2), Math.max(3, Math.min(Di, g.d[1]) - 1)], lob = { d: [1, 2], cols: [{ t: 'lobby' }] };
      if (Wi >= 4) { const cols = g.cols.map((c) => c.t === 'great' ? { ...c, w: [3, Math.min(c.w ? c.w[1] : Wi, Wi - 1)] } : c), lc = { t: 'lobby', w: [1, 1] };   /* or a one-cell-wide lobby beside it */
        progs0.push(prog.slice(0, gi).concat([{ ...g, cols: cols.concat([lc]) }], prog.slice(gi + 1)), prog.slice(0, gi).concat([{ ...g, cols: [lc].concat(cols) }], prog.slice(gi + 1))); }
      if (gd[1] + 1 > Di) continue; progs0.push(prog.slice(0, gi).concat([{ ...g, d: gd }, lob], prog.slice(gi + 1)), prog.slice(0, gi).concat([lob, { ...g, d: gd }], prog.slice(gi + 1))); }
    progs0.forEach((prog, i) => { progs.push([i * 1.5, prog]); const bi = prog.findIndex((b) => b.cols.length === 2 && b.cols.some((c) => c.t === 'counting' || c.t === 'kitchen'));
      if (bi >= 0) progs.push([i * 1.5, prog.map((b, j) => j === bi ? { ...b, cols: b.cols.slice().reverse() } : b)]); });
    const cand = [];
    let dsAll = [];
    for (const [pi, prog] of progs) {
    if (sp.need.some(([x, y]) => x < 0 || y < 0 || x >= Wi || y >= Di)) return null;
    dsAll = splits(Di, prog.map((b, i) => [Math.min(b.d[0], Di), i === prog.length - 1 ? Di : Math.min(b.d[1], Di)]));
    for (const ds of dsAll) {
      const wsPer = prog.map((b) => { const rng = b.cols.map((c) => c.w ? [c.w[0], Math.min(c.w[1], Wi)] : [1, Wi]); return splits(Wi, rng); });
      if (wsPer.some((l) => !l.length)) continue;
      const combos = wsPer.reduce((acc, l) => acc.flatMap((a) => l.map((w) => [...a, w])), [[]]);
      for (const ws of combos.slice(0, 60)) { const rooms = buildRooms(prog, ds, ws); const s = scoreRooms(rooms, f, sp, prog, ds, ws); if (s != null) cand.push([s + pi + r() * .05, rooms]); }
    }
    }
    cand.sort((a, b) => a[0] - b[0]);
    if (opt.debug) opt.debug.push(`f${f} core ${core ? core.cells.map(c=>c.join(':')).join(' ') : '-'}: splits ${dsAll.length} cand ${cand.length}`);
    let got = null;
    for (const [s, rooms0] of cand.slice(0, 12)) { const rooms = rooms0.map((q) => ({ ...q })), fl = finishFloor(f, rooms, sp, core);
      if (!fl) continue;
      // every chamber holds a bed (the great chamber the couple's great bed); a room that cannot take one is a closet
      for (const q of fl.rooms) if (q.t === 'guest') { const a = (q.x1 - q.x0 + 1) * (q.y1 - q.y0 + 1); const b1 = placeOn(fl, q, a >= 15 ? 'kingbed' : 'bed') || placeOn(fl, q, 'bed');
        if (!b1) { fl.pen += 25; continue; } b1.guest = 1; if (a >= 12) { const b2 = placeOn(fl, q, 'bed'); if (b2) b2.guest = 1; } }   // guests shared beds: a framed bed or two, a truckle under the best
      for (const q of fl.rooms) { if (q.t !== 'great' && q.t !== 'chamber') continue;
        const want = q.t === 'great' && tier !== 'poor' ? (tier === 'patrician' ? 'greatbed' : 'kingbed') : 'bed';   // the curtained great bed in a patrician house, an open bedstead with a tall headboard in a merchant or master craftsman's
        const pr = placeOn(fl, q, want) || (want === 'greatbed' && placeOn(fl, q, 'kingbed')) || (q.t === 'great' && placeOn(fl, q, 'bed'));
        if (pr) { pr.spare = 1; if (q.t === 'great' && tier !== 'poor' && pr.type === 'bed') fl.pen += 12; }
        else if (q.t === 'chamber') q.t = fl.doors.filter((d) => d.a === q.id || d.b === q.id).length > 1 ? 'lobby' : 'closet'; else fl.pen += 20; }   // a bedless room passed through is a lobby
      fl.score = s + fl.pen;
      if (many) { const key = JSON.stringify([fl.chimPair, fl.flue2]); if (!got) got = []; if (!got.some((g) => g.key === key)) { fl.key = key; got.push(fl); } if (got.length >= 4) break; continue; }
      if (!got || fl.score < got.score) got = fl; if (fl.pen === 0) break; }
    if (many) return (got || []).sort((a, b) => a.score - b.score);
    return got;
  }

  function chimPair(rooms, avoid) { const x = chim.x, c = chim.y, cands = [];
    for (const off of [0]) { const y0 = c + off - (off < 0 ? 0 : 0); for (const pr of [[[x, y0], [x, y0 + 1]], [[x, y0 - 1], [x, y0]]]) { if (pr.some(([, y]) => y < 0 || y >= Di)) continue; const q = roomAt(rooms, x, pr[0][1]); if (q !== roomAt(rooms, x, pr[1][1])) continue; if (avoid && pr.some(([a, b]) => avoid(a, b))) continue; cands.push([Math.abs(off) + (q.t === 'hall' ? 0 : q.t === 'shop' || q.t === 'buttery' || q.t === 'pantry' || q.t === 'passage' ? 6 : 2), pr]); } }
    cands.sort((a, b) => a[0] - b[0]); return cands.length ? cands[0][1] : null; }
  function roomAt(rooms, x, y) { return rooms.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1); }

  function scoreRooms(rooms, f, sp, prog, ds, ws) {
    let s = 0;
    // partitions stand on the bay lines (the frame's posts and tie-beams), or the timbers would show in the middle of rooms
    { let y = 0; for (let i = 0; i < ds.length - 1; i++) { y += ds[i]; if (!bayY.has(y)) s += 1.2; }
      prog.forEach((b, bi) => { let x = 0; for (let ci = 0; ci < b.cols.length - 1; ci++) { x += ws[bi][ci]; if (!bayX.has(x) && b.cols[ci].t !== 'passage' && b.cols[ci + 1].t !== 'passage') s += .6; } }); }
    for (const q of rooms) { const w = q.x1 - q.x0 + 1, h = q.y1 - q.y0 + 1, R = ROOM[q.t];
      if (q.t !== 'passage' && (Math.min(w, h) < R.min[0] || Math.max(w, h) < R.min[1])) return null;
      if (q.door && !(doorX >= q.x0 && doorX <= q.x1 && q.y0 === 0)) { if (q.door !== 2) return null; s += 8; }   // 2: wanted there, not required
      if (q.t !== 'passage' && Math.max(w, h) / Math.min(w, h) > 3) s += 3;
      if (q.t === 'shop' && shopX && f === 0 && !(q.x0 <= shopX[0] && q.x1 >= shopX[1])) s += 4;
      // the bands keep their preferred sizes (a shop of about 3x3, a hall of 4-5 deep)
      if (q.t === 'shop' || q.t === 'workshop') s += Math.abs(h - 3) * .6;
      if (q.t === 'hall') s -= Math.min(h, 5) * .3;
      if (q.t !== 'passage' && q.t !== 'garret') s += Math.max(0, h - 6) * .8 + Math.max(0, w * h - 42) * .1;   // oversized rooms: better split
      if (q.t === 'great' || q.t === 'parlour') s -= Math.min(w * h, 20) * .05;
      // a counting house is a small strong-room: 2-3 wide, 3-4 deep
      if (q.t === 'counting') s += Math.max(0, Math.max(w, h) - 4) * 4 + Math.max(0, Math.min(w, h) - 3) * 4;
    }
    // the street door opens into the shop, workshop, a passage, the hall or a goods room; never into the parlour
    if (f === 0) { const q = roomAt(rooms, doorX, 0); if (!q || !['hall', 'shop', 'workshop', 'passage', 'goods'].includes(q.t)) return null; }
    // the street door opens into the front room's own cell
    if (f === 0 && !roomAt(rooms, doorX, 0)) return null;
    // the hearth under the chimney belongs to the hall on the ground floor (or the room that has one)
    if (chim && f === 0) { const pr = chimPair(rooms); if (!pr) return null; const q = roomAt(rooms, pr[0][0], pr[0][1]); if (rooms.some((z) => z.t === 'hall') && q.t !== 'hall') s += 8; if (q.t === 'passage') return null; if (q.t === 'shop') s += 6; }
    // upstairs the chimney rises in the same cells; its fire warms the great chamber where there is one, never a counting house or passage
    if (chim && f > 0 && chimFix) { const q = roomAt(rooms, chimFix[0][0], chimFix[0][1]); if (!q || q !== roomAt(rooms, chimFix[1][0], chimFix[1][1]) || q.t === 'passage') return null;
      if (rooms.some((z) => z.t === 'great') && q.t !== 'great') s += 8; if (q.t === 'counting') s += 6; }
    // the stair sits inside one room, never in the shop or a passage too narrow to pass it
    if (sp) for (const [x, y] of [...sp.block, ...sp.well]) { const q = roomAt(rooms, x, y); if (!q || q.t === 'shop' || (q.t === 'passage' && q.x1 - q.x0 < 1)) return null; }
    if (sp && sp.block.length + sp.well.length) { const qs = new Set([...sp.block, ...sp.well].map(([x, y]) => roomAt(rooms, x, y))); if (qs.size > 1) return null;
      // the foot of a flight and its landing lie in the same room as the flight (nobody climbs into a partition); never in the counting house
      const sq = [...qs][0]; if (sq.t === 'counting' || sq.t === 'office') return null; if (ctx.inn && f > 0 && sq.t !== 'lobby') return null;
      if (ctx.inn && f > 0) { const st0 = new Set([...sp.block, ...sp.well].map(([x, y]) => x + ',' + y)), fr = []; for (let y = sq.y0; y <= sq.y1; y++) for (let x = sq.x0; x <= sq.x1; x++) if (!st0.has(x + ',' + y)) fr.push(x + ',' + y);   /* the landing stays one walkable piece round the stair */
        const seen = new Set(fr.slice(0, 1)), Q = fr.slice(0, 1); while (Q.length) { const [x, y] = Q.pop().split(',').map(Number); for (const k of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].map((a) => a.join(','))) if (fr.includes(k) && !seen.has(k)) { seen.add(k); Q.push(k); } } if (seen.size < fr.length) return null; } if (f > 0 && Di >= 7 && sq.t === 'great' && (tier === 'merchant' || tier === 'patrician')) s += 25; if (sq.t === 'lobby') { const cs = [...sp.block, ...sp.well]; if (sq.y0 === sq.y1 && cs.some(([x]) => x !== sq.x0 && x !== sq.x1)) return null; if (sq.x0 === sq.x1 && cs.some(([, y]) => y !== sq.y0 && y !== sq.y1)) return null; }   /* a one-deep lobby: the stair at its end, not across it */   /* better houses: the stair lands in a lobby or outer chamber, not the master's */ if (sq.t === 'parlour' && rooms.some((z) => z.t === 'hall' || z.t === 'passage')) s += 3; /* upstairs traffic through the best room */ for (const [x, y] of sp.need) if (roomAt(rooms, x, y) !== sq) return null; }
    // rooms that need daylight have a window
    const W = winsOf(f);
    for (const q of rooms) if (ROOM[q.t].light && !W.some((w) => winRoom(w, rooms) === q)) s += q.t === 'counting' ? 2 : 5;
    return s;
  }

  function winRoom(w, rooms) { const c = w.side === 'f' ? [w.i, 0] : w.side === 'b' ? [w.i, Di - 1] : w.side === 'l' ? [0, w.i] : [Wi - 1, w.i]; return roomAt(rooms, c[0], c[1]); }

  // ---------- doors, furniture, checks for one floor ----------
  function finishFloor(f, rooms, sp, core) {
    sp = { ...sp, need: [...sp.need] };
    const cell = new Int16Array(Wi * Di).fill(-1), I = (x, y) => y * Wi + x, inG = (x, y) => x >= 0 && y >= 0 && x < Wi && y < Di;
    for (const q of rooms) for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) cell[I(x, y)] = q.id;
    const occ = new Uint8Array(Wi * Di), keep = new Uint8Array(Wi * Di);   // occ: 1 blocking prop / stair, keep: must stay walkable
    const props = [], doors = [], windows = winsOf(f);
    let pen = 0;
    // stair
    for (const [x, y] of sp.block) occ[I(x, y)] = 2; for (const [x, y] of sp.well) occ[I(x, y)] = 3;
    for (const [x, y] of sp.need) keep[I(x, y)] = 1;
    if (sp.one) { const c = (sp.block[0] || sp.well[0]); if (c) { const nb = sp.nbs.filter(([x, y]) => cell[I(x, y)] === cell[I(c[0], c[1])] && !occ[I(x, y)]); if (!nb.length) return null; nb.sort((a, b) => (a[1] - b[1]) || 0); keep[I(nb[0][0], nb[0][1])] = 1; sp.need = [...sp.need, nb[0]]; } }
    // street door
    if (f === 0) { doors.push({ e: ek('h', doorX, 0), x: doorX, y: 0, street: 1, a: -1, b: cell[I(doorX, 0)] }); keep[I(doorX, 0)] = 1; if (Di > 1) keep[I(doorX, 1)] = 1; }
    // the back door onto the yard: from the kitchen or a service room, the parlour only if nothing else reaches the back wall
    let backX = -1;
    if (f === 0 && yardDepth >= 1) { const pr = (t) => ['kitchen', 'service', 'buttery', 'pantry', 'passage', 'hall', 'workshop', 'goods', 'shop', 'parlour'].indexOf(t) + 1 || 9;
      const xs = [...Array(Wi).keys()].filter((x) => !occ[I(x, Di - 1)] && !(chim && chim.all.some(([a, b]) => a === x && b === Di - 1))).sort((a, b) => pr(rooms[cell[I(a, Di - 1)]].t) - pr(rooms[cell[I(b, Di - 1)]].t) || Math.abs(a - Wi / 2) - Math.abs(b - Wi / 2));
      if (xs.length) { backX = xs[0]; keep[I(backX, Di - 1)] = 1; } }
    // inner doors: required pairs first, then a tree over the rest from the entry room
    const entry = f === 0 ? cell[I(doorX, 0)] : (() => { const c = sp.need.find((q) => q) || (sp.one ? sp.nbs.find(([x, y]) => occ[I(x, y)] === 0) : null) || (core ? core.cells[0] : [0, 0]); return cell[I(c[0], c[1])]; })();
    if (entry < 0) return null;
    const shared = (a, b) => { const es = []; for (let y = 0; y < Di; y++) for (let x = 0; x < Wi; x++) { if (cell[I(x, y)] !== a) continue; for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const nx = x + dx, ny = y + dy; if (inG(nx, ny) && cell[I(nx, ny)] === b) es.push([[x, y], [nx, ny]]); } } return es; };
    const want = { shop: ['passage', 'hall'], workshop: ['passage', 'hall'], goods: ['passage', 'hall'], hall: ['passage', 'shop', 'workshop', 'goods', 'kitchen', 'buttery', 'service', 'pantry', 'parlour'], passage: ['hall', 'shop', 'goods', 'kitchen', 'buttery'],
      kitchen: ['buttery', 'pantry', 'hall', 'passage'], parlour: ['hall'], closet: ['great', 'chamber', 'parlour', 'hall'], great: ['counting', 'parlour', 'hall'], counting: ['great', 'parlour', 'hall'], lobby: ['guest', 'great', 'garret', 'lobby'] };
    const linked = new Set([entry]), links = [];
    const link = (a, b) => { const es = shared(a, b).filter(([p, q]) => occ[I(p[0], p[1])] < 2 && occ[I(q[0], q[1])] < 2 && !(chim && [p, q].some((c) => chim.all.some((h) => h[0] === c[0] && h[1] === c[1]))));
      if (!es.length) return false;
      // away from the corners of the shared run, nearest its middle, a little jitter
      const mid = es.length / 2 - .5; es.sort((u, v) => Math.abs(es.indexOf(u) - mid) - Math.abs(es.indexOf(v) - mid)); const pick = es[Math.min(es.length - 1, Math.floor(r() * Math.min(2, es.length)))];
      const [p, q] = pick; doors.push({ e: edgeBetween(p, q), p, q, a, b }); keep[I(p[0], p[1])] = 1; keep[I(q[0], q[1])] = 1; linked.add(a); linked.add(b); links.push([a, b]); return true; };
    // breadth-first from the entry, preferring the wanted neighbours
    let grew = true; while (grew) { grew = false; const cands = [];
      for (const a of linked) for (const q of rooms) { if (linked.has(q.id) || rooms[a].t === 'counting' || rooms[a].t === 'closet' || rooms[a].t === 'guest' || rooms[a].t === 'office') continue; /* a counting house is a dead end: one door */ if (!shared(a, q.id).length) continue; const ta = rooms[a].t; const pr = (want[ta] || []).indexOf(q.t); cands.push([pr < 0 ? 9 : pr, a, q.id]); }
      cands.sort((u, v) => u[0] - v[0]); for (const [, a, b] of cands) if (!linked.has(b) && link(a, b)) { grew = true; break; } }
    if (linked.size < rooms.length) return null;
    // a passage also opens into the shop beside it (customers come in off the passage)
    for (const q of rooms) if (q.t === 'passage') for (const z of rooms) if ((z.t === 'shop') && !links.some(([a, b]) => (a === q.id && b === z.id) || (a === z.id && b === q.id))) link(q.id, z.id);
    // windows: the cell inside each stays clear of tall things (handled by placement)
    const winEdge = new Set(windows.map((w) => w.side === 'f' ? ek('h', w.i, 0) : w.side === 'b' ? ek('h', w.i, Di) : w.side === 'l' ? ek('v', 0, w.i) : ek('v', Wi, w.i)));
    const doorEdge = new Set(doors.map((d) => d.e));
    // ---------- furniture ----------
    const conn = (q) => { // free cells of room q form one piece and every kept cell is in it
      const free = []; for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (!occ[I(x, y)] || occ[I(x, y)] === 3 && false) free.push(I(x, y));
      if (!free.length) return false; const seen = new Set([free[0]]), st2 = [free[0]];
      while (st2.length) { const c = st2.pop(), x = c % Wi, y = (c / Wi) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inG(nx, ny) || cell[I(nx, ny)] !== q.id || occ[I(nx, ny)]) continue; const k = I(nx, ny); if (!seen.has(k)) { seen.add(k); st2.push(k); } } }
      if (seen.size !== free.length) return false;
      for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (keep[I(x, y)] && !seen.has(I(x, y))) return false;
      return true; };
    // wall slots: a prop's back sits on a wall of the room (no door in it); returns cells, facing and the cells in front
    const slots = (q, P0) => { const res = [];
      for (const rot of [0, 1, 2, 3]) { // 0: back on the room's y1 side (facing front)... 1: back on x0, 2: back on y0, 3: back on x1
        const along = rot % 2 === 0, w = P0.w, h = P0.h, sw = along ? w : h, sh = along ? h : w;
        for (let y = q.y0; y + sh - 1 <= q.y1; y++) for (let x = q.x0; x + sw - 1 <= q.x1; x++) {
          if (rot === 0 && y + sh - 1 !== q.y1) continue; if (rot === 2 && y !== q.y0) continue; if (rot === 1 && x !== q.x0) continue; if (rot === 3 && x + sw - 1 !== q.x1) continue;
          const cs = []; for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) cs.push([x + i, y + j]);
          // back edges
          const back = cs.filter(([cx, cy]) => rot === 0 ? cy === q.y1 : rot === 2 ? cy === q.y0 : rot === 1 ? cx === q.x0 : cx === q.x1).map(([cx, cy]) => rot === 0 ? ek('h', cx, cy + 1) : rot === 2 ? ek('h', cx, cy) : rot === 1 ? ek('v', cx, cy) : ek('v', cx + 1, cy));
          const front = cs.filter(([cx, cy]) => rot === 0 ? cy === y : rot === 2 ? cy === y + sh - 1 : rot === 1 ? cx === x + sw - 1 : cx === x).map(([cx, cy]) => rot === 0 ? [cx, cy - 1] : rot === 2 ? [cx, cy + 1] : rot === 1 ? [cx + 1, cy] : [cx - 1, cy]);
          res.push({ x, y, w: sw, h: sh, rot, cs, back, front }); } }
      return res; };
    const place = (q, type, prefer, opts = {}) => {
      const P0 = PROP[type]; let bestS = null, bestC = null;
      for (const c of slots(q, P0)) {
        if (c.cs.some(([x, y]) => cell[I(x, y)] !== q.id || occ[I(x, y)] || keep[I(x, y)])) continue;
        if (c.back.some((e) => doorEdge.has(e))) continue;
        if (P0.tall && c.back.some((e) => e.startsWith('h') && +e.split(',')[2] === 0)) continue;   /* nothing tall against the street front: that wall is cut away for the camera, so it would stand free in the view */
        if (c.back.some((e) => (e.startsWith('h') && (+e.split(',')[2] === 0 || +e.split(',')[2] === Di) || e.startsWith('v') && (+e.split(',')[1] === 0 || +e.split(',')[1] === Wi)) && winEdge.has(e)) && (P0.tall || !P0.low && opts.noWin)) continue;
        if (opts.wall && !opts.wall(c)) continue;
        const fr = c.front.filter(([x, y]) => inG(x, y) && cell[I(x, y)] === q.id && occ[I(x, y)] === 0); if (!fr.length) continue;
        // try it
        for (const [x, y] of c.cs) occ[I(x, y)] = 1; const kept = fr.map(([x, y]) => [x, y, keep[I(x, y)]]); for (const [x, y] of fr) keep[I(x, y)] = 1;
        const good = conn(q);
        for (const [x, y] of c.cs) occ[I(x, y)] = 0; for (const [x, y, k] of kept) keep[I(x, y)] = k;
        if (!good) continue;
        const s = (prefer ? prefer(c) : 0) + r() * .3; if (bestS === null || s < bestS) { bestS = s; bestC = c; } }
      if (!bestC) return null;
      for (const [x, y] of bestC.cs) occ[I(x, y)] = 1; for (const [x, y] of bestC.front) if (inG(x, y) && cell[I(x, y)] === q.id && occ[I(x, y)] === 0) keep[I(x, y)] = 1;
      const pr = { type, room: q.id, x: bestC.x, y: bestC.y, w: bestC.w, h: bestC.h, rot: bestC.rot, comp: COMP[type] || [], front: bestC.front }; props.push(pr); return pr; };
    const dist2door = (q, c) => { const ds = doors.filter((d) => d.a === q.id || d.b === q.id).map((d) => d.street ? [d.x, 0] : (cell[I(d.p[0], d.p[1])] === q.id ? d.p : d.q)); if (!ds.length) return 0; return Math.min(...ds.map(([x, y]) => Math.abs(x - (c.x + c.w / 2 - .5)) + Math.abs(y - (c.y + c.h / 2 - .5)))); };
    const onWin = (c) => c.back.some((e) => winEdge.has(e));
    // fixed things first: the hearth under the chimney, the stack on upper floors
    let chimPairUsed = null;
    if (chim) { const pair = f === 0 ? chimPair(rooms, (x, y) => occ[I(x, y)] || keep[I(x, y)]) : chimFix; if (!pair) return null; chimPairUsed = pair;
      const q = rooms[cell[I(pair[0][0], pair[0][1])]], yy = Math.min(pair[0][1], pair[1][1]); if (!q || cell[I(pair[1][0], pair[1][1])] !== q.id) return null;
      const fire = f === 0 ? 'hearth' : (tier === 'merchant' || tier === 'patrician' || lodgers) && q.t !== 'garret' && q.t !== 'loft' && q.t !== 'counting' ? 'fireplace' : 'stack';
      const cs = fire === 'stack' ? [[chim.x, yy]] : [[chim.x, yy], [chim.x, yy + 1]];
      if (cs.some(([x, y]) => occ[I(x, y)] || keep[I(x, y)])) return null;
      for (const [x, y] of cs) occ[I(x, y)] = 1; const fx = chim.x === 0 ? 1 : Wi - 2; const front = cs.map(([, y]) => [fx, y]);
      if (fire !== 'stack') for (const [x, y] of front) keep[I(x, y)] = 1;
      if (!conn(q)) return null;
      props.push({ type: fire, room: q.id, x: chim.x, y: cs[0][1], w: 1, h: cs.length, rot: chim.x === 0 ? 1 : 3, comp: fire === 'hearth' ? COMP.hearth : [], front, fixed: 1, cook: f === 0 ? 1 : 0 });
      if (f === 0 && ['service', 'buttery', 'pantry'].includes(q.t)) q.t = 'kitchen'; }   // a heated back room is the kitchen
    // a kitchen's own flue rises through every floor above it
    if (f > 0 && flue2) { const [x, y] = flue2; if (occ[I(x, y)] || keep[I(x, y)]) return null; occ[I(x, y)] = 1; const q = rooms[cell[I(x, y)]]; if (!conn(q)) return null;
      props.push({ type: 'stack', room: q.id, x, y, w: 1, h: 1, rot: 0, comp: [], fixed: 1 }); }
    // rooms in a fixed order so the important pieces get the best walls
    const order = ['shop', 'workshop', 'kitchen', 'hall', 'goods', 'great', 'parlour', 'chamber', 'counting', 'office', 'guest', 'buttery', 'pantry', 'service', 'garret', 'loft', 'passage'];
    let flueK = null; const T = trade ? TRADE[trade] : null, cookHere = !rooms.some((z) => z.t === 'kitchen');   // (set after the chimney, which may retype a heated back room)
    const later = [];
    const roomsBy = (t) => rooms.filter((q) => q.t === t);
    for (const t of order) for (const q of roomsBy(t)) {
      const far = (c) => -dist2door(q, c), near = (c) => dist2door(q, c), hearthNear = (c) => { const h = props.find((p) => p.fixed && p.room === q.id && p.type !== 'stack'); return h ? Math.abs(c.x - h.x) + Math.abs(c.y - h.y) : 0; };
      const need = (type, pref, o) => { const p = place(q, type, pref, o); if (!p) { pen += 30; fails.push(`f${f} ${ROOM[q.t].name}: no room for ${PROP[type].label}`); } return p; };
      const opt2 = (type) => later.push([q.id, type]);
      // a shop sells over the counter by the shopfront; an artisan's shop is also where he works, his tools in the back half
      if (t === 'shop') { need('counter', (c) => near(c) * .5 + (onWin(c) ? 3 : 0) - (c.rot === 1 || c.rot === 3 ? 1 : 0)); if (T && T.tool) need(T.tool, (c) => far(c) * .5); for (const x of (T && T.extra) || []) opt2(x, far);
        if (T && T.kit) { place(q, 'scales', near); const [k0, ...ks] = T.kit; place(q, k0, far); for (const k2 of ks) opt2(k2); }   /* the line's main fitting now; the rest once everyone has a bed */ opt2('shelf', far); opt2('shelf', far); opt2('chest', far); }
      // a workshop trade works at the open front: no counter
      if (t === 'workshop') { const tool = T && T.tool || 'bench';
        if (tool === 'forge') { const outerW = (c) => c.rot === 1 && c.x === 0 || c.rot === 3 && c.x + c.w === Wi || c.rot === 0 && c.y + c.h === Di; const fg = need('forge', (c) => near(c) * .2, { wall: outerW }); if (fg) { fg.cook = 0; flueK = [fg.x, fg.y]; } }   // the forge has its own flue up the wall
        else need(tool, (c) => (onWin(c) ? -3 : 0) + near(c) * .2);
        for (const x of (T && T.extra) || []) opt2(x, far);
        if (trade === 'smith') need('anvil', (c) => near(c) * .2); if (trade === 'dyer') { need('vat', far); opt2('rack', far); } if (trade === 'cooper') { opt2('barrel', far); opt2('barrel', far); } opt2('shelf', far); opt2('chest', far); }
      // the kitchen: its own cooking hearth (back to back with the hall's stack or on an outer wall, its flue rising above), table, trough, pot shelves
      if (t === 'kitchen') { const pair = chimPairUsed, outerW = (c) => c.rot === 1 && c.x === 0 || c.rot === 3 && c.x + c.w === Wi || c.rot === 0 && c.y + c.h === Di;
        const hk = props.find((p) => p.room === q.id && p.fixed && p.type === 'hearth') ? null : need('hearth', (c) => (outerW(c) ? 0 : 6) + (pair ? Math.min(...pair.map(([px, py]) => Math.abs(px - c.x) + Math.abs(py - c.y))) * .3 : 0), { wall: (c) => outerW(c) || (pair && pair.some(([px, py]) => Math.abs(px - c.x) + Math.abs(py - c.y) <= 2)) });
        if (hk) { hk.comp = COMP.hearth; hk.cook = 1; flueK = [hk.x, hk.y]; for (const [x, y] of hk.front || []) if (inG(x, y) && cell[I(x, y)] === q.id) keep[I(x, y)] = 1; }
        need('table', (c) => (onWin(c) ? -.5 : 0)); opt2('trough', far); opt2('dresser', far); opt2('tub', far); opt2('barrel', far); }
      if (t === 'goods' && ctx.ware && f > 0) { need('hoist', near); need('crate', far); for (const k of ['bale', 'sack', 'barrel', 'bale', 'crate', 'sack', 'barrel', 'bale', 'sack']) opt2(k, far); }   /* a goods loft: the hoist wheel at the loading door, the stock */
      else if (t === 'goods') { need('crate', far); need('scales', near); opt2('desk', near); opt2('coffer', far); if (ctx.ware) { for (const k of ['bale', 'sack', 'barrel', 'bale', 'crate', 'sack', 'barrel', 'bale']) opt2(k, far); } }
      if (t === 'hall') { const small = (q.x1 - q.x0 + 1) * (q.y1 - q.y0 + 1) <= 16;
        // no chimney: an open hearth against the wall under a timber smoke hood
        if (!chim && f === 0) { const hh = need('hoodhearth', (c) => (c.rot === 1 || c.rot === 3 ? 0 : 1.5) + (onWin(c) ? 2 : 0) + (st > 1 && sp.block.concat(sp.well).some(([x, y]) => Math.abs(x - c.x) + Math.abs(y - c.y) <= 1) ? 4 : 0)); if (hh) { hh.fixed = 1; if (!flueK) flueK = [hh.x, hh.y]; } }   // the hood's flue rises through the floors above
        need(tier === 'patrician' && !small ? 'longtable' : 'table', (c) => hearthNear(c) * .2 + (onWin(c) ? -.5 : 0));
        if (tier !== 'poor') { place(q, 'chair', (c) => hearthNear(c) * .5); opt2('settle', hearthNear); }
        if (ctx.ale && !programme(tier, 0, ctx).flat().some((b) => b.cols.some((c) => c.t === 'buttery'))) opt2('stillage', far); if (ctx.inn || ctx.ale) { opt2('table', far); opt2('table', far); opt2('stool', far); opt2('stool', far); opt2('cupboard', far); if (ctx.inn) { opt2('table', far); opt2('stool', far); } }   /* drinkers at board tables on forms and stools, first of all; cups and jacks in the cupboard */
        // where there is no kitchen the hall's hearth cooks: pot shelves, a kneading trough, a water tub
        if (cookHere && f === 0) { opt2('tub', far); if (tier !== 'poor' && !ctx.ale && !ctx.inn) { opt2('dresser', far); opt2('trough', far); } }
        if (tier === 'merchant' || tier === 'patrician') opt2('cupboard', far); else opt2('chest', far);
        if (tier === 'patrician') opt2('sideboard', far);
        if (tier === 'poor' || tier === 'artisan') opt2('wheel', (c) => (onWin(c) ? -1 : 1)); }
      if (t === 'parlour') { need('table', (c) => (onWin(c) ? -1 : 0)); opt2('cupboard', far); opt2('chest', far); }
      if (t === 'counting') { need('desk', (c) => (onWin(c) ? -2 : 0)); need('coffer', far); opt2('shelf', far); }
      if (t === 'buttery' && (ctx.inn || ctx.ale)) { need('stillage', far); if (ctx.inn) place(q, 'hatch', near); opt2('barrel', far); opt2('barrel', far); if (ctx.ale) { opt2('tub', far); opt2('tub', far); } opt2('shelf', far); }   /* ale and wine on the stillage; the inn's tap hatch at the buttery door, where the keeper reckons */
      else if (t === 'buttery') { need('barrel', far); opt2('barrel', far); opt2('shelf', far); }
      if (t === 'office') { need('desk', (c) => (onWin(c) ? -2 : 0)); opt2('chest', far); }
      if (t === 'guest') { opt2('table', far); opt2('stool', far); opt2('chest', far); }

      if (t === 'pantry' || t === 'service') { need('shelf', far); opt2('chest', far); opt2('barrel', far); }
    }
    return { f, rooms, doors, windows, props, sp, pen, occ, keep, cell, later, chimPair: chimPairUsed, flue2: flueK, backX };
  }

  // ---------- beds: the household sleeps where it really did ----------
  // master and mistress in the best chamber (great bed, truckle beneath for small children or a maid); older children in a chamber;
  // apprentices on pallets in the shop or workshop; servants in the garret or the hall; the poor all in the one or two rooms they have
  const fl = best.floors;
  chimFix = best.chimFix; flue2 = best.flue2;
  const rank = { great: 0, chamber: 1, parlour: 2, garret: 3, loft: 3, kitchen: 4, hall: 4 };
  const roomsOf = (types) => fl.flatMap((F) => F.rooms.filter((q) => types.includes(q.t)).map((q) => [F, q])).sort((a, b) => rank[a[1].t] - rank[b[1].t] || a[0].f - b[0].f);
  const kids = P.filter((p) => p.role === 'child').length, apps = P.filter((p) => p.role === 'apprentice').length, serv = P.filter((p) => p.role === 'servant').length, kin = P.filter((p) => p.role === 'kin').length;
  const couple = P.filter((p) => p.role === 'master' || p.role === 'mistress').length;
  // the beds already stand in the chambers (one each); the household is given them best first, then new beds or pallets for the rest
  const free = fl.flatMap((F) => F.props.filter((p) => p.spare).map((p) => [F, p])).sort((a, b) => (rank[a[0].rooms[a[1].room].t] ?? 5) - (rank[b[0].rooms[b[1].room].t] ?? 5) || a[0].f - b[0].f || (/greatbed|kingbed/.test(b[1].type)) - (/greatbed|kingbed/.test(a[1].type)));
  const take = (pred) => { const i = free.findIndex(pred); return i < 0 ? null : free.splice(i, 1)[0]; };
  let slept = 0; const tasks = [];
  const give = (b, who, label) => { b[1].spare = 0; b[1].sleeps = who; b[1].who = label; slept += who; };
  const mb = lodgers ? null : take(([F, p]) => F.rooms[p.room].t === 'great') || take(() => true);
  const best1 = mb ? [mb[0], mb[0].rooms[mb[1].room]] : lodgers ? roomsOf(['hall'])[0] : (roomsOf(['great', 'chamber', 'parlour'].concat(ctx.ale ? ['garret', 'loft', 'hall'] : ['hall']))[0] || fl.flatMap((F) => F.rooms.filter((q) => q.t !== 'passage').map((q) => [F, q]))[0]);
  if (mb) give(mb, couple + Math.min(2, kids), 'master'); else tasks.push({ room: best1, type: tier === 'poor' ? 'bed' : tier === 'patrician' ? 'greatbed' : 'kingbed', who: couple + Math.min(2, kids), label: 'master' });
  // older children and kin two to a bed, in another chamber than the parents' where the house has one
  let k = kids - Math.min(2, kids), others = kin;
  // children in the living floors first (chamber, great chamber, parlour, hall), the garret only as a last resort; lodgers on their own floor
  const sleepRooms = (lodgers ? roomsOf(['chamber']) : roomsOf(['chamber', 'great']).concat(roomsOf(['parlour']), ctx.ale ? roomsOf(['garret', 'loft']) : roomsOf(['hall']), ctx.ale ? roomsOf(['hall']) : roomsOf(['garret', 'loft']))   /* in an alehouse the drinking room is the last place anyone sleeps */).filter((z) => z[1] !== best1[1]);
  while (k > 0 || others > 0) { const n = Math.min(2, k + others), lab = k > 0 ? 'children' : 'kin';
    const b = take(([F, p]) => F.rooms[p.room] !== best1[1]) || take(() => true);
    if (b) give(b, n, lab); else { const room = sleepRooms.length ? sleepRooms[0] : best1; tasks.push({ room, type: 'bed', who: n, label: lab }); if (sleepRooms.length > 1 && tasks.filter((t) => t.room === sleepRooms[0]).length >= 2) sleepRooms.shift(); }
    if (k >= n) k -= n; else { others -= n - k; k = 0; } }
  // apprentices on pallets in the shop or workshop; servants in the garret, the kitchen or the hall
  const work = roomsOf(['shop', 'workshop']).length ? fl.flatMap((F) => F.rooms.filter((q) => q.t === 'shop' || q.t === 'workshop').map((q) => [F, q])) : roomsOf(['hall']);
  // two apprentices (or two servants) sleeping in one room share a bunk bed; a lone one keeps his pallet
  for (let i = 0; i < apps; i += 2) tasks.push({ room: work[0] || best1, type: apps - i >= 2 && !ctx.ale ? 'bunk' : 'pallet', who: Math.min(2, apps - i), label: 'apprentice' });   /* in an alehouse a straw pallet rolled out in the hall at night, never a bunk among the drinkers */
  const sv = roomsOf(['kitchen']).concat(roomsOf(['garret']), roomsOf(['hall']));
  for (let i = 0; i < serv; i += 2) tasks.push({ room: sv[Math.floor(i / 3)] || sv[0] || best1, type: serv - i >= 2 ? 'bunk' : 'pallet', who: Math.min(2, serv - i), label: 'servant' });
  const sleepT = ['great', 'chamber', 'garret', 'loft', 'hall', 'parlour', 'kitchen'];
  for (const tsk of tasks) {
    const [F0, q0] = tsk.room, here = [[F0, q0], ...F0.rooms.filter((z) => z !== q0 && (sleepT.includes(z.t) || ['shop', 'workshop', 'service', 'goods'].includes(z.t))).map((z) => [F0, z])];
    const rest = fl.filter((F) => F !== F0).flatMap((F) => F.rooms.filter((z) => sleepT.includes(z.t) || ['shop', 'workshop', 'service', 'goods'].includes(z.t)).map((z) => [F, z]));
    // only apprentices sleep in the shop or workshop; servants overflow to the kitchen, then the hall
    const okR = ([, z]) => tsk.label === 'apprentice' || !['shop', 'workshop'].includes(z.t);
    const types = tsk.type === 'greatbed' ? ['greatbed', 'kingbed', 'bed'] : tsk.type === 'kingbed' ? ['kingbed', 'bed'] : tsk.type === 'bed' ? ['bed', 'pallet'] : tsk.type === 'bunk' ? ['bunk', 'pallet'] : ['pallet'];
    let pr = null;
    const sr = { kitchen: 0, garret: 1, hall: 2, shop: 9, workshop: 9 }, all = [...here, ...rest].sort((a, b) => tsk.label === 'servant' ? (sr[a[1].t] ?? 3) - (sr[b[1].t] ?? 3) : 0);
    for (const ty of types) { for (const [F, qq] of (tsk.label === 'servant' ? all : [...here, ...rest].filter(okR))) { pr = placeOn(F, qq, ty); if (pr) break; } if (pr) break; }
    if (pr && pr.type === 'pallet' && tsk.type === 'bunk') { tsk.who = 1; tasks.push({ ...tsk, type: 'pallet', who: 1 }); }   // no room for the bunk: two pallets
    else if (pr && pr.type === 'pallet') tsk.who = Math.min(tsk.who, 2);   // two small children share a pallet, no more
    if (pr) { pr.sleeps = tsk.who; pr.who = tsk.label; slept += tsk.who; }
  }
  if (lodgers) for (const [F, q] of roomsOf(['chamber'])) { placeOn(F, q, 'table'); placeOn(F, q, 'chest'); }
  // a spare bed is the guest bed; every bed gets a chest at its foot where there is room
  for (const F of fl) for (const p of F.props.slice()) if (p.type === 'greatbed' || p.type === 'kingbed' || p.type === 'bed') { if (p.spare) { p.who = 'spare'; p.sleeps = 0; } if (p.guest) { p.who = 'guests'; p.sleeps = 0; } placeFoot(F, p); }
  // close-stools: one in a merchant house, two in a patrician one, by the best beds; a basin and ewer in the patrician great chamber; a cradle when small children
  { let cs = { merchant: 1, patrician: 2 }[tier] || 0; for (const [F, q] of roomsOf(['great', 'chamber'])) { if (cs > 0 && placeOn(F, q, 'closestool')) cs--; if (tier === 'patrician' && q.t === 'great') placeOn(F, q, 'washstand'); } }
  for (const F of fl) for (const [id, type] of F.later) placeOn(F, F.rooms[id], type);
  for (const F of fl) for (const q of F.rooms) { const L = DRESS[q.t] && (DRESS[q.t][tier] || DRESS[q.t]._); if (!L || !L.length) continue;
    // poor homes held little; each listed piece is placed at most once (a type listed twice may appear twice)
    const area = (q.x1 - q.x0 + 1) * (q.y1 - q.y0 + 1), want = Math.round(area / ({ poor: 9, artisan: 6 }[tier] || 4.5)); let have = F.props.filter((p) => p.room === q.id && p.type !== 'stack').length;
    const cnt = (t) => F.props.filter((p) => p.room === q.id && p.type === t).length;
    for (let k = 0; k < L.length && have < want; k++) { const t = L[k]; if (cnt(t) >= L.slice(0, k + 1).filter((u) => u === t).length) continue; if (placeOn(F, q, t)) have++; } }
  if (kids >= 3) { const F = fl.find((F2) => F2.props.some((p) => p.who === 'master')); if (F) { const pr = F.props.find((p) => p.who === 'master'); placeOn(F, F.rooms[pr.room], 'cradle'); } }

  function placeOn(F, q, type, okCells) { // a second furnishing pass on a finished floor (same rules as finishFloor's place)
    const DH = F.rowsN || Di, { cell, occ, keep } = F, I = (x, y) => y * Wi + x, inG = (x, y) => x >= 0 && y >= 0 && x < Wi && y < DH, P0 = PROP[type];
    const doorEdge = new Set(F.doors.map((d) => d.e)), winEdge = new Set(F.windows.map((w) => w.side === 'f' ? ek('h', w.i, 0) : w.side === 'b' ? ek('h', w.i, DH) : w.side === 'l' ? ek('v', 0, w.i) : ek('v', Wi, w.i)));
    const conn = () => { const free = []; for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (!occ[I(x, y)]) free.push(I(x, y)); if (!free.length) return false; const seen = new Set([free[0]]), s2 = [free[0]];
      while (s2.length) { const c = s2.pop(), x = c % Wi, y = (c / Wi) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inG(nx, ny) || cell[I(nx, ny)] !== q.id || occ[I(nx, ny)]) continue; const k = I(nx, ny); if (!seen.has(k)) { seen.add(k); s2.push(k); } } }
      if (seen.size !== free.length) return false; for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (keep[I(x, y)] && !seen.has(I(x, y))) return false; return true; };
    const doorCells = F.doors.flatMap((d) => d.street ? [[d.x, 0]] : [d.p, d.q]).filter(([x, y]) => cell[I(x, y)] === q.id);
    let bestS = null, bestC = null;
    for (let rot = 0; rot < 4; rot++) { const along = rot % 2 === 0, sw = along ? P0.w : P0.h, sh = along ? P0.h : P0.w;
      for (let y = q.y0; y + sh - 1 <= q.y1; y++) for (let x = q.x0; x + sw - 1 <= q.x1; x++) {
        // drinkers' tables in an inn or alehouse hall stand free in the room, an aisle all round; everything else backs onto a wall
        const freeT = (type === 'table' || type === 'stool') && q.t === 'hall' && (ctx.inn || ctx.ale) && rot === 0 && x > q.x0 && x + sw - 1 < q.x1 && y > q.y0 && y + sh - 1 < q.y1;
        if (!freeT) { if (rot === 0 && y + sh - 1 !== q.y1) continue; if (rot === 2 && y !== q.y0) continue; if (rot === 1 && x !== q.x0) continue; if (rot === 3 && x + sw - 1 !== q.x1) continue; }
        const cs = []; for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) cs.push([x + i, y + j]);
        if (cs.some(([cx, cy]) => cell[I(cx, cy)] !== q.id || occ[I(cx, cy)] || keep[I(cx, cy)])) continue;
        if (freeT && cs.some(([cx, cy]) => [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]].some(([a, b]) => !cs.some(([u, v]) => u === a && v === b) && occ[I(a, b)]))) continue;   /* not jammed against other furniture */
        if (okCells && !okCells(cs)) continue;
        const back = cs.filter(([cx, cy]) => rot === 0 ? cy === q.y1 : rot === 2 ? cy === q.y0 : rot === 1 ? cx === q.x0 : cx === q.x1).map(([cx, cy]) => rot === 0 ? ek('h', cx, cy + 1) : rot === 2 ? ek('h', cx, cy) : rot === 1 ? ek('v', cx, cy) : ek('v', cx + 1, cy));
        if (back.some((e) => doorEdge.has(e))) continue; if (P0.tall && back.some((e) => winEdge.has(e))) continue; if (P0.tall && back.some((e) => e.startsWith('h') && +e.split(',')[2] === 0)) continue;
        // beds: only the head on the wall (the short side), so a 1x2 bed must stand out from the wall
        const front = cs.filter(([cx, cy]) => rot === 0 ? cy === y : rot === 2 ? cy === y + sh - 1 : rot === 1 ? cx === x + sw - 1 : cx === x).map(([cx, cy]) => rot === 0 ? [cx, cy - 1] : rot === 2 ? [cx, cy + 1] : rot === 1 ? [cx + 1, cy] : [cx - 1, cy]);
        // beds are reached from the side; everything else from the front
        const side = type === 'bed' || type === 'greatbed' || type === 'kingbed' || type === 'bunk' || type === 'pallet' ? cs.flatMap(([cx, cy]) => along ? [[cx - 1, cy], [cx + 1, cy]] : [[cx, cy - 1], [cx, cy + 1]]).filter(([sx, sy]) => !cs.some(([a, b]) => a === sx && b === sy)) : front;
        const fr = side.filter(([sx, sy]) => inG(sx, sy) && cell[I(sx, sy)] === q.id && !occ[I(sx, sy)]); if (!fr.length) continue;
        for (const [cx, cy] of cs) occ[I(cx, cy)] = 1; const kept = fr.map(([a, b]) => [a, b, keep[I(a, b)]]); keep[I(fr[0][0], fr[0][1])] = 1;
        const good = conn(); for (const [cx, cy] of cs) occ[I(cx, cy)] = 0; for (const [a, b, k] of kept) keep[I(a, b)] = k; if (!good) continue;
        const dd = doorCells.length ? Math.min(...doorCells.map(([dx, dy]) => Math.abs(dx - x) + Math.abs(dy - y))) : 0;
        const s = (type === 'greatbed' || type === 'kingbed' || type === 'bed' || type === 'bunk' ? -dd : type === 'chest' ? dd * .1 : type === 'woodpile' ? dd * .5 : -dd * .3) + r() * .3; if (bestS === null || s < bestS) { bestS = s; bestC = { x, y, w: sw, h: sh, rot, cs, front, fr }; } } }
    if (!bestC) return null;
    for (const [cx, cy] of bestC.cs) occ[I(cx, cy)] = 1; keep[I(bestC.fr[0][0], bestC.fr[0][1])] = 1;
    const pr = { type, room: q.id, x: bestC.x, y: bestC.y, w: bestC.w, h: bestC.h, rot: bestC.rot, comp: COMP[type] || [], front: bestC.front }; F.props.push(pr); return pr;
  }
  function placeFoot(F, bed) { // a chest at the bed's foot when there is room
    const { cell, occ, keep } = F, I = (x, y) => y * Wi + x, inG = (x, y) => x >= 0 && y >= 0 && x < Wi && y < Di;
    const foot = bed.rot === 0 ? [[bed.x, bed.y - 1]] : bed.rot === 2 ? [[bed.x, bed.y + bed.h]] : bed.rot === 1 ? [[bed.x + bed.w, bed.y]] : [[bed.x - 1, bed.y]];
    for (const [x, y] of foot) { if (!inG(x, y) || cell[I(x, y)] !== bed.room || occ[I(x, y)] || keep[I(x, y)]) continue; occ[I(x, y)] = 1;
      const q = F.rooms[bed.room]; let okc = true; { const free = []; for (let yy = q.y0; yy <= q.y1; yy++) for (let xx = q.x0; xx <= q.x1; xx++) if (!occ[I(xx, yy)]) free.push(I(xx, yy)); const seen = new Set([free[0]]), s2 = [free[0]];
        while (s2.length) { const c = s2.pop(), cx = c % Wi, cy = (c / Wi) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (!inG(nx, ny) || cell[I(nx, ny)] !== q.id || occ[I(nx, ny)]) continue; const k = I(nx, ny); if (!seen.has(k)) { seen.add(k); s2.push(k); } } }
        if (seen.size !== free.length) okc = false; for (let yy = q.y0; yy <= q.y1 && okc; yy++) for (let xx = q.x0; xx <= q.x1; xx++) if (keep[I(xx, yy)] && !seen.has(I(xx, yy))) { okc = false; break; } }
      const fnb = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => inG(a, b) && cell[I(a, b)] === bed.room && !occ[I(a, b)]);
      if (!okc || !fnb.length) { occ[I(x, y)] = 0; continue; } keep[I(fnb[0][0], fnb[0][1])] = 1;
      F.props.push({ type: 'chest', room: bed.room, x, y, w: 1, h: 1, rot: bed.rot, comp: [], foot: 1 }); return true; }
    return false; }

  // ---------- cellar: an undercroft under the front of most merchant houses, some artisan shops; reached by a hatch and ladder inside,
  // and in merchant houses often by steps straight from the street (and then sometimes let to a wine or goods dealer) ----------
  let cellar = null;
  { // only a home that has the ground floor gets a cellar (flats and upper-floor units in stacked or modular buildings never do)
    const CS = cellarSteps(H, { ...opt, tier }), rc = CS.rc;
    if (CS.cellar) {
      const ext = CS.ext, F0 = fl[0];
      const street = CS.street;
      const inExt = (cs) => cs.every(([, y]) => y < ext && y >= 1);
      const order = ['buttery', 'service', 'pantry', 'kitchen', 'goods', 'shop', 'workshop', 'hall'];   // never the parlour
      let trap = null; for (const t of order) { for (const q of F0.rooms.filter((z) => z.t === t)) { trap = placeOn(F0, q, 'trap', inExt); if (trap) break; } if (trap) break; }
      if (trap || street) {
        const I = (x, y) => y * Wi + x, cell = new Int16Array(Wi * Di).fill(-1), occ = new Uint8Array(Wi * Di), keep = new Uint8Array(Wi * Di);
        const rooms = [{ id: 0, t: 'cellar', x0: 0, y0: 0, x1: Wi - 1, y1: ext - 1 }]; for (let y = 0; y < ext; y++) for (let x = 0; x < Wi; x++) cell[I(x, y)] = 0;
        // cells beyond the cellar are solid earth: mark them so nothing is placed there
        for (let y = ext; y < Di; y++) for (let x = 0; x < Wi; x++) occ[I(x, y)] = 4;
        const doors = [], windows = []; let sp = { block: [], well: [], need: [], one: true, nbs: [], kind: 'ladder' }, csteps = null;
        if (trap) { const c = [trap.x, trap.y]; occ[I(c[0], c[1])] = 2; const nbs = [[c[0] + 1, c[1]], [c[0] - 1, c[1]], [c[0], c[1] - 1], [c[0], c[1] + 1]].filter(([x, y]) => x >= 0 && y >= 0 && x < Wi && y < ext && !occ[I(x, y)]);
          sp = { block: [c], well: [], need: nbs.slice(0, 1), one: true, nbs, kind: 'ladder' }; for (const [x, y] of sp.need) keep[I(x, y)] = 1; }
        if (street) { const sx = CS.sx;   /* the hatch never stands in row 0, so it cannot take the steps' column */
          // the steps come down inside, along the front wall: a landing behind the door, then two cells of steps to the floor
          { const pref = sx >= Wi / 2 ? [-1, 1] : [1, -1], free = ([x, y]) => x >= 0 && x < Wi && y >= 0 && y < ext && !occ[I(x, y)], opts = [];
            for (const n of [2, 1]) for (const dir of pref) { const cells = []; for (let k = n; k >= 1; k--) cells.push([sx + k * dir, 0]); const f1 = [sx + (n + 1) * dir, 0], foot = free(f1) ? f1 : [sx + n * dir, 1];
              const used = (x, y) => (x === sx && y === 0) || cells.some((c) => c[0] === x && c[1] === y);
              if (cells.every(free) && free(foot) && !used(...foot) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => free([foot[0] + dx, foot[1] + dy]) && !used(foot[0] + dx, foot[1] + dy))) opts.push({ cells, foot, dir }); }   // the foot must open onto the rest of the cellar
            const o = opts[0]; if (o) { const { cells, foot, dir } = o; for (const [x, y] of [...cells, [sx, 0]]) occ[I(x, y)] = 2; keep[I(foot[0], foot[1])] = 1;
              const bx = sx - dir; if (bx >= 0 && bx < Wi) { if (ext > 1 && free([bx, 1])) keep[I(bx, 1)] = 1; else if (!free([bx - dir, 0])) occ[I(bx, 0)] = 4; }   // the cell past the landing stays joined to the rest, or is left as solid masonry
              csteps = { cells, top: [sx, 0], foot, dir }; } } doors.push({ e: ek('h', sx, 0), x: sx, y: 0, street: 1, steps: 1, a: -1, b: 0 }); if (!csteps) keep[I(sx, 0)] = 1; if (ext > 1 && !csteps) keep[I(sx, 1)] = 1;   /* with the steps inside, the landing is masonry and the foot is kept clear instead */
          // small grated lights in the front wall either side of the steps
          for (const x of [sx - 2, sx + 2]) if (x >= 0 && x < Wi && x !== doorX) windows.push({ side: 'f', i: x, kind: 'grate' }); }
        cellar = { f: -1, rooms, doors, windows, props: [], sp, pen: 0, occ, keep, cell, later: [], csteps };
        // wine and ale in casks on timber stillages; the goods of the house's trade
        const L = trade === 'vintner' ? ['stillage', 'stillage', 'stillage', 'barrel', 'stillage', 'stillage', 'barrel', 'stillage']
          : (tier === 'patrician' || tier === 'merchant') && trade ? [...TRADE[trade].cellar, 'stillage', ...TRADE[trade].cellar, 'barrel', 'stillage', 'shelf']
          : tier === 'patrician' || tier === 'merchant' ? ['stillage', 'crate', 'sack', 'barrel', 'bale', 'crate', 'stillage', 'sack', 'barrel', 'shelf']
          : trade === 'chandler' ? ['tub', 'barrel', 'tub', 'crate', 'sack'] : trade === 'baker' ? ['sack', 'sack', 'barrel', 'sack', 'crate'] : ['barrel', 'sack', 'crate', 'tub', 'basket', 'barrel', 'sack'];
        const want = Math.round(Wi * ext / 6); let have = 0, k = 0, miss = 0; while (have < want && miss < L.length) { if (placeOn(cellar, rooms[0], L[k % L.length])) { have++; miss = 0; } else miss++; k++; }
        cellar.street = street;
      }
    } }
  // ---------- yard: the rest of the plot behind the house (privy at the far end, well, woodpile, outdoor work,
  // a detached kitchen behind richer houses, the fire trades' ovens and forges kept out here against masonry) ----------
  let yard = null;
  if (opt.grid && H.x !== undefined && !(H.baseFloor > 0)) {   // the yard belongs to the ground-floor home too
    const G = opt.grid, at = (x, y) => (y >= 0 && y < G.length && x >= 0 && x < G[0].length) ? G[y][x] : '?';
    const cols = H.f === 'S' || H.f === 'N' ? [...Array(H.w).keys()].map((i) => H.x + i) : [...Array(H.d).keys()].map((i) => H.y + i);
    const step = { S: [0, -1], N: [0, 1], E: [-1, 0], W: [1, 0] }[H.f];
    const depths = cols.map((c) => { let x = H.f === 'S' || H.f === 'N' ? c : H.f === 'E' ? H.x - 1 : H.x + H.w, y = H.f === 'S' ? H.y - 1 : H.f === 'N' ? H.y + H.d : c, run = 0;
      while (run < 8 && at(x, y) === 'y') { run++; x += step[0]; y += step[1]; } return at(x, y) === 'l' ? Math.floor(run / 2) : run; });
    const yd = Math.min(4, Math.min(...depths));
    if (yd >= 1) {
      const Yi = yd * 3, rows = Yi, I = (x, y) => y * Wi + x, cell = new Int16Array(Wi * rows).fill(0), occ = new Uint8Array(Wi * rows), keep = new Uint8Array(Wi * rows), ry = rngOf(seed + 9);
      const rooms = [{ id: 0, t: 'yard', x0: 0, y0: 0, x1: Wi - 1, y1: rows - 1 }];
      // a detached kitchen behind merchant and patrician houses, across the yard from the hall
      const rich = tier === 'merchant' || tier === 'patrician';
      // a baker's oven stands in a roofed bakehouse in the yard, not in the open
      const yT = trade && TRADE[trade].yard && tier === 'artisan' ? TRADE[trade].yard : null;
      const outT = rich && rows >= 6 && Wi >= 7 && !(fl[0].rooms.some((q) => q.t === 'kitchen')) ? 'kitchen' : yT === 'baker' && Wi >= 7 ? 'bakehouse' : null;
      if (outT) { const kw = Math.min(4, Wi - 3), kx = ry() < .5 ? 0 : Wi - kw, ky = rows >= 6 ? rows - 3 : 0;
        rooms.push({ id: 1, t: outT, x0: kx, y0: ky, x1: kx + kw - 1, y1: ky + 2 });
        for (let y = ky; y < ky + 3; y++) for (let x = kx; x < kx + kw; x++) cell[I(x, y)] = 1; }
      // the back door: from a back room of the ground floor onto the yard
      const F0 = fl[0], gI = (x, y) => y * Wi + x, backs = [...Array(Wi).keys()].filter((x) => !F0.occ[gI(x, Di - 1)] && !(F0.keep[gI(x, Di - 1)] && false)).sort((a, b) => { const ta = F0.rooms[F0.cell[gI(a, Di - 1)]].t, tb = F0.rooms[F0.cell[gI(b, Di - 1)]].t, pr = (t) => ['kitchen', 'service', 'buttery', 'pantry', 'passage', 'hall', 'workshop', 'goods', 'shop', 'parlour'].indexOf(t) + 1 || 9; return pr(ta) - pr(tb) || Math.abs(a - doorX) - Math.abs(b - doorX); });
      let bx = -1; for (const x of F0.backX >= 0 ? [F0.backX, ...backs] : backs) { if (cell[I(x, 0)] !== 0) continue; F0.keep[gI(x, Di - 1)] = 1; bx = x; break; }
      if (bx >= 0) {
        F0.doors.push({ e: ek('h', bx, Di), x: bx, y: Di - 1, p: [bx, Di - 1], q: [bx, Di - 1], back: 1, a: F0.cell[gI(bx, Di - 1)], b: -2 });
        const doors = [{ e: ek('h', bx, 0), x: bx, y: 0, street: 1, back: 1, a: -1, b: 0 }]; keep[I(bx, 0)] = 1; if (rows > 1) keep[I(bx, 1)] = 1;
        if (rooms[1]) { const k = rooms[1];
          if (k.y0 > 0) { const dx = Math.max(k.x0 + 1, Math.min(k.x1 - 1, bx)); doors.push({ e: ek('h', dx, k.y0), p: [dx, k.y0 - 1], q: [dx, k.y0], a: 0, b: 1 }); keep[I(dx, k.y0 - 1)] = 1; keep[I(dx, k.y0)] = 1; }
          else { const ix = k.x0 === 0 ? k.x1 + 1 : k.x0 - 1, kx2 = k.x0 === 0 ? k.x1 : k.x0, dy = 1; doors.push({ e: edgeBetween([ix, dy], [kx2, dy]), p: [ix, dy], q: [kx2, dy], a: 0, b: 1 }); keep[I(ix, dy)] = 1; keep[I(kx2, dy)] = 1; } }
        yard = { f: 'yard', rooms, doors, windows: [], props: [], sp: { block: [], well: [], need: [], one: false, nbs: [] }, pen: 0, occ, keep, cell, later: [], rowsN: rows };
        const far = (cs) => cs.every(([, y]) => y >= rows - 2), near = (cs) => cs.every(([, y]) => y <= 2);
        // the privy at the far end of the plot, away from the house and the well
        placeOn(yard, rooms[0], 'privy', far) || placeOn(yard, rooms[0], 'privy');
        if (ry() < .45) placeOn(yard, rooms[0], 'well');
        placeOn(yard, rooms[0], 'woodpile', near) || placeOn(yard, rooms[0], 'woodpile');
        if (rooms[1]) { const k = rooms[1]; if (k.t === 'bakehouse') { placeOn(yard, k, 'oven') || placeOn(yard, k, 'trough'); placeOn(yard, k, 'trough'); placeOn(yard, k, 'sack'); }
          else { const hk = placeOn(yard, k, 'hearth'); if (hk) { hk.comp = COMP.hearth; hk.cook = 1; } placeOn(yard, k, 'table'); placeOn(yard, k, 'dresser'); placeOn(yard, k, 'barrel'); placeOn(yard, k, 'tub'); } }
        // only an artisan works in his yard, at the trade the house follows; a merchant's yard holds his cart and goods
        const work = yT || 'none';
        if (work === 'baker') { placeOn(yard, rooms[0], 'woodpile', near) || placeOn(yard, rooms[0], 'woodpile'); }
        if (work === 'cooper' || work === 'carpenter') { placeOn(yard, rooms[0], 'bench'); placeOn(yard, rooms[0], 'timber'); placeOn(yard, rooms[0], work === 'cooper' ? 'barrel' : 'choppingblock'); }
        if (work === 'dyer') { placeOn(yard, rooms[0], 'vat'); placeOn(yard, rooms[0], 'vat'); placeOn(yard, rooms[0], 'rack'); placeOn(yard, rooms[0], 'washtub'); }
        yard.work = work;
        const L = tier === 'poor' ? ['garden', 'coop', 'sty', 'washtub', 'bucket'] : tier === 'artisan' ? ['garden', 'coop', 'washtub', 'choppingblock', 'bucket'] : ['cart', 'crate', 'barrel', 'crate', 'washtub', 'garden'];
        placeOn(yard, rooms[0], L[0]);   // the tier's first piece (a merchant's cart) always, then fill
        const want = Math.round(Wi * rows / 7); let have = yard.props.length, k = 0, miss = 0; while (have < want && miss < L.length) { if (placeOn(yard, rooms[0], L[k % L.length])) { have++; miss = 0; } else miss++; k++; }
      } else F0.keep.fill(F0.keep[0], 0, 0);
    }
  }
  // a baker with no bakehouse bakes in an oven at the back of the ground floor
  if (trade === 'baker' && !(yard && yard.rooms.some((q) => q.t === 'bakehouse'))) { const F0 = fl[0]; for (const t of ['service', 'kitchen', 'hall', 'buttery', 'shop']) { const q = F0.rooms.find((z) => z.t === t); if (q && placeOn(F0, q, 'oven')) break; } }
  // ---------- checks ----------
  const checks = verify(best, { Wi, Di, st, P, slept, out, doorX, chim });
  // the chimney rises in the same cells on every floor; every chamber has a bed; a counting house has one door
  if (chim && chimFix) for (const F of fl) { const fire = F.props.find((p) => p.fixed && ['hearth', 'fireplace', 'stack'].includes(p.type) && p.x === chim.x && !(flue2 && p.x === flue2[0] && p.y === flue2[1]));
    if (!fire || !chimFix.some(([x, y]) => x === fire.x && y === fire.y)) checks.fails.push(`f${F.f}: chimney moves between floors`); }
  for (const F of fl) for (const q of F.rooms) { if ((q.t === 'great' || q.t === 'chamber' || q.t === 'guest') && !F.props.some((p) => p.room === q.id && /bed|pallet/.test(p.type))) checks.fails.push(`f${F.f}: ${ROOM[q.t].name} has no bed`);
    if (q.t === 'counting' && F.doors.filter((d) => d.a === q.id || d.b === q.id).length !== 1) checks.fails.push(`f${F.f}: counting house is not a dead end`);
    if (q.t === 'counting' && [...F.sp.block, ...F.sp.well].some(([x, y]) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1)) checks.fails.push(`f${F.f}: stair in the counting house`); }
  { const sd = fl[0].rooms[fl[0].cell[doorX]]; if (sd && sd.t === 'parlour') checks.fails.push('street door opens into the parlour'); }
  if (flue2) for (const F of fl) if (F.f > 0 && !F.props.some((p) => p.type === 'stack' && p.x === flue2[0] && p.y === flue2[1])) checks.fails.push(`f${F.f}: kitchen or hood flue missing`);
  // the back door opens from a service room, never the parlour while another room touches the back wall
  { const bd = fl[0].doors.find((d) => d.back); if (bd && fl[0].rooms[bd.a]?.t === 'parlour' && [...Array(Wi).keys()].some((x) => fl[0].rooms[fl[0].cell[(Di - 1) * Wi + x]].t !== 'parlour')) checks.fails.push('back door through the parlour'); }
  if ((tier === 'merchant' || tier === 'patrician') && Di >= 7) for (const F of fl) if (F.f > 0) {   /* one-bay-deep houses: one room a floor, the stair rises in its corner */ const c = [...F.sp.block, ...F.sp.well][0]; const q = c && F.rooms[F.cell[c[1] * Wi + c[0]]]; if (q && q.t === 'great') checks.fails.push(`f${F.f}: stair lands in the great chamber`); }
  checks.ok = !checks.fails.length;
  if (yard) { const c3 = verify({ floors: [yard] }, { Wi, Di: yard.rowsN, st: 1, P: [], slept: 0, out, doorX }); checks.fails.push(...c3.fails.map((x) => 'yard ' + x)); checks.ok = !checks.fails.length; }
  if (cellar) { const c2 = verify({ floors: [cellar] }, { Wi, Di, st: 1, P: [], slept: 0, out, doorX }); checks.fails.push(...c2.fails.map((x) => 'cellar ' + x)); checks.ok = !checks.fails.length; }
  checks.fails.push(...fails.filter((x, i, a) => a.indexOf(x) === i && best.floors.some(() => true)).slice(0, 0));
  // a one-storey house that cannot bed everyone gets a sleeping loft after all
  if (!checks.ok && st0 === 1 && !loft && P.length >= 3 && !opt.forceLoft && checks.fails.some((x) => x.startsWith('beds for'))) return planInterior(H, { ...opt, forceLoft: true });
  // what's on the shop's shelves, counter and tables: the trade's own wares (the 3D builder lays them out)
  if (trade) for (const F of best.floors) for (const p of F.props) { const q = F.rooms.find((r) => r.id === p.room); if (q && ['shop', 'workshop'].includes(q.t) && ['shelf', 'counter', 'table'].includes(p.type)) p.goods = trade;
    if (q && (ctx.inn || ctx.ale) && ['hall', 'buttery'].includes(q.t) && ['shelf', 'table', 'longtable', 'hatch'].includes(p.type)) p.goods = 'inn'; }
  return { H, tier, Wi, Di, st, P, slept, floors: (cellar ? [cellar, ...best.floors] : best.floors).map(({ f, rooms, doors, windows, props, sp, street, csteps }) => ({ f, rooms, doors, windows, props, stair: sp, street, csteps })), yard: yard && { rooms: yard.rooms, doors: yard.doors, windows: [], props: yard.props, stair: yard.sp, rows: yard.rowsN, work: yard.work }, core: best.core, chim, chimPair: chimFix, flue2, trade, doorX, checks };
}

// ---------- invariants: every plan must pass these before it is shown ----------
export function verify(best, { Wi, Di, st, P, slept, out, doorX }) {
  const fails = [];
  const I = (x, y) => y * Wi + x, inG = (x, y) => x >= 0 && y >= 0 && x < Wi && y < Di;
  if (best.floors.length !== st) fails.push('floor count');
  for (const F of best.floors) {
    const { cell, occ, rooms, doors, windows, sp } = F;
    // every cell belongs to a room
    for (let i = 0; i < Wi * Di; i++) if (cell[i] < 0 && occ[i] !== 4) { fails.push(`f${F.f}: cell outside rooms`); break; }
    // walking: from the entry, through doors, every room and every prop's use cell is reachable
    const doorSet = new Set(doors.map((d) => d.e));
    const sd = doors.find((d) => d.street), start = F.f === 0 ? [doorX, 0] : F.csteps ? F.csteps.foot : sd ? [sd.x, 0] : (sp.need[0] || (sp.nbs || []).find(([x, y]) => !occ[I(x, y)]) || null);
    if (!start) { fails.push(`f${F.f}: no way in`); continue; }
    const seen = new Uint8Array(Wi * Di), q = [start]; seen[I(start[0], start[1])] = 1;
    while (q.length) { const [x, y] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inG(nx, ny) || seen[I(nx, ny)] || occ[I(nx, ny)]) continue;
      if (cell[I(nx, ny)] !== cell[I(x, y)] && !doorSet.has(edgeBetween([x, y], [nx, ny]))) continue; seen[I(nx, ny)] = 1; q.push([nx, ny]); } }
    for (const rm of rooms) { let any = false; for (let y = rm.y0; y <= rm.y1; y++) for (let x = rm.x0; x <= rm.x1; x++) if (seen[I(x, y)]) any = true; if (!any) fails.push(`f${F.f}: ${ROOM[rm.t].name} unreachable`); }
    for (const p of F.props) { if (p.fixed && p.type === 'stack') continue; const P0 = PROP[p.type]; const cs = []; for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) cs.push([p.x + i, p.y + j]);
      const nb = cs.flatMap(([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]).filter(([x, y]) => inG(x, y) && cell[I(x, y)] === p.room && seen[I(x, y)]);
      if (!nb.length) fails.push(`f${F.f}: ${P0.label} cannot be reached`); }
    for (const [x, y] of sp.need) if (!seen[I(x, y)]) fails.push(`f${F.f}: stair landing unreachable`);
    { const sc = (sp.block || [])[0] || (sp.well || [])[0]; if (sc && !sp.one) for (const [x, y] of sp.need) if (cell[I(x, y)] !== cell[I(sc[0], sc[1])]) fails.push(`f${F.f}: stair foot or landing behind a partition`); }
    if (sp.one && F.f < st) { const [c] = sp.block.length ? sp.block : sp.well; if (c && !sp.nbs.some(([x, y]) => seen[I(x, y)])) fails.push(`f${F.f}: stair unreachable`); }
    // no room is cut in two by furniture
    for (const rm of rooms) { const free = []; for (let y = rm.y0; y <= rm.y1; y++) for (let x = rm.x0; x <= rm.x1; x++) if (!occ[I(x, y)]) free.push([x, y]); if (free.some(([x, y]) => !seen[I(x, y)]) && free.some(([x, y]) => seen[I(x, y)])) fails.push(`f${F.f}: ${ROOM[rm.t].name} cut in two`); }
    // windows only where there is open air
    for (const w of windows) if ((w.side === 'b' && !out.b) || (w.side === 'l' && !out.l) || (w.side === 'r' && !out.r)) fails.push(`f${F.f}: window in a party wall`);
    // a door never opens onto a blocked cell
    for (const d of doors) { if (d.steps && F.csteps) continue; for (const c of d.street ? [[d.x, 0]] : [d.p, d.q]) { if (occ[I(c[0], c[1])]) fails.push(`f${F.f}: door blocked`); else if (!seen[I(c[0], c[1])]) fails.push(`f${F.f}: door unreachable`); } }
  }
  if (slept < P.length) fails.push(`beds for ${slept} of ${P.length}`);
  return { ok: !fails.length, fails };
}
