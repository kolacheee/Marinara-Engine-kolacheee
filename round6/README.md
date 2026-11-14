# Mari theme test — round 6 (2026-11-14)

Build ce6735c6b, same data folder. Prompt: `feedback6.json` (st-bat + sweep every day picture). Day shots with Color scheme = Light, night with Dark (set back to Dark afterwards).

## What she changed (9 pictures, each looked at before and after)
st-bat.webp, st-bunny.webp, wx-batday.webp, wx-moonday.webp, wx-starday.webp, wx-petalday.webp, wx-heart.webp, wx-flake2.webp, wx-spark.svg (SVG rewritten, same name).
She looked at ~35 pictures in total (all stickers, ornaments, backgrounds, SVG trims, weather sprites).

## Checks
- st-bat on the first message: **blue** (`velvet-day-sticker-1-2x.png`). Trim, crosses, heart-bat, skull: blue.
- Day weather colour tokens are all blue (the CSS comment "Lilac rain… pink bolts" is stale).
- **Still pink in the day look:** `wx-flake1.webp` and `wx-flake3.webp`, white snowflakes with pink outlines (~50% pinkish pixels), used only by the day snow (`:root[data-theme="light"]`). Visible in `velvet-day-day-snow-desktop.png` / `velvet-day-snow-crop.png`, sprites side by side in `weather-sprites-check.png`. She looked at both and left them.
- wx-petal / wx-petal2 / wx-leaf are red-pink but used only at night, which is fine.
- Night look unchanged (`velvet-night-*`).
- updatedAt on the Velvet copy: 14:05:22Z → 14:13:24Z.
- App folder: `git status` empty before and after (`app-folder-*.txt`); she removed her temporary `.mari-wx-spark.svg`.
