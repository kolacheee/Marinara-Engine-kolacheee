# Round 8d: gentler IP-Adapter sweep: log

Only image inputs: the single-view skeletons in poses/ (drawn from numbers) and, for side/back, IP-Adapter with reference = this run's own front view raw at the same seed (the fronts were regenerated fresh in 8d at CFG 5 instead of reusing 8c's files). No earlier round's output used.
All passes: Pony V6 XL + sakuemonq LoRA 1.0, xinsir union promax openpose 0.8, start 0, end 1.0, euler_ancestral 24 steps, CFG 5, clip skip 2, 1024x640, plus 'plain flat grey background, no gradient'. Seeds 11 and 41.
Side/back add IPAdapterAdvanced (ip-adapter-plus_sdxl_vit-h, CLIP ViT-H, combine concat, embeds scaling V only): A = 0.25 linear 0.0-0.8; B = 0.40 linear 0.3-0.8; C = 0.40 style transfer 0.0-1.0; D = 0.60 style transfer 0.0-1.0 (linear is the plugin's standard type).
Heights are after the exact 8x downsample with grid-phase search; flat = share of the figure's 8x8 blocks with max channel spread <= 8.

## wren

| seed | setting | front h | side h | back h | figures (f/s/b) | mean flat |
|---|---|---|---|---|---|---|
| 11 | A | 60 | 49 | 59 | 1/1/1 | 0.23 |
| 11 | B | 60 | 49 | 60 | 1/1/1 | 0.18 |
| 11 | C | 60 | 49 | 61 | 1/1/1 | 0.25 |
| 11 | D | 60 | 61 | 66 | 1/1/1 | 0.65 |
| 41 | A | 64 | 78 | 78 | 1/1/1 | 0.67 |
| 41 | B | 64 | 78 | 72 | 1/1/1 | 0.68 |
| 41 | C | 64 | 78 | 72 | 1/1/1 | 0.68 |
| 41 | D | 64 | 68 | 78 | 1/1/1 | 0.69 |

Best seed by score for wren by mean figure score (raw/ holds all their images): seed 11 (0.81), seed 41 (0.74)

## hadrik

| seed | setting | front h | side h | back h | figures (f/s/b) | mean flat |
|---|---|---|---|---|---|---|
| 11 | A | 61 | 76 | 76 | 1/1/1 | 0.61 |
| 11 | B | 61 | 63 | 78 | 1/1/1 | 0.57 |
| 11 | C | 61 | 76 | 76 | 1/1/1 | 0.65 |
| 11 | D | 61 | 75 | 78 | 1/1/1 | 0.65 |
| 41 | A | 63 | 78 | 78 | 1/1/1 | 0.70 |
| 41 | B | 63 | 78 | 78 | 1/1/1 | 0.69 |
| 41 | C | 63 | 78 | 78 | 1/1/1 | 0.71 |
| 41 | D | 63 | 78 | 78 | 1/1/1 | 0.71 |

Best seed by score for hadrik by mean figure score (raw/ holds all their images): seed 11 (0.71), seed 41 (0.70)


## Burn / facing / same-person check (by eye, on the 8x-downsampled images)

No setting burns the way 8c did, and the side and back skeletons are followed in all 32 images (side in profile facing right, back from behind). Backgrounds are no longer flat on most side/back images (soft blue/purple/brown gradients, strongest at seed 41), which is why many side/back heights read 72-78 px: the cutter grabs gradient background, so those numbers are not real figure heights. The seed-11 Wren side views read 49 px and look slightly smaller than the front.

| char / seed / setting | burnt colour? | side facing | back facing | same person as the front? (hair shape, colours, cloak/apron, bow/hammer) |
|---|---|---|---|---|
| wren 11 A | no | yes | yes | partly: auburn ponytail kept; cloak shrinks to a teal scarf and shirt; no bow |
| wren 11 B | no | yes | yes | partly: as A, cloak mostly gone |
| wren 11 C | no (cooler, bluer) | yes | yes | partly: teal shirt instead of green cloak |
| wren 11 D | slight pink glow | yes | yes | partly: as C, pinker skin |
| wren 41 A | no | yes | yes | mostly: green-teal cloak and auburn hair kept, hair brighter red |
| wren 41 B | no | yes | yes | mostly: as A, back hair spikier |
| wren 41 C | no | yes | yes | mostly: cloak and hair kept, cloak more cyan |
| wren 41 D | slight (bright cyan cloak) | yes | yes | mostly: shape kept, colours more saturated |
| hadrik 11 A | no | yes | yes | partly: cream shirt and dark trousers kept; hair turns blue-black and bushier; skin redder; no hammer (none on the front either) |
| hadrik 11 B | no | yes | yes | partly: as A |
| hadrik 11 C | no | yes | yes | partly: as A, hair blue |
| hadrik 11 D | no | yes | yes | partly: as A, hair blue |
| hadrik 41 A | no | yes | yes | mostly: grey apron, brown shirt kept; purple tint; hair bushier |
| hadrik 41 B | no | yes | yes | partly: apron kept; hair becomes a topknot on the back |
| hadrik 41 C | no | yes | yes | mostly: apron and shirt kept; hair similar |
| hadrik 41 D | no | yes | yes | partly: hair becomes a topknot; apron lighter |

Summary: the gentler settings fixed both 8c failures (no burn, skeleton followed). Likeness to the front is partial: silhouettes and main garments mostly carry over at seed 41, less at seed 11; hair shape and colour drift (Hadrik's hair goes blue-black or into a topknot), and neither the bow nor the hammer appears in any view, including the fronts. Setting C (0.40 style transfer) is the steadiest overall; D adds saturation; A and B are close to each other.
