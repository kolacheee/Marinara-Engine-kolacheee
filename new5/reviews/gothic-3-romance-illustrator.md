## Nightshade Parlour (gothic): judge report

### 1. Verdict: 7/10 for authenticity

Speaking as a lover of cemetery gardens: the ironwork and the cameos are the real thing. The fence has scrolled panels, fleur-de-lis finials, ball-capped piers and an arched gate, which is honest Victorian railing. The cameo and the locket are the best pieces in the set. The day palette is correct pastel goth, and the night is a good, restrained traditional-goth relight: oxblood and black roses, a silver moon, a lit lantern.

The weak point is that it reads as **a garden fence in front of an empty sky, not a parlour**. There is no cemetery, no stone and no mourning material anywhere. It sits at the "cute stationery border" end of gothic. The trim band is also effectively missing, and the bats sprite is drawn in a cartoon style that doesn't match anything else. Every centre stays calm and readable, so the set is very usable. The day/night/weather variants hold together well, with the same composition throughout.

### 2. Per image

- **backdrop-day**: KEEP. Correct palette, crisp iron, clean centre.
- **backdrop-night**: KEEP. Even dark centre, lantern contained at the gate, moon in the corner. If anything, add a faint silver rim to the fence tops; it is barely there.
- **backdrop-overcast-day**: TWEAK. The sky is right, but the bats stayed (rainy-day bats is odd). Remove them and add a visible wet sheen or puddle reflection on the paving.
- **backdrop-overcast-night**: KEEP. The storm clouds hug the top, the lantern pool on the wet paving is lovely, and the bats are gone.
- **backdrop-snow-day**: TWEAK. Lovely snow-capped finials. Remove the bats, and push the ironwork darker: the snow relight greyed it to slate, and the black iron is the theme's anchor.
- **backdrop-phone-day**: KEEP. The top/bottom composition works and the calm band is clean.
- **backdrop-phone-night**: KEEP. It matches the desktop night.
- **backdrop-phone-overcast-day**: TWEAK. Remove the bats here too.
- **topbar-band-day**: REDO. What came out is a 1-2 px wavy dark line across the middle of the strip. There is no lace, no scallops, no bat or rose motifs, and no pink ribbon. Regenerate with the lace filling the bottom ~45% at a readable scale (scallops ~30-40 px tall at 96 px strip height) and the ribbon actually visible. If the model keeps failing, draw it in code.
- **topbar-band-night**: REDO. Same failure; rebuild it from the redone day strip.
- **wx-petals**: KEEP. They are beautifully curled, with good vein texture, and match the backdrop petals.
- **wx-petals-night**: KEEP. Velvet crimson/oxblood is exactly right. Petal 3 is close to black; that is fine.
- **wx-bats**: REDO. The bats are flat cartoon stickers with big round eyes, and the eyes are magenta, so they would render as see-through holes. The backdrop bats are plain silhouettes. Redo them as eyeless silhouettes with membrane-scalloped wings, matching the backdrop bats.
- **avatar-char** (cameo): KEEP. Carved shell-cameo relief, mint ground, jet filigree, pink paste stones. Excellent.
- **avatar-char-night**: KEEP. Onyx and silver with garnets; a true mourning cameo.
- **avatar-user** (locket): TWEAK. The heart reads as glossy plastic or candy. Give the enamel some guilloché texture under it or a hinge line, so it reads as a metal locket.
- **avatar-user-night**: TWEAK. Same change as the day locket. The silver frame itself is good.

### 3. Missing or wrong

- **Cemetery motifs are absent.** The prompts banned skulls and crosses, which is fine, but nothing replaced them. A fan expects a weathered marble urn on a plinth, an obelisk or angel finial silhouette behind the fence, ivy on stone piers, and perhaps a weeping willow at one edge. These can be gentle and stay at the edges.
- **No parlour at all**, despite the name. Ideas for the edges: a velvet swag curtain, a damask wall, a gilt or jet picture frame, a candelabra.
- **Materials are thin.** The iron has no rust, patina or hand-forged irregularity. Roses have no fallen-leaf or lichen texture.
- The ground is plain grey paving. Mossy flagstones or a gravel path would ground it in the era.
- **Gaps in the set:** there is no snow-night backdrop, no phone overcast-night and no phone snow. All three are needed for parity.

### 4. Weather

- **Day, clear:** pastel rose petals (as made) plus occasional small moths in pale lilac.
- **Night, clear:** crimson petals plus silhouette bats, rare and slow. Fireflies or will-o'-wisp motes in pale silver-violet, used sparingly.
- **Rain:** wet petals that fall faster and heavier. At night, drifting fog or mist wisps low across the bottom third (a cemetery must have fog).
- **Snow:** lilac-white flakes by day; at night, silver-white flakes with a frost glint.
- **Autumn or wind:** dark ivy and willow leaves.
- Drop bats from daytime rain and snow.

### 5. Top 3 redesign moves

1. **Rebuild the topbar lace band.** It is currently invisible and it is the most visible always-on element. Make real scalloped black lace with the ribbon, at legible scale.
2. **Put the cemetery and parlour into the edges.** Add a marble urn or angel silhouette behind the fence on one side, stone gate piers with ivy, and perhaps a velvet swag at the top corners. Keep the centre calm.
3. **Unify the creatures and fill the variant gaps.** Make the wx-bats silhouette bats with no eye holes. Remove bats from the rain and snow day scenes. Add fog wisps as a rain-night particle. Generate snow-night, phone-overcast-night and phone-snow.

Note: the topbar previews are 1400x47 downscales. I zoomed 4x to confirm that no lace detail exists; the strip is only a thin wavy line.
