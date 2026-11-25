# Round 3 brief: refine "Common Stuff" under the town's sun

You are continuing an existing figure set, not starting a new one. Your folder is a copy of the round-2 "material" lane (its `src/`, `tools/`, `out/` and `BRIEF.md`). The owner judged it the only set that reads as adults in a real place. Keep its proportions, head size, palette and ramps (`out/ramps.json` must stay valid), layer list, sheet format (288x256, 48x64 cells, rows down/left/right/up), and its rebuild (`python3 tools/build.py`).

You may also look at `ref/lit-lineup.png` and `ref/lit-in-world-close.png`. They come from another lane, and they are a reference for lighting only. Do not copy their anatomy, faces or outfits: their gaunt, skull-like faces and skeletal limbs were rejected.

## What to change

1. **Sunlight.** The town's sun comes from the upper left. Give every layer a consistent lit side (upper and left planes) and a shadow side (right and under planes), with two or three value steps across a form, like `ref/lit-*`. Cloth folds should catch the light. Use only existing ramp indices: shading means choosing darker or lighter ramp shades, never new colours. The right-facing row may no longer be a plain mirror if mirroring would put the light on the wrong side. Re-shade it so the light stays upper left.
2. **Poses.** The standing frame is a stiff mannequin. Give it weight: a slight contrapposto (hips and shoulders counter-tilted by one pixel), arms not glued to the sides, and hands slightly forward. The walk needs a clear stride in the down row (knees lift, the body bobs, arms swing opposite the legs) and a readable side stride. Keep bone lengths constant.
3. **The pale robe.** The elder's undyed robe (the linen/oak light shades) merges with the pale flagstones. Darken its shadow side and hem, and give it a darker belt and edge, so its silhouette separates from a light floor without an outline.
4. **The horned face.** The horned figure's face is muddled: the horns, hair and face blur together. Separate them, with horns rooted at the temples, a clear brow, two eyes, a nose and a mouth, on every skin tone.
5. **Faces at play zoom.** Every face must show eyes and a brow line at 1x in `in-world.png`. That includes the very dark skin with black hair and beard.

## Deliver (replace `out/`)

Same files as round 2: the layer sheets, `lineup.png`, `turn.png`, `walk.png`, `walk.gif`, `swatch.png`, `in-world.png` and `in-world-close.png` (same world shots and placements as round 2, in `ref/market-*.png`), `ramps.json`, `validation.json`. Also add `before-after.png`: the round-2 lineup above the new one, at 4x.

In `NOTES.md`, write an honest list of what still looks weak. Judge `in-world-close.png` at full size before you finish, and redo anything that looks stiff, muddy or skeletal.

## Rules

Work only inside this folder. Do not use other lanes' files except the two `ref/lit-*` images. Do not use generated concept images as pixel sources. All pixels are authored or produced by your own tools.
