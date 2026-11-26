"""Chibi OpenPose (COCO-18) skeletons from numbers only (owner 11-26: chibi look, ~2.7 heads tall).
Figure box 448 px tall (feet y=600) -> ~56 px after the exact 8x downsample; head ~ top 37%."""
from PIL import Image, ImageDraw
FIG, FEET = 448, 600
LIMBS = [(1,2),(1,5),(2,3),(3,4),(5,6),(6,7),(1,8),(8,9),(9,10),(1,11),(11,12),(12,13),(1,0),(0,14),(14,16),(0,15),(15,17)]
COLORS = [(255,0,0),(255,85,0),(255,170,0),(255,255,0),(170,255,0),(85,255,0),(0,255,0),(0,255,85),(0,255,170),(0,255,255),(0,170,255),(0,85,255),(0,0,255),(85,0,255),(170,0,255),(255,0,255),(255,0,170),(255,0,85)]
Y = lambda v: FEET - FIG + v
def front_back(cx, front):
    g = -1 if front else 1
    k = {1:(cx,Y(170)), 2:(cx+g*42,Y(182)), 5:(cx-g*42,Y(182)), 3:(cx+g*50,Y(245)), 6:(cx-g*50,Y(245)),
         4:(cx+g*52,Y(300)), 7:(cx-g*52,Y(300)), 8:(cx+g*20,Y(300)), 11:(cx-g*20,Y(300)),
         9:(cx+g*21,Y(370)), 12:(cx-g*21,Y(370)), 10:(cx+g*22,Y(440)), 13:(cx-g*22,Y(440)),
         16:(cx+g*62,Y(100)), 17:(cx-g*62,Y(100))}
    if front:
        k.update({0:(cx,Y(118)), 14:(cx+g*28,Y(96)), 15:(cx-g*28,Y(96))})
    return k
def side(cx, phase=None):
    k = {1:(cx,Y(170)), 0:(cx+55,Y(118)), 14:(cx+35,Y(96)), 16:(cx-12,Y(100)),
         2:(cx+5,Y(184)), 5:(cx-5,Y(180)), 8:(cx+3,Y(300)), 11:(cx-3,Y(298))}
    a = 0 if phase is None else [1,0,-1,0][phase]
    lift = 0 if phase is None else [0,-5,0,-5][phase]
    if phase is None:
        k.update({3:(cx+8,Y(245)),4:(cx+12,Y(300)),6:(cx-8,Y(245)),7:(cx-12,Y(298)),
                  9:(cx+14,Y(370)),10:(cx+18,Y(440)),12:(cx-10,Y(370)),13:(cx-16,Y(440))})
    elif a:
        k.update({9:(cx+24*a,Y(370)),10:(cx+38*a,Y(440)),12:(cx-24*a,Y(368)),13:(cx-38*a,Y(440)),
                  3:(cx-12*a,Y(245)),4:(cx-22*a,Y(298)),6:(cx+12*a,Y(245)),7:(cx+22*a,Y(298))})
    else:
        k.update({9:(cx+5,Y(370)),10:(cx+3,Y(440)),12:(cx-4,Y(365)),13:(cx-18,Y(422)),
                  3:(cx+4,Y(245)),4:(cx+6,Y(300)),6:(cx-4,Y(245)),7:(cx-6,Y(300))})
    return {i:(p[0], p[1]+lift if i not in (10,13) or a == 0 and phase is not None and i == 13 else p[1]) for i,p in k.items()}
def draw(w, views, path):
    img = Image.new("RGB", (w, 640)); d = ImageDraw.Draw(img)
    for k in views:
        for i,(a,b) in enumerate(LIMBS):
            if a in k and b in k: d.line([k[a],k[b]], fill=tuple(int(v*.6) for v in COLORS[i]), width=8)
        for i,p in k.items(): d.ellipse([p[0]-5,p[1]-5,p[0]+5,p[1]+5], fill=COLORS[i])
    img.save(path)
xs = [150, 450, 750, 1050, 1350, 1650]
def scaled(k):
    """Version B (r11b): smaller head (~30% of height). Remap y: head 0-170 -> 0-135, torso/legs 170-440 -> 135-440."""
    out = {}
    for i, (x, y) in k.items():
        v = y - (FEET - FIG)
        nv = v * 135 / 170 if v <= 170 else 135 + (v - 170) * (440 - 135) / (440 - 170)
        if i in (14, 15, 16, 17, 0):
            cx = k[1][0]; x = cx + (x - cx) * 0.75
        out[i] = (x, FEET - FIG + nv)
    return out
draw(1792, [side(xs[0])] + [side(xs[i+1], i) for i in range(4)] + [front_back(xs[5], False)], "chibi-sheet-side-walk-back-1792x640.png")
draw(1024, [front_back(512, True)], "chibi-single-front-1024x640.png")

draw(1792, [scaled(side(xs[0]))] + [scaled(side(xs[i+1], i)) for i in range(4)] + [scaled(front_back(xs[5], False))], "chibiB-sheet-side-walk-back-1792x640.png")
