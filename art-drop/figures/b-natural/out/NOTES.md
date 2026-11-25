# Woad & Walnut

These town figures use tall adult proportions, restrained earth colours, broad wool planes, belted waists and dark grounded footwear. Warm faces and shoulders carry the eye above quieter trousers and boots. The intended character is ordinary sewn clothing: an open walnut cloak over leather, a madder working tunic, a woad robe with a linen-coloured sash, and an ankle-length working kirtle with an apron. Small seams, cuffs, hems and knots suggest construction without texture noise. All art was drawn at native 32×48 resolution in palette-index space, with geometry registered through one skeleton, then rendered directly to the supplied source colours.

## Files and rebuilding

All 14 layer sheets, the five composite/animation files and the palette are in this directory. Sheets are 128×192 RGBA with binary transparency. Columns are frames 0–3; rows are down, left, right, up. The back-facing beard cells are intentionally empty. Other non-down rows repeat their standing cell, as SPEC permits.

From the enclosing project folder, run:

```sh
bash tools/build.sh
```

This requires Python 3 and Pillow, regenerates the art and review images, and runs the checks. It leaves this written assessment in place. No network, external artwork or repository is needed.

- `tools/skeleton.py`: shared registration, body proportions and walking offsets.
- `tools/draw.py`: indexed geometry, light pass, explicit facial/clothing details and outlines. Right-facing geometry is mirrored before illumination; right-facing accents are toned separately.
- `tools/palette.json`: editable palette master, copied to `out/ramps.json` by the build.
- `tools/compose.py`: runtime layer order, exact recolouring, composite layouts, GIF and review backgrounds.
- `tools/check.py`: checks the saved PNG pixels and cross-body compositions.
- `scratch/`: nearest-neighbour review enlargements, both-body proofs, day/night cobbles, animation frame enlargements, `checks.txt` and `build.log`.

The lineup order is the six characters in SPEC. Swatch order is very light, light, medium, dark, very dark, grey-green skin; then black, brown, chestnut, blond, red, grey, white, dusk hair. Gaps are eight native pixels, enlarged with the figures. The GIF has four 150 ms frames, a 600 ms cycle and an infinite loop, using one exact global palette.

## Ramps

`ramps.json` contains all hex values. Skin, hair, cloth A and cloth B use four source shades; eyes use three. Fixed ramps are umber outline, leather, wood, metal, linen and horn. All 37 source/fixed colours are unique. Target choices include six skin tones, eight hair colours, six eye colours and four colourways for each cloth ramp. Fixed materials are preserved when recolouring. `eyes[0]` is deliberately unused.

The only target change from BRIEF is brown eyes: `[#1a120e, #3e2617, #6b4528]` became `[#1a120e, #78543b, #a47d50]`. The two visible shades were lifted within the warm brown family because the original eye values were too close to the very dark face. Source colours and every other target ramp remain as supplied. White hair retains its pale crest and fantasy skin remains a muted grey-green.

Lineup garments are walnut/weld, madder/oakgall, woad/linen, fleece/ochre, walnut/ochre and fleece/weld respectively. The woman's labourer apron uses recolourable cloth B; selecting its linen target makes it linen-coloured.

## Review and corrections

Every layer sheet was opened at 4×. The lineup was inspected at native size and enlarged, as were the turn, walk and swatches. Both bodies were reviewed with all three outfits and all three hairstyles in every direction. Day and lamp-lit night cobble tests were inspected at 1×, 2× and 4×. All four animation frames were inspected enlarged, and the GIF was opened; its decoded frames were also compared byte-for-byte with the intended composed frames. Those comparisons passed. This verifies frames and timing, rather than claiming an in-engine animation test.

Corrections made during review included joining a detached profile ear-tip pixel, increasing leg substance, reducing mirrored right-facing highlights, opening cloak panels around the hands, lifting brown-eye contrast, breaking the flat hair crown and covering a strip of exposed skin beside the profile boots.

The final automatic run passes **303/303 checks**. Checks cover dimensions, RGBA/binary alpha, permitted colours, empty beard cells, palette uniqueness, baseline and bounding boxes, isolated opaque pixels, four-connected component attachment on both bodies, repeated standing views, recolouring and leg coverage. The cross-body composition sweep covers **288 combinations**. The body is 44 pixels high standing and 43 during the one-pixel lowered steps; hair makes those heights 45 and 44. The planted foot remains on row 47. Bounding-box height is therefore deliberately checked according to the frame, rather than contradicting the requested walking bob.

## Honest weaknesses and system limits

- Both bodies share one height and the same head registration. The woman's narrower front shoulders, waist and jaw distinguish her body, but the profile bodies are particularly similar. Universal ranger and mage silhouettes conceal much of that distinction.
- The result is fairly geometric and stiff. Tunic chests are broad, flat planes; shins are straight; profiles have strong angular noses. The rendering suggests the miniature-painting direction more through proportion and colour than through subtle anatomy or convincing wool weight.
- The four-frame walk is deliberately small: two lowered steps alternate with the same standing/passing pose. Arm and cloth motion is readable, but it remains a compact bobbing cycle rather than a fully articulated gait. Side and back walking are not animated.
- Short hair has a pronounced centre part and a sharply stepped crown. Long hair has limited strand separation. The braid's alternating lobes are clearer at 2–4× than at 1×; its front silhouette is stronger than its profile silhouette.
- Very dark skin with black hair and a full beard remains the hardest face to read, especially on the night background. Brown-eye contrast is improved, but the beard necessarily removes most lower-face information. Fine facial features are much more reliable at the intended 2–3 screen pixels per sprite pixel than at native size.
- The hood obscures hair and inner race-feature roots. Wide ear/horn tips can still protrude; it does not have fitted ear slits or horn openings. Those combinations would need accessory-specific masks for a convincing production result.
- A single hair layer above the outfit cannot put the same strand both behind a cloak and in front of a shoulder. The back view suggests hair behind the shoulders, while the front locks necessarily paint over the clothing. Long hair can also cover some of the ranger's bunched hood and lining.
- Horn curves and ridge notches are compressed into very few pixels. Their raised silhouette distinguishes them from the swept ears, but the full ram-like sweep is clearer in profile than head-on.
- Two-pixel hands and the staff leave little room for both an outline and modelling. Hand and toe-plane accents are restored after the outline pass to preserve the specifically requested tiny highlights; those pixels are exceptions to a literally uninterrupted dark edge. The staff shaft is predominantly its dark lit edge and umber shadow edge, with little room for the full four-shade wood ramp.
- Thin regions devote a large fraction of their pixels to edges and contact shadows. The approximate 55/25/10/15 shade proportions are not achieved uniformly, particularly in hair, hands and narrow accessories. The checker does not certify those art-direction percentages or the subjective absence of banding. Interior leg separation uses a dark ramp column rather than a transparent slit.
- The background tests use newly drawn flat cobbles. They do not reproduce the actual engine's perspective, bloom, tilt-shift blur, dynamic lighting or movement. Dark cloak hems and black hair lose some separation against the darkest night stones. In-engine readability remains untested.

Only the supplied brief, specification and background workflow were consulted. Work and intermediates stayed inside this folder; no existing sprite, outside folder or repository was opened.
