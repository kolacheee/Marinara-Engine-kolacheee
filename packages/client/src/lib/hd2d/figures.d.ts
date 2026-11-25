export declare const FIG: Readonly<{ w: 32; h: 48; walk: 4; dirs: 4 }>;
export declare const FIG_DIRS: readonly ["down", "left", "right", "up"];
export type FigureDir = (typeof FIG_DIRS)[number];
export declare const SKIN_SOURCE: string[];
export declare const CLOTH_SOURCE: string[];
export declare const HAIR_SOURCE: string[];
export declare const SKIN_RAMPS: string[][];
export declare const CLOTH_RAMPS: string[][];
export declare const HAIR_RAMPS: Record<string, string[]>;
export interface FigureLayer {
  layer: string;
  tint?: number | string;
}
type Drawable = CanvasImageSource;
type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
export declare function tintMap(layer: string, tint: number | string | undefined | null): Map<number, number[]> | null;
export declare function recolour(data: Uint8ClampedArray, map: Map<number, number[]> | null): Uint8ClampedArray;
export declare function figureSheet(layers: FigureLayer[], image: (layer: string) => Drawable | null | undefined): AnyCanvas;
export declare function figureAtlas(sheets: Drawable[]): {
  canvas: AnyCanvas;
  cols: number;
  rows: number;
  uv: (i: number, dir: FigureDir | number, frame: number) => [number, number, number, number];
};
export declare function figureDir(dx: number, dy: number): FigureDir;
