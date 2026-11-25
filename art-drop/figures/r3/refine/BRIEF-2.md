# Round 3, pass 2: the same folder, with three fixes

Your round 3 pass improved the poses and the walk. Judged in `out/in-world-close.png` and `out/before-after.png`, these three things still fail:

1. **The sunlight is too faint.** At play zoom the figures still read as flat colour. Compare with `ref/lit-in-world-close.png`: there, every figure has an obvious lit left side and a darker right side from across the square. Push yours until it reads that clearly. The lit planes on the head, shoulders, the left sleeve and the left side of the torso and legs should be one to two ramp steps lighter than now. The right side and the underside of the arms, the hem and the lower legs should be one step darker. Keep within the ramps. Faces keep their eye and brow marks.
2. **The horned figure's face** still reads as a blue-grey smudge at 1x. If that figure uses a grey or ashen skin target, choose a warmer, more saturated target for the sample, or raise the lit-side skin shade. Separate the face from the hair with a dark hairline row. Make the horns a clearly different material: pale tips and a dark base. Check this on every skin tone in the horned-face board.
3. **Side walk passing frames** (left row, frames 2 and 5): the two legs merge into one bulging shape. Keep the back leg a shade darker and one pixel apart from the front leg, so two legs read. Do the same check on the down row, frames 1 and 4.

Rebuild everything in `out/`. Update `before-after.png` so it shows the round-2 lineup, then the round-3 pass-1 lineup (keep a copy now as `scratch/pass1-lineup.png`), then this pass's lineup. Update NOTES.md. Judge `in-world-close.png` at full size against `ref/lit-in-world-close.png` before you finish. If the light still reads fainter than the reference, keep going.
