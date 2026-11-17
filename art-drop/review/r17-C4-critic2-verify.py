"""Replay critic-2 reduction and check the exact reported failure cases."""
from pathlib import Path
from PIL import Image,ImageChops
from collections import Counter
import importlib.util,json,hashlib,copy
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';ROOT=R.parent.parent
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
checks=[]
def check(name,ok,**data):checks.append(dict(name=name,passed=bool(ok),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
baseline=json.loads((R/'r17-C4-critic2-before.json').read_text());critic=json.loads((R/'critic-r17C4-2.json').read_text())
allowed={'art-drop/out/city17/compose.py','art-drop/out/city17/north-shop-court-c4-w1.png'}
changed=[p for p,h in baseline.items() if sha(ROOT/p)!=h]
check('only failed native PNG and composer changed',set(changed)<=allowed,changed=changed,protected=len(baseline)-2)
passing=[n for n,r in critic['files'].items() if r['status']=='pass' and (O/(n+'.png')).exists()]
check('all105 passing native C4 PNGs identical',len(passing)==105 and all(sha(O/(n+'.png'))==baseline['art-drop/out/city17/'+n+'.png'] for n in passing),count=len(passing))
check('passing street crop byte identical',sha(R/'r17-city-final-crop-street-3x.png')==baseline['art-drop/review/r17-city-final-crop-street-3x.png'])
log=json.loads((R/'r17-C4-critic2-processing.json').read_text());samples=0
for d in log['drawings']:
 n=d['id'];a=Image.open(R/f'r17-C4-registered-{n}.png').convert('RGBA');m=Image.open(R/f'r17-C4-mode-{n}.png').convert('RGBA');w,h=m.size;v=list(a.get_flattened_data());out=[]
 for y in range(h):
  for x in range(w):
   votes=Counter(p for yy in range(8) for p in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(votes,key=lambda p:(-votes[p],p)))
 samples+=w*h*64;check(n+' exact64-vote mode and source',out==list(m.get_flattened_data()) and sha(R/d['source'])==d['source_sha256'])
 # Replay all native outline/colour corrections recorded by registration.
 for x,y,old,new in d['cleanup']:
  assert out[y*w+x]==tuple(old);out[y*w+x]=tuple(new)
 check(n+' recorded cleanup replay',out==list(Image.open(R/f'r17-C4-clean-{n}.png').convert('RGBA').get_flattened_data()))
for v in 'abc':
 a=c.asset('storey-arrangement-'+v+'-c4-w2');b=Image.open(R/f'r17-C4-clean-critic2-floor-{v}.png').convert('RGBA')
 for y in (0,47):b.paste(c.asset('ground-shop-w2-c0').crop((0,y,96,y+1)),(0,y))
 check('floor '+v+' is registered drawing plus invariant courses',a.tobytes()==b.tobytes())
for side in ('left','right'):
 roof=c.asset('roof-receiver-'+side+'-c4-w2').copy();roof.alpha_composite(c.asset('roof-adapter-'+side+'-c4'),(48 if side=='left' else 0,96));assembled=Image.new('RGBA',(144,144))
 assembled.alpha_composite(roof,(0 if side=='left' else 48,0));assembled.alpha_composite(c.asset('roof-companion-'+side+'-c4-w1'),(96 if side=='left' else 0,0))
 expected=Image.open(R/f'r17-C4-clean-critic2-roof-{side}-b.png').convert('RGBA')
 check(side+' adapter reconstructs continuous ridge/course/eave pixels',assembled.tobytes()==expected.tobytes())
narrow=c.asset('north-shop-court-c4-w1');check('narrow court complete drawing with preserved roof contact',narrow.crop((0,0,48,48)).tobytes()==Image.open(R/'r17-C4-clean-critic2-narrow-b.png').convert('RGBA').tobytes() and narrow.crop((0,48,48,144)).tobytes()==c.asset('roof-ridge-c4-w1').tobytes())
new=c.asset('storey-sign-bay-shutter-right-c4-w2');old=c.asset('storey-sign-bay-right-w2')
check('sign mount unchanged and exposed window actually different',new.crop((32,0,96,48)).tobytes()==old.crop((32,0,96,48)).tobytes() and new.crop((0,4,32,44)).tobytes()!=old.crop((0,4,32,44)).tobytes())
l=c.c4_city_layout();audit=c.c4_instance_audit(l)
actual=sum(p['layer']=='storey' and p['file'].startswith('storey-sign-bay-') for b in l['lots'] for p in c.build_c(b['spec'])[1])
reported=sum(t['layer']=='storey' and t['file'].startswith('storey-sign-bay-') for t in audit['inventory'])
check('all14 sign-bay floors and exposed windows inventoried',actual==reported==len(audit['window_motifs'])==14,actual=actual,reported=reported,window_motifs=len(audit['window_motifs']))
check('final all-floor and exposed-window repetition',not audit['failures'],instances=audit['instances'],windows=audit['windows'])
bad=copy.deepcopy(l)
for b in bad['lots']:
 if b['id'] in ('C4-east-tailor','C4-east-scribe'):b['spec']['panels'][1:3]=['storey-sign-bay-right-w2']*2
failure=c.c4_instance_audit(bad)['failures']
check('old four sign bays rejected as floors AND visible windows',any(f['chain'][0]=='connected-frontage' for f in failure) and any(f['chain'][0]=='connected-window-bays' for f in failure))
proof=c.c4_proof_layouts()['five-staggered-lots'];check('all levels of five touching lots pass',not c.c4_instance_audit(proof)['failures'])
bad=copy.deepcopy(proof)
for j,b in enumerate(bad['lots']):b['spec']['panels']=c.c4_spec(2,b['spec']['floors'],j)['panels']
failure=c.c4_instance_audit(bad)['failures']
check('old staggered proof rejected for four recessed and six shuttered panels',all(any(f['count']==count and name in f['pieces'] and f['chain'][0]=='connected-frontage' for f in failure) for count,name in [(4,'storey-recessed-c4-w2'),(6,'storey-shuttered-c4-w2')]))
renamed=copy.deepcopy(l)
for j,b in enumerate(renamed['lots']):b['frontage_group']='not-trusted-'+str(j)
other=c.c4_instance_audit(renamed);check('geometric frontages independent of owner labels',audit['adjacency_edges']==other['adjacency_edges'] and audit['failures']==other['failures'] and audit['windows']==other['windows'])
signs=[]
for b in l['lots']:
 for p in b['spec'].get('overlays',[]):
  if p['file'].startswith('sign-'):
   signs.append(0<=p['x'] and p['x']+c.asset(p['file']).width<=b['spec']['width']*48 and p['y_offset']+c.asset(p['file']).height<=-48)
check('all mounted signs stay inside lots above doors',all(signs),count=len(signs))
mask=Image.new('L',tuple(l['size']))
for b in l['lots']+l['props']:
 if b.get('role') or b.get('file','').startswith('person'):continue
 a=c.build_c(b['spec'])[0] if 'spec' in b else c.r_prop_image(b);m=Image.new('L',mask.size);m.paste(a.getchannel('A'),(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,m)
yard=mask.crop((576,1152,624,1200));open_pixels=sum(v==0 for v in yard.get_flattened_data())
check('south yard exposes real ground behind front roof',open_pixels>=1400,uncovered_pixels=open_pixels,total=2304)
check('rear door and service mouth reach exposed yard',not mask.crop((576,1152,588,1184)).getbbox() and not mask.crop((528,1152,576,1200)).getbbox())
check('north court bounded and detached guild fence removed',all(any(p.get('id')==n for p in l['props']) for n in ('pottery-court-rail-1104','pottery-court-rail-1152','pottery-delivery-crate')) and not any(p.get('id')=='guild-rear-service-closure' for p in l['props']))
base=json.loads((R/'r17-C4-verification.json').read_text());check('full acceptance suite passes',base['failed']==0,passed_checks=base['passed'])
hist=Counter(b['spec']['floors'] for b in l['lots']);ancillary=sum(p['file'] in ('lean-to-c4','stable-range-c4','townhall-market-r') for p in l['props']);inclusive=hist.copy();inclusive[1]+=ancillary
report=dict(passed=sum(q['passed'] for q in checks),failed=sum(not q['passed'] for q in checks),mode_samples=samples,source_drawings=len(log['drawings']),exports=len(log['exports']),passing_pngs_preserved=len(passing),storeys=dict(hist),inclusive_storeys=dict(inclusive),all_instance_audit=dict(instances=audit['instances'],windows=audit['windows'],exposed_window_bays=len(audit['window_motifs']),failures=len(audit['failures'])),checks=checks)
(R/'r17-C4-critic2-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
for q in checks:
 if not q['passed']:print(json.dumps(q))
if report['failed']:raise SystemExit(1)
