// @ts-nocheck
// shell3d.js: the outside of any planned building, raised from its interior plan (the same rooms the party walks
// inside), set down in the town facing whichever way the town generator turned it.
//   buildShell(b, pl, X) -> { door, entry } ; b: a gen2 building (x0,y0,w,d,f,m,type,role,...), pl: its interior plan,
//   X: the 3D builder's kit { THREE, cube, quad, tri, geo, V, group, solids, zone, day, snow, addLight, out(x,y) }
const GH = 1.8, UH = 1.42, SH_IN = 2.4;

export function buildShell(b, pl, X) {
  const { THREE, cube, quad, tri, geo, V, solids, day, snow } = X;
  const w = b.w, d = b.d, Wi = pl.Wi, Di = pl.Di, sx = w / Wi, sy = d / Di;
  // local (u along the front from the left seen from outside, v back from the front) -> world x, z
  const T = (u, v) => { if (b.m) u = w - u; switch (b.f) { case 's': return [b.x0 + u, b.y0 + d - v]; case 'n': return [b.x0 + w - u, b.y0 + v]; case 'e': return [b.x0 + d - v, b.y0 + w - u]; default: return [b.x0 + v, b.y0 + u]; } };
  const P3 = (u, v, y) => { const [x, z] = T(u, v); return V(x, y, z); };
  const box = (key, u0, v0, y0, u1, v1, y1, skip = '') => { const [xa, za] = T(u0, v0), [xb, zb] = T(u1, v1); cube(key, Math.min(xa, xb), y0, Math.min(za, zb), Math.max(xa, xb), y1, Math.max(za, zb), 64, 64, skip); };
  // a face turned to look away from a reference point (so winding never depends on how the building was turned)
  const face = (key, pts, away) => { const [a, b1, c] = pts, n = new THREE.Vector3().subVectors(b1, a).cross(new THREE.Vector3().subVectors(c, a)), m = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
    const q = n.dot(new THREE.Vector3().subVectors(m, away)) < 0 ? [...pts].reverse() : pts; if (q.length === 4) quad(key, q[0], q[1], q[2], q[3], 64, 64); else tri(key, q[0], q[1], q[2], 64, 64); };
  const STONE_ROLE = new Set(['worship', 'stronghold', 'gate', 'mendicant', 'hall', 'tower', 'see', 'abbey', 'chapel', 'bridgechapel']), stoneAt = (f) => pl.stone === true || (Array.isArray(pl.stone) && pl.stone.includes(f)) || STONE_ROLE.has(b.role) && (f === 0 || b.role !== 'mendicant');
  const h0 = GH * (pl.wallH0 ? Math.max(1, pl.wallH0 / SH_IN) : 1), hOf = (t) => t <= 0 ? 0 : h0 + (t - 1) * UH;
  // how many storeys stand over each interior cell (an open court: none)
  const top = new Int8Array(Wi * Di);
  pl.floors.forEach((F, fi) => { for (const q of F.rooms) { if (q.open && fi === 0) continue; for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (x >= 0 && y >= 0 && x < Wi && y < Di) top[y * Wi + x] = Math.max(top[y * Wi + x], fi + 1); } });
  for (const q of pl.floors[0].rooms) if (q.open) for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (x >= 0 && y >= 0 && x < Wi && y < Di) top[y * Wi + x] = 0;
  // a lofty space with no floor in it (a great church's nave and quire, a clerestory over the aisles' roofs): the plan says how many storeys high it stands
  for (const q of pl.lift || []) for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) if (x >= 0 && y >= 0 && x < Wi && y < Di) top[y * Wi + x] = Math.max(top[y * Wi + x], q.t);
  // fill the wall lines between rooms (the plan leaves them out): a wall cell takes the taller of its neighbours
  for (let pass = 0; pass < 2; pass++) for (let y = 0; y < Di; y++) for (let x = 0; x < Wi; x++) { if (top[y * Wi + x]) continue; let n = 0, mx = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X2 = x + dx, Y2 = y + dy; if (X2 < 0 || Y2 < 0 || X2 >= Wi || Y2 >= Di) continue; const t = top[Y2 * Wi + X2]; if (t) { n++; mx = Math.max(mx, t); } }
    if (n >= 2 && !openAt(x, y)) top[y * Wi + x] = mx; }
  function openAt(x, y) { return pl.floors[0].rooms.some((q) => q.open && x >= q.x0 - 1 && x <= q.x1 + 1 && y >= q.y0 - 1 && y <= q.y1 + 1 && !(x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1) ? false : q.open && x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1); }
  // rectangles of one height
  // rectangles of one height, the largest first (so a nave or a hall reads as one roof, not as strips)
  const used = new Uint8Array(Wi * Di), rects = [], hgt = new Int16Array(Wi);
  for (;;) { let best = null;
    for (const t of new Set(top)) { if (!t) continue; hgt.fill(0);
      for (let y = 0; y < Di; y++) { for (let x = 0; x < Wi; x++) hgt[x] = top[y * Wi + x] === t && !used[y * Wi + x] ? hgt[x] + 1 : 0;
        const st = []; for (let x = 0; x <= Wi; x++) { const hh = x < Wi ? hgt[x] : 0; let s0 = x;
          while (st.length && st[st.length - 1][1] >= hh) { const [sx0, sh] = st.pop(), area = sh * (x - sx0); if (sh && (!best || area > best.a)) best = { a: area, x0: sx0, x1: x - 1, y0: y - sh + 1, y1: y, t }; s0 = sx0; }
          st.push([s0, hh]); } } }
    if (!best || best.a < 2) break;
    for (let yy = best.y0; yy <= best.y1; yy++) for (let xx = best.x0; xx <= best.x1; xx++) used[yy * Wi + xx] = 1; rects.push(best); }
  const tall = Math.max(...rects.map((q) => q.t));
  // a dissolved house unroofed and quarried (England after 1538): its wall lines stand broken to uneven heights, a tower keeps its
  // lower stage, grass grows where the floors were, rubble lies about; no roof, no glass, no way in
  if (pl.ruin) { const ph = ((b.x0 | 0) * 7.13 + (b.y0 | 0) * 3.71) % 6.28, th = .36, rid = new Int16Array(Wi * Di).fill(-1);
    rects.forEach((q, n) => { for (let y = q.y0; y <= q.y1; y++) for (let x = q.x0; x <= q.x1; x++) rid[y * Wi + x] = n; });
    const on = (x, y) => x >= 0 && y >= 0 && x < Wi && y < Di && top[y * Wi + x] > 0;
    // how much of the wall still stands: a slow swell along the outline (coherent, not a staircase), breaches where it dips low,
    // the gable ends of the long ranges standing nearly full height, a tower's lower stage
    const stand = (u, v, q, endWall) => { const Hh = hOf(q.t), n = .5 + .3 * Math.sin(u * .55 + ph) * Math.cos(v * .43 - ph) + .2 * Math.sin((u + v) * 1.7 + ph * 2);
      if (n < .2 && !endWall) return 0; const f = q.t >= 4 ? .55 + .3 * n : endWall ? .7 + .25 * n : .1 + .62 * n * n; return Math.max(.45, Hh * f); };
    for (const q of rects) { const u0 = q.x0 * sx, u1 = (q.x1 + 1) * sx, v0 = q.y0 * sy, v1 = (q.y1 + 1) * sy; box('turf', u0, v0, .004, u1, v1, .02, 'b');
      const [xa, za] = T(u0, v0), [xb, zb] = T(u1, v1); solids.push([Math.min(xa, xb), Math.min(za, zb), Math.max(xa, xb), Math.max(za, zb)]); }
    for (let y = 0; y < Di; y++) for (let x = 0; x < Wi; x++) { if (!on(x, y)) continue; const q = rects[rid[y * Wi + x]]; if (!q) continue;
      const long = (q.x1 - q.x0) >= (q.y1 - q.y0);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, out = !on(nx, ny);
        const u = (x + .5) * sx, v = (y + .5) * sy;
        if (out) { const endWall = long ? dx !== 0 : dy !== 0, hh = stand(u, v, q, endWall && (q.t >= 3)); if (!hh) continue;
          const ua = dx ? (dx > 0 ? (x + 1) * sx - th : x * sx) : x * sx, ub = dx ? ua + th : (x + 1) * sx, va = dy ? (dy > 0 ? (y + 1) * sy - th : y * sy) : y * sy, vb = dy ? va + th : (y + 1) * sy;
          // a tall stretch keeps its window: an opening between sill and head every few bays
          const along = dx ? y : x, win = hh > 3 && along % 9 >= 3 && along % 9 <= 5;
          if (win) { box('ashlar', ua, va, 0, ub, vb, 1.3, 'b'); if (hh > 3.4) box('ashlar', ua, va, hh - .7, ub, vb, hh, 'b'); }
          else box('ashlar', ua, va, 0, ub, vb, hh, 'b'); }
        else if ((dx > 0 || dy > 0) && rid[ny * Wi + nx] !== rid[y * Wi + x] && rects[rid[ny * Wi + nx]] && rects[rid[ny * Wi + nx]].t !== q.t && (dx ? y : x) % 6 === 1) {   // an arcade between two ranges: its piers' stumps
          const cu = dx ? (x + 1) * sx : u, cv = dy ? (y + 1) * sy : v, r0 = .26; box('ashlar', cu - r0, cv - r0, 0, cu + r0, cv + r0, Math.max(.4, hOf(q.t) * (.12 + .3 * (.5 + .5 * Math.sin(cu * 1.3 + cv + ph)))), 'b'); } } }
    // fallen stone
    let k = 0; const hs = () => { const x = Math.sin(++k * 12.9898 + ph * 78.233) * 43758.5453; return x - Math.floor(x); };
    for (const q of rects) for (let j = Math.round((q.x1 - q.x0) * (q.y1 - q.y0) / 70); j > 0; j--) { const cu = (q.x0 + 1 + hs() * (q.x1 - q.x0 - 1)) * sx, cv = (q.y0 + 1 + hs() * (q.y1 - q.y0 - 1)) * sy, r0 = .12 + hs() * .2; box('stone', cu - r0, cv - r0 * .8, 0, cu + r0, cv + r0 * .8, r0 * .8, 'b'); }
    return { entries: [], h0, top: tall }; }
  // which sides of a rectangle's ground storey stand open (a room with openSides: 1 = all round, or a string of sides 'f','b','l','r')
  const openOf = (q) => { const rs = pl.floors[0].rooms.filter((r) => r.openSides && r.x0 <= q.x1 && r.x1 >= q.x0 && r.y0 <= q.y1 && r.y1 >= q.y0); if (!rs.length) return null; const v = rs[0].openSides; return typeof v === 'string' ? v : true; };
  const openSide = (c) => { const v = pl.floors[0].rooms.find((r) => r.openSides)?.openSides; return v ? (typeof v === 'string' ? v.includes(c) : true) : false; };
  const rk = snow ? 'roof_snow' : b.role === 'worship' || b.role === 'see' || b.role === 'abbey' || b.role === 'chapel' || b.role === 'bridgechapel' || b.role === 'mint' || b.role === 'stronghold' || b.role === 'mendicant' || b.role === 'care' || b.role === 'seat' || b.role === 'hall' ? 'roof_slate' : b.type === 'barn' || b.role === 'mill' ? 'roof_thatch' : b.role === 'noxious' || b.role === 'dye' || b.role === 'shaft' || b.role === 'smelt' || b.role === 'crane' ? 'roof_brown' : 'roof_terra';
  const ridgeK = snow ? 'roof_snow' : rk.replace('roof_', 'ridge_');
  const bands = [], roofs = [], opens = [];   // timber-framed wall bands, roof tops (for chimneys), openings (windows, doors) the studs keep clear of
  for (const q of rects) {
    const u0 = q.x0 * sx, u1 = (q.x1 + 1) * sx, v0 = q.y0 * sy, v1 = (q.y1 + 1) * sy, Hh = hOf(q.t);
    if (u1 - u0 < .2 || v1 - v0 < .2) continue;
    // walls: the ground storey in stone or plaster, upper storeys in plaster over timber where the plan is timber-framed
    const gk = stoneAt(0) ? 'ashlar' : 'plaster_cream', uk = stoneAt(1) ? 'ashlar' : 'plaster_white';
    const os = openOf(q), sideOpen = (c) => os === true || (typeof os === 'string' && os.includes(c));
    if (os) {   // open on posts (a shambles, a market house): posts round the edge, a thin wall only on the closed sides, a boarded ceiling under the roof
      const gy = Math.min(Hh, h0), L = [['f', u0, v0, u1, v0], ['b', u0, v1, u1, v1], ['l', u0, v0, u0, v1], ['r', u1, v0, u1, v1]];
      for (const [c, ua, va, ub, vb] of L) { const len = Math.hypot(ub - ua, vb - va), n = Math.max(1, Math.round(len / 1.3));
        if (sideOpen(c)) { for (let k = 0; k <= n; k++) { const uu = ua + (ub - ua) * k / n, vv = va + (vb - va) * k / n, [px, pz] = T(uu, vv); cube('beam', px - .09, 0, pz - .09, px + .09, gy, pz + .09, 32, 32, ''); }
          const [xa2, za2] = T(ua, va), [xb2, zb2] = T(ub, vb); cube('beam', Math.min(xa2, xb2) - .08, gy - .26, Math.min(za2, zb2) - .08, Math.max(xa2, xb2) + .08, gy, Math.max(za2, zb2) + .08, 32, 32, ''); }
        else { const t = .12, du = c === 'l' ? t : c === 'r' ? -t : 0, dv = c === 'f' ? t : c === 'b' ? -t : 0; box(gk, Math.min(ua, ua + du), Math.min(va, va + dv), 0, Math.max(ub, ub + du), Math.max(vb, vb + dv), gy, 'b'); } }
      box('beam', u0, v0, gy - .04, u1, v1, gy, '');
      for (const it of pl.floors[0].props || []) { const cu = (it.x + (it.w || 1) / 2) / Wi * w, cv = (it.y + (it.h || 1) / 2) / Di * d; if (cu < u0 || cu > u1 || cv < v0 || cv > v1) continue;
        const hu = (it.w || 1) * sx / 2 - .08, hv = (it.h || 1) * sy / 2 - .08, ht = /counter|tron|desk|table/.test(it.type) ? .8 : /rack/.test(it.type) ? 1.5 : /post/.test(it.type) ? gy : .5;
        box(/rack|post/.test(it.type) ? 'beam' : 'wood', cu - hu, cv - hv, 0, cu + hu, cv + hv, ht, 'b'); }
      if (Hh > h0) box(uk, u0, v0, h0, u1, v1, Hh, 'b');
    } else { box(gk, u0, v0, 0, u1, v1, Math.min(Hh, h0), 'b'); if (Hh > h0) box(uk, u0, v0, h0, u1, v1, Hh, 'b'); }
    if (!stoneAt(0) && pl.posts !== false) for (const [uu, vv] of [[u0, v0], [u1, v0], [u0, v1], [u1, v1]]) { const [px, pz] = T(uu, vv); cube('beam', px - .06, 0, pz - .06, px + .06, Hh, pz + .06, 32, 32, ''); }
    if (Hh > h0 && !stoneAt(1)) { const [xa, za] = T(u0, v0), [xb, zb] = T(u1, v1); cube('beam', Math.min(xa, xb) - .04, h0 - .06, Math.min(za, zb) - .04, Math.max(xa, xb) + .04, h0 + .06, Math.max(za, zb) + .04, 32, 32, ''); }
    solids.push((() => { const [xa, za] = T(u0, v0), [xb, zb] = T(u1, v1); return [Math.min(xa, xb), Math.min(za, zb), Math.max(xa, xb), Math.max(za, zb)]; })());
    // the roof: a tower gets a spire (a church) or battlements (a stronghold) or a pyramid; a range gets a gable along its length
    const [xa, za] = T(u0, v0), [xb, zb] = T(u1, v1), X0 = Math.min(xa, xb), X1 = Math.max(xa, xb), Z0 = Math.min(za, zb), Z1 = Math.max(za, zb), lx = X1 - X0, lz = Z1 - Z0;
    if (!stoneAt(0) && !os) bands.push({ X0, X1, Z0, Z1, ya: 0, yb: Math.min(Hh, h0), rail: .55 }); if (Hh > h0 && !stoneAt(1)) bands.push({ X0, X1, Z0, Z1, ya: h0, yb: Hh, rail: h0 + .38 });
    const tower = q.t >= 3 && (q.t === tall || q.t >= 4 && /worship|see|abbey/.test(b.role)) && (Math.max(lx, lz) <= 4.2 && rects.length > 1 || b.role === 'stronghold' || b.role === 'gate' || b.role === 'tower');   // a keep, a gatehouse or a tower house is a tower whatever its size
    if (tower && (b.role === 'stronghold' || b.role === 'gate' || b.role === 'tower')) { cube(snow ? 'roof_snow' : 'stone', X0 + .2, Hh - .05, Z0 + .2, X1 - .2, Hh + .02, Z1 - .2, 64, 64, '');   // the lead flat behind the parapet
      for (let a = X0; a < X1 - .1; a += .5) for (const z of [Z0, Z1 - .2]) cube('ashlar', a, Hh, z, Math.min(X1, a + .28), Hh + .4, z + .2, 64, 64, 'b'); for (let a = Z0; a < Z1 - .1; a += .5) for (const x of [X0, X1 - .2]) cube('ashlar', x, Hh, a, x + .2, Hh + .4, Math.min(Z1, a + .28), 64, 64, 'b'); continue; }
    if (tower) { const church = b.role === 'worship' || b.role === 'see' || b.role === 'abbey', sh = church ? Math.max(lx, lz) * (b.role === 'see' ? 1.6 : 2.2) : Math.max(lx, lz) * .8, mx = (X0 + X1) / 2, mz = (Z0 + Z1) / 2, apex = V(mx, Hh + sh, mz), c = [V(X0 - .1, Hh, Z0 - .1), V(X1 + .1, Hh, Z0 - .1), V(X1 + .1, Hh, Z1 + .1), V(X0 - .1, Hh, Z1 + .1)];
      for (let i = 0; i < 4; i++) face(rk, [c[i], c[(i + 1) % 4], apex], V(mx, Hh, mz));
      if (church) { geo('gold', new THREE.SphereGeometry(.12, 8, 6), new THREE.Matrix4().makeTranslation(mx, Hh + sh + .08, mz)); geo('gold', new THREE.BoxGeometry(.05, .5, .05), new THREE.Matrix4().makeTranslation(mx, Hh + sh + .35, mz));
        // belfry openings below the eaves
        for (const [ax, az, nx, nz] of [[mx, Z1, 0, 1], [mx, Z0, 0, -1], [X0, mz, -1, 0], [X1, mz, 1, 0]]) { const o = .015; if (nz) cube('dark', ax - .3, Hh - 1.1, Math.min(az, az + nz * o), ax + .3, Hh - .35, Math.max(az, az + nz * o), 16, 16, ''); else cube('dark', Math.min(ax, ax + nx * o), Hh - 1.1, az - .3, Math.max(ax, ax + nx * o), Hh - .35, az + .3, 16, 16, ''); } }
      continue; }
    const alongX = lx >= lz, half = (alongX ? lz : lx) / 2, rise = Math.min(b.role === 'see' || b.role === 'abbey' ? 3.4 : 2.6, half * (b.role === 'worship' || b.role === 'see' || b.role === 'abbey' ? 1.0 : .85)), ov = .22, ey = Hh - .12;
    if (alongX) { const mz = (Z0 + Z1) / 2, a = V(X0 - ov, ey, Z1 + ov), bb = V(X1 + ov, ey, Z1 + ov), c = V(X1 + ov, Hh + rise, mz), dd = V(X0 - ov, Hh + rise, mz), e = V(X1 + ov, ey, Z0 - ov), f = V(X0 - ov, ey, Z0 - ov);
      face(rk, [a, bb, c, dd], V((X0 + X1) / 2, Hh, mz - 5)); face(rk, [e, f, dd, c], V((X0 + X1) / 2, Hh, mz + 5));
      face(Hh > h0 ? uk : gk, [V(X0, Hh, Z0), V(X0, Hh, Z1), V(X0, Hh + rise, mz)], V(X0 + 1, Hh, mz)); face(Hh > h0 ? uk : gk, [V(X1, Hh, Z1), V(X1, Hh, Z0), V(X1, Hh + rise, mz)], V(X1 - 1, Hh, mz));
      cube(ridgeK, X0 - ov, Hh + rise - .06, mz - .09, X1 + ov, Hh + rise + .07, mz + .09, 32, 32, ''); roofs.push({ X0, X1, Z0, Z1, Hh, top: (x, z) => Hh + rise * (1 - Math.abs(z - mz) / half) }); }
    else { const mx = (X0 + X1) / 2, a = V(X1 + ov, ey, Z0 - ov), bb = V(X1 + ov, ey, Z1 + ov), c = V(mx, Hh + rise, Z1 + ov), dd = V(mx, Hh + rise, Z0 - ov), e = V(X0 - ov, ey, Z1 + ov), f = V(X0 - ov, ey, Z0 - ov);
      face(rk, [a, bb, c, dd], V(mx - 5, Hh, (Z0 + Z1) / 2)); face(rk, [e, f, dd, c], V(mx + 5, Hh, (Z0 + Z1) / 2));
      face(Hh > h0 ? uk : gk, [V(X0, Hh, Z0), V(X1, Hh, Z0), V(mx, Hh + rise, Z0)], V(mx, Hh, Z0 + 1)); face(Hh > h0 ? uk : gk, [V(X1, Hh, Z1), V(X0, Hh, Z1), V(mx, Hh + rise, Z1)], V(mx, Hh, Z1 - 1));
      cube(ridgeK, mx - .09, Hh + rise - .06, Z0 - ov, mx + .09, Hh + rise + .07, Z1 + ov, 32, 32, ''); roofs.push({ X0, X1, Z0, Z1, Hh, top: (x, z) => Hh + rise * (1 - Math.abs(x - mx) / half) }); }
  }
  // an open court laid to grass (a cloister garth, a garden) shows turf, not the building's paving
  for (const q of pl.floors[0].rooms) if (q.open && /grass|garden/.test(q.floor || '')) box('turf', q.x0 * sx, q.y0 * sy, .004, (q.x1 + 1) * sx, (q.y1 + 1) * sy, .02, 'b');
  // windows from the plan, on outside walls only, floor by floor
  const outward = (side) => { const [ax, az] = T(w / 2, d / 2), [bx, bz] = side === 'f' ? T(w / 2, 0) : side === 'b' ? T(w / 2, d) : side === 'l' ? T(0, d / 2) : T(w, d / 2); const dx = bx - ax, dz = bz - az; return Math.abs(dx) > Math.abs(dz) ? [Math.sign(dx), 0] : [0, Math.sign(dz)]; };
  pl.floors.forEach((F, fi) => { for (const wn of F.windows || []) { if (wn.e || !wn.side) continue; const s = wn.side, i = wn.i; if (fi === 0 && openSide(s)) continue;
      const [u, v] = s === 'f' ? [(i + .5) * sx, 0] : s === 'b' ? [(i + .5) * sx, d] : s === 'l' ? [0, (i + .5) * sy] : [w, (i + .5) * sy];
      const ix = s === 'f' || s === 'b' ? i : s === 'l' ? 0 : Wi - 1, iy = s === 'f' ? 0 : s === 'b' ? Di - 1 : i; if (ix < 0 || iy < 0 || ix >= Wi || iy >= Di || top[iy * Wi + ix] <= fi) continue;
      const [nx, nz] = outward(s), [px, pz] = T(u, v); if (X.out && !X.out(px + nx * .5, pz + nz * .5)) continue;
      const y0 = fi === 0 ? .7 : hOf(fi) + .45, lancet = wn.kind === 'lancet', loop = wn.kind === 'loop', hh = lancet ? Math.min(h0 - 1.2, 2.2) : loop ? .7 : .62, hw = loop ? .06 : lancet ? .22 : .24;
      const key = lancet ? 'stained' : loop || wn.kind === 'grate' || wn.kind === 'louvre' ? 'dark' : wn.kind === 'shut' || wn.kind === 'shutters' ? 'shutter_g' : day ? 'glass' : 'glass_lit';
      const o = .02, ax = nx ? px + nx * o : px - hw, bx = nx ? px + nx * (o + .015) : px + hw, az = nz ? pz + nz * o : pz - hw, bz = nz ? pz + nz * (o + .015) : pz + hw;
      opens.push({ px, pz, hw: hw + .08, y0: y0 + (lancet ? .5 : 0) - .1, y1: y0 + hh + (lancet ? .5 : 0) + .05 });
      cube(key, Math.min(ax, bx), y0 + (lancet ? .5 : 0), Math.min(az, bz), Math.max(ax, bx), y0 + hh + (lancet ? .5 : 0), Math.max(az, bz), 16, 16, '');
      if (!loop && !lancet) { const sa = nx ? px + nx * o : px - hw - .06, sb = nx ? px + nx * (o + .1) : px + hw + .06, za2 = nz ? pz + nz * o : pz - hw - .06, zb2 = nz ? pz + nz * (o + .1) : pz + hw + .06; cube('stone', Math.min(sa, sb), y0 - .08, Math.min(za2, zb2), Math.max(sa, sb), y0, Math.max(za2, zb2), 32, 32, ''); } } });
  // street doors: one doorway per run of door cells
  const dr = (pl.floors[0].doors || []).filter((q) => q.street).map((q) => { const [o, a, c] = String(q.e).split(',').map((v, k) => k ? +v : v); return { o, a, c }; }).sort((p, q) => p.a - q.a);
  const runs = []; for (const q of dr) { const L = runs[runs.length - 1]; if (L && L.o === q.o && L.c === q.c && q.a === L.a1 + 1) L.a1 = q.a; else runs.push({ o: q.o, c: q.c, a0: q.a, a1: q.a }); }
  const entries = [];
  for (const R of runs) { const s = R.o === 'h' ? (R.c === 0 ? 'f' : 'b') : (R.c === 0 ? 'l' : 'r'), mid = (R.a0 + R.a1 + 1) / 2, wid = Math.max(.75, (R.a1 - R.a0 + 1) * (R.o === 'h' ? sx : sy) * .9);
    const [u, v] = s === 'f' ? [mid * sx, 0] : s === 'b' ? [mid * sx, d] : s === 'l' ? [0, mid * sy] : [w, mid * sy], [nx, nz] = outward(s), [px, pz] = T(u, v), hw = Math.min(wid, 1.6) / 2, dh = Math.min(1.85, h0 - .1);
    const o = .02; if (!openSide(s)) if (nx) cube('door', Math.min(px + nx * o, px + nx * (o + .03)), .06, pz - hw, Math.max(px + nx * o, px + nx * (o + .03)), dh, pz + hw, 32, 32, ''); else cube('door', px - hw, .06, Math.min(pz + nz * o, pz + nz * (o + .03)), px + hw, dh, Math.max(pz + nz * o, pz + nz * (o + .03)), 32, 32, '');
    // a dressed-stone frame round the doorway: two jambs and a lintel (never a slab over the door)
    if (stoneAt(0)) for (const [a0, a1, y0, y1] of [[-hw - .12, -hw, .06, dh + .14], [hw, hw + .12, .06, dh + .14], [-hw - .12, hw + .12, dh, dh + .14]]) {
      if (nx) cube('ashlar', Math.min(px, px + nx * .07), y0, pz + a0, Math.max(px, px + nx * .07), y1, pz + a1, 32, 32, ''); else cube('ashlar', px + a0, y0, Math.min(pz, pz + nz * .07), px + a1, y1, Math.max(pz, pz + nz * .07), 32, 32, ''); }
    opens.push({ px, pz, hw: hw + .1, y0: 0, y1: dh + .1 });
    entries.push({ side: s, at: [px + nx * .35, pz + nz * .35], n: [nx, nz] }); }
  // chimneys: a brick stack over every hearth, copper or oven in the plan, standing clear of the roof above it
  const HEARTH = /fireplace|hearth|copper|oven|kiln|forge|furnace/;
  for (const F of pl.floors) for (const it of F.props || []) { if (!HEARTH.test(it.type)) continue;
    const [px, pz] = T((it.x + (it.w || 1) / 2) * sx, (it.y + (it.h || 1) / 2) * sy), R0 = roofs.find((r) => px >= r.X0 - .01 && px <= r.X1 + .01 && pz >= r.Z0 - .01 && pz <= r.Z1 + .01); if (!R0) continue;
    const cx = Math.min(R0.X1 - .25, Math.max(R0.X0 + .25, px)), cz = Math.min(R0.Z1 - .25, Math.max(R0.Z0 + .25, pz)), topY = R0.top(cx, cz) + .5;
    cube('brick', cx - .22, R0.Hh - .3, cz - .22, cx + .22, topY, cz + .22, 32, 32, 'b'); cube('stone', cx - .27, topY, cz - .27, cx + .27, topY + .08, cz + .27, 32, 32, ''); cube('dark', cx - .13, topY + .081, cz - .13, cx + .13, topY + .085, cz + .13, 16, 16, ''); }
  // close studding on the timber-framed walls: posts at an even spacing and a rail, kept clear of windows and doors
  for (const B of bands) for (const [axis, at, nrm] of [['z', B.Z0, -1], ['z', B.Z1, 1], ['x', B.X0, -1], ['x', B.X1, 1]]) {
    const a0 = axis === 'z' ? B.X0 : B.Z0, a1 = axis === 'z' ? B.X1 : B.Z1, L = a1 - a0, n = Math.max(1, Math.round(L / .62)), sp = L / n;
    const hit = (t, hw, y0, y1) => opens.some((o) => Math.abs((axis === 'z' ? o.pz : o.px) - at) < .08 && Math.abs((axis === 'z' ? o.px : o.pz) - t) < o.hw + hw && o.y1 > y0 && o.y0 < y1);
    const put = (t0, t1, y0, y1) => { const f0 = Math.min(at, at + nrm * .025), f1 = Math.max(at, at + nrm * .025); if (axis === 'z') cube('beam', t0, y0, f0, t1, y1, f1, 32, 32, ''); else cube('beam', f0, y0, t0, f1, y1, t1, 32, 32, ''); };
    for (let k = 1; k < n; k++) { const t = a0 + k * sp; if (!hit(t, .04, B.ya, B.yb)) put(t - .04, t + .04, B.ya, B.yb); }
    for (let k = 0; k < n; k++) { const t0 = a0 + k * sp, t1 = t0 + sp; if (!hit((t0 + t1) / 2, sp / 2, B.rail - .04, B.rail + .04)) put(t0, t1, B.rail - .04, B.rail + .04); } }
  // trade marks: the mill's wheel on its water face
  if (b.role === 'mill') { const [px, pz] = T(w / 2, d), [nx, nz] = outward('b'), wx = px + nx * .25, wz = pz + nz * .25, rot = nx ? 0 : Math.PI / 2;
    geo('wood', new THREE.TorusGeometry(.95, .07, 4, 16).rotateY(rot + Math.PI / 2), new THREE.Matrix4().makeTranslation(wx, .45, wz));
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6, m = new THREE.Matrix4().makeRotationY(rot).multiply(new THREE.Matrix4().makeRotationX(a)); m.setPosition(wx + (nx ? 0 : 0), .45 + Math.sin(a) * .95, wz); const pp = new THREE.Vector3(0, 0, Math.cos(a) * .95).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot); m.setPosition(wx + pp.x, .45 + Math.sin(a) * .95, wz + pp.z); geo('beam', new THREE.BoxGeometry(.45, .08, .28), m); } }
  if (b.role === 'crane') { const [px, pz] = T(w / 2, d), [nx, nz] = outward('b'); const a = V(px, 1.4, pz), c = V(px + nx * 2.2, 3.0, pz + nz * 2.2); const len = a.distanceTo(c), mid = a.clone().add(c).multiplyScalar(.5), m = new THREE.Matrix4().lookAt(a, c, V(0, 1, 0)); m.setPosition(mid); geo('beam', new THREE.BoxGeometry(.14, .14, len), m); cube('dark', px + nx * 2.2 - .02, 1.0, pz + nz * 2.2 - .02, px + nx * 2.2 + .02, 3.0, pz + nz * 2.2 + .02, 16, 16, ''); }
  // the post mill's sails: four stocks across the front gable, each with its lattice of sail bars, turned a little off square
  if (b.role === 'windmill') { const [px, pz] = T(w / 2, 0), [nx, nz] = outward('f'), cx = px + nx * .35, cz = pz + nz * .35, cy = hOf(tall) + .1, L = 3.4, rot = nx ? Math.PI / 2 : 0;
    geo('beam', new THREE.CylinderGeometry(.12, .12, .5, 8).rotateX(Math.PI / 2).rotateY(rot), new THREE.Matrix4().makeTranslation(cx, cy, cz));
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .35, m = new THREE.Matrix4().makeRotationY(rot).multiply(new THREE.Matrix4().makeRotationZ(a));
      const stock = new THREE.BoxGeometry(.1, L, .08).translate(0, L / 2 + .1, 0).applyMatrix4(m); geo('beam', stock, new THREE.Matrix4().makeTranslation(cx, cy, cz));
      const sail = new THREE.BoxGeometry(.62, L * .8, .02).translate(.36, L * .55 + .1, -.05).applyMatrix4(m); geo('cloth_linen', sail, new THREE.Matrix4().makeTranslation(cx, cy, cz)); }
    const [bx, bz] = T(w / 2, d); cube('beam', bx - .06, 0, bz - .06, bx + .06, hOf(1) * .9, bz + .06, 32, 32, ''); }
  return { entries, h0, top: tall };
}

// a market cross: stepped base, shaft and head (no inside)
export function buildCross(b, X) {
  const { cube, geo, THREE, solids } = X, cx = b.x0 + b.W / 2, cz = b.y0 + b.H / 2;
  for (let k = 0; k < 3; k++) { const r = 1 - k * .25; cube('ashlar', cx - r, k * .18, cz - r, cx + r, (k + 1) * .18, cz + r, 64, 64, 'b'); }
  cube('ashlar', cx - .16, .54, cz - .16, cx + .16, 3.0, cz + .16, 64, 64, 'b'); cube('stone', cx - .26, 3.0, cz - .26, cx + .26, 3.18, cz + .26, 32, 32, '');
  cube('ashlar', cx - .07, 3.18, cz - .07, cx + .07, 3.75, cz + .07, 64, 64, ''); cube('ashlar', cx - .25, 3.42, cz - .07, cx + .25, 3.54, cz + .07, 64, 64, '');
  solids.push([cx - 1, cz - 1, cx + 1, cz + 1]);
}

// a tenter ground: rows of tenter frames (two rails on posts, the cloth hooked between them to dry stretched to size), gaps left
// between the frames and between the rows so the ground stays walkable; the tenterer's open drying shed on the building's own cells
export function buildTenter(b, X, cells) {
  const { cube, solids, snow } = X, has = new Set(cells.map(([x, y]) => x + ',' + y));
  const x0 = b.x0, z0 = b.y0, x1 = b.x0 + b.W, z1 = b.y0 + b.H;
  for (const [px, pz] of [[x0 + .1, z0 + .1], [x1 - .1, z0 + .1], [x0 + .1, z1 - .1], [x1 - .1, z1 - .1]]) cube('beam', px - .07, 0, pz - .07, px + .07, 1.6, pz + .07, 32, 32, '');
  cube(snow ? 'roof_snow' : 'roof_thatch', x0 - .15, 1.6, z0 - .15, x1 + .15, 1.78, z1 + .15, 64, 64, ''); cube('wood', x0 + .15, .9, z0 + .1, x1 - .15, 1.0, z0 + .2, 32, 32, '');
  solids.push([x0, z0, x1, z1]);
  if (!cells.length) return;
  const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]), mx = Math.min(...xs), my = Math.min(...ys), MX = Math.max(...xs), MY = Math.max(...ys);
  const along = MX - mx >= MY - my, CL = ['cloth_linen', 'cloth_blue', 'cloth_red', 'cloth_linen', 'cloth_green', 'cloth_ochre'];
  const near = (x, y) => x >= x0 - 1 && x <= x1 && y >= z0 - 1 && y <= z1;   // keep the shed's sides clear
  const lines = along ? [...Array(MY - my + 1).keys()].map((k) => my + k).filter((y) => (y - my) % 2 === 1) : [...Array(MX - mx + 1).keys()].map((k) => mx + k).filter((x) => (x - mx) % 2 === 1);
  let ci = (b.id * 7) % CL.length;
  for (const L of lines) { let run = [];
    const flush = () => { if (run.length >= 2) { const a = run[0], e = run[run.length - 1] + 1, c = CL[ci++ % CL.length];
        if (along) { const z = L + .5; for (let t = a; t <= e; t++) cube('beam', t - .05, 0, z - .05, t + .05, 1.35, z + .05, 32, 32, ''); cube('beam', a, 1.25, z - .04, e, 1.35, z + .04, 32, 32, ''); cube('beam', a, .3, z - .04, e, .38, z + .04, 32, 32, ''); cube(c, a + .05, .38, z - .015, e - .05, 1.25, z + .015, 32, 32, ''); solids.push([a, z - .08, e, z + .08]); }
        else { const x = L + .5; for (let t = a; t <= e; t++) cube('beam', x - .05, 0, t - .05, x + .05, 1.35, t + .05, 32, 32, ''); cube('beam', x - .04, 1.25, a, x + .04, 1.35, e, 32, 32, ''); cube('beam', x - .04, .3, a, x + .04, .38, e, 32, 32, ''); cube(c, x - .015, .38, a + .05, x + .015, 1.25, e - .05, 32, 32, ''); solids.push([x - .08, a, x + .08, e]); } }
      run = []; };
    const lo = along ? mx : my, hi = along ? MX : MY;
    for (let t = lo; t <= hi + 1; t++) { const x = along ? t : L, y = along ? L : t, ok = t <= hi && has.has(x + ',' + y) && !near(x, y) && (t - lo) % 5 !== 4;   // a gap every fifth cell to walk through
      if (ok) run.push(t); else flush(); } }
}
