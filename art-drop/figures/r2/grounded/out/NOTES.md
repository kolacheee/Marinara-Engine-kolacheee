# Working Light — figure sample

The direction is ordinary adults at the street's own scale: 32 pixels per metre, small heads, long limbs, sloping shoulders, work clothes, muted earth colours, and light from screen-left. The stone, fountain and timber in the supplied market screenshots informed the value range and surface detail. The six people are intended to belong to a working square. This is a complete, editable style sample, but I do not consider its naturalism or animation finished commercial-quality art.

All requested deliverables are here: 24 RGBA source sheets, the six-character lineup, both full-resolution street composites, four-direction turn, walk sheet, six-frame walk GIF, swatches, exact ramps, editable grids, coverage masks and rebuild tools. Every source sheet is 288×256: six 48×64 frames across, with down, left, right and up rows. All non-body layers have both `@man` and `@woman` variants. Right and up repeat their standing frame, as permitted for this sample.

The standing bodies measure 58 pixels for the man and 56 for the woman, with eight-row heads: 7.25 and 7 heads respectively. The prescribed 0/1/2-pixel walk bob bends the body down while the supporting foot remains on row 63. Consequently, actual bounding-box height drops by two pixels on down poses. The height checker compensates for bob when checking the standing proportions; it does not pretend the woman remains 56 pixels high in those bent poses. The simultaneous requirements of a two-pixel bob, grounded feet and height varying by no more than one pixel cannot all hold literally.

`ramps.json` contains the brief's exact colours. Source regions are medium skin, brown hair, brown eyes, linen cloth A and umber cloth B. Targets contain six skin tones, eight hair colours, six eye colours and four colourways for each cloth region. Leather, iron, wood, horn, edge and sclera are fixed. There are 44 unique source/fixed colours; no source/fixed colour is shared between regions. Recolouring is an exact RGBA lookup, never an approximate colour adjustment. The black hair ramp satisfies B ≤ R + 2 throughout. The dark-skinned labourer's lit cheek, bridge and open lip pixels retain warm skin values; the beard remains neutral black.

The reference stage used the built-in image tool for one painted board containing front and left-profile pairs for both bodies, labourer, ranger, mage and raised hood. The board and exact prompt are in `../scratch/ref/design-board.png` and `../scratch/ref/prompt.txt`. Magenta-keyed, box-downscaled design guides are in `../scratch/guide/`. These images are reference intermediates only; no reference bitmap is shipped as sprite art.

The native artwork was authored as explicit glyph rows and pixel runs, with scripted placement, pose assembly, fitting and subsequent source-grid edits. This is not an entirely manual pixel-editor drawing session: assembly and some sparse cloth marks were generated in code before being baked into editable text grids. The authoritative delivered art is the 516 `.grid` files in `src/`, not the initial authoring helpers in `scratch/`. Re-running those helpers would discard later revisions; use the delivered build script instead.

`tools/legend.json` maps each glyph to a material and shade, with `.` transparent. `tools/rig.json` records head, shoulder and hip anchors, torso sway, bob and hanging-hair lag for both bodies and all poses. `src/manifest.json` specifies the component order and coordinate space of every layer. Head attachments use shared directional local grids and the appropriate body's head anchor. The bodies have subtly different jaws and substantially different torso outlines. Torso grids move with bob; limb and garment-hem grids are authored in each frame's coordinates. Long hair and braid ends lag below the rigid crown. Right-facing drawings have revised lighting rather than a raw flipped palette.

The compositor uses body → race feature → outfit → beard → hair → headwear → held item. Normal street figures use nearest-neighbour approximately 2.3× scaling, with integer output dimensions; close figures use exactly 4×. Both scenes retain the full 1280×760 screenshots. People are ordered by foot depth and stand clear of the fountain and UI labels. Shadows use the specified cool colour, 45% starting opacity, an offset toward screen-right/up-screen, and a blur. The GIF contains six distinct frames, each 150 ms, on one shared palette.

To rebuild from this folder, with Python and Pillow installed:

```sh
python3 out/tools/build.py
python3 out/tools/compose.py
```

The build automatically runs `check.py`, including `check_ramps.py`. To inspect a specific garment against a dimmed body:

```sh
python3 out/tools/build.py --underlay outfit/mage@woman --direction left --frame 2
```

That preview is written to `scratch/review/`. Source grids are the place to make joint or silhouette corrections; do not paint fixes into the exported PNGs.

Validation passed for sheet dimensions, RGBA mode, binary alpha, exact allowed material colours, source-ramp uniqueness, target lengths, black-hair neutrality, body ground contact, bob, nominal proportions, layer dilation allowances, changing walk leg pixels, raised trailing heels, passing-foot markers, and repeated standing rows. The three `.cover` files are independent body-derived masks; all expected torso/leg coverage pixels are opaque in the corresponding outfit. The final isolated-pixel rate is 0% under the four-neighbour definition used by the checker. These tests do not certify artistic quality or exhaustively enforce every shading and fold prescription in the brief.

Visual review included every source sheet at native size and 4×, source layers over their bodies, all final PNG composites, both street composites at full resolution, skin/hair swatches, alternate outfit/hair combinations, and all six frames decoded from the delivered GIF. Review boards and the check report remain in `scratch/`. Revisions reduced prominent ears, connected detached tips, corrected facial landmarks and beard lips, replaced rigid cloak panels, removed a repeated cloak texture, closed robe coverage leaks, fitted the working skirt, and moved cloak collars with the torso bob. GIF frames and timing were inspected; I did not use a continuous animated playback viewer.

Honest weaknesses and remaining departures:

- Standing poses remain too straight and uniform. The specified proportions avoid oversized heads, but the silhouettes still have some mannequin-like rigidity rather than the reference paintings' relaxed weight and asymmetry.
- Seven-column faces remain highly compressed. Eyes, nose and mouth have separate pixels, including on very dark skin, but the sclera and brow can read as a small horizontal mask at normal play zoom. Sex and age differences in the face are subtle; build, hair and beard do much of that work.
- The woman labourer's side-view skirt is the weakest garment. Keeping it within the strict two-pixel outfit allowance around widely separated walking legs forces an exaggerated working slit; some frames read more like divided skirt panels. It does not yet have convincing uninterrupted fabric drape.
- The side walk has clear leg passing, raised heels, opposite arm swings and bob, but the knee transitions are angular and the planted-to-moving-foot rhythm is mechanical. The front walk reads more weakly than the side walk. Foot contact is verified in sprite coordinates; no engine movement-speed/foot-slide test was possible here.
- Robe and cloak secondary motion is simplified. The broadened robe now covers the stride, but its larger side-view fabric masses still change abruptly. The staff stays vertical and follows the hand horizontally; its upper endpoint bobs while its ground endpoint is constrained, changing apparent length slightly.
- Some long straight seams, leather planes and hems still look constructed. Cloth flecks and folds are restrained but are not a comprehensive hand-tuned match for every four-by-four block of the world's textures. Selective edge treatment is not equally refined on every contour.
- The static street composites use the prescribed ellipses. They do not reproduce the scene's full projected figure shadows, spatial lighting, bloom, ambient occlusion or edge blur. The figures can therefore still look sharper and flatter than the surrounding 3D scene, especially at close zoom.

Boundary disclosure: the supplied market screenshots were the only existing art consulted. No other Downloads folders, repositories or existing sprite collections were opened. However, the requested strict folder boundary was not absolute: runtime instructions required reading the installed image-generation skill instruction file outside this folder, and the built-in image tool automatically cached its new reference image outside this folder. The reference was saved into `scratch/ref/` from the tool's in-memory image result; that external image cache was not browsed or opened. All manually written project files, authoring helpers, reviews and deliverables are inside this folder.
