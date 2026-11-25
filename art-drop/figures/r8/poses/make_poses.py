"""Draw OpenPose-style (COCO-18) stick skeletons from numbers only. No image input.
Canvas 1536x640, three views (front, side facing right, back), each 448 px tall
so an exact 8x downsample gives ~56 px figures."""
import math
from PIL import Image, ImageDraw

W, H = 1536, 640
FIG = 448
FEET = 600
LIMBS = [(1,2),(1,5),(2,3),(3,4),(5,6),(6,7),(1,8),(8,9),(9,10),(1,11),(11,12),(12,13),(1,0),(0,14),(14,16),(0,15),(15,17)]
COLORS = [(255,0,0),(255,85,0),(255,170,0),(255,255,0),(170,255,0),(85,255,0),(0,255,0),(0,255,85),(0,255,170),(0,255,255),(0,170,255),(0,85,255),(0,0,255),(85,0,255),(170,0,255),(255,0,255),(255,0,170),(255,0,85)]

def s(v):  # fraction of figure height
    return v * FIG / 448

def view(cx, kind):
    y0 = FEET - FIG
    k = {}
    if kind in ("front", "back"):
        sgn = -1 if kind == "front" else 1  # character's right on image left when facing us
        k[1] = (cx, y0+s(110))
        k[2], k[5] = (cx+sgn*s(50), y0+s(122)), (cx-sgn*s(50), y0+s(122))
        k[3], k[6] = (cx+sgn*s(60), y0+s(195)), (cx-sgn*s(60), y0+s(195))
        k[4], k[7] = (cx+sgn*s(62), y0+s(262)), (cx-sgn*s(62), y0+s(262))
        k[8], k[11] = (cx+sgn*s(26), y0+s(255)), (cx-sgn*s(26), y0+s(255))
        k[9], k[12] = (cx+sgn*s(27), y0+s(350)), (cx-sgn*s(27), y0+s(350))
        k[10], k[13] = (cx+sgn*s(28), y0+s(440)), (cx-sgn*s(28), y0+s(440))
        k[16], k[17] = (cx+sgn*s(30), y0+s(55)), (cx-sgn*s(30), y0+s(55))
        if kind == "front":
            k[0] = (cx, y0+s(62))
            k[14], k[15] = (cx+sgn*s(14), y0+s(48)), (cx-sgn*s(14), y0+s(48))
    else:  # side, facing image right: character's right side toward camera
        k[1] = (cx, y0+s(110))
        k[0] = (cx+s(30), y0+s(62)); k[14] = (cx+s(18), y0+s(50)); k[16] = (cx-s(6), y0+s(56))
        k[2], k[5] = (cx+s(6), y0+s(124)), (cx-s(6), y0+s(120))
        k[3], k[4] = (cx+s(14), y0+s(195)), (cx+s(22), y0+s(262))
        k[6], k[7] = (cx-s(12), y0+s(195)), (cx-s(18), y0+s(260))
        k[8], k[11] = (cx+s(4), y0+s(255)), (cx-s(4), y0+s(253))
        k[9], k[10] = (cx+s(22), y0+s(350)), (cx+s(30), y0+s(440))
        k[12], k[13] = (cx-s(14), y0+s(350)), (cx-s(24), y0+s(440))
    return k

def draw(views, path):
    img = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    for k in views:
        for i, (a, b) in enumerate(LIMBS):
            if a in k and b in k:
                c = tuple(int(v*0.6) for v in COLORS[i])
                d.line([k[a], k[b]], fill=c, width=8)
        for i, p in k.items():
            d.ellipse([p[0]-5, p[1]-5, p[0]+5, p[1]+5], fill=COLORS[i])
    img.save(path)

draw([view(320, "front"), view(768, "side"), view(1216, "back")], "turnaround-1536x640.png")

# Round 8b: single-view canvases (same 448 px skeleton height) so each view gets its own prompt.
def draw_single(kind, path, w=1024):
    global W
    old = W; W = w
    draw([view(w // 2, kind)], path)
    W = old

for kind in ("front", "side", "back"):
    draw_single(kind, f"single-{kind}-1024x640.png")

# Round 9: 4-frame side walk (contact, pass, contact mirrored, pass mirrored), facing right, same 448 px height.
def walk_frame(cx, phase):
    k = view(cx, "side")
    y0 = FEET - FIG
    a = [1, 0, -1, 0][phase]          # leg swing: +1 right leg forward
    lift = [0, 1, 0, 1][phase]        # passing frames lift the body slightly
    dy = -s(6) * lift
    for i in list(k):
        k[i] = (k[i][0], k[i][1] + dy)
    hip = s(255) + dy
    def leg(knee_i, ank_i, fwd):
        kx = cx + s(34) * fwd; ax = cx + s(52) * fwd
        k[knee_i] = (kx, y0 + s(350) + dy - (s(8) if fwd < 0 else 0))
        k[ank_i] = (ax, y0 + s(440))
    if a:
        leg(9, 10, a); leg(12, 13, -a)
    else:  # passing: one leg under body, the other bent behind
        k[9], k[10] = (cx + s(6), y0 + s(350) + dy), (cx + s(4), y0 + s(440))
        k[12], k[13] = (cx - s(4), y0 + s(345) + dy), (cx - s(22), y0 + s(420))
    # arms swing opposite to legs
    k[3], k[4] = (cx - s(16) * a + s(4), y0 + s(195) + dy), (cx - s(30) * a + s(6), y0 + s(258) + dy)
    k[6], k[7] = (cx + s(16) * a - s(4), y0 + s(195) + dy), (cx + s(30) * a - s(6), y0 + s(258) + dy)
    return k

old = W
W = 1024
for p in range(4):
    draw([walk_frame(512, p)], f"walk-side-{p}-1024x640.png")
W = old

# Round 9b: one sheet with side, walk 0-3 and back, so the model keeps one body across them.
W = 1792
xs = [150, 450, 750, 1050, 1350, 1650]
draw([view(xs[0], "side")] + [walk_frame(xs[i + 1], i) for i in range(4)] + [view(xs[5], "back")], "sheet-side-walk-back-1792x640.png")
W = old
