# Style D "Earth & Weight": written rules only

A grounded adult field-sprite style for a muted fantasy JRPG: supported stance, compact adult anatomy, quiet expressions, heavy clothing, readable silhouettes. There is no reference image: follow these rules.

## Frame, anatomy and faces
- 96 x 128 logical pixels, RGBA, zero-based. Crown at row 33, lowest planted sole at row 124 (92 occupied rows); rows 0-32 and 125-127 transparent. Centre the whole silhouette, equipment included. (A child: about 70 rows, crown near row 55, same sole row.)
- Four-head construction: one head unit = 23 px crown to chin. Chin near the first quarter, waist near the second, lower legs fill the last. Hair or hats make it approximate (4 to 4.5 heads). Not chibi, no oversized heads.
- Adults: defined jaw, modest neck, real shoulders, a pelvis that supports the torso. Vary build per character (broad, slight, stout, wiry, stooped) so silhouettes differ.
- Eyes: a 1 x 1 dark eye mark (a second adjacent pixel only for a lid or profile). No bright eye glints. Nose: 1 px projection in profile, a small warm plane in front. Mouth: a quiet 1-2 px shadow, never an outlined mouth.
- Hands: 3-5 px mitten mass, one thumb notch, at most one finger division; held objects gripped by a closed readable shape.

## Pixel clusters and contours
- Keep the pixel grid visible. Main plane clusters 2-6 px across (longer vertically on skirts or aprons). Single pixels only for eyes, contour steps, a string, a clasp or a metal glint. No checker dithering, spray texture, gradients or blur.
- Mostly 1 px coloured outline in the darkest tone of the local material (charcoal for boots, black hair, deep overlaps). 2 px dark only for a true overlap or deep crease. On the lit upper/left contour step from edge tone to shadow tone; keep the lower/right contour darker. No pure black or white.

## Light and materials
- Light fixed in screen space at the upper left (about 10 o'clock); never mirrored when the character turns. Every ramp has four roles: edge, shadow, body, light. Body and shadow planes cover most of a material; light is a small accent.
- Hair: 3-5 substantial locks, one light cluster upper-left. Skin: broad face planes, a restrained highlight on nose, cheek or knuckles; faces must contrast with hair. Cloth: folds follow gravity, few and purposeful. Leather: matte, thick hems, few bend shadows. Wood: leather/gold families. Metal: steel ramp, small upper-left highlight, dark lower-right plane. Trim in ochre, mostly 1 px.

## Palette
Each character uses at most 32 colours across all its views. Transparency is binary. Base ramps (edge, shadow, body, light):

| Ramp | Edge | Shadow | Body | Light |
| --- | --- | --- | --- | --- |
| charcoal | #252321 | #3C3530 | #534A40 | #706557 |
| leather | #36291F | #513A2B | #735039 | #96734D |
| moss | #303A2B | #4A5537 | #697448 | #929B64 |
| auburn | #3F2925 | #643A2C | #8B5237 | #B17A50 |
| gold | #57432C | #8A693B | #B79351 | #D5B677 |
| linen | #655D49 | #93856B | #C1B18F | #E4D3AD |
| navy | #202736 | #303E55 | #485A73 | #6B7D90 |
| steel | #343B40 | #5D676B | #929B9B | #C7CBC2 |

Skin ramps (pick exactly one per character, the one its design names):

| Skin | Edge | Shadow | Body | Light |
| --- | --- | --- | --- | --- |
| fair | #785343 | #AC7F62 | #D2A781 | #EBC8A1 |
| tan | #6B4530 | #93603F | #B98258 | #D7A57A |
| olive | #5E4A33 | #85694A | #A98B66 | #C9AE88 |
| deep | #2E211C | #4A3226 | #6B4936 | #94694F |

If a design needs a colour family not listed (a true red, maroon, purple, teal...), add ONE new four-tone ramp in the same muted, earthy value range (edge darkest, light about as bright as the other light tones), and record it in your notes.

## Views and walk
- Generate the side view (facing right) first; lock hair silhouette, garment lengths, equipment and proportions from it before drawing any other view. Front and back are straight views; no face on the back. Equipment stays in the same hand in every view.
- Walk: relaxed town walk. Contact = heel-to-toe, short stride; passing = planted leg under the pelvis, the moving foot only a few pixels off the ground. Torso almost upright, small opposite arm swing, no high knees, no marching. Lowest support sole on row 124.

## Reduction and cleanup (from a big image-tool drawing on flat magenta)
1. Key out the magenta background (range key if it is not exactly #FF00FF).
2. Crop to the figure, scale so the figure is 92 px tall (child 70), placing the sole on row 124. Use an area/box reduction, not a single nearest-neighbour sample.
3. Palette snap: build a skin mask (face, neck, hands, bare feet) and snap those pixels ONLY to the character's skin ramp; snap everything else to the other ramps it uses. Skin never maps to a non-skin ramp and nothing else maps to skin.
4. Alpha on/off only; no semi-transparent pixels.
5. Face pass (required on every view that shows a face): after the snap, both eyes must exist as 1 px dark marks with skin on both sides, and the mouth (or beard edge) must be readable. If not, redraw that view with the image tool (bigger head in the source, clearer eyes) and reduce again. Never paint the face in with code.
6. Apply the outline rule above if the reduction left the contour broken.
