import numpy as np, json, sys
from PIL import Image
W=sys.argv[1]; a=np.asarray(Image.open(W+"/out/raw.png").convert("RGB")).astype(int)
key=(a[...,0]>180)&(a[...,1]<100)&(a[...,2]>180)
def pitch(axis):
    d=np.abs(np.diff(a,axis=axis)).max(-1)>24          # colour edges
    prof=d.sum(axis=1-axis).astype(float); prof-=prof.mean()
    best=None
    for p10 in range(30,300):                           # 3.0 .. 30.0 px
        p=p10/10; n=len(prof); idx=np.arange(n)
        ph=(idx%p)/p; s=np.abs((prof*np.exp(2j*np.pi*ph)).sum())/n
        if best is None or s>best[0]: best=(s,p,np.angle((prof*np.exp(2j*np.pi*ph)).sum()))
    s,p,ang=best; off=((-ang/(2*np.pi))%1)*p
    return p,off
def pitch_at(axis,p):
    d=np.abs(np.diff(a,axis=axis)).max(-1)>24; prof=d.sum(axis=1-axis).astype(float); prof-=prof.mean(); idx=np.arange(len(prof))
    z=(prof*np.exp(2j*np.pi*(idx%p)/p)).sum(); return ((-np.angle(z)/(2*np.pi))%1)*p
px,ox=pitch(1); py,oy=pitch(0)
# guard against harmonics: art pixels are square, so a ~2x or ~0.5x ratio means one axis locked onto a harmonic
r=py/px
if 1.8<r<2.2: px=py; ox=pitch_at(1,px)
elif 1.8<1/r<2.2: py=px; oy=pitch_at(0,py)
p=(px+py)/2
H,Wd=a.shape[:2]; xs=np.arange(ox+px/2,Wd,px); ys=np.arange(oy+py/2,H,py)
out=np.zeros((len(ys),len(xs),4),np.uint8)
for j,y in enumerate(ys):
    for i,x in enumerate(xs):
        y0,y1=int(max(0,y-py/2+1)),int(min(H,y+py/2-1)); x0,x1=int(max(0,x-px/2+1)),int(min(Wd,x+px/2-1))
        blk=a[y0:y1+1,x0:x1+1].reshape(-1,3); kb=key[y0:y1+1,x0:x1+1].reshape(-1)
        if kb.mean()>0.5: continue
        c=blk[~kb]; keys=c[:,0]*65536+c[:,1]*256+c[:,2]; v,n=np.unique(keys,return_counts=True); k=v[n.argmax()]
        out[j,i]=[k>>16,(k>>8)&255,k&255,255]
im=Image.fromarray(out,"RGBA"); im.save(W+"/out/lineup-1x.png"); im.resize((im.width*4,im.height*4),Image.NEAREST).save(W+"/out/lineup-4x.png")
al=out[...,3]>0; cols=al.any(0); rows=al.any(1); ys_=np.where(rows)[0]
# per-figure heights: split columns by empty gaps
segs=[];inside=False
for i,c in enumerate(cols):
    if c and not inside: s=i; inside=True
    if not c and inside: segs.append((s,i)); inside=False
if inside: segs.append((s,len(cols)))
heights=[int(np.ptp(np.where(al[:,a0:a1].any(1))[0])+1) for a0,a1 in segs if a1-a0>3]
cnt=len(np.unique(out[al][:,:3],axis=0))
res={"pitch_x":round(px,2),"pitch_y":round(py,2),"art_pixel_size":round(p,2),"grid_size":[len(xs),len(ys)],"figures":len(heights),"figure_heights_art_px":heights,"colours":int(cnt)}
json.dump(res,open(W+"/out/unscale.json","w"),indent=1); print(res)
