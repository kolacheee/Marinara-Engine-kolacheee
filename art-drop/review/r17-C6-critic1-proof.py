"""Final-pixel visibility, preservation, joins and exact-size proofs for C6 repair."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
from collections import Counter
import importlib.util,hashlib,json,copy
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17'
sp=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
NN=Image.Resampling.NEAREST
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def changed(a,b):return sum(x!=y for x,y in zip(a.get_flattened_data(),b.get_flattened_data()))
def save(n,im,z=(1,4)):
    for scale in z:im.resize((im.width*scale,im.height*scale),NN).save(R/f'r17-C6-critic1-{n}-{scale}x.png')
def run():
    l=c.c6_city_layout();im,_,shadows=c.c6_render(l);checks=[]
    def check(n,v,detail=None):checks.append(dict(name=n,passed=bool(v),detail=detail))
    check('saved native equals fresh final render',im.tobytes()==Image.open(R/'r17-city-final.png').convert('RGBA').tobytes())
    check('fully opaque final with no yard holes',im.getchannel('A').getextrema()==(255,255))
    before=json.loads((R/'r17-C6-critic1-before-hashes.json').read_text());critic=json.loads((R/'critic-r17C6-1.json').read_text());protected=[];bad=[]
    allowed={n for n in critic['failed'] if (O/(n+'.png')).exists()}
    for name,h in before.items():
        p=Path(name)
        if p.parent.resolve()!=O.resolve() or p.suffix!='.png' or p.stem in allowed:continue
        protected.append(name)
        if sha(p)!=h:bad.append(name)
    check('all passing/pre-existing city PNGs unchanged',not bad,dict(count=len(protected),changed=bad))
    for n in allowed:check(n+' actually repaired',sha(O/(n+'.png'))!=before[str((O/(n+'.png')).relative_to(Path.cwd()))])
    vis=[]
    for b in l['lots']:
        if not b['spec'].get('overlays'):continue
        t=copy.deepcopy(l);target=next(q for q in t['lots'] if q['id']==b['id']);target['spec']['overlays']=[];without=c.c6_render(t)[0];count=changed(im,without)
        vis.append(dict(owner=b['id'],signs=[p['file'] for p in b['spec']['overlays']],visible_changed_pixels=count));check(b['id']+' trade visible in final',count>100,count)
    t=copy.deepcopy(l);t['props']=[p for p in t['props'] if p.get('id')!='forge-cue'];count=changed(im,c.c6_render(t)[0]);check('forge smoke visible in final pixels',count>20,count)
    check('only one inn unloading cart',len([p for p in l['props'] if p.get('owner')=='inn-court' and p['file'] in ('cart','cart-unload-c6')])==1)
    check('supported church porch at ground1056',any(p.get('id')=='church-east-door' and p['base']==1056 and p['file']=='church-porch-c6r1' for p in l['props']))
    check('no obsolete blue cap in gate assembly',next(p for p in l['props'] if p.get('id')=='gatehouse').get('assembly_cutouts')==[[24,208,120,248]])
    check('three distinct receiving surfaces',set(s['surface'] for s in shadows)=={'ground','roof','wall'})
    check('maximum structural shadow <=50percent',max(s['opacity'] for s in shadows)<=127)
    # Adjacent-wall shade cannot reset to a sunlit triangular notch every96px.
    ground=c.c6_ground(l);wallpoints=[(x,y) for x in (480,576,672) for y in range(242,255)]
    check('north curtain joins retain continuous shade',all(im.getpixel(q)!=ground.getpixel(q) for q in wallpoints))
    for name,box in {
        'wall-shadow-joins':(432,216,720,280),'northwest-closed-court':(144,288,480,744),
        'northeast-roof-contacts':(1344,288,1776,720),'scribe-and-yard':(1584,816,1824,1344),
        'forge-visible':(240,768,336,960),'church-supported-steps':(624,912,816,1056),
        'gate-supported-walk':(1152,1248,1392,1440),'south-L-stagger':(336,1008,720,1344)
    }.items():save(name,im.crop(box))
    old=Image.open(R/'r17-C6-critic1-before-r17-city-final.png').convert('RGBA')
    comparison=Image.new('RGBA',(3840,1480),(35,39,34,255));d=ImageDraw.Draw(comparison);d.text((12,10),'CRITIC1 INPUT / NATIVE1X',fill='white');d.text((1932,10),'CRITIC1 REPAIR / NATIVE1X',fill='white');comparison.alpha_composite(old,(0,32));comparison.alpha_composite(im,(1920,32));save('before-after',comparison,(1,))
    # The repaired opposite hand is exposed beside its actual approved cap,
    # not hidden underneath an opaque whole roof in a nominal seam test.
    for depth in (96,144):
        cap='roof-merchant-'+('d2' if depth==96 else 'c')+'-c6';suffix='-d2' if depth==96 else ''
        panel=c.repeat(c.asset('cobble-c3'),(192,depth+16));panel.alpha_composite(c.asset('abutment-a'+suffix+'-c6'),(0,8));panel.alpha_composite(c.asset(cap),(48,8));panel.alpha_composite(c.asset('abutment-b'+suffix+'-c6'),(144,8));save('unlike-abutment-'+str(depth),panel)
    hist=Counter(b['spec']['floors'] for b in l['lots']);allhist=hist.copy()
    for p in l['props']:
        if p['file'].startswith(('lean-to','stable-range','court-closure','market-hall')):allhist[2 if p['file'].startswith('court-closure') else 1]+=1
    check('one-storey ordinary buildings <=25percent',allhist[1]/sum(allhist.values())<=.25,dict(allhist))
    report=dict(checks=checks,passed=sum(q['passed'] for q in checks),failed=[q for q in checks if not q['passed']],sign_visibility=vis,storeys=dict(hist),storeys_including_ancillary=dict(allhist),one_storey_fraction=allhist[1]/sum(allhist.values()),scope='Final saved-art self-checks; not independent panel approval or runtime navigation.')
    (R/'r17-C6-critic1-final-proof.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
if __name__=='__main__':run()
