"""C5 native art sheets; drawing primitives are annotations only."""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json,copy,itertools
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
sp=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
NN=Image.Resampling.NEAREST;BG=(44,47,40,255)
def save(a,n,factors=(1,4)):
    for z in factors:a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C5-{n}-{z}x.png')
def pair(items,n,factors=(1,4)):
    a=Image.new('RGBA',(sum(b.width+24 for _,b in items),max(b.height for _,b in items)+40),BG);d=ImageDraw.Draw(a);x=12
    for title,b in items:d.text((x,5),title,fill='white');a.alpha_composite(b,(x,a.height-8-b.height));x+=b.width+24
    save(a,n,factors)
def compare(a,n):
    refs=[('TODAY /1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('R15 /1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA'))]
    b=Image.new('RGBA',(a.width+max(q.width for _,q in refs)+32,max(a.height+32,sum(q.height+32 for _,q in refs))),BG);d=ImageDraw.Draw(b);b.alpha_composite(a,(0,24));d.text((5,5),'C5 '+n,fill='white');y=0
    for name,q in refs:d.text((a.width+16,y+4),name,fill='white');b.alpha_composite(q,(a.width+16,y+24));y+=q.height+32
    save(b,n+'-comparison',(1,3))
def pieces():
    files=json.loads((R/'r17-C5-files.json').read_text());names=list(files)
    for n in names:
        a=c.asset(n);ground='workyard-c4' if n.startswith(('vendor','forge','gate','church')) else 'cobble-c3'
        b=c.repeat(c.asset(ground),(max(224,a.width+32),a.height+48));ImageDraw.Draw(b).text((8,6),n,fill='black');b.alpha_composite(a,(16,32));save(b,'piece-'+n)
        # Explicit compatible families; absent a registered adapter show self
        # repetition honestly, never an arbitrary same-size filename.
        pairs={'wall-curtain-c5':'wall-curtain-b-c5','wall-curtain-c-c5':'wall-curtain-c5','floor-b-left-c5-w1':'floor-c-left-c5-w1','floor-c-left-c5-w1':'floor-a-left-c5-w1','roof-gable-d2-c5-w2':'roof-hip-d2-c5-w2','roof-hip-d2-c5-w2':'roof-gable-d2-c5-w2'}
        other=c.asset(pairs.get(n,n))
        b=c.repeat(c.asset(ground),(a.width*3,a.height+24));ImageDraw.Draw(b).text((2,4),'self / self / variant: '+n,fill='black')
        for j,q in enumerate([a,a,other]):b.alpha_composite(q,(j*a.width,24))
        save(b,'seam-'+n)
    for n in ['roof-fill-left-c5','roof-fill-right-c5','square-slabs-c5','main-paving-c4','workyard-c4','cobble-c3','street-main-c3','street-side-c3','lane-c3','ditch-c3']:
        a=c.asset(n);b=c.repeat(c.asset_path_grass() if n=='ditch-c3' else c.asset('cobble-c3'),(a.width*3,a.height*3))
        for y in range(3):
            for x in range(3):b.alpha_composite(a,(x*a.width,y*a.height))
        save(b,'repeat-'+n)
    # Retained tree, props and people are shown over their summer/yard receivers.
    for n in ['planter-tree-c3','cat','cart','crate','barrel','bench-pocket','washing-line']:
        a=c.asset(n);b=c.repeat(c.asset('workyard-c4'),(a.width+32,a.height+32));b.alpha_composite(a,(16,16));save(b,'retained-'+n)
    for ids,n in [(['roof-gable-a','roof-gable-b'],'long-roof-selection'),(['roof-cross-a','roof-cross-b'],'transverse-roof-forms'),(['inn-a','inn-b'],'inn-selection'),(['roof-valley-a','roof-valley-b'],'valley-selection'),(['court-closure-a','court-closure-b'],'court-selection')]:
        pair([(i,Image.open(R/f'r17-C5-clean-c5-{i}.png').convert('RGBA')) for i in ids],n)
    ref=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for i in range(3):
        s=c.c5_spec(2,2,i)
        if i==0:s['roof_file']='roof-gable-d2-c5-w2'
        pair([('C5 two-storey / '+str(c.asset(s['roof_file']).height)+'px roof',c.c5_build(s)[0]),('reference house 2',ref)],'house-reference-'+str(i))
    pair([(label,c.asset(n)) for label,n in [('complete drawing','roof-filled-gable-c5r1-w2'),('complete slate drawing','roof-filled-gable-c5r1-w2-slate')]],'complete-cap-comparison')
    roof_contacts()
    pair([(trade,c.asset('sign-'+trade+'-c4')) for trade in ['smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher']],'eight-signs')
    pair([(n,c.asset(n)) for n in ['shop-apothecary-c5-w1','shop-cobbler-c5-w1','shop-tailor-c5-w1','inn-front-c5-w2']],'goods-and-access')

def roof_contacts():
    roofs=[];maps=[];logs=[]
    colours={0:BG,1:(238,170,82,255),2:(124,185,223,255),3:(196,122,114,255),4:(153,187,121,255)}
    for depth in (3,4,5):
        a,owner,record=c.c5_modular_roof(depth);roofs.append((str(depth)+' cells / assembled',a));logs.append(record)
        mark=a.copy();d=ImageDraw.Draw(mark)
        # Guide lines are on a separate proof only, not the art assembly.
        for y in (48,a.height-48):d.line((0,y,143,y),fill='#ffe533')
        for x in (48,96):d.line((x,48,x,a.height-48),fill='#74e8ed')
        maps.append((str(depth)+' cells / contact guides',mark))
        owner.save(R/f'r17-C5-roof-ownership-{depth}.png')
        tinted=Image.new('RGBA',a.size);tinted.putdata([colours[v] if alpha else BG for v,alpha in zip(owner.get_flattened_data(),a.getchannel('A').get_flattened_data())])
        save(tinted,'roof-source-areas-'+str(depth),(1,4))
        if depth==4:
            for n,box in {'cap-to-fill':(0,32,144,80),'fill-to-ridge':(32,64,112,128),'fill-to-end':(0,112,144,176),'fill-repeat':(0,80,144,112)}.items():
                save(a.crop(box),'roof-contact-'+n,(1,4,8))
            # The same actual assembled roof on an existing three-cell facade.
            house=Image.new('RGBA',(144,a.height+96));house.alpha_composite(c.asset('ground-work-w3-c0'),(0,a.height+48));house.alpha_composite(c.asset('storey-timber-w3-c0'),(0,a.height));house.alpha_composite(a)
            pair([('assembled extended roof / house',house),('today / same native pixels',Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA'))],'modular-roof-house',(1,4))
    pair(roofs,'cap-fill-joins',(1,4));pair(maps,'cap-fill-contact-guides',(1,4))
    (R/'r17-C5-roof-assembly.json').write_text(json.dumps(dict(sources='1 amber: left fill; 2 blue: ridge; 3 rust: right fill; 4 green: drawn end transitions and outer verge',assemblies=logs),indent=2))

def southern_ground_plan(city):
    """Final district itself, not the separate L/T acceptance sample."""
    l=c.c5_city_layout();box=(96,1008,768,1392);ox,oy=box[:2]
    lots=[b for b in l['lots'] if b['id'].startswith('south-L') or b['id']=='south-square-west']
    plan=Image.new('RGBA',(672,384),(48,51,45,255));d=ImageDraw.Draw(plan)
    def rect(r,**kw):
        x,y,w,h=r;d.rectangle((x-ox,y-oy,x+w-ox-1,y+h-oy-1),**kw)
    for road in l['roads']:
        if road['clear']:rect(road['rect'],fill='#76766a',outline='#b8b8aa')
    for p in l['plots']:rect(p['yard'],fill='#696747',outline='#b9b47b')
    labels={'south-L-return':'R','south-square-west':'S'}
    for b in lots:
        tag=labels.get(b['id'],b['id'].removeprefix('south-'));x,y,w,h=b['footprint']
        rect(b['footprint'],fill='#394e57',outline='#6fd4dc');d.text((x-ox+3,y-oy+4),tag,fill='white')
        if b.get('incorporated_lots'):d.text((x-ox+3,y-oy+20),'shop',fill='#ffe29b')
    edges=[]
    for i,a in enumerate(lots):
        for b in lots[i+1:]:
            for e in c.shared_ground_edges(a,b):
                x,y,u,v=e['segment'];d.line((x-ox,y-oy,u-ox,v-oy),fill='#ffdb42',width=2)
                d.text(((x+u)//2-ox+3,(y+v)//2-oy),str(e['length'])+'px',fill='#ffdb42')
                edges.append(dict(a=a['id'],b=b['id'],**e))
    d.text((8,8),'FINAL SOUTH / cyan lots / gold shared walls / grey public routes',fill='white')
    d.text((8,26),'L2 includes former detached workshop. R joins L3 along 48px.',fill='white')
    pair([('actual final district / native',city.crop(box)),('ground plan / same coordinates',plan)],'southern-ground-plan',(1,4))
    save(city.crop(box),'southern-frontage',(1,3,4))
    # Measured contact crops at the two formerly point-only joins.
    for n,area in [('west',(312,1200,360,1320)),('east',(552,1152,600,1272))]:save(city.crop(area),'southern-'+n+'-contact',(1,4,8))
    (R/'r17-C5-southern-connectivity.json').write_text(json.dumps(dict(crop=list(box),lots=[dict(id=b['id'],footprint=b['footprint'],incorporated_lots=b.get('incorporated_lots',[])) for b in lots],edges=edges,rule='Positive shared ground edge >=48px. Corner-only contacts do not join a frontage.'),indent=2))

def assembly(items,name):
    """Native construction proof, with one shared-outline owner at each contact."""
    proof={'lots':[]};xx=0
    for j,q in enumerate(items):proof['lots'].append(dict(id='join-'+str(j),x=xx,base=480,spec=q));xx+=q['width']*48
    c.c5_contacts(proof)
    width=sum(q['width']*48 for q in items);h=max(c.c5_build(q)[0].height for q in items);a=c.repeat(c.asset('cobble-c3'),(width+96,h+96));x=48;prior=None
    for s in items:
        b,_=c.c5_build(s);b=b.copy()
        if prior:
            y0=max(0,b.height-prior.height)
            for y in range(y0,b.height):
                p=prior.getpixel((prior.width-1,y-b.height+prior.height));q=b.getpixel((0,y))
                if p[3] and q[3] and sum(p[:3])<310 and sum(q[:3])<310:b.putpixel((0,y),b.getpixel((1,y)))
        a.alpha_composite(b,(x,h+24-b.height));x+=b.width;prior=b
    save(a,name,(1,3));return a

def scenes():
    city=Image.open(R/'r17-city-final.png').convert('RGBA')
    southern_ground_plan(city)
    for n,box in {'square':(672,624,1392,1248),'street':(96,240,720,816),'gate':(1104,768,1776,1440),'northeast-properties':(1056,240,1776,816),'northwest-properties':(144,288,432,768),'craft-court':(144,768,480,1056),'wall-stair':(768,48,1152,288)}.items():
        a=city.crop(box);save(a,n,(1,3));save(a.convert('L'),n+'-squint',(1,));compare(a,n)
    save(city.crop((144,768,528,1152)),'corner-context',(1,4))
    for n,l in c.e_layouts().items():
        a,_=c.c_render(l);save(a,'retained-'+n,(1,3));compare(a,'retained-'+n)
    for side,counts in [('left',[5,1]),('right',[1,5])]:
        specs=[c.c5_spec(2,n,j) for j,n in enumerate(counts)]
        for q in specs:
            if q['floors']==1:q['roof_file']='roof-gable-d2-c5-w2'
        a=assembly(specs,'tall-low-'+side);compare(a,'tall-low-'+side)
    for w1,w2 in itertools.product((1,2,3),repeat=2):
        a=c.c5_spec(w1,3,w1);b=c.c5_spec(w2,2,w2+1);a['returns']=['right'];b['returns']=['left'];assembly([a,b],f'neighbours-w{w1}-w{w2}')
        for hand,heights in [('left',(5,1)),('right',(1,5))]:
            assembly([c.c5_spec(w1,heights[0],w1),c.c5_spec(w2,heights[1],w2+1)],f'critic2-widths-w{w1}-w{w2}-high-{hand}')
    wing=c.c5_spec(2,2,2);wing['complete_file']='house-rear-wing-c5r2';assembly([c.c5_spec(2,3,0),c.c5_spec(3,1,1),wing],'seven-cell-gable-hip-wing')
    # Complete contact run uses the same wall/tower precedence as the city.
    proof=c.c5_city_layout();proof['lots']=[];proof['props']=[p for p in proof['props'] if p.get('wall')];a,_,_=c.c5_render(proof)
    save(a.crop((720,0,1152,288)),'curtain-stair-tower',(1,3));save(a.crop((0,0,192,384)),'outer-turn',(1,3));save(a.crop((1056,1152,1440,1440)),'gate-wall-connectors',(1,3))
    l=acceptance_layout();a,_,_=c.c5_render(l);save(a,'L-T-dead-end',(1,3));compare(a,'L-T-dead-end')
    marked=a.copy();d=ImageDraw.Draw(marked)
    for b in l['lots']:
        for rect in [b['footprint']]+([b['rear_wing_footprint']] if b.get('rear_wing_footprint') else []):
            x,y,w,h=rect;d.rectangle((x,y,x+w-1,y+h-1),outline='#4dddda')
    for p in l['plots']:
        x,y,w,h=p['yard'];d.rectangle((x,y,x+w-1,y+h-1),outline='#ffe533')
    d.text((48,552),'cyan: principal / attached rear footprint; yellow: one-cell yard',fill='black')
    save(marked,'L-T-ground-footprints',(1,3))
    (R/'r17-C5-L-T-layout.json').write_text(json.dumps(l,indent=2))

def acceptance_layout():
    l=dict(size=[768,576],lots=[],props=[],roads=[],plots=[],courts=[],square=[0,0,0,0],square_notch=[0,0,0,0])
    for j,(x,base,w,n) in enumerate([(48,240,2,2),(144,240,1,2),(192,240,2,2),(288,240,1,2),(336,240,2,2),(480,288,2,2),(576,288,2,2),(48,528,2,3),(144,528,2,3),(240,528,2,2)]):
        s=c.c5_spec(w,n,j)
        if w==2:s['roof_file']={0:'roof-hip-cross-c5-w2',2:'roof-gable-d2-c5-w2',4:'roof-cross-c5-w2'}.get(j,'roof-hip-d2-c5-w2')
        l['lots'].append(dict(id='proof-'+str(j),x=x,base=base,spec=s,footprint=[x,base-96,w*48,96],entrance=[x+24,base]))
    wing=l['lots'][-1];wing['spec']['complete_file']='house-rear-wing-c5r2'
    wing.update(id='proof-connected-rear-wing',entrance=[288,528],rear_wing_footprint=[288,384,48,48],foreground_mask=[0,0,96,192])
    l['plots']=[dict(id='connected-wing-property',principal=wing['id'],front=wing['footprint'],rear=[288,384,48,48],yard=[240,384,48,48])]
    # The house now TOUCHES the preceding frontage at x240, and its painted
    # rear roof/valley is integral to the same property, not a detached return.
    for rect in [[48,240,384,48],[432,48,48,480],[480,288,192,48],[48,528,624,48],[336,288,96,48],[336,480,96,48]]:l['roads'].append(dict(rect=rect,kind='side',file='street-side-c3',id='L-T-dead-end',horizontal=rect[2]>rect[3],clear=True))
    l['courts']=[dict(id='rear-wing-court',rect=[336,336,96,144],access=[384,480,48,48])]
    l['props']=[dict(file='fence-0',x=336,base=360,id='dead-end-court-gate'),dict(file='yard-0',x=336,base=408,id='dead-end-well')]
    return c.c5_contacts(l)


def annotations():
    l=c.c5_city_layout();im=Image.open(R/'r17-city-final.png').convert('RGBA');d=ImageDraw.Draw(im)
    for b in l['lots']+l['props']:
        if b.get('footprint'):
            x,y,w,h=b['footprint'];d.rectangle((x,y,x+w-1,y+h-1),outline='#4dddda')
        if b.get('entrance'):
            x,y=b['entrance'];d.rectangle((x-2,y-2,x+2,y+2),fill='#ffe533')
        if 'spec' in b:d.text((b['x']+2,b['base']-14),str(b['spec']['floors']),fill='white')
        for x,y,w,h in b.get('supports',[]):d.rectangle((x,y,x+w-1,y+h-1),outline='#ff5544')
    for r in l['roads']:
        if r.get('clear'):
            x,y,w,h=r['rect'];d.rectangle((x,y,x+w-1,y+h-1),outline='#fff8dc')
    d.text((96,246),'C5 / cyan ground footprints / yellow entries / white routes / red supports / digits storeys',fill='black');save(im,'anchors-and-routes',(1,))
    pilot=copy.deepcopy(l)
    pilot['props'].append(dict(file='person-porter-c4',x=446,base=570,id='pilot-lane-walker',role='passing proof actor'))
    pv,_,_=c.c5_render(pilot);pv=pv.crop((240,288,624,672));d=ImageDraw.Draw(pv)
    for b in pilot['lots']:
        if b['x']<240 or b['x']>=624 or b['base']>672:continue
        x,y,w,h=b['footprint'];d.rectangle((x-240,y-288,x+w-241,y+h-289),outline='#4dddda')
        if b.get('entrance'):x,y=b['entrance'];d.rectangle((x-242,y-290,x-238,y-286),outline='#ffe533')
    d.text((4,4),'C5 corner / court / two lane entries / passing person',fill='white');save(pv,'corner-pilot',(1,4))
    rear=copy.deepcopy(l)
    for b in rear['lots']:
        if b['x']<672 and b['base']<=720:
            a,_=c.c5_build(b['spec']);b['foreground_mask']=[0,0,a.width,a.height-48]
    nr,_,_=c.c5_render(rear);rr,_,_=c.c5_render(rear,True)
    pair([('normal',nr.crop((144,288,672,768))),('upper paint removed / legal yards',rr.crop((144,288,672,768)))],'property-ground-reveal',(1,3))
    proof=copy.deepcopy(l)
    for x,b,role in [(1240,1410,'under gate'),(1220,950,'behind inn roof'),(934,798,'under stall canopy'),(1324,1090,'inn threshold'),(690,997,'church east door'),(728,1000,'church approach')]:proof['props'].append(dict(file='person-porter-c4',x=x,base=b,id='proof-'+role,role=role))
    for b in proof['lots']:
        if b['id']=='inn-square-wing':b['foreground_mask']=[0,0,96,192]
    normal,_,_=c.c5_render(proof);reveal,_,_=c.c5_render(proof,True)
    for n,box in [('gate',(1152,1248,1392,1440)),('inn',(1200,864,1488,1152)),('stall',(900,744,1072,936)),('church',(624,912,816,1056))]:pair([('normal',normal.crop(box)),('reveal / supports retained',reveal.crop(box))],n+'-actor-proof',(1,3))
    (R/'r17-C5-actor-proof-layout.json').write_text(json.dumps(proof,indent=2))
    # Actors use the painted diagonal landings, including a reveal for the
    # portion that passes under its own wall/roof. Direction is in the art.
    for ident in ['west-lane-workshop','west-2','north-middle-0','middle-side-workshop','east-lane-workshop','merchant-2']:
        p=copy.deepcopy(l);b=next(b for b in p['lots'] if b['id']==ident);x,y=b['entrance'];east=b['entrance_direction']=='E'
        p['props'].append(dict(file='person-porter-c4',x=x+3 if east else x-22,base=y,id='approach-person',role='approaching painted side landing'))
        p['props'].append(dict(file='person-porter-c4',x=b['x']+(58 if east else 22),base=b['base']-20,id='entry-person',role='entering at actual diagonal threshold'))
        b['foreground_mask']=[48,112,84,178] if east else [16,112,46,178]
        nr,_,_=c.c5_render(p);rr,_,_=c.c5_render(p,True);box=(b['x']-40,b['base']-112,b['x']+136,b['base']+32)
        pair([('normal: '+ident,nr.crop(box)),('reveal: painted landing',rr.crop(box))],'side-entry-'+ident,(1,3))

def index():
    names=sorted(p.name for p in R.glob('r17-C5-*.png') if not any(t in p.name for t in ('source-','registered-','mode-','clean-','before-')))
    html='<!doctype html><meta charset="utf-8"><title>Round17 Part C5 — critic3 redraw</title><style>body{background:#272b25;color:#ddd;font:16px sans-serif}a{color:#bcdcbc}img{max-width:100%;image-rendering:pixelated}</style><h1>Round17 Part C5 — critic3 redraw</h1><p>Native48px grid. Saved-art inspection; no runtime collision/pathfinding claim.</p><p><a href="r17-city-final.png">Final1x</a> · <a href="r17-city-final-2x.png">Final2x</a> · <a href="r17-city-final-squint.png">Greyscale</a> · <a href="r17-city-final-vs-r15-vs-today.png">Today / R15 / C5</a> · <a href="r17-C5-critic3-response.json">Critic repair</a> · <a href="r17-C5-verification.json">General QC</a> · <a href="r17-C5-critic3-verification.json">Focused QC</a></p><p><a href="r17-C5-southern-ground-plan-1x.png">Actual southern ground contacts</a> · <a href="r17-C5-cap-fill-joins-1x.png">Assembled cap/fill/ridge/end roofs</a> · <a href="r17-C5-roof-assembly.json">Roof paint provenance</a></p><img src="r17-city-final.png"><ul>'
    html+=''.join(f'<li><a href="{n}">{n}</a></li>' for n in names)+'</ul>'; (R/'r17-C5-review.html').write_text(html)
if __name__=='__main__':pieces();scenes();annotations();index();print('C5 sheets complete')
