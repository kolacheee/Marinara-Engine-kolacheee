# Round 6: sprite candidates from the local model (ComfyUI, Pony V6 XL + sakuemonq LoRA)

The smoke test proved the LoRA draws on a near-true 8x grid (82% of 8x8 blocks are flat), so an exact 8x mode
downsample gives real pixels. Now get candidates that are actually usable sprites.

Target: original characters for a serious adult RPG in the Octopath Traveler 2 field-sprite look. Stylised
adults about 3 to 3.5 heads tall, a dark coloured outline, clean clusters, grounded costumes. An adult must
come out **50 to 64 px tall after the 8x downsample**, so the figure is 400 to 512 px tall in the 1024
image. The smoke figure was 128 px tall: far too big.

## Characters (same as before)
- **Wren**: a woman ranger in her thirties. Auburn hair in a tied tail, a hooded green travelling cloak worn
  DOWN (face visible), a leather jerkin, bracers, a short bow on her back, a quiver.
- **Hadrik**: a blacksmith in his forties. Very dark skin, black short hair and a full black beard, a leather
  apron over a rolled-sleeve cream shirt, heavy boots, a hammer at his belt.

## How
1. Script ComfyUI through its HTTP API (a workflow JSON), not by hand. Ideas to try, and log which work:
   - Ask for a character sheet: "character sheet, multiple views, front view, side view, back view,
     full body, standing, same character" (remove "multiple views" from the negative). Several small figures
     per 1024-wide image naturally come out about 400 to 500 px tall.
   - Alternatively a single figure at 1024x1024, then a second pass via img2img or a smaller canvas
     (e.g. 832x1216 or 640x1024 portrait) so the figure fills about 450 px.
   - Adult cues: "mature female, 30s", "adult man, 40s, muscular"; negatives: "child, loli, shota, chibi, big
     eyes, petite". Try LoRA strength 0.7, 0.85 and 1.0. Try with and without source_anime.
2. Generate many: at least 40 per character across the variations, with fixed seeds logged.
3. Downsample every image exactly 8x (mode colour per 8x8 block, with the grid phase found by testing offsets
   0 to 7 for the flattest result). Cut out each figure on the flat background and measure its height in
   sprite pixels and its grid flatness.
4. Push to art-drop/figures/r6/candidates/:
   - `wren-sheet.png` and `hadrik-sheet.png`: contact sheets of EVERY downsampled figure at 4x on mid grey,
     numbered, with height and flatness under each;
   - the raw 1024 images for the 12 best-scoring of each, in raw/;
   - `log.md` with the prompts, seeds, strengths and what worked.
Don't clean up or edit any pixels yet. This round only finds the best sources.
