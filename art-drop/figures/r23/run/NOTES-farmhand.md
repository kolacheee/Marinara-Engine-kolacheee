# Pell Arven — Round 23 production notes

## Delivered

- 15 image-tool originals in `big/`, one full-body figure per image on magenta.
- 15 transparent 96 × 128 sprites in `sprites/`, with the requested view names.
- `farmhand-sheet.png`: 1152 × 1536, nearest-neighbour 3× on #4A4642. Rows are standing front/side/back, side walk, front walk, back walk. The fourth standing cell is empty.
- Three 288 × 384 walk GIFs, four frames each, 160 ms per frame, looping on #4A4642.
- `farmhand-face.png`: front crop of logical rows 33–60 inclusive, enlarged 6×.
- `farmhand-vs-sheet.png`: Pell, Wren, Hadrik, Noble, left to right, all at 3×.

## Drawing and reduction

The side was drawn first. Every later figure request included that run's side master and the style sheet. The sheet was explicitly designated style-only in every request. Only the supplied style references and images of Pell from this run were used as image references. Garment richness comes from layered collar and cuffs, wrap binding, the diagonal overlayer, pocket lip, breeches gathers and boot construction.

All figure drawing and redraws used the built-in image tool. Python performed magenta keying, BOX/area reduction, source-space skin masking, palette snapping, compositing, GIF export and checks. It did not draw anatomy, eyes, mouths, poses or garments. The front views use a small global BOX sampling-phase adjustment to preserve the tool-drawn eye dots; this does not replace or paint facial pixels. No extra outline pass was applied.

The final sprites use exactly 24 RGB colours across the set: the four tones each of charcoal, leather, moss, auburn, linen and fair skin. No additional ramp was introduced. Skin masks restrict selected skin pixels to the fair ramp; other pixels exclude it. Mask boundaries are hand-specified anatomical regions with source-colour gating, so antialiased boundary classification remains approximate.

Reproduction script, masks, prompts, rejected originals and inspection aids are in `../scratch/`. Initial prompts are in `prompts.json`; redraw prompts are in `redraw-prompts.json`; numeric results are in `checks.json`.

## Inspection and redraws

All image-tool outputs were visually inspected, including rejected attempts. The assembled sheet, face crop, reference comparison, face audit, skin-mask sheet and decoded GIF frames were inspected at their saved sizes.

There were 24 figure requests for 15 final views: nine additional draws. Two early side attempts were rejected for weak profile construction, eye highlights and insufficient pocket/shin definition. The standing front and all four front-walk views were redrawn for smaller eyes and clearer mouth shadows. Side passing frame 3 was redrawn to bring its feet together; that attempt introduced a second pocket, so another image-tool edit removed the unwanted rear pocket.

Checks passed for all sprite dimensions, binary alpha, 92 occupied rows, crown row 33, lowest sole row 124 and allowed palette membership. All three GIFs have four frames at 160 ms. The two front eyes are individual charcoal pixels with fair skin immediately to their left and right in all five front-facing views. Mouth shadows are visible, but do not consistently meet the exact 1–2-pixel specification.

## Honest weaknesses and rules not fully met

- The figure is closer to roughly five heads tall than the requested four-head construction. The head and broad jaw are less emphatic than specified; the face remains softer and younger-looking than intended.
- Bare shins are clear in the front views, but too short in the standing profile. The breeches extend too far down, and the boots take up too much of the lower-leg length.
- The seed pocket is visibly sewn into the vest, but its location and projection drift across the side cycle. The corrected final passing frame projects it forward more convincingly than the other side frames. It is not a fully locked model turn.
- The moss cord reads as a narrow flat belt. The braid is a little long in some views. The dibber sometimes looks pointed rather than blunt.
- Contact steps are wider and passing-foot lifts less uniform than an ideal restrained town walk. Frame-to-frame arm, torso-width, pocket and facial-shading changes will cause visible motion shimmer. GIF frames and timing were checked; no claim of perfectly smooth animation is made.
- Compared with the style sheet, Pell has recognizable layers and a distinct design, but the reduced shading is softer and noisier, with smaller scattered clusters. Some contours are heavier/darker than the local-colour rule requests. Upper-left lighting is broadly retained, not perfectly consistent across every surface.
- Exact one-pixel profile noses, isolated eye/lid sizes in every profile, mitten simplification and 1–2-pixel mouths are not uniformly achieved. No code-painted face fixes were used to conceal these limitations.

## Workspace-boundary disclosure

Project work, intermediates and deliverables were written inside this folder. A mandatory image-tool instruction file was read outside the folder. The image tool also automatically cached its own outputs outside the folder; those cache files were not opened or copied. The in-folder originals were saved from the returned image data. No outside artwork, other Downloads folders, existing sprites or repositories were inspected.
