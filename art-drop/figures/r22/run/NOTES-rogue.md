# Veska Rill — production notes

## Delivered and checked

- 15 selected, unmodified image-tool originals in `big/`, one full-body figure per image on magenta.
- 15 RGBA sprites in `sprites/`, each exactly 96 × 128. Every occupied bounding box begins at row 33 and ends at row 124 inclusive. Complete equipped silhouettes are horizontally centred within one pixel.
- Exactly 24 opaque colours across the sprite set, all from navy, charcoal, leather, auburn, steel and olive. No added ramp, opaque pure black/white, or partial alpha.
- `rogue-sheet.png`: 1152 × 1536, nearest-neighbour 3×, background #4A4642. Rows are standing front/side/back, walkside0–3, walkfront0–3, walkback0–3.
- Three transparent walk GIFs, 288 × 384, four frames each, 160 ms per frame, infinite loop. Decoded frames were inspected as strips; frame timing was checked. The GIF encoding was also checked against its source sprites.
- `rogue-face.png`: 216 × 168, a 6× crop of front sprite columns 30–65 and rows 33–60. The full sheet and face crop were opened at their native image dimensions.

## Drawing and reduction

The side view was drawn first. Every later drawing used that same side image as a reference. Rear and front corrections additionally used this run's own corresponding views. No external visual references, existing sprites, or repositories were used.

There were 19 image-tool drawings: 15 selected views and four replacement attempts. Python performed magenta keying, figure cropping, BOX reduction, position/colour-based skin masking, constrained palette snapping, sheets, GIFs and checks. It did not draw bodies, replace limbs, synthesize animation poses, or paint eyes or mouths. Some non-skin material regions were constrained to their appropriate ramps during snapping. Existing contours were retained.

The prompt record is `../scratch/prompts.json`. Processing and assembly scripts, masks, inspection images, rejected drawings and machine-readable checks are also in `../scratch/`.

## Redraws and face pass

1. Standing front was redrawn because the first reduced eyes were too weak. The redraw also tightened the neck wrap.
2. Walkback0 was redrawn because its jacket hem sloped in the wrong direction and its foot placement did not give the intended opposite contact.
3. Walkfront1 was redrawn because its reduced eyes did not pass the isolated-dark-pixel check.
4. Walkfront1 was redrawn again because one eye still occupied two dark horizontal pixels. The selected version has two isolated dark eye pixels.

All five front-facing views now contain two dark single-pixel eye marks with olive-ramp pixels immediately on both horizontal sides. All five profile views retain one such visible eye. The instruction saying “both eyes” on every face-bearing view was interpreted as both *visible* eyes: showing two eyes in a strict profile would contradict the requested view. Backs show no face. The standing front eye coordinates are (44,47) and (50,47).

## Honest weaknesses and incomplete visual rules

- The right-jaw pale notch is too faint and inconsistently distinguished from normal jaw lighting. It is not a reliable identifying cue at sprite size.
- Hair structure varies between poses. The standing back and corrected walkback0 show converging twists; the other rear walking drawings read more as three horizontal curved bands. Some rear knots look rounder than the required squared block.
- The side head is in profile, but the torso exposes more of the chest and both arms than a strict orthographic side view would. The side0 shoulder overlap is particularly awkward.
- The prybar reads clearly and stays with the guarded left hand, but its visible length is closer to two small hand masses in several views than a strict palm length.
- Faces retain readable eyes, but brows, cheek planes and mouth shadows vary. Some mouth shadows spread to about three pixels or become a subdued dot, exceeding the ideal consistent 1–2-pixel horizontal treatment. The broad chin and age are less distinctive in the smallest views.
- Independently drawn cloth planes, head widths, hair highlights and arm positions vary between frames. The cycles have visible redraw shimmer. Front/back contacts and passing poses are not equally distinct, and some lifted shoes sit around 3–5 logical pixels above the support sole rather than only two.
- The colour/position skin masks were visually inspected, but mixed boundary pixels remain approximate. I cannot certify perfect semantic separation at every skin/leather or skin/hair edge. The palette membership check alone does not prove that semantic requirement.
- Outline thickness and local-material edge colours are not perfectly uniform. A few contours and overlaps occupy two pixels, and reduction leaves some small transitional clusters. Upper-left lighting is broadly retained, but highlight shapes are not frame-locked.

## Workspace boundary exception

One installed instruction file, `/home/kolache/.codex/skills/.system/imagegen/SKILL.md`, was read outside this folder because the runtime required the image-tool skill to be read. Thus the literal prohibition on reading *anything* outside this folder was not fully met. No outside artwork, neighbouring Downloads folders, or repositories were inspected. The image service automatically cached its drawings outside the folder; project originals were written here directly from returned image bytes, without opening those external cache files. All task scripts, working files and delivered copies were written inside this folder.
