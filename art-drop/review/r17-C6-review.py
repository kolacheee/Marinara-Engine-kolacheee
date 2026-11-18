"""C6 saved-art proofs and measurable acceptance checks; no runtime claims."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
from collections import Counter,defaultdict,deque
import importlib.util,json,hashlib,copy,sys
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';A=R.parent
sp=importlib.util.spec_from_file_location('compose',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
NN=Image.Resampling.NEAREST;checks=[];proofs=[]
def check(name,ok,detail=None):checks.append(dict(name=name,pass_=bool(ok),detail=detail))
def save(name,a,scales=(1,3)):
    for z in scales:
        fn=f'r17-C6-{name}-{z}x.png';a.resize((a.width*z,a.height*z),NN).save(R/fn);proofs.append(fn)
def bg(size,tile='cobble-c3'):return c.repeat(c.asset(tile),size)
def contact_sheet(items,width=900):
    x=y=12;row=0;positions=[]
    for name,a in items:
        cell=max(a.width,180)
        if x+cell>width:x=12;y+=row+32;row=0
        positions.append((name,a,x,y));x+=cell+12;row=max(row,a.height)
    out=Image.new('RGBA',(width,y+row+36),(98,106,92,255));d=ImageDraw.Draw(out)
    for name,a,x,y in positions:d.text((x,y),name,fill='white');out.alpha_composite(a,(x,y+16))
    return out

def auxiliary():
    """Refresh the older inspection sheets from current native drawings."""
    spec=c.c5_spec(2,2,0);spec.update(c6=True,house_family='a',panels=['ground-house-a-c6r1','storey-house-a-c6r1'],roof_file='roof-house-a-c6r1',returns=[],close_roof=False)
    house=c.c6_build(spec)[0];ref=Image.open(A/'reference/r17/fantasy-house-2.png').convert('RGBA')
    save('house-pilot',contact_sheet([('TODAY / 1x',ref),('C6 complete house / 1x',house)],400),(1,4))
    names=['abutment-b-c6','abutment-b-d2-c6','receiving-wall-left-c6r1','receiving-wall-right-c6r1','yard-boundary-wood-c6r1','yard-boundary-wood-b-c6r2','gate-bearing-c6r2','gate-landing-c6','gate-stair-lower-c6r1','church-porch-c6r1','guildhall-c6r1']
    items=[(n,c.asset(n)) for n in names];save('native-inspect',contact_sheet(items),(3,));save('selected-detail',contact_sheet(items),(4,))
    im=Image.open(R/'r17-city-final.png').convert('RGBA')
    focus=[('grounded church steps',im.crop((624,912,816,1056))),('supported gate walk',im.crop((1176,1272,1368,1440))),('visible scribe',im.crop((1632,864,1776,1056))),('forge smoke',im.crop((240,768,336,960)))]
    save('focused-inspect',contact_sheet(focus),(4,))
    wall=bg((672,280));xx=0
    for n in ['wall-curtain-a-c6','wall-curtain-b-c6','wall-curtain-c-c6','wall-access-c5','wall-tower-a-c6','wall-tower-b-c6']:
        a=c.asset(n);wall.alpha_composite(a,(xx,264-a.height));xx+=a.width
    save('wall-registration-comparison',wall,(4,))

def digest(a):return hashlib.sha256(a.tobytes()+str(a.size).encode()).hexdigest()
def overlaps(a,b):return max(a[0],b[0])<min(a[0]+a[2],b[0]+b[2]) and max(a[1],b[1])<min(a[1]+a[3],b[1]+b[3])
def feet_rects(b):return b.get('ground_footprints',b.get('footprints',[b['footprint']] if b.get('footprint') else []))
def compare(name,a):
    refs=[('TODAY',Image.open(A/'reference/r17/current-town.png').convert('RGBA')),('ROUND15',Image.open(R/'r15-city-mockup.png').convert('RGBA')),('C6 '+name,a)]
    sheet=Image.new('RGBA',(sum(x.width for _,x in refs)+48,max(x.height for _,x in refs)+32),(35,39,34,255));d=ImageDraw.Draw(sheet);xx=12
    for title,x in refs:d.text((xx,4),title,fill='white');sheet.alpha_composite(x,(xx,24));xx+=x.width+12
    save(name+'-reference-comparison',sheet,(1,3))

def run():
    l=c.c6_city_layout();im,placements,shadows=c.c6_render(l)
    final=Image.open(R/'r17-city-final.png').convert('RGBA');check('fresh composition equals saved final',digest(im)==digest(final))
    check('exact nearest2x',Image.open(R/'r17-city-final-2x.png').tobytes()==im.resize((3840,2880),NN).tobytes())
    check('exact greyscale squint',Image.open(R/'r17-city-final-squint.png').tobytes()==im.convert('L').tobytes())
    manifest={};files=sorted(p for p in O.glob('*.png') if '-c6' in p.stem)
    pieces=[]
    for p in files:
        a=Image.open(p).convert('RGBA');v=list(a.get_flattened_data());n=p.stem
        check(n+' hard alpha',set(q[3] for q in v)<={0,255});check(n+' zero hidden RGB',not any(any(q[:3]) for q in v if not q[3]))
        manifest[n]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(q[:3] for q in v if q[3])),alpha=sorted(set(q[3] for q in v)))
        if n.startswith(('ground-','storey-','inn-','door-','passage-')) and a.height==48:
            donor=c.asset('ground-shop-w2-c0');check(n+' fixed courses',all(a.crop((0,y,a.width,y+1)).tobytes()==donor.crop((0,y,a.width,y+1)).tobytes() for y in (0,47)))
        mount=bg((a.width+16,a.height+16));mount.alpha_composite(a,(8,8));save('piece-'+n,mount,(1,4));pieces.append((n,mount))
        seam=bg((a.width*2,a.height*2));
        for x,y in ((0,0),(a.width,0),(0,a.height),(a.width,a.height)):seam.alpha_composite(a,(x,y))
        save('seam-'+n,seam,(1,3))
    for n in manifest:
        if n.endswith(('-slate','-brown')):
            check(n+' alpha matches terracotta',c.asset(n).getchannel('A').tobytes()==c.asset(n.rsplit('-',1)[0]).getchannel('A').tobytes())
    for family in ('roof-merchant-c-c6','roof-merchant-d2-c6','abutment-a-c6','abutment-b-c6','side-house-a-c6','side-house-west-c6'):
        a=c.asset(family);sheet=bg((a.width*3,a.height))
        for j,suffix in enumerate(('', '-slate','-brown')):sheet.alpha_composite(c.asset(family+suffix),(j*a.width,0))
        save('variants-'+family,sheet,(1,3))
    for i in range(0,len(pieces),12):save('all-pieces-'+str(i//12),contact_sheet(pieces[i:i+12]),(1,4))
    (R/'r17-C6-files.json').write_text(json.dumps(manifest,indent=2))
    grounds=['cobble-c3','main-paving-c4','street-main-c3','street-side-c3','lane-c3','workyard-c4','mud-edge','square-slabs-c5','ditch-c3','packed-yard-c6r1']
    for n in grounds:
        a=c.asset(n);rep=c.repeat(a,(a.width*3,a.height*3));save('repeat-'+n,rep,(1,4));check(n+' literal3x3',all(rep.crop((x*a.width,y*a.height,(x+1)*a.width,(y+1)*a.height)).tobytes()==a.tobytes() for y in range(3) for x in range(3)))
    # Actual city extracts are literal native scenes, with their complete civic
    # masses retained, rather than approximate thumbnails presented as1x.
    scenes={'L-T-dead-end':im.crop((96,240,864,816)),'square':im.crop((480,288,1392,1200)),'street':im.crop((96,240,720,816)),'gate':im.crop((1104,1008,1392,1440))}
    for name,a in scenes.items():
        save(name,a);save(name+'-squint',a.convert('L'),(1,))
        refs=[('TODAY',Image.open(A/'reference/r17/current-town.png').convert('RGBA')),('ROUND15',Image.open(A/'reference/r17/round15-street.png').convert('RGBA')) if (A/'reference/r17/round15-street.png').exists() else ('ROUND15',Image.open(R/'r15-city-mockup.png').convert('RGBA')),('C6 '+name,a)]
        sheet=Image.new('RGBA',(sum(x.width for _,x in refs)+48,max(x.height for _,x in refs)+32),(35,39,34,255));d=ImageDraw.Draw(sheet);xx=12
        for title,x in refs:d.text((xx,4),title,fill='white');sheet.alpha_composite(x,(xx,24));xx+=x.width+12
        save(name+'-comparison',sheet,(1,3))
    # House pilot with deep roof, real ground and continuous12px end return.
    spec=c.c5_spec(2,2,0);spec.update(c6=True,house_family='a',panels=['ground-house-a-c6r1','storey-house-a-c6r1'],roof_file='roof-house-a-c6r1',returns=[],close_roof=False)
    house=c.c6_build(spec)[0];ref=Image.open(A/'reference/r17/fantasy-house-2.png').convert('RGBA');panel=bg((house.width+ref.width+48,max(house.height,ref.height)+32));panel.alpha_composite(ref,(8,panel.height-ref.height-8));panel.alpha_composite(house,(ref.width+32,panel.height-house.height-8));save('house-reference',panel,(1,4))
    # Both hands of the five-/one-storey height transition use real base edges.
    for hand in ('left','right'):
        t=copy.deepcopy(l);t.update(size=[384,576],lots=[],props=[],plots=[],courts=[],roads=[],square=[0,0,384,576],square_notch=[0,0,0,0])
        for j,n in enumerate(([5,1] if hand=='left' else [1,5])):
            s=c.c5_spec(2,n,j+2);s.update(c6=True,house_family='abc'[j],panels=['ground-house-a-c6r1']+['storey-house-a-c6r1','storey-house-b-c6r1','storey-house-c-c6r1','storey-plaster-c6'][:n-1],roof_file='roof-house-'+'ab'[j]+'-c6r1',close_roof=False)
            t['lots'].append(dict(id='height-'+str(j),x=96+j*96,base=480,spec=s,footprint=[96+j*96,384,96,96]))
        c.c5_contacts(t);a=c.c6_render(t)[0];save('tall-low-'+hand,a);compare('tall-low-'+hand,a)
        check('height'+hand+' shared48/96px ground contact',bool(c.shared_ground_edges(*t['lots'])))
    # The standalone abutment sheet cannot approve a complete-house contact.
    # Replay critic3-proof.py before this review: it tests the rendered houses
    # against two backgrounds, including every isolated actual-city pair.
    contact_report=json.loads((R/'r17-C6-critic3-verification.json').read_text())
    check('assembled house contacts: 18 hand/material/family cases and all16 city pairs',not contact_report['failed'],dict(cases=contact_report['assembled_test_cases'],city_pairs=contact_report['isolated_city_contacts'],probe_pixels=contact_report['contact_probe_pixels'],failures=contact_report['failed']))
    # A/B/C, tower and stair contacts at exactly their native connection course.
    for depth in (96,144):
        for tone in ('','slate','brown'):
            joined,parts=c.c6_unlike_roofs(depth,tone);panel=bg((208,depth+16));panel.alpha_composite(joined,(8,8))
            save('unlike-abutment-'+str(depth)+'-'+(tone or 'terracotta'),panel,(1,3,4))
            check('unlike'+str(depth)+tone+' no exposed paving channels',all(joined.getpixel((x,y))[3]==255 for y in range(12,depth) for x in list(range(40,56))+list(range(136,152))))
    wall=bg((672,300));xx=0
    for n in ['wall-curtain-a-c6','wall-curtain-b-c6','wall-curtain-c-c6','wall-curtain-a-c6','wall-access-c5','wall-tower-b-c6']:
        a=c.asset(n);wall.alpha_composite(a,(xx,264-a.height));xx+=a.width
    save('curtain-stair-tower',wall,(1,3,4));compare('curtain-stair-tower',wall)
    for a,b in [('a','b'),('b','c'),('c','a')]:
        check('wall'+a+b+' compatible first/last2 columns',c.asset('wall-curtain-'+a+'-c6').crop((94,32,96,144)).tobytes()==c.asset('wall-curtain-'+b+'-c6').crop((0,32,2,144)).tobytes())
    for prefix in ('north-curtain-','south-curtain-'):
        row=sorted([p for p in l['props'] if p.get('id','').startswith(prefix)],key=lambda p:p['x'])
        failures=[]
        for i in range(len(row)-4):
            run=row[i:i+5];counts=Counter(digest(c.asset(p['file'])) for p in run)
            if max(counts.values())>2:failures.append([p['id'] for p in run])
        check(prefix+' at most two pixel-identical panels in five',not failures,failures)
    # Footprints, owned sprite overhangs and explicit clear streets are review
    # annotations only. None of these diagnostic shapes enter production art.
    overlay=im.copy();layer=Image.new('RGBA',im.size);d=ImageDraw.Draw(layer)
    for r in l['roads']:
        x,y,w,h=r['rect'];col=(75,185,225,80) if r['kind']=='main' else (90,215,145,65);d.rectangle((x,y,x+w-1,y+h-1),fill=col,outline=col[:3]+(220,))
    for b in l['lots']:
        for x,y,w,h in feet_rects(b):d.rectangle((x,y,x+w-1,y+h-1),outline=(240,160,65,255),width=2)
        if b.get('entrance'):x,y=b['entrance'];d.rectangle((x-3,y-3,x+3,y+3),fill=(255,245,190,255))
    overlay.alpha_composite(layer);save('footprints-clearance',overlay,(1,))
    lots=im.copy();d=ImageDraw.Draw(lots)
    for b in l['lots']:
        x,y,w,h=b['painted'];d.rectangle((x,y,x+w-1,y+h-1),outline=(221,170,93,255));d.text((x+2,b['base']-10),b['id'],fill=(255,255,220,255))
    save('lot-overhangs',lots,(1,))
    # Actor feet, overhead masks and actual reveal states, including the exact
    # requested gate positions. Actor canvas24x48 is native, never rescaled.
    actorproof=[]
    for name,feet,box in [('gate-under',[1248,1392],(1128,1224,1392,1440)),('gate-front',[1248,1440],(1128,1224,1392,1440)),('church-east',[720,1024],(624,912,864,1104)),('court-entry',[312,696],(240,432,432,744))]:
        t=copy.deepcopy(l)
        if name=='church-east':
            # The actor stands on the drawn raised stair receiver. Reveal
            # affects the porch canopy only; cathedral stone is never erased.
            p=next(p for p in t['props'] if p.get('id')=='church-east-door');p['foreground_mask']=[0,0,44,32]
        if name=='court-entry':
            b=next(b for b in t['lots'] if b['id']=='west-1');b['foreground_mask']=[60,0,84,c.c6_build(b['spec'])[0].height]
            t['props']=[p for p in t['props'] if p.get('id')!='life-2']
        variants=[]
        for reveal in (False,True):
            actor=dict(feet=feet,file='actor-proof-c6')
            if name=='church-east':actor.update(surface_sort=1058,standing_surface='supported church stair')
            a=c.c6_render(t,reveal=reveal,actors=[actor])[0];variants.append(a.crop(box));save(name+('-reveal' if reveal else '-normal'),a.crop(box),(1,3))
        panel=Image.new('RGBA',(variants[0].width*2,variants[0].height));panel.alpha_composite(variants[0]);panel.alpha_composite(variants[1],(variants[0].width,0));save(name+'-normal-reveal',panel,(1,3))
        actor=c.asset('actor-proof-c6');ax=feet[0]-12-box[0];ay=feet[1]-48-box[1]
        pixels=[(x,y,p) for y in range(48) for x in range(24) if (p:=actor.getpixel((x,y)))[3]]
        visible=sum(variants[1].getpixel((ax+x,ay+y))==p for x,y,p in pixels)/len(pixels)
        check(name+' actor visible in reveal',visible>=.9,visible)
        actorproof.append(dict(name=name,feet=feet,actor_canvas=[24,48],visible_fraction_after_reveal=visible,foreground_mask='separate authored reveal mask',sorting='feet, then foreground; no runtime collision claim'))
    (R/'r17-C6-actor-proofs.json').write_text(json.dumps(actorproof,indent=2))
    # Repeat audit hashes every resolved whole facade and roof. It crosses
    # floor levels, side-lane interruptions and palette/filename aliases.
    groups={
      'north-frontage':[b for b in l['lots'] if 624<=b['base']<=720],
      'gate-and-craft':[b for b in l['lots'] if 912<b['base']<=1056],
      'south-frontage':[b for b in l['lots'] if b['base']>=1248],
      'north-rear':[b for b in l['lots'] if b['base']<624],
    }
    for b in l['lots']:
        groups.setdefault('property-'+b.get('frontage_group','unassigned'),[]).append(b)
        groups.setdefault('side-facing-column-'+str(b['x']),[]).append(b)
    failures=[];windows=0;tokens=[]
    for key,row in groups.items():
        row.sort(key=lambda b:(b['x'],b['base']))
        for i in range(max(0,len(row)-4)):
            run=row[i:i+5];alltokens=[];windows+=1
            for b in run:
                s=b['spec'];names=[s['complete_file']] if s.get('complete_file') else s['panels']+[s['roof_file']]
                alltokens += [(digest(c.asset(n)),n,b['id']) for n in names]
            cnt=Counter(t[0] for t in alltokens)
            for h,num in cnt.items():
                if num>2:failures.append(dict(group=key,houses=[b['id'] for b in run],count=num,instances=[t[1:] for t in alltokens if t[0]==h]))
            tokens.append(dict(group=key,houses=[b['id'] for b in run],pieces=[t[1:] for t in alltokens]))
    repeat_audit=dict(windows=windows,failures=failures,resolved_windows=tokens)
    (R/'r17-C6-repeat-audit.json').write_text(json.dumps(repeat_audit,indent=2));check('two identical resolved pieces in every five frontage houses',not failures,failures)
    comprehensive=c.r_repeat_audit(l);(R/'r17-C6-critic1-comprehensive-repeat.json').write_text(json.dumps(comprehensive,indent=2));check('comprehensive architectural chains and exposed crops',not comprehensive['failures'],comprehensive['failures'])
    # E's original defects remain repaired in actual legacy layouts.
    legacy={name:c.r_legacy_repeat_audit(layout) for name,layout in c.e_layouts().items()}
    for name,audit in legacy.items():check('PartE '+name+' resolved repetition',not audit['failures'],audit)
    (R/'r17-C6-legacy-repetition.json').write_text(json.dumps(legacy,indent=2))
    # Clearance uses support footprints, excluding explicitly overhead spans.
    collisions=[]
    blockers=[b for b in l['lots']]+[p for p in l['props'] if p.get('footprint') and not p.get('overhead') and p.get('id') not in ('cathedral','church-east-door','guildhall-public-entry')]
    for r in l['roads']:
        if not r.get('clear'):continue
        for b in blockers:
            for foot in feet_rects(b):
                if overlaps(r['rect'],foot):collisions.append(dict(route=r['id'],rect=r['rect'],object=b.get('id',b.get('file')),footprint=foot))
    check('all clear route rectangles avoid solid support footprints',not collisions,collisions)
    check('principal widths/depths48or96',all(b['footprint'][2] in (48,96) and b['footprint'][3] in (48,96) for b in l['lots']))
    check('guildhall192frontage at720',any(p.get('id')=='guildhall' and p['base']==720 and p['footprint'][2]==192 for p in l['props']))
    check('six stalls two rows',Counter(p['base'] for p in l['props'] if p.get('id','').startswith('stall-'))=={816:3,912:3})
    check('96px turning pocket',any(r['id']=='inn-turning-pocket' and r['rect']==[1200,1056,96,96] for r in l['roads']))
    check('all ground shadows under50percent',all(s['opacity']<=127 for s in shadows))
    check('shadow receiving strips remain in owned frontage',all(s['receiver']==s['owned_ground_apron'] for s in shadows))
    hist=Counter(b['spec']['floors'] for b in l['lots']);anc=[p for p in l['props'] if p['file'].startswith(('lean-to','stable-range','court-closure','market-hall'))]
    total=hist.copy()
    for p in anc:total[2 if p['file'].startswith('court-closure') else 1]+=1
    check('one-storey share including ancillaries <=25%',total[1]/sum(total.values())<=.25,dict(total))
    roof=Counter(b['spec'].get('tone','') or 'terracotta' for b in l['lots']);check('mixed roof colours about half terracotta',.4<=roof['terracotta']/len(l['lots'])<=.6,dict(roof))
    metrics=dict(modular_buildings=len(l['lots']),modular_storeys=dict(hist),all_ordinary_buildings=sum(total.values()),storeys_including_ancillary=dict(total),single_storey_fraction=total[1]/sum(total.values()),roof_colours=dict(roof),native_size=list(im.size),grid=48,cells=[40,30],square=l['square'],square_notch=l['square_notch'],repeat_windows=windows,route_collisions=collisions)
    # Replay all registered64-sample RGBA modes and source hashes.
    sample_count=0
    for rec in json.loads((R/'r17-C6-processing.json').read_text()):
        ident=rec['id'];reg=Image.open(R/f'r17-C6-registered-{ident}.png').convert('RGBA');mode=Image.open(R/f'r17-C6-mode-{ident}.png').convert('RGBA');w,h=mode.size;vals=list(reg.get_flattened_data());raw=[];sw=w*8
        for yy in range(h):
            for xx in range(w):
                votes=Counter(p for y in range(8) for p in vals[(yy*8+y)*sw+xx*8:(yy*8+y)*sw+xx*8+8]);raw.append(min(votes,key=lambda p:(-votes[p],p)))
        check(ident+' exact64sample mode',raw==list(mode.get_flattened_data()));check(ident+' source hash',hashlib.sha256((R/rec['source']).read_bytes()).hexdigest()==rec['source_sha256']);sample_count+=w*h*64
    metrics['replayed_mode_samples']=sample_count
    for rec in json.loads((R/'r17-C6-critic2-processing.json').read_text()):
        ident=rec['id'];reg=Image.open(R/f'r17-C6-critic2-registered-{ident}.png').convert('RGBA');mode=Image.open(R/f'r17-C6-critic2-mode-{ident}.png').convert('RGBA');w,h=mode.size;vals=list(reg.get_flattened_data());raw=[];sw=w*8
        for yy in range(h):
            for xx in range(w):
                votes=Counter(p for y in range(8) for p in vals[(yy*8+y)*sw+xx*8:(yy*8+y)*sw+xx*8+8]);raw.append(min(votes,key=lambda p:(-votes[p],p)))
        check('critic2 '+ident+' exact64sample mode',raw==list(mode.get_flattened_data()));check('critic2 '+ident+' source hash',hashlib.sha256((R/rec['source']).read_bytes()).hexdigest()==rec['source_sha256']);sample_count+=w*h*64
    metrics['replayed_mode_samples']=sample_count
    # New registrations are replayed independently of the retained prior pass.
    for rec in json.loads((R/'r17-C6-critic1-processing.json').read_text()):
        ident=rec['id'];reg=Image.open(R/f'r17-C6-critic1-registered-{ident}.png').convert('RGBA');mode=Image.open(R/f'r17-C6-critic1-mode-{ident}.png').convert('RGBA');w,h=mode.size;vals=list(reg.get_flattened_data());raw=[];sw=w*8
        for yy in range(h):
            for xx in range(w):
                votes=Counter(p for y in range(8) for p in vals[(yy*8+y)*sw+xx*8:(yy*8+y)*sw+xx*8+8]);raw.append(min(votes,key=lambda p:(-votes[p],p)))
        check('critic1 '+ident+' exact64sample mode',raw==list(mode.get_flattened_data()));check('critic1 '+ident+' source hash',hashlib.sha256((R/rec['source']).read_bytes()).hexdigest()==rec['source_sha256']);sample_count+=w*h*64
    metrics['replayed_mode_samples']=sample_count
    check('final ground fully opaque',im.getchannel('A').getextrema()==(255,255))
    # Verify all pre-existing files outside the authorized mutable targets.
    before=json.loads((R/'r17-C6-before-hashes.json').read_text());changed=[];protected=0
    allowed={str(O/'compose.py'),str(A/'NOTES.md')}|{str(R/n) for n in ['r17-city-final.png','r17-city-final-2x.png','r17-city-final-squint.png','r17-city-final-vs-r15-vs-today.png','r17-city-final-crop-square-3x.png','r17-city-final-crop-street-3x.png','r17-city-final-crop-gate-3x.png']}
    # Baseline keys are checkout-relative; this script paths are absolute.
    for name,h in before.items():
        p=Path(name)
        if str(p.resolve()) in allowed:continue
        protected+=1
        if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=h:changed.append(name)
    check('pre-existing protected files byte-identical',not changed,changed);metrics['protected_files']=protected
    (R/'r17-C6-metrics.json').write_text(json.dumps(metrics,indent=2))
    report=dict(checks=len(checks),passed=sum(x['pass_'] for x in checks),failed=[x for x in checks if not x['pass_']],measurements=metrics,items=checks,scope='Saved-art self-checks; no independent panel or runtime claims')
    (R/'r17-C6-verification.json').write_text(json.dumps(report,indent=2))
    auxiliary()
    extras=['r17-C6-critic3-response.json','r17-C6-critic3-verification.json','r17-C6-verification.json','r17-C6-critic2-response.json','r17-C6-critic2-final-proof.json','r17-C6-critic2-generation.json','r17-C6-critic2-before-after-1x.png']
    extras += [p.name for p in sorted(R.glob('r17-C6-critic3-*-1x.png')) if '-before-r17-' not in p.name]
    extras += [p.name for p in sorted(R.glob('r17-C6-critic2-proof-*.png'))]
    links=['r17-city-final.png','r17-city-final-2x.png','r17-city-final-squint.png','r17-city-final-vs-r15-vs-today.png']+extras+proofs
    html='<!doctype html><meta charset="utf-8"><title>Round 17 C6 review</title><style>body{background:#232720;color:#eee;font:16px sans-serif}a{color:#dfba7a}img{image-rendering:pixelated;max-width:none}li{margin:8px}</style><h1>Round 17 C6 review</h1><p>Native 48px grid. Saved-art proofs and measurements.</p><ul>'+''.join('<li><a href="'+n+'">'+n+'</a></li>' for n in links)+'</ul>'
    (R/'r17-C6-review.html').write_text(html)
    print(json.dumps(dict(checks=len(checks),passed=report['passed'],failed=report['failed'],metrics=metrics),indent=2))
    return report
if __name__=='__main__':run()
