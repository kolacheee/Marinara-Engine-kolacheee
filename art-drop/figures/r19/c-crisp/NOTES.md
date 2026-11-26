# Crisp Classic — final inspection notes

Written after the final sheet and all twelve exported sprites were inspected. This is a coherent style proposal with useful reproducible rules, but it is not a flawless hand-cleaned production animation set.

## What was checked

- Opened the finished 1920 × 2720 `STYLE-SHEET.png`, examined full-resolution page sections, and inspected all twelve sprites both in 4x nearest-neighbour comparison rows and individually at their native 96 × 128 size.
- All twelve RGBA frames are exactly 96 × 128; their opaque bounds are exactly 92 pixels high, from row 33 through row 124. Alpha contains only 0 and 255. Transparent RGB is zero. No magenta remains as an opaque output colour.
- All opaque colours belong to the thirty-colour master palette. Character-wide unions across all four views are Wren 18, Hadrik 15, Noble 12. These counts are below the limit even when counted across a character's whole set rather than per image.
- The sheet uses exact 3x nearest-neighbour copies of the sprite frames, with labelled palette ramps, a three-head guide, outline swatches, an image-tool sphere and a do/don't strip. The small outline diagrams are 6x and the sphere is 5x, labelled separately.
- `CHECKS.json` contains the structural results and sprite hashes. It does not certify artistic properties such as uniform outline thickness, correct anatomy or perfectly consistent light.

## Revisions made

The first Wren candidate was much too tall in body proportion. It was replaced with a larger-headed, shorter-bodied drawing before the other characters were established. Hadrik's initial skin was too light and orange; a targeted image-tool edit darkened it before his other views were drawn. That rejected lighter original remains in `../scratch/hadrik-side-rejected-skin.png`.

The first palette pass confused some neutral hair highlights with dark skin and some gold trim with fair skin. The palette assignment was revised, as was Hadrik's lower-trouser mapping. The final exports and sheet were regenerated and reinspected after those changes. These were colour-assignment corrections, not program-drawn anatomy.

## Remaining visual weaknesses

1. **The one-pixel outline rule is a target rather than a perfect property of these examples.** Some source contours become two pixels thick at boots, cuffs, beard and overlaps; other dark edges break or change material abruptly after reduction. The rectangular rule swatches are more exact than the character contours. Python did not reconstruct or hand-paint the outlines.

2. **Wren is busier than the other two characters.** Her jerkin, belt, quiver and overlapping cloak create small broken clusters, especially in front view. Hadrik's apron and the Noble's skirt are stronger examples of broad flat planes. Future figures should follow the latter's restraint rather than multiplying Wren's seams.

3. **Wren's standing side bow has an unclear string.** Its stave reads, but the string is absent or merges into the body/shaft. Front and rear strings also become fragile at native scale; the passing frame has the clearest open gap. Bow curvature, apparent length and grip details drift between views. A requested bow-only image-tool correction was rejected by the tool's safety system with category `violence`; it produced no replacement. The accepted original was retained, and no code-drawn bow was substituted.

4. **Lighting is not fully consistent with the upper-left rule.** The sphere demonstrates that rule clearly, but the Noble's side gown has a highlight favouring its right/front edge, and several hair highlights are more decorative than physically directional. Palette snapping makes values exact; it cannot correct the placement of light planes.

5. **Material classification is approximate at boundaries.** The palette operation uses source-colour prototypes and positional restrictions, not manually labelled material masks. Small skin/leather/gold and neckline boundaries can inherit an imperfect ramp. Each palette ramp contains exactly three colours, but this does not prove that every pixel in a visually perceived material was assigned to the right ramp. Some tiny visible materials use only two of their three permitted colours.

6. **The three-head proportion is approximate.** Hair, nose and beard change the perceived unit. Hadrik's beard makes him read closer to two-and-a-half large visual head masses, although the underlying crown-to-chin scale is near the target. These proportions are intentionally more compact than naturalistic HD-2D anatomy.

7. **Eyes and hands lose some clarity at 1x.** Several eyes read as a brow/closed-lid mark instead of a separated one-pixel pupil. Fingers are simplified, but some original knuckle contours survive as small irregularities. The intended face and mitten rules in `STYLE.md` are cleaner than these residual details.

8. **The passing poses are references, not completed cycles.** Wren and Hadrik lift the knee rather high and can read as marching. The Noble's shoe and swept hem communicate motion, but the planted foot is less explicit beneath the gown. Heads are aligned by a shared rule, yet some silhouette and costume dimensions drift. No seamless looping animation has been claimed or validated.

9. **The do/don't strip is textual.** It supplies short rules rather than paired fully illustrated bad/good characters. The adjacent contour swatches and shading sphere provide the visual examples.

## Source and workspace record

Every character figure, including each view, was drawn by the built-in image tool from text and the side references made during this task. No game images, existing sprite collections or repository art were used. `big/` holds the twelve accepted large character originals plus the shading sphere; `PROMPTS.txt` retains the fourteen successful-request prompts, including Hadrik's correction. The blocked bow request is described above but is not a successful prompt record.

There was one instruction-boundary exception: the installed imagegen skill instructions were read from outside this folder because the runtime required that skill to be read before use. No outside artwork or repository contents were opened. The image tool also automatically saved its own originals outside the workspace; the project copies were written from the returned image data without opening those external files. Project scripts, inspections and other intermediates are in `scratch/`; deliverables are in `out/`.
