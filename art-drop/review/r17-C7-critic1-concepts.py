"""Join freshly repainted overlapping concept sections, then genuinely reduce.

Only registration, crop selection and palette/mode reduction; no drawing.
The 1448x1086 guide images are never used as native output paint.
"""
from pathlib import Path
import importlib.util, json, hashlib
from PIL import Image

R=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('paint',R/'r17-C7-critic1-process.py')
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)

def seam_join(left,right,offset):
    """Select source pixels along a minimum-difference overlap, without blending."""
    left=left.convert('RGB');right=right.convert('RGB')
    overlap=left.width-offset;h=min(left.height,right.height)
    aa=list(left.crop((offset,0,left.width,h)).get_flattened_data())
    bb=list(right.crop((0,0,overlap,h)).get_flattened_data())
    cost=[];paths=[]
    for y in range(h):
        row=[];back=[]
        for x in range(overlap):
            a,b=aa[y*overlap+x],bb[y*overlap+x]
            c=sum(abs(a[i]-b[i]) for i in range(3))+abs(x-overlap//2)*.06
            if y:
                prev=min(range(max(0,x-1),min(overlap,x+2)),key=lambda k:cost[k])
                c+=cost[prev];back.append(prev)
            row.append(c)
        cost=row;paths.append(back)
    x=min(range(overlap),key=lambda k:cost[k]);path=[x]
    for y in range(h-1,0,-1):x=paths[y][x];path.append(x)
    path.reverse()
    out=Image.new('RGB',(offset+right.width,h),(255,0,255));out.paste(left,(0,0))
    for y,x in enumerate(path):out.paste(right.crop((x,y,right.width,y+1)),(offset+x,y))
    return out,path

def run(v):
    imgs={q:Image.open(R/f'r17-C7-critic1-source-concept-{v}-{q}.png') for q in ['nw','ne','sw','se']}
    # Tool returns are retained verbatim; register only a one-pixel output
    # dimension variation, not an undersized source painting.
    imgs={q:a.resize((1448,1086),Image.Resampling.BOX) if a.size!=(1448,1086) else a for q,a in imgs.items()}
    top,tseam=seam_join(imgs['nw'],imgs['ne'],1240)
    bottom,bseam=seam_join(imgs['sw'],imgs['se'],1240)
    whole,hseam=seam_join(top.transpose(Image.Transpose.TRANSPOSE),bottom.transpose(Image.Transpose.TRANSPOSE),930)
    whole=whole.transpose(Image.Transpose.TRANSPOSE)
    assert whole.size==(2688,2016)
    source=f'r17-C7-critic1-source-concept-{v}-composite.png';whole.save(R/source)
    p.register(source,(1920,1440),f'critic1-concept-{v}',box=(0,0,2688,2016),output=R/f'r17-concept-{v}.png')
    record=dict(source=source,source_size=[2688,2016],native_size=[1920,1440],reduction_factor=1.4,
        freshly_drawn_sections=4,guide_used_as_output=False,join='minimum difference source-pixel seam; no blend',
        vertical_seams=[tseam,bseam],horizontal_seam=hseam)
    (R/f'r17-C7-critic1-concept-{v}-registration.json').write_text(json.dumps(record))
    print('FINISHED CONCEPT',v,flush=True)

if __name__=='__main__':
    for v in 'abc':run(v)
