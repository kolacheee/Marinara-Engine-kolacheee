// @ts-nocheck
// every stand-alone building planner at its ideal shell, by name (test page, gallery, towngen later)
import { planParish } from './church.js';
import { planCourtInn, planFriary, planHospital, planSchool } from './precinct.js';
import { planGuild, planKeep } from './civic.js';
import { planGate, planMill, planSmelter } from './works.js';
import * as T from './trades.js';
import * as T2 from './trades2.js';
import * as GR from './great.js';
// a dissolved house left unroofed (England after 1538): the same plan, drawn as broken walls and not entered
const ruined = (pl, o) => { if (o && o.ruin) pl.ruin = true; return pl; };
export const PLANNERS = { parish: (o) => planParish(o), courtinn: (o) => planCourtInn(o), friary: (o) => ruined(planFriary(o), o), hospital: planHospital, school: planSchool,
  guildhall: (o) => planGuild({}, { ...o, kind: 'guild' }), townhall: (o) => planGuild({}, { ...o, kind: 'town' }), keep: planKeep,
  gate: (o) => planGate({ gw: 2.6 }, o), mill: (o) => planMill({ x0: 0, y0: 5, y1: 8, wz: 0 }, o), smelter: (o) => planSmelter({}, o),
  barn: T.planBarn, bakehouse: T.planBakehouse, brewhouse: T.planBrewhouse, tannery: T.planTannery, dyeworks: T.planDyeworks, bathhouse: T.planBathhouse,
  markethouse: T.planMarketHouse, walltower: T.planWallTower, cranehouse: T.planCraneHouse, windinghouse: T.planWindingHouse,
  shambles: T2.planShambles, almshouse: T2.planAlmshouse, weighhouse: T2.planWeighHouse, clothhall: T2.planClothHall,
  fullingmill: (o) => planMill({ x0: 0, y0: 5, y1: 8, wz: 0 }, { ...o, fulling: 1 }), castlehall: T2.planCastleHall, towerhouse: (o) => planKeep({ ...o, W: 5, D: 5 }),
  cathedral: GR.planCathedral, abbey: (o) => ruined(GR.planAbbey(o), o), bourse: GR.planBourse, mansion: (o) => planCourtInn({ ...o, mansion: 1 }), chapel: GR.planChapel, bridgechapel: (o) => GR.planChapel({ ...o, bridge: 1 }), warehouse: GR.planWarehouse, mint: GR.planMint, ropewalk: GR.planRopewalk, windmill: GR.planWindmill };
