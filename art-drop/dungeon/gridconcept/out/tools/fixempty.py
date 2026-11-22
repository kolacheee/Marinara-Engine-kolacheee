# Put stairs and edge-on doors of the empty-room paint onto their block-out cells.
from PIL import Image
K='/home/kolache/Downloads/marinara-art-dungeon-run/keeplair'; C=48
o=Image.open(f'{K}/empty.png').convert('RGB'); m=o.copy()
stA=o.crop((335,234,386,289)).resize((C,C),Image.LANCZOS)
stB=o.crop((1200,238,1282,302)).resize((C,C),Image.LANCZOS)
lock=o.crop((414,288,444,336)); plain=o.crop((1146,336,1172,384))
# stairwell: floor back on (7,5), stairs on (7,4)
m.paste(o.crop((5*C,5*C,6*C,6*C)),(7*C,5*C)); m.paste(stA,(7*C,4*C))
# back room: faces back on (25,5),(26,5), floor on (25,6), stairs on (26,6)
m.paste(o.crop((20*C,2*C,22*C,3*C)),(25*C,5*C)); m.paste(o.crop((25*C,7*C,26*C,8*C)),(25*C,6*C)); m.paste(stB,(26*C,6*C))
# doors: locked edge-on door on (8,4); plain edge-on doors on (8,6) and (14,6)
m.paste(lock,(414,4*C))
m.paste(o.crop((10*C,7*C,10*C+12,8*C)),(434,6*C)); m.paste(plain,(416,6*C))
m.paste(plain,(14*C+11,6*C))
# stray door half on the camp floor at x 655-672, y 430-490
m.paste(o.crop((638,430,655,490)),(655,430))
m.save(f'{K}/empty-fixed.png')
