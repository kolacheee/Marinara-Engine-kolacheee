"""C7 saved-art review sheets. Annotations are review-only, never production art."""
from pathlib import Path
from collections import Counter, deque
import importlib.util, json, hashlib, html
from PIL import Image, ImageDraw, ImageChops

R=Path(__file__).resolve().parent; O=R.parent/'out/city17'; REF=R.parent/'reference/r17'
s=importlib.util.spec_from_file_location('city17',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
NN=Image.Resampling.NEAREST
catalog=[]
def read(p):return Image.open(p).convert('RGBA')
def asset(n):return read(O/(n+'.png'))
def save(name,a,scales=(1,4),kind='proof'):
    for scale in scales:
        fn=f'r17-C7-{name}-{scale}x.png'
        a.resize((a.width*scale,a.height*scale),NN).save(R/fn)
        catalog.append(dict(file=fn,kind=kind,size=[a.width*scale,a.height*scale],native=[a.width,a.height],scale=scale))
def ground(size):return c.repeat(asset('cobble-c3'),size)
def panel(items):
    h=max(a.height for _,a in items)+32;w=sum(a.width for _,a in items)+16*(len(items)+1)
    out=Image.new('RGBA',(w,h),(32,36,32,255));d=ImageDraw.Draw(out);x=16
    for title,a in items:
        d.text((x,4),title,fill='white');out.alpha_composite(a,(x,24));x+=a.width+16
    return out
def crop_scene(a,box):return a.crop(box)
def components(a):
    w,h=a.size;mask=bytearray(1 if x else 0 for x in a.getchannel('A').get_flattened_data());sizes=[]
    for i in range(w*h):
        if mask[i]!=1:continue
        mask[i]=0;todo=[i];n=0
        while todo:
            j=todo.pop();n+=1;y,x=divmod(j,w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    k=yy*w+xx
                    if mask[k]:mask[k]=0;todo.append(k)
        sizes.append(n)
    return sorted(sizes)

def run():
    layout=c.c7_city_layout();city,_,shadows=c.c7_render(layout)
    production=sorted(set(O.glob('*-c7.png'))|set(O.glob('*-c7r1.png')));metrics=[]
    bases=['square-paving-'+str(i)+'-c7' for i in range(4)]+['main-paving-c7','street-turn-c7']
    for p in production:
        a=read(p);v=list(a.get_flattened_data());alphas=sorted(set(q[3] for q in v))
        metrics.append(dict(file=p.name,size=list(a.size),colours=len(set(v)),alpha=alphas,hidden_rgb=sum(q[3]==0 and any(q[:3]) for q in v),components=components(a),sha256=hashlib.sha256(p.read_bytes()).hexdigest()))
        # Native assets are shown over the approved matching summer cobble.
        bg=ground(a.size);bg.alpha_composite(a);save('piece-'+p.stem,bg,kind='piece')
        seam=ground((a.width*2,a.height));seam.alpha_composite(a,(0,0));seam.alpha_composite(a,(a.width,0));save('self-seam-'+p.stem,seam,(1,3),'seam')
    for n in bases+['roof-fill-c7']:
        a=asset(n);repeat=c.repeat(a,(a.width*3,a.height*3));save('repeat-'+n,repeat,kind='literal 3x3 repeat')
    trades=ground((320,192));td=ImageDraw.Draw(trades)
    for i,n in enumerate(['baker','apothecary','tailor','scribe','inn','smith','cobbler','butcher']):
        x=i%4*80;y=i//4*96;trades.alpha_composite(asset('sign-'+n+'-c7'),(x,y+16));td.text((x,y),n,fill='white')
    save('trade-signs',trades,(1,4),'signs')
    walls=[asset('wall-'+str(i)+'-c7') for i in range(5)]
    pair=ground((192*5,144*5))
    for y,a in enumerate(walls):
        for x,b in enumerate(walls):pair.alpha_composite(a,(x*192,y*144));pair.alpha_composite(b,(x*192+96,y*144))
    save('wall-all-25-pairs',pair,(1,3),'seam')
    strip=ground((480,144))
    for i,a in enumerate(walls):strip.alpha_composite(a,(96*i,0))
    save('wall-five-module-strip',strip,(1,3,4),'seam')
    paved=Image.new('RGBA',(48*8,48*8))
    for y in range(8):
        for x in range(8):paved.paste(asset('square-paving-'+str((x+3*y)%4)+'-c7'),(48*x,48*y))
    save('paving-variant-field',paved,kind='seam')
    # Actual floor-driven assemblies at both unequal-height party contacts.
    stack_proofs=[]
    for hand in ['left','right']:
        proof=ground((288,432));items=[]
        for index,n in enumerate(([5,1] if hand=='left' else [1,5])):
            x=48+index*96;lot=dict(id='proof-'+str(index),block='proof',facing='S',variant=index,width=2,floors=n,roof='terracotta',cells=[[index*2,0],[index*2+1,0]],footprint=[x,336,96,48],bottom_left=[x,384])
            a,parts,rm,wm=c.c7_build_lot(lot);items.append(dict(base=384,z=0,x=x,y=384-a.height,a=a,meta=lot,parts=parts,roofmask=rm,wallmask=wm))
        c.c7_join_lots(items)
        for item in items:proof.alpha_composite(item['a'],(item['x'],item['y']))
        save('five-one-'+hand,proof,(1,3),'height join');stack_proofs.append((hand,proof))
    save('unequal-height-both-hands',panel(stack_proofs),(1,3),'height join')
    house=asset('corner-house-c7');ref=read(REF/'fantasy-house-2.png')
    save('house-vs-current',panel([('C7 native corner',house),('Different corner arrangement',asset('house-b-w2-c7r1')),('Current fantasy-house-2',ref)]),(1,4),'reference')
    # A real sixteen-by-twelve-cell ground plan, not arbitrary whole-block crops.
    test=ground((768,576));proof_blocks=[
        dict(id='L',rect=[48,240,288,240],roof='terracotta',floors=2,notches=[[5,0],[5,1]],court_cells=[[2,2]]),
        dict(id='T',rect=[384,240,336,144],roof='slate',floors=2,notches=[[0,0]]),
        dict(id='deadend',rect=[432,432,288,96],roof='brown',floors=1)]
    proof_lots=[];items=[]
    for b in proof_blocks:
        lots,cells,courts=c.c7_ring(b);proof_lots+=lots
        for q in lots:
            a,parts,rm,wm=c.c7_build_lot(q);x,base=q['bottom_left'];items.append(dict(base=base,z=0,x=x,y=base-a.height,a=a,meta=q,parts=parts,roofmask=rm,wallmask=wm))
        for wing in c.c7_rear_wings(b,lots):test.alpha_composite(wing['a'],(wing['x'],wing['y']))
    c.c7_join_lots(items)
    for i in sorted(items,key=lambda i:(i['base'],i['x'])):test.alpha_composite(i['a'],(i['x'],i['y']))
    save('acceptance-16x12',test,(1,3),'acceptance')
    (R/'r17-C7-acceptance-plan.json').write_text(json.dumps(dict(blocks=proof_blocks,lots=proof_lots),indent=2))
    square=city.crop((480,576,1536,1200));save('acceptance-square',square,(1,3),'acceptance')
    save('acceptance-vs-r15-today',panel([('C7 L/T/dead-end 16x12',test),('C7 civic square',square),('R15',read(R/'r15-city-mockup.png')),('Current town',read(REF/'current-town.png'))]),(1,3),'reference')
    save('city',city,(1,4),'city');save('city-greyscale',city.convert('L').convert('RGBA'),(1,),'city')
    for n in 'abc':save('concept-'+n,read(R/f'r17-concept-{n}.png'),(1,4),'concept')
    # Ownership and clearance overlays are annotations, never art exports.
    overlay=city.copy();d=ImageDraw.Draw(overlay,'RGBA')
    colours=[(230,120,70,85),(80,180,220,85),(180,200,75,85),(195,100,210,85)]
    for k,b in enumerate(layout['blocks']):
        x,y,w,h=b['rect'];d.rectangle((x,y,x+w-1,y+h-1),outline=(255,235,120,255),width=2);d.text((x+4,y+4),b['id'],fill='white')
        lots=[p for p in layout['lots'] if p['block']==b['id']]
        for j,lot in enumerate(lots):
            for xx,yy in lot['cells']+lot.get('rear_wing_cells',[]):
                q=(x+48*xx,y+48*yy,x+48*(xx+1)-1,y+48*(yy+1)-1);d.rectangle(q,fill=colours[j%4],outline=(255,255,255,90))
            ax,ay=lot['bottom_left'];d.text((ax+3,ay-14),lot['facing'],fill=(255,255,255,255))
    save('lot-ownership',overlay,(1,),'plan')
    clear=city.copy();d=ImageDraw.Draw(clear,'RGBA')
    for road in layout['roads']:
        x,y,w,h=road['rect'];d.rectangle((x,y,x+w-1,y+h-1),outline=(70,255,220,240),width=2);d.text((x+3,y+3),str(road['clear_width'])+'px',fill='white')
    for p in layout['props']:
        if 'footprint' in p:
            x,y,w,h=p['footprint'];d.rectangle((x,y,x+w-1,y+h-1),outline=(255,170,70,255),width=2)
    save('footprints-clearance',clear,(1,),'plan')
    # Actor feet and normal/reveal states. Same sprite, source and feet in
    # both frames; reveal masks only subtract owning foreground paint.
    cases=[('gate-portal',[1104,1350],(1008,1248,1248,1440),{'gate'},None),('gate-stair',[1196,1378],(1008,1248,1248,1440),{'gate'},'gate'),('market-entrance',[900,1164],(768,1008,1056,1248),{'market-hall'},None),('northwest-court',[348,492],(240,336,528,672),{q['id'] for q in layout['lots'] if q['block']=='northwest' and q['facing']=='S'},None),('church-porch',[766,1020],(576,864,864,1104),set(),None)]
    actor_records=[]
    for name,feet,box,reveal,owner in cases:
        actor=dict(feet=feet,file='guard-c7')
        if owner:actor['owner']=owner
        normal=c.c7_render(layout,actors=[actor])[0];revealed=c.c7_render(layout,reveal=reveal,actors=[actor])[0]
        a,b=normal.crop(box),revealed.crop(box);save('access-'+name,panel([('normal / feet '+str(feet),a),('only owning roof removed',b)]),(1,3),'access')
        actor_records.append(dict(case=name,feet=feet,box=list(box),reveal_owners=sorted(reveal),surface_owner=owner,different_pixels=sum(p!=q for p,q in zip(a.get_flattened_data(),b.get_flattened_data())),ordering='ground actor by actual feet; stair actor between owned tread and cheek layers',runtime_claim=False))
    # Machine checks intentionally separate from visual acceptance.
    checks=[]
    def check(n,ok,detail=None):checks.append(dict(name=n,passed=bool(ok),detail=detail))
    check('hard-alpha production',all(set(m['alpha'])<=set([0,255]) for m in metrics))
    check('zero RGB under transparent production',all(m['hidden_rgb']==0 for m in metrics))
    check('production no isolated 1px/2px alpha components',all(not any(n<=2 for n in m['components']) for m in metrics),[m['file'] for m in metrics if any(n<=2 for n in m['components'])])
    check('exact 2x final',read(R/'r17-city-final-2x.png').tobytes()==city.resize((3840,2880),NN).tobytes())
    donor=asset('ground-shop-w2-c0')
    for n in ['ground-corner-w3-c7','storey-corner-w3-c7']+[p.stem for p in O.glob('*-c7r1.png') if p.name.startswith(('ground-','storey-'))]:
        a=asset(n);check(n+' fixed 0/47 course',all(a.getpixel((x,y))==((43,40,29,255) if x in (0,a.width-1) else (98,66,38,255)) for y in [0,47] for x in range(a.width)))
    for i,a in enumerate(walls):
        for j,b in enumerate(walls):check(f'wall {i}>{j} common two columns',a.crop((94,0,96,144)).tobytes()==b.crop((0,0,2,144)).tobytes())
    for b in layout['blocks']:
        lots=[p for p in layout['lots'] if p['block']==b['id']];owned=[tuple(q) for p in lots for q in p['cells']+p.get('rear_wing_cells',[])];court=set(map(tuple,b['court_cells']));cells=set(map(tuple,b['cells']))
        changed=[dict(p,facing='E' if p['facing']!='E' else 'W',floors=1 if p['floors']!=1 else 3) for p in layout['lots']]
        check(b['id']+' facings and floors change actual paint',c.c7_assemble_block(b,layout['lots']).tobytes()!=c.c7_assemble_block(b,changed).tobytes())
        reserved=set(map(tuple,b.get('reserved_cells',[])))
        check(b['id']+' 1-2 cell lot footprints',all(max(x for x,y in p['cells'])-min(x for x,y in p['cells'])<2 and max(y for x,y in p['cells'])-min(y for x,y in p['cells'])<2 for p in lots))
        check(b['id']+' disjoint complete plan ownership',len(owned)==len(set(owned)) and set(owned)|court|reserved==cells and not set(owned)&court and not set(owned)&reserved)
        check(b['id']+' four outward lot directions',set(f for p in lots for f in p['street_faces'])==set('NSEW'))
        check(b['id']+' cell-aligned plan',all(v%48==0 for v in b['rect']) and all(all(v%48==0 for v in p['bottom_left']) for p in lots))
    towers=[p for p in layout['props'] if 'tower-' in p['id']]
    check('all interval towers in perimeter wall band',all(p['x'] in [0,1824] or p['base'] in [192,1440] for p in towers))
    check('southeast real48x96 plan setback',next(b for b in layout['blocks'] if b['id']=='southeast')['notches']==[[0,0],[0,1]])
    check('main route width 96',all(p['clear_width']==96 for p in layout['roads'] if p['kind']=='main'))
    overlaps=[]
    for r in layout['roads']:
        x,y,w,h=r['rect']
        for q in layout['lots']:
            a,b,v,t=q['footprint']
            through_arch=q.get('passage') and r['id']=='nw-court-passage'
            if min(x+w,a+v)>max(x,a) and min(y+h,b+t)>max(y,b) and not through_arch:overlaps.append([r['id'],q['id']])
    check('public routes clear of building footprints',not overlaps,overlaps)
    # Read the actual chosen layer recipes, not merely variant metadata.
    rows={}
    for q in layout['lots']:
        if q['facing'] in 'NS':rows.setdefault((q['block'],q['facing'],q['bottom_left'][1]),[]).append(q)
    repetitions=[]
    for key,qs in rows.items():
        recipes=[c.c7_build_lot(q)[1] for q in sorted(qs,key=lambda q:q['bottom_left'][0])]
        for kind in ['ground','storey','roof']:
            names=[next((p['file'] for p in recipe if p['kind']==kind),None) for recipe in recipes]
            for i in range(len(names)-4):
                counts=Counter(n for n in names[i:i+5] if n is not None)
                if counts and max(counts.values())>2:repetitions.append([key,kind,names[i:i+5]])
    check('actual frontage layers at most twice in five',not repetitions,repetitions)
    visible_signs=[]
    for q in layout['lots']:
        if not q.get('trade'):continue
        sign=asset('sign-'+q['trade']+'-c7');x,base=q['bottom_left'];crop=city.crop((x,base-96,x+sign.width,base-96+sign.height))
        painted=sum(p[3]>0 for p in sign.get_flattened_data())
        visible=sum(a==b and a[3]>0 for a,b in zip(sign.get_flattened_data(),crop.get_flattened_data()))
        visible_signs.append(dict(trade=q['trade'],painted_pixels=painted,visible_pixels=visible,fraction=visible/painted))
    check('normal city signs retain at least 98 percent of painted pixels',all(q['fraction']>=.98 for q in visible_signs),visible_signs)
    check('tailor scissors sign completely visible',next(q['fraction'] for q in visible_signs if q['trade']=='tailor')==1)
    check('shadow opacity at most 50%',all(p['opacity']<=127 for p in shadows))
    for entry in catalog:
        if entry['scale']>1:
            base=R/(entry['file'].rsplit('-',1)[0]+'-1x.png');native=read(base);scale=entry['scale'];equal=True
            with Image.open(R/entry['file']) as actual:
                for y in range(0,native.height,32):
                    bottom=min(y+32,native.height);expected=native.crop((0,y,native.width,bottom)).resize((native.width*scale,(bottom-y)*scale),NN)
                    if actual.crop((0,y*scale,actual.width,bottom*scale)).convert('RGBA').tobytes()!=expected.tobytes():equal=False;break
            native.close();check(entry['file']+' exact nearest-neighbour',equal)
    for n in bases+['roof-fill-c7']:
        a=asset(n);repeat=read(R/('r17-C7-repeat-'+n+'-1x.png'))
        check(n+' literal nine copies',all(repeat.crop((x*a.width,y*a.height,(x+1)*a.width,(y+1)*a.height)).tobytes()==a.tobytes() for x in range(3) for y in range(3)))
    baseline=json.loads((R/'r17-C7-critic2-baseline.json').read_text());changed=[];missing=[]
    for name,digest in baseline.items():
        p=R.parent.parent/name
        if not p.exists():missing.append(name)
        elif hashlib.sha256(p.read_bytes()).hexdigest()!=digest:changed.append(name)
    critic=json.loads((R/'critic-r17C7-2.json').read_text());allowed={'art-drop/out/city17/'+n+'.png' for n in critic['failed']}
    check('only failed existing production PNGs changed',set(changed)<=allowed and not missing,dict(changed=changed,unexpected=sorted(set(changed)-allowed),missing=missing))
    check('every failed production PNG replaced',all('art-drop/out/city17/'+n+'.png' in changed for n in critic['failed'] if (O/(n+'.png')).exists()))
    check('passing production files unchanged',all('art-drop/out/city17/'+n+'.png' not in changed for n,v in critic['files'].items() if v['status']=='pass'))
    check('all three shadow receiver surfaces present',all(any(p['surface']==v and p['mask_bounds'] for p in shadows) for v in ['ground','wall','roof']))
    check('all shadow receivers explicitly owned',all(p.get('owned_intersection') for p in shadows))
    for n in 'abc':
        a=read(R/f'r17-C7-critic2-source-concept-{n}-grid-composite.png');check('concept '+n+' genuinely reduced',a.width>1920 and a.height>1440)
    for d in [2,3]:check('roof depth '+str(d)+' painted terrace source and native tile-scale registration',(R/'r17-C7-critic2-source-terrace-b.png').exists() and asset(f'roof-a-w3-d{d}-c7').height==d*48)
    check('stalls and cross bottom-left48px anchors',all(p['x']%48==0 and p['base']%48==0 for p in layout['props'] if p['id'].startswith('stall-') or p['id']=='market-cross'))
    check('all trade signs occur once',len([q for q in layout['lots'] if q.get('trade')])==7)
    for seed in [1755,3051]:
        seq=c.c7_wall_sequence(19,seed);check('wall variation '+str(seed),len(set(tuple(seq[i:i+3]) for i in range(len(seq)-2)))==len(seq)-2 and all(max(Counter(seq[i:i+5]).values())<=2 for i in range(len(seq)-4)))
    report=dict(part='C7',production_count=len(metrics),sheets=len(catalog),checks=checks,production=metrics,access=actor_records,visual_acceptance='Saved-art self-review; no independent critic or runtime collision approval asserted.')
    (R/'r17-C7-QC.json').write_text(json.dumps(report,indent=2));(R/'r17-C7-sheets.json').write_text(json.dumps(catalog,indent=2))
    body=['<!doctype html><meta charset="utf-8"><title>Round 17 C7 review</title><style>body{background:#252a26;color:#eee;font:16px system-ui;margin:32px}a{color:#e9bf70}img{max-width:100%;image-rendering:pixelated}section{border-top:1px solid #777;padding:16px 0}summary{cursor:pointer}</style><h1>Round 17 — C7</h1><p>Native pixel sheets; 3×/4× exports use nearest-neighbour. Actor views are static art proofs.</p><p><a href="r17-city-final.png">Final city</a> · <a href="r17-city-final-vs-concept.png">Chosen concept comparison</a> · <a href="r17-C7-QC.json">Measurements</a> · <a href="r17-C7-FIXES-response.json">Cycle 7 response</a></p>']
    for kind in dict.fromkeys(a['kind'] for a in catalog):
        body.append('<section><h2>'+html.escape(kind)+'</h2>')
        for entry in [a for a in catalog if a['kind']==kind and a['scale']==1]:
            fn=entry['file'];base=fn[:-6];partners=[a for a in catalog if a['file'].startswith(base)];body.append('<details><summary>'+html.escape(fn)+' '+str(entry['native'])+'</summary><p>'+' · '.join('<a href="'+p['file']+'">'+str(p['scale'])+'×</a>' for p in partners)+'</p><img loading="lazy" src="'+fn+'"></details>')
        body.append('</section>')
    (R/'r17-C7-review.html').write_text('\n'.join(body))
    print(json.dumps(dict(production=len(metrics),sheets=len(catalog),checks=len(checks),failed=[p for p in checks if not p['passed']]),indent=2))

if __name__=='__main__':run()
