"""Assembled C6 contact regression checks; saved art, not runtime validation."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
from collections import Counter
import copy, hashlib, importlib.util, json

R=Path(__file__).resolve().parent
O=R.parent/'out/city17'
NN=Image.Resampling.NEAREST
checks=[]
def load(path,name):
    spec=importlib.util.spec_from_file_location(name,path)
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    mod.ASSETS=O;mod.ART=R.parent;mod.REVIEW=R
    return mod
c=load(O/'compose.py','current')
old=load(R/'r17-C6-critic3-before-compose.py','before')
def check(name,passed,detail=None):checks.append(dict(name=name,passed=bool(passed),detail=detail))
def save(name,a,scales=(1,3)):
    for z in scales:a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C6-critic3-{name}-{z}x.png')
def blank(l,size=(384,576)):
    t=copy.deepcopy(l)
    t.update(size=list(size),lots=[],props=[],plots=[],courts=[],roads=[],square=[0,0,*size],square_notch=[0,0,0,0])
    return t

def height_pair(l,hand,tone='',families='ab'):
    t=blank(l)
    for j,n in enumerate(([5,1] if hand=='left' else [1,5])):
        s=c.c5_spec(2,n,j+2,tone)
        s.update(c6=True,house_family=families[j],panels=['ground-house-a-c6r1']+['storey-house-a-c6r1','storey-house-b-c6r1','storey-house-c-c6r1','storey-plaster-c6'][:n-1],roof_file='roof-house-'+families[j]+'-c6r1'+('-'+tone if tone else ''),close_roof=False)
        t['lots'].append(dict(id='height-'+str(j),x=96+j*96,base=480,spec=s,footprint=[96+j*96,384,96,96]))
    c.c5_contacts(t)
    return t

def probes(l):
    """Independent test regions: every exterior low-house margin up to a
    painted adjacent tall face. Does not use the new compositor's join records.
    """
    needed=[];byid={b['id']:b for b in l['lots']}
    for b in l['lots']:
        a=c.c6_build(b['spec'])[0];ay=b['base']-a.height
        for q in b['spec'].get('roof_contacts',[]):
            low=byid[q['neighbour']];p=c.c6_build(low['spec'])[0];py=low['base']-p.height
            side=q['side'];points=[]
            for gy in range(max(ay,py),min(b['base'],low['base'])):
                wallx=a.width-1 if side=='right' else 0
                if a.getpixel((wallx,gy-ay))[3]!=255:continue
                span=p.getchannel('A').crop((0,gy-py,p.width,gy-py+1)).getbbox()
                if not span:continue
                cols=range(0,span[0]) if side=='right' else range(span[2],p.width)
                points.extend((low['x']+x,gy) for x in cols)
            needed.append((b['id'],low['id'],points))
    return needed

def exposed(mod,l,regions):
    """A fully opaque assembly is independent of two diagnostic backgrounds.
    This detects holes even where stone coincidentally matches the ground RGB.
    Diagnostics never enter the exported artwork.
    """
    draw_ground=mod.c6_ground;variants=[]
    try:
        for colour in ((255,0,255,255),(0,255,255,255)):
            mod.c6_ground=lambda layout:Image.new('RGBA',tuple(layout['size']),colour)
            variants.append(mod.c6_render(l)[0])
    finally:mod.c6_ground=draw_ground
    return [dict(tall=a,lower=b,pixels=len(points),exposed=[list(p) for p in points if variants[0].getpixel(p)!=variants[1].getpixel(p)]) for a,b,points in regions]

def run():
    l=c.c6_city_layout();im,records,_=c.c6_render(l)
    before=Image.open(R/'r17-C6-critic3-before-r17-city-final.png').convert('RGBA')
    check('fresh render equals final',im.tobytes()==Image.open(R/'r17-city-final.png').convert('RGBA').tobytes())
    # The exact rejected 19/15/4/4px wedges must all disappear in the ordinary
    # complete-house render, with no saved-sheet-specific replacement.
    t=height_pair(l,'right');repaired=c.c6_render(t)[0];prior=old.c6_render(t)[0]
    empty=copy.deepcopy(t);empty['lots']=[];ground=c.c6_render(empty)[0]
    for y,start in ((361,173),(370,177),(414,188),(430,188)):
        pts=[(x,y) for x in range(start,192)]
        check(f'critic row{y} reproduces prior paving gap',all(prior.getpixel(p)==ground.getpixel(p) for p in pts))
        check(f'critic row{y} closed with drawn paint',all(repaired.getpixel(p)!=ground.getpixel(p) for p in pts))
    coverage=[]
    for hand in ('left','right'):
        for tone in ('','slate','brown'):
            for families in ('ab','bc','ca'):
                t=height_pair(l,hand,tone,families);regions=probes(t)
                now=exposed(c,t,regions);previous=exposed(old,t,regions)
                tag=hand+'-'+(tone or 'terracotta')+'-'+families
                check(tag+' assembled contour has zero exposed-background pixels',all(not x['exposed'] for x in now),now)
                check(tag+' regression catches original compositor',any(x['exposed'] for x in previous),sum(len(x['exposed']) for x in previous))
                coverage.extend(now)
                if families=='ab':
                    a=c.c6_render(t)[0];b=old.c6_render(t)[0]
                    save('height-'+tag,a,(1,3,4))
                    pair=Image.new('RGBA',(768,600),(35,39,34,255));d=ImageDraw.Draw(pair)
                    d.text((12,4),'BEFORE / 1x',fill='white');d.text((396,4),'REPAIRED / 1x',fill='white')
                    pair.alpha_composite(b,(0,24));pair.alpha_composite(a,(384,24));save('height-'+tag+'-before-after',pair,(1,))
    # Isolate every real city pair so a third roof, actor, fence or prop cannot
    # conceal a remaining contact hole from the acceptance check.
    city_coverage=[]
    for b in l['lots']:
        for contact in b['spec'].get('roof_contacts',[]):
            q=next(q for q in l['lots'] if q['id']==contact['neighbour'])
            t=blank(l,tuple(l['size']));t['lots']=copy.deepcopy([b,q])
            for v in t['lots']:v['spec']['roof_contacts']=[r for r in v['spec'].get('roof_contacts',[]) if r['neighbour'] in (b['id'],q['id'])]
            result=exposed(c,t,probes(t));city_coverage.extend(result)
            check(b['id']+' / '+q['id']+' isolated actual-city contact opaque',all(not x['exposed'] for x in result),result)
    full=exposed(c,l,probes(l))
    check('all complete-city contact margins opaque',all(not x['exposed'] for x in full),full)
    # Actual contour flashing is neutral, uses the lower roof's colour partner,
    # and is confined to the lower property and roof/eave rows.
    joins=[j for r in records for j in r['assembled_contacts']]
    for j in joins:
        low=next(b for b in l['lots'] if b['id']==j['lower']);tone=low['spec'].get('tone','')
        check(j['tall']+' / '+j['lower']+' correct material partner',j['flashing'].endswith('-'+tone) if tone else not j['flashing'].endswith(('-slate','-brown')))
        donor=c.asset(j['flashing']);x0,x1=j['flashing_columns'];cols=set(donor.crop((x0,16,x1,128)).get_flattened_data())
        check(j['tall']+' / '+j['lower']+' flashing has no terracotta tile paint',all(p[0]-p[1]<30 and p[0]-p[2]<40 for p in cols if p[3]),sorted(cols))
        check(j['lower']+' repair contained in owning lot',all(0<=y<c.c6_build(low['spec'])[0].height and 0<=x0<x1<=48*low['spec']['width'] for y,x0,x1 in j['owned_rows']))
    check('northwest deliberate court pixel-identical',im.crop((240,432,336,480)).tobytes()==before.crop((240,432,336,480)).tobytes())
    oldlayout=old.c6_city_layout()
    for key in ('roads','plots','courts','props','square','square_notch'):
        check('accepted '+key+' unchanged',l[key]==oldlayout[key])
    check('accepted house plans and heights unchanged',[(b['id'],b['x'],b['base'],b['footprint'],b['spec']['floors'],b['spec'].get('tone','')) for b in l['lots']]==[(b['id'],b['x'],b['base'],b['footprint'],b['spec']['floors'],b['spec'].get('tone','')) for b in oldlayout['lots']])
    check('exact2x export',Image.open(R/'r17-city-final-2x.png').tobytes()==im.resize((3840,2880),NN).tobytes())
    check('exact greyscale',Image.open(R/'r17-city-final-squint.png').tobytes()==im.convert('L').tobytes())
    for n,box in {'square':(480,336,1200,1200),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
        a=im.crop(box);check(n+' exact3x crop',a.resize((a.width*3,a.height*3),NN).tobytes()==Image.open(R/f'r17-city-final-crop-{n}-3x.png').tobytes())
    sheet=Image.open(R/'r17-city-final-vs-r15-vs-today.png').convert('RGBA');x=16
    for n,a in [('today',Image.open(R.parent/'reference/r17/current-town.png').convert('RGBA')),('r15',Image.open(R/'r15-city-mockup.png').convert('RGBA')),('C6',im)]:
        check(n+' native comparison panel',sheet.crop((x,32,x+a.width,32+a.height)).tobytes()==a.tobytes());x+=a.width+16
    hashes=json.loads((R/'r17-C6-critic3-before-hashes.json').read_text());changed=[];protected=[]
    for path,h in hashes.items():
        p=Path(path)
        if p.suffix=='.png' and '/out/' in path:
            protected.append(path)
            if hashlib.sha256(p.read_bytes()).hexdigest()!=h:changed.append(path)
    check('all passing production PNGs byte-identical',not changed,dict(count=len(protected),changed=changed))
    # Keep a focused visual record of every site named by the critic.
    boxes={'north':(560,480,672,672),'slate':(1200,456,1344,672),'side':(1392,480,1584,672),'south':(1392,1176,1536,1296),'court':(240,432,336,480)}
    for n,box in boxes.items():
        a=im.crop(box);b=before.crop(box);save(n,a,(1,4))
        pair=Image.new('RGBA',(a.width*2,a.height+16),(35,39,34,255));d=ImageDraw.Draw(pair)
        d.text((0,0),'BEFORE',fill='white');d.text((a.width,0),'REPAIRED',fill='white');pair.alpha_composite(b,(0,16));pair.alpha_composite(a,(a.width,16));save(n+'-comparison',pair,(1,3))
    hist=Counter(b['spec']['floors'] for b in l['lots']);allhist=hist.copy()
    for p in l['props']:
        if p['file'].startswith(('lean-to','stable-range','court-closure','market-hall')):allhist[2 if p['file'].startswith('court-closure') else 1]+=1
    report=dict(passed=sum(x['passed'] for x in checks),checks=len(checks),failed=[x for x in checks if not x['passed']],items=checks,assembled_test_cases=len(coverage),isolated_city_contacts=len(city_coverage),contact_probe_pixels=sum(x['pixels'] for x in coverage+city_coverage),protected_production_pngs=len(protected),storeys=dict(hist),storeys_including_ancillary=dict(allhist),scope='Saved-art self-checks; no independent panel or runtime approval')
    (R/'r17-C6-critic3-verification.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k!='items'},indent=2))
    return report
if __name__=='__main__':run()
