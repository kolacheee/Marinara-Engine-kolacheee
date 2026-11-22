# Overlay check without numpy. Scales painting to block-out size for checking only.
import sys, statistics
from PIL import Image, ImageDraw, ImageStat
K=sys.argv[1]; name=sys.argv[2]; C=48
b=Image.open(f'{K}/keep-lair-blockout.png').convert('RGB'); W,H=b.size; gw,gh=W//C,H//C
p_raw=Image.open(f'{K}/{name}.png').convert('RGB'); p=p_raw.resize((W,H),Image.LANCZOS)
def cls(box):
    r,g,bb=ImageStat.Stat(b.crop(box)).median; l=(r+g+bb)/3
    return 'wall' if l<70 else ('face' if l>175 and abs(r-g)<25 else 'floor')
cells={}; lum={}
for y in range(gh):
  for x in range(gw):
    box=(x*C+8,y*C+8,x*C+40,y*C+40); cells[(x,y)]=cls(box); lum[(x,y)]=sum(ImageStat.Stat(p.crop(box).convert('L')).mean)
thr=(statistics.median([lum[k] for k,c in cells.items() if c=='wall'])+statistics.median([lum[k] for k,c in cells.items() if c!='wall']))/2
bad=[k for k,c in cells.items() if (lum[k]<thr)!=(c=='wall')]
print(f'{name}: raw {p_raw.size}, wall/open agreement {len(cells)-len(bad)}/{len(cells)} = {100*(len(cells)-len(bad))/len(cells):.1f}%, mismatched cells {len(bad)}')
ov=p.copy(); d=ImageDraw.Draw(ov)
for x in range(gw+1): d.line([(x*C,0),(x*C,H)],fill=(255,255,255),width=1)
for y in range(gh+1): d.line([(0,y*C),(W,y*C)],fill=(255,255,255),width=1)
for (x,y),c in cells.items():
  for dx,dy in ((1,0),(0,1)):
    n=cells.get((x+dx,y+dy))
    if n and (n=='wall')!=(c=='wall'):
      d.line([((x+1)*C,y*C),((x+1)*C,(y+1)*C)] if dx else [(x*C,(y+1)*C),((x+1)*C,(y+1)*C)],fill=(0,255,255),width=3)
for (x,y) in bad: d.rectangle([x*C+2,y*C+2,x*C+C-3,y*C+C-3],outline=(255,0,0),width=3)
ov.save(f'{K}/{name}-overlay.png')
