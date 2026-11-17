"""Register image-tool paint, exact mode-reduce, wrap and transfer interiors.

No stone shapes, texture or noise are constructed here. Kerbs are unchanged.
"""
from pathlib import Path
from collections import Counter
from PIL import Image, ImageDraw, ImageStat
import json, hashlib

R=Path(__file__).resolve().parent
O=R.parent/'out/city17'
B=R/'r17-E-critic2-before'
ROAD=[(117,120,108),(123,126,113),(129,132,119),(136,139,125),(143,146,132),(150,153,139)]
NN=Image.Resampling.NEAREST

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def process(v):
    ident='cobble-small-'+v
    source=R/f'r17-E-critic2-source-{ident}.png'
    a=Image.open(source).convert('RGBA')
    a.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>2*g and b>2*g else (r,g,b,255) for r,g,b,z in a.get_flattened_data()])
    box=a.getbbox()
    reg=a.crop(box).resize((384,384),Image.Resampling.BOX)
    lum=[(3*r+6*g+b)/10 for r,g,b,z in reg.get_flattened_data()]
    ordered=sorted(lum);lo=ordered[len(ordered)//100];hi=ordered[len(ordered)*99//100]
    reg.putdata([ROAD[min(5,max(0,round((v-lo)*5/max(1,hi-lo))))]+(255,) for v in lum])
    raw=[]
    for y in range(48):
        row=list(reg.crop((0,y*8,384,(y+1)*8)).get_flattened_data())
        for x in range(48):
            votes=Counter(q for yy in range(8) for q in row[yy*384+x*8:yy*384+x*8+8])
            raw.append(min(votes,key=lambda q:(-votes[q],q)))
    mode=Image.new('RGBA',(48,48));mode.putdata(raw)
    clean=mode.copy()
    # Edge transfer only: opposite painted edge, no internal motif repetition.
    clean.paste(clean.crop((0,0,1,48)),(47,0))
    clean.paste(clean.crop((0,0,48,1)),(0,47))
    for tag,im in [('registered',reg),('mode',mode),('clean',clean)]:
        im.save(R/f'r17-E-critic2-{tag}-{ident}.png')
    bands=[ImageStat.Stat(clean.convert('L').crop((0,y,48,y+8))).mean[0] for y in range(0,48,8)]
    record=dict(id=ident,source=source.name,source_sha256=sha(source),crop=box,size=[48,48],palette=ROAD,
                luminance_registration=[lo,hi],samples_per_block=64,mode_blocks=2304,
                cleanup=[],wrap='copy x0 to x47, then y0 to y47',eight_row_luminance=bands)
    return clean,record

def repeat(a,w,h):
    im=Image.new('RGBA',(w,h))
    for y in range(0,h,a.height):
        for x in range(0,w,a.width):im.paste(a,(x,y))
    return im

def run(install=False):
    candidates={};records=[]
    sheet=Image.new('RGBA',(1280,830),(39,43,35,255));d=ImageDraw.Draw(sheet)
    for i,v in enumerate('ab'):
        a,rec=process(v);records.append(rec);candidates[v]=a;x=i*640
        rep=repeat(a,144,144)
        d.text((x+12,12),'cobble-small '+v+' | literal 3x3 at 1x and 4x',fill='white')
        sheet.alpha_composite(rep,(x+12,40));sheet.alpha_composite(rep.resize((576,576),NN),(x+12,216))
        rep.save(R/f'r17-E-critic2-candidate-{v}-repeat-1x.png')
        print(v,rec['eight_row_luminance'])
    sheet.save(R/'r17-E-critic2-candidates.png')
    (R/'r17-E-critic2-processing.json').write_text(json.dumps(records,indent=2))
    if not install:return
    selected='a';small=candidates[selected]
    files=json.loads((R/'r17-E-files.json').read_text())
    for name,w,k in [('cobble-small',48,0),('street-side',48,4),('lane',24,3)]:
        a=repeat(small,w,48)
        if k:
            before=Image.open(B/(name+'.png')).convert('RGBA')
            for x in (0,w-k):a.paste(before.crop((x,0,x+k,48)),(x,0))
        a.save(O/(name+'.png'));pixels=list(a.get_flattened_data())
        files[name].update(source=['critic2:cobble-small-'+selected,'retained kerbs/gutters' if k else 'whole painted field'],
            sha256=sha(O/(name+'.png')),colours=len(set(p[:3] for p in pixels)),opaque=sum(bool(p[3]) for p in pixels),alpha=[255])
    (R/'r17-E-files.json').write_text(json.dumps(files,indent=2))
    generation=json.loads((R/'r17-E-critic2-generation.json').read_text())
    for item in generation:item['selected']=item['id']=='cobble-small-'+selected
    (R/'r17-E-critic2-generation.json').write_text(json.dumps(generation,indent=2))

if __name__=='__main__':
    import sys
    run('--install' in sys.argv)
