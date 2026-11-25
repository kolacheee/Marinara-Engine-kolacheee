# Round 8: text look + stick-figure pose (no art input)

Rule: the ONLY image input is `poses/turnaround-1536x640.png`, an OpenPose-style skeleton drawn from numbers by `poses/make_poses.py`. No earlier outputs as img2img, guide, ControlNet input or tracing.

- Canvas 1536x640. Skeletons are 448 px tall (feet at y=600), so the exact 8x downsample gives ~56 px figures. Front | side (facing right) | back.
- ControlNet: xinsir controlnet-union-sdxl-1.0 promax, union type openpose. Strength 0.6 and 0.8, start 0.0, end 0.7.
- Model, LoRA (1.0), sampler, steps, CFG, clip skip as pass 3. Seeds 11, 23, 37, 41. 2 strengths x 4 seeds x 2 characters = 16 images.
- Common positive: "score_9, score_8_up, score_7_up, simple background, flat grey background, character turnaround, same character, front view, side view, back view, full body, feet visible, fully clothed, standing".
- Wren: "woman, auburn hair tied back in a low ponytail, neat hair, green cloak with the hood down, brown leather jerkin, brown trousers, boots, holding a wooden longbow, quiver of arrows on her back". Negatives as pass 3 plus "hood up, hat".
- Hadrik: "man, very dark skin, short black hair, full black beard, brown leather apron over cream shirt with rolled sleeves, dark brown trousers, heavy boots, holding a blacksmith's hammer with a metal head". Negatives as pass 3 plus "stick, staff, bottle".
- Output art-drop/figures/r8/run/, same layout and measurements as r7 text3, plus per figure: does it match the skeleton's view (front/side/back)?
