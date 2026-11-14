# Mari theme test — round 3 (2026-11-14)

Build `claude/project-thread-2pgsk6` @ fb29e9a0a (look-image fix 97729fb92 + handbook update), same data folder, Mari on gpt-6-astra. Prompts: `feedback3.json`.

## Results
- **Pictures on the repo build:** she looked at harbor-day-background.webp and described it ("turquoise water, bright reflections, white stone terraces, and dark leafy shadows make unbacked text unreliable"). No "notices without pictures".
- **Harbor phone names/times:** fixed. Cream plates by day, dark blue-grey at night, no extra rows (screenshots harbor-*-phone).
- **Café Home picture:** fixed placement. Version 3 is now the Home backdrop; What's new no longer has the strip. Still weak: the Home title and the Conversation/Roleplay/Game/Professor/Widgets buttons sit on the busy window art with no plates (handbook rule), most visible in light on phone (cafe-light-home-phone.png).
- **Blue Velvet day palette:** fixed for bubbles, cards, sidebar, composer (velvet-day-*). Leftovers still lavender/pink: the picket trim along the top bar, the cross ornaments on cards, and the pink bow / skull stickers.

## Other findings
- `mari db transform` (how she edited Velvet) does not bump the theme's `updatedAt`.
- She writes transform scripts (`velvet-blue.mjs`, `velvet-day-blue.mjs`) into the app's install folder (repo root), where they stay as untracked files.
- The app's Appearance > Color scheme was "Dark", which overrides the theme's time-based scheme; day screenshots were taken with it set to Light, then set back to Dark.
