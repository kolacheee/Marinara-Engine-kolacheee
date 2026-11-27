# Tamra Esh — innkeeper

Delivered 15 full-body image-tool originals in `big/`, their 15 transparent sprites in `sprites/`, the four-row 3× sheet, three four-frame walking GIFs, and the front face crop at 6×. The sheet uses stand front/side/back, walk-side 0–3, walk-front 0–3, then walk-back 0–3. The unused fourth standing cell is background.

## Production and checks

Every figure and every figure revision was drawn by the built-in image tool. The right-facing side was drawn first; subsequent views used this run's side drawing as a reference. Some corrections also referenced this run's corresponding view. No outside character pictures, existing sprites, or repositories were consulted.

Python performed magenta keying, figure cropping, BOX reduction, region-based material/skin masking, palette snapping, a one-pixel inward exterior outline pass, sheet/crop/GIF assembly, and checks. It did not draw, replace, or paste facial features or limbs. Working files, rejected drawings, prompts, processing code, and validation records are in `scratch/`. Final originals were saved directly from the tool's returned image bytes.

Verified:

- Exactly 15 originals and 15 RGBA sprites, each sprite 96×128.
- Every sprite occupies rows 33–124 inclusive; padding above and below is transparent. Complete equipped silhouettes are horizontally centred within half a pixel.
- Binary alpha only. The union contains 23 colours, all from linen, charcoal, leather, moss, steel, and tan. No added ramp, pure black, pure white, or magenta remains in opaque sprite pixels.
- Sheet: 1152×1536, 3× nearest-neighbour enlargement on #4a4642.
- Face crop: columns 28–67, rows 33–60, enlarged 6× to 240×168.
- Each GIF: 288×384, four frames, 160 ms per frame, looping. All decoded GIF pixels exactly match the corresponding sprites composited on #4a4642.

I inspected every generated drawing as it returned, the reduced figures in the sheet, all ten face-bearing crops, the final sheet and front face crop at their saved sizes, and all decoded GIF frames in strips. The GIF review was frame-based, not real-time playback.

## Redraws and face pass

The initial side drawing was rejected for elongated proportions and a partly frontal body. Its replacement established the roughly four-head proportions and strict profile. Both side passing poses were redrawn with overlapping legs and low lifted feet. The back contact frame `walkback2` was redrawn because its folio resembled a pouch.

All ten face-bearing views received image-tool face corrections or, for `walkside3`, a replacement pose drawing explicitly incorporating stronger eyes. The first reduced eyes were too faint. `walkfront2` received two further smaller-eye attempts after its first face redraw; those reduced poorly, so the stronger first face redraw was retained. Rejected attempts remain in `scratch/`. No face was painted in code.

## Honest weaknesses and rules not fully met

- **Exact eye geometry is not fully compliant.** The standing front has dark eye cores, but neighbouring lid/shadow pixels broaden the apparent marks. Several walking faces have two-pixel marks, and `walkfront2` retains roughly 2×2 dark eye clusters. Skin is not cleanly present on both immediate sides of every eye cluster. Profile views show the one anatomically visible eye; they do not show the occluded far eye despite the literal “both eyes” wording in the face-pass rule.
- The upper-lip shadow is heavier and wider than ideal and can read as a small moustache. Mouth/shadow clusters exceed the quiet 1–2-pixel target in several views. Brows are not equally arched in all frames.
- Facial width, brows, wrap folds, moss inset, waist and trouser folds vary between independently drawn frames. This will cause some visual flicker. The front/back silhouettes are more convincing than the side passing silhouettes, which become rather narrow for a thick-set woman.
- Contact poses remain somewhat stylised. Exact near/far leg identity is not equally clear in both side contacts, and the front/back foot offsets read more clearly than heel-to-toe mechanics. The loops are usable previews, not polished production animation.
- Some hands are larger than the requested 3–5-pixel mitten mass; source drawings contain more finger divisions than requested. Grip and folio thickness vary. Tiny steel corner fittings are not equally readable in every reduction.
- Some folds and contours retain isolated pixels and uneven clusters. The outline pass improves continuity but does not achieve perfect local-material boundaries or consistent upper-left shading everywhere. Skin/material masks use observed anatomical regions and colour separation; mixed boundary pixels are not a guarantee of perfect semantic separation.
- The flat-topped wrap is recognisable but somewhat bulky. The fitted waist is more pronounced than the specified thick trunk in several views; age and long forearms are only approximate.
- **Folder-only exception:** a required image-generation skill instruction file was read outside this folder. The image tool also automatically saved its own originals outside the workspace. Those external image files were not opened or copied; the returned image data was saved here. No external artwork was read. This does not fully satisfy the requested prohibition on all outside-folder access.

These are remaining limitations, not claims of exact style compliance. The technical export checks passed; the stricter visual rules above remain imperfect.
