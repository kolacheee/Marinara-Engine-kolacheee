# Belis Dorn — Round 23 face and finish revision

## Replaced deliverables

All 15 views have newly drawn heads. `big/` contains the 15 selected full-figure image-tool originals on magenta; `sprites/` contains the 15 transparent 96 × 128 exports. The sheet, three walking GIFs, front face crop and full-body style comparison have all been replaced.

- `noble-sheet.png`: 1152 × 1536, 3× nearest-neighbour, background #4A4642. Rows: standing front/side/back, walkside0–3, walkfront0–3, walkback0–3.
- `noble-walkside.gif`, `noble-walkfront.gif`, `noble-walkback.gif`: 288 × 384, four frames each, 160 ms per frame, looping.
- `noble-face.png`: front face at 6×, rows 33–60 inclusive.
- `noble-vs-sheet.png`: front beside Wren, Hadrik and the reference noble, all at 3×.
- `noble-heads-6x.png`: **every one of the 15 heads beside all three reference faces**, at exact 6×. Each crop covers rows 33–63 inclusive. Order matches the sheet. This includes rear heads for hair and finish comparison; no faces were added to the rear views.

## Design and references

Read both current instruction files, including their final additions. CHARACTER.md contained no separate later head redesign. Belis remains the specified olive-skinned, clean-shaven, stout 43-year-old man with a broad forehead, level brows, long nose, double chin and auburn curls. The earlier ambiguous “make her clearly wealthy” sentence continues to mean wealthy presentation, preserving the stated person and this set's established costume.

Preserved the charcoal bell-shaped surcoat, linen sleeves and piping, double hem, steel clasp and wrist bracelet, leather boots and folded petition in the anatomical left hand. No new costume or prop was introduced.

The built-in image tool was used for all redraws. `style-ref/STYLE-SHEET.png` was attached to **every** request with the required style-only instruction. Other references were solely this character's existing images and the revised heads. Side was revised first, followed by front/back and the walk frames. The reference characters were not used as identity templates.

The full prompt set is saved in `../scratch/face-redo/prompts.json`. All authored scripts, backups, comparisons and exports are inside this folder. The image tool automatically saved its returned originals in its external cache; those returned files were copied here. No unrelated reference artwork was used.

## Face redraws and reduction

Nineteen image-tool requests produced the fifteen selected originals: one initial redraw per view, then four targeted face corrections for walkside1, walkside3, walkfront2 and walkfront3. These corrections enlarged source catchlights and clarified short mouth lines after the first reduced-size review. Rejected versions remain in `../scratch/face-redo/`; the previous finished set is backed up under `../scratch/face-redo/originals/`.

The heads now use larger eyes with light catches, visible brows, light/shadow nose planes, mouth lines and broad skin planes. The rear hair was redrawn into substantial connected masses instead of many small highlighted rings.

Processing is reproducible with `../scratch/face-redo/reduce.py`. It keys magenta, crops the figure and uses BOX/area reduction aligned to each existing sprite's width. The new head occupies rows 33–54; the existing body export is retained below it. Skin and hair use separate material masks and their specified ramps. Source dark marks and small source catchlight regions are preserved as separate material masks before snapping; no eye, brow, nose or mouth was painted in code. Warm catchlights required a connected-region mask so they would survive without accidentally classifying the larger forehead, nose or collar highlights as eye lights.

After snapping, skin and hair receive the requested same-mask 3×3 modal cleanup only when a pixel differs from all four direct neighbours. Facial marks, catchlights, mouth/nose areas, darkest material contours and silhouette edges are protected. The final pass replaced **283 isolated shading pixels** across the set, including existing hand skin. Clothing, equipment and pose pixels below the head were preserved.

## Review and verification

Inspected all 15 heads at 6× beside the three reference crops, including the four corrected heads after reduction. Also inspected the final full-body comparison, complete sheet and every decoded GIF frame. The selected heads are substantially smoother than the previous set, with visible eye catches in every face-bearing view and no facial features in back views.

`../scratch/face-redo/verification.json` records the final checks:

- Fifteen 96 × 128 RGBA sprites; occupied rows 33–124; binary alpha.
- Twenty-three opaque colours across all views, entirely within charcoal, linen, auburn, leather, steel and olive ramps. No additional ramp, pure black or pure white in the sprites.
- All non-skin pixels below the head are unchanged from the previous sprite set. All body/pose alpha below the head is unchanged. Changes there are exclusively skin despeckling.
- All fifteen `big/` files are byte-identical to the selected returned originals.
- Every decoded GIF frame matches its corresponding enlarged sprite exactly, at 160 ms.
- Sheet, face crop, full-body comparison and all-head comparison dimensions pass.

## Honest limitations

The rendering is cleaner and closer to the reference's broad clusters, but it is not an exact reproduction of its hand-placed craft. Brow thickness, eye/catchlight footprint, nose length and mouth contrast vary slightly with reduction. Some catches cover two adjacent pixels. Hair resolves into broad curls, but not exactly four separately countable locks from every angle; the independent drawings still have small head-width and curl-shape differences.

Existing sleeve/hem/body flicker and the original walk mechanics remain because this revision preserves those bodies and poses. Wealth still reads as restrained tailored court dress. The side build remains less stout than the front, and some hands remain larger than the initial 3–5 px target. The raw full-figure tool originals can have tiny incidental rendering differences outside the head; the final sprites deliberately retain the existing body pixels to avoid propagating those differences.
