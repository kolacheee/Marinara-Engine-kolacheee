"""Replay sample 8x8 reductions with an independent Python vote counter."""
from pathlib import Path
from collections import Counter
import hashlib,importlib.util,json,shutil
from PIL import Image
R=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic2-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
records=json.loads((R/'r17-C7-critic2-processing.json').read_text());results=[]
for rec in records:
    source=R/rec['source'];assert hashlib.sha256(source.read_bytes()).hexdigest()==rec['source_sha256']
    src=p.key(Image.open(source)).crop(rec['bounds']);w,h=rec['native_size'];palette=rec['palette']
    pal=Image.new('P',(1,1));pal.putpalette([v for rgb in palette+[palette[-1]]*(256-len(palette)) for v in rgb])
    if rec['xcuts'] or rec['ycuts']:
        xs,xd=rec['xcuts'] or ([0,src.width],[0,w]);ys,yd=rec['ycuts'] or ([0,src.height],[0,h]);reg=Image.new('RGBA',(w*8,h*8))
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
        src=reg
    mode=Image.open(R/f'r17-C7-critic2-mode-{rec["id"]}.png').convert('RGBA');probes=[]
    for y in [h//3,h*2//3]:
        start=y//24*24;n=min(24,h-start)
        row=src.resize((w*8,n*8),Image.Resampling.BOX,box=(0,start*src.height/h,src.width,(start+n)*src.height/h))
        idx=row.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE);alpha=row.getchannel('A')
        for x in [0,w//7,w//3,w//2,w*5//7,w-1]:
            box=(x*8,(y-start)*8,(x+1)*8,(y-start+1)*8)
            counts=Counter(i+1 if a>=128 else 0 for i,a in zip(idx.crop(box).get_flattened_data(),alpha.crop(box).get_flattened_data()))
            winner=min(counts,key=lambda k:(-counts[k],k));expected=tuple(palette[winner-1])+ (255,) if winner else (0,0,0,0)
            probes.append(dict(x=x,y=y,match=mode.getpixel((x,y))==expected))
    results.append(dict(id=rec['id'],source_hash_verified=True,probes=probes))
report=dict(records=len(results),probes=sum(len(q['probes']) for q in results),passed=all(p['match'] for q in results for p in q['probes']),mode_samples_recorded=sum(q['mode_blocks']*64 for q in records),scope='Independent Python64-vote samples; not exhaustive replay of every output pixel',results=results)
(R/'r17-C7-critic2-mode-verification.json').write_text(json.dumps(report,indent=2))
archive=R/'r17-C7-pre-critic2-mode-verification.json'
if not archive.exists():shutil.copyfile(R/'r17-C7-mode-verification.json',archive)
(R/'r17-C7-mode-verification.json').write_text(json.dumps(report,indent=2))
assert report['passed'];print({k:v for k,v in report.items() if k!='results'})
