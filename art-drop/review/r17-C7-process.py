"""C7 image-tool paint registration; no procedural architecture or texture.

The painting supplies every material and contour. BOX-register at 8x, lock
the reference palette, take the exact mode of 64 samples, clean isolated
pixels and the exposed one-pixel contour. Native crops/composites only.
"""
from pathlib import Path
import argparse, hashlib, json
from collections import Counter, deque
from PIL import Image

R=Path(__file__).resolve().parent
O=R.parent/'out/city17'
NN=Image.Resampling.NEAREST
BASE=[tuple(x) for x in json.loads(Image.open(R/'r15-A-palette.png').info['Palette'])]
RED=[(54,40,34),(87,55,45),(111,65,49),(137,79,58),(156,95,68),(179,115,78)]
SLATE=[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)]
BROWN=[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]
STONE=[(43,40,29),(77,72,60),(105,100,85),(130,123,105),(155,146,125),(178,169,145),(197,188,165)]
CLOTH=[(48,63,91),(67,83,121),(92,115,153),(41,82,77),(49,112,101),(84,147,130),(71,79,34),(105,120,48),(139,148,66),(77,47,70),(112,64,99),(152,91,130)]
PAL=sorted(set(BASE+RED+SLATE+BROWN+STONE+CLOTH))
DARK=(43,40,29,255)

def key(im):
    im=im.convert('RGBA')
    im.putdata([(0,0,0,0) if r>80 and b>80 and g<min(r,b)*.5 and b*.55<r<b*1.8 else (r,g,b,255) for r,g,b,al in im.get_flattened_data()])
    return im

def clean(a,w,h,outline=True):
    original=a[:];p=a[:]
    for y in range(1,h-1):
        for x in range(1,w-1):
            i=y*w+x;q=p[i]
            if not q[3]:continue
            near=[p[(y+dy)*w+x+dx] for dy,dx in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]]
            if sum(bool(v[3]) for v in near)<2:a[i]=(0,0,0,0)
            elif q not in near and all(v[3] for v in near):a[i]=Counter(near).most_common(1)[0][0]
    if outline:
        p=a[:]
        for y in range(h):
            for x in range(w):
                i=y*w+x
                if p[i][3] and (x==0 or y==0 or x==w-1 or y==h-1 or not p[i-1][3] or not p[i+1][3] or not p[i-w][3] or not p[i+w][3]):a[i]=DARK
    a=[q if q[3] else (0,0,0,0) for q in a]
    return a,sum(x!=y for x,y in zip(original,a))

def register(source,size,name,box=None,palette=None,outline=True,course=False,output=None,xcuts=None,ycuts=None):
    src=key(Image.open(R/source));box=box or src.getbbox();src=src.crop(box)
    w,h=size;palette=sorted(set(palette or PAL));rgba=[(0,0,0,0)]+[(*c,255) for c in palette]
    # Optional structural landmarks are drawn bounds, not generated geometry.
    # Piecewise BOX registration moves whole source paint bands to cell anchors.
    if xcuts or ycuts:
        xs,xd=xcuts or ([0,src.width],[0,w]);ys,yd=ycuts or ([0,src.height],[0,h])
        reg=Image.new('RGBA',(w*8,h*8))
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):
                reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
        src=reg
    p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    raw=[]
    # Registration is streamed in aligned native-row chunks to avoid a
    # 15,360 x 11,520 full-city working allocation.
    for y in range(0,h,24):
        n=min(24,h-y)
        reg=src.resize((w*8,n*8),Image.Resampling.BOX,box=(0,y*src.height/h,src.width,(y+n)*src.height/h))
        idx=list(reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).get_flattened_data())
        alpha=list(reg.getchannel('A').get_flattened_data());idx=[v+1 if al>=128 else 0 for v,al in zip(idx,alpha)];sw=w*8
        for yy in range(n):
            for x in range(w):
                votes=Counter(q for dy in range(8) for q in idx[(yy*8+dy)*sw+x*8:(yy*8+dy)*sw+x*8+8])
                raw.append(rgba[min(votes,key=lambda v:(-votes[v],v))])
    mode=Image.new('RGBA',(w,h));mode.putdata(raw);mode.save(R/f'r17-C7-mode-{name}.png')
    final,edits=clean(raw[:],w,h,outline)
    im=Image.new('RGBA',(w,h));im.putdata(final)
    if course:
        donor=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
        for y in (0,47):
            for x in range(0,w,96):im.paste(donor.crop((0,y,min(96,w-x),y+1)),(x,y))
    im.save(output or R/f'r17-C7-clean-{name}.png')
    rec=dict(id=name,source=source,source_size=list(Image.open(R/source).size),source_sha256=hashlib.sha256((R/source).read_bytes()).hexdigest(),bounds=list(box),native_size=list(size),palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup_pixels=edits,course_transfer=course,xcuts=xcuts,ycuts=ycuts,output=str(output) if output else f'r17-C7-clean-{name}.png')
    log=R/'r17-C7-processing.json';records=json.loads(log.read_text()) if log.exists() else [];records=[r for r in records if r['id']!=name]+[rec];log.write_text(json.dumps(records,indent=2))
    print(name,size,'64-vote mode',edits,'cleanup pixels',flush=True)
    return im

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('name');p.add_argument('width',type=int);p.add_argument('height',type=int);p.add_argument('--output');p.add_argument('--box',nargs=4,type=int);p.add_argument('--no-outline',action='store_true');a=p.parse_args()
    register(a.source,(a.width,a.height),a.name,a.box,outline=not a.no_outline,output=Path(a.output) if a.output else None)
