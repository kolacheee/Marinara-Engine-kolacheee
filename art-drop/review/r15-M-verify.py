"""Audit saved Part M pixels, composition, native placement and protected files."""
from pathlib import Path
from collections import Counter, defaultdict
import hashlib, importlib.util, json, struct, sys
from PIL import Image, ImageChops, ImageFilter
sys.dont_write_bytecode=True
REV=Path(__file__).resolve().parent
ART=REV.parent
REPO=ART.parent
sp=importlib.util.spec_from_file_location('mockup',REV/'r15-M-build.py')
m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
checks=[]
def check(label,condition):
    checks.append(dict(check=label,pass_=bool(condition)))
    if not condition:raise AssertionError(label)
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def same(a,b):return a.size==b.size and a.convert('RGBA').tobytes()==b.convert('RGBA').tobytes()

baseline=json.loads((REV/'r15-M-baseline.json').read_text())
protected=0
for name,digest in baseline.items():
    if name=='art-drop/NOTES.md':continue
    check('protected '+name,sha(REPO/name)==digest);protected+=1
notes=(ART/'NOTES.md').read_bytes()
if notes.startswith('# Round 15 — Part M: critic-r15M-1 redraw\n'.encode()):
    notes=notes.split(b'\n---\n\n',1)[1]
if notes.startswith(b'# Round 15 \xe2\x80\x94 Part M\n'):
    old=notes.split(b'\n---\n\n',1)[1]
    check('earlier NOTES retained',hashlib.sha256(old).hexdigest()==baseline['art-drop/NOTES.md'])
else:check('NOTES awaiting Part M section',sha(ART/'NOTES.md')==baseline['art-drop/NOTES.md'])

processing=json.loads((REV/'r15-M-processing.json').read_text())
mode_blocks=0;measure=[]
for rec in processing:
    name=rec['name'];w,h=rec['size']
    reg=Image.open(REV/f'r15-M-registered-{name}.png').convert('RGBA')
    mode=Image.open(REV/f'r15-M-mode-{name}.png').convert('RGBA')
    clean=Image.open(REV/f'r15-M-clean-{name}.png').convert('RGBA')
    check(name+' registered size',reg.size==(w*8,h*8))
    packed=struct.unpack('>'+str(w*h*64)+'I',reg.tobytes());expected=[]
    for y in range(h):
        for x in range(w):
            counts=Counter(v for dy in range(8) for v in packed[(y*8+dy)*w*8+x*8:(y*8+dy)*w*8+x*8+8])
            expected.append(tuple(min(counts,key=lambda p:(-counts[p],p)).to_bytes(4,'big')))
    check(name+' exact mode of all 64 RGBA samples',expected==list(mode.get_flattened_data()));mode_blocks+=w*h
    replay=mode.copy()
    for e in rec['cleanup']:
        check(name+' cleanup before pixel',list(replay.getpixel((e['x'],e['y'])))==e['before'])
        replay.putpixel((e['x'],e['y']),tuple(e['after']))
    check(name+' recorded cleanup replay',same(replay,clean))
    p=list(clean.get_flattened_data());pal={tuple(q) for q in rec['palette']}
    check(name+' hard alpha',all(q[3] in (0,255) for q in p))
    check(name+' zero RGB under transparency',all(q==(0,0,0,0) for q in p if not q[3]))
    check(name+' established city palette',all(q in pal for q in p if q[3]))
    check(name+' no added silhouette pixels',all(not q[3] or expected[i][3] for i,q in enumerate(p)))
    check(name+' one connected drawing',len(m.groups(p,w,h))==1)
    measure.append(dict(name=name,size=clean.size,bounds=clean.getbbox(),colours=len({q for q in p if q[3]}),opaque=sum(q[3]>0 for q in p),cleanup=len(rec['cleanup']),sha256=sha(REV/f'r15-M-clean-{name}.png')))

tiles,provenance=m.pack();recipe=json.loads((REV/'r15-M-layout.json').read_text())
check('fantasy pack identity',provenance==recipe['pack'])
check('folk absence recorded',recipe['pack']['folk_missing'])
im=m.repeat(tiles['street'][0],tuple(recipe['size']))
square=m.repeat(tiles['square'][0],im.size);plaza=tuple(recipe['plaza']);im.alpha_composite(square.crop(plaza),plaza[:2])
wrec=recipe['wall'];wall=Image.open(REV/wrec['source']).convert('RGBA').crop(wrec['crop'])
for x in range(wrec['x_start'],im.width,wrec['period']):im.alpha_composite(wall,(x,wrec['y']))
objects=[];built={};rows=defaultdict(list);coverage=Image.new('L',im.size)
for b in recipe['buildings']:
    a=Image.new('RGBA',(b['width'],b['height']))
    for p in b['parts']:
        piece=m.city.asset(p['file'][:-4])
        if p.get('crop'):piece=piece.crop(p['crop'])
        a.alpha_composite(piece,(p['x'],p['y']))
    built[b['id']]=a;rows[b['row']].append(b)
    check(b['id']+' native 48px lot',b['x']%48==0 and b['width']==b['spec']['width']*48)
    check(b['id']+' street-line foot',b['baseline']%48==0 and b['y']+b['height']==b['baseline'])
    check(b['id']+' 2-5 floors',2<=b['floors']<=5)
    for level in range(b['floors']):
        y=b['height']-(level+1)*48
        expected=[m.OUTLINE]+[(98,66,38,255)]*(b['width']-2)+[m.OUTLINE]
        for yy in (y,y+47):check(b['id']+f' floor {level} course {yy}',list(a.crop((0,yy,a.width,yy+1)).get_flattened_data())==expected)
        check(b['id']+f' opaque facade {level}',a.getchannel('A').crop((0,y,a.width,y+48)).getextrema()==(255,255))
    objects.append((b['baseline'],1,a,b['x'],b['y'],b['id']))
    coverage.paste(255,(b['x'],b['y'],b['x']+a.width,b['y']+a.height),a.getchannel('A'))
for name,bs in rows.items():
    for left,right in zip(bs,bs[1:]):check(name+' wall-to-wall neighbours',left['x']+left['width']==right['x'] and left['baseline']==right['baseline'])
rear_count=0
for b in recipe['buildings']:
    if not b['rear']:continue
    occlusion=Image.new('L',(b['width'],1))
    for f in recipe['buildings']:
        if f['rear'] or f['baseline']<=b['baseline']:continue
        yy=b['baseline']-1-f['y']
        fa=built[f['id']]
        if 0<=yy<fa.height:
            strip=fa.getchannel('A').crop((0,yy,fa.width,yy+1));occlusion.paste(strip,(f['x']-b['x'],0),strip)
    check(b['id']+' rear foot fully occluded',occlusion.getextrema()==(255,255));rear_count+=1
for i,p in enumerate(recipe['props']):
    a=tiles[p['tile']][p['index']]
    check(f'prop {i} baseline',p['y']+a.getbbox()[3]==p['foot'])
    objects.append((p['foot'],2,a,p['x'],p['y'],f"{p['tile']}-{i+1}"))
for i,p in enumerate(recipe['folk']):
    a=Image.open(REV/f"r15-M-clean-folk-b-{p['variant']}.png").convert('RGBA')
    check(f'person {i} baseline',p['y']+a.getbbox()[3]==p['foot'])
    objects.append((p['foot'],3,a,p['x'],p['y'],f'folk-{i}'))
ordered=sorted(objects,key=lambda q:(q[0],q[1],q[3]))
check('standing objects sorted by feet',recipe['draw_order']==[p[5] for p in ordered])
for foot,priority,a,x,y,ident in ordered:im.alpha_composite(a,(x,y))
scene=Image.open(REV/'r15-city-mockup.png').convert('RGBA')
check('full image replay from native source pixels',same(scene,im))
# The first critic caught a visual roof contact despite correct foot sorting.
# Require actual ground clearance around the repaired person's whole silhouette.
p=recipe['folk'][23]
person=Image.open(REV/f"r15-M-clean-folk-b-{p['variant']}.png").convert('RGBA')
margin=16
near=coverage.crop((p['x']-margin,p['y']-margin,p['x']+person.width+margin,p['y']+person.height+margin))
near=near.filter(ImageFilter.MaxFilter(2*margin+1)).crop((margin,margin,margin+person.width,margin+person.height))
check('person 23 has 16 clear pixels from architecture',ImageChops.multiply(near,person.getchannel('A')).getbbox() is None)
check('person 23 completely visible at native size',all(not pixel[3] or scene.getpixel((p['x']+i%person.width,p['y']+i//person.width))==pixel for i,pixel in enumerate(person.get_flattened_data())))
check('scene hard opaque alpha',scene.getchannel('A').getextrema()==(255,255))
check('scene native canvas',scene.size==(1200,912))
detail=Image.open(REV/'r15-city-mockup-detail-2x.png');box=json.loads(detail.info['Crop'])
check('detail exact 2x',same(detail,scene.crop(box).resize(detail.size,m.NN)))
comparison=Image.open(REV/'r15-city-mockup-vs-today.png')
today=Image.open(REV/'city-view-towns-2026-11-16.png').crop((0,0,600,500)).resize((1200,1000),m.NN)
check('today comparison full panel at native cell scale',same(today,comparison.crop((0,36,1200,1036))))
check('mockup comparison unchanged at 1x',same(scene,comparison.crop((1224,36,2424,948))))
pairs=0
for path in sorted(REV.glob('r15-M-*-1x.png')):
    partner=path.with_name(path.name[:-7]+'-4x.png')
    if not partner.exists():continue
    a=Image.open(path);b=Image.open(partner)
    check(path.name+' literal nearest-neighbour 4x',same(a.resize((a.width*4,a.height*4),m.NN),b));pairs+=1
for k in ('street','square','town_ground'):
    tile=tiles[k][0];r=Image.open(REV/f'r15-M-repeat-{k}-1x.png')
    for y in range(3):
        for x in range(3):check(k+f' repeat {x},{y}',same(tile,r.crop((x*tile.width,y*tile.height,(x+1)*tile.width,(y+1)*tile.height))))
report=dict(status='PASS',checks=len(checks),protected_files=protected,out_unchanged=True,compose_unchanged=True,mode_blocks=mode_blocks,samples=mode_blocks*64,proof_pairs=pairs,rear_feet_occluded=rear_count,buildings=len(recipe['buildings']),people=len(recipe['folk']),props=len(recipe['props']),building_coverage_percent=round(sum(coverage.histogram()[1:])*100/(im.width*im.height),3),measurements=measure,failed_files=[])
(REV/'r15-M-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='measurements'},indent=2))
