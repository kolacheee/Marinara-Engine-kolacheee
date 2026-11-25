# Wren and Hadrik — field sprites

Two original characters, made for the supplied market screenshots. No game assets, ripped sheets, earlier-round artwork, or other lanes' artwork were used.

## Delivery and playback

- `sheet-wren.png` and `sheet-hadrik.png`: 288 × 256 RGBA. Each cell is 48 × 64. Rows are **down, left, right, up**; columns run left to right. Down and left each contain six walk phases. Right and up each repeat a neutral standing frame six times, as permitted by the specification.
- `idle-wren.png` and `idle-hadrik.png`: 192 × 64 RGBA; four down-facing breathing frames. Frame 0 is the neutral down-facing stance.
- `lineup.png`: neutral down and left facings at exact 1× and 4× nearest-neighbour scales, on #7a7a7a.
- `walk.gif`: both characters walking down for six frames, then left for six frames, at **110 ms/frame**, looping. `idle.gif`: four breathing frames at 220 ms/frame, looping. GIF previews are enlarged 4×.
- `in-world.png`: supplied normal-zoom screenshot, sprites scaled to 110 × 147 screen pixels, nearest-neighbour (rounded from 48 × 64 at 2.3×).
- `in-world-close.png`: supplied close-zoom screenshot, sprites scaled to 182 × 243 screen pixels, nearest-neighbour (rounded from 48 × 64 at 3.8×).

Opaque sprite heights range from 55 to 57 native pixels. Neutral stances are 56 pixels tall. Feet touch cell row 63 in every frame. Sprite alpha is exclusively 0 or 255; no sprite blur, antialiasing, baked ground shadow, or pure-black outline pixels. Wren uses a shared 29-colour palette; Hadrik uses 32. The ground shadows belong only to the world composites.

The world composites place Wren facing down and Hadrik facing left on open paving. Normal-view foot anchors are (772, 527) and (920, 561); close-view anchors are (792, 560) and (1020, 615). Each has a diffuse dark ellipse plus a smaller contact shadow. The original screenshots otherwise remain intact.

## Method and tools

1. The built-in image-generation tool produced one 18-pose sheet per character: six front walk candidates, six side walk candidates, and six neutral/idle/rear candidates. Both original 1774 × 887 images and their complete prompts are retained in `../scratch/generated-*.png` and `../scratch/prompt-*.txt`.
2. Python and Pillow isolated each pose against the flat magenta background. Edge-energy periodicity estimated a local pixel pitch and phase separately on both axes. The source images do **not** have one perfectly uniform integer grid; the recovered local estimates and confidence values are recorded in `../scratch/grid-*.json`. Sampling used detected cell centres, followed by nearest-neighbour normalization to the final 48 × 64 frame.
3. Explicit material palettes replaced the source colour noise. Cleanup removed disconnected flecks, simplified isolated intermediate colours, repaired faces at native pixel coordinates, gave silhouette outlines adjacent material hues, and corrected Hadrik's skin separately from the reddish apron. His hair and beard use cool near-black shades; his face uses dark warm umber shades.
4. Selected generated bodies and leg poses supply the walks. A common cleaned head stabilizes facial identity and equipment. Weight phases bob by one pixel; the opposite down-facing lead leg is edited from the corresponding first-half pose. Missing opposite side-arm swings were drawn in native pixels, with the far arm occluded behind the torso. Cloth tips follow the weight change. Idle edits lift the shoulders while holding the feet and pelvis, with secondary ponytail/cloak or apron movement.
5. Pillow assembled the PNG sheets, shared-palette GIF previews, lineup and world composites. Only the contact-shadow layers receive Gaussian blur. The sprites remain unlit, crisp pixel art.

Rebuild deliverables from the retained extracted poses:

```sh
python scratch/build_sprites.py
python scratch/validate_sprites.py
```

To repeat grid recovery and pose extraction as well, run `python scratch/build_sprites.py --extract`. No additional image-generation call is needed. The scripts need Python and Pillow only. The validation report is retained at `../scratch/validation.json`; enlarged extraction and final frame contact sheets are also in `../scratch/`.

## Review and remaining limitations

The close world composite was inspected at its full 1280 × 760 size. The final silhouettes, cloth folds, faces, equipment and restrained material colours read coherently beside the buildings, with crisp sprite pixels and grounded feet. The visual target is a polished HD-2D field sprite; this is an original interpretation, not a reproduction of a particular game's character or asset.

- Up and right are standing-only placeholders, not complete walk cycles. Right is a mirror of left: Wren's bow/quiver and Hadrik's belt hammer therefore switch sides, and the small directional highlights mirror too. Authored right-facing equipment and lighting would be needed for strict continuity.
- The walk bodies retain some frame-to-frame sleeve and garment-volume variation from the source poses. Their motion is more stylized than a fully hand-animated production set. The silhouettes, faces, shared palettes and distinguishing equipment are stabilized, but the frames are not identical costume drawings with only joint transforms.
- Wren's rear hair and equipment occupy more of her silhouette than Hadrik's. Her down-facing tied tail reads partly as a raised tied mass; the left and rear poses show its length more clearly.
- The cloak has a deliberately limited secondary sway, and Hadrik's short hair barely moves. These are four-frame breathing idles, without blinks or a second idle action.
- Fractional 2.3×/3.8× scaling necessarily makes native pixels alternate between adjacent screen-pixel widths. The lineup's integer 4× view is the cleanest reference for inspecting the exact grid.
- The composites demonstrate scale and placement, not a running engine integration. Scene bloom, depth-of-field interaction and dynamic lighting remain the renderer's responsibility.

No layering system or separate equipment parts are included; these are complete character frames, as requested for this style round.
