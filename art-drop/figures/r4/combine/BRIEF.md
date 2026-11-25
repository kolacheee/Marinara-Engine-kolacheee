# Round 4 combine pass

Your folder is a copy of the "sheetgen" lane: its scratch/, tools and out/. `ref-paintdown/` holds another lane's
output for the same two characters. Read `SPEC.md` again. The owner's target is Octopath Traveler 2 field
sprites, with original characters only.

Judgement of round 4:
- sheetgen (yours): the best motion. The walk has a real stride, the arms swing and the cape trails. But the
  drawing WOBBLES between frames (face, hair and costume details are redrawn differently in every frame), and
  the left-row frame 6 has a broken leg.
- paintdown (`ref-paintdown/`): rock-steady design from frame to frame, but its walk barely strides.
- Both: Wren reads as a teenager. She is in her thirties.

Do this:
1. **Lock one master design per character and facing.** Pick the best standing frame for down, left and up,
   and clean it at native size. Age Wren to her thirties: a slightly longer face and neck, smaller eyes
   (no big anime eyes), a firmer jaw and brows, a touch more height, and adult proportions within the
   ~3.3-head style. Keep the design (palette, costume, hair) exactly the same in every frame.
2. **Rebuild every walk frame from the master.** Keep your current walk's poses as the motion guide, but make
   each frame by moving and redrawing the master's limb, cape and hair clusters. The head, face and torso
   details stay pixel-identical except for the bob and turn. Fix the broken leg. The cycle: contact, down,
   passing, up, contact, passing (mirror). Legs clearly part and pass, and arms swing opposite.
3. Make the idle frames the same way, from the master.
4. Rebuild all deliverables per SPEC, plus `consistency.png`: each walk row at 4x with a difference overlay
   against the master, so frame-to-frame drift shows.

Before you finish, check `in-world-close.png` and `walk.gif`. The walk must not shimmer or redraw the face.
Write NOTES.md honestly.
