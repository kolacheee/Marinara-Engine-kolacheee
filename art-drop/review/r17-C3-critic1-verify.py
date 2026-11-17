"""Independent source replay and geometry assertions for the named critic fixes."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops,ImageStat
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
checks=[]
def check(name,ok,**extra):checks.append(dict(name=name,passed=bool(ok),**extra))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
logs=json.loads((R/'r17-C3-critic1-processing.json').read_text());gens=json.loads((R/'r17-C3-critic1-generation.json').read_text());samples=0
for rec,log in zip(gens,logs['drawings']):
    name=rec['id'];registered=Image.open(R/f'r17-C3-critic1-registered-{name}.png').convert('RGBA');mode=Image.open(R/f'r17-C3-critic1-mode-{name}.png').convert('RGBA');w,h=mode.size;values=list(registered.get_flattened_data());expected=[]
    for y in range(h):
        for x in range(w):
            count=Counter(p for yy in range(8) for p in values[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);expected.append(min(count,key=lambda p:(-count[p],p)))
    check(name+' exact 64-sample RGBA mode',expected==list(mode.get_flattened_data()))
    check(name+' retained source',sha(R/rec['source'])==log['source_sha256'])
    cleaned=expected[:]
    for x,y,before,after in log['cleanup']:
        assert list(cleaned[y*w+x])==before;cleaned[y*w+x]=tuple(after)
    check(name+' complete cleanup replay',cleaned==list(Image.open(R/f'r17-C3-critic1-clean-{name}.png').convert('RGBA').get_flattened_data()))
    samples+=w*h*64
before=json.loads((R/'r17-C3-critic1-before-files.json').read_text());permitted={'art-drop/out/city17/'+n for n in ['compose.py','roof-hip-deep-c3-w2.png','roof-hip-chimney-c3-w2.png','roof-hip-dormer-c3-w2.png']}
changed=[p for p,h in before.items() if sha(Path(p))!=h]
check('only three failed PNGs and composer changed',set(changed)==permitted,changed=changed,protected_count=len(before)-len(permitted))
passed=json.loads((R/'critic-r17C3-1.json').read_text())['files'];passing=[n for n,r in passed.items() if r['status']=='pass']
check('every passing production PNG byte-identical',all(sha(O/(n+'.png'))==before[str(O.relative_to(Path.cwd())/(n+'.png'))] for n in passing),count=len(passing))
cap=c.asset('roof-hip-deep-c3-w2');check('new base is a three-cell cap',cap.size==(96,144))
check('fill is separate native directional band',c.asset('roof-fill-hip-c3-w2').tobytes()==cap.crop((0,48,96,96)).tobytes())
for name,accents in c.BAKED_ROOF_ACCENTS.items():
    a=cap.copy()
    for o in accents:a.alpha_composite(c.asset(o['file']),(o['x'],o['y']))
    check(name+' exact native overlay and alpha',a.tobytes()==c.asset(name).tobytes() and a.getchannel('A').tobytes()==cap.getchannel('A').tobytes())
    check(name+' cap depth',a.size==(96,144))
bad=c.c3_front(2,3,0,'roof-connected-r-w2')
try:c.build(bad);rejected=False
except ValueError:rejected=True
check('four-cell cap rejected by final builder',rejected)
saved=json.loads(json.dumps(c.BAKED_ROOF_ACCENTS))
try:
    c.BAKED_ROOF_ACCENTS['roof-hip-dormer-c3-w2']=[dict(file='dormer-0-c0',x=36,y=92)]
    try:c.build(c.c3_front(2,3,0,'roof-hip-dormer-c3-w2'));rejected=False
    except ValueError:rejected=True
finally:c.BAKED_ROOF_ACCENTS.clear();c.BAKED_ROOF_ACCENTS.update(saved)
check('original ridge-straddling baked dormer rejected',rejected)
l=c.c3_city_layout();fronts=[b for b in l['lots'] if b['spec'].get('view','front')=='front'];pairs=[]
for a in fronts:
    for b in fronts:
        if a['x']+a['spec']['width']*48!=b['x']:continue
        ha=c.build(a['spec'])[0].height;hb=c.build(b['spec'])[0].height
        if max(a['base']-ha,b['base']-hb)>=min(a['base'],b['base']):continue
        if a['base']==b['base']:continue
        ea=a['base']-48*(len(a['spec']['storeys'])+1);eb=b['base']-48*(len(b['spec']['storeys'])+1)
        high,low,side=(a,b,'right') if ea<eb else (b,a,'left')
        ok=True
        if ea!=eb:
            wall=next((w for w in high['spec']['firewalls'] if w['side']==side and w['neighbour']==low['id']),None)
            _,parts=c.build(high['spec']);layers={p['layer'] for p in parts}
            ok=wall and wall['height']==abs(ea-eb) and {'firewall body','firewall coping','firewall flashing'}<=layers
        south=a if a['base']>b['base'] else b
        ok=ok and bool(south['spec'].get('step_returns'))
        pairs.append(dict(left=a['id'],right=b['id'],bases=[a['base'],b['base']],eaves=[ea,eb],passed=bool(ok)))
check('all seven actual staggered property/roof joins treated',all(p['passed'] for p in pairs) and len(pairs)==7,pairs=pairs)
for b in fronts:
    name=c.r_resolved_assets(b)['roof'];check(b['id']+' cap is two or three cells',c.asset(name).height in (96,144))
    if b['spec'].get('roof_depth',0)>c.asset(name).height//48:
        _,parts=c.build(b['spec']);check(b['id']+' depth uses separate fill',any(p['layer']=='directional roof fill' for p in parts))
field=Image.open(R/'r17-C3-critic1-clean-road-b.png').convert('RGBA').crop((48,120,144,168));phase_origin=(1104,960)
mounts=[('gate-elbow-c3',1104,960),('gate-square-mouth-c3',1032,744),('gate-straight-c3',1104,864),('gate-straight-south-c3',1200,1152),('gate-cross-straight-c3',1296,1056)]
for n,x,y in mounts:
    a=c.asset(n);mismatch=sum(p[3]>0 and p!=field.getpixel(((x+xx-phase_origin[0])%96,(y+yy-phase_origin[1])%48)) for yy in range(a.height) for xx in range(a.width) for p in [a.getpixel((xx,yy))])
    check(n+' identical world-phase stones through joins',mismatch==0,mismatches=mismatch)
ground=c.c3_ground(l);base=ImageStat.Stat(c.asset('cobble-c3').convert('L')).mean[0]
for n,box in [('square entrance',(1120,840,1184,904)),('north arm',(1120,984,1184,1048)),('horizontal elbow',(1120,1072,1472,1136)),('south arm',(1216,1200,1280,1440))]:
    lum=ImageStat.Stat(ground.crop(box).convert('L')).mean[0];check(n+' greyscale route contrast',lum-base>=20,mean=round(lum,2),field_mean=round(base,2),difference=round(lum-base,2))
audit=c.c3_repeat_audit(l);check('all resolved facade cap and fill repetitions',not audit['failures'],**audit)
city=Image.open(R/'r17-city-final.png').convert('RGBA');comparison=Image.open(R/'r17-city-final-vs-r15-vs-today.png').convert('RGBA');x=16
for label,a in [('today',Image.open(R.parent/'reference/r17/current-town.png').convert('RGBA')),('round15',Image.open(R/'r15-city-mockup.png').convert('RGBA')),('C3',city)]:
    check(label+' comparison remains literal1x',comparison.crop((x,32,x+a.width,32+a.height)).tobytes()==a.tobytes());x+=a.width+16
data=dict(passed=sum(p['passed'] for p in checks),failed=sum(not p['passed'] for p in checks),new_mode_samples=samples,checks=checks)
(R/'r17-C3-critic1-verification.json').write_text(json.dumps(data,indent=2));print(json.dumps({k:v for k,v in data.items() if k!='checks'},indent=2))
for p in checks:
    if not p['passed']:print(json.dumps(p))
if data['failed']:raise SystemExit(1)
