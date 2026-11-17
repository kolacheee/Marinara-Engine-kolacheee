"""R acceptance: source mode replay, real pixel identities, entrances and outputs."""
from pathlib import Path
from collections import Counter,defaultdict
from PIL import Image,ImageChops
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
sp=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
checks=[]
def check(name,ok,**evidence):checks.append(dict(name=name,pass_=bool(ok),**evidence))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def groups(a):
    w,h=a.size;v=list(a.getchannel('A').get_flattened_data());todo={i for i,p in enumerate(v) if p};out=[]
    while todo:
        i=todo.pop();stack=[i];n=0
        while stack:
            q=stack.pop();n+=1;y,x=divmod(q,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    j=yy*w+xx
                    if j in todo:todo.remove(j);stack.append(j)
        out.append(n)
    return out

files=json.loads((R/'r17-R-files.json').read_text())
for n,rec in files.items():
    a=c.asset(n);v=list(a.get_flattened_data());check(n+' dimensions',list(a.size)==rec['size']);check(n+' hard alpha',set(q[3] for q in v)<={0,255});check(n+' hidden RGB',all(q==(0,0,0,0) for q in v if not q[3]));check(n+' no detached specks',all(g>2 for g in groups(a)),components=groups(a));check(n+' file hash',sha(O/(n+'.png'))==rec['sha256'])
    for factor in (1,4):check(n+f' review {factor}x',(R/f'r17-R-piece-{n}-{factor}x.png').exists())
    a1=Image.open(R/f'r17-R-piece-{n}-1x.png');a4=Image.open(R/f'r17-R-piece-{n}-4x.png');check(n+' exact4x',a4.tobytes()==a1.resize((a1.width*4,a1.height*4),c.NEAREST).tobytes())
for side in ('left','right'):
    a=c.asset('storey-sign-bay-'+side+'-w2');donor=c.asset('storey-timber-w2-c0')
    check(side+' attachment courses',all(a.crop((0,y,96,y+1)).tobytes()==donor.crop((0,y,96,y+1)).tobytes() for y in (0,47)))
for n in ['cathedral','guildhall','gatehouse','wall-tower','wall-walk','wall-walk-stair','fountain','market-cross','shrine']:
    check(n+' silhouette preserved',c.asset(n).getchannel('A').tobytes()==c.asset(n+'-r').getchannel('A').tobytes())
# All64 registered votes, including transparency, with lexicographic RGBA ties.
samples=0
for rec in json.loads((R/'r17-R-generation.json').read_text()):
    a=Image.open(R/f"r17-R-registered-{rec['id']}.png").convert('RGBA');mode=Image.open(R/f"r17-R-mode-{rec['id']}.png").convert('RGBA');w,h=mode.size;v=list(a.get_flattened_data());expected=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(p for yy in range(8) for p in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);expected.append(min(votes,key=lambda p:(-votes[p],p)))
    samples+=w*h*64;check(rec['id']+' exact mode',expected==list(mode.get_flattened_data()),samples=w*h*64)
# Every original production file remains exact, except the named composer.
protected=json.loads((R/'r17-R-before-hashes.json').read_text());changed=[]
for path,digest in protected.items():
    p=Path(path)
    if p==O/'compose.py' or p.as_posix().endswith('/city17/compose.py'):continue
    if sha(p)!=digest:changed.append(path)
check('protected production files',not changed,count=len(protected)-1,changed=changed)
layouts={'city':c.r_city_layout(),**c.e_layouts()}
for key in c.E_DISTRICTS:layouts['district-'+key]=c.e_district_layout(key)
audits={}
for name,l in layouts.items():
    a=c.r_repeat_audit(l);audits[name]=a;check(name+' resolved-piece limit',not a['failures'],windows=a['windows'],failures=a['failures'])
# Regression detector: restore each exact failed selection and require failure.
bad=json.loads(json.dumps(layouts['L-block']))
for b in bad['lots']:
    if b['id']=='north-rear-3':b['spec'].pop('roof_file',None)
check('detect original north-rear failure',bool(c.r_repeat_audit(bad)['failures']))
bad=json.loads(json.dumps(layouts['market']))
for b in bad['lots']:
    if b['id'].startswith('trade-'):b['spec']['ground_file']='ground-shop-v1-w2-c0'
check('detect original forced trade front',bool(c.r_repeat_audit(bad)['failures']))
for name in ['L-block','market','height-test']:
    a=c.e_entrance_approaches(layouts[name]);check(name+' retained48px entrances',all(not q['blocked_pixels'] and q['inside_canvas'] for q in a),count=len(a))
l=layouts['city'];size=tuple(l['size']);mask=Image.new('L',size);architecture=Image.new('L',size)
for b in l['lots']:
    a,_=c.build_c(b['spec']);q=Image.new('L',size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,q);architecture=ImageChops.lighter(architecture,q)
for p in l['props']:
    if p['file']=='person':continue
    a=c.r_prop_image(p);q=Image.new('L',size);q.paste(a.getchannel('A'),(p['x'],p['base']-a.height));mask=ImageChops.lighter(mask,q)
entrances=[]
for b in l['lots']+l['props']:
    if not b.get('entrance') or b.get('id')=='gatehouse':continue
    x,y=b['entrance'];w=48 if b.get('id') in ('cathedral','guildhall') else 24;h=48 if w==48 else 32
    blocked=sum(v>0 for v in mask.crop((x-w//2,y,x+w//2,y+h)).get_flattened_data());entrances.append(dict(id=b['id'],rect=[x-w//2,y,w,h],blocked=blocked))
check('city standing and public approaches',all(e['blocked']==0 for e in entrances),count=len(entrances),blocked=[e for e in entrances if e['blocked']])
# Plain pavement underneath the city except the two explicitly enclosed gardens.
ground=c.e_ground(l);grass=Image.new('L',size)
for x,y,w,h in l['gardens']:grass.paste(255,(x,y,x+w,y+h))
check('only enclosed gardens assigned',l['gardens']==[[576,672,144,96],[240,720,96,144]])
check('city defaults to paving',l['ground_base']=='cobble-small')
# Explicit closed masses: passages/courts are excluded, not counted as roof holes.
blocks=[[144,336,288,288],[1392,384,384,240],[144,864,96,144],[1392,864,384,144],[144,1200,288,144],[576,1200,528,144]]
for i,(x,y,w,h) in enumerate(blocks):
    missing=sum(v==0 for v in architecture.crop((x,y,x+w,y+h)).get_flattened_data());check('closed block coverage '+str(i),missing==0,rect=[x,y,w,h],uncovered=missing)
# The96px through-route stays free of stationary market objects; gate itself
# is a separately documented overhead span, with an open96px lower portal.
route=[1104,768,96,288];x,y,w,h=route
block=sum(v>0 for v in mask.crop((x,y,x+w,y+h)).get_flattened_data());check('square96px route',block==0,blocked=block,rect=route)
check('six stalls',len([p for p in l['props'] if p['file'].startswith('stall-')])==6)
check('square dimensions',l['square']==[720,672,480,384] and l['square_notch']==[1104,672,96,96])
hist=Counter(b['spec'].get('floors',len(b['spec'].get('storeys',[]))+1) for b in l['lots']);front=Counter(len(b['spec']['storeys'])+1 for b in l['lots'] if b['spec'].get('view','front')=='front')
check('one-storey share',hist[1]/sum(hist.values())<=.25,histogram=dict(hist),percent=100*hist[1]/sum(hist.values()))
check('all live lots1/2 cells',all(b['spec'].get('width',2) in (1,2) for b in l['lots']))
for b in l['lots']:
    for o in b['spec'].get('overlays',[]):
        if o['file'].startswith('sign-'):
            a=c.asset(o['file']);check(b['id']+' sign inside lot',0<=o['x'] and o['x']+a.width<=b['spec']['width']*48)
a=Image.open(R/'r17-city-final.png');a2=Image.open(R/'r17-city-final-2x.png');check('native40x30 canvas',a.size==(1920,1440));check('exact2x city',a.resize((3840,2880),c.NEAREST).tobytes()==a2.tobytes())
for name in ['cobble-large','cobble-small','street-main','street-side','lane','mud-edge']:
    a=Image.open(R/f'r17-R-repeat-{name}-1x.png');b=Image.open(R/f'r17-R-repeat-{name}-4x.png');tile=c.asset(name);check(name+' literal3x3 dimensions',a.size==(tile.width*3,tile.height*3));check(name+' exact repeat4x',a.resize((a.width*4,a.height*4),c.NEAREST).tobytes()==b.tobytes())
failed=[q for q in checks if not q['pass_']]
report=dict(part='R',passed=len(checks)-len(failed),total=len(checks),failed=failed,checks=checks,mode_samples=samples,storey_histogram=dict(hist),street_front_histogram=dict(front),buildings=sum(hist.values()),townsfolk=sum(p['file']=='person' for p in l['props']),exports=len(files),entrances=entrances,repetition=audits,scope='Saved-art checks. Runtime routing/fading is outside PartR.')
(R/'r17-R-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ('checks','entrances','repetition')},indent=2))
raise SystemExit(bool(failed))
