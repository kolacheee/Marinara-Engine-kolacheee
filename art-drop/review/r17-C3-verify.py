"""C3 reproducible art/source and composed-geometry checks."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
checks=[]
def check(n,v,**data):checks.append(dict(name=n,passed=bool(v),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def components(a):
    w,h=a.size;todo={i for i,v in enumerate(a.getchannel('A').get_flattened_data()) if v};out=[]
    while todo:
        stack=[todo.pop()];n=0
        while stack:
            i=stack.pop();n+=1;x,y=i%w,i//w
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    j=yy*w+xx
                    if j in todo:todo.remove(j);stack.append(j)
        out.append(n)
    return out

files=json.loads((R/'r17-C3-files.json').read_text())
for n,rec in files.items():
    a=c.asset(n);v=list(a.get_flattened_data())
    check(n+' dimensions',list(a.size)==rec['size']);check(n+' hard alpha',set(q[3] for q in v)<={0,255});check(n+' zero hidden RGB',all(q==(0,0,0,0) for q in v if not q[3]));check(n+' no detached specks',all(n>2 for n in components(a)),components=components(a));check(n+' hash',sha(O/(n+'.png'))==rec['sha256'])
    a1=Image.open(R/f'r17-C3-piece-{n}-1x.png');a4=Image.open(R/f'r17-C3-piece-{n}-4x.png');check(n+' exact4x sheet',a4.tobytes()==a1.resize((a1.width*4,a1.height*4),c.NEAREST).tobytes())
    if n.startswith('ground-'):
        d=c.asset('ground-shop-w2-c0');check(n+' stack courses',all(a.crop((0,y,96,y+1)).tobytes()==d.crop((0,y,96,y+1)).tobytes() for y in (0,47)))
samples=0
for rec in json.loads((R/'r17-C3-generation.json').read_text()):
    a=Image.open(R/f"r17-C3-registered-{rec['id']}.png").convert('RGBA');mode=Image.open(R/f"r17-C3-mode-{rec['id']}.png").convert('RGBA');w,h=mode.size;v=list(a.get_flattened_data());expected=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(p for yy in range(8) for p in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);expected.append(min(votes,key=lambda p:(-votes[p],p)))
    samples+=w*h*64;check(rec['id']+' exact mode',expected==list(mode.get_flattened_data()),samples=w*h*64)
protected=json.loads((R/'r17-C3-before-files.json').read_text());changed=[p for p,h in protected.items() if not p.endswith('/city17/compose.py') and sha(Path(p))!=h]
check('previous production paint unchanged',not changed,count=len(protected)-1,changed=changed)
l=c.c3_city_layout();audit=c.c3_repeat_audit(l);check('city straight AND bent frontage repetition',not audit['failures'],**audit)
regressions=c.e_layouts()
for key in c.E_DISTRICTS:regressions['district-'+key]=c.e_district_layout(key)
for n,layout in regressions.items():
    a=c.r_repeat_audit(layout);check(n+' resolved-piece repetition',not a['failures'],**a)
bad=json.loads(json.dumps(regressions['L-block']))
for b in bad['lots']:
    if b['id']=='north-rear-3':b['spec'].pop('roof_file',None)
check('original E rear-cap failure detected',bool(c.r_repeat_audit(bad)['failures']))
bad=json.loads(json.dumps(regressions['market']))
for b in bad['lots']:
    if b['id'].startswith('trade-'):b['spec']['ground_file']='ground-shop-v1-w2-c0'
check('original E forced trade-front failure detected',bool(c.r_repeat_audit(bad)['failures']))
for n in ('L-block','market','height-test'):
    a=c.e_entrance_approaches(regressions[n]);check(n+' retained approaches',all(not x['blocked_pixels'] and x['inside_canvas'] for x in a),count=len(a))
hist=Counter(b['spec'].get('floors',len(b['spec'].get('storeys',[]))+1) for b in l['lots'])
check('one-storey buildings below25percent',hist[1]/len(l['lots'])<=.25,storeys=dict(hist),buildings=len(l['lots']),one_storey_percent=100*hist[1]/len(l['lots']))
check('three irregular blocks',len(l['block_shapes'])>=3)
check('bent street changes actual base rows',len({b['base'] for b in l['lots'] if b['frontage_group']=='west-wedge'})==3)
east=[b for b in l['lots'] if b['frontage_group']=='east-trapezoid'];heights=[len(b['spec']['storeys'])+1 for b in sorted(east,key=lambda x:x['x'])]
check('2to5 storeys and1to2 steps in east block',min(heights)==2 and max(heights)==5 and all(1<=abs(a-b)<=2 for a,b in zip(heights,heights[1:])),heights=heights)
xs=[p['x'] for p in l['props'] if p.get('id','').startswith('C3-north-tower-')];intervals=[(b-a)//48 for a,b in zip(xs,xs[1:])]
check('uneven towers',len(set(intervals))>=3,interval_cells=intervals)
check('corner bastion',any(p.get('id')=='C3-corner-bastion-wing' for p in l['props']))
check('five new shopfronts used',len({n for b in l['lots'] for n in c.r_resolved_assets(b).values() if n.startswith('ground-') and '-c3-' in n})==5)
check('no narrow deep guildhall roof',all(not(b['x']==1056 and c.build_c(b['spec'])[0].height>240) for b in l['lots']))
check('NE slab replaced by hip',next(b for b in l['lots'] if b['id']=='C3-north-east-5')['spec']['roof_file']=='roof-hip-deep-c3-w2')
check('six stalls',len([p for p in l['props'] if p.get('id','').startswith('stall-')])==6)
check('only enclosed summer gardens',l['gardens']==[[576,672,144,96],[240,912,96,96]])
check('48px canvas registration',l['size']==[40*48,30*48] and all(b['x']%48==0 and b['base']%48==0 for b in l['lots']))
mask=Image.new('L',tuple(l['size']));paint=[]
for b in l['lots']:
    a,_=c.build_c(b['spec']);q=Image.new('L',mask.size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,q);paint.append((b['id'],q))
for p in l['props']:
    if p['file']=='person' or p.get('id')=='gatehouse':continue
    a=c.r_prop_image(p);q=Image.new('L',mask.size);q.paste(a.getchannel('A'),(p['x'],p['base']-a.height));mask=ImageChops.lighter(mask,q);paint.append((p.get('id',p['file']),q))
entrances=[]
for b in l['lots']+l['props']:
    if not b.get('entrance') or b.get('id')=='gatehouse':continue
    x,y=b['entrance'];w=48 if b['id'] in ('cathedral','guildhall') else 24;h=48 if w==48 else 32
    n=sum(v>0 for v in mask.crop((x-w//2,y,x+w//2,y+h)).get_flattened_data());entrances.append(dict(id=b['id'],rect=[x-w//2,y,w,h],blocked=n))
check('all standing/public approaches clear',all(not e['blocked'] for e in entrances),count=len(entrances),blocked=[e for e in entrances if e['blocked']])
routes=[]
# Street clearance excludes the documented overhead civic tower only. Its
# ground footprint and posts remain; the normal/reveal proof shows its actor.
route_mask=Image.new('L',mask.size)
for name,a in paint:
    a=a.copy()
    p=next((p for p in l['lots']+l['props'] if p.get('id')==name and p.get('foreground_mask')),None)
    if p:
        h=c.build_c(p['spec'])[0].height if 'spec' in p else c.r_prop_image(p).height
        x,y=p['x'],p['base']-h;left,top,right,bottom=p['foreground_mask'];a.paste(0,(x+left,y+top,x+right,y+bottom))
    route_mask=ImageChops.lighter(route_mask,a)
for r in l['roads']:
    if r.get('kind')!='main' and r.get('id') not in ('wall-service','wall-service-bay','north-through-alley','square-through-alley','square-west-exit','gate-wall-bypass'):continue
    x,y,w,h=r['rect'];n=sum(v>0 for v in route_mask.crop((x,y,x+w,y+h)).get_flattened_data());owners=[]
    if n:owners=[(n,sum(v>0 for v in a.crop((x,y,x+w,y+h)).get_flattened_data())) for n,a in paint if a.crop((x,y,x+w,y+h)).getbbox()]
    routes.append(dict(id=r['id'],rect=r['rect'],blocked=n,owners=owners))
check('every main street96 service48 and through-alleys clear',all(not r['blocked'] for r in routes),routes=routes)
check('all main street ids audited',set(r['id'] for r in l['roads'] if r.get('kind')=='main')<=set(r['id'] for r in routes))
check('all main street segments declared clear and at least96px',all(r.get('clear') and min(r['rect'][2:])>=96 for r in l['roads'] if r.get('kind')=='main'))
check('western pinch has literal96px visible corridor',not mask.crop((240,672,336,768)).getbbox(),rect=[240,672,96,96])
check('inn court48px path clear',not mask.crop((1488,864,1536,1056)).getbbox(),rect=[1488,864,48,192])
signs=[]
for b in l['lots']:
    for p in b['spec'].get('overlays',[]):
        a=c.asset(p['file']);signs.append(dict(lot=b['id'],file=p['file'],contained=0<=p['x'] and p['x']+a.width<=b['spec']['width']*48))
check('all signs inside their lots',all(p['contained'] for p in signs),signs=signs)
architecture=Image.new('L',mask.size)
for b in l['lots']:
    a,_=c.build_c(b['spec']);q=Image.new('L',mask.size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));architecture=ImageChops.lighter(architecture,q)
for n,rect in [('west wedge',(144,336,432,576)),('north middle',(480,336,672,576)),('east wedge',(1392,384,1584,576)),('east hip end',(1632,480,1776,672)),('south L',(144,1104,432,1296)),('inn wings',(1296,864,1488,1056))]:
    holes=sum(v==0 for v in architecture.crop(rect).get_flattened_data());check(n+' closed roof/wall mass',holes==0,rect=rect,holes=holes)
ordered=[]
for b in l['lots']:
    a,_=c.build_c(b['spec']);ordered.append((b['base'],0,b['x'],a,b['id'],False))
for p in l['props']:ordered.append((p['base'],p.get('layer',1),p['x'],c.r_prop_image(p),p.get('id',p['file']),p['file']=='person'))
ordered.sort(key=lambda t:(t[0],t[1],t[2]));occlusion=Image.new('L',mask.size);actors=[]
for base,z,x,a,n,person in reversed(ordered):
    y=base-a.height
    if person:
        vis=ImageChops.multiply(a.getchannel('A'),ImageChops.invert(occlusion.crop((x,y,x+a.width,y+a.height))));actors.append(dict(id=n,visible=sum(v>0 for v in vis.get_flattened_data())))
    else:
        q=Image.new('L',mask.size);q.paste(a.getchannel('A'),(x,y));occlusion=ImageChops.lighter(occlusion,q)
check('no fully hidden scene actors',all(a['visible'] for a in actors),actors=actors)
im,_,shadows=c.r_render(l);check('final matches current compose',im.tobytes()==Image.open(R/'r17-city-final.png').convert('RGBA').tobytes())
check('exact final2x',Image.open(R/'r17-city-final-2x.png').tobytes()==im.resize((3840,2880),c.NEAREST).tobytes())
check('native squint',Image.open(R/'r17-city-final-squint.png').tobytes()==im.convert('L').tobytes())
for n,box in {'square':(696,624,1320,1080),'street':(96,240,720,816),'gate':(1104,720,1776,1440)}.items():
    a=im.crop(box);check(n+' crop exact3x',Image.open(R/f'r17-city-final-crop-{n}-3x.png').tobytes()==a.resize((a.width*3,a.height*3),c.NEAREST).tobytes())
check('every building has native cast shade',all(any(r.get('id')==b['id'] for r in shadows) for b in l['lots']),cast_records=len(shadows))
for n in ['cobble-c3','street-main-c3','street-side-c3','lane-c3','gate-paving-c3','ditch-c3','street-edge-c3','puddle-c3','mud-edge']:
    a=c.asset(n);g=c.asset_path_grass() if n in ('ditch-c3','street-edge-c3','mud-edge') else c.asset('cobble-c3');expected=c.repeat(g,(a.width*3,a.height*3))
    for y in range(3):
        for x in range(3):expected.alpha_composite(a,(a.width*x,a.height*y))
    b=Image.open(R/f'r17-C3-repeat-{n}-1x.png').convert('RGBA');check(n+' literal3x3',b.tobytes()==expected.tobytes());check(n+' repeat exact4x',Image.open(R/f'r17-C3-repeat-{n}-4x.png').tobytes()==b.resize((b.width*4,b.height*4),c.NEAREST).tobytes())
data=dict(checks=checks,passed=sum(v['passed'] for v in checks),failed=sum(not v['passed'] for v in checks),mode_samples=samples,storeys=dict(hist),buildings=len(l['lots']),people=len([p for p in l['props'] if p['file']=='person']),entrances=entrances)
(R/'r17-C3-verification.json').write_text(json.dumps(data,indent=2))
print(json.dumps({k:v for k,v in data.items() if k not in ('checks','entrances')},indent=2))
for v in checks:
    if not v['passed']:print(json.dumps(v))
if data['failed']:raise SystemExit(1)
