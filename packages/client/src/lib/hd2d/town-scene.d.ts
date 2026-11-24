// Types for the HD-2D town scene (town-scene.js, plain JavaScript ported from the prototype).
export interface Hd2dDoor {
  /** Town-wide key: "b<id>" a planned building, "p<plot>" a house, "gate", "other". */
  key: string;
  label: string;
  inn: boolean;
  shop: boolean;
  ward: number;
  street: string;
  tcell: number;
}
export interface Hd2dWhere {
  where: string;
  quarter: string | null;
  trade: string | null;
}
export interface Hd2dTownOptions {
  spec: Record<string, unknown>;
  hour?: number;
  season?: string;
  hq?: boolean;
  /** The town map to open on (-1: the town's own start) and the cell there. */
  tcell?: number;
  arriveAt?: [number, number] | null;
  /** false: the hour is set by the Engine (setHour), not run by the scene. */
  clock?: boolean;
  focus?: boolean;
  busyText?: string;
  debug?: boolean;
  onEnter?: (door: Hd2dDoor) => void;
  onExit?: () => void;
  onWhere?: (where: Hd2dWhere) => void;
  onReady?: () => void;
  onSave?: (at: { tcell: number; hour: number }) => void;
}
export interface Hd2dTownApi {
  setHour(hour: number): void;
  setSeason(season: string): void;
  setHq(on: boolean): void;
  pause(on: boolean): void;
  focus(): void;
  takeWalked(): number;
  position(): { tcell: number; x: number; y: number } | null;
  readonly inside: unknown;
  dispose(): void;
}
export function mountHd2dTown(host: HTMLElement, opts: Hd2dTownOptions): Promise<Hd2dTownApi>;
