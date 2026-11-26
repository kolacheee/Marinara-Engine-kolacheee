# Round 16: one person per character by building views from one chosen side view (same run)

Round 15 verdict (my check of the sheets, stricter than the run log): only Wren seed 41 is a clean, consistent set. Innkeeper 88 is close (apron flips brown/red between walk frames, mug comes and goes). Every other set fails: giant straw hats (farmhand), hair colour changes between views (farmhand 88, merchant 88), blobs behind or above the head (hadrik), stick legs on front/back (noble, merchant 41), halos/orbs (seed 7 everywhere). Cause: every view is drawn independently, so consistency is luck, and the style tag "intricate costume details" grows hats and props into explosions.

Inputs: round 14 number-drawn skeletons only, plus images made earlier IN THIS SAME RUN (the chosen side view). Nothing from rounds 1-15, no IP-Adapter, no game images.
Recipe = round 15 except:
- Style tags become "detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors" (drop "intricate costume details"). Negative also adds "halo, glowing aura, orb, light rays, sparkles, floating object, sack, cloud, explosion".
- Character text: no hats or carried props for now (guard: no cap, no spear; farmhand: no hat; priest: no staff; innkeeper: no mug; hadrik: no hammer; merchant: headscarf kept but "small tight headscarf"). Props and hats come later as separate layers.
- Colour words doubled where round 15 drifted: merchant "mustard yellow dress, mustard yellow", innkeeper "dark brown apron, dark green waistcoat".

Steps per character (8 characters, as round 13 text with the edits above):
1. Side view: 8 seeds (41, 23, 88, 5, 12, 64, 101, 333). Auto-reject: figure height outside 86-100 px after the 8x shrink, figure width > 0.75 x height, or any opaque blob not touching the figure. Pick the survivor whose head/height ratio is closest to 0.2; log the reason.
2. Walk 0-3: from the chosen side image (full-res, before shrink), inpaint ONLY the region below the hips (mask = rows from the hip keypoint down, padded 24 px) with the walk-side-N skeleton at openpose 0.8, same seed and text, denoise 0.85. Upper body stays identical across frames.
3. Front and back: 8 seeds each with the round 15 front/back ControlNet (0.65, end 0.8), same auto-rejects plus a stick-leg check (any leg column under 3 px wide over 10+ rows after the shrink). Among survivors pick the one whose colour histogram (opaque pixels, 16 bins per channel) is closest to the chosen side view; log the distances.
Output art-drop/figures/r16/run/: sprites/ (chosen 7 per character, 8x shrink), rejects/ thumbnails sheet per character with the reason under each, one sheet per character (front | side | back | walk 0-3), log.md. Keep the laptop awake for the run as in round 15.
