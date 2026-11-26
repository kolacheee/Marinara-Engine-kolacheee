# Earth & Weight — final review notes

## Delivered and checked

- `STYLE-SHEET.png`: 2000 × 2460, neutral background, all twelve sprites at exactly 3× nearest-neighbour scale, named/hex-labelled ramps, four-head construction guide, outline swatches, four-tone cylinder, and do/don't strip.
- `sprites/`: twelve RGBA PNGs, each 96 × 128. Every opaque bounding box is 92 px tall, from row 33 through row 124. Alpha is strictly 0 or 255. No keyed magenta remains in opaque pixels.
- Colours across the union of each character's four views: **Wren 28, Hadrik 22, Noble 16**. All belong to that character's declared subset of the master palette, below the 32-colour cap.
- `STYLE.md` gives anatomy, material, outline, walking and reduction rules, source-specific palette corrections, and all seven verbatim image requests. `palette.json` contains the ten named ramps and character assignments.
- `big/` holds the seven unmodified image-tool originals, including rejected drafts. Production uses `side-master.png`, `wren-views.png`, `hadrik-views.png`, and `noble-views-v2.png`; `cloth-cylinder.png` supplies the shading illustration. `side-draft-v1.png` and `noble-views.png` are superseded.
- The whole finished sheet was opened, followed by full-resolution section crops. Every individual sprite was also opened and examined at 4×. Source crops, proofs, reproducible scripts, reduction boxes and machine-check results remain in `scratch/`.

## Revisions made

The first side draft was too tall and slender for the four-head direction. Its replacement has substantially more compact adult proportions. Only after that correction were the other views generated from each character's own side reference.

The first Noble passing pose was a wide step and its gown produced noisy reduction. It was regenerated with close passing feet, a quieter hem and larger continuous cloth planes. An area/BOX reduction trial was rejected in favour of nearest-neighbour sampling. Colour-only source-anchor snapping improved moss/navy continuity; a separate skin-ramp snap brought Hadrik's initially too-warm source complexion down to deep brown.

## Honest weaknesses

1. **Proportions are approximate, not mechanically identical.** The guide is a four-head construction target. Hadrik is closest; the women read nearer four to four-and-a-half heads, depending on where the hair and chin are measured. The first draft was much further away, but the finished set is not a perfectly registered model turnaround.
2. **Some facial treatment remains soft.** Wren's front face is more youthful and her eye marks slightly larger than the strict one-pixel ideal. Hadrik's eyes have limited separation from his dark face and beard at native size. His maturity reads mostly through beard, shoulders and posture, rather than fine facial structure.
3. **Detail density varies.** Noble's original side updo has more little hair clusters than the simplified revised back bun. Hadrik's rolled sleeves and Wren's jerkin retain more small colour changes than Noble's gown. A few isolated pixels remain along fold transitions; they are not an intended dithering language.
4. **Outline lightening is incomplete.** Material-coloured edges are present, but several upper hair and garment contours remain darker than the ideal upper-left rule. Do not copy every dark contour indiscriminately when extending the style.
5. **Small equipment loses definition.** Wren's bowstring is thin and intermittently merges into neighbouring pixels; her ponytail is easiest to identify from behind. Hadrik's hammer has a readable metal head, but its handle/grip separation is compressed. The back apron has slightly ambiguous side panels.
6. **The passing frames are references, not a tested animation.** Feet and ground registration are checked. The three-dimensional consistency, limb lengths, cloth volume and small equipment placement still drift between independently drawn views. No complete walk cycle, timing test or in-engine animation has been supplied. Noble's hidden knee makes her passing phase subtler than the other two.
7. **Palette masks are source-specific.** Hadrik's deep-skin colour correction uses documented bounded regions and a brown-pixel test. It does not change shapes, but a neighbouring leather pixel can share the skin ramp at a boundary. Those masks must be reviewed for new artwork. The four-tone material system is a design rule; shared boundary colours can add an adjacent ramp's tone within a visually interpreted material region.
8. **This is a restrained field-sprite interpretation.** It does not demonstrate an HD-2D environment, atmospheric effects, camera treatment or lighting integration. Those would need their own references. The plain neutral page is for judging this sprite direction.

The sheet is suitable for selecting this visual direction and establishing a constrained palette. The limitations above should remain visible when using it as a production reference; it should not be represented as a frame-perfect animation model sheet.
