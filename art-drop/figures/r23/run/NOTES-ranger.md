# Sere Venn — Round 23 face and finish redo

## Replaced outputs

All 15 views have new image-tool head redraws. The body, costume, equipment and pose of each established view are retained.

- `big/ranger-<view>.png`: 15 selected full-figure image-tool originals, 1024 × 1536, on magenta.
- `sprites/ranger-<view>.png`: 15 transparent 96 × 128 sprites: front, side, back, walkside0–3, walkfront0–3 and walkback0–3.
- `ranger-sheet.png`: exact 3× sprites on #4a4642, standing front/side/back followed by the three walk rows.
- `ranger-walkside.gif`, `ranger-walkfront.gif`, `ranger-walkback.gif`: 3×, four distinct frames each, 160 ms per frame, looping.
- `ranger-face.png`: front head at exact 6×, rows 33–60 inclusive.
- `ranger-vs-sheet.png`: Sere and the three reference fronts at exact 3×.
- `ranger-heads-vs-sheet.png`: **every one of the 15 heads at exact 6×**, each beside Wren, Hadrik and Noble. All comparison crops use rows 33–63 inclusive. Front, side and rear groups each contain the standing view and four walk frames.

## Redraw and review

Read STYLE-RULES.md, including the overriding Face and finish rules, and all of CHARACTER.md. The latter has no additional head redesign for this character. The older dot-eye/no-glint instructions were superseded.

Used the built-in image tool for 18 requests: one redraw for every view, followed by extra redraws of the standing front and walkfront0/1 to enlarge eye catches and bring the front heads into closer agreement. The right-facing standing side was redrawn first. Every request attached `style-ref/STYLE-SHEET.png` with the exact required STYLE-ONLY instruction. Other references were only the existing Sere views and new Sere redraws in this folder. No other character references were used.

The new heads have larger eye clusters with restrained light catches, separate heavy brows, the pale anatomical-right brow notch, a blunt nose plane, a short mouth and a square jaw. The hair is grouped into three broad swept-back charcoal locks. Rear heads show hair, ears and nape only, with no face. Lighting remains upper-left in screen space.

Inspected every new source and compared every reduced head at 6× directly beside the three sheet heads. The first standing-front reduction lost a catchlight; its additional image-tool redraw enlarged both catches. The first walkfront0/1 redraws retained smaller eyes and a longer brow stripe; the additional passes used the final standing front for consistency. Also inspected the complete sheet, the 3× full-figure comparison and the final face crop.

## Reduction, preservation and despeckle

The current reducer is `../scratch/process_faces.py`. It keys magenta, uses BOX area reduction, palette-snaps with skin/material masks, and preserves existing source eye/brow ink and pale facial marks through separately area-reduced feature masks. It does not draw new facial marks. Skin source-role centres were adjusted to retain the generated nose highlight; output skin colours remain the specified deep ramp.

The final head and neck occupy the upper portion of the established frame. Rows 59–127 are copied from the pre-redo sprite before cleanup, so costume details, props, limbs and poses are preserved pixel for pixel. Only the requested skin despeckle can alter those body rows. The full-sized files remain actual image-tool originals; incidental source differences below the head are not propagated to the sprite bodies.

After palette snapping, one simultaneous despeckle pass runs on skin and hair only. A pixel is eligible only when it differs from all four direct neighbours. Its replacement is the most common colour in its 3×3 neighbourhood, considering only the same material mask. Eyes, brows, mouth regions and material/outer outlines are protected. Ties preserve the current colour when possible; otherwise they resolve deterministically. No clothing smoothing or hand-painted face correction is applied.

## Verified export properties

- All 15 sources and sprites differ from the prior delivery.
- Every sprite is 96 × 128 RGBA with binary alpha, crown at row 33 and lowest sole at row 124.
- The combined opaque palette contains exactly 24 colours: charcoal, leather, linen, moss, steel and deep skin. No extra ramp, pure black or pure white was introduced.
- Every visible eye region retains both dark eye pixels and a skin-light catch. Faces use broad shadow/body/light planes with the darker skin edge reserved for contours and overlaps.
- Body pixels below row 58 are unchanged except for skin-only despeckling; costume, equipment and pose pixels are unchanged.
- Each GIF has four distinct frames at 160 ms. Decoded GIF pixels match the corresponding finished sprites at exact nearest-neighbour 3× on #4a4642.

Detailed measurements, per-view cleanup counts and eye-region checks are in `../scratch/face-redo/final-checks.json`. The full prompt set is in `../scratch/face-redo/prompts.json`. Pre-redo sprites and originals, superseded front redraws, before-cleanup sprites and the three separate 6× audit pages are retained under `../scratch/face-redo/`.

To rebuild from the selected originals:

```sh
PYTHONWARNINGS=ignore python scratch/process_faces.py > scratch/face-redo/reduction-final.json
PYTHONWARNINGS=ignore python scratch/assemble.py
python scratch/face-redo/audit.py
PYTHONWARNINGS=ignore python scratch/face-redo/verify.py
```

## Honest limitations

- The deep-skin light tone is deliberately subdued. Eye catches and the brow notch have less contrast than highlights on the fair-skinned reference faces. The notch shape and eye widths still vary slightly between independently drawn frames.
- The compact face conveys a quiet square-jawed adult, but an exact age of 47 and femininity remain understated at this scale. No fine wrinkles were added because they would conflict with the smooth-plane requirement.
- Preserving the established body also preserves its remaining trim speckles, some thick overlaps, small-tool ambiguity and slight walk-cycle registration/foot-slide issues. The new skin/hair cleanup deliberately leaves cloth and equipment alone.
- Image-tool originals contain more colours and small source-grid variations; the strict palette and alpha guarantees apply to the exported sprites. Semantic masks at material borders remain approximations.
- Exact artistic equivalence to the reference sheet is a visual judgment, not an automated guarantee. The delivered 6× comparisons expose all 15 heads for review; the numeric checks establish export and preservation properties.

All local reads, writes, processing and saved artifacts for this redo stayed in this folder apart from reading the installed image-tool skill. The image service reports automatic cache copies outside the folder; those copies were not opened or used. Image response data was saved directly into this folder.
