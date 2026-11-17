"""R drawing registration, palette lock, exact mode sampling and native transfers.

Only image-tool paintings provide geometry. No procedural shapes or noise.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json
from PIL import Image

R=Path(__file__).resolve().parent
O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('d_process',R/'r17-D-process.py')
old=importlib.util.module_from_spec(sp);sp.loader.exec_module(old)
DARK=(43,40,29,255)
NEUTRAL=[(43,40,29),(74,69,59),(100,92,77),(130,116,95),(156,142,119),(180,166,141),(204,190,164),(226,215,189)]

def register(rec):
    src=Image.open(R/rec['source']).convert('RGBA')
    src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>2*g and b>2*g else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
    bounds=src.getbbox();crop=src.crop(bounds);w,h=rec['size']
    reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
    if rec['id'].startswith('mount'):
        rows=[]
        for y in range(crop.height):
            row=crop.crop((0,y,crop.width,y+1));bb=row.getbbox()
            if bb and bb[2]-bb[0]>crop.width*.93:
                rows.append(row.crop((bb[0],0,bb[2],1)).resize((w*8,1),Image.Resampling.BOX))
        joined=Image.new('RGBA',(w*8,len(rows)))
        for y,row in enumerate(rows):joined.paste(row,(0,y))
        reg=joined.resize((w*8,h*8),Image.Resampling.BOX)
    palette=([old.BASE[0]]+old.RED+[old.BASE[i] for i in [3,4,7,8]]) if rec['id'].startswith('rear') else (NEUTRAL if rec['id'].startswith('wall') else old.PAL)
    pal=Image.new('P',(1,1));pal.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*p,255) if a>=128 else (0,0,0,0) for p,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())]
    reg.putdata(vals);raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(p for yy in range(8) for p in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            raw.append(min(votes,key=lambda p:(-votes[p],p)))
    cleaned=old.clean_pixels(raw,w,h)
    mode=Image.new('RGBA',(w,h));mode.putdata(raw)
    out=Image.new('RGBA',(w,h));out.putdata(cleaned)
    transfers=[]
    if rec['id'].startswith('mount'):
        donor=Image.open(O/'storey-timber-w2-c0.png').convert('RGBA')
        for y in (0,47):out.paste(donor.crop((0,y,96,y+1)),(0,y))
        transfers.append(dict(donor='storey-timber-w2-c0',rows=[0,47]))
    if rec['id'] in ('rear_b','rear_c'):
        donor=Image.open(O/'roof-back-w1.png').convert('RGBA')
        for top,bottom in [(0,12),(92,96)]:
            out.paste(donor.crop((0,top,48,bottom)),(0,top))
        transfers.append(dict(donor='roof-back-w1',bands=[[0,12],[92,96]]))
    if rec['id']=='wall_b':
        # Repeat the drawing's central merlon period, not its capped ends.
        patch=out.crop((0,48,48,96))
        for y in range(0,144,48):out.paste(patch,(0,y))
        transfers.append(dict(donor='own registered paint',repeat=[0,48,48,96]))
    for tag,im in [('registered',reg),('mode',mode),('clean',out)]:im.save(R/f"r17-R-{tag}-{rec['id']}.png")
    if rec['selected']:out.save(O/(rec['output']+'.png'))
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,out.get_flattened_data())) if a!=b]
    return dict(id=rec['id'],bounds=bounds,size=[w,h],palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=edits,transfers=transfers,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())

def recolour_civic(name):
    a=Image.open(O/(name+'.png')).convert('RGBA')
    # Palette replacement only: unchanged geometry, glazing, roofs and wood.
    ramps={
      (233,179,95):(180,166,141),(198,143,72):(156,142,119),
      (164,127,86):(130,116,95),(199,176,139):(180,166,141),
      (221,202,169):(204,190,164),(242,223,185):(226,215,189),
      (249,238,210):(226,215,189),(187,167,133):(156,142,119),
      (169,147,113):(156,142,119)}
    a.putdata([(*ramps.get(p[:3],p[:3]),p[3]) if p[3] else (0,0,0,0) for p in a.get_flattened_data()])
    a.save(O/(name+'-r.png'))
    return dict(output=name+'-r',donor=name,operation='material palette lock; alpha and native coordinates unchanged',mapping={str(k):v for k,v in ramps.items()})

def run():
    recs=json.loads((R/'r17-R-generation.json').read_text())
    logs=[register(r) for r in recs]
    civic=[recolour_civic(n) for n in ['cathedral','guildhall','gatehouse','wall-tower','wall-walk','wall-walk-stair','fountain','market-cross','shrine']]
    # The approved warm-grey wall ramp supplies the second restrained colour.
    c0=Image.open(O/'storey-plaster-w2-c0.png').convert('RGBA')
    c1=Image.open(O/'storey-plaster-w2-c1.png').convert('RGBA')
    wallmap=dict(zip(c0.get_flattened_data(),c1.get_flattened_data()))
    for side in ('left','right'):
        n='storey-sign-bay-'+side+'-w2';a=Image.open(O/(n+'.png')).convert('RGBA')
        a.putdata([wallmap.get(q,q) for q in a.get_flattened_data()]);a.save(O/(n+'-c1.png'))
    # A second rear arrangement is a native combination of approved paint.
    a=Image.open(O/'roof-back-w2.png').convert('RGBA')
    p=Image.open(O/'dormer-0-c0.png').convert('RGBA')
    a.alpha_composite(p,(40,28));a.save(O/'roof-back-dormer-w2.png')
    native=[dict(output='roof-back-dormer-w2',donors=['roof-back-w2','dormer-0-c0'],overlay=[40,28]),dict(outputs=['storey-sign-bay-left-w2-c1','storey-sign-bay-right-w2-c1'],palette_donors=['storey-plaster-w2-c0','storey-plaster-w2-c1'],operation='exact native palette map; unchanged alpha'),dict(output='bench-pocket',source='r17-R-source-bench-native.png',provenance='r17-R-bench-source.json',operation='native48x48 painted bench palette-locked to existing D palette; unchanged alpha')]
    # Carry the preserved native matching west wall crop into the R material.
    a=Image.open(R/'r17-D-critic2-wall-walk-alternate.png').convert('RGBA')
    match=dict(zip(Image.open(O/'wall-walk.png').get_flattened_data(),Image.open(O/'wall-walk-r.png').get_flattened_data()))
    a.putdata([match.get(p,p) for p in a.get_flattened_data()]);a.save(O/'wall-walk-alternate-r.png')
    (R/'r17-R-processing.json').write_text(json.dumps(dict(drawings=logs,civic=civic,native_transfers=native),indent=2))
    bench=Image.open(R/'r17-R-source-bench-native.png').convert('RGBA');alpha=bench.getchannel('A')
    pal=Image.new('P',(1,1));pal.putpalette([v for color in old.PAL+[old.PAL[-1]]*(256-len(old.PAL)) for v in color])
    bench=bench.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA');bench.putalpha(alpha);bench.putdata([q if q[3] else (0,0,0,0) for q in bench.get_flattened_data()]);bench.save(O/'bench-pocket.png')
    names=[r['output'] for r in recs if r['selected']]+[c['output'] for c in civic]+['roof-back-dormer-w2','wall-walk-alternate-r','storey-sign-bay-left-w2-c1','storey-sign-bay-right-w2-c1','bench-pocket']
    files={}
    for n in names:
        p=O/(n+'.png');a=Image.open(p).convert('RGBA');v=list(a.get_flattened_data())
        files[n]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(q[:3] for q in v if q[3])),alpha=sorted(set(q[3] for q in v)),hidden_rgb=sum(q!=(0,0,0,0) for q in v if not q[3]))
    (R/'r17-R-files.json').write_text(json.dumps(files,indent=2))
    print('Registered',len(logs),'drawings;',len(files),'native R exports')

if __name__=='__main__':run()
