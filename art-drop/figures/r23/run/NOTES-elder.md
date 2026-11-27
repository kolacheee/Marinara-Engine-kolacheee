# Enna Kes — Round 23, review redraw 2

Replaced all 15 big drawings and sprites, the four-row sheet, all three GIFs, front face crop and front-versus-sheet comparison. Added `elder-heads-vs-sheet.png`: every final head at 6× beside Wren, Hadrik and noble, using rows 33–63 inclusive.

## What changed

- Used the built-in image tool for 17 edit requests: the standing side first, the other 14 views, then additional face passes for walk-front 2 and 3 to separate the nose and mouth. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY wording. Subsequent requests also attached the revised side. The only artwork references were the local style sheet and this character's images.
- Warmed face, ears, neck and hands. Review 2 overrides the former olive swatches: skin now uses exactly three warm tones, shadow **#936044**, body **#BB8966**, light **#D7AD87**. This replaces the old olive ramp; it does not add a second skin family. Auburn, charcoal, steel, leather and linen remain the original ramps. The final set uses **23 shared opaque colours**.
- Preserved the image tool's drawn dark brows, eyes, short mouths and light eye catches through area-coverage material masks. No facial features or pose geometry were drawn with code. Skin/hair masks were corrected after an audit caught warm grey hair highlights being mistaken for skin.
- Applied the isolated-pixel 3×3 same-mask majority cleanup to skin and hair, protecting facial features and material boundaries. The final reduction changed 30 isolated pixels across the 15 drawings; no cloth smoothing was applied.
- Composited the reduced head/hand edit regions onto the supplied sprites to retain the existing body, costume and poses. Pixels outside the saved edit regions are exactly identical to the supplied sprites. The edit regions include a small amount of adjoining collar/cuff at their boundaries. No head was reused across views.
- `big/` contains the final unmodified 1024×1536 image-tool outputs on magenta. The tool introduced slight incidental cloth/value changes in these raw originals; restoring the supplied body outside the edit regions prevents those changes from propagating into the final sprites and previews.

## Review and validation

Opened the final 6× comparison covering all 15 heads beside the three reference faces, the full-body 3× comparison, the sheet, and decoded four-frame strips for all three GIFs. The warmer skin no longer has the previous grey-green cast. All ten face-bearing views retain dark eyes with visible light catches, separate brows and readable mouth marks. Rear views contain no face. The front remains clearly distinct from the reference characters in hair, build, costume and silhouette. The face planes are cleaner and the eyes hold up better beside the sheet than the previous set.

Mechanical checks pass:

- 15 sprites, 96×128 RGBA; binary alpha; crown row 33, lowest occupied sole row 124.
- 23 shared colours, including only the three replacement skin tones; no old olive swatches.
- Three GIFs, each four distinct 288×384 frames, 160 ms per frame, indefinite loop.
- Sheet 1152×1536, 3× nearest-neighbour on #4a4642, with the original row/view ordering.
- Front face crop 6×; front versus references 3×; all-head comparison 6×.
- All pixels outside head/hand edit regions match the supplied sprites exactly.

## Remaining weaknesses

The original restrained stoop, hand size, small closed fan and walk poses were retained as requested. The fan still reads as a narrow wooden bundle at native size. Hands retain some source finger divisions. Hair highlights, head proportions and facial expressions vary slightly through the walk cycle. The two later front-walk faces have simpler nose/age planes than the standing front; the age reads primarily through the heavy brow, angular cheek/chin and grey crop. Individual eye and brow clusters are not identical across frames, and some brows merge visually with the upper eye edge. This is not a claim of exact pixel-for-pixel stylistic equivalence with the three reference faces.

## Reproduction and provenance

- Full final prompt set: `../scratch/review2/prompts.json` (17 requests, built-in tool; no API/CLI generation).
- Reduction and compositing: `../scratch/process.py`; assembly: `../scratch/assemble.py`; all-head comparison: `../scratch/review2/face_audit.py`.
- Checks: `../scratch/checks.json`, `../scratch/reduction-report.json`, `../scratch/review2/body-preservation.json`.
- Original supplied big drawings/sprites and notes are backed up under `../scratch/review2/`. Second-pass alternatives are retained there too.
- All authored files and processing stayed in this folder. The installed imagegen instruction file was read as required by the runtime; the image tool also saved its automatic originals in its own storage, from which the returned files were copied into `out/big/`. No external artwork or other character folder was opened.
