"""Register image-tool block grids and read one tolerant mode per block.

Only review data is written here. No spatial image resampling is performed.
"""
import json, math
from pathlib import Path
from PIL import Image
from draw_proofs import REVIEW
from import_c16 import read_source

def grid(im):
    px=im.load();hs=[]
    for axis in (1,0):
        length=im.width if axis else im.height;cross=im.height if axis else im.width
        hist=[]
        for i in range(1,length):
            total=0
            for j in range(0,cross,3):
                a,b=(px[i,j],px[i-1,j]) if axis else (px[j,i],px[j,i-1])
                total+=max(abs(a[k]-b[k]) for k in range(3))
            hist.append(total)
        cap=sorted(hist)[int(len(hist)*.9)];hs.append([min(v,cap) for v in hist])
    candidates=[]
    for tick in range(750,1181):
        pitch=tick/100;axes=[]
        for h in hs:
            re=sum(v*math.cos(2*math.pi*(i+1)/pitch) for i,v in enumerate(h))
            imag=sum(v*math.sin(2*math.pi*(i+1)/pitch) for i,v in enumerate(h))
            axes.append(dict(pitch=pitch,phase=math.atan2(imag,re)*pitch/(2*math.pi)%pitch,edge_coherence=math.hypot(re,imag)/max(sum(h),1)))
        candidates.append((sum(g['edge_coherence'] for g in axes),axes))
    _,axes=max(candidates,key=lambda x:x[0])
    return dict(x_grid=axes[0],y_grid=axes[1])

def run():
    dest=REVIEW/'C21-registration.json'
    report=json.loads(dest.read_text()) if dest.exists() else {}
    for p in sorted((REVIEW/'C21-sources').glob('*.png')):
        if p.stem in report and (REVIEW/f'C21-read-{p.stem}.png').exists():continue
        im=Image.open(p).convert('RGB');g=grid(im);out,stats=read_source(p,g)
        out.save(REVIEW/f'C21-read-{p.stem}.png');report[p.stem]=dict(source=str(p),**stats)
        print(p.stem,stats['size'],round(stats['x_grid']['pitch'],2),round(stats['dominant_cluster_75_percent'],2),flush=True)
    (REVIEW/'C21-registration.json').write_text(json.dumps(report,indent=2)+'\n')
if __name__=='__main__':run()
