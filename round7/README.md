# Mari theme test — round 7 (2026-11-14)

Build db241fa16 (look enlarges small pictures, transparency on grey), same data folder. Prompt: `feedback7.json`. Day shots with Color scheme = Light, night with Dark (set back to Dark afterwards).

- **Found and fixed wx-flake1 and wx-flake3.** She looked at each sprite, described "lilac outlines and pink halos" on 1 and 3, tinted them, looked at the results before assigning, then looked again at the saved ones. She checked wx-flake2, wx-spark.svg, wx-heart, wx-petalday, wx-starday, wx-batday and wx-moonday and left them unchanged (correctly: 0 pink px).
- Pixel check (`weather-sprites-check.png`): every day sprite and sticker has **0** pinkish pixels. A sweep of all theme pictures flags only night-only ones (wx-leaf, wx-petal, wx-petal2, or-candle flame, rail-night.svg), all used under `:root, :root[data-theme="dark"]`.
- Day snow screenshot / 2x crop: all flakes white with blue edges. **No pink/lilac left in the day look.**
- Night unchanged. updatedAt on the Velvet copy: 14:13:24Z → 14:24:06Z. App folder `git status` empty before and after.
- Small gap: `mari images look --name a,b,c` refuses several names at once (exit 1); she fell back to one look per name.
