# Pell Arven — production notes

The requested files are present. The export constraints pass, but the artwork does **not** meet every strict visual rule. In particular, the face pass remains imperfect; this is not a claim of exact compliance.

## Delivered and checked

- 15 image-tool originals in `big/`, each containing one full-body figure on magenta.
- 15 RGBA sprites in `sprites/`, each 96 × 128, with binary transparency, crown at row 33 and lowest occupied sole at row 124. All occupied pixels use the six authorized ramps; the union is exactly 24 colors. No extra ramp was added.
- `farmhand-sheet.png`: 1152 × 1536, nearest-neighbor 3× presentation on #4a4642. Rows are standing front/side/back, side walk, front walk, back walk. Walking columns are 0–3.
- Three GIFs: 288 × 384, four frames each, 160 ms per frame, looping, on #4a4642.
- `farmhand-face.png`: front crop from rows 33–60 inclusive, enlarged 6×.

Every generated original was visually inspected. The reduced figures were reviewed in previews and the assembled sheet. The final sheet and face crop were opened at their stored resolution. All four decoded frames of each final GIF were inspected in strips; this was not a real-time animation playback review.

## Method and redraws

The built-in image tool drew every figure. The right-facing side was drawn first; every subsequent view used that same-run side as a reference. Front and back drawings from this run also supported the corresponding walking views. No outside character image or sprite was used.

Python only keyed magenta, cropped, BOX-reduced, snapped colors using material masks, assembled sheets/crops/GIFs, and checked exports. It did not draw anatomy, poses, eyes or mouths. The source artwork is not itself limited to 24 colors; the reduced sprites are.

There were 21 image-tool drawings in total: 15 selected originals and six rejected versions. The initial side was redrawn to enlarge the head, lengthen the bare shins and blunt the dibber. Standing front received three face-redraw attempts; walkfront0 received two. The later tiny-eye attempts faded during reduction, and subsequent attempts changed the face and nose without reliably solving the problem. I retained the earlier, more consistent front and walkfront0 drawings. Rejected originals, processing scripts, prompt records and numerical checks remain in `../scratch/`.

## Honest weaknesses and unmet rules

- **Eyes are not consistently isolated, dark 1 × 1 marks.** Several spread across adjacent pixels or remain too light after area reduction. Both front eyes can be seen, but the strict face-pass requirement is not fully met despite the redraws. Profile views show only the anatomically visible eye. No missing eye was painted in with code.
- Mouths sometimes occupy more than the requested 1–2 pixels. Walkfront0 has a heavier mouth/chin patch and a slightly different expression. The broad jaw and upturned nose are clearer in profile than in front.
- The right seed pocket remains on the assigned side, but often reads as an attached pouch rather than a stiff extension of the vest. Its sideways projection is too weak, particularly from the front. The high end of the vest hem also sits lower than the specified upper hip.
- The moss cinch reads more like a narrow belt than a cord. Hair highlights are broader than the requested small upper-left accent, and the hair contains more stepped subdivisions than an ideal three-to-five-lock treatment.
- The four-head construction is approximate. Long exposed shins are retained, but the build is narrower and less visibly broad-hipped than the design calls for. Some silhouettes and face widths drift slightly between drawings.
- The walk is restrained, but the side contact strides and arm swings are a little wider than ideal. Front/back foot-height changes can read as foot sliding. Some rear contact poses show a trailing boot sole lower on screen than the other heel, so exact support-foot grounding is visually ambiguous even though the lowest occupied row passes the numeric check.
- Material masks are inferred from regions and source colors, not hand-verified semantic labels for every pixel. Boundary misclassification remains possible. Some contour sections are softer than a continuous one-pixel local-color outline, and some small reduction clusters exceed the intended sparseness of isolated pixels.

## Folder-boundary exception

I read the mandatory installed imagegen skill outside this folder because the agent instructions required it. This did not comply with the request to read nothing outside the folder. No external artwork, other Downloads folders, repositories or existing sprites were inspected. The image service also created its own automatic storage copies outside the folder; project originals were saved here directly from the returned image bytes, without opening those external copies. All task-created processing files and intermediates are inside this folder.
