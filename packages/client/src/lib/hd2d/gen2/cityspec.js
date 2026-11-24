// @ts-nocheck
import { CITY_LATIN } from './city-latin.js';
// the skeleton's spec from the page's: the year (the Dissolution, the exchange) and any status flags the world sets ('bishop,port,university=0')
export const citySpec = (s) => ({ grammar: CITY_LATIN, seed: s.seed, pop: s.cpop, site: s.csite || 'river', region: s.region || 'en', year: s.cyear || 1500,
  flags: Object.fromEntries(String(s.cflags || '').split(',').filter(Boolean).map((t) => { const [k, v] = t.split('='); return [k.trim(), v === undefined ? true : v !== '0']; })) });
