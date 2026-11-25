# Common Stuff — delivery notes

## Direction and material treatment

These are small-headed, upright working adults, with quiet faces and a dark lower mass. The intended relationship is to the supplied town's plaster, oak, slate and iron: cloth has broad neighbouring value planes, hair has narrow locks, leather has bands and worn seams, and iron is a small dark accent. There is no added uniform outline, bloom, rim light, gold or ornament.

The three outfits are a sleeved linen shirt beneath a wool waistcoat, a leather jerkin beneath an open-front wool cloak, and a plain long wool robe with a cloth sash. The ranger's open cloak preserves the trouser stride. Long hair is cut away around the face and neck; its back view has a larger mass of locks. The braid is a narrow alternating chain, including in the back view.

## Files and rebuild

The delivery contains 24 RGBA layer sheets, seven PNG composites, one animated GIF, the exact ramps, and `validation.json`. All layer sheets are 288×256, containing 48×64 cells in down / left / right / up rows. Every listed non-body layer has both `@man` and `@woman` variants, including the beard. There are no ambiguous unsuffixed duplicates.

From the project folder:

```sh
python3 tools/build.py
```

This rebuilds all delivered PNGs, the GIF, ramps and validation report from the editable source data. It does not regenerate or overwrite these notes. Python and Pillow are required. A clean repeated build produced byte-identical results for all 32 delivered images; hashes are retained in `scratch/rebuild-hashes.json`.

- `src/body/`: native colour grids and matching anatomical label grids, including all six down and left frames and one up frame per body.
- `src/head/`: one local grid per attachment and direction. A local grid's origin is six pixels left and four pixels above the head anchor.
- `src/held/`: grip-relative staff grids, including two skin-coloured grip pixels.
- `src/rig.json`: explicit positions, bob, grip, cloth trail and hair sway.
- `src/patch/`: editable `x y character` garment corrections for folds, hems and worn edges.
- `src/legend.json`, `src/label-legend.json`, `src/outfits.json`, `src/characters.json`, `src/ramps.json`: palette, labels and composition inputs.
- `tools/grid.py`: lossless text-grid ↔ PNG conversion. `rig.py`, `author.py` and `finish_source.py` retain the initial native construction operations. Those authoring helpers can overwrite source edits; normal rebuilds only require `build.py`.
- `scratch/labels/`: 390 anatomical mask PNGs emitted from the label grids. `scratch/review/` contains sheet and label inspection boards. `scratch/ref/` contains the reference board, prompt and grey underlays.

## Ramps and layer compatibility

`out/ramps.json` matches the BRIEF's JSON values exactly. The source ramps have six skin shades, five hair shades, two eye shades, and five shades each for cloth A and cloth B. Targets include six skin tones, eight hair colours, six eye colours and four colourways for each cloth ramp. Fixed linen, leather, oak, iron, horn and seam colours are unchanged.

Recolouring uses exact source-colour lookup before display. Source colours remain restricted to their intended layer regions. Skin in the beard is the exposed lower lip; skin in the held layer is the grip. Black hair is neutral-warm, with R ≥ B at every shade.

The body's standing head begins at row 6 for the man and row 9 for the woman: standing body heights are 58 and 55 pixels. The shared 7×8 head silhouette excludes ear and profile-nose protrusions. The woman's jaw uses different shading inside the shared mask. Walking bob changes the body's height by one pixel in either direction; the specified heights are standing measurements, not an assertion that a bobbing head stays on a fixed row.

Outfits need different variants because shoulders, torso, hips and arm lengths differ. Head attachments share their source pixels exactly and differ only by the body's three-pixel vertical placement; the same rig-driven lower-lock sway applies to both. Staff placement follows the hand grip.

Right-facing frames are mirrored left-facing frames, as allowed by the brief. This also mirrors the lateral light bias, so the right view is an approximation to the upper-left lighting rule. The up row repeats its standing frame.

## Composition and review

The stack is body → feature → outfit → beard → hair → hood → staff. `lineup.png` includes all six specified characters at native size and 4×. `swatch.png` shows character 2 across all skin tones and character 1 across all hair colours, with native-size companions. `turn.png` and `walk.png` show enlarged direction and motion studies. `walk.gif` contains six timed frames, with 140 ms contacts and 110 ms intermediate phases.

The normal world composite uses nearest-neighbour 2.3×; the alternate uses exact 2×. The close view uses exact 4×. All feet are placed on open paving. Character 1 occupies the left-hand building shadow and receives a cool attenuation only in the composite; the other five are in sunlight. Soft cool elliptical contact shadows are compositing effects, never layer pixels.

The source world images were inspected in full and through enlarged material crops. All 24 layer sheets were inspected with native and 4× views. Anatomical masks were inspected together in colour-coded partition boards. Composites were inspected, including `in-world.png` at its full 1280×760 size. The GIF and its decoded frames were inspected; this was not an in-engine animation test.

Visual corrections made during review: removed the beard-like centre of long hair, opened the ranger cloak around the legs, uncovered the authored hands, removed a hanging profile hair strand, repaired a detached labourer back hem, narrowed the raised front-view shoe, and replaced the braid's initial loose-hair back view with a braid.

## Automated results

`out/validation.json` records the detailed results:

- 24 of 24 sheets have the required dimensions.
- Off-palette pixels: **0**. Partial-alpha layer pixels: **0**. Wrong source-region colours: **0**.
- Isolated opaque pixels without any eight-connected neighbour: **0**.
- Both bodies retain ground contact on row 63 in every frame.
- 432 hair × outfit × body × direction × frame compositions were exercised. No disconnected hair masks or uncovered sleeve/foot label pixels were found.
- All tested head-attached man/woman pairs match after a three-pixel translation.
- Left-view near-minus-far foot x: `[-16, -12, 0, 16, 12, 0]`, giving two crossings per cycle and 16-pixel contact separation.
- Near-hand x travel: 10 pixels. Bob: `[0, 1, -1, 0, 1, -1]`.
- Down-view foot heights alternate between rows 61 and 63, with passing knees and a narrower raised shoe.
- Black-hair channel check passes. The ramps match the brief exactly. Rebuild reproducibility passes.

These checks establish file validity, specific mask coverage and measured motion. They do not prove that every combination looks convincing, or that the aesthetic target is fully met.

## Honest weaknesses and deviations

The result is a style sample, not a production-ready character library. At normal world zoom, faces remain tiny: the eye slits, nose and lower lip are distinguishable when enlarged, but the darkest bearded face requires effort at native size. Facial individuality is limited by the shared seven-pixel-wide head. The man and woman differ mostly in build and height; their shared face construction is deliberately similar.

The profile stride is much stronger than the front stride. Front movement remains restrained and can read as stepping in place. Sleeves, shoulders and cloth folds are somewhat rigid. The two rangers have related silhouettes, and the male/female labourer shapes are still close. Long hair has a rather straight curtain shape. Leather planes and wool planes separate through colour and construction, but their material distinction is weaker in greyscale than intended.

The sprites remain crisper and more planar than the 3D scene's soft lighting and edge blur, particularly in the close composite. Exact 2× gives cleaner pixel widths than 2.3×. The ellipse is a contact-shadow approximation; it does not reproduce a directional body-shaped cast shadow. The staff rises and falls with the hand rather than being separately planted on the pavement.

The reference board was made with the built-in image tool; the exact prompt is in `scratch/ref/prompt.txt`. It was keyed and reduced to grey construction guides. No reference pixels were quantised or pasted into delivered layers. Native body construction began with explicit polygon/line rules and was saved as editable grids; garment finishing is stored as pixel patches. This was not a fully freehand grid-drawing process. The six walk phases were authored together, and the first-three-frame checkpoint was generated during review rather than completed before the second half was built.

There were two exceptions to the requested folder boundary imposed by the tool workflow: the installed image-generation skill instructions were read outside this folder, and the image tool automatically saved its original reference in its own default storage outside this folder. That external image file was not opened or copied by path; the returned image data was saved directly into `scratch/ref/board.png`. No other Downloads folders, repositories, existing sprites or external artwork were searched or opened. All project source, editable data, review intermediates and deliverables are inside this folder.
