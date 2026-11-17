"""Audit saved drawings, exact mode reductions, stack contracts and review proofs."""
from pathlib import Path
from collections import Counter,defaultdict
import hashlib,importlib.util,json,struct,sys
from PIL import Image

ART=Path(__file__).resolve().parents[1];REV=ART/'review';OUT=ART/'out/city17'
NN=Image.Resampling.NEAREST
def module(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
process=module('process',REV/'r17-A-process.py');city=module('city',OUT/'compose.py')
checks=[];measurements={}
def check(ok,label,detail=None):checks.append(dict(pass_=bool(ok),check=label,detail=detail))
def im(p):return Image.open(p).convert('RGBA')
def equal(a,b):return a.size==b.size and a.tobytes()==b.tobytes()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

manifest=json.loads((REV/'r17-A-generation.json').read_text());selected=[r for r in manifest if r['selected']]
check(len(selected)==66,'66 independently selected drawings')
check(len({r['output'] for r in selected})==66,'one selected source per design')
expected=set();blocks=0;cleanup=0;cleanup_selected=0
for r in manifest:
    name=r['id'];w,h=r['size'];reg=im(REV/f'r17-A-registered-{name}.png');savedmode=im(REV/f'r17-A-mode-{name}.png');clean=im(REV/f'r17-A-clean-{name}.png')
    check(reg.size==(w*8,h*8),'8x registration '+name)
    packed=struct.unpack('>'+str(w*h*64)+'I',reg.tobytes());mode=[]
    for y in range(h):
        for x in range(w):
            counts=Counter(q for yy in range(8) for q in packed[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8])
            mode.append(min(counts,key=lambda q:(-counts[q],q)))
    replay=Image.frombytes('RGBA',(w,h),struct.pack('>'+str(w*h)+'I',*mode));blocks+=w*h
    check(equal(replay,savedmode),'all64 exact mode '+name)
    edits=json.loads(Image.open(REV/f'r17-A-clean-{name}.png').info['Cleanup']);valid=True
    for x,y,old,new in edits:
        valid &= replay.getpixel((x,y))==tuple(old);replay.putpixel((x,y),tuple(new))
    check(valid and equal(replay,clean),'recorded cleanup replay '+name);cleanup+=len(edits)
    if r['selected']:
        cleanup_selected+=len(edits);base=r['output'];names=[base] if r.get('overlay') else [base]+[base+f'-c{c}' for c in range(3)]
        for n in names:
            expected.add(n+'.png');target=im(OUT/(n+'.png'));c=int(n[-1]) if n[-3:-1]=='-c' else 0
            check(equal(target,process.colour(clean,c)),'selected output replay '+n)
check(expected=={p.name for p in OUT.glob('*.png')},'exact output inventory',len(expected))

pal={(*p,255) for p in process.PAL}
for ramp in process.RAMPS:pal.update((*p,255) for p in ramp)
bywidth=defaultdict(list);allpixels=0
for p in sorted(OUT.glob('*.png')):
    a=im(p);pixels=list(a.get_flattened_data());w,h=a.size;allpixels+=w*h
    check(set(q[3] for q in pixels)<={0,255},'hard alpha '+p.name)
    check(all(q==(0,0,0,0) for q in pixels if not q[3]),'zero hidden RGB '+p.name)
    check(all(q in pal for q in pixels if q[3]),'locked palette '+p.name)
    todo={i for i,q in enumerate(pixels) if q[3]};sizes=[]
    while todo:
        seed=todo.pop();stack=[seed];n=1
        while stack:
            y,x=divmod(stack.pop(),w)
            for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                q=yy*w+xx
                if 0<=xx<w and 0<=yy<h and q in todo:todo.remove(q);stack.append(q);n+=1
        sizes.append(n)
    check(len(sizes)==1,'single connected drawing/no detached alpha flecks '+p.name,sizes)
    if p.stem.startswith('sign-'):check(a.size==(32,40),'sign canvas '+p.name)
    else:
        check(h==48 and w in(8,48,96,144),'native facade dimensions '+p.name)
        check(all(q[3]==255 for q in pixels),'filled square-edged footprint '+p.name)
        check(all(a.getpixel((x,y))==process.DARK for x in(0,w-1) for y in range(48)),'one-pixel outer side contour '+p.name)
        donor=process.course(w)
        for y in(0,47):check(equal(a.crop((0,y,w,y+1)),donor),'course row '+str(y)+' '+p.name)
        bywidth[w].append((p.name,a))
    measurements[p.name]=dict(size=a.size,bounds=a.getbbox(),opaque=sum(q[3]>0 for q in pixels),colours=len({q for q in pixels if q[3]}),sha256=sha(p))
paircount=0
for width,items in bywidth.items():
    for an,a in items:
        edge=a.crop((0,47,width,48)).tobytes()
        for bn,b in items:
            paircount+=1;check(edge==b.crop((0,0,width,1)).tobytes(),'unlike stack course '+an+' / '+bn)

# Every file is actually present in both source-exact positions of its proof.
house=im(ART/'reference/r17/fantasy-house-2.png')
for p in sorted(OUT.glob('*.png')):
    a=im(p);proofpath=REV/f'r17-A-file-{p.stem}.png';raw=Image.open(proofpath);proof=raw.convert('RGBA');meta={k:json.loads(v) for k,v in raw.info.items()}
    pw,ph=meta['PairSize'];px,py=meta['PairOrigins'][0];qx,qy=meta['PairOrigins'][1]
    pair=proof.crop((px,py,px+pw,py+ph));check(equal(proof.crop((qx,qy,qx+pw*4,qy+ph*4)),pair.resize((pw*4,ph*4),NN)),'exact 4x file pair '+p.name)
    x,y=meta['AssetOrigin'];base=city.grass((pw,ph)) if p.stem.startswith('sign-') else Image.new('RGBA',(pw,ph),(64,70,64,255))
    base.alpha_composite(a,(x,y));base.alpha_composite(house,tuple(meta['HouseOrigin']));check(equal(pair,base),'native asset+house proof '+p.name)
    seam=Image.open(REV/f'r17-A-seam-{p.stem}-1x.png');partners=json.loads(seam.info['Files']);s=Image.new('RGBA',seam.size)
    for i,n in enumerate(partners):s.alpha_composite(im(OUT/n),((i%4)*a.width,(i//4)*a.height))
    check(equal(s,seam.convert('RGBA')),'literal seam placements '+p.name)
    check(equal(im(REV/f'r17-A-seam-{p.stem}-4x.png'),s.resize((s.width*4,s.height*4),NN)),'exact 4x seam '+p.name)
    if p.stem.startswith(('ground-','inn-front','corner-ground')):
        rep=city.repeat(a,(a.width*3,a.height*3));check(equal(rep,im(REV/f'r17-A-repeat-{p.stem}-1x.png')),'literal 3x3 '+p.name)
        check(equal(rep.resize((rep.width*4,rep.height*4),NN),im(REV/f'r17-A-repeat-{p.stem}-4x.png')),'4x literal 3x3 '+p.name)

for name,layout in city.critic_layouts().items():
    a,records=city.scene(layout);saved=im(REV/f'r17-A-critic-{name}-1x.png');check(equal(a,saved),'critic replay '+name)
    check(equal(a.resize((a.width*3,a.height*3),NN),im(REV/f'r17-A-critic-{name}-3x.png')),'critic 3x '+name)
    check(equal(a.convert('L').convert('RGBA'),im(REV/f'r17-A-critic-{name}-squint-1x.png')),'critic greyscale '+name)
    colours={b['spec']['colour'] for b in layout['buildings']};roofs={b['spec']['roof_colour'] for b in layout['buildings']}
    check(len(colours)<=2 and len(roofs)==1,'two wall/one roof colour '+name)
    rows=defaultdict(list)
    for b in layout['buildings']:rows[b['base']].append(b)
    for base,row in rows.items():
        row=sorted(row,key=lambda b:b['x'])
        for start in range(max(1,len(row)-4)):
            lots=row[start:start+5]
            for level in range(5):
                names=[]
                for lot in lots:
                    s=lot['spec']
                    if level==0:names.append(city.ground_name(s))
                    elif len(s['storeys'])>=level:
                        q=s['storeys'][level-1];names.append(f"storey-{q['kind']}-w{s['width']}-c{q['colour']}")
                check(not names or max(Counter(names).values())<=2,'no 3 identical facade pieces in 5 '+str((name,base,start,level)))
    for b in layout['buildings']:
        building,parts=city.build(b['spec']);bb=building.getbbox();y=b['base']-building.height
        check(b['x']>=0 and b['x']+building.width<=layout['size'][0] and y+bb[1]>=0 and b['base']<=layout['size'][1], 'scene painted bounds '+name+'/'+b['id'])
        layers=[p['layer'] for p in parts];check(layers.index('roof / Part B placeholder')>=len(layers)-1-layers.count('overlay'),'roof follows facade '+name+'/'+b['id'])

for mount in json.loads((REV/'r17-A-mounts.json').read_text()):
    base=city.asset(mount['host']);a=base.copy();sign=im(OUT/mount['file']);a.alpha_composite(sign,tuple(mount['xy']))
    for key in('protected_goods','protected_door'):check(equal(a.crop(mount[key]),base.crop(mount[key])),'sign preserves '+key+' '+mount['file'])
    x,y=mount['xy'];check(x>=0 and y>=0 and x+sign.width<=base.width and y+sign.height<=48,'sign inside lot '+mount['file'])
# Covers every upper family, width, colour and ground variant while showing both ends.
mountcases=0
for w in(1,2,3):
    for colour in range(3):
        for g in city.GROUNDS:
            for v in range(3):
                for k in city.STOREYS:
                    s=city.make_spec(w,2,g,v,colour,'hip',[k]);bare,_=city.build(s);s['ends']=['left','right'];mounted,_=city.build(s)
                    for floor in(0,1):
                        y=bare.height-(floor+1)*48
                        check(equal(bare.crop((3,y,w*48-3,y+48)),mounted.crop((3,y,w*48-3,y+48))),'end reveal preserves interior '+str((w,colour,g,v,k,floor)))
                    check(equal(bare.getchannel('A'),mounted.getchannel('A')),'end reveal alpha '+str((w,colour,g,v,k)));mountcases+=1

# Preserve all pre-task content, including original notes as an exact suffix.
baseline=json.loads((REV/'r17-A-baseline.json').read_text());protected=0
for path,digest in baseline.items():
    p=ART.parent/path
    if path=='art-drop/NOTES.md':
        data=p.read_bytes();marker=b'\n<!-- r17-A retained earlier notes -->\n';original=data.split(marker,1)[-1] if marker in data else data
        check(hashlib.sha256(original).hexdigest()==digest,'complete earlier NOTES content unchanged')
    else:check(p.exists() and sha(p)==digest,'protected '+path);protected+=1

summary=dict(passed=sum(c['pass_'] for c in checks),checks=len(checks),failed=[c for c in checks if not c['pass_']],
 source_drawings=len(manifest),selected_drawings=len(selected),outputs=len(expected),native_output_pixels=allpixels,
 mode_blocks=blocks,mode_samples=blocks*64,recorded_cleanup_edits=cleanup,selected_cleanup_edits=cleanup_selected,
 same_width_ordered_stack_pairs=paircount,end_mount_cases=mountcases,protected_files=protected,
 scope='Mechanical checks only. Visual criterion dispositions are in r17-A-critic.json; later-part city failures are not waived.')
(REV/'r17-A-validation.json').write_text(json.dumps(summary,indent=2)+'\n')
(REV/'r17-A-measurements.json').write_text(json.dumps(measurements,indent=2)+'\n')
print(json.dumps(summary,indent=2));sys.exit(bool(summary['failed']))
