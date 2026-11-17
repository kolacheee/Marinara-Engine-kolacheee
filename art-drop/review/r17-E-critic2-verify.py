"""Replay the paving redraw and regression checks for visible lane/entrances."""
from pathlib import Path
from collections import Counter
from PIL import Image, ImageChops, ImageStat
import json, hashlib, importlib.util, copy

R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';B=R/'r17-E-critic2-before'
checks=[]
def check(name,ok,detail=None):checks.append(dict(check=name,passed=bool(ok),detail=detail))
def rgba(p):return Image.open(p).convert('RGBA')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

before=json.loads((B/'hashes.json').read_text());files=json.loads((R/'r17-E-files.json').read_text())
failed={'cobble-small.png','street-side.png','lane.png','compose.py'}
protected={p:h for p,h in before.items() if '/out/' in p and not (Path(p).resolve().parent==O and Path(p).name in failed)}
changed=[p for p,h in protected.items() if not Path(p).exists() or sha(Path(p))!=h]
check('all passing and earlier production files byte-identical',not changed,dict(count=len(protected),changed=changed))
check('75 passing Part E PNGs unchanged',all(sha(O/(n+'.png'))==before[str((O/(n+'.png')).relative_to(A.parent))] for n in files if n+'.png' not in failed))
for name in failed:check(name+' changed',sha(O/name)!=sha(B/name))
samples=0
for rec in json.loads((R/'r17-E-critic2-processing.json').read_text()):
    ident=rec['id'];reg=rgba(R/f'r17-E-critic2-registered-{ident}.png');mode=rgba(R/f'r17-E-critic2-mode-{ident}.png');raw=list(mode.get_flattened_data());valid=True
    for y in range(48):
        row=list(reg.crop((0,y*8,384,y*8+8)).get_flattened_data())
        for x in range(48):
            votes=Counter(q for yy in range(8) for q in row[yy*384+x*8:yy*384+x*8+8])
            valid &= min(votes,key=lambda q:(-votes[q],q))==raw[y*48+x];samples+=64
    check(ident+' exact64sample mode',valid)
    wrapped=mode.copy();wrapped.paste(wrapped.crop((0,0,1,48)),(47,0));wrapped.paste(wrapped.crop((0,0,48,1)),(0,47))
    check(ident+' wrap replay',wrapped.tobytes()==rgba(R/f'r17-E-critic2-clean-{ident}.png').tobytes())
    check(ident+' original source hash',sha(R/rec['source'])==rec['source_sha256'])
small=rgba(O/'cobble-small.png');band_stats={}
check('selected A paint matches output',small.tobytes()==rgba(R/'r17-E-critic2-clean-cobble-small-a.png').tobytes())
for name,k in [('cobble-small',0),('street-side',4),('lane',3)]:
    a=rgba(O/(name+'.png'));old=rgba(B/(name+'.png'));w,h=a.size
    check(name+' unchanged dimensions',a.size==old.size)
    vals=[ImageStat.Stat(a.convert('L').crop((k,y,w-k,y+8))).mean[0] for y in range(0,48,8)]
    band_stats[name]=dict(eight_row_luminance=vals,range=max(vals)-min(vals),top_bottom_difference=abs(vals[0]-vals[-1]))
    check(name+' no broad eight-row value drift',max(vals)-min(vals)<3,band_stats[name])
    check(name+' drawn interior transfer',a.crop((k,0,w-k,48)).tobytes()==small.crop((k,0,w-k,48)).tobytes())
    if k:
        check(name+' both kerbs/gutters byte-identical',all(a.crop((x,0,x+k,48)).tobytes()==old.crop((x,0,x+k,48)).tobytes() for x in (0,w-k)))
    # The newly wrapped paving edge matches. Existing kerb stone courses
    # are protected paint; their top/bottom rows need not be identical.
    check(name+' paved interior vertical repeat seam',a.crop((k,0,w-k,1)).tobytes()==a.crop((k,47,w-k,48)).tobytes())

s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
layouts=json.loads((R/'r17-E-scenes.json').read_text());entrances={};mounted=[];washing={}
for name,l in layouts.items():
    approaches=c.e_entrance_approaches(l);entrances[name]=approaches
    check(name+' recorded entrance audit replays',approaches==l['entrance_approaches'])
    for a in approaches:check(name+' '+a['id']+' visible48x48 approach',a['blocked_pixels']==0 and a['inside_canvas'],a)
    for b in l['lots']:
        for p in b['spec'].get('overlays',[]):
            if p['file'].startswith('sign-'):
                mounted.append(p['file']);check(name+' '+b['id']+' sign leaves right entrance clear',p['x']+c.asset(p['file']).width<=68)
    if name.startswith('district-'):
        ground=c.e_ground(l);court=ground.crop((480,576,576,624));paving=c.asset('cobble-large')
        expected=Image.new('RGBA',(96,48));expected.paste(paving,(0,0));expected.paste(paving,(48,0))
        check(name+' full96x48 porch/arch court paved',court.tobytes()==expected.tobytes())
        check(name+' court directly joins48px side lane',any(p['file']=='street-side' and p['rect']==[576,576,48,192] for p in l['roads']))
        # Restoring the old two-storey position must reproduce the rejected
        # 2,304px obstruction, proving the new audit detects this regression.
        regression=copy.deepcopy(l);b=next(b for b in regression['lots'] if b['id'].endswith('-10'))
        key=name.removeprefix('district-');b['base']=624;b['entrance'][1]=624;b['spec']=c.e_spec(key,2,1)
        b['spec']['roof_file']=f'district-{key}-roof-w2';b['spec']['roof']='ridge'
        observed=next(p for p in c.e_entrance_approaches(regression) if p['id']==b['id'])
        check(name+' audit detects old hidden approach',observed['blocked_pixels']==2304,observed['blocked_pixels'])
    for p in l['props']:
        if p['file']!='washing-line':continue
        a=c.asset(p['file']);x,y=p['x'],p['base']-a.height;later=Image.new('L',a.size)
        for b in l['lots']:
            if b['base']<=p['base']:continue
            bb,_=c.build_c(b['spec']);layer=Image.new('L',a.size);layer.paste(bb.getchannel('A'),(b['x']-x,b['base']-bb.height-y));later=ImageChops.lighter(later,layer)
        for q in l['props']:
            if q is p or q['base']<=p['base']:continue
            bb=rgba(A/q['path']) if q.get('path') else c.asset(q['file']);layer=Image.new('L',a.size);layer.paste(bb.getchannel('A'),(q['x']-x,q['base']-bb.height-y));later=ImageChops.lighter(later,layer)
        n=sum(bool(v) for v in ImageChops.multiply(a.getchannel('A'),later).get_flattened_data());washing[name]=n;check(name+' washing remains visible',n==0,n)
poor=c.e_ground(layouts['district-poor']);lane=c.asset('lane');expected=Image.new('RGBA',(24,144))
for y in range(0,144,48):expected.paste(lane,(0,y))
actual=poor.crop((96,480,120,624))
check('poor lane all2592 interior pixels retain paving',actual.crop((3,0,21,144)).tobytes()==expected.crop((3,0,21,144)).tobytes())
check('poor lane all3456 pixels retain paving and kerbs',actual.tobytes()==expected.tobytes())
check('all eight trade signs remain mounted',set(mounted)=={'sign-'+s for s in ('smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher')})
base=json.loads((R/'r17-E-verification.json').read_text());check('general E audit passes',base['checks']==base['passed'],base['failures'])
segments=[s for scene in base['scenes'].values() for s in scene['street_segments']]
check('every street segment receives cast shade',all(s['shadow_pixels']>0 for s in segments),len(segments))
result=dict(checks=len(checks),passed=sum(r['passed'] for r in checks),failures=[r for r in checks if not r['passed']],new_mode_samples=samples,
            protected_production_files=len(protected),passing_E_PNGs=75,street_segments=len(segments),entrance_count=sum(map(len,entrances.values())),
            entrance_approaches=entrances,paving_luminance=band_stats,washing_occluded_pixels=washing,results=checks)
(R/'r17-E-critic2-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k not in ('results','entrance_approaches')},indent=2))
