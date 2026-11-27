# Generation notes

## Selection

Kept **attempt 3 of 3** as `out/raw.png`. Each attempt was one image-tool call drawing all five characters together, with no attached reference images. Used the built-in image-generation tool. No separate character images or compositing.

Attempt 1 established the five distinct designs, expressive faces, shared scale and hanging fabric, but the detail was too fine and the bodies too tall. Attempt 2 brought the heads and pixel clusters closer to the target, although the rendering remained unevenly fine. Attempt 3 is the best overall match for the requested coarse field-sprite treatment: larger square-looking clusters, readable faces and hands, strong hanging silhouettes, visible three-quarter turns, and consistent character heights and foot alignment. It retains multiple distinct light/shadow levels rather than flat two-tone shading. None of the three was a perfect technical match.

## Original and verification

- File: `raw.png`, PNG, RGB, **1744 × 902 pixels**, the tool's delivered dimensions.
- The selected output was copied without decoding/re-encoding it. Source and destination bytes were compared and their SHA-256 hashes match.
- SHA-256: `4efefc83c3c8ab97a2b157e742cd241619a482f3b13b0d5a46705a922750c45b`.
- No background keying, resizing, palette reduction, grid snapping, retouching or other image processing was performed.
- Visual inspection confirms exactly five full figures, no labels or scenery, and all five specified roles represented.
- A read-only foreground estimate puts the soles around image rows 874–875. Tallest hair begins around row 27; the courier begins around row 33. The shared scale and baseline are close, rather than mathematically exact.

## Honest weaknesses

- The background looks magenta but is **not a flat exact #FF00FF fill**. The top-left pixel is RGB (238, 14, 239); only 23 pixels in the image are exactly (255, 0, 255). It remains untouched as required.
- This is pixel-styled artwork, not a verified uniform low-resolution raster enlarged by nearest neighbour. Some cluster edges and internal shading are softened or contain smaller colour variations. Read-only inspection found 263,848 distinct RGB colours, so it does not meet a strict four-tone-per-material palette or zero-antialiasing requirement.
- The tool did not deliver the requested canvas size. Figures are roughly 842–849 image pixels high, and their underlying logical art-pixel grid cannot be verified. The requested 72–80 art pixels and 8–10 image pixels per art pixel are therefore approximate visual targets, not achieved technical guarantees.
- The large hair helps the three-head impression, but the figures still read somewhat taller than the specified three-head proportions. Some boots and hands are larger than ideal for slim field sprites.
- Lighting broadly follows upper-left highlights, but not every material follows exactly the same four discrete tonal steps.
- A few design details drifted: Tavra's scarf is shorter and her crank is elongated; Nivet's message case reads as an angular leather case; Elluma's mantle covers both shoulders. Orsen's vessel and the hands have simplified shapes rather than perfectly articulated anatomy.

The maximum three attempts were used. The selected original was preserved despite these shortcomings, rather than altering it with prohibited cleanup.

## Exact prompt used for the selected attempt

```text
Create ONE image containing exactly FIVE original fantasy townsfolk FIELD SPRITES side by side on completely flat opaque #FF00FF magenta. No reference images. No lettering, labels, scenery, floor, shadows or other objects. All full bodies, all the same scale, feet on the same invisible baseline, clear gaps between figures.

The whole image should be about 1980 x 792 image pixels, constructed as a 220 x 88 logical-pixel grid magnified 9x with NEAREST NEIGHBOUR. Each character is 72-80 logical ART PIXELS tall (approximately 684 image pixels tall). Every visible art pixel is a flat SQUARE block approximately 9 x 9 image pixels. Coarse 76-pixel field sprites, not high-resolution illustrations with a pixel effect. Keep the grid coarse and UNIFORM even on faces and hands. Hard crisp staircase edges, absolutely NO anti-aliasing, gradients, texture, noise, tiny subpixels, brushwork or painterly blur. Draw four-tone cel-shaded clusters with a single light source at the upper left: warm highlight, midtone, cool shadow, deep occlusion. Selective dark outer contour, coloured inner contours. Artfully designed connected pixel shapes, refined finish.

THREE HEADS TALL: head with hair occupies about 25 of the character's 76 art pixels, torso about 25, slim legs and small feet about 26. Big sculpted hair clumps, well-shaped skull and jaw. Small but clear expressive faces with two eyes, one-pixel eye highlights, brows and a tiny mouth. Anatomically plausible simple hands, thumb plus grouped fingers. Slightly heroic adults. All heads and torsos visibly in FRONT THREE-QUARTER VIEW: one shoulder and cheek closer, both eyes visible, no flat straight-on mugshots. Clothing tails and scarves hang down in bold readable silhouettes.

From left to right, exactly these five newly invented characters:
1. TAVRA QUELL, woman canal-lock keeper, deep brown skin, copper-red hair in a large curled crest and small low braid. Petrol-teal fitted coat with two long tails, cream hanging neck scarf, brass clasps, charcoal slim trousers, little brown boots. One hand at belt, one holding a small square brass lock crank down beside thigh. Calm face.
2. ORSEN VELL, man travelling glassworker, olive skin, thick midnight-blue swept hair. Oxblood cropped leather jacket, ochre shirt, long sand-coloured asymmetric apron flap, sea-green hanging sash, dark slim trousers, small brown boots. Holds a palm-sized turquoise glass vessel at waist, free hand relaxed. Attentive face.
3. NIVET SORR, woman storm-post courier, light freckled skin, silver hair in three bold swept clumps and short nape tail. Burnt-orange capelet with two long hanging scarf ends, navy fitted tunic, cream slim trousers, little navy boots, small cylindrical sealed message case on hip. One hand holds scarf, other relaxed. Determined brows.
4. DASKA RENN, man civic bell tuner, medium brown skin, dark plum curls with a pale temple lock. Violet long waistcoat with staggered tails, ivory sleeves, long moss-green shoulder sash, charcoal slim trousers, small buckle shoes. Holds small silver U-shaped tuning fork pointing down; tiny wooden mallet tucked at belt. Composed face.
5. ELLUMA VASK, woman travelling stage rigger, tawny skin, golden hair in a large folded-loop ponytail and broad side fringe. Forest-green cropped jacket, grey shirt, rust-red sash with two hanging tails, short plum shoulder mantle, navy slim trousers and small work boots. Small neat rope coil at hip, one gloved hand on hip, the other relaxed. Wry little smile.

Five distinct coherent designs, clear four-tone light and shade, shared pixel scale and ground alignment. Premium HD-2D sprite character design with rigorous low-resolution pixel execution. No big-pack merchant, book scholar, dancer, bow hunter, sun-staff cleric, existing game characters, or imitation of any named game's art.
```

