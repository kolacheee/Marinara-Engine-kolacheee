## Saltwind Harbor (nautical): judged by a lover of seaside travel posters

**1. Verdict: 5.5/10 for authenticity**

The bones are right. The red-and-white lighthouse on the right, the rope-wrapped pile on the left, the far sail, the gulls, a navy sea and wide open sky in the middle: that is a travel-poster layout, and every backdrop keeps the centre calm enough for chat. The rendering is the problem. None of this is gouache. The day plates are smooth digital airbrush with soft gradients. The storm plates are photoreal matte painting, with volumetric cloud and spray that looks like a photo. Real seaside gouache has flat, opaque colour areas, hard silhouettes, a small fixed palette and drawn wave shapes, not rendered foam. The two storm plates also break the theme's palette. Their sea goes teal-green and black-green, the brass has disappeared, and the red bands are the only part that still matches. The avatars are the strongest pieces. The trim strip is wrong.

**2. Per image**

- **backdrop-day: TWEAK.** The best composition in the set, but it reads as smooth vector or airbrush. Flatten it: 3 to 4 flat sky bands, waves drawn as white strokes, rocks as 2 to 3 flat tones. The pile is cropped tight at the left edge; let it show a bit more of its brass-coloured rope.
- **backdrop-night: TWEAK.** The beam is a long wedge reaching about 70% across the top and through roughly y 5 to 15%, which is about the 15% the prompt allowed. Shorten it to about 35% and make it a flat, hard-edged wedge. A blurry glow is wrong for this style. The navy is excellent.
- **backdrop-overcast-day: REDO.** Photoreal storm, with dramatic cloud texture through the middle. Off-style and busy. Repaint it in poster style: flat slate cloud bands, a stylised breaking wave drawn as a curl with a white crest, and a flat sea in a blue that matches the palette, not green-grey.
- **backdrop-overcast-night: REDO.** Same photoreal problem, and the sea is black-green. The sailboat should be gone, but it is still there with its lantern lit. The beam lighting the cloud underside works and should stay.
- **backdrop-snow-day: KEEP (minor tweak).** Calm and on-palette, with nice snow caps on the pile and gallery. The gulls and the white clouds don't belong on a pale overcast winter sky. Remove the clouds or flatten them into the grey.
- **backdrop-phone-day: KEEP.** Clean, with a calm band. Same flattening note as the day plate.
- **backdrop-phone-night: KEEP.** The short beam is exactly right. The stars are faint, so lift them slightly.
- **backdrop-phone-overcast-day: REDO.** The photoreal storm sky textures the whole calm band. Match the desktop redo.
- **topbar-band-day: REDO.** The "hemp" came out as grey steel cable (about #8a8a8a). It hugs the bottom edge and looks cropped. It also doesn't match the night band.
- **topbar-band-night: TWEAK.** The colour is right (brown hemp), but the rope floats above the bottom edge and is very thin. Regenerate both bands as a pair with the same position and thickness.
- **avatar-char: KEEP.** The brass porthole and sea view are lovely and painterly. Its rivets are lumpy, but fine.
- **avatar-user: KEEP.** The compass rose on navy enamel in signal red and white, inside a brass rim, is the most on-palette piece in the theme.

**3. Missing or wrong**

- **Missing: gouache texture.** Flat opaque shapes, a slight dry-brush edge and visible paper grain are absent from every backdrop.
- **Wrong: brass is nearly absent.** It appears only in the avatars. Add brass to the backdrops: a brass ship's bell or a brass-capped bollard instead of the bare timber pile, or a brass lamp housing on the lighthouse.
- **Missing: signal flags.** A plain triangular red pennant or striped bunting at the edge is classic seaside poster. Blank, with no symbols.
- **Missing: the harbour.** "Saltwind Harbor" promises a harbour, and there isn't one: no harbour wall, beach huts, striped awnings or bunting. It is just a lighthouse at sea.
- **Clashes:**
  - The storm plates are photoreal and green.
  - The day rope is grey.
  - The day and snow skies are a little washed out. Posters use a deeper cerulean that steps down in flat bands.

**4. Weather**

None of the four expected weather sprite sheets (wx-*.png) exists for nautical. The prompt list has no wx request and the raw folder has none.

- **Day, clear:** drifting white gulls, 4 flat two-tone silhouettes in different wing poses. Optionally sea-spray dots or small sea-foam puffs near the bottom.
- **Day, storm/rain:** wind-blown spray droplets as flat white and pale-blue teardrops, plus small scraps of tumbling sea foam.
- **Night:** soft sea-mist wisps (flat translucent blue-grey curls). Slow-blinking buoy lights in warm amber and signal red are a strong option.
- **Snow:** flat round flakes are fine, since the app draws its own snow. A nautical touch would be sleet-like ice pellets in pale slate.
- **Optional extra:** drifting paper sailboats or small signal pennants as a whimsical fair-weather set.

**5. Top 3 redesign moves**

1. **Commit to true gouache poster rendering in every prompt.** Ask for flat opaque colour shapes, hard silhouettes, a limited palette (navy #13294b, sea #1f4f86, white, signal red #c8332b, brass #c9a24a, sand) and paper grain, with no photoreal clouds or spray. Redo all three storm plates on that basis, keeping the sea blue, not green.
2. **Fix the trim as a matched pair.** Use one tan hemp rope (#c9a46a / #8a6a3a) or a brass rail with knotted rope, the same thickness and position in day and night, sitting on the bottom edge and not cropped. Also add the missing wx sheets (gulls, spray, mist, buoy lights).
3. **Bring in the harbour and the brass.** Swap the bare pile for a brass-capped bollard or ship's bell. Add a blank signal pennant or a bit of harbour wall at the edges. Shorten the night beam on desktop to about the phone version's length.

Previews read from `/tmp/claude-1000/-home-kolache-Documents-GitHub-Marinara-Engine--claude-worktrees-objective-lamport-25df1d/4a483336-2a08-4dcb-b8f9-7aadb2b4ab0d/scratchpad/judge/nautical/`. No files were created or edited.
