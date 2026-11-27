# Round 21: fix the style-D figures that look off (owner 2026-11-27 13:30 Berlin)

Owner: "I like the style but many of them look off." Input check: round 20 used only the owner-picked r19/d-grounded sheet + its sprites and each character's own new drawings (NOTES-*.md confirm); no rejected rounds. The off look comes from style D's processing recipe:
- deep_skin ramp is nearly black (#211C1C..#79553F): dark-skinned faces (hadrik, cleric) collapse into one blob with no readable eyes/nose.
- no olive/tan/golden skin ramps: merchant and bard skin snaps to gold/moss, so the bard's face goes yellow-green.
- the single NEAREST downscale drops 1-px eyes and mouths at random: child has no eyes, farmhand's face is washed out.
- noble's head is small for her gown; mage reads as an old woman (silver hair).

Fixes (apply to STYLE.md copy in r21/STYLE.md, everything else as r20):
1. Skin ramps (4 tones each, shadow->light): fair #785343 #AC7F62 #D2A781 #EBC8A1 (unchanged); tan #6B4530 #93603F #B98258 #D7A57A; olive #5E4A33 #85694A #A98B66 #C9AE88; deep #2E211C #4A3226 #6B4936 #94694F (lighter top so features read). Characters pick the skin ramp named in their text.
2. Face pass: after the downscale, both eyes must be present as 1 px dark marks with skin on both sides, and the mouth/beard edge readable. If not, redraw that view with the image tool (no pixel painting).
3. Palette snap never maps skin to a non-skin ramp: skin pixels (face/hands mask) snap only to that character's skin ramp.
Redraw with the r19/d-grounded sheet + STYLE as reference, 15 views each, own new drawings only:
- hadrik (deep), cleric (deep), bard (olive), merchant (olive), child (fair; clear eyes, less doll-like: small adult-style eyes, slightly longer face), farmhand (fair, readable face), noble (fair; head a touch larger, 4 heads, softer expression), mage: YOUNG woman about 25, long dark auburn hair in a braid (not silver), same purple robe and satchel.
Keep the other 7 from r20.
Outputs art-drop/figures/r21/run/ like r20, plus LINEUP.png with all 15 (7 from r20 + 8 new) and a FACES.png crop strip of all 15 front faces at 6x.
