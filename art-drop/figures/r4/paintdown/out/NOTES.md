# Wren and Hadrik — paint-down delivery

## Files and playback

- `sheet-wren.png`, `sheet-hadrik.png`: 288 × 256 RGBA, 48 × 64 cells. Rows are down, left, right, up. Columns 0–5 contain the walk cycle. Down and left have six distinct poses; right has the mirrored left cycle; up repeats the rear standing pose six times.
- `idle-wren.png`, `idle-hadrik.png`: four distinct down-facing breathing poses, 192 × 64 RGBA.
- `lineup.png`: both standing characters, front and left profile, at exact 1× and 4× nearest-neighbor sizes on #7a7a7a.
- `walk.gif`: both characters walking down for six frames, then left for six frames, 110 ms per frame, looping. Preview is 4×.
- `idle.gif`: both characters breathing, 240 ms per frame, looping. Preview is 4×.
- `in-world.png`, `in-world-close.png`: supplied market backgrounds with both characters on unobstructed flagstones, at 2.3× and 3.8× nearest-neighbor respectively. Separate blurred dark contact shadows are composited beneath their feet. Sprite pixels themselves have no added blur, bloom or scene lighting.
- `validation.json`: machine-checked dimensions, color counts, heights, frame uniqueness, alpha, connectivity and GIF timings.

## Method and tools

The paint-down workflow starts with large original front/left/back character turnarounds. The built-in image generation tool produced the turnaround designs; the exact prompts and source PNGs are preserved in `../scratch/`. Wren's first design was revised because its proportions were too tall and slender. No game assets, sprite rips, external character references, other lanes or earlier-round art were used.

Python 3 and Pillow perform magenta-key removal, individual-view cropping, area reduction, explicit palette mapping without dithering, and all native-pixel editing. No additional service or paid asset source was used. Aseprite was available but was not needed.

The palette is deliberately selected by material rather than extracted automatically: green/cool teal cloth, copper/auburn hair, warm skin and leather for Wren; deep warm brown skin, navy-black hair and beard, slate shirt, brown apron and restrained steel highlights for Hadrik. The final walk sheets use 27 opaque colors for Wren and 28 for Hadrik, plus transparency. There is no pure black and alpha is exclusively 0 or 255.

The native cleanup includes explicit pixel-coordinate redraws of eyes, brows, noses, mouths, hair bands, cloak folds, clasps, belt buckles, bracers, boot edges, quiver fletchings and hammer planes. Silhouette pixels receive material-specific dark hues; disconnected fragments and isolated reduction flecks are removed. Wren receives a final proportion correction to a roughly 17-pixel crown-to-chin head in a 56-pixel standing figure. Hadrik stands 57 pixels high. Animated silhouettes range from 56 to 58 pixels; every frame retains a planted foot on row 63.

Walking uses separately extracted limb clusters. Legs alternate contact and swing, with different foot lifts and horizontal movement; side views show a shaded far leg and a separate near leg. The torso rises one pixel during passing poses, hands swing in opposition, and cloak/apron and hair respond later in the cycle. Moving seams are filled at native resolution so stretching does not create detached feet. Idle poses lift shoulders by one pixel and subtly move cloth and hair/beard details while feet remain fixed.

The native edits, palette and animation construction are reproducible:

```sh
python scratch/build.py
python scratch/finish.py
python scratch/validate.py
```

Run these commands from the paintdown directory. They use the saved turnaround PNGs; they do not regenerate designs. `scratch/palettes.json` records the selected ramps. `scratch/*-grid.png`, `scratch/clean-review.png`, `scratch/sheet-final-review.png` and `scratch/idle-final-review.png` retain the inspection views.

## Direction and equipment conventions

Right is a literal horizontal mirror of left. Wren's bow/quiver and ponytail presentation therefore switch sides, as does Hadrik's belt hammer. This is the permitted sprite convention, not anatomically persistent equipment placement. Mirroring also mirrors the small baked upper-left highlights. The rear pose keeps the original rear equipment arrangement. There is no rear walk cycle; the specification permits the repeated standing pose.

Coordinates are top-left based. Cell anchor is nominally (24, 63), with transparent margin above and on either side. At 32 texels/metre, standing stature corresponds to approximately 1.75 m for Wren and 1.78 m for Hadrik. Do not filter these textures when importing them.

## Review and remaining limitations

Both full-size market composites and enlarged native-frame contact sheets were inspected. Revisions addressed Wren's proportions, facial marks lost in reduction, a detached moving cloak edge, foot-contact gaps and an initially duplicated Hadrik idle pose. The final shapes are crisp, have layered material shading and read as a ranger and a smith against the textured buildings.

The remaining differences from the named commercial benchmark are principally animation nuance and perspective: these are short six-pose cluster animations, and the side-view knee/hip rotation and torso twist are simpler than a fully bespoke studio animation pass. The front and profile designs are fairly orthographic rather than strongly foreshortened for the town camera. Wren's expression reads younger than the intended thirties at native size; Hadrik's facial expression is necessarily subtle beneath the dark beard at normal zoom. The smallest leather fastenings merge at play zoom. A soft contact shadow establishes placement but does not substitute for scene-driven lighting, occlusion or depth blur.

Technical validation passed for all 56 sprite/idle cells: dimensions, binary alpha, palette limits, required height, foot baseline, no disconnected silhouette components, and the required number of unique down/left/idle poses. GIF frame counts and the 110 ms walk timing also passed. This validates the delivery contract; it is not a substitute for the owner's art-direction judgment.
