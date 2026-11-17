"""Register image-tool redraws. Geometry is exclusively retained drawing paint."""
from pathlib import Path
from collections import Counter
from PIL import Image
import json, hashlib, importlib.util
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('old',R/'r17-D-process.py')
old=importlib.util.module_from_spec(sp);sp.loader.exec_module(old)
NEUTRAL=[(43,40,29),(74,69,59),(100,92,77),(130,116,95),(156,142,119),(180,166,141),(204,190,164),(226,215,189)]
def process(rec):
    a=Image.open(R/rec['source']).convert('RGBA')
    a.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and min(r,b)>2*g else (r,g,b,255) for r,g,b,_ in a.get_flattened_data()])
    box=a.getbbox();a=a.crop(box);w,h=rec['size'];reg=Image.new('RGBA',(w*8,h*8))
    cuts=[0,a.height];dest=[0,h]
    if rec['id']=='corner_b':cuts=[0,650,945,a.height];dest=[0,96,144,192]
    if rec['id']=='court_b':cuts=[0,280,a.height];dest=[0,48,144]
    for y0,y1,d0,d1 in zip(cuts,cuts[1:],dest,dest[1:]):
        reg.paste(a.crop((0,y0,a.width,y1)).resize((w*8,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
    palette=old.PAL
    if rec['id'].startswith('roof') or rec['id']=='corner_a':palette=[old.BASE[0]]+old.RED+[old.BASE[i] for i in (3,4,7,8)]
    if rec['id'].startswith('shadow'):palette=[(43,40,29)]
    if rec['id'].startswith('gate'):
        palette=sorted(set(p[:3] for p in Image.open(O/'cobble-large.png').convert('RGBA').get_flattened_data() if p[3]))+[(61,62,53),(71,72,61),(81,82,70)]
    pal=Image.new('P',(1,1));pal.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*p,255) if a>=128 else (0,0,0,0) for p,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
    raw=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(p for yy in range(8) for p in vals[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);raw.append(min(votes,key=lambda p:(-votes[p],p)))
    clean=old.clean_pixels(raw,w,h)
    if rec['id'].startswith('gate'):
        for y in range(h):
            for x in range(w):
                if x in (0,w-1) or y in (0,h-1):clean[y*w+x]=raw[y*w+x]
    mode=Image.new('RGBA',(w,h));mode.putdata(raw);out=Image.new('RGBA',(w,h));out.putdata(clean)
    for stage,im in [('registered',reg),('mode',mode),('clean',out)]:im.save(R/f"r17-R-critic1-{stage}-{rec['id']}.png")
    if rec['selected']:out.save(O/(rec['output']+'.png'))
    return dict(id=rec['id'],bounds=box,source_bands=cuts,destination_bands=dest,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=[[i%w,i//w,list(p),list(q)] for i,(p,q) in enumerate(zip(raw,clean)) if p!=q],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())

def main():
    recs=json.loads((R/'r17-R-critic1-generation.json').read_text());logs=[process(r) for r in recs]
    # Complete house divided at registered attachment rows, with no invented joins.
    house=Image.open(O/'corner-house-r-w2.png')
    for name,box in [('roof-corner-r-w2',(0,0,96,96)),('storey-corner-r-w2',(0,96,96,144)),('ground-corner-r-w2',(0,144,96,192))]:house.crop(box).save(O/(name+'.png'))
    # Existing civic paint gets the same approved neutral material map as R.
    original=Image.open(O/'guildhall.png').convert('RGBA');neutral=Image.open(O/'guildhall-r.png').convert('RGBA')
    mapping=dict(zip(original.get_flattened_data(),neutral.get_flattened_data()))
    a=Image.open(O/'townhall-market.png').convert('RGBA');a.putdata([mapping.get(p,p) for p in a.get_flattened_data()]);a.save(O/'townhall-market-r.png')
    a=Image.open(O/'roof-back-w1.png').convert('RGBA');p=Image.open(O/'dormer-0-c0.png').convert('RGBA');a.alpha_composite(p,(12,30));a.save(O/'roof-back-accent-r-w1.png')
    # Native pitch rows extend a gabled volume without a second front eave.
    donor=Image.open(O/'roof-gable-w2-c0.png').convert('RGBA')
    for name,extra in [('roof-gable-deep-r-w2',48),('roof-gable-long-r-w2',96)]:
        a=Image.new('RGBA',(96,96+extra));a.paste(donor.crop((0,0,96,48)),(0,0))
        for y in range(48,48+extra,16):a.paste(donor.crop((0,16,96,32)),(0,y))
        a.paste(donor.crop((0,48,96,96)),(0,48+extra));a.save(O/(name+'.png'))
    files=json.loads((R/'r17-R-files.json').read_text())
    names=[r['output'] for r in recs if r['selected']]+['roof-corner-r-w2','storey-corner-r-w2','ground-corner-r-w2','townhall-market-r','roof-back-accent-r-w1','roof-gable-deep-r-w2','roof-gable-long-r-w2']
    for name in names:
        p=O/(name+'.png');a=Image.open(p).convert('RGBA');vals=list(a.get_flattened_data())
        files[name]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len({p[:3] for p in vals if p[3]}),alpha=sorted({p[3] for p in vals}),hidden_rgb=sum(p!=(0,0,0,0) for p in vals if not p[3]))
    (R/'r17-R-files.json').write_text(json.dumps(files,indent=2));(R/'r17-R-critic1-processing.json').write_text(json.dumps(logs,indent=2))
    print('Processed',len(recs),'paintings;',len(names),'new native exports; preserved passing files')
if __name__=='__main__':main()
