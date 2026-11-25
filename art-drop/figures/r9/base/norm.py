import sys, colorsys
import numpy as np
from PIL import Image
from collections import deque
sys.path.insert(0,'/tmp/claude-0/r9')
def cut(path, tol=14):
    a=np.array(Image.open(path).convert('RGB')).astype(int); h,w,_=a.shape
    bg=np.zeros((h,w),bool); q=deque([(y,x) for x in range(w) for y in (0,h-1)]+[(y,x) for y in range(h) for x in (0,w-1)])
    while q:
        y,x=q.popleft()
        if bg[y,x]: continue
        bg[y,x]=True
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<h and 0<=nx<w and not bg[ny,nx] and np.abs(a[ny,nx]-a[y,x]).max()<=tol: q.append((ny,nx))
    return a, ~bg
def classify(a, m):
    h,w,_=a.shape; cls=np.full((h,w),-1)
    ys,xs=np.where(m); top=ys.min(); bot=ys.max(); H=bot-top+1
    for y,x in zip(ys,xs):
        r,g,b=a[y,x]/255; hh,l,s=colorsys.rgb_to_hls(r,g,b)
        rel=(y-top)/H
        warm=(hh<0.12 or hh>0.80)
        if (l>0.72 and s<0.5) or (l>0.48 and s<0.20): c=1   # shirt (light / light-shaded)
        elif warm and s>0.22 and l>0.22: c=0                # skin (warm/pink)
        elif rel>0.93: c=3                  # shoes
        else: c=2                           # trousers / dark
        cls[y,x]=c
    return cls
def lum(p): return 0.299*p[...,0]+0.587*p[...,1]+0.114*p[...,2]
RAMPS={0:[(92,52,38),(132,78,56),(168,108,78),(196,140,104)],  # skin, swappable later
       1:[(150,150,158),(190,190,196),(224,224,228),(244,244,246)],
       2:[(34,34,44),(52,52,64),(72,72,86),(96,96,110)],
       3:[(40,40,48),(80,80,92),(130,130,140),(170,170,178)]}
OUT=(24,20,28)
def norm(path):
    a,m=cut(path); cls=classify(a,m); h,w,_=a.shape
    out=np.zeros((h,w,4),np.uint8)
    L=lum(a)
    for c,ramp in RAMPS.items():
        sel=cls==c
        if not sel.any(): continue
        qs=np.quantile(L[sel],[0.25,0.5,0.75])
        idx=np.digitize(L[sel],qs)
        out[sel,:3]=np.array(ramp)[idx]; out[sel,3]=255
    # 1px dark outline on transparent neighbours
    alpha=out[...,3]>0
    edge=np.zeros_like(alpha)
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
        edge|=np.roll(np.roll(alpha,dy,0),dx,1)&~alpha
    out[edge]=(*OUT,255)
    return Image.fromarray(out)
