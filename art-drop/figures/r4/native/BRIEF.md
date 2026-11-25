# Lane: native

Read `SPEC.md` first.

Your method: pure pixel art drawn at native resolution, the way a sprite artist works. No generated images at
all, as a pixel source or as a reference. Plan the silhouette first (a 1-colour mass that already reads as
the character), then flats, then the dark-hue outline, then shading clusters, then the face and details. Keep
each step as a separate PNG in `scratch/` so a reviewer can see the build-up. Author pixels as text grids or
in Aseprite (`~/Downloads/marinara-agent-handoff/tools/aseprite/build/bin/aseprite`, scriptable in Lua), and
look at your work at 4x and 8x after every step. Fix what looks wrong; do not stop at "it passes checks".
Animate key poses first (contact, passing), then the in-betweens. Then deliver per SPEC.
